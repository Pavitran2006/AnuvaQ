import React from 'react';
import { Atom, Cpu, Zap, Folder, BookOpen, Layers, Settings, Home, Play, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useCircuitStore } from '../../store/useCircuitStore';
import { useAuthStore } from '../../store/useAuthStore';

import { AnuvaQLogo } from '../ui/AnuvaQLogo';

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
    { id: 'landing', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
    ...(isAuthenticated ? [{ id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> }] : []),
    { id: 'builder', label: 'Studio', icon: <Atom className="w-3.5 h-3.5" /> },
    { id: 'visualizer', label: 'Analytics', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'algorithms', label: 'Algorithms', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'docs', label: 'Quantum Math', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="h-13 bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800/60 px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Brand Identity */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left cursor-pointer"
        >
          <AnuvaQLogo size="sm" showBadge={true} />
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 ml-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-scientific ${
                  isActive
                    ? 'bg-slate-800/80 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
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
      <div className="flex items-center gap-2.5">
        {/* Launch Studio CTA */}
        {(activeTab === 'landing' || activeTab === 'docs') && (
          <button
            onClick={() => setActiveTab('builder')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-scientific shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Studio</span>
          </button>
        )}

        {/* Engine Toggle */}
        <button
          onClick={() => setUseBackendSimulator(!useBackendSimulator)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition-scientific ${
            useBackendSimulator
              ? 'bg-blue-950/40 border-blue-500/40 text-blue-400'
              : 'bg-slate-900 border-slate-800 text-emerald-400'
          }`}
          title="Toggle between FastAPI NumPy Engine and Local Client JS Engine"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>{useBackendSimulator ? 'PyNumPy Engine' : 'Local Engine'}</span>
        </button>

        {/* Workspace Projects Modal */}
        <button
          onClick={onOpenProjects}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800 transition-colors"
          title="Projects & Workspaces"
        >
          <Folder className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800 transition-colors"
          title="Platform Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Auth State & Buttons */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800/80">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-cyan-400"
              >
                <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[9px]">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.full_name}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setActiveTab('landing');
                }}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-800 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'signin'
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-scientific ${
                  activeTab === 'signup'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
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
