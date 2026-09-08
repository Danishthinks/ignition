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
  CreditCard,
  Clock,
  AlertTriangle,
  RotateCcw,
  KeyRound,
  XCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDossier?: () => void;
  onOpenCompare?: () => void;
}

export const NAYAPAY_ACCOUNT_NUMBER = '03134216028';
export const NAYAPAY_ACCOUNT_TITLE = 'Danish Muhammad Khan';
export const SUPPORT_WHATSAPP = '923134216028';

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onOpenDossier,
  onOpenCompare
}) => {
  const { 
    currentUser, 
    isPro, 
    subscription, 
    upgradeToPro, 
    redeemVipPass, 
    clearSubscription 
  } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');
  const [senderName, setSenderName] = useState(currentUser?.name || '');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'nayapay' | 'raast'>('nayapay');
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // VIP promo voucher state
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Force edit state if driver wants to re-enter a TID
  const [forceEdit, setForceEdit] = useState(false);

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
    setErrorMsg('');
    setSuccessMsg('');

    const cleanTid = trxId.trim();
    if (!cleanTid) {
      setErrorMsg('Please enter your Transaction ID (TID) from NayaPay / Raast.');
      return;
    }

    if (cleanTid.length < 6) {
      setErrorMsg('Transaction ID must be at least 6 digits (from your bank receipt).');
      return;
    }

    const cleanDigits = senderPhone.replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 10) {
      setErrorMsg('Please enter a valid 11-digit mobile number so Danish can verify your account.');
      return;
    }

    const res = upgradeToPro(selectedPlan, {
      trxId: cleanTid,
      senderPhone: senderPhone.trim(),
      senderName: senderName.trim() || currentUser?.name,
      paymentMethod
    });

    if (res.success) {
      setSuccessMsg(res.message || 'Transaction submitted for verification!');
      setForceEdit(false);
      if (res.isInstant) {
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 2000);
      }
    } else {
      setErrorMsg(res.message || 'Could not submit transaction.');
    }
  };

  const handleRedeemPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoMsg(null);
    if (!promoCode.trim()) return;

    const res = redeemVipPass(promoCode.trim());
    if (res.success) {
      setPromoMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        onClose();
      }, 1800);
    } else {
      setPromoMsg({ type: 'error', text: res.message });
    }
  };

  const handleSendWhatsAppReceipt = (customTid?: string, customPlan?: string, customAmount?: number) => {
    const tidToUse = customTid || trxId || 'Attached via screenshot';
    const planToUse = customPlan || currentPlanObj.name;
    const amountToUse = customAmount || currentPlanObj.price;

    const msg = `*⚡ IGNITION TURBO Verification Request*
---------------------------------------
*Driver Name:* ${senderName || currentUser?.name || 'Driver'}
*Driver Email:* ${currentUser?.email || 'Not logged in'}
*Sender Mobile:* ${senderPhone || 'Attached in chat'}
*Selected Plan:* ${planToUse} (₨ ${amountToUse})
*Payment Channel:* NayaPay / Raast
*Transaction ID (TID):* ${tidToUse}
*Account Sent To:* ${NAYAPAY_ACCOUNT_NUMBER} (${NAYAPAY_ACCOUNT_TITLE})
---------------------------------------
_As-Salamu Alaykum Danish Bhai! I have transferred the payment via NayaPay/Raast. Please verify my TID and activate my TURBO VIP access._`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=${SUPPORT_WHATSAPP}&text=${encoded}`, '_blank');
  };

  const isPending = !isPro && subscription?.status === 'pending' && !forceEdit;
  const isRejected = !isPro && subscription?.status === 'rejected' && !forceEdit;

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
          
          {/* Active Pro Status Banner */}
          {isPro && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-black text-white uppercase">
                      You are an Active TURBO VIP Driver
                    </div>
                    <div className="text-[10px] text-amber-300">
                      Plan: <strong>{subscription?.planName?.toUpperCase() || 'TURBO PASS'}</strong> • Status: Active (Verified)
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
                      className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
                    >
                      Open Dossier
                    </button>
                  )}
                  {onOpenCompare && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCompare();
                      }}
                      className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      Compare Cars
                    </button>
                  )}
                </div>
              </div>

              {subscription && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-slate-300 pt-2 border-t border-white/10">
                  <div>
                    <span className="text-slate-500 block">TID / Reference:</span>
                    <span className="font-mono font-bold text-white">{subscription.trxId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Payment Method:</span>
                    <span className="capitalize font-semibold text-white">{subscription.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Amount:</span>
                    <span className="font-mono font-bold text-emerald-400">₨ {subscription.amountPaid}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pending Verification Card */}
          {isPending && subscription && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/50 space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                        Payment Verification in Progress
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Queued
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Your transfer to <strong>{NAYAPAY_ACCOUNT_TITLE}</strong> is in queue.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Submitted Transaction ID (TID):</span>
                  <span className="font-mono font-bold text-amber-400 text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {subscription.trxId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Selected Plan:</span>
                  <span className="text-white font-semibold capitalize">{subscription.planName} (₨ {subscription.amountPaid})</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Sent To:</span>
                  <span className="text-emerald-400 font-semibold">{NAYAPAY_ACCOUNT_NUMBER} ({NAYAPAY_ACCOUNT_TITLE})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px] space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fast-Track Your Verification (Under 5 Mins):</span>
                </div>
                <p className="text-slate-300 text-[10px] leading-relaxed">
                  Send your payment screenshot on WhatsApp to <strong>{NAYAPAY_ACCOUNT_TITLE}</strong>. Your account will be verified and upgraded to TURBO VIP immediately.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppReceipt(subscription.trxId, subscription.planName, subscription.amountPaid)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Screenshot to Danish on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForceEdit(true)}
                  className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-enter TID</span>
                </button>
              </div>
            </div>
          )}

          {/* Verification Failed Card */}
          {isRejected && subscription && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/50 space-y-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                    Verification Could Not Be Completed
                  </h4>
                  <p className="text-[11px] text-rose-300 mt-0.5">
                    {subscription.rejectionReason || 'Transaction ID did not match our NayaPay bank records.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs space-y-1">
                <div className="text-[11px] text-slate-400">
                  Previous TID: <span className="font-mono font-bold text-white">{subscription.trxId}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Please verify your 6-digit transaction ID on your NayaPay or Raast transfer receipt and re-submit.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearSubscription();
                    setForceEdit(true);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-submit Correct TID</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendWhatsAppReceipt(subscription.trxId, subscription.planName, subscription.amountPaid)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ask Danish on WhatsApp</span>
                </button>
              </div>
            </div>
          )}

          {/* Pricing Plans Grid (Shown when not pro and not pending) */}
          {(!isPro && !isPending && !isRejected) && (
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
          )}

          {/* TURBO Features Checklist */}
          {(!isPro && !isPending && !isRejected) && (
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
          )}

          {/* NayaPay / Raast Payment Details Box */}
          {(!isPro && !isPending && !isRejected) && (
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
                    Account Name: <strong className="text-amber-300">{NAYAPAY_ACCOUNT_TITLE}</strong>
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
                Open your <strong>NayaPay, SadaPay, EasyPaisa, JazzCash, or any Bank App</strong> &rarr; Select Transfer &rarr; Send <strong>₨ {currentPlanObj.price}</strong> to <strong>{NAYAPAY_ACCOUNT_TITLE}</strong> ({NAYAPAY_ACCOUNT_NUMBER}).
              </p>
            </div>
          )}

          {/* Verification & Submission Form */}
          {(!isPro && !isPending && !isRejected) && (
            <form onSubmit={handleActivate} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                  3. Submit Transaction ID (TID) for Verification
                </span>
                <span className="text-[10px] text-amber-400 font-semibold">
                  Manual Verification by Danish
                </span>
              </div>

              {errorMsg && (
                <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                    Your Mobile Number (Sender Phone)
                  </label>
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="e.g. 0313-4216028"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                    Transaction ID (TID) / Reference No.
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
                  <Clock className="w-4 h-4 text-slate-950" />
                  <span>Submit TID for Verification (₨ {currentPlanObj.price})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendWhatsAppReceipt()}
                  className="py-3 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  title="Send receipt screenshot via WhatsApp"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Receipt</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                Submissions are verified by Danish Muhammad Khan against NayaPay bank records.
              </p>
            </form>
          )}

          {/* VIP Promo / Creator Pass Toggle */}
          {(!isPro && !isPending && !isRejected) && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPromoInput(!showPromoInput)}
                className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 mx-auto transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Have a VIP Voucher or Creator Promo Code?</span>
              </button>

              {showPromoInput && (
                <form onSubmit={handleRedeemPromo} className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2 max-w-md mx-auto">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code (e.g. VIP2026, DANISH-VIP)"
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white font-mono uppercase outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                    >
                      Redeem
                    </button>
                  </div>
                  {promoMsg && (
                    <div className={`text-[11px] font-semibold ${promoMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {promoMsg.text}
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-white/10 shrink-0 flex items-center justify-between text-[10px] text-slate-400">
          <span>Account: <strong>{NAYAPAY_ACCOUNT_TITLE}</strong> • WhatsApp: {NAYAPAY_ACCOUNT_NUMBER}</span>
          <button onClick={onClose} className="hover:text-white transition-colors cursor-pointer">
            Close
          </button>
        </div>

      </motion.div>
    </div>
  );
};

