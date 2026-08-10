# AnuvaQ — Developer & Engineering Guide

## 1. Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Docker (Optional)

### Backend Setup (FastAPI + PyNumPy)
```bash
cd backend

# Create Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend dev server
uvicorn app.main:app --reload --port 8000
```
Backend API will be live at `http://localhost:8000`
Interactive Swagger Docs at `http://localhost:8000/docs`

### Frontend Setup (Vite + React + TypeScript)
```bash
cd frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend Web Studio will be live at `http://localhost:3000`

---

## 2. Running Automated Tests

### Backend Pytest Suite
```bash
cd backend
pytest
```
Tests:
- `test_gate_unitaries`: Validates $U^\dagger U = I$ for all gates.
- `test_state_vector_normalization`: Validates $\sum |\alpha_k|^2 = 1$.
- `test_bell_state_entanglement`: Validates CNOT Bell state creation and entanglement entropy.
- `test_bloch_sphere_coordinates`: Validates $(x, y, z)$ projections for $|0\rangle, |1\rangle, |+\rangle$.
- `test_grover_search_algorithm`: Validates Grover search target detection (>90% accuracy).
- `test_deutsch_jozsa_algorithm`: Validates constant vs balanced oracle classification.
- `test_api.py`: Validates FastAPI REST endpoints.

### Frontend Typechecking & Build
```bash
cd frontend
npm run lint
npm run build
```

---

## 3. Docker Deployment

```bash
docker-compose up --build -d
```
Containerizes FastAPI server and SQLite persistent storage.
