import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_BUTTONS,
  MAX_BUTTONS,
  STORAGE_KEY,
  loadButtons,
  newButtonId,
  saveButtons,
  type QuickButton,
} from '../src/client/buttons.js'

class MemoryStorage implements Storage {
  #map = new Map<string, string>()

  get length(): number {
    return this.#map.size
  }

  clear(): void {
    this.#map.clear()
  }

  getItem(key: string): string | null {
    return this.#map.has(key) ? this.#map.get(key)! : null
  }

  key(index: number): string | null {
    return [...this.#map.keys()][index] ?? null
  }

  removeItem(key: string): void {
    this.#map.delete(key)
  }

  setItem(key: string, value: string): void {
    this.#map.set(key, String(value))
  }
}

describe('快捷按钮存储', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    })
  })

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'localStorage')
  })

  it('存储为空时返回内置默认列表', () => {
    expect(loadButtons()).toEqual(DEFAULT_BUTTONS)
  })

  it('可持久化并重新加载自定义列表', () => {
    const custom: QuickButton[] = [
      { id: 'a', label: '继续', text: '继续' },
      { id: 'b', label: '说人话', text: '说人话' },
    ]
    saveButtons(custom)
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy()
    expect(loadButtons()).toEqual(custom)
  })

  it('保留显式保存的空列表（不会自动恢复默认）', () => {
    saveButtons([])
    expect(loadButtons()).toEqual([])
  })

  it('JSON 损坏时回退到默认列表', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')
    expect(loadButtons()).toEqual(DEFAULT_BUTTONS)
  })

  it('过滤非法行并限制在 MAX_BUTTONS 以内', () => {
    const rows = Array.from({ length: MAX_BUTTONS + 3 }, (_, i) => ({
      id: `id-${i}`,
      label: `L${i}`,
      text: `T${i}`,
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
      ...rows,
      { id: 'bad', label: '', text: 'x' },
      { id: 1, label: 'n', text: 't' },
      null,
    ]))

    const loaded = loadButtons()
    expect(loaded).toHaveLength(MAX_BUTTONS)
    expect(loaded.every(row => row.label && row.text)).toBe(true)
  })

  it('生成唯一 id', () => {
    const ids = new Set(Array.from({ length: 20 }, () => newButtonId()))
    expect(ids.size).toBe(20)
  })
})
