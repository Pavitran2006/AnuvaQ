/**
 * Pure TypeScript Client-Side Quantum State Vector Simulator
 * Provides instant, zero-latency state preview and offline execution.
 */

import { GateStep, SimulationResult, BasisAmplitude, BlochVector, StepSnapshot } from '../types/quantum';

interface Complex {
  r: number;
  i: number;
}

export class LocalQuantumSimulator {
  private numQubits: number;
  private state: Complex[];

  constructor(numQubits: number) {
    this.numQubits = numQubits;
    const dim = Math.pow(2, numQubits);
    this.state = new Array(dim).fill(0).map(() => ({ r: 0, i: 0 }));
    // Initialize to |0...0⟩
    this.state[0] = { r: 1, i: 0 };
  }

  public static simulate(numQubits: number, gates: GateStep[], shots: number = 1000): SimulationResult {
    const sim = new LocalQuantumSimulator(numQubits);
    const history: StepSnapshot[] = [];

    // Snapshot initial state
    history.push(sim.createSnapshot(0, 'INITIALIZATION', [], []));

    // Sort gates by step index
    const sortedGates = [...gates].sort((a, b) => a.stepIndex - b.stepIndex);

    sortedGates.forEach((gateStep, idx) => {
      sim.applyGate(gateStep);
      history.push(sim.createSnapshot(idx + 1, gateStep.gate, [gateStep.target], gateStep.controls || []));
    });

    const finalAmplitudes = sim.getAmplitudes();
    const finalBloch = sim.getBlochSpheres();
    const shotsSummary = sim.sampleShots(shots);

    return {
      num_qubits: numQubits,
      total_steps: sortedGates.length,
      final_amplitudes: finalAmplitudes,
      final_bloch_spheres: finalBloch,
      shots_summary: shotsSummary,
      step_history: history,
    };
  }

  private applyGate(step: GateStep): void {
    const { gate, target, controls = [], params = {} } = step;
    const theta = params.theta ?? Math.PI / 2;

    // Single-qubit matrices
    let u: [Complex, Complex, Complex, Complex];

    switch (gate.toUpperCase()) {
      case 'H': {
        const invSqrt2 = 1 / Math.SQRT2;
        u = [{ r: invSqrt2, i: 0 }, { r: invSqrt2, i: 0 }, { r: invSqrt2, i: 0 }, { r: -invSqrt2, i: 0 }];
        break;
      }
      case 'X': {
        u = [{ r: 0, i: 0 }, { r: 1, i: 0 }, { r: 1, i: 0 }, { r: 0, i: 0 }];
        break;
      }
      case 'Y': {
        u = [{ r: 0, i: 0 }, { r: 0, i: -1 }, { r: 0, i: 1 }, { r: 0, i: 0 }];
        break;
      }
      case 'Z': {
        u = [{ r: 1, i: 0 }, { r: 0, i: 0 }, { r: 0, i: 0 }, { r: -1, i: 0 }];
        break;
      }
      case 'S': {
        u = [{ r: 1, i: 0 }, { r: 0, i: 0 }, { r: 0, i: 0 }, { r: 0, i: 1 }];
        break;
      }
      case 'SDG': {
        u = [{ r: 1, i: 0 }, { r: 0, i: 0 }, { r: 0, i: 0 }, { r: 0, i: -1 }];
        break;
      }
      case 'T': {
        const val = Math.SQRT1_2;
        u = [{ r: 1, i: 0 }, { r: 0, i: 0 }, { r: 0, i: 0 }, { r: val, i: val }];
        break;
      }
      case 'RX': {
        const c = Math.cos(theta / 2);
        const s = Math.sin(theta / 2);
        u = [{ r: c, i: 0 }, { r: 0, i: -s }, { r: 0, i: -s }, { r: c, i: 0 }];
        break;
      }
      case 'RY': {
        const c = Math.cos(theta / 2);
        const s = Math.sin(theta / 2);
        u = [{ r: c, i: 0 }, { r: -s, i: 0 }, { r: s, i: 0 }, { r: c, i: 0 }];
        break;
      }
      case 'RZ': {
        const c = Math.cos(theta / 2);
        const s = Math.sin(theta / 2);
        u = [{ r: c, i: -s }, { r: 0, i: 0 }, { r: 0, i: 0 }, { r: c, i: s }];
        break;
      }
      default:
        u = [{ r: 1, i: 0 }, { r: 0, i: 0 }, { r: 0, i: 0 }, { r: 1, i: 0 }];
    }

    const dim = Math.pow(2, this.numQubits);
    const newState: Complex[] = new Array(dim).fill(0).map(() => ({ r: 0, i: 0 }));

    for (let i = 0; i < dim; i++) {
      const bStr = i.toString(2).padStart(this.numQubits, '0');

      // Check controls
      const controlsActive = controls.every((c) => bStr[c] === '1');

      if (!controlsActive) {
        newState[i].r += this.state[i].r;
        newState[i].i += this.state[i].i;
      } else {
        const targetVal = parseInt(bStr[target], 10);
        for (let k = 0; k < 2; k++) {
          const uCoeff = u[k * 2 + targetVal];
          const origAmp = this.state[i];

          // Complex multiply
          const realPart = origAmp.r * uCoeff.r - origAmp.i * uCoeff.i;
          const imagPart = origAmp.r * uCoeff.i + origAmp.i * uCoeff.r;

          const outBits = bStr.split('');
          outBits[target] = k.toString();
          const j = parseInt(outBits.join(''), 2);

          newState[j].r += realPart;
          newState[j].i += imagPart;
        }
      }
    }

    this.state = newState;
  }

