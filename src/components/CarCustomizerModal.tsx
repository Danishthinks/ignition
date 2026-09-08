import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  formatLacs, 
  formatInputCommas, 
  parseInputCommas 
} from '../utils/formatters';
import { X, Car, Wallet, Search } from 'lucide-react';
import { motion } from 'framer-motion';

import { PAKISTANI_CAR_PRESETS, CAR_MAKES, CarMake } from '../utils/carPresets';

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
  const [activeBrand, setActiveBrand] = useState<'All' | CarMake>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPresets = useMemo(() => {
    let list = PAKISTANI_CAR_PRESETS;
    if (activeBrand !== 'All') {
      list = list.filter(c => c.make === activeBrand);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.transmission.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeBrand, searchQuery]);

  if (!isOpen) return null;

  const targetPresets = [
    { label: '9.13 Lacs (Alto 30%)', amount: 913500 },
    { label: '13.05 Lacs (Cultus 30%)', amount: 1305000 },
    { label: '14.16 Lacs (Swift 30%)', amount: 1416000 },
    { label: '14.07 Lacs (Yaris 30%)', amount: 1407000 },
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

  const brandTabs: ('All' | CarMake)[] = ['All', ...CAR_MAKES];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-cyan-500/30 text-white shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[92vh] flex flex-col"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4 shrink-0 pr-8">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
              Car & Savings Calibration
            </h3>
            <p className="text-xs text-slate-400">
              Select an official car model preset or configure custom savings target.
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          
          {/* Popular Pakistani Car Presets with Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Select Car Preset
              </label>
              <span className="text-[10px] text-slate-400">
                24+ Pakistan Variants
              </span>
            </div>

            {/* Brand tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {brandTabs.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setActiveBrand(brand)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                    activeBrand === brand
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-950/40 rounded-2xl border border-white/5">
              {filteredPresets.map((car) => {
                const isSelected = carName === car.name;
                const isManual = car.transmissionType === 'Manual';

                return (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => {
                      setCarName(car.name);
                      setModelYear(car.year);
                      setTargetAmountStr(formatInputCommas(car.downpaymentTarget));
                    }}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-500/10'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold truncate text-white text-[11px]">{car.shortName}</div>
                    <div className="flex items-center gap-1 my-0.5">
                      <span className={`text-[8px] font-bold px-1 rounded ${
                        isManual ? 'bg-slate-700 text-slate-300' : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {car.transmission}
                      </span>
                      <span className="text-[8px] text-slate-400">
                        {car.engineCC}cc
                      </span>
                    </div>
                    <div className="text-[10px] text-cyan-300 font-semibold mt-0.5">
                      30% Goal: {formatLacs(car.downpaymentTarget)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 pt-1">
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
                Downpayment Target (Cash Requirement)
              </label>
              <div className="flex gap-1.5 mb-2 overflow-x-auto pb-0.5 scrollbar-none">
                {targetPresets.map((p) => (
                  <button
                    key={p.amount}
                    type="button"
                    onClick={() => setTargetAmountStr(formatInputCommas(p.amount))}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold whitespace-nowrap transition-all ${
                      parsedTarget === p.amount
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
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
              <p className="text-[11px] text-cyan-300/80 mt-1 font-mono">
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

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                Update Balance & Goal
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
