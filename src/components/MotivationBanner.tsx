import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Flame, 
  RefreshCw, 
  Bell, 
  BellRing, 
  Quote, 
  Sparkles, 
  ShieldAlert, 
  Compass, 
  Swords 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MotivationBanner: React.FC = () => {
  const { 
    activeQuote, 
    coachTone, 
    setCoachTone, 
    refreshQuote,
    carGoal 
  } = useFinance();

  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'enabled' | 'denied'>('idle');
  const [isRotating, setIsRotating] = useState(false);

  const handleRefresh = () => {
    setIsRotating(true);
    refreshQuote();
    setTimeout(() => setIsRotating(false), 500);
  };

  const enableDailyReminders = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationStatus('enabled');
        new Notification('🏎️ Ignition Daily Motivation', {
          body: `Keep your eyes on the goal! You are building toward your ${carGoal.carName} downpayment. Stay disciplined today!`,
          icon: '/favicon.svg'
        });
      } else {
        setNotificationStatus('denied');
      }
    } catch {
      setNotificationStatus('denied');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 dark:border-amber-400/20 bg-gradient-to-r from-amber-500/[0.06] via-white/80 to-cyan-500/[0.06] dark:from-amber-500/[0.07] dark:via-slate-900/80 dark:to-cyan-500/[0.07] shadow-sm backdrop-blur-md p-3 sm:py-3.5 sm:px-4.5 transition-all">
      {/* Subtle decorative warm glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

      {/* Cute Top Compact Bar */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {/* Left: Cute spark badge & tag */}
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Flame className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-heading font-black tracking-wide text-slate-800 dark:text-slate-200 uppercase shrink-0">
            Daily Spark
          </span>
          <span className="text-[10px] py-0.5 px-2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20 truncate max-w-[120px] sm:max-w-none">
            {activeQuote.tag}
          </span>
        </div>

        {/* Right: Cute Persona Selectors & Quick Actions */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Compact 3-tone pill selector */}
          <div className="flex items-center bg-slate-200/70 dark:bg-white/5 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => setCoachTone('hardcore')}
              className={`px-2 py-0.5 rounded-md transition-all flex items-center space-x-1 cursor-pointer ${
                coachTone === 'hardcore'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Hardcore reality check"
            >
              <Swords className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Hardcore</span>
            </button>

            <button
              onClick={() => setCoachTone('visionary')}
              className={`px-2 py-0.5 rounded-md transition-all flex items-center space-x-1 cursor-pointer ${
                coachTone === 'visionary'
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Visionary mindset"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Visionary</span>
            </button>

            <button
              onClick={() => setCoachTone('stoic')}
              className={`px-2 py-0.5 rounded-md transition-all flex items-center space-x-1 cursor-pointer ${
                coachTone === 'stoic'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Stoic discipline"
            >
              <Compass className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Stoic</span>
            </button>
          </div>

          {/* Mini Shuffle Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            className="p-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-all cursor-pointer"
            title="Get another spark"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          </motion.button>

          {/* Mini Daily Notification Bell Toggle */}
          <button
            onClick={enableDailyReminders}
            className={`p-1 rounded-lg border transition-all cursor-pointer ${
              notificationStatus === 'enabled'
                ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                : 'bg-slate-200/70 dark:bg-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-slate-200 dark:border-white/10'
            }`}
            title={notificationStatus === 'enabled' ? 'Daily reminders active' : 'Enable daily notification'}
          >
            {notificationStatus === 'enabled' ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Cute Quote & Provocation Body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeQuote.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="space-y-1.5"
        >
          {/* Main Quote Text */}
          <div className="flex items-start space-x-1.5">
            <Quote className="w-3 h-3 text-amber-500 shrink-0 mt-0.5 opacity-80" />
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug italic">
              "{activeQuote.quote}"
              <span className="ml-1.5 text-[11px] font-normal not-italic text-slate-500 dark:text-slate-400 inline-block">
                — {activeQuote.author}
              </span>
            </p>
          </div>

          {/* Compact Cute Provocation Pill */}
          {activeQuote.provocation && (
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 w-fit max-w-full">
              <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate">
                <strong className="uppercase text-[9px] tracking-wider text-amber-600 dark:text-amber-400 mr-1">Action:</strong>
                {activeQuote.provocation}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
