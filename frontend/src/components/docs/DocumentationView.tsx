import React from 'react';
import { AnuvaQLogoMark } from '../ui/AnuvaQLogo';
import { Card } from '../ui/Card';

export const DocumentationView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="glass-panel-glow p-8 rounded-2xl border border-quantum-cyan/30 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold text-quantum-cyan uppercase tracking-widest">
            AnuvaQ Technical Documentation & Handbook
          </span>
          <h1 className="text-2xl font-bold text-slate-100 mt-1 font-mono">
            Quantum Computing Mathematics Engine Architecture
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            A comprehensive reference guide detailing state vector complex linear algebra, unitary gate evolution, Born rule measurement collapse, density matrices, and quantum algorithms.
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-quantum-cyan/10 border border-quantum-cyan/40 flex items-center justify-center text-quantum-cyan">
          <AnuvaQLogoMark sizePx={44} />
        </div>
      </div>

      {/* Math Topic Cards */}
      <div className="grid grid-cols-2 gap-6">
        <Card title="1. Quantum State Vector Representation" glow>
          <div className="font-mono text-xs text-slate-300 flex flex-col gap-3">
            <p>
              An <strong className="text-quantum-cyan">N-qubit state</strong> lives in a 2^N-dimensional complex Hilbert space H = C^(2^N):
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-quantum-cyan text-center font-bold">
              |ψ⟩ = ∑ α_k |k⟩,  where α_k ∈ C
            </div>
            <p>
              where α_k = a_k + i b_k are complex probability amplitudes satisfying the normalization constraint:
            </p>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-center text-emerald-400 font-bold">
              ⟨ψ|ψ⟩ = ∑ |α_k|² = 1.0
            </div>
          </div>
        </Card>

        <Card title="2. Unitary Gate Transformations" glow>
          <div className="font-mono text-xs text-slate-300 flex flex-col gap-3">
            <p>
              Quantum logic gates are represented by <strong className="text-quantum-violet">unitary matrices</strong> U satisfying:
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-quantum-violet text-center font-bold">
              U† U = U U† = I
            </div>
            <p>
              Unitary operators preserve length and state normalization:
            </p>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-center text-slate-200 font-bold">
              ||U|ψ⟩||² = ⟨ψ| U† U |ψ⟩ = ⟨ψ|I|ψ⟩ = 1.0
            </div>
          </div>
        </Card>

        <Card title="3. Kronecker (Tensor) Matrix Products" glow>
          <div className="font-mono text-xs text-slate-300 flex flex-col gap-3">
            <p>
              Multi-qubit system matrices are constructed via the Kronecker product ⊗:
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-quantum-cyan text-center font-bold">
              U_total = U_0 ⊗ U_1 ⊗ ... ⊗ U_(N-1)
            </div>
            <p>
              If A is m x n and B is p x q, A ⊗ B produces an (mp) x (nq) block matrix.
            </p>
          </div>
        </Card>

        <Card title="4. Born Rule & Measurement Collapse" glow>
          <div className="font-mono text-xs text-slate-300 flex flex-col gap-3">
            <p>
              Measuring qubit m yields outcome b ∈ &#123;0, 1&#125; with probability:
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-rose-400 text-center font-bold">
              P(m = b) = ∑ |α_k|² for all k where bit m = b
            </div>
            <p>
              Observation instantaneously collapses state vector |ψ⟩ onto projection eigenstate:
            </p>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-center text-slate-200 font-bold">
              |ψ'&gt; = P_b |ψ⟩ / √(P(m=b))
            </div>
          </div>
        </Card>
      </div>

      {/* Bloch Sphere and Density Matrix Section */}
      <Card title="5. Bloch Sphere Geometry & Density Matrices" glow>
        <div className="font-mono text-xs text-slate-300 flex flex-col gap-3">
          <p>
            For a single-qubit density matrix ρ = |ψ⟩⟨ψ|, the state vector is projected on the Bloch sphere coordinates (x, y, z):
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-quantum-cyan font-bold">
              x = Tr(ρ X) = 2 Re(α_0* α_1)
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-quantum-violet font-bold">
              y = Tr(ρ Y) = 2 Im(α_0* α_1)
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-bold">
              z = Tr(ρ Z) = |α_0|² - |α_1|²
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
