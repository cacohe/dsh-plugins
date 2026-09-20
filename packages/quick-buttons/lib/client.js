window.__ModuleLoader__.load({
	id: "dsh-quick-buttons",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/buttons.ts
		const STORAGE_KEY = "dsh-quick-buttons:v1";
		/** 内置默认按钮（常见中文对话快捷语）。 */
		const DEFAULT_BUTTONS = [
			{
				id: "continue",
				label: "继续",
				text: "继续"
			},
			{
				id: "plain",
				label: "说人话",
				text: "说人话，用更直白、少术语的方式解释。"
			},
			{
				id: "summarize",
				label: "总结",
				text: "请用条目总结上面的结论，并给出下一步建议。"
			},
			{
				id: "review",
				label: "审查",
				text: "请审查当前改动：正确性、边界条件、错误处理与可维护性；先给结论再列问题。"
			}
		];
		function loadButtons() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw === null) return DEFAULT_BUTTONS.map(cloneButton);
				const parsed = JSON.parse(raw);
				if (!Array.isArray(parsed)) return DEFAULT_BUTTONS.map(cloneButton);
				return parsed.filter(isButton).slice(0, 12).map(cloneButton);
			} catch {
				return DEFAULT_BUTTONS.map(cloneButton);
			}
		}
		function saveButtons(buttons) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(buttons));
			} catch {}
		}
		function isButton(value) {
			if (typeof value !== "object" || value === null) return false;
			const row = value;
			return typeof row.id === "string" && typeof row.label === "string" && typeof row.text === "string" && row.label.trim() !== "" && row.text.trim() !== "";
		}
		function cloneButton(button) {
			return {
				id: button.id,
				label: button.label,
				text: button.text
			};
		}
		function newButtonId() {
			return `btn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
		}
		//#endregion
		//#region src/client/styles.ts
		const STYLE_ID = "dsh-quick-buttons/dock.css";
		const CSS = `
.dshqb-row{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:6px;
  width:100%;
  padding:2px 0 6px;
  min-height:28px;
  box-sizing:border-box;
}
.dshqb-chip{
  position:relative;
  display:inline-flex;
  align-items:stretch;
  max-width:100%;
}
.dshqb-main{
  height:26px;
  max-width:220px;
  padding:0 10px;
  border-radius:8px 0 0 8px;
  border:1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.35));
  border-right:none;
  background:var(--dsw-alias-bg-module-platform, transparent);
  color:var(--dsw-alias-label-primary, inherit);
  font-size:12px;
  font-weight:500;
  line-height:1;
  cursor:pointer;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  transition:background .12s ease,border-color .12s ease;
}
.dshqb-main:hover{
  background:var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.08));
}
.dshqb-main:disabled,.dshqb-send:disabled,.dshqb-add:disabled{
  opacity:.45;
  cursor:not-allowed;
}
.dshqb-send{
  height:26px;
  width:26px;
  padding:0;
  border-radius:0 8px 8px 0;
  border:1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.35));
  background:var(--dsw-alias-bg-module-platform, transparent);
  color:var(--dsw-alias-label-secondary, #888);
  display:inline-flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition:background .12s ease,color .12s ease;
}
.dshqb-send:hover{
  background:var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.08));
  color:var(--dsw-alias-brand-primary, #4d6bfe);
}
.dshqb-del{
  position:absolute;
  top:-7px;
  right:-7px;
  z-index:2;
  width:14px;
  height:14px;
  padding:0;
  border-radius:50%;
  border:1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.35));
  background:var(--dsw-alias-bg-layer-2, #fff);
  color:var(--dsw-alias-label-secondary, #666);
  font-size:10px;
  line-height:1;
  cursor:pointer;
  display:none;
  align-items:center;
  justify-content:center;
  box-shadow:0 1px 2px rgba(0,0,0,.12);
}
.dshqb-chip:hover .dshqb-del{display:inline-flex;}
.dshqb-del:hover{color:var(--dsw-alias-label-error, #e5484d);}
.dshqb-add,.dshqb-reset{
  height:26px;
  padding:0 8px;
  border-radius:8px;
  border:1px dashed var(--dsw-alias-border-l2, rgba(127,127,127,.35));
  background:transparent;
  color:var(--dsw-alias-label-secondary, #888);
  font-size:12px;
  cursor:pointer;
}
.dshqb-add:hover,.dshqb-reset:hover{
  color:var(--dsw-alias-label-primary, inherit);
  border-style:solid;
}
.dshqb-form{
  display:inline-flex;
  flex-wrap:wrap;
  gap:4px;
  align-items:center;
}
.dshqb-input{
  height:26px;
  min-width:72px;
  max-width:180px;
  padding:0 8px;
  border-radius:8px;
  border:1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.35));
  background:var(--dsw-alias-bg-module-platform, transparent);
  color:var(--dsw-alias-label-primary, inherit);
  font-size:12px;
  outline:none;
}
.dshqb-input:focus{
  border-color:var(--dsw-alias-brand-primary, #4d6bfe);
}
.dshqb-hint{
  width:100%;
  margin:0;
  font-size:11px;
  color:var(--dsw-alias-label-tertiary, #999);
}
.dshqb-main:focus-visible,.dshqb-send:focus-visible,.dshqb-add:focus-visible,
.dshqb-reset:focus-visible,.dshqb-del:focus-visible,.dshqb-input:focus-visible{
  outline:2px solid var(--dsw-alias-brand-primary, #4d6bfe);
  outline-offset:1px;
}
`;
		/** 每个页面只注入一次插件 CSS。 */
		function ensureStyles() {
			if (typeof document === "undefined") return;
			if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`)) return;
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-quick-buttons";
			tag.dataset.pluginCss = STYLE_ID;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region src/client/QuickButtonsDock.tsx
		function resolveClickAction(snap) {
			const fromValue = snap.value?.clickAction;
			if (fromValue === "insert" || fromValue === "send") return fromValue;
			const base = snap.base;
			if (base?.clickAction === "insert" || base?.clickAction === "send") return base.clickAction;
			return "insert";
		}
		const SEND_ICON = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			width: "12",
			height: "12",
			viewBox: "0 0 16 16",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M14.5 1.5L7 9M14.5 1.5L10 14.5l-3-5.5-5.5-3 13-4.5z" })
		});
		/**
		* 输入框上方整行胶囊按钮（`conversation.input.dock`）。
		* 点击按 settings 中的 clickAction 插入或发送；纸飞机始终发送；Alt+点击单次切换。
		*/
		function QuickButtonsDock(props) {
			const { input, inputActions, insertText, sendText, settingsScope } = props;
			const [settingsSnap, setSettingsSnap] = (0, react.useState)(() => settingsScope.getSnapshot());
			const [buttons, setButtons] = (0, react.useState)(() => loadButtons());
			const [adding, setAdding] = (0, react.useState)(false);
			const [label, setLabel] = (0, react.useState)("");
			const [text, setText] = (0, react.useState)("");
			const [busy, setBusy] = (0, react.useState)(false);
			const [status, setStatus] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				ensureStyles();
			}, []);
			(0, react.useEffect)(() => settingsScope.subscribe(() => setSettingsSnap(settingsScope.getSnapshot())), [settingsScope]);
			const clickAction = resolveClickAction(settingsSnap);
			const locked = input.phase !== "plain";
			const disabled = locked || busy;
			const persist = (next) => {
				setButtons(next);
				saveButtons(next);
			};
			const runAction = async (preset, action) => {
				setStatus(null);
				if (action === "insert") {
					try {
						inputActions.setDraft(preset.text);
					} catch {
						insertText(preset.text, "replace");
					}
					return;
				}
				setBusy(true);
				const ok = await sendText(preset.text);
				setBusy(false);
				setStatus(ok ? null : "发送失败，请稍后重试");
			};
			const onChipClick = (event, preset) => {
				const action = event.altKey ? clickAction === "insert" ? "send" : "insert" : clickAction;
				runAction(preset, action);
			};
			const onSendClick = (event, preset) => {
				event.stopPropagation();
				runAction(preset, "send");
			};
			const removeButton = (id) => {
				persist(buttons.filter((button) => button.id !== id));
			};
			const resetDefaults = () => {
				persist(DEFAULT_BUTTONS.map((button) => ({ ...button })));
				setAdding(false);
				setLabel("");
				setText("");
			};
			const commitAdd = () => {
				const nextLabel = label.trim();
				const nextText = text.trim();
				if (!nextLabel || !nextText || buttons.length >= 12) {
					setAdding(false);
					setLabel("");
					setText("");
					return;
				}
				persist([...buttons, {
					id: newButtonId(),
					label: nextLabel.slice(0, 16),
					text: nextText
				}]);
				setAdding(false);
				setLabel("");
				setText("");
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dshqb-row",
				role: "toolbar",
				"aria-label": "快捷按钮",
				children: [
					buttons.map((button) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "dshqb-chip",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dshqb-main",
								title: `${button.text}\n\n点击：${clickAction === "insert" ? "插入输入框" : "直接发送"}；Alt+点击切换；右侧图标始终发送`,
								disabled,
								onClick: (event) => onChipClick(event, button),
								children: button.label
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dshqb-send",
								title: "直接发送",
								"aria-label": `发送：${button.label}`,
								disabled,
								onClick: (event) => onSendClick(event, button),
								children: SEND_ICON
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dshqb-del",
								title: "删除此按钮",
								"aria-label": `删除：${button.label}`,
								onClick: (event) => {
									event.stopPropagation();
									removeButton(button.id);
								},
								children: "×"
							})
						]
					}, button.id)),
					adding ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
						className: "dshqb-form",
						onSubmit: (event) => {
							event.preventDefault();
							commitAdd();
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: "dshqb-input",
								value: label,
								placeholder: "标签",
								maxLength: 16,
								"aria-label": "按钮标签",
								autoFocus: true,
								onChange: (event) => setLabel(event.target.value)
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: "dshqb-input",
								style: {
									minWidth: 140,
									maxWidth: 280
								},
								value: text,
								placeholder: "插入/发送的文本",
								"aria-label": "预设文本",
								onChange: (event) => setText(event.target.value),
								onKeyDown: (event) => {
									if (event.key === "Escape") {
										event.preventDefault();
										setAdding(false);
										setLabel("");
										setText("");
									}
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "dshqb-add",
								children: "保存"
							})
						]
					}) : buttons.length < 12 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dshqb-add",
						title: "新增快捷按钮",
						onClick: () => setAdding(true),
						children: "+"
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dshqb-reset",
						title: "恢复默认按钮",
						onClick: resetDefaults,
						children: "重置"
					}),
					status ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dshqb-hint",
						role: "status",
						children: status
					}) : null,
					locked ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dshqb-hint",
						children: "输入区忙碌时快捷按钮暂不可用"
					}) : null
				]
			});
		}
		//#endregion
		//#region src/shared.ts
		/** 宿主与浏览器半区共用的配置形状（勿在此文件 import 宿主专用包）。 */
		/**
		* 设置命名空间字符串。宿主用 `settingsNamespace(...)` 注册，
		* 浏览器用 `settingsScope.bind({ namespace })` 读取。
		*/
		const QUICK_BUTTONS_SETTINGS_NAMESPACE = "quick-buttons";
		//#endregion
		//#region src/client/index.tsx
		/** 本插件依赖的客户端服务。 */
		const inject = [
			"slots",
			"conversation",
			"sessions",
			"settingsScope"
		];
		/**
		* 在输入框上方注册快捷按钮行。
		* 失败策略：apply 内绝不向外抛错（避免拖垮 Web UI）。
		*/
		function apply(ctx) {
			const scope = ctx.settingsScope.bind({ namespace: QUICK_BUTTONS_SETTINGS_NAMESPACE });
			const insertText = (sessionId, text, mode = "replace") => {
				try {
					const shell = ctx.conversation.input.shell(sessionId);
					if (shell === void 0) return;
					if (mode === "replace") {
						shell.setDraft(text);
						return;
					}
					let current = "";
					try {
						current = shell.state.getSnapshot().draft;
					} catch {
						current = "";
					}
					shell.setDraft(current.trim() === "" ? text : `${current}\n${text}`);
				} catch {}
			};
			const sendText = async (sessionId, text) => {
				try {
					const binding = ctx.sessions.binding(sessionId);
					if (binding === void 0) return false;
					return (await binding.session.prompt([{
						type: "text",
						text
					}], "queue")).ok;
				} catch {
					return false;
				}
			};
			ctx.slots.inject("conversation.input.dock", () => {
				try {
					return ctx.slots.register({
						name: "conversation.input.dock",
						id: "quick-buttons",
						order: 120,
						inject: (sessionId) => ({
							settingsScope: scope,
							insertText: (text, mode) => {
								insertText(sessionId, text, mode ?? "replace");
							},
							sendText: async (text) => sendText(sessionId, text)
						})
					}, QuickButtonsDock);
				} catch {
					return () => {};
				}
			});
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map