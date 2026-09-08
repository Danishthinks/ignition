import React from 'react';
import { 
  X, 
  BookOpen, 
  Flame, 
  Car, 
  ShieldCheck, 
  Wallet, 
  Zap,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TutorialGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRelaunchWizard: () => void;
}

export const TutorialGuideModal: React.FC<TutorialGuideModalProps> = ({
  isOpen,
  onClose,
  onRelaunchWizard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[88vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-white uppercase tracking-wide">
              Driver Playbook & How To Use IGNITION
            </h3>
            <p className="text-xs text-slate-400">
              Master the system to conquer your 8.5 – 9.0 Lacs PKR downpayment.
            </p>
          </div>
        </div>

        {/* Quick Launch Interactive Wizard Button */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/40 border border-cyan-500/30 flex items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive Step-by-Step Tour</span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Want the guided walkthrough again? Calibrate your balance and preview all features.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onRelaunchWizard();
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shrink-0"
          >
            Launch Wizard
          </button>
        </div>

        {/* Section 1: Setting Your Real Cash Balance */}
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-cyan-400 flex items-center space-x-2">
              <Wallet className="w-4 h-4" />
              <span>1. How to Set Your Real Starting Cash</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never let the app guess your finances! On the car hero card, click the <strong>"Set Current Balance"</strong> button or the <strong>"Edit"</strong> pencil next to Vault Balance. Type in whatever cash or bank savings you currently hold (e.g. ₨ 50,000, ₨ 200,000, or ₨ 0). The speedometer, remaining gap, and stages will calibrate instantly.
            </p>
          </div>

          {/* Section 2: Fueling the Car Vault */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
              <Flame className="w-4 h-4" />
              <span>2. How to Fuel the Car Vault</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Whenever you receive your salary, freelance earnings, or a family gift:
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc">
              <li>Use the <strong>Quick Pills (+₨ 5,000, +₨ 15,000, +₨ 50,000)</strong> right on the dashboard for instant satisfying deposit.</li>
              <li>Or click <strong>"Log Cash / Vault"</strong> in the navigation bar to record regular income and expenses to track your complete monthly cash flow.</li>
              <li>Every car deposit triggers the synthesized sports car engine rev sound and confetti burst!</li>
            </ul>
          </div>

          {/* Section 3: The Impulse Stopper Weapon */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>3. The Impulse Stopper Weapon</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Before you spend money on non-essentials (e.g. ₨ 3,500 on café dining or ₨ 10,000 on shopping), open <strong>"Impulse Stopper"</strong> from the top bar. Enter the amount to calculate how many days you delay sitting in your own air-conditioned car. Click <strong>"Divert to Car Vault"</strong> to resist temptation and claim victory!
            </p>
          </div>

          {/* Section 4: The 4 Physical Stages */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-indigo-400 flex items-center space-x-2">
              <Car className="w-4 h-4" />
              <span>4. Understanding Your 4 Milestones</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your 8.5 – 9.0 Lacs journey is divided into 4 tangible stages:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-center">
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="font-bold text-cyan-400 block">Stage 1 (25%)</span>
                <span>Chassis & Frame</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="font-bold text-cyan-400 block">Stage 2 (50%)</span>
                <span>Engine & Turbo</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="font-bold text-cyan-400 block">Stage 3 (75%)</span>
                <span>Interior & Wheels</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <span className="font-bold text-emerald-400 block">Stage 4 (100%)</span>
                <span>Car Keys Handover!</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
          >
            Close Guide
          </button>
        </div>
      </motion.div>
    </div>
  );
};
