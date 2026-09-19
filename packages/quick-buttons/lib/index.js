import Schema from "@deepseek-ai/schemastery";
//#region src/index.ts
/** Cordis 插件名。须与 package.json、cordis.patch.yml 的 `name` 保持一致。 */
const name = "dsh-quick-buttons";
const Config = Schema.object({ clickAction: Schema.union([Schema.const("insert"), Schema.const("send")]).default("insert") });
/**
* 宿主半区刻意保持精简：功能在浏览器半区（`./client`）。
* Config 供 patch 覆盖与后续扩展使用。
*/
function apply(_ctx, config) {
	console.log(`[dsh-quick-buttons] loaded (clickAction="${config.clickAction}")`);
}
//#endregion
export { Config, apply, name };

//# sourceMappingURL=index.js.map