import GuessRow from './GuessRow'
import SubmissionRow from './SubmissionRow'
import type { Tile } from '../lib/types'
import { MAX_GUESSES } from '../lib/gameLogic'

interface Props {
  guessHistory: Tile[][]
  currentGuess: string
  activeRow: number
  shakingRow: number | null
  flippingRow: number | null
  submissionValue: string
  submissionLocked: boolean
  submissionShaking: boolean
  submissionFlipping: boolean
  submissionResult: ('correct' | 'present' | 'absent')[] | null
  activeInput: 'guess' | 'submission'
}

export default function GameBoard({
  guessHistory,
  currentGuess,
  activeRow,
  shakingRow,
  flippingRow,
  submissionValue,
  submissionLocked,
  submissionShaking,
  submissionFlipping,
  submissionResult,
  activeInput,
}: Props) {
  const rows: { tiles: Tile[]; submitted: boolean }[] = []

  for (let i = 0; i < MAX_GUESSES; i++) {
    if (i < guessHistory.length) {
      rows.push({ tiles: guessHistory[i], submitted: true })
    } else if (i === activeRow) {
      rows.push({
        tiles: currentGuess.split('').map(l => ({ letter: l, state: 'filled' as const })),
        submitted: false,
      })
    } else {
      rows.push({ tiles: [], submitted: false })
    }
  }

  return (
    <div className="flex flex-col gap-1.5 items-center">
      {rows.map((row, i) => (
        <GuessRow
          key={i}
          tiles={row.tiles}
          isActive={i === activeRow && !row.submitted}
          shaking={shakingRow === i}
          flipping={flippingRow === i}
        />
      ))}

      <div className="mt-3 w-full border-t border-game-border-2 pt-3 mb-4">
        <SubmissionRow
          value={submissionValue}
          isLocked={submissionLocked}
          shaking={submissionShaking}
          flipping={submissionFlipping}
          isActive={activeInput === 'submission'}
          result={submissionResult}
        />
      </div>
    </div>
  )
}
