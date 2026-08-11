import time
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_e2e_journey():
    # 1. Health check
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"

    # 2. Registration & Auth (HTTP 201 Created)
    email = f"e2e_audit_{int(time.time())}@anuvaq.io"
    reg_resp = client.post("/api/auth/register", json={
        "email": email,
        "full_name": "E2E Auditor",
        "password": "Password123!"
    })
    assert reg_resp.status_code == 201, f"Expected 201 Created, got {reg_resp.status_code}"
    token = reg_resp.json()["access_token"]
    auth_header = {"Authorization": f"Bearer {token}"}

    # 3. Duplicate Registration rejection (HTTP 400 Bad Request)
    dup_resp = client.post("/api/auth/register", json={
        "email": email,
        "full_name": "Dup Tester",
        "password": "Password123!"
    })
    assert dup_resp.status_code == 400, f"Expected 400 Bad Request, got {dup_resp.status_code}"

    # 4. Login & Invalid Password rejection
    login_resp = client.post("/api/auth/login", data={
        "username": email,
        "password": "Password123!"
    })
    assert login_resp.status_code == 200

    wrong_login = client.post("/api/auth/login", data={
        "username": email,
        "password": "WrongPassword"
    })
    assert wrong_login.status_code == 400

    # 5. Profile Retrieval
    profile_resp = client.get("/api/auth/me", headers=auth_header)
    assert profile_resp.status_code == 200
    assert profile_resp.json()["email"] == email

    # 6. Quantum Noise Engine (All 5 Kraus channels)
    channels = ["bit_flip", "phase_flip", "depolarizing", "amplitude_damping", "phase_damping"]
    for ch in channels:
        sim_payload = {
            "num_qubits": 2,
            "initial_state": "00",
            "gates": [
                {"gate": "H", "target": 0, "controls": []},
                {"gate": "CX", "target": 1, "controls": [0]}
            ],
            "shots": 1000,
            "noise_enabled": True,
            "noise_model": ch,
            "noise_probability": 0.15
        }
        sim_resp = client.post("/api/simulation/run", json=sim_payload)
        assert sim_resp.status_code == 200, f"Simulation failed for channel {ch}: {sim_resp.text}"
        metrics = sim_resp.json()["quantum_metrics"]
        assert 0.0 <= metrics["fidelity"] <= 1.0
        assert 0.0 <= metrics["purity"] <= 1.0
        assert metrics["entropy"] >= 0.0
        assert metrics["trace_distance"] >= 0.0

    # 7. Algorithms Execution
    algos_resp = client.get("/api/algorithms/list")
    assert algos_resp.status_code == 200
    algos = algos_resp.json()
    assert len(algos) >= 5

    for algo in algos:
        run_resp = client.post(f"/api/algorithms/run/{algo['id']}")
        assert run_resp.status_code == 200

    # 8. Workspace Project CRUD
    proj_resp = client.post("/api/circuits/", json={
        "name": "Audit Bell Circuit",
        "description": "Created during E2E verification",
        "num_qubits": 2,
        "gates_json": '[{"gate":"H","target":0,"controls":[]}]'
    }, headers=auth_header)
    assert proj_resp.status_code == 201
    p_id = proj_resp.json()["id"]

    list_resp = client.get("/api/circuits/", headers=auth_header)
    assert list_resp.status_code == 200
    assert any(p["id"] == p_id for p in list_resp.json())

    ren_resp = client.put(f"/api/circuits/{p_id}", json={
        "name": "Audit Bell Circuit Renamed"
    }, headers=auth_header)
    assert ren_resp.status_code == 200
    assert ren_resp.json()["name"] == "Audit Bell Circuit Renamed"

    dup_proj_resp = client.post(f"/api/circuits/{p_id}/duplicate", headers=auth_header)
    assert dup_proj_resp.status_code == 201
    dup_id = dup_proj_resp.json()["id"]

    del_resp = client.delete(f"/api/circuits/{p_id}", headers=auth_header)
    assert del_resp.status_code == 204

    del_dup_resp = client.delete(f"/api/circuits/{dup_id}", headers=auth_header)
    assert del_dup_resp.status_code == 204
