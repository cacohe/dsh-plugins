import Schema from "@deepseek-ai/schemastery";
import { Context } from "@deepseek-ai/cordis";
//#region src/index.d.ts
/** Cordis plugin name. Keep in sync with package.json and cordis.patch.yml. */
declare const name = "dsh-plugin";
/** Wait for the Harness tool registry before registering `greet`. */
declare const inject: string[];
interface Config {
  /** Prefix used by the greet tool, e.g. "Hello, Ada!". */
  greeting: string;
}
declare const Config: Schema<Config>;
declare function apply(ctx: Context, config: Config): void;
//#endregion
export { Config, apply, inject, name };
//# sourceMappingURL=index.d.ts.map