import { Trophy, ChevronRight } from 'lucide-react';

const IdleScreen = ({ onStart, maxQuestions }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-900/40 rounded-3xl border border-slate-800/50 backdrop-blur-xl">
    <Trophy className="w-20 h-20 text-amber-500 mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
    <h2 className="text-4xl font-black mb-4 tracking-tight">Think of an IPL Player</h2>
    <p className="text-lg text-slate-400 max-w-lg mb-8 leading-relaxed">
      I will ask up to {maxQuestions} intelligent questions to deduce exactly who you are thinking of. Present or past legends, the AI knows them all.
    </p>
    <button 
      onClick={onStart}
      className="group relative px-8 py-4 bg-slate-100 text-slate-950 font-bold text-lg rounded-full overflow-hidden shadow-[0_0_40px_rgba(241,245,249,0.15)] hover:shadow-[0_0_60px_rgba(241,245,249,0.25)] transition-all active:scale-95"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <span className="relative flex items-center gap-2">
        Start Challenge <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </span>
    </button>
  </div>
);

export default IdleScreen;
