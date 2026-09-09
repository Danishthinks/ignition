import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { formatPKR, formatLacs, formatInputCommas, parseInputCommas } from '../utils/formatters';
import { 
  X, 
  Building2, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Send,
  ShieldCheck,
  Sparkles,
  Clock,
  ShieldAlert,
  AlertTriangle,
  UserCheck,
  BadgePercent,
  Users,
  FileCheck,
  Car,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  PAKISTANI_CAR_PRESETS, 
  CAR_MAKES, 
  getCarPresetByName, 
  calculateAutoEMI 
} from '../utils/carPresets';

// Official WhatsApp Lead Number for the Creator / Auto Financing Desk
export const OFFICIAL_WHATSAPP_NUMBER = '923134216028';
export const DISPLAY_WHATSAPP_NUMBER = '+92 313 4216028';

interface FinancingInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCarId?: string;
  onOpenDossier?: () => void;
}

export interface FinancingLead {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  monthlySalary: number;
  hasCoApplicant: boolean;
  coApplicantSalary?: number;
  coApplicantRelation?: string;
  totalHouseholdIncome: number;
  dbrRatio: number;
  isPreQualified: boolean;
  employmentType: string;
  preferredBank: string;
  carName: string;
  downpaymentSaved: number;
  downpaymentRatio: number;
  downpaymentAmount: number;
  financedLoanAmount: number;
  financedPercent: number;
  tenureYears: number;
  estimatedMonthlyInstallment: number;
  checkDownpayment: boolean;
  checkBankStatement: boolean;
  checkJobTenure: boolean;
  checkCleanCIB: boolean;
  submittedAt: string;
}

