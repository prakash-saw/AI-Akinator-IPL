import { useEffect, useState } from 'react'
import { X, Clock } from 'lucide-react'

const HistoryModal = ({ user, onClose }) => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/sessions?user=${encodeURIComponent(user.id)}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (mounted) setSessions(data)
      } catch (e) {
        console.error('History fetch failed', e)
        if (mounted) setError('Could not load history')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [user])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-slate-900 text-slate-100 rounded-2xl shadow-xl w-full max-w-3xl p-6 z-10 theme-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">Your Game History</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-slate-400">No saved sessions yet.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-auto p-1">
            {sessions.map((s) => (
              <div key={s._id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 theme-history-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-300 font-medium">{s.result?.guess || 'No guess'}</div>
                  <div className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-xs text-slate-400">{s.result?.isCorrect ? 'Correct' : (s.result?.actual ? `Incorrect — actual: ${s.result.actual}` : 'Incorrect')}</div>
                <div className="mt-2 text-xs text-slate-500">Turns: {s.history?.length || 0}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryModal
