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
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatLacs } from '../utils/formatters';

interface NavbarProps {
  onOpenTransactionModal: () => void;
  onOpenCarModal: () => void;
  onOpenImpulseModal: () => void;
  onOpenAuthModal: () => void;
  onOpenTutorialModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTransactionModal,
  onOpenCarModal,
  onOpenImpulseModal,
  onOpenAuthModal,
  onOpenTutorialModal,
}) => {
  const { 
    isDarkMode, 
    toggleTheme, 
    soundEnabled, 
    toggleSound, 
    refreshQuote, 
    carGoal 
  } = useFinance();

  const { currentUser, logout, isCreator } = useAuth();

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
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
            title="Calculate how much an impulse purchase delays your dream car"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Impulse Stopper</span>
          </motion.button>

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
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 px-2 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10 transition-all"
                title={`Logged in as ${currentUser.name}. Click to switch driver account.`}
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
            <button
              onClick={onOpenAuthModal}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 text-xs font-bold text-slate-900 dark:text-white"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Driver Sign In</span>
            </button>
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
