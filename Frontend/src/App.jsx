import React, { useState, useEffect, useRef } from 'react';
import { Brain, ChevronRight, Activity, Target, RotateCcw, CheckCircle2, XCircle, AlertCircle, HelpCircle, Trophy, Sparkles, User, Mail, Lock, LogOut } from 'lucide-react';

const MAX_QUESTIONS = 8;
const CONFIDENCE_THRESHOLD = 80;

// Local fallback questions (used when backend AI is unavailable)
const DEFAULT_QUESTIONS = [
  'Is the player primarily a batsman?',
  'Is the player primarily a bowler?',
  'Does the player often play as an all-rounder?',
  'Has the player ever captained an IPL side?',
  'Is the player known for finishing matches (finisher)?',
  'Has the player represented the national team?',
  'Does the player bowl spin rather than pace?',
  'Is the player associated with a single IPL franchise for most of their career?'
]

// ==========================================
// --- Sub-Components ---
// ==========================================

const Header = ({ gameState, onReset, user, onLogout }) => (
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

const ProgressBar = ({ current, max }) => (
  <div className="w-full bg-slate-800 rounded-full h-2.5 mb-6 border border-slate-700 overflow-hidden">
    <div 
      className="bg-gradient-to-r from-amber-500 to-amber-300 h-2.5 transition-all duration-500 ease-out" 
      style={{ width: `${(current / max) * 100}%` }}
    ></div>
  </div>
);

const ConfidenceMeter = ({ value }) => {
  let color = 'text-red-400';
  if (value > 40) color = 'text-amber-400';
  if (value > 70) color = 'text-green-400';

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      <div className={`text-4xl font-black ${color} tracking-tighter mb-1 drop-shadow-md`}>
        {value || 0}%
      </div>
      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">AI Confidence</div>
    </div>
  );
};

const IdleScreen = ({ onStart }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-900/40 rounded-3xl border border-slate-800/50 backdrop-blur-xl">
    <Trophy className="w-20 h-20 text-amber-500 mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
    <h2 className="text-4xl font-black mb-4 tracking-tight">Think of an IPL Player</h2>
    <p className="text-lg text-slate-400 max-w-lg mb-8 leading-relaxed">
      I will ask up to {MAX_QUESTIONS} intelligent questions to deduce exactly who you are thinking of. Present or past legends, the AI knows them all.
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

const ErrorScreen = ({ errorMsg, onRetry }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-red-950/20 rounded-3xl border border-red-900/50">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h2 className="text-2xl font-bold mb-2">Connection Interrupted</h2>
    <p className="text-slate-400 mb-6">{errorMsg}</p>
    <button onClick={onRetry} className="px-6 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-500 transition-colors">
      Try Again
    </button>
  </div>
);

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

const PlayingScreen = ({ history, currentTurn, loading, gameState, handleAnswer, handleResult }) => (
  <div className="flex-1 flex flex-col bg-slate-900/60 rounded-3xl border border-slate-800/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/50">
    <div className="flex justify-between items-end mb-2">
      <span className="text-sm font-semibold text-amber-500 uppercase tracking-widest">
        {gameState === 'guessing' ? 'Final Deduction' : `Question ${history.length + 1}`}
      </span>
      <span className="text-xs text-slate-500 font-medium">Max {MAX_QUESTIONS}</span>
    </div>
    <ProgressBar current={history.length} max={MAX_QUESTIONS} />

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

const TelemetrySidebar = ({ currentTurn, history, loading, chatEndRef }) => (
  <div className="w-full lg:w-80 flex flex-col gap-6">
    {/* Confidence Widget */}
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

    {/* Deduction History */}
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

// ==========================================
// --- Auth Components ---
// ==========================================

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    ;(async () => {
      try {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
        const body = isLogin ? { email, password } : { name, email, password }
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        const data = await res.json()
        if (!res.ok) {
          alert(data.error || 'Authentication failed')
          setLoading(false)
          return
        }
        localStorage.setItem('token', data.token)
        onLogin(data.user)
      } catch (err) {
        console.error('Auth error', err)
        alert('Authentication failed')
      } finally {
        setLoading(false)
      }
    })()
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-500/20 mb-4">
            <Brain className="w-8 h-8 text-slate-950" />
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400 text-sm mt-2 text-center">
            {isLogin ? 'Sign in to continue your IPL deduction sessions.' : 'Register to start guessing IPL legends.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Register'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            {isLogin ? 'Register here' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// --- Main App Component ---
// ==========================================

export default function App() {
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, playing, guessing, result, error
  const [history, setHistory] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null); // { question, reasoning, confidence, type }
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const chatEndRef = useRef(null);

  // Auto-scroll history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, currentTurn]);

  // Auto-login if token present
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) {
          localStorage.removeItem('token')
          return
        }
        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        console.error('Auto-login failed', err)
        localStorage.removeItem('token')
      }
    })()
  }, [])

  const startGame = async () => {
    setGameState('playing');
    setHistory([]);
    setCurrentTurn(null);
    await fetchNextTurn([]);
  };

  const fetchNextTurn = async (currentHistory) => {
    setLoading(true);
    setErrorMsg('');

    // Send history to backend; backend will call the model using a server-side API key
    try {
      const resp = await fetch('/api/ai/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: currentHistory })
      })

      if (!resp.ok) throw new Error('AI backend error')
      const data = await resp.json()
      setCurrentTurn(data)
      if (data?.type === 'guess') setGameState('guessing')
    } catch (error) {
      console.error('AI Error:', error)
      // Client-side fallback: use DEFAULT_QUESTIONS if available and we haven't reached MAX_QUESTIONS
      if (currentHistory.length < MAX_QUESTIONS) {
        const idx = Math.min(currentHistory.length, DEFAULT_QUESTIONS.length - 1)
        setCurrentTurn({
          type: 'question',
          text: DEFAULT_QUESTIONS[idx],
          reasoning: 'Client-side fallback question',
          confidence: 20 + Math.min(40, idx * 5)
        })
        // keep gameState as 'playing'
      } else {
        setErrorMsg('The AI encountered a connection issue. Try again later.')
        setGameState('error')
      }
    } finally {
      setLoading(false)
    }
  };

  const handleAnswer = async (answer) => {
    const newHistory = [...history, { 
      question: currentTurn.text, 
      answer: answer, 
      confidence: currentTurn.confidence 
    }];
    setHistory(newHistory);
    setCurrentTurn(null);
    await fetchNextTurn(newHistory);
  };

  const handleResult = (isCorrect) => {
    setGameState('result');
    // Save outcome to backend/Firestore here if needed
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null);
    setGameState('idle');
    setHistory([]);
    setCurrentTurn(null);
  };

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
      {/* Background ambient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10 flex flex-col min-h-screen">
        <Header gameState={gameState} onReset={startGame} user={user} onLogout={handleLogout} />

        <main className="flex-1 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col">
            {gameState === 'idle' && <IdleScreen onStart={startGame} />}
            {gameState === 'error' && <ErrorScreen errorMsg={errorMsg} onRetry={startGame} />}
            
            {(gameState === 'playing' || gameState === 'guessing') && (
              <PlayingScreen 
                history={history} 
                currentTurn={currentTurn} 
                loading={loading} 
                gameState={gameState} 
                handleAnswer={handleAnswer} 
                handleResult={handleResult} 
              />
            )}

            {gameState === 'result' && <ResultScreen onRestart={startGame} />}
          </div>

          <TelemetrySidebar 
            currentTurn={currentTurn} 
            history={history} 
            loading={loading} 
            chatEndRef={chatEndRef} 
          />
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}