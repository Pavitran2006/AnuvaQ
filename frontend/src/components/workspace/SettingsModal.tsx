import React from 'react';
import { Cpu, Shield, Zap } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useCircuitStore } from '../../store/useCircuitStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { useBackendSimulator, setUseBackendSimulator } = useCircuitStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AnuvaQ Platform Settings" maxWidth="md">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between p-4 rounded-xl glass-panel border border-slate-800">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-quantum-cyan" />
            <div>
              <h4 className="text-xs font-bold text-slate-200 font-mono">FastAPI NumPy Engine</h4>
              <p className="text-[11px] text-slate-400">Use server-side Python matrix engine vs Local JS engine</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={useBackendSimulator}
            onChange={(e) => setUseBackendSimulator(e.target.checked)}
            className="w-4 h-4 accent-quantum-cyan cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col gap-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Platform Build:</span>
            <span className="text-quantum-cyan">AnuvaQ v2.2 Enterprise</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Matrix Engine Precision:</span>
            <span className="text-emerald-400">Complex128 (64-bit real + imag)</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Authentication:</span>
            <span className="text-quantum-violet">JWT (256-bit HS256)</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
