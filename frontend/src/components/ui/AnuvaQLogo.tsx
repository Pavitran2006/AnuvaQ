import React from 'react';

interface AnuvaQLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'full' | 'mark' | 'hero';
  showBadge?: boolean;
  className?: string;
}

export const AnuvaQLogoMark: React.FC<{ sizePx?: number; className?: string }> = ({
  sizePx = 32,
  className = '',
}) => {
  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="AnuvaQ Symbol"
    >
      <defs>
        {/* Core Gradients */}
        <linearGradient id="anuvaq-grad-a" x1="12" y1="52" x2="52" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        <linearGradient id="anuvaq-grad-q" x1="20" y1="20" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        <radialGradient id="anuvaq-nucleus-glow" cx="32" cy="32" r="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Micro Orbital Halo */}
      <circle cx="32" cy="32" r="28" fill="url(#anuvaq-nucleus-glow)" opacity="0.35" />

      {/* 4. Elliptical Quantum Orbit Path (Interacting with A & Q) */}
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="10"
        fill="none"
        stroke="url(#anuvaq-grad-q)"
        strokeWidth="1.75"
        strokeDasharray="4 2 12 2"
        transform="rotate(-30 32 32)"
        opacity="0.75"
      />

      {/* 1 & 2. Integrated A + Q Primary Structure */}
      {/* Left Apex Leg of 'A' */}
      <path
        d="M 32 12 L 14 52"
        stroke="url(#anuvaq-grad-a)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Leg of 'A' looping seamlessly into 'Q' Tail */}
      <path
        d="M 32 12 L 50 52 C 54 58, 42 60, 36 54 C 32 50, 36 42, 44 44 C 50 45, 54 50, 50 54"
        stroke="url(#anuvaq-grad-a)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Crossbar of 'A' */}
      <line
        x1="22"
        y1="37"
        x2="42"
        y2="37"
        stroke="#06b6d4"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* 3. Quantum Nucleus Core */}
      <circle cx="32" cy="37" r="4.5" fill="#38bdf8" stroke="#070a12" strokeWidth="1.5" />
      <circle cx="32" cy="37" r="1.5" fill="#ffffff" />

      {/* 5. Particle Transition (Decay/Computation Pixels at Right Apex) */}
      <rect x="44" y="14" width="2.5" height="2.5" rx="0.5" fill="#38bdf8" opacity="0.9" />
      <rect x="49" y="10" width="2" height="2" rx="0.5" fill="#06b6d4" opacity="0.7" />
      <rect x="53" y="7" width="1.5" height="1.5" rx="0.5" fill="#8b5cf6" opacity="0.5" />

      {/* 6. Curiosity Spark (4-Point Star at Top Apex) */}
      <path
        d="M 32 4 L 33.2 8.8 L 38 10 L 33.2 11.2 L 32 16 L 30.8 11.2 L 26 10 L 30.8 8.8 Z"
        fill="#38bdf8"
        opacity="0.95"
      />
    </svg>
  );
};

export const AnuvaQLogo: React.FC<AnuvaQLogoProps> = ({
  size = 'md',
  variant = 'full',
  showBadge = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { mark: 24, font: 'text-sm', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { mark: 32, font: 'text-base', badge: 'text-[10px] px-2 py-0.5' },
    lg: { mark: 40, font: 'text-xl', badge: 'text-xs px-2.5 py-1' },
    xl: { mark: 52, font: 'text-3xl', badge: 'text-xs px-3 py-1' },
    hero: { mark: 64, font: 'text-4xl md:text-5xl', badge: 'text-xs px-3 py-1' },
  };

  const config = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <AnuvaQLogoMark sizePx={config.mark} />

      {variant !== 'mark' && (
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold tracking-tight text-slate-100 ${config.font}`}>
            Anuva<span className="text-quantum-cyan">Q</span>
          </span>

          {showBadge && (
            <span
              className={`font-mono font-semibold rounded-full bg-quantum-cyan/10 text-quantum-cyan border border-quantum-cyan/30 tracking-wider ${config.badge}`}
            >
              v2.2
            </span>
          )}
        </div>
      )}
    </div>
  );
};