export const FinancingInquiryModal: React.FC<FinancingInquiryModalProps> = ({
  isOpen,
  onClose,
  initialCarId,
  onOpenDossier
}) => {
  const { carGoal } = useFinance();
  const { currentUser, isPro } = useAuth();

  // Find the primary vehicle for which user is saving
  const goalPreset = useMemo(() => getCarPresetByName(carGoal.carName), [carGoal.carName]);

  // Selected vehicle for the financing check (defaults to target car being saved for)
  const [selectedCarId, setSelectedCarId] = useState<string>(goalPreset.id);

  // Sync on modal open or when initialCarId changes
  useEffect(() => {
    if (isOpen) {
      if (initialCarId) {
        const found = PAKISTANI_CAR_PRESETS.find(c => c.id === initialCarId);
        if (found) {
          setSelectedCarId(found.id);
          return;
        }
      }
      // Default directly to the target car for which savings are being done!
      setSelectedCarId(goalPreset.id);
    }
  }, [isOpen, initialCarId, goalPreset.id]);

  // Active vehicle preset object
  const carPreset = useMemo(() => {
    return PAKISTANI_CAR_PRESETS.find(c => c.id === selectedCarId) || goalPreset;
  }, [selectedCarId, goalPreset]);

  const isAbove1000cc = carPreset.engineCC > 1000;
  const isTargetCar = carPreset.id === goalPreset.id;

  // Form inputs
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [salaryStr, setSalaryStr] = useState('180,000');
  const [employmentType, setEmploymentType] = useState('Salaried Individual');
  const [preferredBank, setPreferredBank] = useState('Meezan Bank Car Ijarah (Fast-Track Partner)');
  const [tenureYears, setTenureYears] = useState<number>(3); // 3 Years standard default

  // Flexible Downpayment (defaults to 30% SBP minimum, but flexible: 30%, 35%, 40%, 50%, 60%, or custom PKR)
  const [downpaymentRatio, setDownpaymentRatio] = useState<number>(0.30);
  const [isCustomDownpayment, setIsCustomDownpayment] = useState<boolean>(false);
  const [customDownpaymentStr, setCustomDownpaymentStr] = useState<string>('');

  // Co-Applicant (for applicants needing additional income to pass SBP DBR)
  const [hasCoApplicant, setHasCoApplicant] = useState<boolean>(false);
  const [coApplicantSalaryStr, setCoApplicantSalaryStr] = useState<string>('80,000');
  const [coApplicantRelation, setCoApplicantRelation] = useState<string>('Spouse');

  // 4-Point Bank Pre-Qualification Checklist
  const [checkDownpayment, setCheckDownpayment] = useState<boolean>(true);
  const [checkBankStatement, setCheckBankStatement] = useState<boolean>(true);
  const [checkJobTenure, setCheckJobTenure] = useState<boolean>(true);
  const [checkCleanCIB, setCheckCleanCIB] = useState<boolean>(true);

  const [submitted, setSubmitted] = useState(false);

  // SBP rule enforcement: car > 1000cc capped at 3 years
  useEffect(() => {
    if (isAbove1000cc && tenureYears > 3) {
      setTenureYears(3);
    }
  }, [isAbove1000cc, tenureYears]);

  if (!isOpen) return null;

  const totalMarketPrice = carPreset.totalMarketPrice;
  const sbpMinDownpayment = Math.round(totalMarketPrice * 0.30);

  // Active downpayment amount & percentage
  const activeDownpaymentAmount = isCustomDownpayment
    ? (() => {
        const parsed = parseInputCommas(customDownpaymentStr);
        if (!parsed || isNaN(parsed)) return sbpMinDownpayment;
        return Math.min(totalMarketPrice, Math.max(sbpMinDownpayment, parsed));
      })()
    : Math.round(totalMarketPrice * downpaymentRatio);

  const activeDownpaymentPercent = Math.round((activeDownpaymentAmount / totalMarketPrice) * 100);
  const financedLoanAmount = Math.max(0, totalMarketPrice - activeDownpaymentAmount);
  const financedPercent = Math.max(0, 100 - activeDownpaymentPercent);
  const estimatedEMI = calculateAutoEMI(financedLoanAmount, tenureYears);

  // Income calculations
  const primarySalary = parseInputCommas(salaryStr) || 0;
  const coSalary = hasCoApplicant ? (parseInputCommas(coApplicantSalaryStr) || 0) : 0;
  const totalVerifiedIncome = primarySalary + coSalary;

  // SBP Debt Burden Ratio (DBR) calculations
  // SBP max allowed DBR is 40% (or max 50% for high-income segments)
  const minSalaryRequired40 = Math.round(estimatedEMI / 0.40);
  const minSalaryRequired50 = Math.round(estimatedEMI / 0.50);

  const dbrPercent = totalVerifiedIncome > 0 
    ? (estimatedEMI / totalVerifiedIncome) * 100 
    : 100;

  const isDbrPassed = dbrPercent <= 40;
  const isDbrBorderline = dbrPercent > 40 && dbrPercent <= 50;
  const isDbrFailed = dbrPercent > 50;

  const allChecksPassed = checkDownpayment && checkBankStatement && checkJobTenure && checkCleanCIB;
  const is100PercentQualified = (isDbrPassed || isDbrBorderline) && allChecksPassed;

  const downpaymentOptions = [
    { ratio: 0.30, label: '30%', tag: 'SBP Min', desc: '70% Financed' },
    { ratio: 0.35, label: '35%', tag: '', desc: '65% Financed' },
    { ratio: 0.40, label: '40%', tag: 'Popular', desc: '60% Financed (Lower EMI)' },
    { ratio: 0.50, label: '50%', tag: '50/50', desc: '50% Financed (Half Down)' },
    { ratio: 0.60, label: '60%', tag: 'Low Profit', desc: '40% Financed (Minimal Markup)' }
  ];

  const tenureOptions = [
    { years: 1, months: 12, label: '1 Year' },
    { years: 2, months: 24, label: '2 Years' },
    { years: 3, months: 36, label: '3 Years', tag: 'Popular' },
    { years: 4, months: 48, label: '4 Years', restricted: isAbove1000cc },
    { years: 5, months: 60, label: '5 Years', tag: isAbove1000cc ? 'Restricted' : 'Max for ≤1000cc', restricted: isAbove1000cc }
  ];

  const pakCities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
    'Quetta',
    'Other City'
  ];

  const fastTrackBanks = [
    {
      value: 'Meezan Bank Car Ijarah (Fast-Track Partner)',
      label: '⭐ Meezan Bank Car Ijarah — Fast-Track Partner (Islamic)',
      bold: true
    },
    {
      value: 'Bank Alfalah Auto Loan (Fast-Track Partner)',
      label: '⭐ Bank Alfalah Auto Loan — Fast-Track Partner (Conventional)',
      bold: true
    }
  ];

  const standardBanks = [
    'Faysal Bank Islami Auto Finance',
    'BankIslami Car Financing',
    'Habib Metro Auto Finance',
    'MCB Islamic Car Ijarah',
    'Any Bank with Lowest Markup Rate'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    const newLead: FinancingLead = {
      id: 'lead-' + Date.now(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      city,
      monthlySalary: primarySalary,
      hasCoApplicant,
      coApplicantSalary: hasCoApplicant ? coSalary : undefined,
      coApplicantRelation: hasCoApplicant ? coApplicantRelation : undefined,
      totalHouseholdIncome: totalVerifiedIncome,
      dbrRatio: Math.round(dbrPercent * 10) / 10,
      isPreQualified: is100PercentQualified,
      employmentType,
      preferredBank,
      carName: carPreset.name,
      downpaymentSaved: carGoal.currentAmount,
      downpaymentRatio: activeDownpaymentPercent / 100,
      downpaymentAmount: activeDownpaymentAmount,
      financedLoanAmount,
      financedPercent,
      tenureYears,
      estimatedMonthlyInstallment: estimatedEMI,
      checkDownpayment,
      checkBankStatement,
      checkJobTenure,
      checkCleanCIB,
      submittedAt: new Date().toISOString()
    };

    // Save lead to local storage
    const existing = localStorage.getItem('ignition_financing_leads');
    const leads: FinancingLead[] = existing ? JSON.parse(existing) : [];
    leads.unshift(newLead);
    localStorage.setItem('ignition_financing_leads', JSON.stringify(leads));

    // Construct Grade-A 100% Pre-Qualified WhatsApp Message for Desk & RO
    const leadTier = is100PercentQualified ? '⭐ GRADE A (100% BANK-READY)' : '⚠️ CONDITIONAL (REQUIRES REVIEW)';
    const turboTag = isPro ? '⚡ IGNITION TURBO VIP APPLICANT (DIRECT BRANCH RO DESK)' : 'STANDARD INQUIRY';
    const dbrStatus = isDbrPassed 
      ? `PASSED SBP 40% LIMIT (${dbrPercent.toFixed(1)}%)` 
      : isDbrBorderline 
        ? `BORDERLINE 40-50% (${dbrPercent.toFixed(1)}%)` 
        : `EXCEEDS SBP LIMIT (${dbrPercent.toFixed(1)}%)`;

    const message = `*🏎️ IGNITION PRE-QUALIFIED AUTO FINANCING LEAD*
---------------------------------------
*Lead Status:* ${leadTier}
*Priority Tier:* ${turboTag}
*Applicant Name:* ${newLead.fullName}
*WhatsApp Contact:* ${newLead.phone}
*City:* ${newLead.city}
*Employment:* ${newLead.employmentType}
*Target Vehicle:* ${carPreset.name} (${carPreset.engineCC}cc, ${carPreset.transmission})
*Total Ex-Factory Price:* ${formatPKR(totalMarketPrice)}
*Selected Downpayment:* ${formatPKR(activeDownpaymentAmount)} (${activeDownpaymentPercent}% Downpayment) - ${checkDownpayment ? 'CONFIRMED READY' : 'In Progress'}
*Bank Financed Capital:* ${formatPKR(financedLoanAmount)} (${financedPercent}% Islamic Lease / Ijarah)
*Savings Balance in App:* ${formatPKR(carGoal.currentAmount)}
*Tenure Requested:* ${tenureYears} Years (${tenureYears * 12} Months)
*Est. Monthly Installment (EMI):* ~${formatPKR(estimatedEMI)} / month
---------------------------------------
*FINANCIAL PRE-QUALIFICATION & SBP METRICS:*
• Primary Monthly Income: ${formatPKR(primarySalary)}${hasCoApplicant ? `\n• Co-Applicant (${coApplicantRelation}) Income: ${formatPKR(coSalary)}\n• Total Verifiable Income: ${formatPKR(totalVerifiedIncome)}` : ''}
• Min SBP Salary Required: ${formatPKR(minSalaryRequired40)} / mo
• SBP Debt Burden Ratio (DBR): ${dbrStatus}
• Salary Credited to Bank: ${checkBankStatement ? 'YES (Official Statement Available)' : 'NO'}
• Job Tenure (6m+ / 2y+): ${checkJobTenure ? 'YES (Confirmed)' : 'NO'}
• Credit History (e-CIB): ${checkCleanCIB ? 'CLEAN (No Defaults)' : 'HAS PAST OVERDUE'}
• Preferred Bank: ${newLead.preferredBank}
---------------------------------------
_Verified via IGNITION SBP Pre-Qualification Engine_
_Forward directly to Bank Relationship Officer (RO)_`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${OFFICIAL_WHATSAPP_NUMBER}&text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-emerald-500/40 text-white shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[94vh] flex flex-col"
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3 mb-4 shrink-0 pr-8">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
                100% Pre-Qualified Auto Financing
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950 uppercase shadow-sm">
                SBP DBR VERIFIED
              </span>
              {isPro && onOpenDossier && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDossier();
                  }}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                >
                  <FileCheck className="w-3 h-3" />
                  <span>TURBO Credit Dossier</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Check eligibility for your target savings car or switch to any eligible Pakistani model.
            </p>
          </div>
        </div>

        {/* Vehicle Selection & Context Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950/90 to-slate-900 border border-emerald-500/30 mb-4 space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-emerald-400" />
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Select Vehicle for Financing Check
              </label>
            </div>

            {/* Quick Button to Reset to Target Savings Car */}
            {!isTargetCar && (
              <button
                type="button"
                onClick={() => setSelectedCarId(goalPreset.id)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-all flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
              >
                <Target className="w-3 h-3 text-cyan-400" />
                <span>Reset to My Savings Goal ({goalPreset.shortName})</span>
              </button>
            )}
          </div>

          {/* Vehicle Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 focus:border-emerald-400 text-xs text-white font-bold outline-none cursor-pointer"
            >
              {CAR_MAKES.map((make) => {
                const carsInMake = PAKISTANI_CAR_PRESETS.filter(c => c.make === make);
                if (!carsInMake.length) return null;
                return (
                  <optgroup key={make} label={`🚘 ${make.toUpperCase()}`} className="bg-slate-900 text-emerald-400 font-bold">
                    {carsInMake.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white font-medium py-1">
                        {c.name} — {formatLacs(c.totalMarketPrice)} (30% Down: {formatLacs(c.downpaymentTarget)})
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          {/* Selected Vehicle Specs Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                carPreset.transmissionType === 'Manual'
                  ? 'bg-slate-700 text-slate-200 border border-slate-600'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {carPreset.transmission}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 text-[9px] font-mono border border-white/10">
                {carPreset.engineCC}cc
              </span>
              {isTargetCar ? (
                <span className="text-[10px] text-cyan-400 font-bold flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>Your Savings Goal Vehicle</span>
                </span>
              ) : (
                <span className="text-[10px] text-amber-300 font-medium">
                  Alternative Model Checked
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div>
                <span className="text-slate-400 text-[10px]">Price: </span>
                <strong className="text-white font-mono">{formatLacs(totalMarketPrice)}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">{activeDownpaymentPercent}% Down: </span>
                <strong className="text-cyan-400 font-mono">{formatLacs(activeDownpaymentAmount)}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">{financedPercent}% Bank: </span>
                <strong className="text-emerald-400 font-mono">{formatLacs(financedLoanAmount)}</strong>
              </div>
            </div>
          </div>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-12 text-center space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-heading font-black text-white">
              100% Pre-Qualified Lead Generated!
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Your verified application and SBP credit scorecard have been prepared for <strong>{DISPLAY_WHATSAPP_NUMBER}</strong>. WhatsApp has opened in a new tab.
            </p>
          </motion.div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 space-y-4 flex-1">
            
            {/* Applicant Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Full Name (As on CNIC)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Bilal Ahmed"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-emerald-400 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  WhatsApp Contact
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-emerald-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    required
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-emerald-400 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-emerald-400 text-xs text-white outline-none"
                  >
                    {pakCities.map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Employment & Monthly Income Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-emerald-400 text-xs text-white outline-none"
                >
                  <option value="Salaried Individual" className="bg-slate-900 text-white">Salaried Individual (Direct Bank Transfer)</option>
                  <option value="Self-Employed / Freelancer" className="bg-slate-900 text-white">Self-Employed / Freelancer (Active Account)</option>
                  <option value="Business Owner / Trader" className="bg-slate-900 text-white">Business Owner / Trader (Registered NTN)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Net Monthly Take-Home Salary (PKR ₨)
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    {formatLacs(primarySalary)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-emerald-400">₨</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={salaryStr}
                    onChange={(e) => setSalaryStr(formatInputCommas(e.target.value))}
                    placeholder="180,000"
                    required
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-emerald-400 text-xs font-bold text-white outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Co-Applicant Income Section (For boosting qualification) */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">
                    Add Co-Borrower / Family Income? (Spouse / Parent / Sibling)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasCoApplicant(!hasCoApplicant)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    hasCoApplicant 
                      ? 'bg-cyan-500 text-slate-950 font-black' 
                      : 'bg-white/10 text-slate-300 hover:bg-white/15'
                  }`}
                >
                  {hasCoApplicant ? '✓ Added' : '+ Add Co-Applicant'}
                </button>
              </div>

              {hasCoApplicant && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                      Co-Borrower Relationship
                    </label>
                    <select
                      value={coApplicantRelation}
                      onChange={(e) => setCoApplicantRelation(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                    >
                      <option value="Spouse (Wife/Husband)">Spouse (Wife / Husband)</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother / Sister">Brother / Sister</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                      Co-Applicant Monthly Income (PKR ₨)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1.5 text-xs font-bold text-cyan-400">₨</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={coApplicantSalaryStr}
                        onChange={(e) => setCoApplicantSalaryStr(formatInputCommas(e.target.value))}
                        className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Flexible Downpayment & Equity Contribution Selector */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-emerald-500/25 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center space-x-2">
                  <BadgePercent className="w-4 h-4 text-emerald-400" />
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Downpayment & Own Equity Contribution
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {activeDownpaymentPercent}% ({formatLacs(activeDownpaymentAmount)})
                  </span>
                  <span className="text-[10px] text-slate-400">
                    • Bank: {financedPercent}% ({formatLacs(financedLoanAmount)})
                  </span>
                </div>
              </div>

              {/* Downpayment Ratio Pill Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {downpaymentOptions.map((opt) => {
                  const isSelected = !isCustomDownpayment && downpaymentRatio === opt.ratio;
                  return (
                    <button
                      key={opt.ratio}
                      type="button"
                      onClick={() => {
                        setIsCustomDownpayment(false);
                        setDownpaymentRatio(opt.ratio);
                      }}
                      className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black shadow-md shadow-cyan-500/10'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[8px] text-slate-400 truncate">
                        {opt.tag || opt.desc}
                      </div>
                    </button>
                  );
                })}

                {/* Custom Downpayment Pill Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomDownpayment(true);
                    if (!customDownpaymentStr) {
                      setCustomDownpaymentStr(formatInputCommas(activeDownpaymentAmount.toString()));
                    }
                  }}
                  className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isCustomDownpayment
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-black shadow-md shadow-emerald-500/10'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold">Custom ₨</div>
                  <div className="text-[8px] text-slate-400 truncate">
                    {isCustomDownpayment ? `${activeDownpaymentPercent}%` : 'Enter PKR'}
                  </div>
                </button>
              </div>

              {/* Custom Input Field when Custom is selected */}
              {isCustomDownpayment && (
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Enter Cash Downpayment (SBP Min: 30% = {formatPKR(sbpMinDownpayment)}):</span>
                    <span className="text-cyan-300 font-bold font-mono">
                      {activeDownpaymentPercent}% of car value
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-cyan-400">₨</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customDownpaymentStr}
                      onChange={(e) => setCustomDownpaymentStr(formatInputCommas(e.target.value))}
                      placeholder={formatInputCommas(sbpMinDownpayment.toString())}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/40 focus:border-emerald-400 text-xs font-mono font-bold text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Equity Helper Tip */}
              <div className="text-[10px] text-slate-400 pt-0.5 flex flex-wrap items-center justify-between gap-1">
                <span>
                  💡 <strong>Tip:</strong> Paying more than 30% downpayment reduces your monthly installment and makes passing SBP 40% DBR much easier!
                </span>
                {activeDownpaymentPercent > 30 && (
                  <span className="text-emerald-400 font-bold">
                    +{activeDownpaymentPercent - 30}% Extra Equity Applied
                  </span>
                )}
              </div>
            </div>

            {/* SBP Tenure Duration Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lease Tenure & SBP Regulations</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {tenureYears * 12} Installments
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {tenureOptions.map((t) => {
                  const isRestricted = t.restricted;
                  return (
                    <button
                      key={t.years}
                      type="button"
                      disabled={isRestricted}
                      onClick={() => !isRestricted && setTenureYears(t.years)}
                      className={`p-1.5 rounded-xl border text-center transition-all ${
                        isRestricted
                          ? 'opacity-30 bg-slate-900 border-white/5 text-slate-600 cursor-not-allowed'
                          : tenureYears === t.years
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
            </div>

            {/* REAL-TIME SBP DBR PRE-QUALIFICATION SCORECARD */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isDbrPassed
                ? 'bg-gradient-to-br from-emerald-950/70 via-slate-950 to-slate-900 border-emerald-500/50'
                : isDbrBorderline
                  ? 'bg-gradient-to-br from-amber-950/60 via-slate-950 to-slate-900 border-amber-500/50'
                  : 'bg-gradient-to-br from-rose-950/60 via-slate-950 to-slate-900 border-rose-500/50'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Estimated Monthly Installment ({financedPercent}% Lease / Ijarah)
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-emerald-400">
                    ~{formatPKR(estimatedEMI)}
                    <span className="text-xs font-semibold text-emerald-300/80"> / month</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    SBP Debt Burden Ratio (DBR)
                  </span>
                  <div className="flex items-center sm:justify-end space-x-1.5 mt-0.5">
                    <span className={`text-xl font-black font-mono ${
                      isDbrPassed ? 'text-emerald-400' : isDbrBorderline ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {dbrPercent.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (SBP Cap: 40%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="space-y-1.5">
                {isDbrPassed && (
                  <div className="flex items-start space-x-2 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <strong>✅ 100% SBP Salary Pre-Qualified:</strong> Your household income of {formatPKR(totalVerifiedIncome)} comfortably fulfills State Bank regulations. Your monthly EMI is only <strong>{dbrPercent.toFixed(1)}%</strong> of your income (safe threshold is &le; 40%).
                    </div>
                  </div>
                )}

                {isDbrBorderline && (
                  <div className="flex items-start space-x-2 text-amber-300 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <strong>⚠️ Borderline DBR ({dbrPercent.toFixed(1)}%):</strong> SBP standard cap is 40%, but banks accept up to 50% for high-grade profiles. Adding a co-applicant or increasing downpayment (e.g. to {Math.min(60, activeDownpaymentPercent + 10)}%) will lower your monthly EMI to pass comfortably.
                    </div>
                  </div>
                )}

                {isDbrFailed && (
                  <div className="flex items-start space-x-2 text-rose-300 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <strong>❌ High Debt Burden ({dbrPercent.toFixed(1)}%):</strong> Under SBP Prudential Regulations, monthly EMI cannot exceed 40–50% of income. <strong>Minimum salary required for {carPreset.shortName} at {activeDownpaymentPercent}% down is {formatPKR(minSalaryRequired40)}/mo.</strong> Try selecting a higher downpayment (e.g. 40% or 50%) or add a Co-Applicant.
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 pt-1">
                  Bank Standard Requirement: Minimum verifiable salary of <strong>{formatPKR(minSalaryRequired40)}</strong> for {carPreset.name}.
                </div>
              </div>
            </div>

            {/* 4-POINT MANDATORY BANK READINESS CHECKLIST */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>4-Point Bank Pre-Qualification Checklist</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-bold">
                  All 4 Mandatory
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 1. Downpayment */}
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkDownpayment}
                    onChange={(e) => setCheckDownpayment(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-slate-300 text-[11px] leading-tight">
                    <strong>{activeDownpaymentPercent}% Downpayment Ready:</strong> I have <strong>{formatPKR(activeDownpaymentAmount)}</strong> in cash or bank savings ready for deposit for this vehicle ({financedPercent}% financed by bank).
                  </span>
                </label>

                {/* 2. Bank Statement */}
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkBankStatement}
                    onChange={(e) => setCheckBankStatement(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-slate-300 text-[11px] leading-tight">
                    <strong>Official Bank-Credited Salary:</strong> Salary is deposited directly via bank transfer with monthly payslips (or active 1-year business statement).
                  </span>
                </label>

                {/* 3. Job Tenure */}
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkJobTenure}
                    onChange={(e) => setCheckJobTenure(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-slate-300 text-[11px] leading-tight">
                    <strong>Employment Tenure:</strong> Minimum 6 months at current permanent employment (or 2 years continuous business history).
                  </span>
                </label>

                {/* 4. Clean e-CIB */}
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkCleanCIB}
                    onChange={(e) => setCheckCleanCIB(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-slate-300 text-[11px] leading-tight">
                    <strong>Clean Credit Record (e-CIB):</strong> No active loan defaults or credit card write-offs in the State Bank credit bureau.
                  </span>
                </label>
              </div>
            </div>

            {/* Bank Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Financing Bank
                </label>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Fast-Track Desk</span>
                </span>
              </div>
              <select
                value={preferredBank}
                onChange={(e) => setPreferredBank(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 focus:border-emerald-400 text-xs text-white outline-none font-semibold"
              >
                <optgroup label="⚡ FAST-TRACK PARTNER BANKS (PRIORITY APPROVAL)" className="font-black text-emerald-400 bg-slate-900">
                  {fastTrackBanks.map((b) => (
                    <option key={b.value} value={b.value} className="font-extrabold text-white bg-slate-900 py-1.5">
                      {b.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="OTHER COMMERCIAL & ISLAMIC BANKS" className="font-normal text-slate-400 bg-slate-900">
                  {standardBanks.map((b) => (
                    <option key={b} value={b} className="font-normal text-slate-300 bg-slate-900">
                      {b}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!allChecksPassed || isDbrFailed}
                className={`w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl font-black text-sm transition-all shadow-lg cursor-pointer ${
                  allChecksPassed && !isDbrFailed
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {allChecksPassed && !isDbrFailed
                    ? `Submit 100% Pre-Qualified Lead (${DISPLAY_WHATSAPP_NUMBER})`
                    : 'Complete Verification Above to Unlock Lead Submission'}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Only fully verified applicants complying with SBP rules are routed to your WhatsApp desk.</span>
            </div>

          </form>
        )}

      </motion.div>
    </div>
  );
};
