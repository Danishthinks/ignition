import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import type { TransactionType } from '../types/finance';
import { formatPKR, formatDate } from '../utils/formatters';
import { 
  Car, 
  ArrowDownRight, 
  ArrowUpRight, 
  Trash2, 
  Search, 
  Sparkles, 
  Plus,
  Download,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionListProps {
  onOpenTransactionModal: () => void;
  onOpenUpgradeModal?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  onOpenTransactionModal,
  onOpenUpgradeModal,
}) => {
  const { transactions, deleteTransaction } = useFinance();
  const { isPro } = useAuth();
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch = 
      t.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amount.toString().includes(searchQuery);
    return matchesType && matchesSearch;
  });

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'car_deposit':
        return (
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <Car className="w-4 h-4" />
          </div>
        );
      case 'income':
        return (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        );
      case 'expense':
        return (
          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        );
    }
  };

  const handleExportCSV = () => {
    if (!isPro) {
      onOpenUpgradeModal?.();
      return;
    }

    const headers = ['Date', 'Type', 'Category', 'Amount (PKR)', 'Note'];
    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.amount,
      `"${t.note.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ignition_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-cockpit-card/90 shadow-lg p-5 sm:p-6 backdrop-blur-md transition-colors">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white uppercase flex items-center space-x-2">
            <span>Transaction Ledger</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold">
              {filtered.length} entries
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every rupee in and out tracked with precision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* CSV Export Button (Pro / Turbo) */}
          <button
            onClick={handleExportCSV}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isPro
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
            }`}
            title={isPro ? 'Download full transaction ledger as CSV' : 'Exporting CSV requires IGNITION TURBO (₨ 100/mo)'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
            {!isPro && (
              <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-500 font-extrabold ml-0.5">
                TURBO
              </span>
            )}
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all w-36 sm:w-48"
            />
          </div>

          {/* New Transaction Button */}
          <button
            onClick={onOpenTransactionModal}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 mb-4 border-b border-slate-100 dark:border-white/5 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterType === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Activity ({transactions.length})
        </button>

        <button
          onClick={() => setFilterType('car_deposit')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterType === 'car_deposit'
              ? 'bg-cyan-500 text-slate-950'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Car Vault ({transactions.filter(t => t.type === 'car_deposit').length})</span>
        </button>

        <button
          onClick={() => setFilterType('income')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterType === 'income'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Income ({transactions.filter(t => t.type === 'income').length})</span>
        </button>

        <button
          onClick={() => setFilterType('expense')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterType === 'expense'
              ? 'bg-red-500 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Expenses ({transactions.filter(t => t.type === 'expense').length})</span>
        </button>
      </div>

      {/* List / Table */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-slate-400"
            >
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold">No transactions found in this view.</p>
              <p className="text-xs text-slate-500 mt-1">
                Log income or deposit into your dream car vault to see them here.
              </p>
            </motion.div>
          ) : (
            filtered.map((tx) => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {getTransactionIcon(tx.type)}
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {tx.note}
                      </p>
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className={`text-sm sm:text-base font-heading font-black ${
                    tx.type === 'car_deposit' ? 'text-cyan-600 dark:text-cyan-400' :
                    tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' :
                    'text-red-500'
                  }`}>
                    {tx.type === 'car_deposit' ? '🏎️ ' : tx.type === 'income' ? '+ ' : '- '}
                    {formatPKR(tx.amount)}
                  </span>

                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
