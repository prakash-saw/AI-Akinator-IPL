import { Trophy, ChevronRight } from 'lucide-react';

const IdleScreen = ({ onStart, maxQuestions }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-[var(--panel-border)] backdrop-blur-xl shadow-[var(--shadow)] theme-panel">
    <Trophy className="w-20 h-20 text-[var(--accent)] mb-6 drop-shadow-[0_0_30px_rgba(245,158,11,0.35)]" />
    <h2 className="text-4xl font-black mb-4 tracking-tight text-[var(--text-color)]">Think of an IPL Player</h2>
    <p className="text-lg text-[var(--subtext-color)] max-w-lg mb-8 leading-relaxed">
      Answer easy, human-friendly questions while the AI analyzes the best fit from IPL history. You can switch themes anytime for a cleaner view.
    </p>
    <button 
      onClick={onStart}
      className="group relative px-8 py-4 bg-[var(--accent)] text-slate-950 font-bold text-lg rounded-full overflow-hidden shadow-[0_20px_50px_rgba(245,158,11,0.25)] hover:shadow-[0_24px_70px_rgba(245,158,11,0.35)] transition-all active:scale-95"
    >
      <span className="relative flex items-center gap-2">
        Start Challenge <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </span>
    </button>
  </div>
);

export default IdleScreen;
