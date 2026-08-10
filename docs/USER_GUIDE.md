# AetherQ Studio - End User Guide

Welcome to **AetherQ Studio**, an advanced Quantum Computing & Circuit Simulation Platform.

---

## 1. Quickstart: Building Your First Quantum Circuit

1. Open the **Circuit Studio** tab.
2. In the **Qubits** control counter, choose your register size (e.g. 2 qubits).
3. From the **Gate Library** sidebar, click a gate (e.g., **Hadamard `H`**).
4. Click on grid slot at **q[0] / Step 0** to place the Hadamard gate.
5. Next, click **CNOT `CX`** in the gate library.
   - Click **q[0] / Step 1** to select Control qubit.
   - Click **q[1] / Step 1** to select Target qubit.
6. Click **Simulate Circuit**!

---

## 2. Exploring Visualizations

Scroll down to inspect the live analytics dashboard:
- **Bloch Spheres**: Interactive 3D vector spheres displaying individual qubit states, polar angle $\theta$, azimuthal angle $\phi$, and state purity $\text{Tr}(\rho^2)$.
- **State Histogram**: Bar visualizer displaying computational state probabilities $P(|x\rangle)$ and Monte Carlo shot counts.
- **Density Matrix Heatmap**: $2^N \times 2^N$ grid showing complex density matrix elements $\rho = |\psi\rangle\langle\psi|$.
- **State Vector Table**: Full amplitude listing showing real/imaginary components, magnitude, and phase angles in degrees.

---

## 3. Pre-Built Algorithm Library

Click the **Algorithm Library** tab in the top navigation bar to run standard algorithms:
- **Bell State Generator**: Create 4 maximally entangled 2-qubit states.
- **Deutsch-Jozsa**: Determine if an oracle function is Constant or Balanced in 1 query.
- **Grover's Search**: Perform quadratic speedup search for a target binary state.
- **Quantum Fourier Transform (QFT)**: Quantum frequency domain transformation.
- **Quantum Teleportation Protocol**: Teleport unknown single-qubit state across Alice and Bob via Bell pair.

---

## 4. OpenQASM 2.0 Import / Export

Click the **OpenQASM 2.0** button in the circuit toolbar to view the generated assembly code or paste external OpenQASM 2.0 source code to automatically parse and render it into the visual matrix grid.
