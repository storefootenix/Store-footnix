import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (data.success && data.token) {
        onLoginSuccess(data.token);
      } else {
        setError('Incorrect username or password');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-neutral-800 rounded-2xl border border-neutral-700 flex items-center justify-center shadow-2xl">
            <ShieldCheck className="w-8 h-8 text-[#245bff]" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif-store font-bold text-white mb-2">
            Restricted Access
          </h1>
          <p className="text-sm text-neutral-400">
            Please enter your admin credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <User className="w-5 h-5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin Username"
                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#245bff] focus:ring-1 focus:ring-[#245bff] transition-all"
                autoFocus
              />
            </div>
            
            <div className="relative">
              <Lock className="w-5 h-5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#245bff] focus:ring-1 focus:ring-[#245bff] transition-all"
              />
            </div>
            {error && (
              <p className="text-rose-400 text-xs mt-2 font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#245bff] hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-xs text-neutral-500 hover:text-white transition-colors">
            &larr; Return to Storefront
          </a>
        </div>
      </div>
    </div>
  );
};
