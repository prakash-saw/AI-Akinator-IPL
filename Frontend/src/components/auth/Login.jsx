import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (err) {
      console.error('Auth error', err);
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="email"
          placeholder="Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600 theme-input"
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
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600 theme-input"
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
          'Sign In'
        )}
      </button>
      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={async () => {
            if (!email) return alert('Please enter your email first')
            try {
              const res = await fetch('/api/auth/forgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              })
              if (!res.ok) throw new Error('Failed to send')
              alert('Password reset email sent (check your inbox).')
            } catch (err) {
              console.error('Forgot password error', err)
              alert('Could not send reset email')
            }
          }}
          className="text-sm text-amber-400 hover:text-amber-300 font-semibold"
        >
          Forgot password?
        </button>
      </div>
    </form>
  );
};

export default Login;
