import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { SignInView } from './components/auth/SignInView';
import { SignUpView } from './components/auth/SignUpView';
import { DashboardView } from './components/dashboard/DashboardView';
import { GatePalette } from './components/circuit/GatePalette';
import { CircuitToolbar } from './components/circuit/CircuitToolbar';
import { CircuitCanvas } from './components/circuit/CircuitCanvas';
import { BlochSphere } from './components/visualization/BlochSphere';
import { StateHistogram } from './components/visualization/StateHistogram';
import { DensityMatrixHeatmap } from './components/visualization/DensityMatrixHeatmap';
import { StateVectorTable } from './components/visualization/StateVectorTable';
import { NoiseSettingsPanel } from './components/quantum/NoiseSettingsPanel';
import { QuantumMetricsCard } from './components/quantum/QuantumMetricsCard';
import { AlgorithmLibrary } from './components/algorithms/AlgorithmLibrary';
import { DocumentationView } from './components/docs/DocumentationView';
import { ProjectManager } from './components/workspace/ProjectManager';
import { ExportImportModal } from './components/workspace/ExportImportModal';
import { SettingsModal } from './components/workspace/SettingsModal';
import { useCircuitStore } from './store/useCircuitStore';
import { useAuthStore } from './store/useAuthStore';
import { GateType, GateStep } from './types/quantum';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedPaletteGate, setSelectedPaletteGate] = useState<GateType | null>(null);

  // Modals
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isQasmOpen, setIsQasmOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    numQubits,
    setNumQubits,
    runSimulation,
    simulationResult,
    loadGates,
    noiseEnabled,
  } = useCircuitStore();

  const { checkAuth } = useAuthStore();

  // Check auth and run initial simulation on boot
  useEffect(() => {
    checkAuth();
    runSimulation();
  }, [checkAuth, runSimulation]);

  const handleSelectPreset = (presetId: string) => {
    if (presetId === 'bell') {
      setNumQubits(2);
      loadGates([
        { id: 'p0', gate: 'H', target: 0, stepIndex: 0 },
        { id: 'p1', gate: 'CX', target: 1, controls: [0], stepIndex: 1 },
      ]);
    } else if (presetId === 'ghz') {
      setNumQubits(3);
      loadGates([
        { id: 'p0', gate: 'H', target: 0, stepIndex: 0 },
        { id: 'p1', gate: 'CX', target: 1, controls: [0], stepIndex: 1 },
        { id: 'p2', gate: 'CX', target: 2, controls: [1], stepIndex: 2 },
      ]);
    } else if (presetId === 'grover') {
      setNumQubits(2);
      loadGates([
        { id: 'g0', gate: 'H', target: 0, stepIndex: 0 },
        { id: 'g1', gate: 'H', target: 1, stepIndex: 0 },
        { id: 'g2', gate: 'CZ', target: 1, controls: [0], stepIndex: 1 },
        { id: 'g3', gate: 'H', target: 0, stepIndex: 2 },
        { id: 'g4', gate: 'H', target: 1, stepIndex: 2 },
        { id: 'g5', gate: 'X', target: 0, stepIndex: 3 },
        { id: 'g6', gate: 'X', target: 1, stepIndex: 3 },
        { id: 'g7', gate: 'CZ', target: 1, controls: [0], stepIndex: 4 },
        { id: 'g8', gate: 'X', target: 0, stepIndex: 5 },
        { id: 'g9', gate: 'X', target: 1, stepIndex: 5 },
        { id: 'g10', gate: 'H', target: 0, stepIndex: 6 },
        { id: 'g11', gate: 'H', target: 1, stepIndex: 6 },
      ]);
    } else if (presetId === 'deutsch') {
      setNumQubits(2);
      loadGates([
        { id: 'd0', gate: 'X', target: 1, stepIndex: 0 },
        { id: 'd1', gate: 'H', target: 0, stepIndex: 1 },
        { id: 'd2', gate: 'H', target: 1, stepIndex: 1 },
        { id: 'd3', gate: 'CX', target: 1, controls: [0], stepIndex: 2 },
        { id: 'd4', gate: 'H', target: 0, stepIndex: 3 },
      ]);
    } else if (presetId === 'qft') {
      setNumQubits(3);
      loadGates([
        { id: 'q0', gate: 'H', target: 0, stepIndex: 0 },
        { id: 'q1', gate: 'RZ', target: 1, controls: [0], params: { theta: 1.5708 }, stepIndex: 1 },
        { id: 'q2', gate: 'H', target: 1, stepIndex: 2 },
        { id: 'q3', gate: 'RZ', target: 2, controls: [1], params: { theta: 1.5708 }, stepIndex: 3 },
        { id: 'q4', gate: 'H', target: 2, stepIndex: 4 },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProjects={() => setIsProjectsOpen(true)}
      />

      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
        {activeTab === 'landing' && (
          <LandingPage
            onLaunchStudio={() => setActiveTab('builder')}
            onExploreDocs={() => setActiveTab('docs')}
            onRunPreset={handleSelectPreset}
          />
        )}

        {activeTab === 'signin' && (
          <SignInView
            onSuccess={() => setActiveTab('dashboard')}
            onNavigateSignUp={() => setActiveTab('signup')}
            onContinueGuest={() => setActiveTab('builder')}
          />
        )}

        {activeTab === 'signup' && (
          <SignUpView
            onSuccess={() => setActiveTab('dashboard')}
            onNavigateSignIn={() => setActiveTab('signin')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            onLaunchStudio={() => setActiveTab('builder')}
            onNavigateTab={setActiveTab}
            onOpenProjects={() => setIsProjectsOpen(true)}
            onLoadPreset={handleSelectPreset}
          />
        )}

        {activeTab === 'builder' && (
          <div className="flex flex-col gap-6">
            <CircuitToolbar
              onOpenQasmModal={() => setIsQasmOpen(true)}
              onSelectPreset={handleSelectPreset}
            />

            <div className="flex gap-6">
              <GatePalette
                selectedGate={selectedPaletteGate}
                onSelectGate={(g) =>
                  setSelectedPaletteGate((prev) => (prev === g ? null : g))
                }
              />
              <CircuitCanvas
                selectedPaletteGate={selectedPaletteGate}
                onClearPaletteGate={() => setSelectedPaletteGate(null)}
              />
            </div>

            {/* Quantum Noise Controls Panel */}
            <NoiseSettingsPanel />

            {/* Live Analytics Dashboard */}
            {simulationResult && (
              <div className="flex flex-col gap-6 border-t border-slate-800/80 pt-6">
                {/* Quantum Analytics Metrics Card */}
                {noiseEnabled && (
                  <QuantumMetricsCard
                    metrics={simulationResult.quantum_metrics}
                    noiseModel={simulationResult.noise_model}
                    noiseProbability={simulationResult.noise_probability}
                  />
                )}

                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Live Quantum State Vector & Density Matrix Analytics
                  </h2>
                </div>

                {/* Bloch Spheres Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {simulationResult.final_bloch_spheres.map((bloch, idx) => (
                    <BlochSphere
                      key={bloch.qubit}
                      bloch={bloch}
                      noisyBloch={simulationResult.noisy_bloch_spheres?.[idx]}
                      noiseEnabled={noiseEnabled}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <StateHistogram
                    amplitudes={simulationResult.final_amplitudes}
                    shotsSummary={simulationResult.shots_summary}
                    noisyProbabilities={simulationResult.noisy_probabilities}
                    noiseEnabled={noiseEnabled}
                  />
                  <DensityMatrixHeatmap
                    amplitudes={simulationResult.final_amplitudes}
                    noisyDensityMatrix={simulationResult.noisy_density_matrix}
                    noiseEnabled={noiseEnabled}
                  />
                </div>

                <StateVectorTable amplitudes={simulationResult.final_amplitudes} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'visualizer' && simulationResult && (
          <div className="flex flex-col gap-6">
            <NoiseSettingsPanel />
            {noiseEnabled && (
              <QuantumMetricsCard
                metrics={simulationResult.quantum_metrics}
                noiseModel={simulationResult.noise_model}
                noiseProbability={simulationResult.noise_probability}
              />
            )}
            <div className="grid grid-cols-4 gap-4">
              {simulationResult.final_bloch_spheres.map((bloch, idx) => (
                <BlochSphere
                  key={bloch.qubit}
                  bloch={bloch}
                  noisyBloch={simulationResult.noisy_bloch_spheres?.[idx]}
                  noiseEnabled={noiseEnabled}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <StateHistogram
                amplitudes={simulationResult.final_amplitudes}
                shotsSummary={simulationResult.shots_summary}
                noisyProbabilities={simulationResult.noisy_probabilities}
                noiseEnabled={noiseEnabled}
              />
              <DensityMatrixHeatmap
                amplitudes={simulationResult.final_amplitudes}
                noisyDensityMatrix={simulationResult.noisy_density_matrix}
                noiseEnabled={noiseEnabled}
              />
            </div>
            <StateVectorTable amplitudes={simulationResult.final_amplitudes} />
          </div>
        )}

        {activeTab === 'algorithms' && <AlgorithmLibrary />}

        {activeTab === 'docs' && <DocumentationView />}
      </main>

      {/* Footer */}
      <Footer onNavigateTab={setActiveTab} />

      {/* Modals */}
      <ProjectManager isOpen={isProjectsOpen} onClose={() => setIsProjectsOpen(false)} />
      <ExportImportModal isOpen={isQasmOpen} onClose={() => setIsQasmOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
