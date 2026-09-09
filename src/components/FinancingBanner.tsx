import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatLacs } from '../utils/formatters';
import { Building2, ArrowRight, ShieldCheck, Percent, Sparkles, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

interface FinancingBannerProps {
  onOpenInquiry: () => void;
  onOpenEmiCalculator?: () => void;
}

export const FinancingBanner: React.FC<FinancingBannerProps> = ({ onOpenInquiry, onOpenEmiCalculator }) => {
  const { carGoal } = useFinance();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0A101D] p-5 sm:p-6 shadow-xl backdrop-blur-md transition-all"
    >
      {/* Background Accent Glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AUTO FINANCING NETWORK
              </span>
              <span className="text-xs text-emerald-300/90 font-medium hidden sm:inline">
                • Fast-Track Partners: Meezan Bank & Bank Alfalah
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-heading font-black text-white">
              Need Bank Financing or Islamic Lease?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Securing your downpayment (<strong className="text-emerald-300">{formatLacs(carGoal.targetAmount)}</strong>) for your {carGoal.carName}? Connect with verified bank officers with flexible 30% to 70% auto financing.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          {onOpenEmiCalculator && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenEmiCalculator}
              className="flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all cursor-pointer"
              title="Estimate monthly installments across tenures"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>EMI Calculator</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenInquiry}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <span>Check Financing Eligibility</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
