import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPKR } from '../utils/formatters';
import { 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalyticsView: React.FC = () => {
  const { transactions } = useFinance();

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

  // Group expenses by category
  const expenseByCategory = expenseTransactions.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const sortedCategories = Object.entries(expenseByCategory)
    .map(([cat, amount]) => ({
      category: cat,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // Check impulse spending specifically
  const impulseSpend = expenseByCategory['Impulse Spending'] || 0;
  const daysWasted = Math.round(impulseSpend / 1500);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-cockpit-card/90 shadow-lg p-5 sm:p-6 backdrop-blur-md transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white uppercase flex items-center space-x-2">
            <span>Cash Flow & Outflow Analytics</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify leaks in your budget that slow down your car ignition.
          </p>
        </div>

        {impulseSpend > 0 ? (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold self-start sm:self-auto">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{formatPKR(impulseSpend)} spent on impulse (~{daysWasted} days car delay)</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Impulse Leaks! High Discipline</span>
          </div>
        )}
      </div>

      {/* Category breakdown bars */}
      <div className="space-y-3.5">
        {sortedCategories.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No expenses logged yet. Every rupee stays in your pocket!
          </p>
        ) : (
          sortedCategories.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {item.category}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white font-bold">{formatPKR(item.amount)}</strong> ({item.percentage.toFixed(1)}%)
                </span>
              </div>
              {/* Animated Progress Bar */}
              <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    item.category === 'Impulse Spending'
                      ? 'bg-red-500'
                      : item.category.includes('Food')
                      ? 'bg-amber-500'
                      : item.category.includes('Housing')
                      ? 'bg-blue-500'
                      : 'bg-indigo-500'
                  }`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
