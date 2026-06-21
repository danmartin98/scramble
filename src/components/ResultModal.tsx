import { RotateCcw } from 'lucide-react'
import type { Tile } from '../lib/types'

interface Props {
  won: boolean
  answer: string
  guessCount: number
  guessHistory: Tile[][]
  onNewGame: () => void
}

const tileColor: Record<string, string> = {
  correct: '#52a876',
  present: '#e8a84a',
  absent: '#3a3a3c',
  filled: '#3a3a3c',
  empty: '#3a3a3c',
}

export default function ResultModal({ won, answer, guessCount, guessHistory, onNewGame }: Props) {
  const emoji = guessHistory.map(row =>
    row.map(t => {
      if (t.state === 'correct') return '🟩'
      if (t.state === 'present') return '🟨'
      return '⬛'
    }).join('')
  ).join('\n')

  const shareText = `Scramble ${won ? guessCount : 'X'}/5\n\n${emoji}`

  function share() {
    navigator.clipboard?.writeText(shareText)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div
        className="bg-surface border border-game-border rounded-xl p-6 max-w-sm w-full text-center"
        style={{ animation: 'modalIn 0.35s ease' }}
      >
        <div className="mb-2 text-4xl">{won ? '🎉' : '😔'}</div>
        <h2 className="font-sans font-bold text-xl text-text-primary mb-1">
          {won ? 'You got it!' : 'Nice try!'}
        </h2>
        <p className="text-text-muted text-sm mb-4 font-sans">
          {won
            ? `Solved in ${guessCount} ${guessCount === 1 ? 'guess' : 'guesses'}`
            : `The word was `}
          {!won && (
            <span className="text-text-primary font-semibold uppercase">{answer}</span>
          )}
        </p>

        {/* Mini board */}
        <div className="flex flex-col gap-1 items-center mb-5">
          {guessHistory.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.map((tile, ti) => (
                <div
                  key={ti}
                  className="w-5 h-5 rounded-sm"
                  style={{ background: tileColor[tile.state] }}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={share}
            className="flex-1 py-3 rounded-lg bg-surface-2 border border-game-border text-text-secondary font-sans font-semibold text-sm hover:border-game-border transition-colors"
          >
            Copy results
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 py-3 rounded-lg bg-correct text-white font-sans font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
          >
            <RotateCcw size={16} />
            New game
          </button>
        </div>
      </div>
    </div>
  )
}
