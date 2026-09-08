export type TransactionType = 'income' | 'expense' | 'car_deposit';

export type IncomeCategory = 'Salary' | 'Freelance' | 'Business' | 'Bonus' | 'Gift' | 'Investment' | 'Other Income';

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Housing & Rent'
  | 'Bills & Utilities'
  | 'Transport & Commute'
  | 'Shopping & Lifestyle'
  | 'Entertainment'
  | 'Healthcare'
  | 'Groceries'
  | 'Impulse Spending'
  | 'Other Expense';

export type CarDepositCategory =
  | 'Monthly Car Vault'
  | 'Freelance Hustle Bonus'
  | 'Budget Surplus'
  | 'Special Gift / Windfall';

export type TransactionCategory = IncomeCategory | ExpenseCategory | CarDepositCategory;

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  note: string;
  date: string; // ISO date string
}

export interface Milestone {
  id: string;
  percentage: number;
  amount: number;
  title: string;
  stageName: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface CarGoal {
  carName: string;
  modelYear: string;
  targetAmount: number; // e.g. 875,000 PKR
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  carPhotoType: 'hatchback' | 'sedan' | 'sport';
}

export type CoachTone = 'hardcore' | 'visionary' | 'stoic';

export interface MotivationalQuote {
  id: string;
  quote: string;
  provocation: string;
  author: string;
  tone: CoachTone;
  tag: string;
}

export interface ImpulseAnalysis {
  cost: number;
  daysDelayed: number;
  percentageOfCar: number;
  provocationMessage: string;
}
