# AetherQ Studio - REST API Specification

Base URL: `http://localhost:8000/api`

---

## 1. Authentication Endpoints (`/auth`)

### `POST /auth/register`
Creates a new user account and default workspace. Returns JWT access token.
- **Request Body**:
  ```json
  {
    "email": "engineer@aetherq.io",
    "full_name": "Quantum Developer",
    "password": "SecurePassword123!"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "bearer",
    "user": {
      "id": "uuid-v4",
      "email": "engineer@aetherq.io",
      "full_name": "Quantum Developer",
      "created_at": "2026-08-06T12:00:00Z"
    }
  }
  ```

### `POST /auth/login`
Authenticates existing credentials and returns JWT bearer token.

### `GET /auth/me`
Returns logged-in user profile. Requires `Authorization: Bearer <token>` header.

---

## 2. Simulation Engine Endpoints (`/simulation`)

### `POST /simulation/run`
Executes a circuit definition on the custom NumPy Quantum Simulator engine.
- **Request Body**:
  ```json
  {
    "num_qubits": 2,
    "initial_state": "00",
    "gates": [
      { "gate": "H", "target": 0, "controls": [] },
      { "gate": "CX", "target": 1, "controls": [0] }
    ],
    "shots": 1000
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "num_qubits": 2,
    "total_steps": 2,
    "final_amplitudes": [
      { "basis": "|00⟩", "probability": 0.5, "real": 0.7071, "imag": 0.0, "phase_deg": 0.0 },
      { "basis": "|01⟩", "probability": 0.0, "real": 0.0, "imag": 0.0, "phase_deg": 0.0 },
      { "basis": "|10⟩", "probability": 0.0, "real": 0.0, "imag": 0.0, "phase_deg": 0.0 },
      { "basis": "|11⟩", "probability": 0.5, "real": 0.7071, "imag": 0.0, "phase_deg": 0.0 }
    ],
    "final_bloch_spheres": [
      { "qubit": 0, "x": 0.0, "y": 0.0, "z": 0.0, "radius": 0.0, "purity": 0.5 },
      { "qubit": 1, "x": 0.0, "y": 0.0, "z": 0.0, "radius": 0.0, "purity": 0.5 }
    ],
    "shots_summary": { "00": 498, "11": 502 }
  }
  ```

### `POST /simulation/parse-qasm`
Parses OpenQASM 2.0 source code into executable circuit gate steps.

### `POST /simulation/export-qasm`
Converts circuit gate step sequence into standard OpenQASM 2.0 code.

---

## 3. Algorithm Endpoints (`/algorithms`)

### `GET /algorithms/list`
Returns metadata list of pre-built quantum algorithms (Bell State, Deutsch-Jozsa, Grover Search, QFT, Teleportation).

### `POST /algorithms/run/{algo_id}?param={value}`
Executes pre-configured algorithm and returns complete step-by-step state vector breakdown.
