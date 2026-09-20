# dsh-quick-buttons

在 DeepSeek Harness Web UI 输入框**上方**显示一排自定义快捷按钮：点击将预设文本插入草稿，或直接发送。

## 功能

- 默认按钮：`继续`、`说人话`、`总结`、`审查`
- 点击主按钮：按 settings 中的 `clickAction`（默认**插入**）；可用 Alt+点击单次切换
- 右侧纸飞机：始终**直接发送**
- `+` 新增按钮；悬停 `×` 删除；`重置` 恢复默认
- 按钮列表保存在浏览器 `localStorage`（键：`dsh-quick-buttons:v1`）
- `clickAction` 经官方 settings 文档从宿主 Config / patch 同步到 Web

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

在 profile 的 `cordis.patch.yml` 覆盖默认点击行为（会写入 settings 的 composition base，Web 端生效）：

```yaml
- override:
    - id: quick-buttons
      config:
        clickAction: send
```

发送也可用按钮右侧纸飞机，或 Alt+点击主按钮切换。按钮文案列表仍在 localStorage；点「重置」可恢复内置默认项。

## 开发

```sh
pnpm install
pnpm --filter dsh-quick-buttons run test
pnpm --filter dsh-quick-buttons run check
```

改 `src/client/` 后重新 build，再重启 `dsh web` 并硬刷新浏览器。
