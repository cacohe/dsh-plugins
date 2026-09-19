import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { name } from '../src/index.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('bundle 清单', () => {
  it('包名、Cordis name 与 patch name 保持一致', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      name: string
      dsh?: { bundle?: { patch?: string } }
    }
    const patch = readFileSync(join(root, 'cordis.patch.yml'), 'utf8')

    expect(pkg.name).toBe(name)
    expect(pkg.dsh?.bundle?.patch).toBe('./cordis.patch.yml')
    expect(patch).toMatch(/id:\s*hello/)
    expect(patch).toContain(`name: ${name}`)
  })
})
