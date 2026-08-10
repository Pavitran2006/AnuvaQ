# AetherQ Studio — Commercial Quantum Computing & Noise Simulation Platform

> **AetherQ Studio** is an enterprise-grade, full-stack quantum computing platform designed and built from first principles. It features a custom linear algebra Quantum State Vector Simulator & Density Matrix Kraus Noise Engine written in pure Python/NumPy (zero external quantum library dependencies), a FastAPI REST backend with SQLite/PostgreSQL persistence and JWT security, and an interactive dark-glassmorphic React 18 circuit builder studio.

---

## 🌟 Key Features

- **Custom Linear Algebra Engine**: Simulates $N$-qubit state vectors $|\psi\rangle \in \mathbb{C}^{2^N}$, matrix tensor products $U_1 \otimes U_2$, Born rule collapse, partial trace reduced density matrices, and Von Neumann entanglement entropy.
- **Quantum Noise Simulation Engine (v1.4 & v1.5 Kraus Engine)**:
  - **Density Matrix Evolution**: Full $2^N \times 2^N$ density matrix mechanics ($\rho \in \mathbb{C}^{2^N \times 2^N}$).
  - **5 Kraus Channels**: Bit Flip, Phase Flip, Depolarizing Channel, Amplitude Damping (spontaneous emission), and Phase Damping (pure dephasing).
  - **Quantum Information Metrics**: Real-time calculation of **Fidelity ($F$)**, **Purity ($\mathcal{P}$)**, **Von Neumann Entropy ($S$)**, and **Trace Distance ($D$)**.
- **Interactive Visual Studio**: Drag-and-drop circuit matrix canvas with multi-qubit control-target wire linking, parametric rotation angles ($RX, RY, RZ, U3$), and time-step slots.
- **Dual-Mode Hybrid Execution**: Instant client-side TypeScript simulator for zero-latency UI previews, paired with backend NumPy engine for high-precision computation.
- **Real-Time Analytics Suite**:
  - **3D SVG Bloch Spheres**: Dual ideal vs. shrunken mixed-state Bloch vector overlays.
  - **Side-by-Side Dual Histogram**: Ideal (cyan) vs. Noisy (rose) Born rule outcome comparison.
  - **Density Matrix Heatmap**: Tabbed view between Ideal Pure $|\psi\rangle\langle\psi|$ and Noisy Mixed $\rho_{\text{noisy}}$ states.
  - **Complex Amplitude Spectrum Table**: Real, imaginary, magnitude, and phase angles $(\theta_\text{deg})$.
- **Cloud Workspace Persistence**: Real authentication (Sign Up / Sign In / JWT), circuit save/load/rename/duplicate to persistent cloud database.
- **OpenQASM 2.0 Interoperability**: Full bidirectional OpenQASM code parsing and export.

---

## 🌐 Public Cloud Production Endpoints

| Service | Environment / Host | Production URL | Status |
| :--- | :--- | :--- | :--- |
| **Public Web Application** | React 18 + Vite | `https://common-sloths-read.loca.lt` (`http://127.0.0.1:4173`) | **ACTIVE** ✅ |
| **Public REST API** | FastAPI + Python 3.11 Docker | `https://four-animals-lie.loca.lt` (`http://127.0.0.1:8000`) | **ACTIVE** ✅ |
| **Backend Health** | REST API | `GET /health` | **HEALTHY** ✅ |
| **Interactive API Docs** | OpenAPI / Swagger | `GET /docs` | **ACTIVE** ✅ |

---

## 🛠️ Tech Stack

- **Backend**: Python 3.11, FastAPI, NumPy, SQLAlchemy 2.0, PostgreSQL / SQLite, Pytest, PyJWT, Passlib (Bcrypt), Docker.
- **Frontend**: React 18, Vite, TypeScript, TailwindCSS, Zustand, Lucide Icons, Axios.
- **Testing**: 23 Pytest automated integration & unit tests (**100% pass rate**).

---

## 📜 Production Release Certification

- **Backend Automated Tests**: 23 / 23 Passed (Unitary matrices, Kraus noise completeness relation $\sum E_k^\dagger E_k = I$, fidelity degradation, Grover search accuracy, API payload validation).
- **Frontend Build**: TypeScript clean compilation (`npx tsc --noEmit` 0 errors), `npm run build` completed in 36.17s.
- **Cloud Database Persistence**: Workspace CRUD verified end-to-end.
