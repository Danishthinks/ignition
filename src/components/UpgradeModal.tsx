import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatPKR } from '../utils/formatters';
import type { SubscriptionPlan } from '../types/auth';
import { 
  X, 
  Zap, 
  Check, 
  Crown, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  FileSpreadsheet, 
  Flame, 
  Layers,
  Phone,
  Send,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDossier?: () => void;
  onOpenCompare?: () => void;
}

export const NAYAPAY_ACCOUNT_NUMBER = '03134216028';
export const NAYAPAY_ACCOUNT_TITLE = 'Ignition Desk / Danish';
export const SUPPORT_WHATSAPP = '923134216028';

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onOpenDossier,
  onOpenCompare
}) => {
  const { currentUser, isPro, subscription, upgradeToPro, cancelPro } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');
  const [senderName, setSenderName] = useState(currentUser?.name || '');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'nayapay' | 'raast'>('nayapay');
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const plans: {
    id: SubscriptionPlan;
    name: string;
    price: number;
    period: string;
    tag?: string;
    savings?: string;
  }[] = [
    {
      id: 'monthly',
      name: 'Monthly Pitstop',
      price: 100,
      period: '/ month',
      tag: 'Micro-Pass',
    },
    {
      id: 'quarterly',
      name: 'Quarterly Accelerator',
      price: 250,
      period: '/ 3 months',
      tag: 'Most Popular',
      savings: 'Save 17%',
    },
    {
      id: 'annual',
      name: 'Annual Champion',
      price: 800,
      period: '/ year',
      tag: 'Best Value',
      savings: 'Save 33%',
    },
    {
      id: 'lifetime',
      name: 'Founder Driver Pass',
      price: 999,
      period: 'one-time',
      tag: 'Lifetime Access',
      savings: 'Never pay again',
    },
  ];

  const currentPlanObj = plans.find(p => p.id === selectedPlan) || plans[0];

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(NAYAPAY_ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) {
      setErrorMsg('Please enter your 6-digit Transaction ID (TID) from NayaPay / Raast.');
      return;
    }

    const res = upgradeToPro(selectedPlan, {
      trxId: trxId.trim(),
      senderPhone: senderPhone.trim(),
      senderName: senderName.trim(),
      paymentMethod
    });

    if (res.success) {
      setSuccessMsg(res.message || 'IGNITION TURBO Activated!');
      setErrorMsg('');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 2000);
    } else {
      setErrorMsg(res.message || 'Could not activate subscription.');
    }
  };

  const handleSendWhatsAppReceipt = () => {
    const msg = `*⚡ IGNITION TURBO Subscription Receipt Submission*
---------------------------------------
*Driver Name:* ${senderName || currentUser?.name || 'Driver'}
*Phone Number:* ${senderPhone || 'Not provided'}
*Selected Plan:* ${currentPlanObj.name} (₨ ${currentPlanObj.price} ${currentPlanObj.period})
*Payment Channel:* NayaPay / Raast
*Transaction ID (TID):* ${trxId || 'Attached via screenshot'}
*Account Sent To:* ${NAYAPAY_ACCOUNT_NUMBER} (${NAYAPAY_ACCOUNT_TITLE})
---------------------------------------
_Please verify my transaction and activate TURBO VIP perks._`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=${SUPPORT_WHATSAPP}&text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-amber-500/40 text-white shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[94vh] flex flex-col"
      >
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

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
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/20 shrink-0">
            <Zap className="w-6 h-6 fill-current text-amber-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
                IGNITION TURBO
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase shadow-sm">
                PRO DRIVER PASS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Supercharge your car savings discipline, unlock bank dossiers & priority lease processing for just ₨ 100/mo.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          
          {/* Already Active Pro Status Banner */}
          {isPro && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Crown className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-black text-white uppercase">
                    You are an Active TURBO VIP Driver
                  </div>
                  <div className="text-[10px] text-amber-300">
                    Plan: <strong>{subscription?.planName?.toUpperCase() || 'TURBO PASS'}</strong> • Status: Active
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onOpenDossier && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDossier();
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white"
                  >
                    Open Dossier
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Pricing Plans Grid */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              1. Choose Your TURBO Pass
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {plans.map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-lg shadow-amber-500/15'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      {p.tag && (
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider block w-fit mb-1 ${
                          isSelected ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-slate-400'
                        }`}>
                          {p.tag}
                        </span>
                      )}
                      <div className="text-xs font-black text-white">{p.name}</div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10">
                      <div className="text-base font-black text-amber-400 font-mono">
                        ₨ {p.price}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {p.period}
                      </div>
                      {p.savings && (
                        <div className="text-[8px] text-emerald-400 font-bold mt-0.5">
                          {p.savings}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TURBO Features Checklist */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
              What's Included in IGNITION TURBO:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-[11px]">
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>VIP Priority Bank Queue:</strong> Dedicated RO routing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>Bank-Ready Credit Dossier:</strong> 1-click printable PDF</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>Multi-Car Comparison:</strong> Side-by-side fuel & EMI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>CSV Ledger Export:</strong> Full history to Excel</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>Daily Savings Burn-Rate:</strong> Exact daily target</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>TURBO Gold Badge:</strong> High-status cockpit profile</span>
              </div>
            </div>
          </div>

          {/* NayaPay / Raast Payment Details Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-900 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase">
                <CreditCard className="w-4 h-4" />
                <span>2. Send ₨ {currentPlanObj.price} via NayaPay or Raast</span>
              </div>
              <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Direct Account
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">
                  NayaPay Mobile Number / Raast ID:
                </div>
                <div className="text-base sm:text-lg font-black font-mono text-emerald-400 tracking-wider">
                  {NAYAPAY_ACCOUNT_NUMBER}
                </div>
                <div className="text-[10px] text-slate-300">
                  Account Name: <strong>{NAYAPAY_ACCOUNT_TITLE}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyAccount}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-all cursor-pointer self-start sm:self-auto"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Number'}</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              Open your <strong>NayaPay, SadaPay, EasyPaisa, JazzCash, or any Bank App</strong> &rarr; Select Transfer &rarr; Send <strong>₨ {currentPlanObj.price}</strong> to NayaPay / Raast ID <strong>{NAYAPAY_ACCOUNT_NUMBER}</strong>.
            </p>
          </div>

          {/* Verification & Instant Activation Form */}
          <form onSubmit={handleActivate} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              3. Enter Transaction ID (TID) to Activate TURBO
            </span>

            {errorMsg && (
              <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                  Sender Name / App Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Bilal Ahmed"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                  6-Digit Transaction ID (TID)
                </label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. 984512"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white font-mono font-bold outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current text-slate-950" />
                <span>Verify & Activate TURBO Instantly (₨ {currentPlanObj.price})</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsAppReceipt}
                className="py-3 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                title="Send receipt screenshot via WhatsApp"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Receipt</span>
              </button>
            </div>
          </form>

        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-white/10 shrink-0 flex items-center justify-between text-[10px] text-slate-400">
          <span>Manual activation assistance available via WhatsApp: {NAYAPAY_ACCOUNT_NUMBER}</span>
          <button onClick={onClose} className="hover:text-white transition-colors">
            Close
          </button>
        </div>

      </motion.div>
    </div>
  );
};
