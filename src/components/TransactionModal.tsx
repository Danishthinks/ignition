import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { TransactionType, TransactionCategory } from '../types/finance';
import { 
  X, 
  Car, 
  ArrowDownRight, 
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatInputCommas, parseInputCommas, formatLacs } from '../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'car_deposit',
}) => {
  const { addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>(defaultType);
  // Empty string so no annoying leading 0 appears!
  const [amountStr, setAmountStr] = useState<string>('');
  const [category, setCategory] = useState<string>('Monthly Car Vault');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const carCategories: TransactionCategory[] = [
    'Monthly Car Vault',
    'Freelance Hustle Bonus',
    'Budget Surplus',
    'Special Gift / Windfall'
  ];

  const incomeCategories: TransactionCategory[] = [
    'Salary',
    'Freelance',
    'Business',
    'Bonus',
    'Gift',
    'Investment',
    'Other Income'
  ];

  const expenseCategories: TransactionCategory[] = [
    'Food & Dining',
    'Housing & Rent',
    'Bills & Utilities',
    'Transport & Commute',
    'Shopping & Lifestyle',
    'Entertainment',
    'Healthcare',
    'Groceries',
    'Impulse Spending',
    'Other Expense'
  ];

  const activeCategories = 
    type === 'car_deposit' ? carCategories :
    type === 'income' ? incomeCategories : 
    expenseCategories;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'car_deposit') setCategory('Monthly Car Vault');
    else if (newType === 'income') setCategory('Salary');
    else setCategory('Food & Dining');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInputCommas(amountStr);
    if (numAmount <= 0) return;

    addTransaction({
      amount: numAmount,
      type,
      category: category as TransactionCategory,
      note: note.trim() || (type === 'car_deposit' ? 'Car Vault Deposit' : category),
      date: new Date(date).toISOString()
    });

    setAmountStr('');
    setNote('');
    onClose();
  };

  const parsedAmount = parseInputCommas(amountStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl p-6 sm:p-7 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-heading font-black text-white uppercase mb-1">
          Record Cash Flow
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Keep your financial pipeline clean and disciplined.
        </p>

        {/* Transaction Type Segment Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => handleTypeChange('car_deposit')}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'car_deposit'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Car Vault</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Income</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'expense'
                ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Expense</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount in PKR with Real-Time Comma Formatting */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Amount (PKR ₨)
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-2.5 text-sm font-black ${
                type === 'car_deposit' ? 'text-cyan-400' :
                type === 'income' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                ₨
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={amountStr}
                onChange={(e) => setAmountStr(formatInputCommas(e.target.value))}
                placeholder="e.g. 25,000"
                required
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-base font-black text-white outline-none"
              />
            </div>
            {parsedAmount > 0 && (
              <span className="text-[11px] text-cyan-300/80 font-mono mt-1 block">
                Formatted: ₨ {amountStr} ({formatLacs(parsedAmount)})
              </span>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
            >
              {activeCategories.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Note / Memo */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Client deposit, groceries, car fuel fund..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl font-black text-sm transition-all shadow-lg ${
                type === 'car_deposit'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25'
                  : type === 'income'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                  : 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/25'
              }`}
            >
              {type === 'car_deposit' ? '🏎️ Deposit into Car Vault!' : 'Save Entry'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
