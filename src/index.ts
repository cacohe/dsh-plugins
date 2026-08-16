import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

/** Cordis plugin name. Keep in sync with package.json and cordis.patch.yml. */
export const name = 'dsh-plugin'

/** Wait for the Harness tool registry before registering `greet`. */
export const inject = ['tools']

export interface Config {
  /** Prefix used by the greet tool, e.g. "Hello, Ada!". */
  greeting: string
}

export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('Hello'),
})

export function apply(ctx: Context, config: Config): void {
  console.log(`[dsh-plugin] loaded (greeting="${config.greeting}")`)

  ctx.tools.register(defineTool({
    name: 'greet',
    description: 'Greet someone by name.',
    parameters: {
      name: {
        type: 'string',
        required: true,
        description: 'The name to greet',
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
