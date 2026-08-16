import Schema from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
//#region src/index.ts
/** Cordis plugin name. Keep in sync with package.json and cordis.patch.yml. */
const name = "dsh-plugin";
/** Wait for the Harness tool registry before registering `greet`. */
const inject = ["tools"];
const Config = Schema.object({ greeting: Schema.string().default("Hello") });
function apply(ctx, config) {
	console.log(`[dsh-plugin] loaded (greeting="${config.greeting}")`);
	ctx.tools.register(defineTool({
		name: "greet",
		description: "Greet someone by name.",
		parameters: { name: {
			type: "string",
			required: true,
			description: "The name to greet"
		} },
		output: {
			schema: { type: "string" },
			render: (_args, value) => [{
				type: "text",
				text: value
			}]
		},
		async execute(args) {
			return `${config.greeting}, ${args.name}!`;
		}
	}));
}
//#endregion
export { Config, apply, inject, name };

//# sourceMappingURL=index.js.map