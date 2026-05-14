import ProgressBar from './ProgressBar';
import { CheckCircle2, XCircle, HelpCircle, Activity, Sparkles } from 'lucide-react';

const PlayingScreen = ({ history, currentTurn, loading, gameState, handleAnswer, handleResult, max }) => (
  <div className="flex-1 flex flex-col bg-slate-900/60 rounded-3xl border border-slate-800/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/50">
    <div className="flex justify-between items-end mb-2">
      <span className="text-sm font-semibold text-amber-500 uppercase tracking-widest">
        {gameState === 'guessing' ? 'Final Deduction' : `Question ${history.length + 1}`}
      </span>
      <span className="text-xs text-slate-500 font-medium">Max {max}</span>
    </div>
    <ProgressBar current={history.length} max={max} />

    <div className="flex-1 flex flex-col justify-center items-center py-8 min-h-[250px]">
      {loading ? (
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-amber-500 animate-spin mb-6"></div>
          <p className="text-slate-400 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Analyzing probabilities...
          </p>
        </div>
      ) : currentTurn ? (
        <div className="w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          {gameState === 'guessing' ? (
            <>
              <p className="text-xl text-slate-400 mb-4">I have made my deduction...</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-8 leading-tight">
                You are thinking of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{currentTurn.text}</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <button onClick={() => handleResult(true)} className="flex items-center gap-2 px-8 py-4 bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500 hover:text-slate-950 font-bold rounded-2xl transition-all active:scale-95">
                  <CheckCircle2 className="w-5 h-5" /> Yes, you got it!
                </button>
                <button onClick={() => handleResult(false)} className="flex items-center gap-2 px-8 py-4 bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white font-bold rounded-2xl transition-all active:scale-95">
                  <XCircle className="w-5 h-5" /> No, wrong player
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 leading-snug max-w-2xl mx-auto">
                "{currentTurn.text}"
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
                {['Yes', 'No', "Don't Know", 'Probably'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="px-4 py-4 sm:py-5 bg-slate-800/50 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-semibold rounded-2xl border border-slate-700/50 hover:border-amber-400 transition-all active:scale-95 flex flex-col items-center gap-2 group"
                  >
                    {opt === 'Yes' && <CheckCircle2 className="w-5 h-5 group-hover:text-slate-950 text-green-500" />}
                    {opt === 'No' && <XCircle className="w-5 h-5 group-hover:text-slate-950 text-red-500" />}
                    {opt === "Don't Know" && <HelpCircle className="w-5 h-5 group-hover:text-slate-950 text-slate-500" />}
                    {opt === 'Probably' && <Activity className="w-5 h-5 group-hover:text-slate-950 text-blue-400" />}
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  </div>
);

export default PlayingScreen;
