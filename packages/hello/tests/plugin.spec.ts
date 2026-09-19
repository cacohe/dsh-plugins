import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import { ToolRuntime } from '@deepseek-ai/dsh-tools'
import { CallId } from '@deepseek-ai/dsh-llm'
import * as hello from '../src/index.js'

async function harness(): Promise<Context> {
  const ctx = new Context()
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  return ctx
}

describe('dsh-hello-plugin', () => {
  it('应用 Config 默认值', () => {
    expect(hello.Config({})).toEqual({ greeting: 'Hello' })
    expect(hello.Config({ greeting: '你好' })).toEqual({ greeting: '你好' })
  })

  it('注册 greet 并返回配置的问候语', async () => {
    const ctx = await harness()
    const fiber = await ctx.plugin(hello, { greeting: 'Hola' })

    const tools = ctx.tools as ToolRuntime
    expect(tools.get('greet')?.name).toBe('greet')

    const result = await tools.execute({
      callId: CallId('hello-greet'),
      name: 'greet',
      arguments: { name: 'Ada' },
      signal: new AbortController().signal,
    })

    expect(result.isError).toBe(false)
    if (result.isError) throw new Error('期望得到 greet 返回值')
    expect(result.value).toBe('Hola, Ada!')

    await fiber.dispose()
    await ctx.fiber.dispose()
  })

  it('缺少必填参数时由工具 schema 拒绝', async () => {
    const ctx = await harness()
    const fiber = await ctx.plugin(hello)

    const tools = ctx.tools as ToolRuntime
    const result = await tools.execute({
      callId: CallId('hello-invalid'),
      name: 'greet',
      arguments: {},
      signal: new AbortController().signal,
    })

    expect(result.isError).toBe(true)

    await fiber.dispose()
    await ctx.fiber.dispose()
  })

  it('插件 fiber dispose 后注销 greet（HMR 安全）', async () => {
    const ctx = await harness()
    const fiber = await ctx.plugin(hello)

    const tools = ctx.tools as ToolRuntime
    expect(tools.get('greet')).toBeDefined()

    await fiber.dispose()
    expect(tools.get('greet')).toBeUndefined()

    await ctx.fiber.dispose()
  })
})
