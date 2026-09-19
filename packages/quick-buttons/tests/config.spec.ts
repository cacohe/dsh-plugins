import { describe, expect, it } from 'vitest'
import { Config } from '../src/index.js'

describe('Config 模式', () => {
  it('clickAction 默认为 insert', () => {
    expect(Config({})).toEqual({ clickAction: 'insert' })
  })

  it('接受 send', () => {
    expect(Config({ clickAction: 'send' })).toEqual({ clickAction: 'send' })
  })
})
