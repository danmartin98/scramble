import type { Tile } from '../lib/types'

const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['Enter','z','x','c','v','b','n','m','⌫'],
]

interface Props {
  guessHistory: Tile[][]
  onKey: (key: string) => void
  disabled: boolean
}

type KeyStatus = 'correct' | 'present' | 'absent' | 'unused'

function buildKeyStatuses(history: Tile[][]): Map<string, KeyStatus> {
  const map = new Map<string, KeyStatus>()
  const priority: KeyStatus[] = ['correct', 'present', 'absent', 'unused']

  for (const row of history) {
    for (const tile of row) {
      const cur = map.get(tile.letter) ?? 'unused'
      if (priority.indexOf(tile.state as KeyStatus) < priority.indexOf(cur)) {
        map.set(tile.letter, tile.state as KeyStatus)
      }
    }
  }
  return map
}

const keyBg: Record<KeyStatus, string> = {
  correct: 'bg-correct text-white',
  present: 'bg-present text-white',
  absent: 'bg-absent text-[#818384]',
  unused: 'bg-[#818384] text-white',
}

export default function Keyboard({ guessHistory, onKey, disabled }: Props) {
  const statuses = buildKeyStatuses(guessHistory)

  return (
    <div className="flex flex-col gap-1.5 w-full px-1 select-none">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1 justify-center">
          {row.map(key => {
            const isWide = key === 'Enter' || key === '⌫'
            const status = statuses.get(key) ?? 'unused'
            const bg = isWide ? 'bg-[#818384] text-white' : keyBg[status]

            return (
              <button
                key={key}
                onPointerDown={e => { e.preventDefault(); if (!disabled) onKey(key) }}
                className={[
                  'key-btn rounded font-sans font-semibold text-sm',
                  'h-14 flex items-center justify-center',
                  isWide ? 'px-3 min-w-[4rem]' : 'w-10',
                  bg,
                  disabled ? 'opacity-40 cursor-default' : '',
                ].join(' ')}
              >
                {key === '⌫' ? key : key === 'Enter' ? key : key.toUpperCase()}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
