# dsh-plugins

## 1. 简介

本仓库是一组可安装的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（简称 **dsh**）插件示例 / 扩展包。每个子包都是独立的 `dsh.bundle`，可按需装进某个 profile。

### DeepSeek Harness 是什么

DeepSeek Harness 是 DeepSeek 开源的 **Agent 运行时（Harness）**：用 Cordis 插件体系把模型、工具、会话、Web/无头入口等能力拼成可启动的应用。「一切皆插件」——官方内置能力与第三方扩展都走同一套加载机制。

CLI 包为 [`@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh)。常见启动方式：

| 命令 | 含义 |
|------|------|
| `dsh web` / `dsh --profile web` | 启动 Web UI（默认 `http://127.0.0.1:3080`） |
| `dsh --profile headless "任务"` | 无头跑一轮任务后退出 |
| `dsh plugin --profile <名> add …` | 向指定 profile 安装插件依赖 |

### 基本结构（和本仓库的关系）

```text
dsh CLI
  └─ profile（$DSH_HOME/profiles/<名>/）     # 一套可启动的配置 + 依赖
       ├─ dsh.profile.bundles                # 有序的 bundle 层列表
       │    ├─ @deepseek-ai/dsh-base / web-app / …   # 官方内置层
       │    └─ 本仓库的包（如 dsh-hello-plugin）      # 第三方 bundle 层 ← 本项目
       └─ cordis.patch.yml                   # 用户覆盖层（可改 greeting 等）
```

要点：

- **Profile**：一次 `dsh --profile …` 启动对应的运行配置；`web` / `headless` 等可从官方模板初始化，也可自定义命名。
- **Bundle（本仓库产出物）**：带 `dsh.bundle.patch` 的 npm 包；安装后其 `cordis.patch.yml` 成为 profile 里的一层，把 Cordis 插件行插入配置树。
- **Cordis 插件**：bundle 实际加载的代码（`name` / `inject` / `apply`）。可以是：
  - **宿主工具插件**（如 `hello`）：向 `ctx.tools` 注册模型可调用的工具；
  - **双半区插件**（如 `quick-buttons`）：宿主半区 + `dsh.client` 浏览器半区，往 Web UI 的 slot（如输入框上方）挂界面。

本仓库**不能单独启动**；需先有 dsh，再把子包装进 profile，由 dsh 加载运行。

## 2. 仓库结构

```text
packages/
  hello/           # dsh-hello-plugin — greet 示例工具（宿主工具）
  quick-buttons/   # dsh-quick-buttons — Web 输入框上方快捷按钮
```

后续新插件放在 `packages/<name>/`，各自带 `package.json`（含 `dsh.bundle`）、`cordis.patch.yml` 和 `src/`。

## 3. 如何安装当前项目的插件

需要已安装 [`@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh)（`>=0.1.0-rc.6`）和 Node `^22.19 || >=24`。

### hello（宿主工具示例）

```sh
dsh plugin --profile hello add ./packages/hello
dsh --profile hello
```

在 Web UI 里可以说：`Use the greet tool to greet Ada.`

### quick-buttons（Web 快捷按钮）

```sh
dsh plugin --profile web add ./packages/quick-buttons
dsh web
```

输入框上方会出现「继续 / 说人话 / …」按钮：点击插入草稿，纸飞机图标直接发送。详见 `packages/quick-buttons/README.md`。

### 卸载

```sh
dsh plugin --profile hello remove dsh-hello-plugin
dsh plugin --profile web remove dsh-quick-buttons
```

### 从 GitHub / monorepo 安装

根目录 `package.json` 是 **private workspace**，不能 `dsh plugin add github:cacohe/dsh-plugins` 整仓安装。可选方式：

1. **克隆后本地路径（推荐开发）**

```sh
git clone https://github.com/cacohe/dsh-plugins.git
cd dsh-plugins
pnpm install && pnpm run build
dsh plugin --profile web add ./packages/hello
dsh plugin --profile web add ./packages/quick-buttons
```

2. **pnpm Git 子目录协议**（装单个包；需允许 `prepare` 构建）

```sh
dsh plugin --profile web add "github:cacohe/dsh-plugins#path:packages/hello"
dsh plugin --profile web add "github:cacohe/dsh-plugins#path:packages/quick-buttons"
```

首次 Git 安装若被 pnpm 拒绝执行 `prepare`，按 dsh 提示在 profile 的 `pnpm-workspace.yaml` 里 `allowBuilds` 放行对应包名后重试。建议钉 commit：`github:cacohe/dsh-plugins#<sha>&path:packages/hello`（具体语法以当前 pnpm 为准）。

3. **发 npm / `pnpm pack` 的 tarball** 后再 `dsh plugin add <包名或 .tgz>`，可避免向用户索要 build 权限。

## 4. 开发与新增插件

需要 Node `^22.19 || >=24` 和 pnpm。

### 本地开发

```sh
pnpm install
pnpm run test    # 各包 Vitest 单测
pnpm run smoke   # 打包产物安装 + hello 真实调用冒烟
pnpm run check   # typecheck + test + build + smoke
```

测试覆盖（对齐社区插件实践）：

- **导出形状**：命名导出、`inject`、无 `default`（Loader 安全）
- **hello**：真实 Cordis + `ToolRuntime` 注册 / 调用 / 参数校验 / dispose 回滚
- **manifest**：`package.json` 包名与 `cordis.patch.yml` / Cordis `name` 一致
- **quick-buttons**：Config / settings 命名空间、按钮 localStorage 读写与脏数据回退
- **smoke**：`pnpm pack` 后在干净目录安装，校验清单与 `greet` 执行

### 新增插件

1. 复制 `packages/hello`（纯宿主）或 `packages/quick-buttons`（宿主 + Web client）
2. 改包名、`export const name`、`cordis.patch.yml` 的 `id` / `name`（保持一致）
3. `pnpm install` 后 `pnpm run check`
4. `dsh plugin --profile <profile> add ./packages/<name>`

## License

MIT
