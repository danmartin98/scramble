interface Props {
  message: string | null
}

export default function Toast({ message }: Props) {
  if (!message) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div
        className="bg-text-primary text-game-bg font-sans font-semibold text-sm px-4 py-2 rounded-lg shadow-lg"
        style={{ animation: 'fadeSlide 0.2s ease' }}
      >
        {message}
      </div>
    </div>
  )
}
