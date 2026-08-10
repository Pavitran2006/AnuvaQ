import React, { useState } from 'react';
import { Atom, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles, UserCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

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
      // FastAPI OAuth2PasswordRequestForm expects form-urlencoded body
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
    <div className="max-w-md mx-auto my-12 p-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/40 text-slate-100">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
          <Atom className="w-7 h-7 text-slate-950" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-mono">
          Sign In to <span className="text-cyan-400">AetherQ</span>
        </h2>
        <p className="text-xs text-slate-400 max-w-xs">
          Access your saved quantum circuits, project workspaces, and backend simulation engine.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-300">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@aetherq.io"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-slate-300">Password</label>
            <span className="text-[11px] text-slate-500 hover:text-cyan-400 cursor-pointer">Forgot?</span>
          </div>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Guest Mode Divider */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <span className="relative px-3 bg-slate-950 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
          Or Continue
        </span>
      </div>

      {/* Guest Mode Button */}
      <button
        onClick={onContinueGuest}
        className="w-full py-2.5 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Continue as Guest Demo Mode</span>
      </button>

      {/* Sign Up Footer Link */}
      <div className="text-center mt-6 text-xs text-slate-400">
        Don&apos;t have an account yet?{' '}
        <button
          onClick={onNavigateSignUp}
          className="text-cyan-400 font-semibold hover:underline cursor-pointer"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};
