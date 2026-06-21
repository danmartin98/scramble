export type TileState = 'correct' | 'present' | 'absent' | 'empty' | 'filled'

export interface Tile {
  letter: string
  state: TileState
}

export interface GuessRow {
  tiles: Tile[]
  submitted: boolean
  shaking: boolean
  flipping: boolean
}

export type GamePhase = 'playing' | 'won' | 'lost'

export interface ConstraintMap {
  // letter -> set of positions where it must appear (greens)
  greens: Map<number, string>
  // letters that must appear somewhere (yellows), with positions they can't occupy
  yellows: Map<string, Set<number>>
}
