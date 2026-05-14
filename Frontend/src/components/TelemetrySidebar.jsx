import { useState } from 'react';
import { Target, X } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';

const TelemetrySidebar = ({ currentTurn, history, loading, chatEndRef, theme = 'dark' }) => {
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_LIMIT = 6;

  const cardBase = theme === 'dark'
    ? 'bg-slate-900/60 border border-slate-800/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white border border-gray-200 text-slate-900 shadow-sm';

  const logBase = theme === 'dark'
    ? 'flex-1 bg-slate-900/60 border border-slate-800/60 rounded-3xl flex flex-col overflow-hidden backdrop-blur-xl max-h-[400px]'
    : 'flex-1 bg-white border border-gray-200 rounded-3xl flex flex-col overflow-hidden max-h-[400px]';

  const headerBase = theme === 'dark' ? 'p-4 border-b border-slate-800/60 bg-slate-900/80' : 'p-4 border-b border-gray-200 bg-white/50';

  const itemsToShow = showAll ? history : history.slice(-VISIBLE_LIMIT);

  return (
    <div className="w-full lg:w-80 flex flex-col gap-6">
      <div className={`${cardBase} rounded-3xl p-6`}>
         <div className="flex items-center gap-2 mb-4">
           <Target className="w-5 h-5 text-amber-500" />
           <h3 className={`${theme === 'dark' ? 'font-bold text-slate-200' : 'font-bold text-slate-900'}`}>AI Telemetry</h3>
         </div>
         <ConfidenceMeter value={currentTurn ? currentTurn.confidence : (history.length > 0 ? history[history.length-1].confidence : 0)} />
         
         {currentTurn?.reasoning && !loading && (
           <div className={`${theme === 'dark' ? 'mt-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 text-sm text-slate-400 italic' : 'mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-slate-700 italic'}`}>
             <span className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-semibold not-italic block mb-1`}>Internal Logic:</span>
             {currentTurn.reasoning}
           </div>
         )}
      </div>

      <div className={logBase}>
        <div className={headerBase}>
          <h3 className={`${theme === 'dark' ? 'font-bold text-slate-200 text-sm uppercase tracking-wider' : 'font-bold text-slate-900 text-sm uppercase tracking-wider'}`}>Deduction Log</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {history.length === 0 ? (
            <p className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'} text-sm text-center italic mt-4`}>No data collected yet.</p>
          ) : (
            itemsToShow.map((h, idx) => {
              const originalIndex = history.length - itemsToShow.length + idx;
              return (
                <div key={originalIndex} className={`text-sm border-l-2 pl-3 py-1 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'} font-medium mb-1`}><span className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'} mr-2`}>Q{originalIndex+1}.</span>{h.question}</p>
                  <div className="flex items-center gap-2">
                     <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                       h.answer === 'Yes' ? (theme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600') :
                       h.answer === 'No' ? (theme === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600') :
                       h.answer === 'Probably' ? (theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') :
                       (theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-slate-700')
                     }`}>
                       {h.answer}
                     </span>
                     <span className="text-xs text-slate-500">Conf: {h.confidence}%</span>
                  </div>
                </div>
              )
            })
          )}

          {!showAll && history.length > VISIBLE_LIMIT && (
            <div className="flex justify-center">
              <button onClick={() => setShowAll(true)} className={`${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} text-sm font-medium hover:underline`}>See more</button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {showAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAll(false)} />
          <div className={`${theme === 'dark' ? 'relative bg-slate-900 text-slate-100' : 'relative bg-white text-slate-900 border border-gray-200'} rounded-2xl shadow-xl w-full max-w-lg p-4 z-10`}> 
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Deduction Log</h3>
              <button onClick={() => setShowAll(false)} className="p-2 rounded-full hover:bg-slate-800/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-auto space-y-3 p-1">
              {history.map((h, i) => (
                <div key={i} className={`${theme === 'dark' ? 'p-3 bg-slate-800/60 rounded-xl border border-slate-700' : 'p-3 bg-gray-50 rounded-xl border border-gray-100'}`}>
                  <div className="text-sm font-medium mb-1">Q{i+1}. {h.question}</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      h.answer === 'Yes' ? (theme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600') :
                      h.answer === 'No' ? (theme === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600') :
                      h.answer === 'Probably' ? (theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') :
                      (theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-slate-700')
                    }`}>{h.answer}</span>
                    <span className="text-xs text-slate-500">Conf: {h.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TelemetrySidebar;
