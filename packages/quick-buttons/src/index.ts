import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings'
import { QUICK_BUTTONS_SETTINGS_NAMESPACE } from './shared.js'
import type { Config as ConfigShape } from './shared.js'

export { QUICK_BUTTONS_SETTINGS_NAMESPACE }
export type { Config as QuickButtonsConfig } from './shared.js'

/** Cordis 插件名。须与 package.json、cordis.patch.yml 的 `name` 保持一致。 */
export const name = 'dsh-quick-buttons'

export const Config: Schema<ConfigShape> = Schema.object({
  clickAction: Schema.union([
    Schema.const('insert'),
    Schema.const('send'),
  ]).default('insert'),
})

/**
 * 宿主半区：把 patch/Config 写入 settings，供浏览器半区读取。
 * UI 逻辑在 `./client`。
 */
export function apply(ctx: Context, config: ConfigShape): void {
  const ns = settingsNamespace(QUICK_BUTTONS_SETTINGS_NAMESPACE)
  installSettingsSection(ctx, ns, Config, { clickAction: config.clickAction }, {
    setSource: () => {},
    onChange: () => {},
  })
  console.log(`[dsh-quick-buttons] loaded (clickAction="${config.clickAction}")`)
}
