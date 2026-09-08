export interface CarPreset {
  id: string;
  name: string;
  shortName: string;
  year: string;
  totalMarketPrice: number; // in PKR
  downpaymentPercent: number; // e.g. 0.30 (30%)
  downpaymentTarget: number; // 30% of totalMarketPrice
  financedAmount: number; // 70% of totalMarketPrice
  engineCC: number;
  maxTenureYears: number; // SBP: 5 years for <= 1000cc, 3 years for > 1000cc
  category: 'Entry Hatchback' | 'Family Hatchback' | 'Sedan';
}

export const PAKISTANI_CAR_PRESETS: CarPreset[] = [
  {
    id: 'alto-vxr',
    name: 'Suzuki Alto VXR',
    shortName: 'Alto VXR',
    year: '2024',
    totalMarketPrice: 3050000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 915000,
    financedAmount: 2135000,
    engineCC: 660,
    maxTenureYears: 5,
    category: 'Entry Hatchback'
  },
  {
    id: 'cultus-vxl',
    name: 'Suzuki Cultus VXL',
    shortName: 'Cultus VXL',
    year: '2024',
    totalMarketPrice: 4350000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1305000,
    financedAmount: 3045000,
    engineCC: 998,
    maxTenureYears: 5,
    category: 'Family Hatchback'
  },
  {
    id: 'alsvin-comfort',
    name: 'Changan Alsvin 1.3L',
    shortName: 'Alsvin 1.3L',
    year: '2024',
    totalMarketPrice: 4450000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1335000,
    financedAmount: 3115000,
    engineCC: 1370,
    maxTenureYears: 3,
    category: 'Sedan'
  },
  {
    id: 'swift-glx',
    name: 'Suzuki Swift GLX CVT',
    shortName: 'Swift GLX',
    year: '2024',
    totalMarketPrice: 4950000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1485000,
    financedAmount: 3465000,
    engineCC: 1200,
    maxTenureYears: 3,
    category: 'Family Hatchback'
  },
  {
    id: 'yaris-ativ',
    name: 'Toyota Yaris 1.3 ATIV',
    shortName: 'Yaris ATIV',
    year: '2024',
    totalMarketPrice: 5150000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1545000,
    financedAmount: 3605000,
    engineCC: 1329,
    maxTenureYears: 3,
    category: 'Sedan'
  },
  {
    id: 'city-aspire',
    name: 'Honda City 1.2L CVT',
    shortName: 'City 1.2L',
    year: '2024',
    totalMarketPrice: 5250000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1575000,
    financedAmount: 3675000,
    engineCC: 1199,
    maxTenureYears: 3,
    category: 'Sedan'
  }
];

export const getCarPresetByName = (name: string): CarPreset => {
  const clean = name.toLowerCase();
  const match = PAKISTANI_CAR_PRESETS.find(
    (c) => clean.includes(c.shortName.toLowerCase()) || clean.includes(c.id) || c.name.toLowerCase().includes(clean)
  );
  return match || PAKISTANI_CAR_PRESETS[0];
};

/**
 * Standard Auto Loan / Islamic Ijarah Monthly Installment (EMI) Calculator
 * In Pakistan, typical auto finance markup rate is KIBOR (~15-16%) + Bank spread (~2-3%) = ~18-19% p.a.
 * Takaful / Insurance: ~2% p.a.
 * Formula: EMI = [P * r * (1 + r)^n] / [((1 + r)^n) - 1] + Monthly Insurance
 */
export const calculateAutoEMI = (
  loanAmount: number,
  tenureYears: number,
  annualProfitRate: number = 0.19,
  annualInsuranceRate: number = 0.02
): number => {
  if (loanAmount <= 0 || tenureYears <= 0) return 0;

  const totalMonths = tenureYears * 12;
  const monthlyRate = annualProfitRate / 12;

  // Monthly Loan installment
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const baseMonthlyInstallment = (loanAmount * monthlyRate * factor) / (factor - 1);

  // Monthly Takaful / Insurance
  const monthlyInsurance = (loanAmount * annualInsuranceRate) / 12;

  return Math.round(baseMonthlyInstallment + monthlyInsurance);
};
