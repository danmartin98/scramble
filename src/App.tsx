import { useState, useEffect, useCallback, useRef } from 'react'
import Header from './components/Header'
import GameBoard from './components/GameBoard'
import Keyboard from './components/Keyboard'
import Toast from './components/Toast'
import HelpModal from './components/HelpModal'
import ResultModal from './components/ResultModal'
import { ANSWERS } from './data/answers'
import { isRealWord } from './data/dictionary'
import {
  WORD_LENGTH,
  MAX_GUESSES,
  scoreTiles,
  buildConstraints,
  violatesConstraints,
} from './lib/gameLogic'
import type { Tile, GamePhase } from './lib/types'

function pickAnswer(): string {
  return ANSWERS[Math.floor(Math.random() * ANSWERS.length)].toLowerCase()
}

function useGame() {
  const [answer, setAnswer] = useState(() => pickAnswer())
  const [guessHistory, setGuessHistory] = useState<Tile[][]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [activeInput, setActiveInput] = useState<'guess' | 'submission'>('guess')
  const [submissionValue, setSubmissionValue] = useState('')
  const [submissionLocked, setSubmissionLocked] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<('correct' | 'present' | 'absent')[] | null>(null)
  const [phase, setPhase] = useState<GamePhase>('playing')
  const [toast, setToast] = useState<string | null>(null)
  const [shakingRow, setShakingRow] = useState<number | null>(null)
  const [flippingRow, setFlippingRow] = useState<number | null>(null)
  const [submissionShaking, setSubmissionShaking] = useState(false)
  const [submissionFlipping, setSubmissionFlipping] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeRow = guessHistory.length

  function showToast(msg: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 1800)
  }

  function shakeRow(row: number) {
    setShakingRow(row)
    setTimeout(() => setShakingRow(null), 500)
  }

  function shakeSubmission() {
    setSubmissionShaking(true)
    setTimeout(() => setSubmissionShaking(false), 500)
  }

  const constraints = buildConstraints(guessHistory)

  function submitGuess() {
    if (currentGuess.length < WORD_LENGTH) {
      showToast('Not enough letters')
      shakeRow(activeRow)
      return
    }

    if (isRealWord(currentGuess)) {
      showToast('Must not be a real word!')
      shakeRow(activeRow)
      return
    }

    const violation = violatesConstraints(currentGuess, constraints)
    if (violation) {
      showToast(violation)
      shakeRow(activeRow)
      return
    }

    const states = scoreTiles(currentGuess, answer)
    const newTiles: Tile[] = currentGuess.split('').map((letter, i) => ({
      letter,
      state: states[i],
    }))

    setFlippingRow(activeRow)
    setTimeout(() => setFlippingRow(null), WORD_LENGTH * 80 + 450)

    const newHistory = [...guessHistory, newTiles]
    setGuessHistory(newHistory)
    setCurrentGuess('')

    if (newHistory.length >= MAX_GUESSES) {
      // No more guess rows — force submission focus
      setTimeout(() => setActiveInput('submission'), 200)
    }
  }

  function submitAnswer() {
    if (submissionValue.length < WORD_LENGTH) {
      showToast('Not enough letters')
      shakeSubmission()
      return
    }

    const violation = violatesConstraints(submissionValue, constraints)
    if (violation) {
      showToast(violation)
      shakeSubmission()
      return
    }

    const states = scoreTiles(submissionValue, answer)
    setSubmissionFlipping(true)
    setSubmissionResult(states as ('correct' | 'present' | 'absent')[])
    setTimeout(() => setSubmissionFlipping(false), WORD_LENGTH * 80 + 450)

    const won = submissionValue === answer
    setSubmissionLocked(true)
    setPhase(won ? 'won' : 'lost')
    setTimeout(() => setShowResult(true), WORD_LENGTH * 80 + 600)
  }

  const handleKey = useCallback((key: string) => {
    if (phase !== 'playing') return

    if (key === 'Tab') {
      setActiveInput(prev => prev === 'guess' ? 'submission' : 'guess')
      return
    }

    if (activeInput === 'guess') {
      if (key === 'Enter') {
        submitGuess()
      } else if (key === '⌫' || key === 'Backspace') {
        setCurrentGuess(g => g.slice(0, -1))
      } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(g => g + key.toLowerCase())
      }
    } else {
      if (key === 'Enter') {
        submitAnswer()
      } else if (key === '⌫' || key === 'Backspace') {
        setSubmissionValue(v => v.slice(0, -1))
      } else if (/^[a-zA-Z]$/.test(key) && submissionValue.length < WORD_LENGTH) {
        setSubmissionValue(v => v + key.toLowerCase())
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activeInput, currentGuess, submissionValue, guessHistory, answer])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Tab') {
        e.preventDefault()
        handleKey('Tab')
        return
      }
      handleKey(e.key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  function newGame() {
    setAnswer(pickAnswer())
    setGuessHistory([])
    setCurrentGuess('')
    setActiveInput('guess')
    setSubmissionValue('')
    setSubmissionLocked(false)
    setSubmissionResult(null)
    setPhase('playing')
    setShowResult(false)
    setToast(null)
  }

  return {
    answer,
    guessHistory,
    currentGuess,
    activeInput,
    setActiveInput,
    submissionValue,
    submissionLocked,
    submissionResult,
    phase,
    toast,
    shakingRow,
    flippingRow,
    submissionShaking,
    submissionFlipping,
    showHelp,
    setShowHelp,
    showResult,
    handleKey,
    newGame,
    activeRow,
  }
}