  private getAmplitudes(): BasisAmplitude[] {
    const dim = Math.pow(2, this.numQubits);
    return this.state.map((amp, i) => {
      const prob = amp.r * amp.r + amp.i * amp.i;
      const mag = Math.sqrt(prob);
      const phase = Math.atan2(amp.i, amp.r);
      const bStr = i.toString(2).padStart(this.numQubits, '0');

      return {
        index: i,
        basis: `|${bStr}⟩`,
        binary: bStr,
        real: Math.round(amp.r * 10000) / 10000,
        imag: Math.round(amp.i * 10000) / 10000,
        magnitude: Math.round(mag * 10000) / 10000,
        probability: Math.round(prob * 10000) / 10000,
        phase_rad: Math.round(phase * 10000) / 10000,
        phase_deg: Math.round((phase * 180 / Math.PI) * 100) / 100,
      };
    });
  }

  private getBlochSpheres(): BlochVector[] {
    const blochVectors: BlochVector[] = [];

    for (let q = 0; q < this.numQubits; q++) {
      // Calculate single qubit density matrix components
      let r00 = 0, r11 = 0, r01_r = 0, r01_i = 0;
      const dim = Math.pow(2, this.numQubits);

      for (let i = 0; i < dim; i++) {
        const bStr = i.toString(2).padStart(this.numQubits, '0');
        const ampI = this.state[i];

        if (bStr[q] === '0') {
          r00 += ampI.r * ampI.r + ampI.i * ampI.i;
        } else {
          r11 += ampI.r * ampI.r + ampI.i * ampI.i;
        }

        // Find corresponding state with flipped qubit q for off-diagonal r01
        for (let j = 0; j < dim; j++) {
          const bStrJ = j.toString(2).padStart(this.numQubits, '0');
          if (bStr[q] === '0' && bStrJ[q] === '1') {
            const sameOthers = bStr.split('').every((bit, k) => k === q || bit === bStrJ[k]);
            if (sameOthers) {
              const ampJ = this.state[j];
              // ampI * conj(ampJ) = (rI + i iI) * (rJ - i iJ) = (rI rJ + iI iJ) + i (iI rJ - rI iJ)
              r01_r += ampI.r * ampJ.r + ampI.i * ampJ.i;
              r01_i += ampI.i * ampJ.r - ampI.r * ampJ.i;
            }
          }
        }
      }

      const x = 2 * r01_r;
      const y = -2 * r01_i;
      const z = r00 - r11;
      const radius = Math.sqrt(x * x + y * y + z * z);
      const cosTheta = radius > 1e-6 ? Math.max(-1, Math.min(1, z / radius)) : 0;
      const theta = radius > 1e-6 ? Math.acos(cosTheta) : 0;
      const phi = Math.atan2(y, x);
      const purity = (1 + radius * radius) / 2;

      blochVectors.push({
        qubit: q,
        x: Math.round(x * 1000) / 1000,
        y: Math.round(y * 1000) / 1000,
        z: Math.round(z * 1000) / 1000,
        radius: Math.round(radius * 1000) / 1000,
        theta_rad: Math.round(theta * 1000) / 1000,
        theta_deg: Math.round((theta * 180 / Math.PI) * 10) / 10,
        phi_rad: Math.round(phi * 1000) / 1000,
        phi_deg: Math.round((phi * 180 / Math.PI) * 10) / 10,
        purity: Math.round(purity * 1000) / 1000,
      });
    }

    return blochVectors;
  }

  private sampleShots(shots: number): Record<string, number> {
    const amplitudes = this.getAmplitudes();
    const counts: Record<string, number> = {};

    for (let s = 0; s < shots; s++) {
      const rand = Math.random();
      let cumulative = 0;
      for (const amp of amplitudes) {
        cumulative += amp.probability;
        if (rand <= cumulative) {
          counts[amp.binary] = (counts[amp.binary] || 0) + 1;
          break;
        }
      }
    }

    return counts;
  }

  private createSnapshot(
    step: number,
    action: string,
    target_qubits: number[],
    control_qubits: number[]
  ): StepSnapshot {
    const amplitudes = this.getAmplitudes();
    return {
      step,
      action,
      target_qubits,
      control_qubits,
      amplitudes,
      probabilities: amplitudes.map((a) => a.probability),
      bloch_spheres: this.getBlochSpheres(),
    };
  }
}
