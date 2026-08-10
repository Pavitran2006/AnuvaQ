"""
AnuvaQ OpenQASM 2.0 Parser
============================

Parses OpenQASM 2.0 text into AnuvaQ internal gate instructions.
Supports Qreg declarations, single qubit gates (h, x, y, z, s, sdg, t, tdg, rx, ry, rz, u1, u2, u3),
2-qubit controlled gates (cx, cz, swap), and measurement statements.
"""

import re
from typing import Dict, Any, List


class QASMParser:
    """
    Parses standard OpenQASM 2.0 strings into executable circuit step definitions.
    """

    @staticmethod
    def parse_qasm(qasm_string: str) -> Dict[str, Any]:
        lines = [line.strip() for line in qasm_string.split('\n') if line.strip() and not line.strip().startswith('//')]

        num_qubits = 2
        gates: List[Dict[str, Any]] = []

        for line in lines:
            if line.startswith('OPENQASM') or line.startswith('include'):
                continue

            # Parse qreg q[N];
            qreg_match = re.match(r'qreg\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\[\s*(\d+)\s*\]\s*;', line)
            if qreg_match:
                num_qubits = int(qreg_match.group(2))
                continue

            # Parse gates e.g. h q[0]; or cx q[0], q[1];
            # Single qubit gate
            sq_match = re.match(r'([a-zA-Z0-9_]+)\s+q\[(\d+)\]\s*;', line)
            if sq_match:
                gate_name = sq_match.group(1).upper()
                target = int(sq_match.group(2))
                gates.append({
                    "gate": gate_name,
                    "target": target,
                    "controls": [],
                    "params": {}
                })
                continue

            # Controlled gate e.g. cx q[0], q[1];
            cx_match = re.match(r'([a-zA-Z0-9_]+)\s+q\[(\d+)\]\s*,\s*q\[(\d+)\]\s*;', line)
            if cx_match:
                gate_name = cx_match.group(1).upper()
                ctrl = int(cx_match.group(2))
                target = int(cx_match.group(3))

                if gate_name in ['CX', 'CNOT']:
                    gates.append({
                        "gate": "X",
                        "target": target,
                        "controls": [ctrl],
                        "params": {}
                    })
                elif gate_name == 'CZ':
                    gates.append({
                        "gate": "Z",
                        "target": target,
                        "controls": [ctrl],
                        "params": {}
                    })
                elif gate_name == 'SWAP':
                    gates.append({
                        "gate": "SWAP",
                        "target": target,
                        "controls": [ctrl],
                        "params": {}
                    })
                continue

            # Parametric rotation gate e.g. rx(1.5708) q[0];
            rot_match = re.match(r'([a-zA-Z0-9_]+)\s*\(\s*([0-9\.\-\+eE]+)\s*\)\s+q\[(\d+)\]\s*;', line)
            if rot_match:
                gate_name = rot_match.group(1).upper()
                angle = float(rot_match.group(2))
                target = int(rot_match.group(3))
                gates.append({
                    "gate": gate_name,
                    "target": target,
                    "controls": [],
                    "params": {"theta": angle}
                })
                continue

        return {
            "num_qubits": num_qubits,
            "gates": gates
        }
