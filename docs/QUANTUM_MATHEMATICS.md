# AetherQ - Quantum Computing Mathematics Guide (Interview Preparation)

This guide provides deep mathematical explanations for every linear algebra concept implemented in the AetherQ simulation engine.

---

## 1. Why Quantum States are Represented as Complex Vectors

In classical computing, a bit is strictly either 0 or 1.
In quantum mechanics, a qubit state $|\psi\rangle$ lives in a 2-dimensional complex Hilbert space $\mathcal{H} = \mathbb{C}^2$. It is represented as a linear combination (superposition) of computational basis states $|0\rangle = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$ and $|1\rangle = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$:

$$|\psi\rangle = \alpha |0\rangle + \beta |1\rangle = \begin{bmatrix} \alpha \\ \beta \end{bmatrix}$$

where $\alpha, \beta \in \mathbb{C}$ are **complex probability amplitudes**.

### Key Interview Concept: Why Complex Numbers?
Complex amplitudes $\alpha = a + i b = r e^{i\phi}$ allow quantum systems to exhibit **quantum interference**. When amplitudes combine:
- **Constructive Interference**: Amplitudes add together, increasing probability density.
- **Destructive Interference**: Amplitudes cancel out (e.g., $+1/\sqrt{2}$ and $-1/\sqrt{2}$ add to 0), driving outcome probability to 0! This phase cancellation is the fundamental mechanism behind quantum speedups (such as Grover's Search and QFT).

---

## 2. Why Quantum Gates are Unitary Matrices

Physical evolution of a closed quantum system is governed by the Schrödinger equation, which implies that state evolution operators $U$ MUST preserve total probability:

$$\langle \psi' | \psi' \rangle = \langle \psi | U^\dagger U | \psi \rangle = \langle \psi | \psi \rangle = 1$$

This requires that $U^\dagger U = U U^\dagger = I$, meaning $U$ is a **unitary matrix**.

### Properties of Unitary Gates:
1. **Reversibility**: Every quantum operation is strictly reversible by applying $U^\dagger$ (since $U^\dagger = U^{-1}$).
2. **Norm Preservation**: $\| U|\psi\rangle \| = \| |\psi\rangle \| = 1$.
3. **Eigenvalues**: All eigenvalues of a unitary matrix lie on the complex unit circle $\lambda = e^{i\theta}$.

---

## 3. How Multi-Qubit Systems are Built via Tensor Products ($\otimes$)

When combining $N$ separate qubits into a joint system, the overall state space is the **Kronecker (tensor) product** of the individual Hilbert spaces:

$$\mathcal{H}_{\text{total}} = \mathcal{H}_0 \otimes \mathcal{H}_1 \otimes \dots \otimes \mathcal{H}_{N-1} = \mathbb{C}^{2^N}$$

For 2 qubits:
$$|\psi_{01}\rangle = |\psi_0\rangle \otimes |\psi_1\rangle = \begin{bmatrix} \alpha_0 \\ \beta_0 \end{bmatrix} \otimes \begin{bmatrix} \alpha_1 \\ \beta_1 \end{bmatrix} = \begin{bmatrix} \alpha_0 \alpha_1 \\ \alpha_0 \beta_1 \\ \beta_0 \alpha_1 \\ \beta_0 \beta_1 \end{bmatrix}$$

---

## 4. Quantum Entanglement & Non-Separability

A multi-qubit state $|\psi\rangle$ is **entangled** if it CANNOT be factored into a simple tensor product of individual qubit states $|\psi_A\rangle \otimes |\psi_B\rangle$.

### Example: Bell State $|\Phi^+\rangle$
$$|\Phi^+\rangle = \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle) = \begin{bmatrix} 1/\sqrt{2} \\ 0 \\ 0 \\ 1/\sqrt{2} \end{bmatrix}$$

Measuring Qubit 0 instantly forces Qubit 1 into the exact same outcome value, even across arbitrary distances! The Von Neumann entanglement entropy $S(\rho_A) = -\text{Tr}(\rho_A \log_2 \rho_A) = 1.0$ bit.

---

## 5. Born Rule & Measurement Collapse

Measurement in the computational basis is represented by projection operators $P_k = |k\rangle\langle k|$.
The probability of observing basis state $|k\rangle$ is given by the Born rule:

$$P(k) = |\langle k | \psi \rangle|^2 = |\alpha_k|^2$$

Upon measurement observing outcome $k$, the state vector instantly **collapses**:

$$|\psi\rangle \xrightarrow{\text{Measurement } k} |k\rangle$$
