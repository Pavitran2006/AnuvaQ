# AetherQ Studio Platform — Production Deployment Guide

This guide provides step-by-step instructions for building, containerizing, and deploying the **AetherQ Studio Quantum Computing Platform** to production cloud environments.

---

## 1. Architecture Overview

- **Frontend**: React 18 + TypeScript + Vite (Deployed via Vercel / Render Static Site)
- **Backend**: FastAPI + Python 3.11 + PyNumPy Quantum Engine (Containerized with Docker / Render Web Service)
- **Database**: SQLite (local dev & single-host persistent volume) / PostgreSQL (production cloud database)
- **Security**: JWT Authentication (HS256) + CORS isolation + Environment Variable Secret Management

---

## 2. Environment Configuration

### Backend Environment (`backend/.env`)
```ini
SECRET_KEY=your_secure_jwt_secret_key_here_2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ENVIRONMENT=production
DATABASE_URL=sqlite:///./aetherq.db  # Or postgresql://user:pass@host:5432/dbname
CORS_ORIGINS=https://aetherq.vercel.app,https://aetherq-frontend.onrender.com,http://localhost:5173
PORT=8000
HOST=0.0.0.0
```

### Frontend Environment (`frontend/.env`)
```ini
VITE_API_URL=https://aetherq-backend.onrender.com/api
```

---

## 3. Local Docker Build & Test

Build and run the production container locally:

```bash
# Build the Docker image
docker build -t aetherq-backend:latest .

# Run container with environment variables
docker run -d -p 8000:8000 \
  -e SECRET_KEY="prod_secret_key" \
  -e ENVIRONMENT="production" \
  aetherq-backend:latest
```

Verify backend health:
```bash
curl http://localhost:8000/health
# Output: {"status":"healthy","quantum_engine":"active"}
```

---

## 4. Single-Click Render Deployment Blueprint (`render.yaml`)

Deploy both Backend (Docker Web Service + PostgreSQL) and Frontend (Static Site) to Render using the included `render.yaml`:

1. Push code to GitHub.
2. Connect repository to [Render Dashboard](https://dashboard.render.com/).
3. Create a **New Blueprint Instance**.
4. Render will automatically provision:
   - `aetherq-backend` (Docker container running FastAPI on port 8000)
   - `aetherq-postgres` (PostgreSQL Database)
   - `aetherq-frontend` (React static site built with Vite)

---

## 5. Vercel Frontend Deployment

Deploy the React Vite frontend to Vercel:

```bash
cd frontend
npx vercel --prod
```

Configure `VITE_API_URL` in Vercel Project Settings to point to your deployed FastAPI backend URL (e.g. `https://aetherq-backend.onrender.com/api`).

---

## 6. Verification Steps

1. **Backend Health**: `GET https://<your-backend-url>/health`
2. **Swagger OpenAPI Docs**: `GET https://<your-backend-url>/docs`
3. **Frontend Application**: Navigate to `https://<your-frontend-url>`
4. **Authentication**: Register a new user and log in.
5. **Quantum Simulation**: Run ideal state simulation and verify Bloch spheres & histogram.
6. **Noise Simulation**: Toggle "NOISY ON" and verify Fidelity, Purity, Entropy, and Trace Distance metrics.
7. **Cloud Persistence**: Save circuit to cloud and load it back.
