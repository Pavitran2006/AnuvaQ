import React, { useState } from 'react';
import { Atom, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { AnuvaQLogo } from '../ui/AnuvaQLogo';

interface SignInViewProps {
  onSuccess: () => void;
  onNavigateSignUp: () => void;
  onContinueGuest: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onSuccess,
  onNavigateSignUp,
  onContinueGuest,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, user } = res.data;
      setAuth(access_token, user);
      setIsLoading(false);
      onSuccess();
    } catch (err: any) {
      setIsLoading(false);
      const msg = err.response?.data?.detail || 'Invalid email or password. Please try again.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Authentication failed.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-12 grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md shadow-2xl overflow-hidden text-slate-100">
      {/* Left Branding Side */}
      <div className="p-8 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between gap-6">
        <div className="flex flex-col gap-4">
          <AnuvaQLogo size="lg" showBadge={true} />
          <p className="text-xs text-slate-400 leading-relaxed">
            Interactive quantum computing & noise simulation platform.
          </p>
        </div>

        <div className="space-y-3 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>JWT Session Protection</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Persistent Workspace Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>PyNumPy REST Execution</span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-500">
          © 2026 AnuvaQ v2.2
        </div>
      </div>

      {/* Right Form Side */}
      <div className="p-8 flex flex-col justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 font-mono">Sign In</h3>
          <p className="text-xs text-slate-400 mt-0.5">Enter your credentials to access your cloud workspace.</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-300 font-mono">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@anuvaq.io"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono placeholder-slate-600"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="font-medium text-slate-300">Password</label>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-9 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono placeholder-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-scientific disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="flex flex-col gap-3 text-center border-t border-slate-800 pt-4">
          <button
            onClick={onContinueGuest}
            className="w-full py-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Continue as Guest Demo Mode</span>
          </button>

          <div className="text-xs text-slate-400">
            Need an account?{' '}
            <button
              onClick={onNavigateSignUp}
              className="text-cyan-400 font-semibold hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
