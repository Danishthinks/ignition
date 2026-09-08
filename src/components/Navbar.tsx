import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { 
  Flame, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  Sliders, 
  Sparkles,
  BookOpen,
  User as UserIcon,
  LogOut,
  Crown,
  Calculator,
  Zap,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatLacs } from '../utils/formatters';

interface NavbarProps {
  onOpenTransactionModal: () => void;
  onOpenCarModal: () => void;
  onOpenImpulseModal: () => void;
  onOpenAuthModal: (tab?: 'login' | 'signup') => void;
  onOpenTutorialModal: () => void;
  onOpenEmiCalculator?: () => void;
  onOpenUpgradeModal?: () => void;
  onOpenCompareModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTransactionModal,
  onOpenCarModal,
  onOpenImpulseModal,
  onOpenAuthModal,
  onOpenTutorialModal,
  onOpenEmiCalculator,
  onOpenUpgradeModal,
  onOpenCompareModal,
}) => {
  const { 
    isDarkMode, 
    toggleTheme, 
    soundEnabled, 
    toggleSound, 
    refreshQuote, 
    carGoal 
  } = useFinance();

  const { currentUser, logout, isCreator, isPro, subscription } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-white font-black"
          >
            <Flame className="w-5 h-5 text-amber-300" />
          </motion.div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-black text-xl tracking-wider text-slate-900 dark:text-white uppercase">
                Ignition
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                1st CAR VAULT
              </span>
              {isCreator && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
                  <Crown className="w-3 h-3 mr-1 inline" />
                  Creator Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Target: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatLacs(carGoal.targetAmount)} PKR</span> • {carGoal.carName}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Tutorial / Guide Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenTutorialModal}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-all"
            title="How to use the app and financial playbook"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
            <span className="hidden md:inline">How To Use</span>
          </motion.button>

          {/* Impulse Stopper Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenImpulseModal}
            className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
            title="Calculate how much an impulse purchase delays your dream car"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Impulse Stopper</span>
          </motion.button>

          {/* Standalone EMI Calculator Button */}
          {onOpenEmiCalculator && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenEmiCalculator}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
              title="Estimate monthly bank lease installments across tenures"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden md:inline">EMI Calculator</span>
            </motion.button>
          )}

          {/* IGNITION TURBO Pass Button */}
          {onOpenUpgradeModal && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenUpgradeModal}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                isPro
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                  : subscription?.status === 'pending'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 animate-pulse'
                  : subscription?.status === 'rejected'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
              }`}
              title={
                isPro
                  ? 'You have active TURBO VIP status'
                  : subscription?.status === 'pending'
                  ? 'Your TURBO payment is pending verification'
                  : subscription?.status === 'rejected'
                  ? 'TURBO payment verification failed - click to retry'
                  : 'Upgrade to TURBO Pro for ₨ 100/mo'
              }
            >
              {isPro ? (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span className="font-extrabold">TURBO VIP</span>
                </>
              ) : subscription?.status === 'pending' ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span className="font-extrabold hidden sm:inline">TURBO Pending...</span>
                  <span className="font-extrabold sm:hidden">Pending</span>
                </>
              ) : subscription?.status === 'rejected' ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
                  <span className="font-extrabold">TURBO Retry</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current text-slate-950" />
                  <span className="font-extrabold">TURBO ₨100</span>
                </>
              )}
            </motion.button>
          )}

          {/* Rev & Provoke Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={refreshQuote}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-sm shadow-red-500/25 hover:brightness-110 active:brightness-95 transition-all"
            title="Rev Engine & Get Fresh Provocation"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Rev Engine</span>
          </motion.button>

          {/* Car Settings Customizer */}
          <button
            onClick={onOpenCarModal}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title="Configure Car & Current Balance"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Dark / Light Toggle */}
          <motion.button
            whileTap={{ rotate: 180 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Cockpit Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </motion.button>

          {/* Driver Profile */}
          {currentUser ? (
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="flex items-center space-x-1.5 px-2 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10 transition-all"
                title={`Logged in as ${currentUser.name}. Click to view driver profile.`}
              >
                <span>{currentUser.avatar || '🏎️'}</span>
                <span className="hidden sm:inline max-w-[85px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-black uppercase bg-cyan-500 text-slate-950">
                  {currentUser.role === 'admin' ? 'CREATOR' : 'DRIVER'}
                </span>
              </button>

              <button
                onClick={logout}
                className="p-1 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {/* Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onOpenAuthModal('login')}
                className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/20 hover:border-cyan-500/50 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all shadow-sm"
                title="Sign in to your driver account"
              >
                <UserIcon className="w-3.5 h-3.5 text-cyan-500" />
                <span>Sign In</span>
              </motion.button>

              {/* Highlighted Sign Up Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenAuthModal('signup')}
                className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/50 transition-all"
                title="Create a free driver account to track your car downpayment"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Sign Up</span>
              </motion.button>
            </div>
          )}

          {/* Add Transaction Primary Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenTransactionModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Log Cash</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
