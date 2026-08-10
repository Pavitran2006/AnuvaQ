import React, { useState } from 'react';
import { Atom, Eye, EyeOff, Lock, Mail, User, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

interface SignUpViewProps {
  onSuccess: () => void;
  onNavigateSignIn: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onSuccess,
  onNavigateSignIn,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { setAuth } = useAuthStore();

  // Password strength logic
  const getPasswordStrength = () => {
    if (!password) return { label: 'None', score: 0, color: 'bg-slate-700' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: 'Weak', score: 25, color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { label: 'Medium', score: 65, color: 'bg-amber-500' };
    return { label: 'Strong', score: 100, color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/auth/register', {
        full_name: fullName,
        email: email,
        password: password,
      });

      const { access_token, user } = res.data;
      setAuth(access_token, user);
      setIsLoading(false);
      onSuccess();
    } catch (err: any) {
      setIsLoading(false);
      const msg = err.response?.data?.detail || 'Registration failed. Please try a different email.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Registration error.');
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
          Create <span className="text-cyan-400">AetherQ</span> Account
        </h2>
        <p className="text-xs text-slate-400 max-w-xs">
          Register to save your quantum circuits, store custom gates, and run FastAPI backend simulations.
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-300">Full Name</label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dr. Pavitran Quantum"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-300">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pavitran@aetherq.io"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-300">Password</label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
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

          {/* Strength Meter Bar */}
          {password && (
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">{strength.label}</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-slate-300">Confirm Password</label>
            {passwordsMatch && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Matches
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border focus:outline-none text-xs text-white placeholder-slate-500 transition-colors ${
                confirmPassword && !passwordsMatch
                  ? 'border-rose-500'
                  : 'border-slate-700/80 focus:border-cyan-400'
              }`}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Sign In Footer Link */}
      <div className="text-center mt-6 text-xs text-slate-400">
        Already have an account?{' '}
        <button
          onClick={onNavigateSignIn}
          className="text-cyan-400 font-semibold hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