export default function App() {
  const game = useGame()

  const canSwitchToSubmission = game.guessHistory.length > 0 || game.submissionValue.length > 0

  return (
    <div className="flex flex-col h-svh font-sans">
      <Header onHelp={() => game.setShowHelp(true)} />

      <main className="flex flex-col flex-1 items-center pt-3 pb-2 px-3 gap-3">
        <div className="flex flex-col items-center gap-2 w-full">
          {/* Focus switcher */}
          {game.phase === 'playing' && (
            <div className="flex gap-1 bg-surface rounded-full p-1">
              <button
                onClick={() => game.setActiveInput('guess')}
                disabled={game.guessHistory.length >= MAX_GUESSES}
                className={[
                  'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                  game.activeInput === 'guess'
                    ? 'bg-game-border text-blue'
                    : 'text-text-muted hover:text-text-secondary',
                  game.guessHistory.length >= MAX_GUESSES ? 'opacity-30 cursor-default' : '',
                ].join(' ')}
              >
                Guess
              </button>
              <button
                onClick={() => game.setActiveInput('submission')}
                disabled={!canSwitchToSubmission && game.guessHistory.length === 0}
                className={[
                  'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                  game.activeInput === 'submission'
                    ? 'bg-blue/15 text-blue'
                    : 'text-text-muted hover:text-text-secondary',
                ].join(' ')}
              >
                Final Answer
              </button>
            </div>
          )}

          <GameBoard
            guessHistory={game.guessHistory}
            currentGuess={game.currentGuess}
            activeRow={game.activeRow}
            shakingRow={game.shakingRow}
            flippingRow={game.flippingRow}
            submissionValue={game.submissionValue}
            submissionLocked={game.submissionLocked}
            submissionShaking={game.submissionShaking}
            submissionFlipping={game.submissionFlipping}
            submissionResult={game.submissionResult}
            activeInput={game.activeInput}
          />
        </div>

        <Keyboard
          guessHistory={game.guessHistory}
          onKey={game.handleKey}
          disabled={game.phase !== 'playing'}
        />
      </main>

      <Toast message={game.toast} />

      {game.showHelp && <HelpModal onClose={() => game.setShowHelp(false)} />}

      {game.showResult && (
        <ResultModal
          won={game.phase === 'won'}
          answer={game.answer}
          guessCount={game.guessHistory.length}
          guessHistory={game.guessHistory}
          onNewGame={game.newGame}
        />
      )}
    </div>
  )
}
