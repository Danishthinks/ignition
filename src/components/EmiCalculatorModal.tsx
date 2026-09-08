import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPKR, formatLacs, formatInputCommas, parseInputCommas } from '../utils/formatters';
import { PAKISTANI_CAR_PRESETS, calculateAutoEMI } from '../utils/carPresets';
import { 
  X, 
  Calculator, 
  Car, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Building2, 
  ArrowRight, 
  Percent, 
  Sparkles,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFinancingInquiry?: () => void;
}

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  onOpenFinancingInquiry
}) => {
  const { carGoal } = useFinance();

  // Find default preset matching current carGoal or Alto
  const defaultPreset = PAKISTANI_CAR_PRESETS.find(c => 
    carGoal.carName.toLowerCase().includes(c.shortName.toLowerCase()) || 
    c.name.toLowerCase().includes(carGoal.carName.toLowerCase())
  ) || PAKISTANI_CAR_PRESETS[0];

  const [selectedCarId, setSelectedCarId] = useState<string>(defaultPreset.id);
  const [customPriceStr, setCustomPriceStr] = useState<string>('');
  const [downpaymentRatio, setDownpaymentRatio] = useState<number>(0.30); // 30% default
  const [tenureYears, setTenureYears] = useState<number>(3); // 3 Years default

  if (!isOpen) return null;

  const currentPreset = PAKISTANI_CAR_PRESETS.find(c => c.id === selectedCarId);
  const totalCarPrice = selectedCarId === 'custom'
    ? parseInputCommas(customPriceStr) || 4000000
    : currentPreset?.totalMarketPrice || 4000000;

  const downpaymentAmount = Math.round(totalCarPrice * downpaymentRatio);
  const financedLoanAmount = Math.max(0, totalCarPrice - downpaymentAmount);
  const estimatedMonthlyEMI = calculateAutoEMI(financedLoanAmount, tenureYears);
  const totalRepaymentOverTenure = estimatedMonthlyEMI * (tenureYears * 12);
  const estimatedTotalMarkup = Math.max(0, totalRepaymentOverTenure - financedLoanAmount);

  const tenureOptions = [
    { years: 1, months: 12, label: '1 Year' },
    { years: 2, months: 24, label: '2 Years' },
    { years: 3, months: 36, label: '3 Years', tag: 'Most Popular' },
    { years: 4, months: 48, label: '4 Years' },
    { years: 5, months: 60, label: '5 Years', tag: 'Max for ≤1000cc' }
  ];

  const downpaymentRatios = [
    { label: '20%', value: 0.20 },
    { label: '30% (SBP Min)', value: 0.30, tag: 'Standard' },
    { label: '40%', value: 0.40 },
    { label: '50%', value: 0.50 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-emerald-500/30 text-white shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-heading font-black text-white uppercase">
                Auto Lease & EMI Calculator
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Pakistan Market
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Calculate estimated monthly bank lease installments across tenures and downpayments.
            </p>
          </div>
        </div>

        {/* Car Selection */}
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Vehicle to Estimate
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PAKISTANI_CAR_PRESETS.map((car) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => {
                    setSelectedCarId(car.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedCarId === car.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-md shadow-emerald-500/10'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold truncate text-white text-xs">{car.shortName}</div>
                  <div className="text-[10px] text-emerald-300/90 font-semibold mt-0.5">
                    {formatLacs(car.totalMarketPrice)} Total
                  </div>
                  <div className="text-[9px] text-slate-400">
                    30% Down: {formatLacs(car.downpaymentTarget)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Downpayment Ratio Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Downpayment Ratio (% in Cash)
              </label>
              <span className="text-xs text-emerald-400 font-bold font-mono">
                {formatPKR(downpaymentAmount)} ({formatLacs(downpaymentAmount)})
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {downpaymentRatios.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDownpaymentRatio(d.value)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                    downpaymentRatio === d.value
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tenure Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lease Duration (Tenure)</span>
              </label>
              <span className="text-[10px] text-slate-400">
                {tenureYears * 12} Total Monthly Payments
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {tenureOptions.map((t) => (
                <button
                  key={t.years}
                  type="button"
                  onClick={() => setTenureYears(t.years)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    tenureYears === t.years
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-black shadow-md shadow-emerald-500/10'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold">{t.label}</div>
                  <div className="text-[9px] text-slate-400 font-mono">{t.months} Mo</div>
                  {t.tag && (
                    <div className="text-[8px] text-emerald-400 font-bold truncate mt-0.5">
                      {t.tag}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-950 to-slate-900 border border-emerald-500/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Estimated Monthly Installment (EMI)
                </span>
                <div className="text-3xl sm:text-4xl font-black font-heading text-emerald-400">
                  ~{formatPKR(estimatedMonthlyEMI)}
                  <span className="text-sm font-semibold text-emerald-300/80"> / month</span>
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                  Financed Bank Loan
                </span>
                <span className="text-lg font-black text-white font-mono">
                  {formatPKR(financedLoanAmount)}
                </span>
                <div className="text-[10px] text-slate-400">
                  {(100 - downpaymentRatio * 100).toFixed(0)}% of Vehicle Price
                </div>
              </div>
            </div>

            {/* Financial Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] text-slate-300 mb-2">
              <div>
                <span className="text-slate-400 block">Total Car Price</span>
                <strong className="text-white font-mono">{formatPKR(totalCarPrice)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Downpayment (Cash)</span>
                <strong className="text-cyan-300 font-mono">{formatPKR(downpaymentAmount)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Lease Tenure</span>
                <strong className="text-emerald-300">{tenureYears} Years ({tenureYears * 12} Mo)</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Est. Total Markup</span>
                <strong className="text-amber-300 font-mono">~{formatPKR(estimatedTotalMarkup)}</strong>
              </div>
            </div>

            {/* IMPORTANT DISCLAIMER BANNER */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed flex items-start space-x-2.5 mt-3">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <strong className="font-bold text-amber-200 block mb-0.5">
                  Important Bank & Pricing Notice:
                </strong>
                These monthly installments are <strong>preliminary estimates</strong> based on standard prevailing market benchmark rates (~18–20% p.a. markup + comprehensive insurance). <strong>Actual installments will be officially calculated by the financing bank</strong> upon formal application submission. Final quotes will vary from bank to bank based on KIBOR adjustments, individual bank processing fees, credit score verification, and chosen Takaful/insurance partners.
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {onOpenFinancingInquiry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFinancingInquiry();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Check Bank Eligibility & Apply via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
            >
              Close Calculator
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
