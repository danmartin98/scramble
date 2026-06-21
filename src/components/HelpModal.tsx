interface Props {
  onClose: () => void
}

export default function HelpModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-[300] p-3"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-game-border rounded-2xl px-5 py-8 w-full max-w-[380px] flex flex-col animate-modal-in max-h-[90vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3.5 right-4 bg-transparent border-none text-text-secondary text-2xl cursor-pointer font-sans"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="text-[22px] font-bold tracking-[4px] text-text-primary text-center mb-1">
          ScR<span className="text-present">a</span>MbLe<span className="text-correct">.</span>
        </div>
        <div className="text-[10px] text-text-dimmer text-center tracking-[2px] uppercase mb-5">
          Unscramble the word in 5 guesses or less.
        </div>

        <div className="mb-5">
          <div className="text-[13px] tracking-[2px] text-blue uppercase mb-3 font-bold">
            How to Play
          </div>
          <p className="text-[14px] text-text-secondary leading-[1.8] mb-2.5">
            A secret 5-letter word is hidden. You have <strong>5 guesses</strong> to
            figure it out — but every guess must be a <strong>jumble of letters</strong>,
            not a real word. After each guess, tiles reveal how close you were:
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[3px] flex items-center justify-center text-[16px] font-bold text-white shrink-0 bg-correct">
                A
              </div>
              <span className="text-[14px] text-text-secondary leading-[1.5]">
                <strong>Green</strong> — right letter, right position
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[3px] flex items-center justify-center text-[16px] font-bold text-white shrink-0 bg-present">
                B
              </div>
              <span className="text-[14px] text-text-secondary leading-[1.5]">
                <strong>Yellow</strong> — right letter, wrong position
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[3px] flex items-center justify-center text-[16px] font-bold text-white shrink-0 bg-absent">
                C
              </div>
              <span className="text-[14px] text-text-secondary leading-[1.5]">
                <strong>Grey</strong> — letter not in the word
              </span>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="text-[13px] tracking-[2px] text-blue uppercase mb-3 font-bold">
            The Rules
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2.5 items-start text-[14px] text-text-secondary leading-[1.7]">
              <span className="text-[16px] shrink-0">🔀</span>
              <span>
                <strong>No real words</strong> — guesses must be non-dictionary
                jumbles. Valid words are rejected.
              </span>
            </div>
            <div className="flex gap-2.5 items-start text-[14px] text-text-secondary leading-[1.7]">
              <span className="text-[16px] shrink-0">🟩</span>
              <span>
                <strong>Greens are locked</strong> — a green letter must stay in
                the same position in every future guess.
              </span>
            </div>
            <div className="flex gap-2.5 items-start text-[14px] text-text-secondary leading-[1.7]">
              <span className="text-[16px] shrink-0">🟨</span>
              <span>
                <strong>Yellows must move</strong> — a yellow letter must appear
                somewhere in every future guess (just not the same spot).
              </span>
            </div>
            <div className="flex gap-2.5 items-start text-[14px] text-text-secondary leading-[1.7]">
              <span className="text-[16px] shrink-0">💡</span>
              <span>
                <strong>Final Answer row</strong> — submit the real word whenever
                you're ready. You don't have to use all 5 guess rows first.
                One shot only.
              </span>
            </div>
          </div>
        </div>

        <button
          className="mt-3 bg-correct text-white border-none rounded-lg py-3 text-[13px] font-bold font-sans tracking-[1px] w-full cursor-pointer"
          onClick={onClose}
        >
          Let's Play
        </button>
      </div>
    </div>
  )
}
