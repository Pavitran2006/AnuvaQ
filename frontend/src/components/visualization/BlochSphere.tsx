import React from 'react';
import { BlochVector } from '../../types/quantum';

interface BlochSphereProps {
  bloch: BlochVector;
  noisyBloch?: { x: number; y: number; z: number; length: number; theta: number; phi: number };
  noiseEnabled?: boolean;
}

export const BlochSphere: React.FC<BlochSphereProps> = ({ bloch, noisyBloch, noiseEnabled }) => {
  // Projection matrix calculations for isometric 3D sphere visualization
  const size = 180;
  const center = size / 2;
  const radius = 65;

  // Convert Bloch cartesian (x, y, z) into projected 2D SVG canvas points
  // Ideal Vector
  const projX = center + radius * (bloch.x * 0.85 - bloch.y * 0.35);
  const projY = center - radius * (bloch.z * 0.85 + bloch.y * 0.25);

  // Noisy Vector (shrunken inside sphere)
  const noisyProjX = noisyBloch ? center + radius * (noisyBloch.x * 0.85 - noisyBloch.y * 0.35) : projX;
  const noisyProjY = noisyBloch ? center - radius * (noisyBloch.z * 0.85 + noisyBloch.y * 0.25) : projY;

  return (
    <div className="flex flex-col items-center glass-panel p-4 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between w-full mb-2">
        <span className="font-mono text-xs font-bold text-slate-200">Qubit [{bloch.qubit}]</span>
        <span className="font-mono text-[10px] text-quantum-cyan bg-quantum-cyan/10 border border-quantum-cyan/30 px-2 py-0.5 rounded">
          {noiseEnabled && noisyBloch ? `r = ${noisyBloch.length.toFixed(2)} (Mixed)` : `Tr(ρ²) = ${bloch.purity.toFixed(2)}`}
        </span>
      </div>

      {/* SVG Isometric Sphere Canvas */}
      <svg width={size} height={size} className="my-2">
        {/* Outer Sphere Glow */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(0, 242, 255, 0.2)" strokeWidth="1.5" />

        {/* Equator Equidistant Ellipse */}
        <ellipse cx={center} cy={center} rx={radius} ry={radius * 0.35} fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Prime Meridian Ellipse */}
        <ellipse cx={center} cy={center} rx={radius * 0.35} ry={radius} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Axes: Z (Vertical), X (Diagonal Right) */}
        <line x1={center} y1={center - radius - 8} x2={center} y2={center + radius + 8} stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
        <text x={center - 12} y={center - radius - 10} fill="#00f2ff" fontSize="10" fontFamily="monospace" fontWeight="bold">|0⟩ (+Z)</text>
        <text x={center - 12} y={center + radius + 18} fill="#8a2be2" fontSize="10" fontFamily="monospace" fontWeight="bold">|1⟩ (-Z)</text>

        <line x1={center - radius * 0.85} y1={center + radius * 0.35} x2={center + radius * 0.85} y2={center - radius * 0.35} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
        <text x={center + radius * 0.85 + 4} y={center - radius * 0.35} fill="#94a3b8" fontSize="8" fontFamily="monospace">+X</text>

        {/* Ideal State Vector Arrow (Cyan) */}
        <line
          x1={center}
          y1={center}
          x2={projX}
          y2={projY}
          stroke="#00f2ff"
          strokeWidth={noiseEnabled ? '1.5' : '2.5'}
          strokeDasharray={noiseEnabled ? '3 3' : undefined}
          strokeLinecap="round"
        />
        <circle cx={projX} cy={projY} r="3" fill="#00f2ff" />

        {/* Noisy State Vector Arrow (Rose/Pink, shrunken mixed state) */}
        {noiseEnabled && noisyBloch && (
          <>
            <line
              x1={center}
              y1={center}
              x2={noisyProjX}
              y2={noisyProjY}
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx={noisyProjX} cy={noisyProjY} r="4" fill="#f43f5e" className="animate-pulse" />
          </>
        )}
      </svg>

      {/* Numerical Coordinate Summary */}
      <div className="w-full grid grid-cols-3 gap-1 mt-2 text-center font-mono text-[10px]">
        <div className="bg-slate-900 border border-slate-800 p-1 rounded">
          <span className="text-slate-400 block">X</span>
          <span className="text-slate-200 font-semibold">
            {noiseEnabled && noisyBloch ? noisyBloch.x.toFixed(3) : bloch.x.toFixed(3)}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-1 rounded">
          <span className="text-slate-400 block">Y</span>
          <span className="text-slate-200 font-semibold">
            {noiseEnabled && noisyBloch ? noisyBloch.y.toFixed(3) : bloch.y.toFixed(3)}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-1 rounded">
          <span className="text-slate-400 block">Z</span>
          <span className="text-slate-200 font-semibold">
            {noiseEnabled && noisyBloch ? noisyBloch.z.toFixed(3) : bloch.z.toFixed(3)}
          </span>
        </div>
      </div>
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
        <span>θ: {bloch.theta_deg.toFixed(1)}°</span>
        <span>Vector r: {noiseEnabled && noisyBloch ? noisyBloch.length.toFixed(3) : '1.000'}</span>
      </div>
    </div>
  );
};
