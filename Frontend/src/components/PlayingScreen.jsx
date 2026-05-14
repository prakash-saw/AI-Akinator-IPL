import ProgressBar from './ProgressBar';
import { CheckCircle2, XCircle, HelpCircle, Activity, Sparkles } from 'lucide-react';

const PlayingScreen = ({ history, currentTurn, loading, gameState, handleAnswer, handleResult, max }) => (
  <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-slate-950/90 rounded-[2rem] border border-amber-500/20 backdrop-blur-xl p-6 sm:p-8 shadow-[0_35px_120px_rgba(15,23,42,0.35)] theme-panel">
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
      <div>
        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/10 text-amber-200 text-xs uppercase tracking-[0.2em] font-semibold">
          {gameState === 'guessing' ? 'Final Deduction' : `Question ${history.length + 1}`}
        </span>
      </div>
      <span className="text-xs text-slate-400 font-medium">Max {max}</span>
    </div>
    <ProgressBar current={history.length} max={max} />

    <div className="flex-1 flex flex-col justify-center items-center py-8 min-h-[260px]">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-18 h-18 rounded-full border-4 border-slate-800 border-t-amber-400 animate-spin mb-6"></div>
          <p className="text-slate-300 font-medium flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Analyzing probabilities...
          </p>
        </div>
      ) : currentTurn ? (
        <div className="w-full max-w-3xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            {gameState === 'guessing' ? (
              <>
                <p className="text-lg text-slate-400 mb-4">I have made my deduction...</p>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
                  You are thinking of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{currentTurn.text}</span>
                </h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <button onClick={() => handleResult(true)} className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-400/10 text-emerald-200 border border-emerald-400/30 hover:bg-emerald-400 hover:text-slate-950 font-semibold rounded-3xl transition-all active:scale-[0.98]">
                    <CheckCircle2 className="w-5 h-5" /> Yes, you got it!
                  </button>
                  <button onClick={() => handleResult(false)} className="flex items-center justify-center gap-2 px-8 py-4 bg-rose-500/10 text-rose-200 border border-rose-500/30 hover:bg-rose-500 hover:text-white font-semibold rounded-3xl transition-all active:scale-[0.98]">
                    <XCircle className="w-5 h-5" /> No, wrong player
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm uppercase tracking-[0.24em] text-amber-300 mb-3">Answer the question</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 leading-snug max-w-2xl mx-auto">
                  “{currentTurn.text}”
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {['Yes', 'No', "Don't Know", 'Probably'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="px-4 py-4 sm:py-5 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-semibold rounded-[1.75rem] border border-slate-800/70 hover:border-amber-400 transition-all active:scale-[0.98] flex flex-col items-center gap-2 group"
                    >
                      {opt === 'Yes' && <CheckCircle2 className="w-5 h-5 group-hover:text-slate-950 text-emerald-300" />}
                      {opt === 'No' && <XCircle className="w-5 h-5 group-hover:text-slate-950 text-rose-300" />}
                      {opt === "Don't Know" && <HelpCircle className="w-5 h-5 group-hover:text-slate-950 text-slate-400" />}
                      {opt === 'Probably' && <Activity className="w-5 h-5 group-hover:text-slate-950 text-sky-300" />}
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
            {currentTurn?.reasoning && (
              <p className="mt-6 text-sm text-slate-400 italic">{currentTurn.reasoning}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  </div>
);

export default PlayingScreen;
