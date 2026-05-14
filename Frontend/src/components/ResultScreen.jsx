import { Trophy } from 'lucide-react';

const ResultScreen = ({ onRestart }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-900/60 rounded-3xl border border-slate-800/60 backdrop-blur-xl animate-in zoom-in-95 duration-500">
    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
       <Trophy className="w-12 h-12 text-slate-950" />
    </div>
    <h2 className="text-4xl font-black mb-4">Session Complete</h2>
    <p className="text-xl text-slate-400 mb-8 max-w-md">
      Thanks for playing! The AI learns from every interaction to build a better probability engine.
    </p>
    <button onClick={onRestart} className="px-8 py-4 bg-slate-100 text-slate-950 font-bold rounded-full hover:bg-white transition-colors">
      Play Again
    </button>
  </div>
);

export default ResultScreen;
