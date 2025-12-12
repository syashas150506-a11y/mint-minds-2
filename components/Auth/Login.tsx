
import React, { useState } from 'react';
import { Input } from '../UI/Input';
import { Brain, Loader2, RotateCcw, Code2 } from 'lucide-react';
import { User } from '../../types';
import { userService } from '../../services/userService';

interface LoginProps {
  onLogin: (user: User) => void;
  onGoToSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onGoToSignup }) => {
  const [identifier, setIdentifier] = useState(''); // Email or Mobile
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const user = await userService.login(identifier, password);
        onLogin(user);
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Login failed. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear all user data? This cannot be undone.')) {
        localStorage.removeItem('wealthwaves_users');
        window.location.reload();
    }
  };

  const fillCredentials = (u: string, p: string) => {
      setIdentifier(u);
      setPassword(p);
  };

  return (
    <div className="w-full max-w-md p-10 glass-panel rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in border border-white/50 bg-white/80">
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-600 text-white shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition-transform duration-500">
        <Brain size={56} />
      </div>
      <h1 className="text-4xl font-extrabold mb-2 text-slate-800 text-center tracking-tight">Wealth Waves</h1>
      <p className="text-slate-500 mb-8 text-center text-sm font-medium">Where every rupee finds its purpose</p>

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <Input
          label="Email or Mobile Number"
          type="text"
          placeholder="email@example.com or 1234567890"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          disabled={isLoading}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        
        {error && <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-emerald-200 font-bold rounded-xl text-sm px-5 py-4 text-center transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-emerald-500/20 mt-4 tracking-wide flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-slate-500 text-sm font-medium">
        New to Wealth Waves?{' '}
        <button
          onClick={onGoToSignup}
          disabled={isLoading}
          className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-colors ml-1 disabled:opacity-50"
        >
          Create Account
        </button>
      </div>

      {/* Developer Shortcuts */}
      <div className="mt-8 w-full border-t border-slate-200 pt-4">
          <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Code2 size={12} /> DEV TOOLS</span>
              <button 
                onClick={handleResetData}
                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                title="Clear all stored users"
              >
                <RotateCcw size={12} /> Reset Data
              </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <button 
                  onClick={() => fillCredentials('demo', 'demo')}
                  className="p-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg text-xs text-left transition-colors group"
              >
                  <div className="font-bold text-slate-700 group-hover:text-emerald-700">Demo User</div>
                  <div className="text-slate-400 text-[10px]">Skip Onboarding</div>
              </button>
              <button 
                  onClick={() => fillCredentials('admin', 'admin')}
                  className="p-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs text-left transition-colors group"
              >
                  <div className="font-bold text-slate-700 group-hover:text-indigo-700">Admin</div>
                  <div className="text-slate-400 text-[10px]">Owner Panel</div>
              </button>
          </div>
      </div>
    </div>
  );
};
