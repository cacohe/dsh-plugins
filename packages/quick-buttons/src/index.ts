import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'

/** Cordis 插件名。须与 package.json、cordis.patch.yml 的 `name` 保持一致。 */
export const name = 'dsh-quick-buttons'

export interface Config {
  /**
   * 预设按钮的默认点击行为。
   * - `insert`：写入输入框草稿（发送前可再编辑）
   * - `send`：立即作为用户消息入队发送
   *
   * Web 端仍可按次覆盖：普通点击用此默认值；Alt+点击在插入/发送间切换。
   */
  clickAction: 'insert' | 'send'
}

export const Config: Schema<Config> = Schema.object({
  clickAction: Schema.union([
    Schema.const('insert'),
    Schema.const('send'),
  ]).default('insert'),
})

/**
 * 宿主半区刻意保持精简：功能在浏览器半区（`./client`）。
 * Config 供 patch 覆盖与后续扩展使用。
 */
export function apply(_ctx: Context, config: Config): void {
  console.log(`[dsh-quick-buttons] loaded (clickAction="${config.clickAction}")`)
}
