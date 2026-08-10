"""
AetherQ REST API Integration Tests
"""

import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["system"] == "AetherQ Quantum Computing Platform"


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_simulation_run_endpoint():
    payload = {
        "num_qubits": 2,
        "initial_state": "00",
        "gates": [
            {"gate": "H", "target": 0, "controls": []},
            {"gate": "X", "target": 1, "controls": [0]}
        ],
        "shots": 500
    }
    response = client.post("/api/simulation/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["num_qubits"] == 2
    assert "final_amplitudes" in data
    assert "shots_summary" in data


def test_algorithm_list_and_run():
    list_res = client.get("/api/algorithms/list")
    assert list_res.status_code == 200
    algos = list_res.json()
    assert len(algos) >= 5

    run_res = client.post("/api/algorithms/run/bell-state?param=0")
    assert run_res.status_code == 200
    assert run_res.json()["num_qubits"] == 2


def test_simulation_invalid_bounds():
    # Test num_qubits > 8 returns 422 Unprocessable Entity validation error
    payload_invalid_qubits = {
        "num_qubits": 16,
        "gates": []
    }
    res = client.post("/api/simulation/run", json=payload_invalid_qubits)
    assert res.status_code == 422

    # Test shots > 10000 returns 422 Unprocessable Entity
    payload_invalid_shots = {
        "num_qubits": 2,
        "gates": [],
        "shots": 50000
    }
    res2 = client.post("/api/simulation/run", json=payload_invalid_shots)
    assert res2.status_code == 422


def test_qasm_parse_and_export():
    qasm_str = "OPENQASM 2.0;\ninclude \"qelib1.inc\";\nqreg q[2];\nh q[0];\ncx q[0],q[1];\n"
    res = client.post("/api/simulation/parse-qasm", json={"qasm_code": qasm_str})
    assert res.status_code == 200
    assert len(res.json()["gates"]) == 2


def test_circuit_crud_and_duplicate():
    # Register & Login test user
    email = f"crud_user_{uuid.uuid4().hex[:6]}@aetherq.io"
    reg_res = client.post("/api/auth/register", json={
        "email": email,
        "password": "Password123!",
        "full_name": "CRUD Test User"
    })
    assert reg_res.status_code == 201
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create circuit
    create_res = client.post("/api/circuits/", headers=headers, json={
        "name": "Test Bell Circuit",
        "description": "Bell state for unit test",
        "num_qubits": 2,
        "gates_json": "[{\"gate\":\"H\",\"target\":0}]"
    })
    assert create_res.status_code == 201
    circuit_id = create_res.json()["id"]

    # 2. List circuits
    list_res = client.get("/api/circuits/", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # 3. Update circuit (rename)
    put_res = client.put(f"/api/circuits/{circuit_id}", headers=headers, json={
        "name": "Renamed Bell Circuit"
    })
    assert put_res.status_code == 200
    assert put_res.json()["name"] == "Renamed Bell Circuit"

    # 4. Duplicate circuit
    dup_res = client.post(f"/api/circuits/{circuit_id}/duplicate", headers=headers)
    assert dup_res.status_code == 201
    assert dup_res.json()["name"] == "Renamed Bell Circuit (Copy)"

    # 5. Delete circuit
    del_res = client.delete(f"/api/circuits/{circuit_id}", headers=headers)
    assert del_res.status_code == 204

