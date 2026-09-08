import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPKR, formatLacs, formatInputCommas, parseInputCommas } from '../utils/formatters';
import { 
  PAKISTANI_CAR_PRESETS, 
  CAR_MAKES, 
  CarMake, 
  CarPreset, 
  calculateAutoEMI 
} from '../utils/carPresets';
import { 
  X, 
  Calculator, 
  Car, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Search,
  Sparkles,
  Info,
  Sliders,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFinancingInquiry?: () => void;
}

type FilterTab = 'All' | CarMake | 'Custom';

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  onOpenFinancingInquiry
}) => {
  const { carGoal } = useFinance();

  // Active brand filter tab
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Find default preset matching current carGoal or Alto VXL
  const defaultPreset = useMemo(() => {
    return PAKISTANI_CAR_PRESETS.find(c => 
      carGoal.carName.toLowerCase().includes(c.shortName.toLowerCase()) || 
      c.name.toLowerCase().includes(carGoal.carName.toLowerCase())
    ) || PAKISTANI_CAR_PRESETS[3]; // Alto VXL AGS default
  }, [carGoal.carName]);

  const [selectedCarId, setSelectedCarId] = useState<string>(defaultPreset.id);

  // Custom Car entry states
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customCarName, setCustomCarName] = useState<string>('Custom Car / Other Model');
  const [customPriceStr, setCustomPriceStr] = useState<string>('4,500,000');
  const [customTransmission, setCustomTransmission] = useState<'Manual' | 'Automatic'>('Automatic');
  const [customEngineAbove1000, setCustomEngineAbove1000] = useState<boolean>(true);

  // Loan parameters
  const [downpaymentRatio, setDownpaymentRatio] = useState<number>(0.30); // 30% default (SBP min)
  const [tenureYears, setTenureYears] = useState<number>(3); // 3 Years default

  // Selected vehicle details
  const currentPreset = PAKISTANI_CAR_PRESETS.find(c => c.id === selectedCarId);

  // Determine active specs
  const activeCarName = isCustomMode ? customCarName : (currentPreset?.name || 'Vehicle');
  const activeTransmission = isCustomMode ? customTransmission : (currentPreset?.transmission || 'Manual');
  const activeEngineCC = isCustomMode ? (customEngineAbove1000 ? 1500 : 1000) : (currentPreset?.engineCC || 660);
  const isAbove1000cc = activeEngineCC > 1000;
  const maxAllowedTenure = isAbove1000cc ? 3 : 5;

  // Enforce SBP max tenure constraint: if car > 1000cc, tenure cannot exceed 3 years
  React.useEffect(() => {
    if (isAbove1000cc && tenureYears > 3) {
      setTenureYears(3);
    }
  }, [isAbove1000cc, tenureYears]);

  // Filtered presets
  const filteredPresets = useMemo(() => {
    let list = PAKISTANI_CAR_PRESETS;
    if (activeTab !== 'All' && activeTab !== 'Custom') {
      list = list.filter(c => c.make === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.make.toLowerCase().includes(q) ||
        c.transmission.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, searchQuery]);

  if (!isOpen) return null;

  // Pricing calculations
  const totalCarPrice = isCustomMode
    ? parseInputCommas(customPriceStr) || 4500000
    : currentPreset?.totalMarketPrice || 3045000;

  const downpaymentAmount = Math.round(totalCarPrice * downpaymentRatio);
  const financedLoanAmount = Math.max(0, totalCarPrice - downpaymentAmount);
  const estimatedMonthlyEMI = calculateAutoEMI(financedLoanAmount, tenureYears);
  const totalRepaymentOverTenure = estimatedMonthlyEMI * (tenureYears * 12);
  const estimatedTotalMarkup = Math.max(0, totalRepaymentOverTenure - financedLoanAmount);

  const tenureOptions = [
    { years: 1, months: 12, label: '1 Year' },
    { years: 2, months: 24, label: '2 Years' },
    { years: 3, months: 36, label: '3 Years', tag: 'Most Popular' },
    { years: 4, months: 48, label: '4 Years', restricted: isAbove1000cc },
    { years: 5, months: 60, label: '5 Years', tag: isAbove1000cc ? 'Restricted' : 'Max for ≤1000cc', restricted: isAbove1000cc }
  ];

  const downpaymentRatios = [
    { label: '20%', value: 0.20, note: 'Special Bank Schemes' },
    { label: '30%', value: 0.30, note: 'SBP Minimum' },
    { label: '40%', value: 0.40, note: 'Lower Monthly EMI' },
    { label: '50%', value: 0.50, note: 'Minimal Profit' }
  ];

  const brandTabs: FilterTab[] = ['All', 'Suzuki', 'Toyota', 'Honda', 'Changan', 'Kia', 'Hyundai', 'Custom'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-emerald-500/30 text-white shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[94vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3 mb-4 shrink-0 pr-8">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
                Auto Lease & Monthly EMI Calculator
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Pakistan Banking Standards
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore 24+ official Pakistani car variants or enter your own custom car to calculate monthly bank lease installments.
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          
          {/* Top Brand Filter Tabs & Search */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1. Select Make or Enter Custom Vehicle
              </label>
              {isCustomMode && (
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Custom Mode Active
                </span>
              )}
            </div>

            {/* Brand tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {brandTabs.map((tab) => {
                const isActive = tab === 'Custom' ? isCustomMode : (!isCustomMode && activeTab === tab);
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      if (tab === 'Custom') {
                        setIsCustomMode(true);
                      } else {
                        setIsCustomMode(false);
                        setActiveTab(tab);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? tab === 'Custom'
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                          : 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {tab === 'Custom' ? '✏️ Custom / Other Car' : tab}
                  </button>
                );
              })}
            </div>

            {/* Presets Grid OR Custom Vehicle Form */}
            {!isCustomMode ? (
              <div>
                {/* Search Bar for Cars */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by variant, manual/automatic (e.g. Alto VXL, Yaris CVT, AGS, City MT)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Cars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-950/40 rounded-2xl border border-white/5">
                  {filteredPresets.map((car) => {
                    const isSelected = selectedCarId === car.id;
                    const isManual = car.transmissionType === 'Manual';

                    return (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => setSelectedCarId(car.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-md shadow-emerald-500/10'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-black text-xs text-white truncate">
                              {car.name}
                            </span>
                          </div>

                          {/* Transmission and Engine Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            {/* Transmission tag */}
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                isManual
                                  ? 'bg-slate-700/70 text-slate-200 border border-slate-600/60'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              ⚙️ {car.transmission}
                            </span>

                            {/* Engine CC */}
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                              {car.engineCC}cc
                            </span>

                            {/* SBP Tenure limit */}
                            <span className="text-[9px] font-semibold text-slate-400">
                              Max {car.maxTenureYears}y
                            </span>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                          <span className="text-white font-bold font-mono">
                            {formatLacs(car.totalMarketPrice)}
                          </span>
                          <span className="text-emerald-300/80 font-mono">
                            30%: {formatLacs(car.downpaymentTarget)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Custom Car Form Card */
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/40 space-y-3">
                <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold uppercase">
                  <Car className="w-4 h-4 text-cyan-400" />
                  <span>Custom Car / Other Vehicle Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Car Name */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                      Vehicle Name / Model
                    </label>
                    <input
                      type="text"
                      value={customCarName}
                      onChange={(e) => setCustomCarName(e.target.value)}
                      placeholder="e.g. Toyota Corolla GLi, Kia Sportage..."
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Market Price */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Total Market Price (PKR ₨)
                      </label>
                      <span className="text-[10px] text-cyan-400 font-bold font-mono">
                        {formatLacs(parseInputCommas(customPriceStr))}
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-cyan-400">₨</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={customPriceStr}
                        onChange={(e) => setCustomPriceStr(formatInputCommas(e.target.value))}
                        placeholder="4,500,000"
                        className="w-full pl-7 pr-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Transmission & Engine Capacity Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Transmission Selector */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                      Transmission
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomTransmission('Manual')}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          customTransmission === 'Manual'
                            ? 'bg-slate-700 text-white border-slate-500'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        ⚙️ Manual (MT)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomTransmission('Automatic')}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          customTransmission === 'Automatic'
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        ⚡ Auto / CVT / AGS
                      </button>
                    </div>
                  </div>

                  {/* Engine CC / SBP Category */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                      Engine Displacement (SBP Rule)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomEngineAbove1000(false)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                          !customEngineAbove1000
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        ≤ 1000cc (5y Max)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomEngineAbove1000(true)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                          customEngineAbove1000
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        &gt; 1000cc (3y SBP Cap)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SBP Regulation Alert Badge */}
          <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start space-x-2 ${
            isAbove1000cc 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            {isAbove1000cc ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            )}
            <div>
              <strong>
                {isAbove1000cc 
                  ? `SBP 3-Year Tenure Rule (${activeEngineCC}cc):` 
                  : `SBP 5-Year Tenure Approved (${activeEngineCC}cc):`}
              </strong>{' '}
              {isAbove1000cc
                ? 'Under State Bank of Pakistan consumer financing regulations, vehicles above 1000cc are legally restricted to a maximum tenure of 3 Years (36 Months).'
                : 'Vehicles with engine displacement of 1000cc or less (e.g. Alto, Cultus, Wagon R, Picanto) are eligible for extended financing up to 5 Years (60 Months).'}
            </div>
          </div>

          {/* Section 2: Downpayment & Tenure Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Downpayment Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  2. Cash Downpayment
                </label>
                <span className="text-xs text-emerald-400 font-bold font-mono">
                  {formatPKR(downpaymentAmount)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {downpaymentRatios.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDownpaymentRatio(d.value)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all ${
                      downpaymentRatio === d.value
                        ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-xs font-bold">{d.label}</div>
                    <div className={`text-[8px] font-medium truncate ${
                      downpaymentRatio === d.value ? 'text-slate-900 font-semibold' : 'text-slate-400'
                    }`}>
                      {d.value === 0.30 ? 'SBP Min' : `${(d.value * 100)}%`}
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-slate-400 text-right">
                Target: {formatLacs(downpaymentAmount)} in cash
              </div>
            </div>

            {/* Tenure Duration Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. Lease Tenure</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {tenureYears * 12} Installments
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {tenureOptions.map((t) => {
                  const isSelected = tenureYears === t.years;
                  const isRestricted = t.restricted;

                  return (
                    <button
                      key={t.years}
                      type="button"
                      disabled={isRestricted}
                      onClick={() => !isRestricted && setTenureYears(t.years)}
                      title={isRestricted ? 'Restricted by SBP for >1000cc vehicles' : `${t.months} Monthly installments`}
                      className={`p-1.5 rounded-xl border text-center transition-all ${
                        isRestricted
                          ? 'opacity-30 bg-slate-900 border-white/5 text-slate-600 cursor-not-allowed'
                          : isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-black shadow-md shadow-emerald-500/10'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-bold">{t.label}</div>
                      <div className="text-[8px] text-slate-400">{t.months}m</div>
                      {t.tag && !isRestricted && (
                        <div className="text-[7px] text-emerald-400 font-bold truncate">
                          {t.tag === 'Most Popular' ? 'Popular' : 'Max'}
                        </div>
                      )}
                      {isRestricted && (
                        <div className="text-[7px] text-amber-400 font-bold truncate">
                          SBP Cap
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="text-[10px] text-slate-400 text-right">
                Max allowed: {maxAllowedTenure} Years
              </div>
            </div>

          </div>

          {/* Results Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-950 to-slate-900 border border-emerald-500/40 shadow-xl">
            {/* Selected vehicle title */}
            <div className="flex flex-wrap items-center justify-between pb-2 border-b border-white/10 gap-2 mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Vehicle Configuration
                </span>
                <span className="text-sm font-black text-white">
                  {activeCarName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {activeTransmission}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                  {activeEngineCC}cc
                </span>
              </div>
            </div>

            {/* Main EMI Figure */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Estimated Monthly Installment (EMI)
                </span>
                <div className="text-3xl sm:text-4xl font-black font-heading text-emerald-400">
                  ~{formatPKR(estimatedMonthlyEMI)}
                  <span className="text-xs font-semibold text-emerald-300/80"> / month</span>
                </div>
                <div className="text-[10px] text-emerald-300/70 mt-0.5">
                  Includes ~18–19% p.a. markup + 2% p.a. Takaful / Insurance coverage
                </div>
              </div>

              <div className="sm:text-right bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">
                  Financed Bank Facility ({(100 - downpaymentRatio * 100).toFixed(0)}%)
                </span>
                <span className="text-base font-black text-white font-mono">
                  {formatPKR(financedLoanAmount)}
                </span>
                <div className="text-[10px] text-slate-400 font-mono">
                  {formatLacs(financedLoanAmount)} total loan
                </div>
              </div>
            </div>

            {/* Financial Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 pt-3">
              <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Ex-Factory / Market</span>
                <strong className="text-white font-mono">{formatPKR(totalCarPrice)}</strong>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Your Downpayment</span>
                <strong className="text-cyan-300 font-mono">{formatPKR(downpaymentAmount)}</strong>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Tenure Duration</span>
                <strong className="text-emerald-300">{tenureYears} Yrs ({tenureYears * 12} Mo)</strong>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Est. Total Markup</span>
                <strong className="text-amber-300 font-mono">~{formatPKR(estimatedTotalMarkup)}</strong>
              </div>
            </div>

            {/* IMPORTANT DISCLAIMER NOTICE */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed flex items-start space-x-2.5 mt-3">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <strong className="font-bold text-amber-200 block mb-0.5">
                  Important Bank Quotation Disclaimer:
                </strong>
                These monthly installments are <strong>preliminary market estimations</strong> for budgeting purposes. <strong>Actual monthly installments will be officially calculated by the financing bank</strong> (e.g. Meezan Bank Car Ijarah, Bank Alfalah, etc.) upon submission of your application. Real quotations will vary depending on floating/fixed KIBOR rate shifts, bank-specific processing fees, value-added takaful packages, and client credit profile.
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 shrink-0 flex flex-col sm:flex-row gap-2.5">
          {onOpenFinancingInquiry && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFinancingInquiry();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Check Bank Eligibility & Apply via WhatsApp Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
          >
            Close Calculator
          </button>
        </div>

      </motion.div>
    </div>
  );
};
