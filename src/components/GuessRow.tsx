import Tile from './Tile'
import type { Tile as TileType } from '../lib/types'
import { WORD_LENGTH } from '../lib/gameLogic'

interface Props {
  tiles: TileType[]
  isActive: boolean
  shaking: boolean
  flipping: boolean
}

// test commit

export default function GuessRow({ tiles, isActive: _isActive, shaking, flipping }: Props) {
  const padded = [...tiles]
  while (padded.length < WORD_LENGTH) {
    padded.push({ letter: '', state: 'empty' })
  }

  return (
    <div className={`flex gap-1.5 justify-center ${shaking ? 'row-shake' : ''}`}>
      {padded.map((tile, i) => (
        <Tile
          key={i}
          letter={tile.letter}
          state={tile.state}
          flipDelay={i * 80}
          isFlipping={flipping && tile.state !== 'empty' && tile.state !== 'filled'}
        />
      ))}
    </div>
  )
}
