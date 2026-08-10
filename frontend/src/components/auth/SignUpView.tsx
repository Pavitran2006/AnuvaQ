import React, { useState } from 'react';
import { Atom, Eye, EyeOff, Lock, Mail, User, ArrowRight, AlertCircle, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
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

  const getPasswordStrength = () => {
    if (!password) return { label: 'None', score: 0, color: 'bg-slate-800' };
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
    <div className="max-w-3xl mx-auto my-12 grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md shadow-2xl overflow-hidden text-slate-100">
      {/* Left Branding Side */}
      <div className="p-8 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-mono text-slate-100">AnuvaQ</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Create an engineering account to store custom quantum projects and execute noise simulations.
            </p>
          </div>
        </div>

        <div className="space-y-3 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>OpenQASM 2.0 Export Support</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>5 Kraus Noise Channels</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>PostgreSQL & SQLite Integration</span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-500">
          © 2026 AnuvaQ v2.2
        </div>
      </div>

      {/* Right Form Side */}
      <div className="p-8 flex flex-col justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 font-mono">Create Account</h3>
          <p className="text-xs text-slate-400 mt-0.5">Register a new engineer profile.</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-300 font-mono">Full Name</label>
            <div className="relative flex items-center">
              <User className="w-3.5 h-3.5 text-slate-500 absolute left-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Pavitran Quantum"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono placeholder-slate-600"
              />
            </div>
          </div>

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
            <label className="text-xs font-medium text-slate-300 font-mono">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
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
            {password && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-1 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500">{strength.label}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="font-medium text-slate-300">Confirm Password</label>
              {passwordsMatch && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Matches
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono placeholder-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-scientific disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-3">
          Already have an account?{' '}
          <button
            onClick={onNavigateSignIn}
            className="text-cyan-400 font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
