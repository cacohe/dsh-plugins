import { useEffect, useState, type ReactElement, type MouseEvent } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { SettingsScope, SettingsScopeSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import {
  DEFAULT_BUTTONS,
  loadButtons,
  MAX_BUTTONS,
  newButtonId,
  saveButtons,
  type QuickButton,
} from './buttons.js'
import { ensureStyles } from './styles.js'
import type { Config } from '../shared.js'

export type QuickButtonsDockProps = PropsRuntime<'conversation.input.dock'> & {
  /** 将预设文本写入当前会话草稿。 */
  insertText: (text: string, mode?: 'replace' | 'append') => void
  /** 将预设文本作为用户消息入队（直接发送）。 */
  sendText: (text: string) => Promise<boolean>
  /** 宿主 settings 命名空间（含 patch 同步来的 clickAction）。 */
  settingsScope: SettingsScope<Config>
}

function resolveClickAction(snap: SettingsScopeSnapshot<Config>): 'insert' | 'send' {
  const fromValue = snap.value?.clickAction
  if (fromValue === 'insert' || fromValue === 'send') return fromValue
  const base = snap.base as Partial<Config> | undefined
  if (base?.clickAction === 'insert' || base?.clickAction === 'send') return base.clickAction
  return 'insert'
}

const SEND_ICON = (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.5 1.5L7 9M14.5 1.5L10 14.5l-3-5.5-5.5-3 13-4.5z" />
  </svg>
)

/**
 * 输入框上方整行胶囊按钮（`conversation.input.dock`）。
 * 点击按 settings 中的 clickAction 插入或发送；纸飞机始终发送；Alt+点击单次切换。
 */
export function QuickButtonsDock(props: QuickButtonsDockProps): ReactElement {
  const { input, inputActions, insertText, sendText, settingsScope } = props
  const [settingsSnap, setSettingsSnap] = useState(() => settingsScope.getSnapshot())
  const [buttons, setButtons] = useState<QuickButton[]>(() => loadButtons())
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState('')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    ensureStyles()
  }, [])

  useEffect(() => settingsScope.subscribe(() => setSettingsSnap(settingsScope.getSnapshot())), [settingsScope])

  const clickAction = resolveClickAction(settingsSnap)

  const locked = input.phase !== 'plain'
  const disabled = locked || busy

  const persist = (next: QuickButton[]): void => {
    setButtons(next)
    saveButtons(next)
  }

  const runAction = async (preset: QuickButton, action: 'insert' | 'send'): Promise<void> => {
    setStatus(null)
    if (action === 'insert') {
      try {
        inputActions.setDraft(preset.text)
      } catch {
        insertText(preset.text, 'replace')
      }
      return
    }
    setBusy(true)
    const ok = await sendText(preset.text)
    setBusy(false)
    setStatus(ok ? null : '发送失败，请稍后重试')
  }

  const onChipClick = (event: MouseEvent<HTMLButtonElement>, preset: QuickButton): void => {
    const flip = event.altKey
    const action = flip
      ? (clickAction === 'insert' ? 'send' : 'insert')
      : clickAction
    void runAction(preset, action)
  }

  const onSendClick = (event: MouseEvent<HTMLButtonElement>, preset: QuickButton): void => {
    event.stopPropagation()
    void runAction(preset, 'send')
  }

  const removeButton = (id: string): void => {
    persist(buttons.filter((button: QuickButton) => button.id !== id))
  }

  const resetDefaults = (): void => {
    persist(DEFAULT_BUTTONS.map(button => ({ ...button })))
    setAdding(false)
    setLabel('')
    setText('')
  }

  const commitAdd = (): void => {
    const nextLabel = label.trim()
    const nextText = text.trim()
    if (!nextLabel || !nextText || buttons.length >= MAX_BUTTONS) {
      setAdding(false)
      setLabel('')
      setText('')
      return
    }
    persist([
      ...buttons,
      { id: newButtonId(), label: nextLabel.slice(0, 16), text: nextText },
    ])
    setAdding(false)
    setLabel('')
    setText('')
  }

  return (
    <div className="dshqb-row" role="toolbar" aria-label="快捷按钮">
      {buttons.map(button => (
        <span key={button.id} className="dshqb-chip">
          <button
            type="button"
            className="dshqb-main"
            title={`${button.text}\n\n点击：${clickAction === 'insert' ? '插入输入框' : '直接发送'}；Alt+点击切换；右侧图标始终发送`}
            disabled={disabled}
            onClick={event => onChipClick(event, button)}
          >
            {button.label}
          </button>
          <button
            type="button"
            className="dshqb-send"
            title="直接发送"
            aria-label={`发送：${button.label}`}
            disabled={disabled}
            onClick={event => onSendClick(event, button)}
          >
            {SEND_ICON}
          </button>
          <button
            type="button"
            className="dshqb-del"
            title="删除此按钮"
            aria-label={`删除：${button.label}`}
            onClick={event => {
              event.stopPropagation()
              removeButton(button.id)
            }}
          >
            ×
          </button>
        </span>
      ))}

      {adding ? (
        <form
          className="dshqb-form"
          onSubmit={event => {
            event.preventDefault()
            commitAdd()
          }}
        >
          <input
            className="dshqb-input"
            value={label}
            placeholder="标签"
            maxLength={16}
            aria-label="按钮标签"
            autoFocus
            onChange={event => setLabel(event.target.value)}
          />
          <input
            className="dshqb-input"
            style={{ minWidth: 140, maxWidth: 280 }}
            value={text}
            placeholder="插入/发送的文本"
            aria-label="预设文本"
            onChange={event => setText(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                event.preventDefault()
                setAdding(false)
                setLabel('')
                setText('')
              }
            }}
          />
          <button type="submit" className="dshqb-add">保存</button>
        </form>
      ) : buttons.length < MAX_BUTTONS ? (
        <button
          type="button"
          className="dshqb-add"
          title="新增快捷按钮"
          onClick={() => setAdding(true)}
        >
          +
        </button>
      ) : null}

      <button
        type="button"
        className="dshqb-reset"
        title="恢复默认按钮"
        onClick={resetDefaults}
      >
        重置
      </button>

      {status ? <p className="dshqb-hint" role="status">{status}</p> : null}
      {locked ? <p className="dshqb-hint">输入区忙碌时快捷按钮暂不可用</p> : null}
    </div>
  )
}
