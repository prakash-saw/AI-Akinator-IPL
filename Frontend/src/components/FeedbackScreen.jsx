import { useState } from 'react'

const FeedbackScreen = ({ lastGuess, onSubmit, onSkip }) => {
  const [actual, setActual] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e?.preventDefault()
    setLoading(true)
    try {
      await onSubmit(actual || null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-900/60 rounded-3xl border border-slate-800/60 backdrop-blur-xl theme-panel">
      <h2 className="text-3xl font-bold mb-4">Sorry — I got it wrong</h2>
      <p className="text-slate-400 mb-6 max-w-lg">I guessed <strong className="text-white">{lastGuess}</strong>. Who were you thinking of?</p>

      <form onSubmit={submit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Type the player's name (optional)"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 theme-input"
        />

        <div className="flex gap-3 justify-center">
          <button type="submit" disabled={loading} className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl">
            {loading ? 'Saving...' : 'Submit'}
          </button>
          <button type="button" onClick={onSkip} className="px-6 py-3 bg-slate-800 text-slate-200 rounded-xl border">
            Skip
          </button>
        </div>
      </form>
    </div>
  )
}

export default FeedbackScreen
