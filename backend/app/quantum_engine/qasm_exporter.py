"""
AnuvaQ OpenQASM 2.0 Exporter
============================

Converts internal AnuvaQ circuit definitions into compliant OpenQASM 2.0 source code.
"""

from typing import Dict, Any, List


class QASMExporter:
    """
    Exports circuit gate sequences into standard OpenQASM 2.0 format.
    """

    @staticmethod
    def export_qasm(num_qubits: int, gates: List[Dict[str, Any]]) -> str:
        lines = [
            'OPENQASM 2.0;',
            'include "qelib1.inc";',
            f'qreg q[{num_qubits}];',
            f'creg c[{num_qubits}];',
            ''
        ]

        for step in gates:
            gate_name = step.get('gate', '').lower()
            target = step.get('target', 0)
            controls = step.get('controls', [])
            params = step.get('params', {})

            if not controls:
                if gate_name in ['rx', 'ry', 'rz']:
                    theta = params.get('theta', 0.0)
                    lines.append(f'{gate_name}({theta:.6f}) q[{target}];')
                else:
                    lines.append(f'{gate_name} q[{target}];')
            else:
                ctrl = controls[0]
                if gate_name == 'x':
                    lines.append(f'cx q[{ctrl}], q[{target}];')
                elif gate_name == 'z':
                    lines.append(f'cz q[{ctrl}], q[{target}];')
                elif gate_name == 'swap':
                    lines.append(f'swap q[{ctrl}], q[{target}];')
                else:
                    lines.append(f'c{gate_name} q[{ctrl}], q[{target}];')

        # Add default measurement lines at the end
        lines.append('')
        for q in range(num_qubits):
            lines.append(f'measure q[{q}] -> c[{q}];')

        return '\n'.join(lines)
