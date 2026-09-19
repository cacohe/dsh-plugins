import Schema from "@deepseek-ai/schemastery";
import { Context } from "@deepseek-ai/cordis";
//#region src/index.d.ts
/** Cordis 插件名。须与 package.json、cordis.patch.yml 的 `name` 保持一致。 */
declare const name = "dsh-hello-plugin";
/** 等待 Harness 工具注册表就绪后再注册 `greet`。 */
declare const inject: string[];
interface Config {
  /** 问候语前缀，例如 "Hello, Ada!"。 */
  greeting: string;
}
declare const Config: Schema<Config>;
declare function apply(ctx: Context, config: Config): void;
//#endregion
export { Config, apply, inject, name };
//# sourceMappingURL=index.d.ts.map