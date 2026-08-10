import React, { useEffect, useState } from 'react';
import { Code, Download, Upload, Copy, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useCircuitStore } from '../../store/useCircuitStore';
import { api } from '../../services/api';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({ isOpen, onClose }) => {
  const { gates, numQubits, loadGates, setNumQubits } = useCircuitStore();
  const [qasmText, setQasmText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Export current circuit to QASM
      api
        .post('/simulation/export-qasm', {
          num_qubits: numQubits,
          gates: gates.map((g) => ({
            gate: g.gate,
            target: g.target,
            controls: g.controls || [],
            params: g.params || {},
          })),
        })
        .then((res) => setQasmText(res.data.qasm_code))
        .catch(() => {
          // Fallback QASM string builder if offline
          const lines = ['OPENQASM 2.0;', 'include "qelib1.inc";', `qreg q[${numQubits}];`, `creg c[${numQubits}];`].concat(
            gates.map((g) => `${g.gate.toLowerCase()} q[${g.target}];`)
          );
          setQasmText(lines.join('\n'));
        });
    }
  }, [isOpen, gates, numQubits]);

  const handleCopy = () => {
    navigator.clipboard.writeText(qasmText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = async () => {
    try {
      const res = await api.post('/simulation/parse-qasm', { qasm_code: qasmText });
      if (res.data.num_qubits) setNumQubits(res.data.num_qubits);
      if (res.data.gates) {
        const importedGates = res.data.gates.map((g: any, idx: number) => ({
          id: `imported-${idx}`,
          gate: g.gate,
          target: g.target,
          controls: g.controls || [],
          params: g.params || {},
          stepIndex: idx,
        }));
        loadGates(importedGates);
      }
      onClose();
    } catch (err) {
      alert('Failed to parse OpenQASM 2.0 text.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="OpenQASM 2.0 Code Import / Export" maxWidth="xl">
      <div className="flex flex-col gap-4">
        <p className="text-xs text-slate-400">
          OpenQASM 2.0 is the standard quantum assembly language compatible with IBM Qiskit and quantum hardware backends.
        </p>

        <textarea
          rows={10}
          value={qasmText}
          onChange={(e) => setQasmText(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-quantum-cyan focus:outline-none focus:border-quantum-cyan"
        />

        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={handleCopy} leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}>
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>

          <Button variant="quantum" size="sm" onClick={handleImport} leftIcon={<Upload className="w-3.5 h-3.5" />}>
            Parse & Load Circuit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
