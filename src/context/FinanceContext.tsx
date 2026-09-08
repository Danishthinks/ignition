import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  CarGoal, 
  Transaction, 
  Milestone, 
  MotivationalQuote, 
  CoachTone
} from '../types/finance';
import { useAuth } from './AuthContext';
import { getRandomQuote } from '../utils/quotes';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FinanceContextType {
  carGoal: CarGoal;
  transactions: Transaction[];
  coachTone: CoachTone;
  isDarkMode: boolean;
  soundEnabled: boolean;
  activeQuote: MotivationalQuote;
  milestones: Milestone[];
  monthlySavingsSpeed: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  depositToCarFund: (amount: number, note?: string) => void;
  setCurrentBalance: (amount: number) => void;
  updateCarGoal: (updates: Partial<CarGoal>) => void;
  toggleTheme: () => void;
  setCoachTone: (tone: CoachTone) => void;
  refreshQuote: () => void;
  toggleSound: () => void;
  triggerCelebration: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const DEFAULT_GOAL: CarGoal = {
  carName: 'Suzuki Alto VXR',
  modelYear: '2024',
  targetAmount: 875000,
  currentAmount: 0,
  targetDate: '2027-04-15',
  carPhotoType: 'hatchback'
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.id : 'guest';

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ignition_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('ignition_sound');
    return saved !== null ? saved === 'true' : true;
  });

  // Car Goal state - isolated per user
  const [carGoal, setCarGoal] = useState<CarGoal>(() => {
    const saved = localStorage.getItem(`ignition_goal_${userId}`);
    if (saved) return JSON.parse(saved);
    return {
      ...DEFAULT_GOAL,
      currentAmount: currentUser?.startingBalance ?? 0,
      carName: currentUser?.targetCarName ?? DEFAULT_GOAL.carName
    };
  });

  // Transactions state - isolated per user
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`ignition_txs_${userId}`);
    if (saved) return JSON.parse(saved);
    if (currentUser?.startingBalance && currentUser.startingBalance > 0) {
      return [
        {
          id: 'tx-init-' + userId,
          amount: currentUser.startingBalance,
          type: 'car_deposit',
          category: 'Monthly Car Vault',
          note: 'Initial Verified Savings in Hand',
          date: new Date().toISOString()
        }
      ];
    }
    return [];
  });

  // Coach Tone
  const [coachTone, setCoachToneState] = useState<CoachTone>(() => {
    const saved = localStorage.getItem('ignition_coach_tone');
    return (saved as CoachTone) || 'hardcore';
  });

  // Active Quote
  const [activeQuote, setActiveQuote] = useState<MotivationalQuote>(() => {
    return getRandomQuote('hardcore');
  });

  // Sync state when active user changes
  useEffect(() => {
    const activeUserId = currentUser ? currentUser.id : 'guest';
    const userGoalKey = `ignition_goal_${activeUserId}`;
    const userTxsKey = `ignition_txs_${activeUserId}`;

    const savedGoal = localStorage.getItem(userGoalKey);
    if (savedGoal) {
      try {
        setCarGoal(JSON.parse(savedGoal));
      } catch {
        // fallback
      }
    } else {
      const initialG: CarGoal = {
        ...DEFAULT_GOAL,
        currentAmount: currentUser?.startingBalance ?? 0,
        carName: currentUser?.targetCarName ?? DEFAULT_GOAL.carName
      };
      setCarGoal(initialG);
      localStorage.setItem(userGoalKey, JSON.stringify(initialG));
    }

    const savedTxs = localStorage.getItem(userTxsKey);
    if (savedTxs) {
      try {
        setTransactions(JSON.parse(savedTxs));
      } catch {
        setTransactions([]);
      }
    } else {
      const initialTxs: Transaction[] = (currentUser?.startingBalance && currentUser.startingBalance > 0)
        ? [{
            id: 'tx-init-' + activeUserId,
            amount: currentUser.startingBalance,
            type: 'car_deposit',
            category: 'Monthly Car Vault',
            note: 'Initial Verified Savings in Hand',
            date: new Date().toISOString()
          }]
        : [];
      setTransactions(initialTxs);
      localStorage.setItem(userTxsKey, JSON.stringify(initialTxs));
    }
  }, [currentUser?.id]);

  // Apply dark mode class to HTML tag
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ignition_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Persist car goal for active user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`ignition_goal_${currentUser.id}`, JSON.stringify(carGoal));
    }
  }, [carGoal, currentUser?.id]);

  // Persist transactions for active user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`ignition_txs_${currentUser.id}`, JSON.stringify(transactions));
    }
  }, [transactions, currentUser?.id]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleSound = () => setSoundEnabled(prev => !prev);

  const setCoachTone = (tone: CoachTone) => {
    setCoachToneState(tone);
    setActiveQuote(getRandomQuote(tone));
  };

  const refreshQuote = () => {
    setActiveQuote(getRandomQuote(coachTone));
    if (soundEnabled) soundFx.playEngineRev();
  };

  const triggerCelebration = () => {
    if (soundEnabled) soundFx.playMilestoneUnlock();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    });
  };

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now() + Math.random().toString(36).substr(2, 4)
    };

    setTransactions(prev => [newTx, ...prev]);

    if (newTx.type === 'car_deposit') {
      const oldAmount = carGoal.currentAmount;
      const newAmount = oldAmount + newTx.amount;
      setCarGoal(prev => ({
        ...prev,
        currentAmount: newAmount
      }));

      if (soundEnabled) {
        soundFx.playDepositChime();
        setTimeout(() => soundFx.playEngineRev(), 200);
      }
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#06B6D4', '#F59E0B']
      });

      const prevPct = (oldAmount / carGoal.targetAmount) * 100;
      const newPct = (newAmount / carGoal.targetAmount) * 100;
      if (
        (prevPct < 25 && newPct >= 25) ||
        (prevPct < 50 && newPct >= 50) ||
        (prevPct < 75 && newPct >= 75) ||
        (prevPct < 100 && newPct >= 100)
      ) {
        setTimeout(triggerCelebration, 600);
      }
    }
  };

  const setCurrentBalance = (amount: number) => {
    const safeAmount = Math.max(0, amount);
    const oldAmount = carGoal.currentAmount;
    
    setCarGoal(prev => ({
      ...prev,
      currentAmount: safeAmount
    }));

    const diff = safeAmount - oldAmount;
    if (diff !== 0) {
      const adjustmentTx: Transaction = {
        id: 'tx-adj-' + Date.now(),
        amount: Math.abs(diff),
        type: diff > 0 ? 'car_deposit' : 'expense',
        category: diff > 0 ? 'Monthly Car Vault' : 'Other Expense',
        note: `Current Savings Balance Calibrated to ₨ ${safeAmount.toLocaleString()}`,
        date: new Date().toISOString()
      };
      setTransactions(prev => [adjustmentTx, ...prev]);
    }

    if (soundEnabled) {
      soundFx.playEngineRev();
    }
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find(t => t.id === id);
    if (target && target.type === 'car_deposit') {
      setCarGoal(prev => ({
        ...prev,
        currentAmount: Math.max(0, prev.currentAmount - target.amount)
      }));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const depositToCarFund = (amount: number, note = 'Quick Car Vault Boost') => {
    addTransaction({
      amount,
      type: 'car_deposit',
      category: 'Monthly Car Vault',
      note,
      date: new Date().toISOString()
    });
  };

  const updateCarGoal = (updates: Partial<CarGoal>) => {
    setCarGoal(prev => ({ ...prev, ...updates }));
  };

  const pct = carGoal.targetAmount > 0 ? (carGoal.currentAmount / carGoal.targetAmount) * 100 : 0;
  const milestones: Milestone[] = [
    {
      id: 'm1',
      percentage: 25,
      amount: Math.round(carGoal.targetAmount * 0.25),
      stageName: 'Stage 1',
      title: 'Blueprint & Chassis',
      description: 'First milestone conquered! The foundation of your first car is cemented.',
      icon: 'ShieldCheck',
      unlocked: pct >= 25
    },
    {
      id: 'm2',
      percentage: 50,
      amount: Math.round(carGoal.targetAmount * 0.50),
      stageName: 'Stage 2',
      title: 'Engine Block & Power',
      description: 'Halfway point! You have secured half the downpayment. The engine is roaring.',
      icon: 'Zap',
      unlocked: pct >= 50
    },
    {
      id: 'm3',
      percentage: 75,
      amount: Math.round(carGoal.targetAmount * 0.75),
      stageName: 'Stage 3',
      title: 'Wheels, Interior & AC',
      description: 'The finish line is within view. The cockpit is ready for you.',
      icon: 'Gauge',
      unlocked: pct >= 75
    },
    {
      id: 'm4',
      percentage: 100,
      amount: carGoal.targetAmount,
      stageName: 'Stage 4',
      title: 'Ignition Keys in Hand!',
      description: '8.5 - 9 Lacs PKR secured in full! Head to the showroom and claim your ride!',
      icon: 'KeyRound',
      unlocked: pct >= 100
    }
  ];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCarDeposits = transactions
    .filter(t => t.type === 'car_deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const monthlySavingsSpeed = totalCarDeposits > 0 ? Math.max(totalCarDeposits, 55000) : 55000;

  return (
    <FinanceContext.Provider
      value={{
        carGoal,
        transactions,
        coachTone,
        isDarkMode,
        soundEnabled,
        activeQuote,
        milestones,
        monthlySavingsSpeed,
        totalIncome,
        totalExpenses,
        netSavings,
        addTransaction,
        deleteTransaction,
        depositToCarFund,
        setCurrentBalance,
        updateCarGoal,
        toggleTheme,
        setCoachTone,
        refreshQuote,
        toggleSound,
        triggerCelebration
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
