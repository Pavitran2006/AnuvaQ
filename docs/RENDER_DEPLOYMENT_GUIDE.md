# AnuvaQ — Render Backend & PostgreSQL Deployment Guide (Phase 1)

**Date**: August 11, 2026  
**Repository**: [https://github.com/Pavitran2006/AnuvaQ](https://github.com/Pavitran2006/AnuvaQ)  
**Blueprint File**: `render.yaml`

---

## 1. Blueprint Configuration Overview

The repository contains a fully automated `render.yaml` blueprint defining the complete production backend infrastructure:

```yaml
services:
  # 1. FastAPI Quantum Backend Web Service
  - type: web
    name: anuvaq-backend
    runtime: docker
    dockerfilePath: ./Dockerfile
    dockerContext: .
    region: oregon
    plan: free
    healthCheckPath: /health
    envVars:
      - key: ENVIRONMENT
        value: production
      - key: SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: anuvaq-postgres
          property: connectionString
      - key: CORS_ORIGINS
        value: "*"

databases:
  # 2. Production PostgreSQL Database
  - name: anuvaq-postgres
    databaseName: anuvaq_db
    user: anuvaq_user
    plan: free
```

---

## 2. Pre-Deployment Audit & Security Checklist

- [x] **Repository Status**: `Pavitran2006/AnuvaQ` master branch up-to-date
- [x] **Secrets & Credentials**: 0 real `.env` files tracked (only `.env.example` templates committed)
- [x] **PostgreSQL Connection Formatting**: `backend/app/config.py` handles Render's `postgres://` to `postgresql://` string normalization
- [x] **Health Check Route**: `/health` configured to return HTTP 200 with engine status
- [x] **CORS Configuration**: Configured to accept requests from frontend domains

---

## 3. Simple Step-by-Step Render Deployment Instructions

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click the **New +** button at the top right and select **Blueprint**.
3. Select and connect your repository: **`Pavitran2006/AnuvaQ`**.
4. Render will automatically read `render.yaml` and display the two resources to create:
   - **`anuvaq-backend`** (Web Service — Docker)
   - **`anuvaq-postgres`** (PostgreSQL Database)
5. Click **Apply**.
6. Render will provision the PostgreSQL database and build the Docker container.
7. Once build completes, copy your live backend URL (e.g. `https://anuvaq-backend.onrender.com`).

---

## 4. Live Verification Commands

Once live, verify your Render backend by executing:

```bash
# 1. Health Check
curl -X GET https://anuvaq-backend.onrender.com/health

# 2. List Algorithms
curl -X GET https://anuvaq-backend.onrender.com/api/algorithms/list

# 3. Test Simulation Endpoint
curl -X POST https://anuvaq-backend.onrender.com/api/simulation/run \
  -H "Content-Type: application/json" \
  -d '{"num_qubits": 2, "gates": [{"gate": "H", "target": 0, "controls": []}]}'
```
