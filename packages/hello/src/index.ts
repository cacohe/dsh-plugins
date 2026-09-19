import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

/** Cordis 插件名。须与 package.json、cordis.patch.yml 的 `name` 保持一致。 */
export const name = 'dsh-hello-plugin'

/** 等待 Harness 工具注册表就绪后再注册 `greet`。 */
export const inject = ['tools']

export interface Config {
  /** 问候语前缀，例如 "Hello, Ada!"。 */
  greeting: string
}

export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('Hello'),
})

export function apply(ctx: Context, config: Config): void {
  console.log(`[dsh-hello-plugin] loaded (greeting="${config.greeting}")`)

  ctx.tools.register(defineTool({
    name: 'greet',
    description: '按名字向某人打招呼。',
    parameters: {
      name: {
        type: 'string',
        required: true,
        description: '要问候的名字',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return `${config.greeting}, ${args.name}!`
    },
  }))
}
