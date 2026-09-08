import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  formatLacs, 
  formatInputCommas, 
  parseInputCommas 
} from '../utils/formatters';
import { X, Car, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface CarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CarCustomizerModal: React.FC<CarCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { carGoal, updateCarGoal, setCurrentBalance } = useFinance();

  const [carName, setCarName] = useState(carGoal.carName);
  const [modelYear, setModelYear] = useState(carGoal.modelYear);
  // Formatted string states to avoid leading zeros and allow real-time comma formatting
  const [currentAmountStr, setCurrentAmountStr] = useState<string>(
    carGoal.currentAmount > 0 ? formatInputCommas(carGoal.currentAmount) : ''
  );
  const [targetAmountStr, setTargetAmountStr] = useState<string>(
    formatInputCommas(carGoal.targetAmount)
  );
  const [targetDate, setTargetDate] = useState(carGoal.targetDate);

  if (!isOpen) return null;

  const popularCars = [
    { name: 'Suzuki Alto VXR', year: '2024', defaultTarget: 850000 },
    { name: 'Suzuki Cultus VXL', year: '2023', defaultTarget: 875000 },
    { name: 'Suzuki Swift GL', year: '2022', defaultTarget: 900000 },
    { name: 'Toyota Yaris ATIV', year: '2021', defaultTarget: 900000 },
    { name: 'Honda City 1.2L', year: '2021', defaultTarget: 900000 },
  ];

  const targetPresets = [
    { label: '8.50 Lacs', amount: 850000 },
    { label: '8.75 Lacs (Mid)', amount: 875000 },
    { label: '9.00 Lacs', amount: 900000 },
    { label: '10.0 Lacs', amount: 1000000 },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCurrent = parseInputCommas(currentAmountStr);
    const cleanTarget = parseInputCommas(targetAmountStr) || 875000;

    setCurrentBalance(cleanCurrent);
    updateCarGoal({
      carName,
      modelYear,
      targetAmount: cleanTarget,
      targetDate
    });
    onClose();
  };

  const parsedCurrent = parseInputCommas(currentAmountStr);
  const parsedTarget = parseInputCommas(targetAmountStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/30 text-white shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-white uppercase">
              Car & Savings Calibration
            </h3>
            <p className="text-xs text-slate-400">
              Set your exact current savings balance and target downpayment.
            </p>
          </div>
        </div>

        {/* Popular Pakistani Car Presets */}
        <div className="mb-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Popular 1st Car Presets in Pakistan
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {popularCars.map((car) => (
              <button
                key={car.name}
                type="button"
                onClick={() => {
                  setCarName(car.name);
                  setModelYear(car.year);
                  setTargetAmountStr(formatInputCommas(car.defaultTarget));
                }}
                className={`text-left p-2 rounded-xl border text-xs transition-all ${
                  carName === car.name
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold truncate">{car.name}</div>
                <div className="text-[10px] text-slate-400">{car.year} • {formatLacs(car.defaultTarget)}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* EXACT CURRENT SAVINGS FIELD WITH AUTO COMMAS */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/40 border border-cyan-500/40">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs uppercase mb-1">
              <Wallet className="w-4 h-4 text-cyan-400" />
              <span>Exact Money You Have Saved Right Now (PKR ₨)</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2">
              Enter your real bank or cash savings currently earmarked for your car.
            </p>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-sm font-black text-cyan-400">₨</span>
              <input
                type="text"
                inputMode="numeric"
                value={currentAmountStr}
                onChange={(e) => setCurrentAmountStr(formatInputCommas(e.target.value))}
                placeholder="e.g. 1,35,000"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/60 focus:border-cyan-400 text-base font-black text-white outline-none"
              />
            </div>
            <p className="text-[11px] text-cyan-400/90 font-mono mt-1.5">
              Current Saved: <strong>₨ {currentAmountStr || '0'}</strong> ({formatLacs(parsedCurrent)})
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Car Name / Model
              </label>
              <input
                type="text"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Model Year
              </label>
              <input
                type="text"
                value={modelYear}
                onChange={(e) => setModelYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Downpayment Target (8.5 - 9.0 Lacs PKR Range)
            </label>
            <div className="flex gap-2 mb-2">
              {targetPresets.map((p) => (
                <button
                  key={p.amount}
                  type="button"
                  onClick={() => setTargetAmountStr(formatInputCommas(p.amount))}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    parsedTarget === p.amount
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-2.5 text-sm font-bold text-cyan-400">₨</span>
              <input
                type="text"
                inputMode="numeric"
                value={targetAmountStr}
                onChange={(e) => setTargetAmountStr(formatInputCommas(e.target.value))}
                placeholder="e.g. 8,75,000"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm font-bold text-white outline-none"
              />
            </div>
            <p className="text-[11px] text-cyan-300/80 mt-1">
              Equates to: <strong>₨ {targetAmountStr} PKR</strong> ({formatLacs(parsedTarget)})
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Estimated Delivery / Showroom Visit Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
            />
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all"
            >
              Update Balance & Goal
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
