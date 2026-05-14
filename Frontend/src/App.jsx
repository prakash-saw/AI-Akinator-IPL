import { useState, useEffect, useRef } from 'react';
import AuthScreen from './components/auth/AuthScreen';
import Header from './components/Header';
import PlayingScreen from './components/PlayingScreen';
import TelemetrySidebar from './components/TelemetrySidebar';
import IdleScreen from './components/IdleScreen';
import ErrorScreen from './components/ErrorScreen';
import ResultScreen from './components/ResultScreen';
import FeedbackScreen from './components/FeedbackScreen';
import HistoryModal from './components/HistoryModal';

const MAX_QUESTIONS = 8;
// (confidence threshold handled by backend)

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
];

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [gameState, setGameState] = useState('idle'); // idle, playing, guessing, result, error
  const [history, setHistory] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null); // { question, reasoning, confidence, type }
  const [lastGuess, setLastGuess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHistory, setShowHistory] = useState(false)
  
  const chatEndRef = useRef(null);

  // Auto-scroll history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, currentTurn]);

  // Auto-login if token present
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          localStorage.removeItem('token');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('Auto-login failed', err);
        localStorage.removeItem('token');
      }
    })();
  }, []);

  const startGame = async () => {
    setGameState('playing');
    setHistory([]);
    setCurrentTurn(null);
    await fetchNextTurn([]);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  const fetchNextTurn = async (currentHistory) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const resp = await fetch('/api/ai/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: currentHistory })
      });

      if (!resp.ok) throw new Error('AI backend error');
      const data = await resp.json();
      setCurrentTurn(data);
      if (data?.type === 'guess') setGameState('guessing');
    } catch (error) {
      console.error('AI Error:', error);
      // Client-side fallback: use DEFAULT_QUESTIONS if available and we haven't reached MAX_QUESTIONS
      if (currentHistory.length < MAX_QUESTIONS) {
        const idx = Math.min(currentHistory.length, DEFAULT_QUESTIONS.length - 1);
        setCurrentTurn({
          type: 'question',
          text: DEFAULT_QUESTIONS[idx],
          reasoning: 'Client-side fallback question',
          confidence: 20 + Math.min(40, idx * 5)
        });
        // keep gameState as 'playing'
      } else {
        setErrorMsg('The AI encountered a connection issue. Try again later.');
        setGameState('error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer) => {
    const newHistory = [...history, { 
      question: currentTurn.text, 
      attribute: currentTurn.attribute || null,
      answer: answer, 
      confidence: currentTurn.confidence 
    }];
    setHistory(newHistory);
    setCurrentTurn(null);
    await fetchNextTurn(newHistory);
  };

  const saveSession = async (result) => {
    try {
      const body = { user: user.id, history, result }
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    } catch (err) {
      console.error('Failed to save session', err)
    }
  }

  const handleResult = async (isCorrect) => {
    // if correct, save session and show result
    if (isCorrect) {
      const result = { guess: currentTurn?.text || lastGuess, isCorrect: true }
      await saveSession(result)
      setGameState('result')
      return
    }

    // if incorrect, ask user for feedback (actual player)
    setLastGuess(currentTurn?.text || lastGuess)
    setGameState('feedback')
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setGameState('idle');
    setHistory([]);
    setCurrentTurn(null);
  };

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-amber-500/30 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* Background ambient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10 flex flex-col min-h-screen">
        <Header gameState={gameState} onReset={startGame} user={user} onLogout={handleLogout} onToggleTheme={toggleTheme} theme={theme} onShowHistory={() => setShowHistory(true)} />

        <main className="flex-1 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col">
            {gameState === 'idle' && <IdleScreen onStart={startGame} maxQuestions={MAX_QUESTIONS} />}
            {gameState === 'error' && <ErrorScreen errorMsg={errorMsg} onRetry={startGame} />}
            
            {(gameState === 'playing' || gameState === 'guessing') && (
              <PlayingScreen 
                history={history} 
                currentTurn={currentTurn} 
                loading={loading} 
                gameState={gameState} 
                handleAnswer={handleAnswer} 
                handleResult={handleResult} 
                max={MAX_QUESTIONS}
              />
            )}

            {gameState === 'feedback' && (
              <FeedbackScreen
                lastGuess={lastGuess}
                onSubmit={async (actual) => {
                  const result = { guess: lastGuess, isCorrect: false, actual: actual }
                  await saveSession(result)
                  setGameState('result')
                }}
                onSkip={async () => {
                  const result = { guess: lastGuess, isCorrect: false }
                  await saveSession(result)
                  setGameState('result')
                }}
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

      {showHistory && <HistoryModal user={user} onClose={() => setShowHistory(false)} />}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}