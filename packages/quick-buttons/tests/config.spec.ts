import { describe, expect, it } from 'vitest'
import { Config, QUICK_BUTTONS_SETTINGS_NAMESPACE } from '../src/index.js'

describe('Config 与 settings', () => {
  it('clickAction 默认为 insert', () => {
    expect(Config({})).toEqual({ clickAction: 'insert' })
  })

  it('接受 send', () => {
    expect(Config({ clickAction: 'send' })).toEqual({ clickAction: 'send' })
  })

  it('settings 命名空间稳定为 quick-buttons', () => {
    expect(QUICK_BUTTONS_SETTINGS_NAMESPACE).toBe('quick-buttons')
  })
})
