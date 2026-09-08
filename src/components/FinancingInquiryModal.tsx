import React, { useState } from 'react';
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
  MessageSquare,
  Sparkles,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getCarPresetByName, calculateAutoEMI } from '../utils/carPresets';

// Official WhatsApp Lead Number for the Creator / Auto Financing Desk
export const OFFICIAL_WHATSAPP_NUMBER = '923134216028';
export const DISPLAY_WHATSAPP_NUMBER = '+92 313 4216028';

interface FinancingInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FinancingLead {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  monthlySalary: number;
  employmentType: string;
  preferredBank: string;
  carName: string;
  downpaymentSaved: number;
  tenureYears?: number;
  estimatedMonthlyInstallment?: number;
  submittedAt: string;
}

export const FinancingInquiryModal: React.FC<FinancingInquiryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { carGoal } = useFinance();
  const { currentUser } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [salaryStr, setSalaryStr] = useState('1,50,000');
  const [employmentType, setEmploymentType] = useState('Salaried Individual');
  const [preferredBank, setPreferredBank] = useState('Meezan Bank Car Ijarah (Fast-Track Partner)');
  const [tenureYears, setTenureYears] = useState<number>(3); // 3 Years standard default
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const carPreset = getCarPresetByName(carGoal.carName);
  const totalMarketPrice = carPreset.totalMarketPrice;
  const downpayment30 = carGoal.targetAmount || carPreset.downpaymentTarget;
  const financedLoan70 = Math.max(0, totalMarketPrice - downpayment30);
  const estimatedEMI = calculateAutoEMI(financedLoan70, tenureYears);

  const tenureOptions = [
    { years: 1, months: 12, label: '1 Year' },
    { years: 2, months: 24, label: '2 Years' },
    { years: 3, months: 36, label: '3 Years', tag: 'Popular' },
    { years: 4, months: 48, label: '4 Years' },
    { years: 5, months: 60, label: '5 Years', tag: 'Max' }
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

    const numericSalary = parseInputCommas(salaryStr);

    const newLead: FinancingLead = {
      id: 'lead-' + Date.now(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      city,
      monthlySalary: numericSalary,
      employmentType,
      preferredBank,
      carName: carGoal.carName,
      downpaymentSaved: carGoal.currentAmount,
      tenureYears,
      estimatedMonthlyInstallment: estimatedEMI,
      submittedAt: new Date().toISOString()
    };

    // Save lead to local storage for the Creator to manage
    const existing = localStorage.getItem('ignition_financing_leads');
    const leads: FinancingLead[] = existing ? JSON.parse(existing) : [];
    leads.unshift(newLead);
    localStorage.setItem('ignition_financing_leads', JSON.stringify(leads));

    // Construct professional WhatsApp pre-filled text message directed to 03134216028
    const message = `*🏎️ IGNITION Auto Financing Lead Submission*
---------------------------------------
*Driver Name:* ${newLead.fullName}
*WhatsApp Phone:* ${newLead.phone}
*City:* ${newLead.city}
*Employment:* ${newLead.employmentType}
*Monthly Income:* ${formatPKR(newLead.monthlySalary)}
*Target Car:* ${newLead.carName} (Total: ${formatPKR(totalMarketPrice)})
*Downpayment Saved (30%):* ${formatPKR(newLead.downpaymentSaved)}
*Financing Requested (70%):* ${formatPKR(financedLoan70)}
*Lease Duration:* ${tenureYears} Years (${tenureYears * 12} Months)
*Est. Monthly Installment:* ~${formatPKR(estimatedEMI)} / month
*Preferred Bank:* ${newLead.preferredBank}
---------------------------------------
_Sent via IGNITION First Car Finance Tracker_`;

    // Direct link to the Creator's WhatsApp: +923134216028
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/30 text-white shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-wide">
                Car Financing Inquiry
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950 uppercase">
                70% LEASE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct connection to financing desk via WhatsApp ({DISPLAY_WHATSAPP_NUMBER})
            </p>
          </div>
        </div>

        {/* Context Badge */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-5 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Your Target Car</span>
            <strong className="text-white">{carGoal.carName}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">30% Downpayment</span>
            <strong className="text-emerald-400">{formatPKR(carGoal.currentAmount)} ({formatLacs(carGoal.currentAmount)})</strong>
          </div>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-10 text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-heading font-bold text-white">
              WhatsApp Chat Initialized!
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your inquiry has been routed to <strong>{DISPLAY_WHATSAPP_NUMBER}</strong>. Check your WhatsApp window to send the formatted message.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Bilal Ahmed"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Your WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3.5 top-3 text-emerald-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 focus:border-emerald-400 text-xs text-white outline-none"
                  >
                    {pakCities.map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Monthly Salary / Income (PKR ₨)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={salaryStr}
                  onChange={(e) => setSalaryStr(formatInputCommas(e.target.value))}
                  placeholder="e.g. 1,50,000"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400 text-xs font-bold text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 focus:border-emerald-400 text-xs text-white outline-none"
                >
                  <option value="Salaried Individual" className="bg-slate-900 text-white">Salaried Individual</option>
                  <option value="Self-Employed / Freelancer" className="bg-slate-900 text-white">Self-Employed / Freelancer</option>
                  <option value="Business Owner / Trader" className="bg-slate-900 text-white">Business Owner / Trader</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Preferred Bank / Lease
                  </label>
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Fast-Track Desk</span>
                  </span>
                </div>
                <select
                  value={preferredBank}
                  onChange={(e) => setPreferredBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-emerald-500/30 focus:border-emerald-400 text-xs text-white outline-none font-semibold"
                >
                  <optgroup label="⚡ FAST-TRACK PARTNER BANKS (PRIORITY APPROVAL)" className="font-black text-emerald-400 bg-slate-900">
                    {fastTrackBanks.map((b) => (
                      <option 
                        key={b.value} 
                        value={b.value} 
                        className="font-extrabold text-white bg-slate-900 py-1.5"
                      >
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

                {preferredBank.includes('Fast-Track Partner') && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-emerald-300 font-semibold leading-tight">
                      <strong>Fast-Track Partner Selected:</strong> Priority 4–5 day approval desk with direct RO relationship support.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* FINANCING TENURE & ESTIMATED MONTHLY INSTALLMENT (EMI) CALCULATOR */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-850 to-slate-900 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Financing Tenure (Loan Duration)</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  Select your lease period
                </span>
              </div>

              {/* Interactive Tenure Pills */}
              <div className="grid grid-cols-5 gap-1.5">
                {tenureOptions.map((t) => (
                  <button
                    key={t.years}
                    type="button"
                    onClick={() => setTenureYears(t.years)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      tenureYears === t.years
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-black shadow-md shadow-emerald-500/10'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-xs font-bold">{t.label}</div>
                    <div className="text-[9px] text-slate-400 font-mono">{t.months} Mo</div>
                    {t.tag && (
                      <div className="text-[8px] text-emerald-400 font-bold truncate mt-0.5">
                        {t.tag}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Live Estimated Monthly Installment (EMI) Breakdown Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-2.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Estimated Monthly Installment (70% Lease)
                    </span>
                    <div className="text-2xl font-black font-heading text-emerald-400">
                      ~{formatPKR(estimatedEMI)}{' '}
                      <span className="text-xs font-semibold text-emerald-300/80">/ month</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 block">Financed Capital (70%)</span>
                    <span className="text-sm font-bold text-white font-mono">{formatPKR(financedLoan70)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 mb-1">
                  <div>
                    <span className="text-slate-400">Target Car:</span>{' '}
                    <strong className="text-white">{carGoal.carName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Price:</span>{' '}
                    <strong className="text-white">{formatLacs(totalMarketPrice)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Downpayment (30%):</span>{' '}
                    <strong className="text-cyan-300">{formatLacs(downpayment30)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Lease Tenure:</span>{' '}
                    <strong className="text-emerald-300">{tenureYears} Years ({tenureYears * 12} Mo)</strong>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 flex items-start space-x-1.5 text-[9.5px] text-amber-300/90 leading-relaxed">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Disclaimer:</strong> Estimated installments are preliminary indicators based on benchmark rates (~18–20% p.a. + takaful). Actual monthly installments will be officially calculated by the financing bank upon document review, adding processing fees and taxes, which vary from bank to bank.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25"
              >
                <Send className="w-4 h-4" />
                <span>Send to WhatsApp ({DISPLAY_WHATSAPP_NUMBER})</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Directly opens WhatsApp chat with the Ignition Auto Financing Desk ({DISPLAY_WHATSAPP_NUMBER}).</span>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
