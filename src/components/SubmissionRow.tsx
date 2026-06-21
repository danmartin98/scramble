import Tile from './Tile'
import { WORD_LENGTH } from '../lib/gameLogic'

interface Props {
  value: string
  isLocked: boolean
  shaking: boolean
  flipping: boolean
  isActive: boolean
  result: ('correct' | 'present' | 'absent')[] | null
}

export default function SubmissionRow({ value, isLocked, shaking, flipping, isActive, result }: Props) {
  const tiles = Array.from({ length: WORD_LENGTH }, (_, i) => {
    const letter = value[i] ?? ''
    let state: 'correct' | 'present' | 'absent' | 'empty' | 'filled' = 'empty'
    if (result) {
      state = result[i]
    } else if (letter) {
      state = 'filled'
    }
    return { letter, state }
  })

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <div
          className={[
            'w-1.5 h-1.5 rounded-full transition-colors duration-300',
            isLocked ? 'bg-text-dimmer' : isActive ? 'bg-blue pulse-once' : 'bg-text-dimmer',
          ].join(' ')}
        />
        <span
          className={[
            'text-[10px] font-bold tracking-[3px] uppercase transition-colors duration-300',
            isLocked ? 'text-text-dimmer' : isActive ? 'text-blue' : 'text-text-dimmer',
          ].join(' ')}
        >
          {isLocked ? 'submitted' : 'final answer'}
        </span>
      </div>
      <div className={`flex gap-1.5 justify-center ${shaking ? 'row-shake' : ''}`}>
        {tiles.map((tile, i) => (
          <Tile
            key={i}
            letter={tile.letter}
            state={tile.state}
            flipDelay={i * 80}
            isFlipping={flipping && !!result}
            isSubmission
          />
        ))}
      </div>
    </div>
  )
}
