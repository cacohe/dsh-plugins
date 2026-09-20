/** 宿主与浏览器半区共用的配置形状（勿在此文件 import 宿主专用包）。 */

/**
 * 设置命名空间字符串。宿主用 `settingsNamespace(...)` 注册，
 * 浏览器用 `settingsScope.bind({ namespace })` 读取。
 */
export const QUICK_BUTTONS_SETTINGS_NAMESPACE = 'quick-buttons'

export interface Config {
  /**
   * 预设按钮的默认点击行为。
   * - `insert`：写入输入框草稿（发送前可再编辑）
   * - `send`：立即作为用户消息入队发送
   */
  clickAction: 'insert' | 'send'
}
