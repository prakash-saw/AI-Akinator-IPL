import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { Brain } from 'lucide-react';

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
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

        {isLogin ? <Login onLogin={onLogin} /> : <Register onLogin={onLogin} />}

        <div className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
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

export default AuthScreen;
