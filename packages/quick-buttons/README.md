# dsh-quick-buttons

在 DeepSeek Harness Web UI 输入框**上方**显示一排自定义快捷按钮：点击将预设文本插入草稿，或直接发送。

## 功能

- 默认按钮：`继续`、`说人话`、`总结`、`审查`
- 点击主按钮：默认**插入**输入框（可用 Alt+点击 改为直接发送）
- 右侧纸飞机：始终**直接发送**
- `+` 新增按钮；悬停 `×` 删除；`重置` 恢复默认
- 列表保存在浏览器 `localStorage`（键：`dsh-quick-buttons:v1`）

## 安装

必须装到 **web** profile（需要浏览器半区）：

```sh
# 在仓库根目录
dsh plugin --profile web add ./packages/quick-buttons
dsh web
```

刷新页面后，在会话输入框上方可见按钮行。

卸载：

```sh
dsh plugin --profile web remove dsh-quick-buttons
```

## 配置

默认点击为「插入输入框」。发送请用按钮右侧的纸飞机，或 Alt+点击主按钮切换行为。

按钮列表保存在浏览器 localStorage；点「重置」可恢复内置默认项。

主机侧 `cordis.patch.yml` 可写 `clickAction`（目前主要用于启动日志；Web 交互以上述方式为准）：

```yaml
- override:
    - id: quick-buttons
      config:
        clickAction: send
```

## 开发

```sh
pnpm install
pnpm --filter dsh-quick-buttons run test
pnpm --filter dsh-quick-buttons run check
```

改 `src/client/` 后重新 build，再重启 `dsh web` 并硬刷新浏览器。
