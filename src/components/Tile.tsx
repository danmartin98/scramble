import type { TileState } from '../lib/types'

interface Props {
  letter: string
  state: TileState
  flipDelay?: number
  isFlipping?: boolean
  isSubmission?: boolean
}

const bgMap: Record<TileState, string> = {
  correct: 'bg-correct',
  present: 'bg-present',
  absent: 'bg-absent',
  empty: 'bg-transparent',
  filled: 'bg-transparent',
}

const borderMap: Record<TileState, string> = {
  correct: 'border-correct',
  present: 'border-present',
  absent: 'border-absent',
  empty: 'border-game-border',
  filled: 'border-text-muted',
}

export default function Tile({ letter, state, flipDelay = 0, isFlipping = false, isSubmission = false }: Props) {
  const isRevealed = state === 'correct' || state === 'present' || state === 'absent'

  return (
    <div
      className={[
        'flex items-center justify-center',
        'font-sans font-bold text-text-primary select-none',
        isSubmission ? 'w-12 h-12 text-xl rounded-md' : 'w-14 h-14 text-2xl',
        'border-2 uppercase',
        bgMap[state],
        borderMap[state],
        isFlipping && isRevealed ? 'tile-flip' : '',
        !isFlipping && letter && state === 'filled' ? 'tile-pop' : '',
      ].join(' ')}
      style={isFlipping ? { animationDelay: `${flipDelay}ms` } : undefined}
    >
      {letter}
    </div>
  )
}
