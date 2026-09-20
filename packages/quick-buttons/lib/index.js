import Schema from "@deepseek-ai/schemastery";
import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";
//#region src/shared.ts
/** 宿主与浏览器半区共用的配置形状（勿在此文件 import 宿主专用包）。 */
/**
* 设置命名空间字符串。宿主用 `settingsNamespace(...)` 注册，
* 浏览器用 `settingsScope.bind({ namespace })` 读取。
*/
const QUICK_BUTTONS_SETTINGS_NAMESPACE = "quick-buttons";
//#endregion
//#region src/index.ts
/** Cordis 插件名。须与 package.json、cordis.patch.yml 的 `name` 保持一致。 */
const name = "dsh-quick-buttons";
const Config = Schema.object({ clickAction: Schema.union([Schema.const("insert"), Schema.const("send")]).default("insert") });
/**
* 宿主半区：把 patch/Config 写入 settings，供浏览器半区读取。
* UI 逻辑在 `./client`。
*/
function apply(ctx, config) {
	const ns = settingsNamespace(QUICK_BUTTONS_SETTINGS_NAMESPACE);
	installSettingsSection(ctx, ns, Config, { clickAction: config.clickAction }, {
		setSource: () => {},
		onChange: () => {}
	});
	console.log(`[dsh-quick-buttons] loaded (clickAction="${config.clickAction}")`);
}
//#endregion
export { Config, QUICK_BUTTONS_SETTINGS_NAMESPACE, apply, name };

//# sourceMappingURL=index.js.map