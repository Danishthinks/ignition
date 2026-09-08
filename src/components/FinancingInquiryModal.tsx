import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { formatPKR, formatLacs, formatInputCommas, parseInputCommas } from '../utils/formatters';
import { 
  X, 
  Building2, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  Car, 
  Send,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [preferredBank, setPreferredBank] = useState('Meezan Bank Car Ijarah (Islamic)');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

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

  const banks = [
    'Meezan Bank Car Ijarah (Islamic)',
    'Bank Alfalah Auto Loan',
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
      submittedAt: new Date().toISOString()
    };

    // Save lead to local storage for the Creator to manage
    const existing = localStorage.getItem('ignition_financing_leads');
    const leads: FinancingLead[] = existing ? JSON.parse(existing) : [];
    leads.unshift(newLead);
    localStorage.setItem('ignition_financing_leads', JSON.stringify(leads));

    // Construct professional WhatsApp pre-filled text message
    const message = `*🏎️ IGNITION Auto Financing Lead Submission*
---------------------------------------
*Driver Name:* ${newLead.fullName}
*WhatsApp Phone:* ${newLead.phone}
*City:* ${newLead.city}
*Employment:* ${newLead.employmentType}
*Monthly Income:* ${formatPKR(newLead.monthlySalary)}
*Target Car:* ${newLead.carName}
*Downpayment Saved (30%):* ${formatPKR(newLead.downpaymentSaved)}
*Financing Requested (70%):* Bank Lease / Ijarah
*Preferred Bank:* ${newLead.preferredBank}
---------------------------------------
_Sent via IGNITION First Car Finance Tracker_`;

    // Open WhatsApp Web or Mobile app
    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMsg}`;
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
        <div className="flex items-center space-x-3 mb-5">
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
              Get matched with Islamic Ijarah & Auto Lease partners in Pakistan.
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
              Inquiry Dispatched via WhatsApp!
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your car financing details have been formatted. A financing advisor or bank partner will review your downpayment readiness.
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
                  WhatsApp Number
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
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Preferred Bank / Lease
                </label>
                <select
                  value={preferredBank}
                  onChange={(e) => setPreferredBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 focus:border-emerald-400 text-xs text-white outline-none"
                >
                  {banks.map((b) => (
                    <option key={b} value={b} className="bg-slate-900 text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry & Connect on WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your details remain private and are only shared with authorized auto-lease agents.</span>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
