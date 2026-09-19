/** 显示在输入区上方的一条快捷按钮。 */
export interface QuickButton {
  /** 稳定 id（React key 与存储身份）。 */
  id: string
  /** 胶囊上显示的短标签。 */
  label: string
  /** 实际插入或发送的完整文本。 */
  text: string
}

export const STORAGE_KEY = 'dsh-quick-buttons:v1'

export const MAX_BUTTONS = 12

/** 内置默认按钮（常见中文对话快捷语）。 */
export const DEFAULT_BUTTONS: QuickButton[] = [
  { id: 'continue', label: '继续', text: '继续' },
  { id: 'plain', label: '说人话', text: '说人话，用更直白、少术语的方式解释。' },
  {
    id: 'summarize',
    label: '总结',
    text: '请用条目总结上面的结论，并给出下一步建议。',
  },
  {
    id: 'review',
    label: '审查',
    text: '请审查当前改动：正确性、边界条件、错误处理与可维护性；先给结论再列问题。',
  },
]

export function loadButtons(): QuickButton[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return DEFAULT_BUTTONS.map(cloneButton)
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return DEFAULT_BUTTONS.map(cloneButton)
    return parsed
      .filter(isButton)
      .slice(0, MAX_BUTTONS)
      .map(cloneButton)
  } catch {
    return DEFAULT_BUTTONS.map(cloneButton)
  }
}

export function saveButtons(buttons: QuickButton[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buttons))
  } catch {
    // 隐私模式/配额不足：本页仍用内存列表
  }
}

function isButton(value: unknown): value is QuickButton {
  if (typeof value !== 'object' || value === null) return false
  const row = value as Record<string, unknown>
  return typeof row.id === 'string'
    && typeof row.label === 'string'
    && typeof row.text === 'string'
    && row.label.trim() !== ''
    && row.text.trim() !== ''
}

function cloneButton(button: QuickButton): QuickButton {
  return { id: button.id, label: button.label, text: button.text }
}

export function newButtonId(): string {
  return `btn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
