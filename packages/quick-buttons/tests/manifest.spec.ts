import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { name } from '../src/index.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('bundle 清单', () => {
  it('为双半区插件声明 dsh.bundle 与 dsh.client', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      name: string
      exports?: Record<string, unknown>
      dsh?: {
        bundle?: { patch?: string }
        client?: { platform?: string; inject?: string[] }
      }
    }
    const patch = readFileSync(join(root, 'cordis.patch.yml'), 'utf8')

    expect(pkg.name).toBe(name)
    expect(pkg.dsh?.bundle?.patch).toBe('./cordis.patch.yml')
    expect(pkg.dsh?.client?.platform).toBe('web')
    expect(pkg.dsh?.client?.inject).toContain('@deepseek-ai/dsh-client-ui-conversation')
    expect(pkg.dsh?.client?.inject).toContain('@deepseek-ai/dsh-client-ui-settings')
    expect(pkg.exports?.['./client']).toBeDefined()
    expect(patch).toMatch(/id:\s*quick-buttons/)
    expect(patch).toContain(`name: ${name}`)
  })
})
