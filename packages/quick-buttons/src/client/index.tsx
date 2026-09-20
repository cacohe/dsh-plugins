import type { ClientContext, SessionId, SettingsScope } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { QuickButtonsDock } from './QuickButtonsDock.js'
import { QUICK_BUTTONS_SETTINGS_NAMESPACE } from '../shared.js'
import type { Config } from '../shared.js'

/** 本插件依赖的客户端服务。 */
export const inject = ['slots', 'conversation', 'sessions', 'settingsScope']

interface InputShellFace {
  setDraft(text: string): void
  state: { getSnapshot(): { draft: string } }
}

/**
 * 在输入框上方注册快捷按钮行。
 * 失败策略：apply 内绝不向外抛错（避免拖垮 Web UI）。
 */
export function apply(ctx: ClientContext): void {
  const scope = ctx.settingsScope.bind<Config>({ namespace: QUICK_BUTTONS_SETTINGS_NAMESPACE })

  const insertText = (sessionId: SessionId, text: string, mode: 'replace' | 'append' = 'replace'): void => {
    try {
      const hub = ctx.conversation.input as unknown as { shell(id: SessionId): InputShellFace | undefined }
      const shell = hub.shell(sessionId)
      if (shell === undefined) return
      if (mode === 'replace') {
        shell.setDraft(text)
        return
      }
      let current = ''
      try {
        current = shell.state.getSnapshot().draft
      } catch {
        current = ''
      }
      shell.setDraft(current.trim() === '' ? text : `${current}\n${text}`)
    } catch {
      // 草稿写入失败时不拖垮界面
    }
  }

  const sendText = async (sessionId: SessionId, text: string): Promise<boolean> => {
    try {
      const binding = ctx.sessions.binding(sessionId)
      if (binding === undefined) return false
      const result = await binding.session.prompt([{ type: 'text', text }], 'queue')
      return result.ok
    } catch {
      return false
    }
  }

  ctx.slots.inject('conversation.input.dock', () => {
    try {
      return ctx.slots.register({
        name: 'conversation.input.dock',
        id: 'quick-buttons',
        order: 120,
        inject: (sessionId) => ({
          settingsScope: scope as SettingsScope<Config>,
          insertText: (text: string, mode?: 'replace' | 'append') => {
            insertText(sessionId, text, mode ?? 'replace')
          },
          sendText: async (text: string) => sendText(sessionId, text),
        }),
      }, QuickButtonsDock)
    } catch {
      return () => {}
    }
  })
}
