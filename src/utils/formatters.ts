// Formatter utilities for Pakistani Rupee (PKR) and goal metrics

export function formatPKR(amount: number, showSymbol = true): string {
  // Format using South Asian/Pakistani comma placement (hundreds, thousands, lacs: e.g. 1,35,000)
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount || 0));

  return showSymbol ? `₨ ${formatted}` : formatted;
}

export function formatLacs(amount: number): string {
  const lacs = amount / 100000;
  if (lacs >= 1) {
    return `${lacs.toFixed(2)} Lacs`;
  }
  return formatPKR(amount);
}

// Converts user input into formatted string with commas for hundreds, thousands, and lacs (e.g. 135000 -> 1,35,000)
// Strips any leading zeros so "0135000" automatically becomes "1,35,000"
export function formatInputCommas(val: string | number): string {
  if (val === '' || val === null || val === undefined) return '';
  const rawDigits = val.toString().replace(/\D/g, '');
  if (!rawDigits) return '';
  
  // Parse integer to strip any leading zero (e.g. 0135000 -> 135000)
  const cleanNumber = parseInt(rawDigits, 10);
  if (isNaN(cleanNumber)) return '';
  
  // Formats with hundreds, thousands, and lacs grouping (e.g. 1,35,000 or 8,75,000)
  return new Intl.NumberFormat('en-IN').format(cleanNumber);
}

// Parses string with commas back into clean integer
export function parseInputCommas(val: string): number {
  if (!val) return 0;
  const rawDigits = val.replace(/\D/g, '');
  if (!rawDigits) return 0;
  return parseInt(rawDigits, 10) || 0;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function calculateImpulseImpact(
  impulseAmount: number,
  monthlySavingsSpeed: number,
  targetAmount: number
) {
  const dailySavings = Math.max(monthlySavingsSpeed / 30, 800);
  const daysDelayed = Math.max(1, Math.round(impulseAmount / dailySavings));
  const percentageOfGoal = (impulseAmount / targetAmount) * 100;

  let provocation = '';
  if (daysDelayed <= 2) {
    provocation = `That impulse buy pushes your car ignition key back by ${daysDelayed} whole days. Is it worth walking for 2 extra days?`;
  } else if (daysDelayed <= 7) {
    provocation = `You just delayed your dream car arrival by a FULL WEEK! That could have bought 2 tanks of petrol once you own it.`;
  } else {
    provocation = `CRITICAL WARNING: This single expense steals ${daysDelayed} days of driving your own car. Abort immediately and transfer to Car Vault!`;
  }

  return {
    daysDelayed,
    percentageOfGoal: Math.min(percentageOfGoal, 100),
    provocation
  };
}
