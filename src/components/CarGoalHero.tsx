import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SpeedometerGauge } from './SpeedometerGauge';
import { formatPKR, formatLacs } from '../utils/formatters';
import { 
  KeyRound, 
  TrendingUp, 
  Calendar, 
  Car, 
  Plus, 
  ChevronRight,
  Flame,
  Edit3,
  Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CarGoalHeroProps {
  onOpenCustomDeposit: () => void;
  onOpenCarCustomizer: () => void;
}

export const CarGoalHero: React.FC<CarGoalHeroProps> = ({
  onOpenCustomDeposit,
  onOpenCarCustomizer,
}) => {
  const { 
    carGoal, 
    depositToCarFund, 
    monthlySavingsSpeed, 
    triggerCelebration 
  } = useFinance();

  const [activePreset, setActivePreset] = useState<number | null>(null);

  const percentage = carGoal.targetAmount > 0 ? (carGoal.currentAmount / carGoal.targetAmount) * 100 : 0;
  const remaining = Math.max(0, carGoal.targetAmount - carGoal.currentAmount);

  // Calculate estimated months to finish
  const monthsRemaining = monthlySavingsSpeed > 0 ? Math.ceil(remaining / monthlySavingsSpeed) : 12;
  const targetDateEstimated = new Date();
  targetDateEstimated.setMonth(targetDateEstimated.getMonth() + monthsRemaining);
  const estimatedDateStr = targetDateEstimated.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric'
  });

  const quickPresets = [5000, 15000, 25000, 50000];

  const handleQuickDeposit = (amount: number) => {
    setActivePreset(amount);
    depositToCarFund(amount, `Quick Car Vault Fuel (+₨ ${amount.toLocaleString()})`);
    setTimeout(() => setActivePreset(null), 800);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-[#0E1524] to-[#090D17] text-white border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 p-6 sm:p-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar inside Hero */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-heading font-black tracking-wide text-white">
                {carGoal.carName}
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {carGoal.modelYear}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Downpayment: <span className="text-cyan-300 font-semibold">{formatPKR(carGoal.targetAmount)} ({formatLacs(carGoal.targetAmount)})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Direct Set Current Balance Button */}
          <button
            onClick={onOpenCarCustomizer}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-colors"
            title="Update how much money you currently have saved right now"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Set Current Balance</span>
          </button>

          <button
            onClick={onOpenCarCustomizer}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <span>Adjust Target & Car</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Grid: Speedometer Gauge + Key Metrics */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-6">
        {/* Speedometer Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <SpeedometerGauge 
            percentage={percentage} 
            currentAmount={carGoal.currentAmount}
            targetAmount={carGoal.targetAmount}
          />
          <div className="mt-1 flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{percentage >= 100 ? '🎉 100% SECURED - KEYS UNLOCKED' : `${formatLacs(remaining)} left to ignition`}</span>
          </div>
        </div>

        {/* Financial Metrics Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Vault Saved - with Direct Edit trigger */}
            <div className="relative group p-4 rounded-2xl bg-white/[0.04] border border-cyan-500/30 backdrop-blur-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                  Vault Balance
                </span>
                <button
                  onClick={onOpenCarCustomizer}
                  className="p-1 rounded-md text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all text-[10px] font-bold flex items-center space-x-0.5"
                  title="Edit your exact current saved balance"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="text-xl sm:text-2xl font-black font-heading text-cyan-400">
                {formatPKR(carGoal.currentAmount)}
              </div>
              <span className="text-[11px] text-cyan-300/80 font-medium">
                {formatLacs(carGoal.currentAmount)} saved in hand
              </span>
            </div>

            {/* Target Downpayment */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Total Target
              </span>
              <div className="text-xl sm:text-2xl font-black font-heading text-white">
                {formatPKR(carGoal.targetAmount)}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {formatLacs(carGoal.targetAmount)} (30% Downpayment)
              </span>
            </div>

            {/* Remaining To Key */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Remaining Gap
              </span>
              <div className="text-xl sm:text-2xl font-black font-heading text-amber-400">
                {formatPKR(remaining)}
              </div>
              <span className="text-[11px] text-amber-300/80 font-medium">
                {formatLacs(remaining)} to collect
              </span>
            </div>
          </div>

          {/* Velocity & Estimated Arrival Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900/40 border border-cyan-500/20 gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>Current Velocity: {formatPKR(monthlySavingsSpeed)} / mo</span>
                </p>
                <p className="text-[11px] text-cyan-300/70 mt-0.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 inline" />
                  <span>
                    Estimated Ignition: <strong className="text-white">{estimatedDateStr}</strong> (~{monthsRemaining} months)
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={triggerCelebration}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-cyan-300 border border-cyan-400/20 transition-all flex items-center space-x-1"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span>Test Ignition</span>
            </button>
          </div>

          {/* Quick "Fuel the Vault" Action Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-current" />
                <span>Instant Vault Fuel (Quick Deposit)</span>
              </span>
              <span className="text-[11px] text-slate-400">Pumps straight into Car Goal</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {quickPresets.map((amount) => (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickDeposit(amount)}
                  className={`relative overflow-hidden py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    activePreset === amount
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/40'
                      : 'bg-white/5 hover:bg-cyan-500/20 border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-white'
                  }`}
                >
                  <span>+₨ {amount.toLocaleString()}</span>
                </motion.button>
              ))}

              {/* Custom Deposit Button */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenCustomDeposit}
                className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
