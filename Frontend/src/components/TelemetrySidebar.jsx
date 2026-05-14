import { Target } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';

const TelemetrySidebar = ({ currentTurn, history, loading, chatEndRef }) => (
  <div className="w-full lg:w-80 flex flex-col gap-6">
    <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-xl">
       <div className="flex items-center gap-2 mb-4">
         <Target className="w-5 h-5 text-amber-500" />
         <h3 className="font-bold text-slate-200">AI Telemetry</h3>
       </div>
       <ConfidenceMeter value={currentTurn ? currentTurn.confidence : (history.length > 0 ? history[history.length-1].confidence : 0)} />
       
       {currentTurn?.reasoning && !loading && (
         <div className="mt-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 text-sm text-slate-400 italic">
           <span className="text-blue-400 font-semibold not-italic block mb-1">Internal Logic:</span>
           {currentTurn.reasoning}
         </div>
       )}
    </div>

    <div className="flex-1 bg-slate-900/60 border border-slate-800/60 rounded-3xl flex flex-col overflow-hidden backdrop-blur-xl max-h-[400px] lg:max-h-none">
      <div className="p-4 border-b border-slate-800/60 bg-slate-900/80">
        <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Deduction Log</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {history.length === 0 ? (
          <p className="text-slate-500 text-sm text-center italic mt-4">No data collected yet.</p>
        ) : (
          history.map((h, i) => (
            <div key={i} className="text-sm border-l-2 border-slate-700 pl-3 py-1">
              <p className="text-slate-300 font-medium mb-1"><span className="text-slate-500 mr-2">Q{i+1}.</span>{h.question}</p>
              <div className="flex items-center gap-2">
                 <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                   h.answer === 'Yes' ? 'bg-green-500/10 text-green-400' :
                   h.answer === 'No' ? 'bg-red-500/10 text-red-400' :
                   h.answer === 'Probably' ? 'bg-blue-500/10 text-blue-400' :
                   'bg-slate-700 text-slate-300'
                 }`}>
                   {h.answer}
                 </span>
                 <span className="text-xs text-slate-500">Conf: {h.confidence}%</span>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  </div>
);

export default TelemetrySidebar;
