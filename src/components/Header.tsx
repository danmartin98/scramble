import { HelpCircle } from 'lucide-react'

interface Props {
  onHelp: () => void
}

export default function Header({ onHelp }: Props) {
  return (
    <header className="flex items-center justify-between px-4 py-2">
      <div className="w-8" />
      <h1 className="font-sans font-bold text-2xl tracking-widest text-text-primary">
      ScR<span className="text-present">a</span>MbLe<span className="text-correct">.</span>

      </h1>
      <button
        onClick={onHelp}
        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors"
      >
        <HelpCircle size={20} />
      </button>
    </header>
  )
}
