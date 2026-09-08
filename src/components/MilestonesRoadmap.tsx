import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPKR, formatLacs } from '../utils/formatters';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Gauge, 
  KeyRound 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const MilestonesRoadmap: React.FC = () => {
  const { milestones, carGoal, triggerCelebration } = useFinance();
  const currentAmount = carGoal.currentAmount;

  const getIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `w-5 h-5 ${unlocked ? 'text-emerald-400' : 'text-slate-400'}` };
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Gauge': return <Gauge {...props} />;
      case 'KeyRound': return <KeyRound {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-cockpit-card/90 shadow-lg p-5 sm:p-6 backdrop-blur-md transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white uppercase flex items-center space-x-2">
            <span>4-Stage Ignition Roadmap</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">
              Target: {formatLacs(carGoal.targetAmount)}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every rupee unlocks physical parts of your dream car journey.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          {milestones.filter(m => m.unlocked).length} of 4 Stages Conquered
        </span>
      </div>

      {/* Grid of Milestone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestones.map((m, idx) => {
          const isNextUp = !m.unlocked && (idx === 0 || milestones[idx - 1].unlocked);
          const gapToThis = Math.max(0, m.amount - currentAmount);

          return (
            <motion.div
              key={m.id}
              whileHover={{ y: -3 }}
              className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all ${
                m.unlocked
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                  : isNextUp
                  ? 'bg-cyan-500/5 dark:bg-cyan-950/20 border-cyan-500/40 ring-1 ring-cyan-500/30'
                  : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 opacity-70'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                    {m.stageName} • {m.percentage}%
                  </span>
                  
                  {m.unlocked ? (
                    <div className="flex items-center space-x-1 text-emerald-500 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Unlocked</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-slate-400 text-xs">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isNextUp ? 'Next Goal' : 'Locked'}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2.5 my-2">
                  <div className={`p-2 rounded-lg ${
                    m.unlocked 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : isNextUp 
                      ? 'bg-cyan-500/10 text-cyan-400' 
                      : 'bg-slate-200 dark:bg-white/5 text-slate-400'
                  }`}>
                    {getIcon(m.icon, m.unlocked)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {m.title}
                    </h4>
                    <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                      {formatPKR(m.amount)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {m.description}
                </p>
              </div>

              {/* Card Bottom Progress */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5">
                {m.unlocked ? (
                  <button
                    onClick={triggerCelebration}
                    className="w-full text-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Stage Achieved! 🏆
                  </button>
                ) : isNextUp ? (
                  <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                    Need <span className="font-bold">{formatPKR(gapToThis)}</span> to reach
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    Awaiting earlier stages
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
