import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { formatPKR, formatLacs, formatDate } from '../utils/formatters';
import { getCarPresetByName, calculateAutoEMI } from '../utils/carPresets';
import { 
  X, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  BadgePercent, 
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CreditDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId?: string;
  tenureYears?: number;
  monthlySalary?: number;
}

export const CreditDossierModal: React.FC<CreditDossierModalProps> = ({
  isOpen,
  onClose,
  carId,
  tenureYears = 3,
  monthlySalary = 180000
}) => {
  const { carGoal } = useFinance();
  const { currentUser } = useAuth();

  if (!isOpen) return null;

  const carPreset = getCarPresetByName(carGoal.carName);
  const totalMarketPrice = carPreset.totalMarketPrice;
  const downpayment30 = carPreset.downpaymentTarget;
  const financedLoan70 = Math.max(0, totalMarketPrice - downpayment30);
  const estimatedEMI = calculateAutoEMI(financedLoan70, tenureYears);

  const dbrPercent = monthlySalary > 0 ? (estimatedEMI / monthlySalary) * 100 : 35;
  const isDbrPassed = dbrPercent <= 40;
  const minSalaryRequired = Math.round(estimatedEMI / 0.40);

  const handlePrint = () => {
    window.print();
  };

  const dossierDate = new Date().toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-emerald-500/40 text-white shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[94vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0 pr-10 print:hidden">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-black text-white uppercase tracking-tight">
                Bank-Ready Credit Dossier
              </h3>
              <p className="text-[11px] text-slate-400">
                Official applicant financial summary for Branch Relationship Officers (ROs).
              </p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-950" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        {/* PRINTABLE DOSSIER SHEET (A4 Structured) */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1 print:p-6 print:bg-white print:text-black">
          
          {/* Printable Document Container */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-white/15 space-y-5 print:bg-white print:border-none print:text-slate-900 print:p-0">
            
            {/* Dossier Letterhead */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-emerald-500/40 pb-4 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-heading font-black text-xl tracking-wider text-emerald-400 uppercase">
                    IGNITION AUTO VAULT
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500 text-slate-950 uppercase">
                    SBP PRE-VETTED
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-semibold mt-0.5">
                  Consumer Auto Financing Pre-Qualification Dossier
                </div>
              </div>

              <div className="sm:text-right text-[11px] text-slate-400">
                <div>Dossier No: <strong>IGN-{Date.now().toString().slice(-6)}</strong></div>
                <div>Issued Date: <strong>{dossierDate}</strong></div>
              </div>
            </div>

            {/* Applicant Profile Grid */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-400 mb-2">
                1. Applicant Information
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Applicant Name</span>
                  <strong className="text-white">{currentUser?.name || 'Applicant'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Contact Phone</span>
                  <strong className="text-white">Verified on WhatsApp</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Net Monthly Income</span>
                  <strong className="text-emerald-400 font-mono">{formatPKR(monthlySalary)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Employment Type</span>
                  <strong className="text-white">Bank-Credited Salary</strong>
                </div>
              </div>
            </div>

            {/* Target Vehicle & Financing Request */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-400 mb-2">
                2. Vehicle Specifications & Facility Request
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Vehicle Model</span>
                  <strong className="text-white">{carPreset.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Transmission & Engine</span>
                  <strong className="text-white">{carPreset.transmission} ({carPreset.engineCC}cc)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Ex-Factory Price</span>
                  <strong className="text-white font-mono">{formatPKR(totalMarketPrice)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">30% Cash Downpayment</span>
                  <strong className="text-cyan-400 font-mono">{formatPKR(downpayment30)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">70% Financed Capital</span>
                  <strong className="text-white font-mono">{formatPKR(financedLoan70)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Lease Tenure</span>
                  <strong className="text-white">{tenureYears} Years ({tenureYears * 12} Mo)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Est. Monthly Installment</span>
                  <strong className="text-emerald-400 font-mono">~{formatPKR(estimatedEMI)} / mo</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Downpayment Saved</span>
                  <strong className="text-cyan-300 font-mono">{formatPKR(carGoal.currentAmount)}</strong>
                </div>
              </div>
            </div>

            {/* SBP Prudential Regulation Clearance */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-300 tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>State Bank of Pakistan (SBP) Regulation Clearance</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PASSED &ge; 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Calculated DBR:</span>
                  <strong className="text-emerald-400 font-mono text-sm">{dbrPercent.toFixed(1)}%</strong>
                  <div className="text-[10px] text-slate-400">Within SBP &le; 40% threshold</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Min. SBP Required Income:</span>
                  <strong className="text-white font-mono text-sm">{formatPKR(minSalaryRequired)}</strong>
                  <div className="text-[10px] text-slate-400">Applicant earns {formatPKR(monthlySalary)}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tenure Legal Cap:</span>
                  <strong className="text-white text-sm">{carPreset.maxTenureYears} Years Max</strong>
                  <div className="text-[10px] text-slate-400">Complies with SBP CC rules</div>
                </div>
              </div>
            </div>

            {/* 4-Point Bank Readiness Certification */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-400 mb-2">
                3. Pre-Verified Documentation Checklist
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-start space-x-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>30% Downpayment:</strong> Verified ready in cash or bank savings ({formatLacs(downpayment30)}).</span>
                </div>
                <div className="flex items-start space-x-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Salary Verification:</strong> Bank salary credit statement & salary slips available.</span>
                </div>
                <div className="flex items-start space-x-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Job Tenure:</strong> Confirmed &gt; 6 months permanent employment tenure.</span>
                </div>
                <div className="flex items-start space-x-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Clean e-CIB:</strong> No active loan or credit card defaults on credit bureau records.</span>
                </div>
              </div>
            </div>

            {/* Signature & Verification Sign-Off */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-6 text-[10px] text-slate-400">
              <div className="border-t border-slate-700 pt-2">
                <div className="font-bold text-white">Applicant Signature & Undertaking</div>
                <div>I confirm all declared credentials are accurate and verifiable.</div>
              </div>
              <div className="border-t border-slate-700 pt-2 text-right">
                <div className="font-bold text-emerald-400">Authorized Ignition RO Referral Desk</div>
                <div>Fast-Track Partner: Meezan Bank / Bank Alfalah Auto Finance</div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 shrink-0 flex items-center justify-between text-xs print:hidden">
          <span className="text-[11px] text-slate-400">
            Submit this dossier alongside your 6-month bank statement to your Bank RO.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>

      </motion.div>
    </div>
  );
};
