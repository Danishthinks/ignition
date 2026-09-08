import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { 
  formatLacs, 
  formatInputCommas, 
  parseInputCommas 
} from '../utils/formatters';
import { 
  Wallet, 
  Car, 
  ShieldAlert, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OnboardingModal: React.FC = () => {
  const { hasSeenTutorial, completeTutorial } = useAuth();
  const { carGoal, setCurrentBalance, updateCarGoal, triggerCelebration } = useFinance();

  const [step, setStep] = useState(0);
  const [balanceStr, setBalanceStr] = useState<string>(
    carGoal.currentAmount > 0 ? formatInputCommas(carGoal.currentAmount) : ''
  );
  const [targetCar, setTargetCar] = useState<string>(carGoal.carName);

  if (hasSeenTutorial) return null;

  const totalSteps = 4;

  const handleFinish = () => {
    const cleanBalance = parseInputCommas(balanceStr);
    setCurrentBalance(cleanBalance);
    updateCarGoal({ carName: targetCar });
    completeTutorial();
    triggerCelebration();
  };

  const parsedBalance = parseInputCommas(balanceStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-cyan-500/30 text-white shadow-2xl p-6 sm:p-8 overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Progress Bar */}
        <div className="flex items-center space-x-1.5 mb-6">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                idx <= step ? 'bg-cyan-500 shadow-sm shadow-cyan-500/50' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Step 1 of 4: Calibrate Your Real Cash
                </span>
                <h3 className="text-2xl font-heading font-black text-white mt-0.5">
                  How much money do you have saved right now?
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Don't start with fake numbers. Enter the exact Pakistani Rupees (₨) you currently have in hand or bank for your first car.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Current Savings in Hand (PKR ₨)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-base font-black text-cyan-400">₨</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={balanceStr}
                    onChange={(e) => setBalanceStr(formatInputCommas(e.target.value))}
                    placeholder="e.g. 1,35,000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/50 focus:border-cyan-400 text-lg font-black text-white outline-none"
                  />
                </div>
                <p className="text-xs text-cyan-300/80 font-mono mt-2">
                  Equals: <strong>₨ {balanceStr || '0'}</strong> ({formatLacs(parsedBalance)})
                </p>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Step 2 of 4: The 8.5 – 9.0 Lacs Target
                </span>
                <h3 className="text-2xl font-heading font-black text-white mt-0.5">
                  Your Dream First Car
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  A downpayment of 8.5 to 9.0 Lacs PKR (~₨ 8,75,000) opens the door to popular choices in Pakistan like the Suzuki Alto 660cc, Suzuki Cultus, Swift, or Toyota Yaris.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Confirm Your Dream Car Model
                </label>
                <input
                  type="text"
                  value={targetCar}
                  onChange={(e) => setTargetCar(e.target.value)}
                  placeholder="Suzuki Alto VXR"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-400 text-sm font-bold text-white outline-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                ⚡ <strong>Tachometer Speedometer:</strong> The app's dashboard speedometer sweeps in real-time as you log deposits, with the final 15% entering the redline victory zone!
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Step 3 of 4: The Impulse Stopper Weapon
                </span>
                <h3 className="text-2xl font-heading font-black text-white mt-0.5">
                  Stop Unnecessary Leaks
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Before spending ₨ 4,000 on eating out or clothes, open the <strong>Impulse Stopper</strong> in the top menu.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Calculates exactly how many <strong>extra days</strong> you delay driving your car.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Shows what percentage of your downpayment that purchase wastes.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Allows 1-click <strong>"Divert to Car Vault"</strong> with engine sound and confetti!</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <KeyRound className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Step 4 of 4: The 4 Physical Stages
                </span>
                <h3 className="text-2xl font-heading font-black text-white mt-0.5">
                  Build Your Machine Step by Step
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Your money doesn't just sit in an account; it unlocks the physical components of your car:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-cyan-400 block">25% (₨ 2,18,750)</strong>
                  <span className="text-slate-300">Chassis & Blueprint</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-cyan-400 block">50% (₨ 4,37,500)</strong>
                  <span className="text-slate-300">Engine Block & Turbo</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-cyan-400 block">75% (₨ 6,56,250)</strong>
                  <span className="text-slate-300">Alloy Wheels, Interior & AC</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <strong className="text-amber-300 block">100% (₨ 8,75,000)</strong>
                  <span className="text-emerald-300 font-bold">Ignition Keys Handover!</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/25"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch My Ignition Dashboard!</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
