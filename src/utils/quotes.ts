import type { MotivationalQuote } from '../types/finance';

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: 'q1',
    quote: "While everyone else is taking rickshaws and bikes in 44°C heat, remember why you skipped that overpriced café dinner.",
    provocation: "Every 5,000 PKR wasted is 3 days delayed from sitting inside your air-conditioned car.",
    author: "The Cockpit Coach",
    tone: 'hardcore',
    tag: 'Discipline'
  },
  {
    id: 'q2',
    quote: "8.5 Lacs isn't an unreachable mountain. It's just 85 people giving you 10,000 PKR, or you saying NO to 85 dumb impulse purchases.",
    provocation: "You are closer today than you were yesterday. Keep your foot pinned on the gas.",
    author: "Street Hustler",
    tone: 'hardcore',
    tag: 'Math of Success'
  },
  {
    id: 'q3',
    quote: "The day you grip that steering wheel, twist the ignition, and hear the engine purr—knowing YOU paid for it without asking anyone for help—you will feel untouchable.",
    provocation: "Never trade ultimate pride for temporary comfort.",
    author: "Visionary Drive",
    tone: 'visionary',
    tag: 'Pride & Freedom'
  },
  {
    id: 'q4',
    quote: "Nobody ever felt great about their impulse food delivery 2 hours later. But you will cherish driving your first car for years.",
    provocation: "Put that ₨ 3,000 into the car vault right now instead.",
    author: "No Excuses",
    tone: 'hardcore',
    tag: 'Impulse Control'
  },
  {
    id: 'q5',
    quote: "Financial independence isn't about bragging; it's about the dignity of having your own ride to protect your family from the rain and dust.",
    provocation: "Your first car is not a luxury. It is freedom on four wheels.",
    author: "Life Highway",
    tone: 'visionary',
    tag: 'Family & Purpose'
  },
  {
    id: 'q6',
    quote: "Every single rupee you divert into your car downpayment is a brick laid for your personal sovereignty.",
    provocation: "Don't let cheap dopamine steal your long-term horsepower.",
    author: "Iron Will",
    tone: 'stoic',
    tag: 'Focus'
  },
  {
    id: 'q7',
    quote: "Small minds spend money to impress people they don't even like. Kings save aggressively to buy their first car in cash.",
    provocation: "Lock in. 9 Lacs PKR is waiting to become your machine.",
    author: "Alpha Mindset",
    tone: 'hardcore',
    tag: 'Identity'
  },
  {
    id: 'q8',
    quote: "Picture the chilly winter morning when you step into your car, turn on the heater, play your favorite song, and drive off.",
    provocation: "That reality is being constructed right now by your financial choices today.",
    author: "Ignition Vision",
    tone: 'visionary',
    tag: 'Visualization'
  },
  {
    id: 'q9',
    quote: "Excuses don't buy cars. Savings accounts do. Put the money in the vault and let your bank statement do the talking.",
    provocation: "Close the shopping app. Open your Car Vault.",
    author: "Tough Love",
    tone: 'hardcore',
    tag: 'Execution'
  },
  {
    id: 'q10',
    quote: "A budget is not a prison; it is a GPS navigation system directing you straight to the showroom floor.",
    provocation: "Recalculating route: destination is ₨ 875,000 PKR.",
    author: "Speedometer",
    tone: 'stoic',
    tag: 'Navigation'
  }
];

export function getRandomQuote(tone?: string): MotivationalQuote {
  const filtered = tone && tone !== 'all' 
    ? MOTIVATIONAL_QUOTES.filter(q => q.tone === tone) 
    : MOTIVATIONAL_QUOTES;
  
  const pool = filtered.length > 0 ? filtered : MOTIVATIONAL_QUOTES;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
