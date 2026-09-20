import Schema from "@deepseek-ai/schemastery";
import { Context } from "@deepseek-ai/cordis";
//#region src/shared.d.ts
/** 宿主与浏览器半区共用的配置形状（勿在此文件 import 宿主专用包）。 */
/**
 * 设置命名空间字符串。宿主用 `settingsNamespace(...)` 注册，
 * 浏览器用 `settingsScope.bind({ namespace })` 读取。
 */
declare const QUICK_BUTTONS_SETTINGS_NAMESPACE = "quick-buttons";
interface Config$1 {
  /**
   * 预设按钮的默认点击行为。
   * - `insert`：写入输入框草稿（发送前可再编辑）
   * - `send`：立即作为用户消息入队发送
   */
  clickAction: 'insert' | 'send';
}
//#endregion
//#region src/index.d.ts
/** Cordis 插件名。须与 package.json、cordis.patch.yml 的 `name` 保持一致。 */
declare const name = "dsh-quick-buttons";
declare const Config: Schema<Config$1>;
/**
 * 宿主半区：把 patch/Config 写入 settings，供浏览器半区读取。
 * UI 逻辑在 `./client`。
 */
declare function apply(ctx: Context, config: Config$1): void;
//#endregion
export { Config, QUICK_BUTTONS_SETTINGS_NAMESPACE, type Config$1 as QuickButtonsConfig, apply, name };
//# sourceMappingURL=index.d.ts.map