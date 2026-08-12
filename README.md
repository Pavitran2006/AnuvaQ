# AnuvaQ — Interactive Quantum Computing & Noise Simulation Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-anuvaq.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://anuvaq.vercel.app/)
[![API Backend](https://img.shields.io/badge/Backend_API-anuvaq--backend.onrender.com-00e5ff?style=for-the-badge&logo=render)](https://anuvaq-backend.onrender.com/health)
[![Pytest Suite](https://img.shields.io/badge/Tests-24%2F24_Passed-00e676?style=for-the-badge&logo=pytest)](https://github.com/Pavitran2006/AnuvaQ)
[![TypeScript](https://img.shields.io/badge/TypeScript-0_Errors-3178c6?style=for-the-badge&logo=typescript)](https://github.com/Pavitran2006/AnuvaQ)

> **AnuvaQ** is an enterprise-grade, full-stack quantum computing platform designed and built from first principles. It features a custom linear algebra Quantum State Vector Simulator & Density Matrix Kraus Noise Engine written in pure Python/NumPy (zero external quantum library dependencies), a FastAPI REST backend with PostgreSQL persistence and JWT security, and an interactive Deep Space Scientific React 18 circuit builder studio.

### 🌐 Live Production Links
* **Frontend Web App**: [https://anuvaq.vercel.app/](https://anuvaq.vercel.app/)
* **FastAPI Backend Service**: [https://anuvaq-backend.onrender.com](https://anuvaq-backend.onrender.com)
* **API Documentation**: [https://anuvaq-backend.onrender.com/docs](https://anuvaq-backend.onrender.com/docs)

---

## 📸 Platform Screenshots

![Landing Page](screenshots/landing.png)
*Landing Page — Modern Commercial Hero Section with Quick Algorithm Presets*

![Circuit Studio](screenshots/circuit_studio.png)
*Circuit Studio — Categorized Gate Palette, Drag-and-Drop Matrix Canvas & Noise Control Panel*

![Quantum Noise Metrics](screenshots/noise_simulation.png)
*Quantum Noise Simulation Engine — Kraus Operator Depolarizing Channel & Quantum Information Metrics ($F, \mathcal{P}, S, D$)*

![State Analytics](screenshots/analytics.png)
*Live Visual Analytics — 3D Bloch Spheres, Dual-Bar Histogram, Density Matrix Heatmap & Amplitude Spectrum*

![Algorithm Library](screenshots/algorithms.png)
*Algorithm Library — Pre-configured Grover Search, Deutsch-Jozsa, QFT & Teleportation Algorithms*

---

## 🌟 Key Features

- **Custom Linear Algebra Engine**: Simulates $N$-qubit state vectors $|\psi\rangle \in \mathbb{C}^{2^N}$, matrix tensor products $U_1 \otimes U_2$, Born rule collapse, partial trace reduced density matrices, and Von Neumann entanglement entropy.
- **Quantum Noise Simulation Engine (Kraus Operator Engine)**:
  - **Density Matrix Mechanics**: Full $2^N \times 2^N$ density matrix evolution ($\rho \in \mathbb{C}^{2^N \times 2^N}$).
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

## 🛠️ Tech Stack & Architecture

- **Backend**: Python 3.11, FastAPI, NumPy, SQLAlchemy 2.0, PostgreSQL / SQLite, Pytest, PyJWT, Passlib (Bcrypt), Docker.
- **Frontend**: React 18, Vite, TypeScript, TailwindCSS, Zustand, Lucide Icons, Axios.
- **Automated Tests**: 23 Pytest integration & unit tests (**100% pass rate**).
- **Static Typing**: 0 TypeScript compilation errors (`npx tsc --noEmit`).

---

## 🚀 Quick Start (Local Development)

### 1. Clone Repository & Install Dependencies
```bash
# Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend Setup
cd ../frontend
npm install
```

### 2. Run Application
```bash
# Start FastAPI Backend Server
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Start Frontend Preview Server
cd frontend
npm run preview
```
- Frontend Web App: `http://localhost:4173`
- Backend REST API: `http://localhost:8000`
- Swagger API Documentation: `http://localhost:8000/docs`

---

## ☁️ Deployment Blueprint

The repository contains pre-configured automation files for permanent 1-click cloud deployments:
- **`render.yaml`**: Render Infrastructure-as-Code blueprint for multi-service Docker FastAPI backend + Managed PostgreSQL database.
- **`Dockerfile`**: Multi-stage production container with `libpq-dev` drivers and dynamic `$PORT` binding.
- **`frontend/vercel.json`**: SPA routing configuration for Vercel static hosting.
