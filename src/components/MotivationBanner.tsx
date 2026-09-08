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
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-cockpit-card/90 shadow-lg backdrop-blur-md p-5 sm:p-6 transition-colors">
      {/* Decorative Accent Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-3.5 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-black tracking-wide text-slate-900 dark:text-white uppercase flex items-center space-x-2">
              <span>Daily Dream Ignition Fuel</span>
              <span className="text-[10px] py-0.5 px-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                {activeQuote.tag}
              </span>
            </h3>
          </div>
        </div>

        {/* Persona Selectors */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setCoachTone('hardcore')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              coachTone === 'hardcore'
                ? 'bg-red-500 text-white shadow-sm shadow-red-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Raw provocation and hardcore reality check"
          >
            <Swords className="w-3 h-3" />
            <span>Hardcore</span>
          </button>

          <button
            onClick={() => setCoachTone('visionary')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              coachTone === 'visionary'
                ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Inspirational and visionary mindset"
          >
            <Sparkles className="w-3 h-3" />
            <span>Visionary</span>
          </button>

          <button
            onClick={() => setCoachTone('stoic')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              coachTone === 'stoic'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Stoic discipline and laser focus"
          >
            <Compass className="w-3 h-3" />
            <span>Stoic</span>
          </button>
        </div>
      </div>

      {/* Quote & Provocation Body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeQuote.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="relative pl-6 sm:pl-8 py-1"
        >
          <Quote className="absolute left-0 top-0 w-5 h-5 text-cyan-500/40 dark:text-cyan-400/40" />
          
          {/* Main Inspirational Quote */}
          <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed italic">
            "{activeQuote.quote}"
          </p>

          {/* Hard-hitting Provocation Statement */}
          <div className="mt-3 flex items-start space-x-2 p-2.5 rounded-xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/20">
            <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300">
              <span className="uppercase tracking-wider font-extrabold text-[11px] text-amber-600 dark:text-amber-400 mr-1.5">
                Provocation:
              </span>
              {activeQuote.provocation}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer Controls */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400 italic">
          — {activeQuote.author}
        </span>

        <div className="flex items-center space-x-2">
          {/* Daily Reminder Button */}
          <button
            onClick={enableDailyReminders}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              notificationStatus === 'enabled'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
            title="Receive a daily motivational notification to keep you focused"
          >
            {notificationStatus === 'enabled' ? (
              <>
                <BellRing className="w-3.5 h-3.5 text-emerald-500" />
                <span>Daily Bell Active</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                <span>Notify Me Daily</span>
              </>
            )}
          </button>

          {/* Shuffle / Provoke Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-bold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>Provoke Me Again</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
