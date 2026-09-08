import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  calculateImpulseImpact, 
  formatInputCommas, 
  parseInputCommas, 
  formatPKR 
} from '../utils/formatters';
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ImpulseCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImpulseCalculatorModal: React.FC<ImpulseCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    monthlySavingsSpeed, 
    carGoal, 
    depositToCarFund 
  } = useFinance();

  const [impulseAmountStr, setImpulseAmountStr] = useState<string>('4,500');
  const [impulseItemName, setImpulseItemName] = useState<string>('Fancy Dining / Café');
  const [divertedSuccess, setDivertedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const numericImpulse = parseInputCommas(impulseAmountStr);

  const analysis = calculateImpulseImpact(
    numericImpulse,
    monthlySavingsSpeed,
    carGoal.targetAmount
  );

  const handleDivertToCar = () => {
    depositToCarFund(
      numericImpulse, 
      `Diverted impulse expense: ${impulseItemName || 'Impulse Spend'} -> Directly into Car Vault! 🚗💨`
    );
    setDivertedSuccess(true);
    setTimeout(() => {
      setDivertedSuccess(false);
      onClose();
    }, 1800);
  };

  const presetImpulses = [
    { name: 'Overpriced Café / Fast Food', amount: 3500 },
    { name: 'Branded Clothing / Shoes', amount: 8000 },
    { name: 'Weekend Party / Outing', amount: 12000 },
    { name: 'Gadget / Accessory Upgrade', amount: 20000 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/30 text-white shadow-2xl p-6 sm:p-8 overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-white uppercase">
              Impulse Buy Stopper
            </h3>
            <p className="text-xs text-slate-400">
              Calculate the true cost of unnecessary spending on your car dream.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="mb-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Quick Scenarios
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presetImpulses.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setImpulseItemName(p.name);
                  setImpulseAmountStr(formatInputCommas(p.amount));
                }}
                className={`text-left p-2 rounded-xl border text-xs transition-all ${
                  numericImpulse === p.amount
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="truncate">{p.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">₨ {p.amount.toLocaleString('en-IN')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              What are you tempted to buy?
            </label>
            <input
              type="text"
              value={impulseItemName}
              onChange={(e) => setImpulseItemName(e.target.value)}
              placeholder="e.g. Expensive dinner, gadget, branded shoes..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Cost in PKR (₨)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-sm font-bold text-amber-400">₨</span>
              <input
                type="text"
                inputMode="numeric"
                value={impulseAmountStr}
                onChange={(e) => setImpulseAmountStr(formatInputCommas(e.target.value))}
                placeholder="e.g. 4,500"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400 text-sm font-bold text-white outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Real-time Provocative Impact Box */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-6">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Dream Car Impact Analysis</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-black/40">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Delay In Keys</span>
              <span className="text-xl font-black text-amber-400 font-heading">
                +{analysis.daysDelayed} Days
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">% of Total Car Goal</span>
              <span className="text-xl font-black text-white font-heading">
                {analysis.percentageOfGoal.toFixed(2)}%
              </span>
            </div>
          </div>

          <p className="text-xs text-amber-200/90 font-medium italic leading-relaxed">
            "{analysis.provocation}"
          </p>
        </div>

        {/* Success or Action Buttons */}
        {divertedSuccess ? (
          <div className="flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>₨ {impulseAmountStr} Saved Into Car Vault! Victory!</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleDivertToCar}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Divert & Save into Car Vault!</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              I will resist it myself
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
