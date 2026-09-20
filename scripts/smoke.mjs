/**
 * 打包冒烟：验证各插件 tarball 可安装、清单正确，并对 hello 走真实 apply/execute。
 *
 * 用法：在仓库根目录 `pnpm run smoke`（会先 build）。
 */
import { mkdtempSync, rmSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function run(cmd, args, cwd) {
  const result = process.platform === 'win32'
    ? spawnSync(`${cmd} ${args.join(' ')}`, { cwd, encoding: 'utf8', shell: true })
    : spawnSync(cmd, args, { cwd, encoding: 'utf8' })
  if (result.status !== 0) {
    console.error(result.stdout)
    console.error(result.stderr)
    throw new Error(`${cmd} ${args.join(' ')} failed in ${cwd}`)
  }
  return result
}

function packPackage(pkgDir) {
  const result = run('pnpm', ['pack', '--pack-destination', root], pkgDir)
  const line = (result.stdout || '').trim().split(/\r?\n/).filter(Boolean).at(-1)
  const tgzName = line && line.endsWith('.tgz') ? path.basename(line) : null
  if (!tgzName) {
    // pnpm pack prints the filename; fall back to package.json name-version
    const pkg = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
    const name = pkg.name.startsWith('@')
      ? pkg.name.slice(1).replace('/', '-')
      : pkg.name
    return path.join(root, `${name}-${pkg.version}.tgz`)
  }
  return path.join(root, tgzName)
}

async function smokeHello(tgz) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsh-smoke-hello-'))
  try {
    writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
      name: 'dsh-smoke-hello-host',
      private: true,
      type: 'module',
      dependencies: {
        '@deepseek-ai/cordis': '^4.0.1',
        '@deepseek-ai/dsh-tools': '^0.1.0-rc.6',
        '@deepseek-ai/schemastery': '^3.18.1',
        'dsh-hello-plugin': `file:${tgz.replaceAll('\\', '/')}`,
      },
    }, null, 2))

    console.log('[smoke:hello] 安装打包产物…')
    run('pnpm', ['install'], dir)

    const entry = path.join(dir, 'node_modules', 'dsh-hello-plugin', 'lib', 'index.js')
    if (!existsSync(entry)) throw new Error('缺少 lib/index.js')

    const plugin = await import(pathToFileURL(entry).href)
    if ('default' in plugin) throw new Error('不应有 default 导出')
    if (plugin.name !== 'dsh-hello-plugin') throw new Error(`name 不符: ${plugin.name}`)
    if (!Array.isArray(plugin.inject) || !plugin.inject.includes('tools')) {
      throw new Error('inject 应包含 tools')
    }

    const registered = []
    const ctx = {
      tools: {
        register(tool) {
          registered.push(tool)
          return () => {}
        },
      },
    }

    plugin.apply(ctx, { greeting: '你好' })
    const tool = registered.find(t => t.name === 'greet')
    if (!tool) throw new Error('未注册 greet')

    const result = await tool.execute({ name: 'Ada' }, { signal: new AbortController().signal })
    if (result !== '你好, Ada!') throw new Error(`执行结果不符: ${JSON.stringify(result)}`)

    const blocks = tool.output.render({ name: 'Ada' }, result)
    const text = blocks.map(b => b.text ?? '').join('')
    if (!text.includes('你好, Ada!')) throw new Error(`render 不符: ${text}`)

    console.log('[smoke:hello] PASS — 打包产物可加载，greet 可执行')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

async function smokeQuickButtons(tgz) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsh-smoke-qb-'))
  try {
    writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
      name: 'dsh-smoke-qb-host',
      private: true,
      type: 'module',
      dependencies: {
        '@deepseek-ai/cordis': '^4.0.1',
        '@deepseek-ai/schemastery': '^3.18.1',
        '@deepseek-ai/dsh-settings': '^0.1.1-rc.2',
        'dsh-quick-buttons': `file:${tgz.replaceAll('\\', '/')}`,
      },
    }, null, 2))

    console.log('[smoke:quick-buttons] 安装打包产物…')
    run('pnpm', ['install'], dir)

    const pkgJson = JSON.parse(readFileSync(
      path.join(dir, 'node_modules', 'dsh-quick-buttons', 'package.json'),
      'utf8',
    ))
    if (!pkgJson.dsh?.bundle?.patch) throw new Error('缺少 dsh.bundle.patch')
    if (pkgJson.dsh?.client?.platform !== 'web') throw new Error('缺少 dsh.client.platform=web')
    if (!existsSync(path.join(dir, 'node_modules', 'dsh-quick-buttons', 'lib', 'index.js'))) {
      throw new Error('缺少 lib/index.js')
    }
    if (!existsSync(path.join(dir, 'node_modules', 'dsh-quick-buttons', 'lib', 'client.js'))) {
      throw new Error('缺少 lib/client.js')
    }

    const plugin = await import(pathToFileURL(
      path.join(dir, 'node_modules', 'dsh-quick-buttons', 'lib', 'index.js'),
    ).href)
    if ('default' in plugin) throw new Error('不应有 default 导出')
    if (plugin.name !== 'dsh-quick-buttons') throw new Error(`name 不符: ${plugin.name}`)
    if (plugin.Config({}).clickAction !== 'insert') throw new Error('Config 默认值不符')
    if (plugin.QUICK_BUTTONS_SETTINGS_NAMESPACE !== 'quick-buttons') {
      throw new Error('settings 命名空间不符')
    }

    // 无 settings 服务时 inject 回调不执行，apply 仍应安全返回
    plugin.apply({
      inject() {},
    }, { clickAction: 'send' })

    console.log('[smoke:quick-buttons] PASS — bundle/client 清单与入口齐全')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

const helloDir = path.join(root, 'packages', 'hello')
const qbDir = path.join(root, 'packages', 'quick-buttons')

console.log('[smoke] 构建工作区…')
run('pnpm', ['run', 'build'], root)

console.log('[smoke] 打包 hello…')
const helloTgz = packPackage(helloDir)
console.log('[smoke] 打包 quick-buttons…')
const qbTgz = packPackage(qbDir)

try {
  await smokeHello(helloTgz)
  await smokeQuickButtons(qbTgz)
  console.log('[smoke] 全部通过')
} finally {
  for (const tgz of [helloTgz, qbTgz]) {
    if (existsSync(tgz)) rmSync(tgz, { force: true })
  }
}
