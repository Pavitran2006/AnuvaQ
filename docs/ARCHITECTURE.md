# AetherQ Studio - System Architecture & Design Specification

AetherQ Studio is an enterprise-grade Quantum Computing Platform engineered from scratch. It features a custom high-performance linear algebra Quantum Simulation Engine in Python & NumPy, a FastAPI backend with JWT security & SQLite state persistence, and a modern React + TypeScript + TailwindCSS visual circuit studio frontend.

---

## 1. System Overview & Clean Architecture

```
                                +-----------------------------------+
                                |     React 18 / TypeScript Web     |
                                |       Circuit Studio Frontend     |
                                +-----------------+-----------------+
                                                  | REST API (HTTP / JSON)
                                                  v
                                +-----------------+-----------------+
                                |      FastAPI REST API Layer       |
                                |     (Auth, Circuits, Simulator)   |
                                +-----------------+-----------------+
                                                  |
                        +-------------------------+-------------------------+
                        |                                                   |
                        v                                                   v
        +---------------+---------------+                   +---------------+---------------+
        |  PyNumPy State Vector Engine  |                   |   SQLAlchemy 2.0 / SQLite DB  |
        |  (Gates, Tensor, Collapse)    |                   |   (Users, Circuits, Projects) |
        +-------------------------------+                   +-------------------------------+
```

### Layered Separation of Responsibilities:
1. **Core Math Layer (`backend/app/quantum_engine/`)**: Pure complex linear algebra calculation without external framework dependencies. Evaluates state vector operations $|\psi\rangle \in \mathbb{C}^{2^N}$, Kronecker products $\otimes$, unitary matrix multiplication, density matrices $\rho$, partial trace, Bloch sphere projection, and Born measurement collapse.
2. **API & Persistence Layer (`backend/app/api/`, `models/`, `schemas/`)**: Exposes REST endpoints for circuit simulation, OpenQASM parsing, project workspace storage, and JWT user authentication.
3. **Frontend Presentation & Analytics Layer (`frontend/src/`)**: Provides interactive drag-and-drop circuit matrix canvas, real-time client-side JS fallback simulator, Bloch sphere renders, density matrix heatmaps, and probability histograms.

---

## 2. Quantum Engine Linear Algebra Pipeline

### 2.1 State Vector Representation
An $N$-qubit state is stored as a 1D NumPy array of `complex128` numbers:
$$|\psi\rangle = \begin{bmatrix} \alpha_0 \\ \alpha_1 \\ \vdots \\ \alpha_{2^N-1} \end{bmatrix}, \quad \sum_{i=0}^{2^N-1} |\alpha_i|^2 = 1$$

### 2.2 Gate Transformation
For a single-qubit unitary gate matrix $U \in \mathbb{C}^{2 \times 2}$ acting on target qubit $t$, the full $2^N \times 2^N$ system unitary $U_{\text{full}}$ is constructed via multi-Kronecker expansion:
$$U_{\text{full}} = I \otimes \dots \otimes U \otimes \dots \otimes I$$
The updated state vector is computed via matrix multiplication:
$$|\psi'\rangle = U_{\text{full}} |\psi\rangle$$

### 2.3 Born Rule Measurement Collapse
When measuring qubit $m$:
1. Calculate probability $P(m=0) = \sum_{k: k_m=0} |\alpha_k|^2$.
2. Sample outcome $b \in \{0, 1\}$ using Monte Carlo sampling.
3. Project state vector:
   $$|\psi'\rangle = \frac{P_b |\psi\rangle}{\sqrt{P(m=b)}}$$

---

## 3. Database Schema

- **`users`**: User identity (`id`, `email`, `full_name`, `hashed_password`, `created_at`).
- **`workspaces`**: Project containers (`id`, `name`, `description`, `owner_id`, `created_at`).
- **`circuits`**: Saved circuit designs (`id`, `name`, `description`, `num_qubits`, `gates_json`, `qasm_code`, `owner_id`, `workspace_id`, `created_at`, `updated_at`).
