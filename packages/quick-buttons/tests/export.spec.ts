import { describe, expect, it } from 'vitest'
import * as plugin from '../src/index.js'

describe('导出形状（Loader 安全）', () => {
  it('导出命名 Cordis 插件字段且无 default 导出', () => {
    expect('default' in plugin).toBe(false)
    expect(plugin.name).toBe('dsh-quick-buttons')
    expect(typeof plugin.apply).toBe('function')
    expect(plugin.Config).toBeDefined()
  })
})
