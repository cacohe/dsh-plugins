# dsh-plugin

一个简单的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 示例插件。加载后会注册 `greet` 工具，模型可以按名字打招呼。

## 这个插件演示了什么

- Cordis 插件入口：`name` / `inject` / `apply`
- 用 `defineTool` 注册一个可被模型调用的工具
- 用 Schemastery 接收 `cordis.yml` 配置（问候语前缀）
- 作为可安装的 profile bundle（`dsh.bundle.patch`）

## 安装与运行

需要已安装 [`@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh)（`>=0.1.0-rc.6`）和 Node `^22.19 || >=24`。

```sh
pnpm install
pnpm run check

dsh plugin --profile hello add .
dsh --profile hello --dump-config   # 应出现 "# == dsh-plugin" 层
dsh --profile hello
```

启动日志中会出现：

```text
[dsh-plugin] loaded (greeting="Hello")
```

在 Web UI 里可以说：`Use the greet tool to greet Ada.` 工具会返回 `Hello, Ada!`。

开发时改 `src/index.ts`，执行 `pnpm run build`，再重启 profile。

卸载：

```sh
dsh plugin --profile hello remove dsh-plugin
```

## 配置

问候语前缀可在 profile 的 `cordis.patch.yml` 里覆盖，不必改代码：

```yaml
- override:
    - id: dsh-plugin
      config:
        greeting: 你好
```

此时 `greet` 会返回 `你好, Ada!`。

## 文件结构

```text
package.json       # dsh.bundle patch 与构建入口
src/index.ts       # Cordis 插件：配置 + greet 工具
cordis.patch.yml   # 把本包插入 profile
tsconfig.json      # TypeScript 类型检查
tsdown.config.ts   # 编译到 lib/
```

改名时以下三处必须保持一致：

- `package.json` → `name`
- `src/index.ts` → `name`
- `cordis.patch.yml` → `id` 和 `name`

## License

MIT
