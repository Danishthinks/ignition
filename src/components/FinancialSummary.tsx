import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPKR } from '../utils/formatters';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Car, 
  Percent 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const FinancialSummary: React.FC = () => {
  const { totalIncome, totalExpenses, carGoal, transactions } = useFinance();

  const totalCarDeposits = transactions
    .filter(t => t.type === 'car_deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;
  const carAllocationRate = totalIncome > 0 ? Math.round((totalCarDeposits / totalIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-cockpit-card/90 shadow-sm backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Inflow
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
          {formatPKR(totalIncome)}
        </div>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
          Earned & Inflow
        </span>
      </motion.div>

      {/* Total Expenses */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-cockpit-card/90 shadow-sm backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Outflow
          </span>
          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
          {formatPKR(totalExpenses)}
        </div>
        <span className="text-[11px] text-red-500 font-semibold mt-1 block">
          Living & Expenses
        </span>
      </motion.div>

      {/* Total Car Vault Contributions */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-cockpit-card/90 shadow-sm backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Car Goal Vault
          </span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Car className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black font-heading text-cyan-600 dark:text-cyan-400">
          {formatPKR(carGoal.currentAmount)}
        </div>
        <span className="text-[11px] text-cyan-600 dark:text-cyan-300 font-semibold mt-1 block">
          {carAllocationRate}% of income channeled here
        </span>
      </motion.div>

      {/* Savings Rate */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-cockpit-card/90 shadow-sm backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Net Savings Rate
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
          {savingsRate}%
        </div>
        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
          {netSavings >= 0 ? `+${formatPKR(netSavings)} surplus` : 'Deficit'}
        </span>
      </motion.div>
    </div>
  );
};
