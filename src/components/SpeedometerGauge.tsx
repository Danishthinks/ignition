import React from 'react';
import { motion } from 'framer-motion';

interface SpeedometerGaugeProps {
  percentage: number;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  percentage
}) => {
  // Clamp percentage between 0 and 100
  const clampedPct = Math.min(Math.max(percentage, 0), 100);

  // SVG Gauge geometry
  const radius = 110;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Arc length for 240 degrees: (240 / 360) * circumference
  const arcLength = (240 / 360) * circumference;
  const strokeDashoffset = arcLength - (clampedPct / 100) * arcLength;

  // Needle rotation calculation: 0% -> -120deg, 100% -> +120deg
  const needleRotation = -120 + (clampedPct / 100) * 240;

  // Ticks generator
  const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      <div className="relative w-[280px] h-[210px] sm:w-[320px] sm:h-[230px] flex items-center justify-center">
        <svg
          viewBox="0 0 300 240"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Gradient for progress arc */}
            <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="85%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc (240 degrees) */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(150 150 150)"
            className="text-slate-200 dark:text-slate-800/80"
          />

          {/* Redline Alert Zone Track (last 15% - target 8.5 to 9 Lacs PKR range) */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="rgba(239, 68, 68, 0.25)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength * 0.15} ${circumference}`}
            strokeDashoffset={-arcLength * 0.85}
            strokeLinecap="round"
            transform="rotate(150 150 150)"
          />

          {/* Active Animated Progress Arc */}
          <motion.circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
            strokeLinecap="round"
            transform="rotate(150 150 150)"
            filter="url(#gaugeGlow)"
          />

          {/* Tick marks around the dial */}
          {ticks.map((tick) => {
            const angle = -120 + (tick / 100) * 240;
            const isRedline = tick >= 85;
            return (
              <g
                key={tick}
                transform={`rotate(${angle} 150 150)`}
                className="transition-opacity"
              >
                <line
                  x1="150"
                  y1="28"
                  x2="150"
                  y2={tick % 50 === 0 ? "38" : "33"}
                  stroke={isRedline ? "#EF4444" : "currentColor"}
                  strokeWidth={tick % 50 === 0 ? "2.5" : "1.5"}
                  className={isRedline ? "text-red-500" : "text-slate-400 dark:text-slate-600"}
                />
              </g>
            );
          })}

          {/* Center Hub & Animated Needle */}
          <g transform="translate(150, 150)">
            {/* Animated Needle */}
            <motion.g
              initial={{ rotate: -120 }}
              animate={{ rotate: needleRotation }}
              transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {/* Needle pointer */}
              <polygon
                points="-3.5,8 0,-92 3.5,8"
                fill="#06B6D4"
                className="filter drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
              />
              <circle cx="0" cy="-65" r="2.5" fill="#FFFFFF" />
            </motion.g>

            {/* Central Dial Pivot Cap */}
            <circle cx="0" cy="0" r="16" className="fill-slate-900 dark:fill-[#080C14] stroke-slate-300 dark:stroke-cyan-500/40" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="7" className="fill-cyan-400" />
          </g>

          {/* 0% and 100% labels */}
          <text x="50" y="195" className="text-[10px] font-bold fill-slate-400 dark:fill-slate-500" textAnchor="middle">0%</text>
          <text x="250" y="195" className="text-[10px] font-bold fill-red-400" textAnchor="middle">100%</text>
          <text x="248" y="207" className="text-[8px] font-semibold fill-red-500/80" textAnchor="middle">KEYS</text>
        </svg>

        {/* Center Live Percentage Readout */}
        <div className="absolute bottom-4 flex flex-col items-center pointer-events-none">
          <motion.div 
            key={clampedPct}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-baseline space-x-0.5"
          >
            <span className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-slate-900 dark:text-white">
              {clampedPct.toFixed(1)}
            </span>
            <span className="text-base font-bold text-cyan-500">%</span>
          </motion.div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-slate-500 dark:text-cyan-400/80 mt-0.5">
            Ignition Ready
          </span>
        </div>
      </div>
    </div>
  );
};
