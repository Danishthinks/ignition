import React, { useState } from 'react';
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
  AlertTriangle,
  Menu,
  X,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-[#0B0F17]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-white font-black shrink-0"
          >
            <Flame className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-300" />
          </motion.div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-heading font-black text-lg sm:text-xl tracking-wider text-slate-900 dark:text-white uppercase">
                Ignition
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                1st CAR
              </span>
              {isCreator && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
                  <Crown className="w-3 h-3 mr-1 inline" />
                  Creator
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block">
              Target: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatLacs(carGoal.targetAmount)} PKR</span> • {carGoal.carName}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Tutorial / Guide Button (Desktop xl+) */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenTutorialModal}
            className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
            title="How to use the app and financial playbook"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
            <span>How To Use</span>
          </motion.button>

          {/* Impulse Stopper Button (Desktop 2xl+) */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenImpulseModal}
            className="hidden 2xl:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer"
            title="Calculate how much an impulse purchase delays your dream car"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Impulse Stopper</span>
          </motion.button>

          {/* Standalone EMI Calculator Button (Desktop md+) */}
          {onOpenEmiCalculator && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenEmiCalculator}
              className="hidden md:flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
              title="Estimate monthly bank lease installments across tenures"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>EMI Calc</span>
            </motion.button>
          )}

          {/* IGNITION TURBO Pass Button */}
          {onOpenUpgradeModal && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenUpgradeModal}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer shrink-0 ${
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
                  ? 'Active TURBO VIP Status'
                  : subscription?.status === 'pending'
                  ? 'Payment verification queued'
                  : subscription?.status === 'rejected'
                  ? 'Verification retry required'
                  : 'Upgrade to TURBO Pro for ₨ 100/mo'
              }
            >
              {isPro ? (
                <>
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-amber-400" />
                  <span className="font-extrabold text-[11px] sm:text-xs">VIP</span>
                </>
              ) : subscription?.status === 'pending' ? (
                <>
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                  <span className="font-extrabold text-[11px] sm:text-xs">Pending</span>
                </>
              ) : subscription?.status === 'rejected' ? (
                <>
                  <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-300" />
                  <span className="font-extrabold text-[11px] sm:text-xs">Retry</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-slate-950" />
                  <span className="font-extrabold text-[11px] sm:text-xs">₨100</span>
                </>
              )}
            </motion.button>
          )}

          {/* Rev & Provoke Button (Desktop lg+) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={refreshQuote}
            className="hidden lg:flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-sm shadow-red-500/25 hover:brightness-110 active:brightness-95 transition-all cursor-pointer"
            title="Rev Engine & Get Fresh Provocation"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Rev</span>
          </motion.button>

          {/* Car Settings Customizer (Desktop sm+) */}
          <button
            onClick={onOpenCarModal}
            className="hidden sm:flex p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Configure Car & Current Balance"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Sound Toggle (Desktop sm+) */}
          <button
            onClick={toggleSound}
            className="hidden sm:flex p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
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
            className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Cockpit Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </motion.button>

          {/* Driver Profile (Desktop sm+) */}
          {currentUser ? (
            <div className="hidden sm:flex items-center space-x-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="flex items-center space-x-1.5 px-2 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer"
                title={`Logged in as ${currentUser.name}. Click to view driver profile.`}
              >
                <span>{currentUser.avatar || '🏎️'}</span>
                <span className="hidden md:inline max-w-[85px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-black uppercase bg-cyan-500 text-slate-950">
                  {currentUser.role === 'admin' ? 'CREATOR' : 'DRIVER'}
                </span>
              </button>

              <button
                onClick={logout}
                className="p-1 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onOpenAuthModal('login')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/20 hover:border-cyan-500/50 bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-cyan-500" />
                <span>Sign In</span>
              </motion.button>
            </div>
          )}

          {/* Add Transaction Primary Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenTransactionModal}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition-all cursor-pointer shrink-0"
            title="Log cash deposit into savings vault"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Log Cash</span>
            <span className="xs:hidden">Cash</span>
          </motion.button>

          {/* Mobile Menu Hamburger Toggle (Mobile md:hidden) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer shrink-0"
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Cockpit Menu'}
          >
            {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Cockpit Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-xl overflow-hidden px-4 py-4 space-y-3.5 shadow-xl"
          >
            {/* Driver Profile Status in Mobile Drawer */}
            {currentUser ? (
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl">{currentUser.avatar || '🏎️'}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {currentUser.name}
                      </span>
                      {isPro ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950">
                          TURBO VIP
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-white/10 text-slate-400">
                          Basic
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    onOpenAuthModal('login');
                  }}
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    onOpenAuthModal('signup');
                  }}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black text-center shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Fast Tools Navigation Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* EMI Calculator */}
              {onOpenEmiCalculator && (
                <button
                  onClick={() => {
                    closeMobileMenu();
                    onOpenEmiCalculator();
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left transition-all flex items-center space-x-2"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-500 shrink-0">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">EMI Calculator</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Lease rates & tenure</div>
                  </div>
                </button>
              )}

              {/* Car Settings */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  onOpenCarModal();
                }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left transition-all flex items-center space-x-2"
              >
                <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-500 shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Target Car</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Change goal & price</div>
                </div>
              </button>

              {/* TURBO VIP Pass */}
              {onOpenUpgradeModal && (
                <button
                  onClick={() => {
                    closeMobileMenu();
                    onOpenUpgradeModal();
                  }}
                  className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-left transition-all flex items-center space-x-2"
                >
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-300">TURBO Pass</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isPro ? 'Active VIP Member' : '₨ 100/mo Pro Pass'}
                    </div>
                  </div>
                </button>
              )}

              {/* Impulse Stopper */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  onOpenImpulseModal();
                }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left transition-all flex items-center space-x-2"
              >
                <div className="p-2 rounded-lg bg-orange-500/15 text-orange-500 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Impulse Stopper</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Test purchase delay</div>
                </div>
              </button>

              {/* Car Comparison (if available) */}
              {onOpenCompareModal && (
                <button
                  onClick={() => {
                    closeMobileMenu();
                    onOpenCompareModal();
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left transition-all flex items-center space-x-2"
                >
                  <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Compare Cars</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Fuel & specs matrix</div>
                  </div>
                </button>
              )}

              {/* How To Use Guide */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  onOpenTutorialModal();
                }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left transition-all flex items-center space-x-2"
              >
                <div className="p-2 rounded-lg bg-blue-500/15 text-blue-500 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">How To Use</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">App guide & tactics</div>
                </div>
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  refreshQuote();
                  closeMobileMenu();
                }}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs shadow-sm"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Rev Engine</span>
              </button>

              <button
                onClick={toggleSound}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                  soundEnabled
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10'
                }`}
                title="Toggle sound effects"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundEnabled ? 'FX On' : 'Muted'}</span>
              </button>
            </div>

            {/* Target Car Quick Info */}
            <div className="text-center pt-1 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400">
              Saving for <span className="font-bold text-slate-800 dark:text-slate-200">{carGoal.carName}</span> • Target: <span className="font-bold text-cyan-500">{formatLacs(carGoal.targetAmount)} PKR</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
