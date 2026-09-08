import React, { useState } from 'react';
import { PAKISTANI_CAR_PRESETS, CarPreset, calculateAutoEMI } from '../utils/carPresets';
import { formatPKR, formatLacs } from '../utils/formatters';
import { 
  X, 
  Layers, 
  Fuel, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CarCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCarToGoal?: (carName: string) => void;
}

export const CarCompareModal: React.FC<CarCompareModalProps> = ({
  isOpen,
  onClose,
  onSelectCarToGoal
}) => {
  // Compare 2 or 3 cars. Default to Alto VXL AGS vs Cultus VXL vs Yaris 1.3 GLi CVT
  const [car1Id, setCar1Id] = useState<string>(PAKISTANI_CAR_PRESETS[3]?.id || 'alto-vxl-ags');
  const [car2Id, setCar2Id] = useState<string>(PAKISTANI_CAR_PRESETS[8]?.id || 'cultus-vxl');
  const [car3Id, setCar3Id] = useState<string>(PAKISTANI_CAR_PRESETS[14]?.id || 'yaris-13-gli-cvt');

  if (!isOpen) return null;

  const car1 = PAKISTANI_CAR_PRESETS.find(c => c.id === car1Id) || PAKISTANI_CAR_PRESETS[0];
  const car2 = PAKISTANI_CAR_PRESETS.find(c => c.id === car2Id) || PAKISTANI_CAR_PRESETS[1];
  const car3 = PAKISTANI_CAR_PRESETS.find(c => c.id === car3Id) || PAKISTANI_CAR_PRESETS[2];

  const compareCars = [car1, car2, car3];

  // Pakistani Market Real-World Metrics Estimator
  const getFuelEconomy = (cc: number, transmission: string) => {
    if (cc <= 660) return { kmPerLiter: 19, tag: 'Ultra High (18–20 km/L)' };
    if (cc <= 1000) return { kmPerLiter: 15.5, tag: 'Efficient (15–16 km/L)' };
    if (cc <= 1300) return { kmPerLiter: 13.5, tag: 'Moderate (13–14 km/L)' };
    return { kmPerLiter: 11.5, tag: 'Standard (11–12 km/L)' };
  };

  // Monthly fuel cost assuming 1,000 km / month at standard petrol ₨ 275 / Liter
  const getMonthlyFuelCost = (kmPerLiter: number) => {
    const litersNeeded = 1000 / kmPerLiter;
    return Math.round(litersNeeded * 275);
  };

  const getResaleIndex = (make: string, shortName: string) => {
    if (shortName.includes('Alto') || shortName.includes('Cultus') || shortName.includes('Yaris') || shortName.includes('City')) {
      return { grade: '⭐⭐⭐⭐⭐ High Liquidity', text: 'Sells within 3–7 days in Pakistan' };
    }
    return { grade: '⭐⭐⭐⭐ Good Resale', text: 'Steady PakWheels market demand' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-cyan-500/40 text-white shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[94vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3 mb-4 shrink-0 pr-8">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-md shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
                Multi-Car Comparison Engine
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase shadow-sm">
                TURBO PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare prices, downpayments, monthly EMIs, and real-world Pakistani fuel costs side-by-side.
            </p>
          </div>
        </div>

        {/* Comparison Table / Grid */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          
          {/* Top Vehicle Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Slot 1 */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 space-y-1.5">
              <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                Vehicle 1 (Baseline)
              </label>
              <select
                value={car1Id}
                onChange={(e) => setCar1Id(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white font-bold outline-none cursor-pointer"
              >
                {PAKISTANI_CAR_PRESETS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({formatLacs(c.totalMarketPrice)})
                  </option>
                ))}
              </select>
            </div>

            {/* Slot 2 */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 space-y-1.5">
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Vehicle 2 (Upgrade Option)
              </label>
              <select
                value={car2Id}
                onChange={(e) => setCar2Id(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white font-bold outline-none cursor-pointer"
              >
                {PAKISTANI_CAR_PRESETS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({formatLacs(c.totalMarketPrice)})
                  </option>
                ))}
              </select>
            </div>

            {/* Slot 3 */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 space-y-1.5">
              <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Vehicle 3 (Executive Option)
              </label>
              <select
                value={car3Id}
                onChange={(e) => setCar3Id(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white font-bold outline-none cursor-pointer"
              >
                {PAKISTANI_CAR_PRESETS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({formatLacs(c.totalMarketPrice)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deep Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {compareCars.map((car, index) => {
              const tenure = car.engineCC <= 1000 ? 5 : 3;
              const emi = calculateAutoEMI(car.financedAmount, tenure);
              const fuel = getFuelEconomy(car.engineCC, car.transmission);
              const monthlyFuelPKR = getMonthlyFuelCost(fuel.kmPerLiter);
              const resale = getResaleIndex(car.make, car.shortName);

              return (
                <div 
                  key={car.id + '-' + index}
                  className="p-4 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        car.transmissionType === 'Manual'
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {car.transmission}
                      </span>
                      <h4 className="text-sm font-black text-white mt-1">
                        {car.name}
                      </h4>
                      <div className="text-[10px] text-slate-400">
                        {car.category} • {car.engineCC}cc
                      </div>
                    </div>

                    {/* Ex-Factory & 30% Downpayment */}
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ex-Factory:</span>
                        <strong className="text-white font-mono">{formatLacs(car.totalMarketPrice)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">30% Down:</span>
                        <strong className="text-cyan-400 font-mono">{formatLacs(car.downpaymentTarget)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">70% Loan:</span>
                        <strong className="text-slate-300 font-mono">{formatLacs(car.financedAmount)}</strong>
                      </div>
                    </div>

                    {/* Monthly Installment (EMI) */}
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                      <div className="text-[10px] text-emerald-300 uppercase font-bold">
                        Monthly Installment ({tenure}y SBP)
                      </div>
                      <div className="text-lg font-black text-emerald-400 font-mono">
                        ~{formatPKR(emi)}
                        <span className="text-[10px] font-normal text-slate-400"> / mo</span>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Min Salary: ~{formatPKR(Math.round(emi / 0.40))} (40% DBR)
                      </div>
                    </div>

                    {/* Fuel & Running Cost in Pakistan */}
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                      <div className="flex items-center space-x-1 text-[10px] text-amber-300 font-bold uppercase">
                        <Fuel className="w-3.5 h-3.5 text-amber-400" />
                        <span>Fuel Economy (~1,000km/mo)</span>
                      </div>
                      <div className="text-xs font-bold text-white">
                        {fuel.tag}
                      </div>
                      <div className="text-[10px] text-amber-200">
                        Estimated Fuel: <strong>~{formatPKR(monthlyFuelPKR)} / mo</strong>
                      </div>
                    </div>

                    {/* Resale Liquidity in Pakistan */}
                    <div className="text-[10px] text-slate-400 pt-1">
                      <div className="font-bold text-slate-300">{resale.grade}</div>
                      <div>{resale.text}</div>
                    </div>
                  </div>

                  {/* Set As Goal Button */}
                  {onSelectCarToGoal && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCarToGoal(car.name);
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer text-center"
                    >
                      Set as My Savings Goal
                    </button>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 shrink-0 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            Fuel estimates based on ₨ 275/L prevailing rates and urban driving conditions.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
          >
            Close Comparison
          </button>
        </div>

      </motion.div>
    </div>
  );
};
