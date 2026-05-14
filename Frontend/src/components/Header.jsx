import { RotateCcw, User, LogOut, Sun, Moon, Clock } from 'lucide-react';

const Header = ({ gameState, onReset, user, onLogout, onToggleTheme, theme, onShowHistory }) => (
  <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8 pb-4 border-b theme-border">
    <div className="flex items-center gap-3">
      <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2 rounded-2xl shadow-lg shadow-orange-500/20">
        <img src="/logo.svg" alt="logo" className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold theme-heading-gradient">
          IPL Neural Guesser
        </h1>
        <p className="text-xs text-[var(--subtext-color)] font-medium tracking-wide uppercase">Fast, friendly, and Gemini-enhanced</p>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-3 justify-end">
      {user && (
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800 theme-toolbar-button">
          <User className="w-4 h-4 text-amber-500" />
          <span>{user.name}</span>
        </div>
      )}
      {gameState !== 'idle' && (
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 theme-toolbar-button"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      )}
      <button onClick={onShowHistory} className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors bg-slate-900/50 px-3 py-2 rounded-full border border-slate-800 theme-toolbar-button">
        <Clock className="w-4 h-4" />
        <span className="hidden sm:inline">History</span>
      </button>
      <button onClick={onToggleTheme} className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors bg-slate-900/50 px-3 py-2 rounded-full border border-slate-800 theme-toolbar-button">
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        <span className="hidden sm:inline">Switch to {theme === 'dark' ? 'light' : 'dark'} mode</span>
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
