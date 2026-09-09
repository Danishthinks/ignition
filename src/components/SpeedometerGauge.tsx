import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { formatLacs, formatPKR } from '../utils/formatters';
import { Gauge, Zap, Flame } from 'lucide-react';

interface SpeedometerGaugeProps {
  percentage: number;
  currentAmount?: number;
  targetAmount?: number;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  percentage,
  currentAmount,
  targetAmount,
}) => {
  const { carGoal } = useFinance();
  const [gaugeMode, setGaugeMode] = useState<'tachometer' | 'reactor'>('tachometer');

  // Clamp percentage between 0 and 100
  const clampedPct = Math.min(Math.max(percentage, 0), 100);

  const currentAmt = currentAmount !== undefined ? currentAmount : carGoal.currentAmount;
  const targetAmt = targetAmount !== undefined ? targetAmount : carGoal.targetAmount;

  // Exact Tachometer Geometry (Center: 160, 140)
  const cx = 160;
  const cy = 140;
  const radius = 105;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // ~659.73
  const arcLength = (240 / 360) * circumference; // ~439.82
  const strokeDashoffset = arcLength - (clampedPct / 100) * arcLength;

  // Needle angle: 0% -> -120deg, 50% -> 0deg (12 o'clock), 100% -> +120deg
  const needleAngle = -120 + (clampedPct / 100) * 240;

  // Ticks: 0 to 100 at 10% intervals
  const majorTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const minorTicks = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95];

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-1 w-full">
      {/* Mini Mode Toggle Pill */}
      <div className="flex items-center space-x-1 mb-2 bg-slate-900/60 p-1 rounded-full border border-white/10 shadow-xs z-20">
        <button
          type="button"
          onClick={() => setGaugeMode('tachometer')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            gaugeMode === 'tachometer'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gauge className="w-3 h-3" />
          <span>Tachometer</span>
        </button>

        <button
          type="button"
          onClick={() => setGaugeMode('reactor')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            gaugeMode === 'reactor'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>Vault Reactor</span>
        </button>
      </div>

      {/* Main Gauge Container */}
      <div className="relative w-[300px] h-[255px] sm:w-[330px] sm:h-[265px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {gaugeMode === 'tachometer' ? (
            /* ========================================================
               MODE 1: PRECISION AUTOMOTIVE ANALOG TACHOMETER
               ======================================================== */
            <motion.div
              key="tachometer"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <svg
                viewBox="0 0 320 270"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Glowing gradient for progress track */}
                  <linearGradient id="tachoProgressGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="40%" stopColor="#3B82F6" />
                    <stop offset="75%" stopColor="#10B981" />
                    <stop offset="90%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>

                  {/* Needle metallic gradient */}
                  <linearGradient id="needleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="60%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>

                  {/* Needle Glow */}
                  <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Arc Glow */}
                  <filter id="trackGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Inner Dial Shadow Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius - 12}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="1"
                />

                {/* Background Track Arc (240 deg) */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${arcLength} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform={`rotate(150 ${cx} ${cy})`}
                />

                {/* Redline Alert Zone (last 15% - 85% to 100%) */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="rgba(239, 68, 68, 0.35)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${arcLength * 0.15} ${circumference}`}
                  strokeDashoffset={-arcLength * 0.85}
                  strokeLinecap="round"
                  transform={`rotate(150 ${cx} ${cy})`}
                />

                {/* Active Animated Progress Arc */}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="url(#tachoProgressGradient)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${arcLength} ${circumference}`}
                  initial={{ strokeDashoffset: arcLength }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                  strokeLinecap="round"
                  transform={`rotate(150 ${cx} ${cy})`}
                  filter="url(#trackGlow)"
                />

                {/* Minor Tick Marks */}
                {minorTicks.map((tick) => {
                  const angle = -120 + (tick / 100) * 240;
                  const isRedline = tick >= 85;
                  return (
                    <g key={`minor-${tick}`} transform={`rotate(${angle} ${cx} ${cy})`}>
                      <line
                        x1={cx}
                        y1="28"
                        x2={cx}
                        y2="34"
                        stroke={isRedline ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.2)"}
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}

                {/* Major Tick Marks & Numbers */}
                {majorTicks.map((tick) => {
                  const angle = -120 + (tick / 100) * 240;
                  const isRedline = tick >= 85;
                  return (
                    <g key={`major-${tick}`} transform={`rotate(${angle} ${cx} ${cy})`}>
                      <line
                        x1={cx}
                        y1="24"
                        x2={cx}
                        y2="36"
                        stroke={isRedline ? "#EF4444" : "rgba(255, 255, 255, 0.55)"}
                        strokeWidth={tick % 50 === 0 ? "2.5" : "1.8"}
                      />
                    </g>
                  );
                })}

                {/* 0%, 50%, 100% Dial Labels */}
                <text x="56" y="198" className="text-[10px] font-bold fill-slate-400" textAnchor="middle">0%</text>
                <text x="160" y="20" className="text-[10px] font-bold fill-cyan-400" textAnchor="middle">50%</text>
                <text x="264" y="198" className="text-[10px] font-bold fill-red-400" textAnchor="middle">100%</text>

                {/* ========================================================
                    PRECISION ANCHORED NEEDLE ASSEMBLY
                    Rotates strictly around (cx=160, cy=140) with 0 drift
                    ======================================================== */}
                <motion.g
                  initial={{ rotate: -120 }}
                  animate={{ rotate: needleAngle }}
                  transition={{ type: "spring", stiffness: 60, damping: 14 }}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                  }}
                >
                  {/* Needle blade passing directly through center (cx, cy) */}
                  <polygon
                    points={`${cx - 3},${cy + 16} ${cx},${cy + 22} ${cx + 3},${cy + 16} ${cx + 2},${cy} ${cx + 1},${cy - 92} ${cx},${cy - 98} ${cx - 1},${cy - 92} ${cx - 2},${cy}`}
                    fill="url(#needleGradient)"
                    filter="url(#needleGlow)"
                  />
                  {/* Needle tip illuminating pip */}
                  <circle cx={cx} cy={cy - 85} r="2" fill="#FFFFFF" />
                </motion.g>

                {/* Central Metallic Dial Pivot Hub (Layered over the needle base) */}
                <g>
                  {/* Outer Bezel */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="18"
                    fill="#080D18"
                    stroke="rgba(6, 182, 212, 0.5)"
                    strokeWidth="2.5"
                  />
                  {/* Metallic Chamfer */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill="#0F172A"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                  />
                  {/* Glowing Core Jewel */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill="#06B6D4"
                    className="animate-pulse"
                  />
                </g>
              </svg>

              {/* Mathematically Centered OLED Digital Readout Window */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-none text-center"
                style={{
                  top: '162px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '180px',
                }}
              >
                <motion.div 
                  key={clampedPct}
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-baseline justify-center space-x-0.5"
                >
                  <span className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                    {clampedPct.toFixed(1)}
                  </span>
                  <span className="text-lg font-black text-cyan-400">%</span>
                </motion.div>

                <span className="text-[10px] uppercase tracking-widest font-black text-cyan-400/90 mt-0.5 block">
                  {clampedPct >= 100 ? '🎉 Keys Unlocked' : 'Downpayment Vault'}
                </span>

                <span className="text-[10px] font-mono font-semibold text-slate-300 block mt-0.5">
                  {formatLacs(currentAmt)} / {formatLacs(targetAmt)}
                </span>
              </div>
            </motion.div>
          ) : (
            /* ========================================================
               MODE 2: CYBER VAULT ENERGY REACTOR (ALTERNATE ANIMATION)
               ======================================================== */
            <motion.div
              key="reactor"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full flex flex-col items-center justify-center"
            >
              {/* Spinning Ambient Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute w-56 h-56 rounded-full border border-dashed border-cyan-500/20"
              />

              {/* Counter-Spinning Tech Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute w-48 h-48 rounded-full border border-dotted border-amber-500/30"
              />

              {/* Central Glowing Energy Chamber */}
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-[#061020] via-slate-900 to-[#0A1628] border-2 border-cyan-400/40 shadow-2xl shadow-cyan-500/30 flex flex-col items-center justify-center p-3 text-center">
                {/* Neon Aura */}
                <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-md pointer-events-none" />

                {/* Energy Pulse Icon */}
                <div className="flex items-center space-x-1 text-amber-400 mb-1">
                  <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-300">
                    Vault Power
                  </span>
                </div>

                {/* Main Large Percentage */}
                <div className="flex items-baseline justify-center space-x-0.5">
                  <span className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                    {clampedPct.toFixed(1)}
                  </span>
                  <span className="text-base font-bold text-cyan-400">%</span>
                </div>

                {/* Live Vault Progress */}
                <span className="text-[10px] font-mono font-bold text-emerald-400 mt-1 block">
                  {formatPKR(currentAmt)}
                </span>

                {/* Target Ratio */}
                <span className="text-[9px] text-slate-400 font-medium block">
                  of {formatLacs(targetAmt)} goal
                </span>
              </div>

              {/* Progress Level Bar Below Reactor */}
              <div className="w-56 mt-3 space-y-1">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedPct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 shadow-sm"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>₨ 0</span>
                  <span className="text-cyan-400 font-bold">{clampedPct >= 100 ? 'KEYS SECURED' : `${clampedPct.toFixed(0)}% READY`}</span>
                  <span>{formatLacs(targetAmt)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
