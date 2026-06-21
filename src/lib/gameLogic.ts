import type { TileState, Tile, ConstraintMap } from './types'

export const WORD_LENGTH = 5
export const MAX_GUESSES = 5

export function scoreTiles(guess: string, answer: string): TileState[] {
  const result: TileState[] = Array(WORD_LENGTH).fill('absent')
  const answerChars = answer.split('')
  const guessChars = guess.split('')

  // First pass: mark greens
  const remaining: (string | null)[] = [...answerChars]
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 'correct'
      remaining[i] = null
    }
  }

  // Second pass: mark yellows
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === 'correct') continue
    const idx = remaining.findIndex(c => c === guessChars[i])
    if (idx !== -1) {
      result[i] = 'present'
      remaining[idx] = null
    }
  }

  return result
}

export function buildConstraints(guessHistory: Tile[][]): ConstraintMap {
  const greens = new Map<number, string>()
  const yellows = new Map<string, Set<number>>()

  for (const row of guessHistory) {
    for (let i = 0; i < row.length; i++) {
      const { letter, state } = row[i]
      if (state === 'correct') {
        greens.set(i, letter)
      } else if (state === 'present') {
        if (!yellows.has(letter)) yellows.set(letter, new Set())
        yellows.get(letter)!.add(i)
      }
    }
  }

  return { greens, yellows }
}

export function violatesConstraints(guess: string, constraints: ConstraintMap): string | null {
  const { greens, yellows } = constraints

  for (const [pos, letter] of greens) {
    if (guess[pos] !== letter) {
      return `Position ${pos + 1} must be "${letter.toUpperCase()}"`
    }
  }

  for (const [letter, bannedPositions] of yellows) {
    const idxInGuess = guess.split('').findIndex((c, i) => c === letter && !bannedPositions.has(i))
    if (idxInGuess === -1) {
      return `"${letter.toUpperCase()}" must appear somewhere in your guess`
    }
  }

  return null
}
