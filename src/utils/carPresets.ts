export type CarTransmission = 
  | 'Manual' 
  | 'Automatic / AGS' 
  | 'Automatic / CVT' 
  | 'Automatic / DCT' 
  | 'Automatic';

export type CarMake = 
  | 'Suzuki' 
  | 'Toyota' 
  | 'Honda' 
  | 'Changan' 
  | 'Kia' 
  | 'Hyundai';

export interface CarPreset {
  id: string;
  name: string;
  shortName: string;
  make: CarMake;
  year: string;
  engineCC: number;
  transmission: CarTransmission;
  transmissionType: 'Manual' | 'Automatic';
  totalMarketPrice: number; // in PKR
  downpaymentPercent: number; // e.g. 0.30 (30%)
  downpaymentTarget: number; // 30% of totalMarketPrice
  financedAmount: number; // 70% of totalMarketPrice
  maxTenureYears: number; // SBP: 5 years for <= 1000cc, 3 years for > 1000cc
  category: 'Entry Hatchback' | 'Family Hatchback' | 'Compact Sedan' | 'Executive Sedan' | 'Crossover';
}

export const CAR_MAKES: CarMake[] = ['Suzuki', 'Toyota', 'Honda', 'Changan', 'Kia', 'Hyundai'];

export const PAKISTANI_CAR_PRESETS: CarPreset[] = [
  // ==================== PAK SUZUKI ====================
  {
    id: 'alto-vx',
    name: 'Suzuki Alto VX (Manual)',
    shortName: 'Alto VX',
    make: 'Suzuki',
    year: '2025',
    engineCC: 660,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 2331000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 699300,
    financedAmount: 1631700,
    maxTenureYears: 5,
    category: 'Entry Hatchback'
  },
  {
    id: 'alto-vxr',
    name: 'Suzuki Alto VXR (Manual)',
    shortName: 'Alto VXR (MT)',
    make: 'Suzuki',
    year: '2025',
    engineCC: 660,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 2994861,
    downpaymentPercent: 0.30,
    downpaymentTarget: 898458,
    financedAmount: 2096403,
    maxTenureYears: 5,
    category: 'Entry Hatchback'
  },
  {
    id: 'alto-vxr-ags',
    name: 'Suzuki Alto VXR AGS (Automatic)',
    shortName: 'Alto VXR AGS',
    make: 'Suzuki',
    year: '2025',
    engineCC: 660,
    transmission: 'Automatic / AGS',
    transmissionType: 'Automatic',
    totalMarketPrice: 3166480,
    downpaymentPercent: 0.30,
    downpaymentTarget: 949944,
    financedAmount: 2216536,
    maxTenureYears: 5,
    category: 'Entry Hatchback'
  },
  {
    id: 'alto-vxl-ags',
    name: 'Suzuki Alto VXL AGS (Automatic)',
    shortName: 'Alto VXL AGS',
    make: 'Suzuki',
    year: '2025',
    engineCC: 660,
    transmission: 'Automatic / AGS',
    transmissionType: 'Automatic',
    totalMarketPrice: 3326446,
    downpaymentPercent: 0.30,
    downpaymentTarget: 997934,
    financedAmount: 2328512,
    maxTenureYears: 5,
    category: 'Entry Hatchback'
  },
  {
    id: 'wagon-r-vxr',
    name: 'Suzuki Wagon R VXR (Manual)',
    shortName: 'Wagon R VXR',
    make: 'Suzuki',
    year: '2025',
    engineCC: 998,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 3214000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 964200,
    financedAmount: 2249800,
    maxTenureYears: 5,
    category: 'Family Hatchback'
  },
  {
    id: 'wagon-r-vxl',
    name: 'Suzuki Wagon R VXL (Manual)',
    shortName: 'Wagon R VXL',
    make: 'Suzuki',
    year: '2025',
    engineCC: 998,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 3412000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1023600,
    financedAmount: 2388400,
    maxTenureYears: 5,
    category: 'Family Hatchback'
  },
  {
    id: 'wagon-r-ags',
    name: 'Suzuki Wagon R AGS (Automatic)',
    shortName: 'Wagon R AGS',
    make: 'Suzuki',
    year: '2025',
    engineCC: 998,
    transmission: 'Automatic / AGS',
    transmissionType: 'Automatic',
    totalMarketPrice: 3741000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1122300,
    financedAmount: 2618700,
    maxTenureYears: 5,
    category: 'Family Hatchback'
  },
  {
    id: 'cultus-vxr',
    name: 'Suzuki Cultus VXR (Manual)',
    shortName: 'Cultus VXR (MT)',
    make: 'Suzuki',
    year: '2025',
    engineCC: 998,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 3858000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1157400,
    financedAmount: 2700600,
    maxTenureYears: 5,
    category: 'Family Hatchback'
  },
  {
    id: 'cultus-vxl',
    name: 'Suzuki Cultus VXL (Manual)',
    shortName: 'Cultus VXL (MT)',
    make: 'Suzuki',
    year: '2025',
    engineCC: 998,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 4359160,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1307748,
    financedAmount: 3051412,
    maxTenureYears: 5,
    category: 'Family Hatchback'
  },
  {
    id: 'cultus-ags',
    name: 'Suzuki Cultus Auto Gear Shift (AGS)',
    shortName: 'Cultus AGS',
    make: 'Suzuki',
    year: '2025',
    engineCC: 998,
    transmission: 'Automatic / AGS',
    transmissionType: 'Automatic',
    totalMarketPrice: 4546000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1363800,
    financedAmount: 3182200,
    maxTenureYears: 5,
    category: 'Family Hatchback'
  },
  {
    id: 'swift-gl-mt',
    name: 'Suzuki Swift GL (Manual)',
    shortName: 'Swift GL (MT)',
    make: 'Suzuki',
    year: '2025',
    engineCC: 1197,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 4460160,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1338048,
    financedAmount: 3122112,
    maxTenureYears: 3, // SBP rule > 1000cc
    category: 'Family Hatchback'
  },
  {
    id: 'swift-gl-cvt',
    name: 'Suzuki Swift GL CVT (Automatic)',
    shortName: 'Swift GL (CVT)',
    make: 'Suzuki',
    year: '2025',
    engineCC: 1197,
    transmission: 'Automatic / CVT',
    transmissionType: 'Automatic',
    totalMarketPrice: 4605600,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1381680,
    financedAmount: 3223920,
    maxTenureYears: 3,
    category: 'Family Hatchback'
  },
  {
    id: 'swift-glx-cvt',
    name: 'Suzuki Swift GLX CVT (Automatic)',
    shortName: 'Swift GLX (CVT)',
    make: 'Suzuki',
    year: '2025',
    engineCC: 1197,
    transmission: 'Automatic / CVT',
    transmissionType: 'Automatic',
    totalMarketPrice: 4766190,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1429857,
    financedAmount: 3336333,
    maxTenureYears: 3,
    category: 'Family Hatchback'
  },

  // ==================== TOYOTA INDUS ====================
  {
    id: 'yaris-13-gli-mt',
    name: 'Toyota Yaris 1.3 GLI (Manual)',
    shortName: 'Yaris GLI (MT)',
    make: 'Toyota',
    year: '2025',
    engineCC: 1329,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 4649000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1394700,
    financedAmount: 3254300,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'yaris-13-gli-cvt',
    name: 'Toyota Yaris 1.3 GLI CVT (Automatic)',
    shortName: 'Yaris GLI (CVT)',
    make: 'Toyota',
    year: '2025',
    engineCC: 1329,
    transmission: 'Automatic / CVT',
    transmissionType: 'Automatic',
    totalMarketPrice: 4809000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1442700,
    financedAmount: 3366300,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'yaris-13-ativ-mt',
    name: 'Toyota Yaris 1.3 ATIV (Manual)',
    shortName: 'Yaris ATIV (MT)',
    make: 'Toyota',
    year: '2025',
    engineCC: 1329,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 4829000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1448700,
    financedAmount: 3380300,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'yaris-13-ativ-cvt',
    name: 'Toyota Yaris 1.3 ATIV CVT (Automatic)',
    shortName: 'Yaris ATIV (CVT)',
    make: 'Toyota',
    year: '2025',
    engineCC: 1329,
    transmission: 'Automatic / CVT',
    transmissionType: 'Automatic',
    totalMarketPrice: 5822000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1746600,
    financedAmount: 4075400,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'yaris-15-ativ-x-cvt',
    name: 'Toyota Yaris 1.5 ATIV X CVT (Automatic)',
    shortName: 'Yaris ATIV X 1.5',
    make: 'Toyota',
    year: '2025',
    engineCC: 1496,
    transmission: 'Automatic / CVT',
    transmissionType: 'Automatic',
    totalMarketPrice: 6049000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1814700,
    financedAmount: 4234300,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'corolla-altis-16-mt',
    name: 'Toyota Corolla Altis 1.6 (Manual)',
    shortName: 'Corolla 1.6 (MT)',
    make: 'Toyota',
    year: '2025',
    engineCC: 1598,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 5969000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1790700,
    financedAmount: 4178300,
    maxTenureYears: 3,
    category: 'Executive Sedan'
  },
  {
    id: 'corolla-altis-16-cvt',
    name: 'Toyota Corolla Altis 1.6 CVT (Automatic)',
    shortName: 'Corolla 1.6 (CVT)',
    make: 'Toyota',
    year: '2025',
    engineCC: 1598,
    transmission: 'Automatic / CVT',
    transmissionType: 'Automatic',
    totalMarketPrice: 6559000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1967700,
    financedAmount: 4591300,
    maxTenureYears: 3,
    category: 'Executive Sedan'
  },

  // ==================== HONDA ATLAS ====================
  {
    id: 'city-12-ls-mt',
    name: 'Honda City 1.2 LS (Manual)',
    shortName: 'City 1.2 (MT)',
    make: 'Honda',
    year: '2025',
    engineCC: 1199,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 4649000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1394700,
    financedAmount: 3254300,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'city-12-ls-cvt',
    name: 'Honda City 1.2 LS CVT (Automatic)',
    shortName: 'City 1.2 (CVT)',
    make: 'Honda',
    year: '2025',
    engineCC: 1199,
    transmission: 'Automatic / CVT',
    transmissionType: 'Automatic',
    totalMarketPrice: 4737000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1421100,
    financedAmount: 3315900,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'city-15-cvt',
    name: 'Honda City 1.5 CVT (Automatic)',
    shortName: 'City 1.5 (CVT)',
    make: 'Honda',
    year: '2025',
    engineCC: 1497,
    transmission: 'Automatic / CVT',
    transmissionType: 'Automatic',
    totalMarketPrice: 5439000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1631700,
    financedAmount: 3807300,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'city-15-aspire-cvt',
    name: 'Honda City 1.5 Aspire CVT (Automatic)',
    shortName: 'City Aspire 1.5',
    make: 'Honda',
    year: '2025',
    engineCC: 1497,
    transmission: 'Automatic / CVT',
    transmissionType: 'Automatic',
    totalMarketPrice: 6069000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1820700,
    financedAmount: 4248300,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'civic-oriel-turbo',
    name: 'Honda Civic Oriel 1.5 VTEC Turbo (Automatic)',
    shortName: 'Civic Oriel Turbo',
    make: 'Honda',
    year: '2025',
    engineCC: 1498,
    transmission: 'Automatic / CVT',
    transmissionType: 'Automatic',
    totalMarketPrice: 8659000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 2597700,
    financedAmount: 6061300,
    maxTenureYears: 3,
    category: 'Executive Sedan'
  },

  // ==================== CHANGAN ====================
  {
    id: 'alsvin-13-mt',
    name: 'Changan Alsvin 1.3L Comfort (Manual)',
    shortName: 'Alsvin 1.3 (MT)',
    make: 'Changan',
    year: '2025',
    engineCC: 1370,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 4189000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1256700,
    financedAmount: 2932300,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'alsvin-15-dct',
    name: 'Changan Alsvin 1.5L Comfort DCT (Automatic)',
    shortName: 'Alsvin 1.5 DCT',
    make: 'Changan',
    year: '2025',
    engineCC: 1480,
    transmission: 'Automatic / DCT',
    transmissionType: 'Automatic',
    totalMarketPrice: 4499000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1349700,
    financedAmount: 3149300,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },
  {
    id: 'alsvin-15-lumiere',
    name: 'Changan Alsvin 1.5L Lumiere DCT (Automatic)',
    shortName: 'Alsvin Lumiere',
    make: 'Changan',
    year: '2025',
    engineCC: 1480,
    transmission: 'Automatic / DCT',
    transmissionType: 'Automatic',
    totalMarketPrice: 4999000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1499700,
    financedAmount: 3499300,
    maxTenureYears: 3,
    category: 'Compact Sedan'
  },

  // ==================== KIA & HYUNDAI ====================
  {
    id: 'kia-picanto-mt',
    name: 'Kia Picanto 1.0 (Manual)',
    shortName: 'Picanto 1.0 (MT)',
    make: 'Kia',
    year: '2024',
    engineCC: 998,
    transmission: 'Manual',
    transmissionType: 'Manual',
    totalMarketPrice: 3600000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1080000,
    financedAmount: 2520000,
    maxTenureYears: 5,
    category: 'Entry Hatchback'
  },
  {
    id: 'kia-picanto-at',
    name: 'Kia Picanto 1.0 (Automatic)',
    shortName: 'Picanto 1.0 (AT)',
    make: 'Kia',
    year: '2024',
    engineCC: 998,
    transmission: 'Automatic',
    transmissionType: 'Automatic',
    totalMarketPrice: 3850000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1155000,
    financedAmount: 2695000,
    maxTenureYears: 5,
    category: 'Entry Hatchback'
  },
  {
    id: 'kia-stonic-ex-plus',
    name: 'Kia Stonic EX+ 1.4 (Automatic)',
    shortName: 'Stonic EX+',
    make: 'Kia',
    year: '2024',
    engineCC: 1368,
    transmission: 'Automatic',
    transmissionType: 'Automatic',
    totalMarketPrice: 4767000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 1430100,
    financedAmount: 3336900,
    maxTenureYears: 3,
    category: 'Crossover'
  },
  {
    id: 'hyundai-elantra-16',
    name: 'Hyundai Elantra 1.6 GL (Automatic)',
    shortName: 'Elantra 1.6',
    make: 'Hyundai',
    year: '2024',
    engineCC: 1591,
    transmission: 'Automatic',
    transmissionType: 'Automatic',
    totalMarketPrice: 6930000,
    downpaymentPercent: 0.30,
    downpaymentTarget: 2079000,
    financedAmount: 4851000,
    maxTenureYears: 3,
    category: 'Executive Sedan'
  }
];

export const getCarPresetByName = (name: string): CarPreset => {
  const clean = name.toLowerCase().trim();
  const match = PAKISTANI_CAR_PRESETS.find(
    (c) => clean.includes(c.id) || clean.includes(c.shortName.toLowerCase()) || c.name.toLowerCase().includes(clean)
  );
  return match || PAKISTANI_CAR_PRESETS[3]; // Default to Alto VXL AGS if not found
};

export const getCarPresetsByMake = (make: CarMake | 'All'): CarPreset[] => {
  if (make === 'All') return PAKISTANI_CAR_PRESETS;
  return PAKISTANI_CAR_PRESETS.filter((c) => c.make === make);
};

export const searchCars = (query: string): CarPreset[] => {
  const clean = query.toLowerCase().trim();
  if (!clean) return PAKISTANI_CAR_PRESETS;
  return PAKISTANI_CAR_PRESETS.filter(
    (c) =>
      c.name.toLowerCase().includes(clean) ||
      c.shortName.toLowerCase().includes(clean) ||
      c.make.toLowerCase().includes(clean) ||
      c.transmission.toLowerCase().includes(clean)
  );
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
