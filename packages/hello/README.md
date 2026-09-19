# dsh-hello-plugin

DeepSeek Harness 示例插件：注册一个 `greet` 工具。

## 安装

在仓库根目录执行：

```sh
dsh plugin --profile hello add ./packages/hello
dsh --profile hello
```

卸载：

```sh
dsh plugin --profile hello remove dsh-hello-plugin
```

## 配置

在 profile 的 `cordis.patch.yml` 中覆盖：

```yaml
- override:
    - id: hello
      config:
        greeting: 你好
```

## 测试

```sh
pnpm --filter dsh-hello-plugin test
```

覆盖：Loader 安全导出、Config 默认值、真实 `ToolRuntime` 注册/执行/缺参校验，以及 dispose 回滚。
