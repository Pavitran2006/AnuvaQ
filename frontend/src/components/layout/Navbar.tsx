import React from 'react';
import { Atom, Cpu, Zap, Folder, BookOpen, Layers, Settings, User as UserIcon, Home, Play, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useCircuitStore } from '../../store/useCircuitStore';
import { useAuthStore } from '../../store/useAuthStore';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  onOpenProjects: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenProjects,
}) => {
  const { useBackendSimulator, setUseBackendSimulator } = useCircuitStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navItems = [
    { id: 'landing', label: 'Home', icon: <Home className="w-4 h-4" /> },
    ...(isAuthenticated ? [{ id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }] : []),
    { id: 'builder', label: 'Circuit Studio', icon: <Atom className="w-4 h-4" /> },
    { id: 'visualizer', label: 'State Analytics', icon: <Layers className="w-4 h-4" /> },
    { id: 'algorithms', label: 'Algorithm Library', icon: <Zap className="w-4 h-4" /> },
    { id: 'docs', label: 'Quantum Math', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="h-14 bg-surface-50/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Brand Identity */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-quantum-cyan to-quantum-violet flex items-center justify-center shadow-lg shadow-quantum-cyan/20">
            <Atom className="w-5 h-5 text-slate-950 animate-spin-slow" />
          </div>
          <div>
            <span className="font-bold text-slate-100 tracking-tight text-base font-mono">Aether<span className="text-quantum-cyan">Q</span></span>
            <span className="text-[10px] uppercase font-mono text-slate-400 block -mt-1 tracking-widest">Studio v1.2</span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 ml-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-quantum-cyan border border-quantum-cyan/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Control Actions & Engine Status */}
      <div className="flex items-center gap-3">
        {/* Launch Studio CTA button when on Landing or Docs */}
        {(activeTab === 'landing' || activeTab === 'docs') && (
          <button
            onClick={() => setActiveTab('builder')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Studio</span>
          </button>
        )}

        {/* Engine Toggle */}
        <button
          onClick={() => setUseBackendSimulator(!useBackendSimulator)}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
            useBackendSimulator
              ? 'bg-quantum-violet/20 border-quantum-violet/50 text-quantum-violet'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}
          title="Toggle between FastAPI NumPy Engine and Local Client JS Engine"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>{useBackendSimulator ? 'PyNumPy Engine' : 'Local Engine'}</span>
        </button>

        {/* Workspace Projects Modal */}
        <button
          onClick={onOpenProjects}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/50 transition-colors"
          title="Projects & Workspaces"
        >
          <Folder className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/50 transition-colors"
          title="Platform Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Auth State & Buttons */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.full_name}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setActiveTab('landing');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-700/50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'signin'
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'signup'
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
