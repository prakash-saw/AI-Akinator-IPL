import { RotateCcw, User, LogOut, Sun, Moon, Clock } from 'lucide-react';

const Header = ({ gameState, onReset, user, onLogout, onToggleTheme, theme, onShowHistory }) => (
  <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
    <div className="flex items-center gap-3">
      <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2 rounded-xl shadow-lg shadow-orange-500/20">
        <img src="/logo.svg" alt="logo" className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
          IPL Neural Guesser
        </h1>
        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Powered by Gemini AI</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {user && (
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
          <User className="w-4 h-4 text-amber-500" />
          <span>{user.name}</span>
        </div>
      )}
      {gameState !== 'idle' && (
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      )}
      <button onClick={onShowHistory} className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors bg-slate-900/50 px-3 py-2 rounded-full border border-slate-800">
        <Clock className="w-4 h-4" />
        <span className="hidden sm:inline">History</span>
      </button>
      <button onClick={onToggleTheme} className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors bg-slate-900/50 px-3 py-2 rounded-full border border-slate-800">
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
      <button 
        onClick={onLogout}
        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-full border border-red-500/20"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden md:inline">Logout</span>
      </button>
    </div>
  </header>
);

export default Header;
