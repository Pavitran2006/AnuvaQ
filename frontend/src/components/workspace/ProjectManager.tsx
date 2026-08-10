import React, { useEffect, useState } from 'react';
import { Folder, Plus, Trash2, Calendar, Loader2, CheckCircle2, AlertCircle, Copy, Edit2, Check, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { useCircuitStore } from '../../store/useCircuitStore';
import { CircuitProject } from '../../types/quantum';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ isOpen, onClose }) => {
  const {
    projects,
    fetchProjects,
    saveProject,
    deleteProject,
    renameProject,
    duplicateProject,
    isSaving,
    successMessage,
    errorMessage,
    clearMessages,
  } = useWorkspaceStore();

  const { gates, numQubits, loadGates, setNumQubits } = useCircuitStore();

  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Inline rename state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      clearMessages();
      setValidationError(null);
    }
  }, [isOpen, fetchProjects, clearMessages]);

  const handleSaveCurrent = async () => {
    setValidationError(null);
    if (!projectName.trim()) {
      setValidationError('Project name is required.');
      return;
    }

    const success = await saveProject(
      projectName.trim(),
      projectDesc.trim(),
      numQubits,
      JSON.stringify(gates)
    );

    if (success) {
      setProjectName('');
      setProjectDesc('');
    }
  };

  const handleLoad = (p: CircuitProject) => {
    try {
      const parsedGates = JSON.parse(p.gates_json);
      setNumQubits(p.num_qubits);
      loadGates(parsedGates);
      onClose();
    } catch (err) {
      console.error('Failed to parse circuit gates:', err);
    }
  };

  const handleStartRename = (p: CircuitProject) => {
    setEditingId(p.id);
    setEditingName(p.name);
  };

  const handleSaveRename = async (id: string) => {
    if (editingName.trim()) {
      await renameProject(id, editingName.trim());
    }
    setEditingId(null);
  };

  // Inline confirm delete state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = async (id: string) => {
    await deleteProject(id);
    setConfirmDeleteId(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Workspace & Project Manager" maxWidth="xl">
      <div className="flex flex-col gap-6">
        {/* Success / Error Banners */}
        {successMessage && (
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs flex items-center justify-between font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearMessages} className="hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Save Current Circuit Form */}
        <div className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col gap-3">
          <h3 className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Save Active Quantum Circuit
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Project Name (e.g. 2-Qubit Bell Entanglement)*"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (e.target.value.trim()) setValidationError(null);
                }}
                className={`bg-slate-900 border rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none ${
                  validationError ? 'border-rose-500' : 'border-slate-800 focus:border-quantum-cyan'
                }`}
              />
              {validationError && (
                <span className="text-[10px] text-rose-400 font-mono">{validationError}</span>
              )}
            </div>

            <input
              type="text"
              placeholder="Description (Optional)"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-quantum-cyan h-9"
            />
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-[11px] font-mono text-slate-400">
              Current Circuit: <span className="text-cyan-300 font-semibold">{numQubits} Qubits</span>, {gates.length} Gates
            </span>
            <Button
              variant="quantum"
              size="sm"
              onClick={handleSaveCurrent}
              disabled={isSaving}
              leftIcon={isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            >
              {isSaving ? 'Saving to Database...' : 'Save to Cloud'}
            </Button>
          </div>
        </div>

        {/* Saved Projects List */}
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Saved Workspace Projects ({projects.length})
          </h3>

          <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No saved projects found. Save your current circuit above!
              </div>
            ) : (
              projects.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl glass-panel border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-quantum-cyan/10 text-quantum-cyan shrink-0">
                      <Folder className="w-4 h-4" />
                    </div>

                    <div className="flex flex-col flex-1">
                      {editingId === p.id ? (
                        <div className="flex items-center gap-2 mt-0.5">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="bg-slate-900 border border-cyan-500 rounded px-2 py-0.5 text-xs text-white font-mono focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(p.id)}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-slate-400 hover:text-slate-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-200 font-mono">{p.name}</h4>
                          <button
                            onClick={() => handleStartRename(p)}
                            className="text-slate-500 hover:text-slate-300"
                            title="Rename Project"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{p.description || 'No description'}</p>
                      <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Today'} • {p.num_qubits} Qubits
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => handleLoad(p)}>
                      Load
                    </Button>
                    <button
                      onClick={() => duplicateProject(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                      title="Duplicate Circuit"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {confirmDeleteId === p.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleConfirmDelete(p.id)}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-mono font-bold transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-1 text-slate-400 hover:text-slate-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(p.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
