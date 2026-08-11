import { create } from 'zustand';
import { CircuitProject } from '../types/quantum';
import { api } from '../services/api';

interface WorkspaceState {
  projects: CircuitProject[];
  activeProject: CircuitProject | null;
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  clearMessages: () => void;
  fetchProjects: () => Promise<void>;
  saveProject: (name: string, description?: string, numQubits?: number, gatesJson?: string) => Promise<boolean>;
  renameProject: (id: string, newName: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<void>;
  loadProject: (project: CircuitProject) => void;
  deleteProject: (id: string) => Promise<void>;
}

// Local storage key for Guest Mode fallback
const LOCAL_PROJECTS_KEY = 'anuvaq_local_projects';

const getLocalProjects = (): CircuitProject[] => {
  try {
    const data = localStorage.getItem(LOCAL_PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalProjects = (projects: CircuitProject[]) => {
  try {
    localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  projects: [],
  activeProject: null,
  isLoading: false,
  isSaving: false,
  errorMessage: null,
  successMessage: null,

  clearMessages: () => set({ errorMessage: null, successMessage: null }),

  fetchProjects: async () => {
    set({ isLoading: true, errorMessage: null });
    const token = localStorage.getItem('anuvaq_token') || localStorage.getItem('aetherq_token');
    
    if (token) {
      try {
        const res = await api.get('/circuits/');
        set({ projects: res.data, isLoading: false });
        return;
      } catch (err) {
        console.warn('Backend fetch failed, using local storage fallback:', err);
      }
    }
    
    // Fallback to local storage for guests or offline mode
    const local = getLocalProjects();
    set({ projects: local, isLoading: false });
  },

  saveProject: async (name, description = '', numQubits = 2, gatesJson = '[]') => {
    set({ isSaving: true, errorMessage: null, successMessage: null });
    const token = localStorage.getItem('anuvaq_token') || localStorage.getItem('aetherq_token');

    if (token) {
      try {
        const res = await api.post('/circuits/', {
          name,
          description,
          num_qubits: numQubits,
          gates_json: gatesJson,
        });

        set({
          activeProject: res.data,
          isSaving: false,
          successMessage: '✓ Project saved to Production Cloud Database!',
        });
        await get().fetchProjects();
        return true;
      } catch (err: any) {
        console.warn('Backend save failed, falling back to local storage:', err);
      }
    }

    // Guest Mode / Local Storage fallback
    const newProject: CircuitProject = {
      id: `local_${Date.now()}`,
      name,
      description,
      num_qubits: numQubits,
      gates_json: gatesJson,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const current = getLocalProjects();
    const updated = [newProject, ...current];
    saveLocalProjects(updated);

    set({
      projects: updated,
      activeProject: newProject,
      isSaving: false,
      successMessage: '✓ Project saved to Local Workspace!',
    });
    return true;
  },

  renameProject: async (id, newName) => {
    const token = localStorage.getItem('anuvaq_token') || localStorage.getItem('aetherq_token');
    if (token && !id.startsWith('local_')) {
      try {
        await api.put(`/circuits/${id}`, { name: newName });
        await get().fetchProjects();
        return;
      } catch (err) {
        console.warn('Backend rename failed:', err);
      }
    }

    // Local storage fallback
    const current = getLocalProjects();
    const updated = current.map((p) =>
      p.id === id ? { ...p, name: newName, updated_at: new Date().toISOString() } : p
    );
    saveLocalProjects(updated);
    set({ projects: updated });
  },

  duplicateProject: async (id) => {
    const token = localStorage.getItem('anuvaq_token') || localStorage.getItem('aetherq_token');
    if (token && !id.startsWith('local_')) {
      try {
        await api.post(`/circuits/${id}/duplicate`);
        await get().fetchProjects();
        return;
      } catch (err) {
        console.warn('Backend duplicate failed:', err);
      }
    }

    // Local storage fallback
    const current = getLocalProjects();
    const target = current.find((p) => p.id === id);
    if (!target) return;

    const clone: CircuitProject = {
      ...target,
      id: `local_${Date.now()}`,
      name: `${target.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [clone, ...current];
    saveLocalProjects(updated);
    set({ projects: updated });
  },

  loadProject: (project) => {
    set({ activeProject: project });
  },

  deleteProject: async (id) => {
    const token = localStorage.getItem('anuvaq_token') || localStorage.getItem('aetherq_token');
    if (token && !id.startsWith('local_')) {
      try {
        await api.delete(`/circuits/${id}`);
        await get().fetchProjects();
        return;
      } catch (err) {
        console.warn('Backend delete failed:', err);
      }
    }

    // Local storage fallback
    const current = getLocalProjects();
    const updated = current.filter((p) => p.id !== id);
    saveLocalProjects(updated);
    set({ projects: updated });
  },
}));
