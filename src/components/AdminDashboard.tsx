import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatPKR, formatLacs, formatDate } from '../utils/formatters';
import type { FinancingLead } from './FinancingInquiryModal';
import { 
  Zap, 
  Users, 
  Quote, 
  Crown,
  LogOut,
  Building2,
  Phone,
  MessageCircle,
  Clock,
  Car
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, exitCreatorMode, verifySubscription } = useAuth();

  const [leads, setLeads] = useState<FinancingLead[]>(() => {
    const saved = localStorage.getItem('ignition_financing_leads');
    if (saved) {
      try {
        const parsed: FinancingLead[] = JSON.parse(saved);
        // Exclude sample demo leads
        return parsed.filter(l => !l.id.startsWith('lead-demo-'));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [newQuoteText, setNewQuoteText] = useState('');
  const [newProvocation, setNewProvocation] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('ignition_financing_leads', JSON.stringify(leads));
  }, [leads]);

  const drivers = users.filter(u => u.role === 'driver');
  const totalSavedAcrossPlatform = drivers.reduce((acc, u) => acc + (u.startingBalance || 0), 0);
  
  // TURBO Subscription stats
  const subscribers = drivers.filter(u => !!u.subscription);
  const pendingSubs = subscribers.filter(u => u.subscription?.status === 'pending');
  const activeSubs = subscribers.filter(u => u.subscription?.status === 'active');
  const verifiedRevenue = activeSubs.reduce((acc, u) => acc + (u.subscription?.amountPaid || 0), 0);

  const handleBroadcastQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    setQuoteSuccess(true);
    setTimeout(() => {
      setNewQuoteText('');
      setNewProvocation('');
      setNewAuthor('');
      setQuoteSuccess(false);
    }, 2000);
  };

  const openWhatsAppLead = (phone: string, name: string, car: string, tenure?: number, emi?: number) => {
    const cleanDigits = phone.replace(/\D/g, '');
    const intlPhone = cleanDigits.startsWith('0') ? '92' + cleanDigits.slice(1) : cleanDigits;
    const details = tenure && emi ? ` (${tenure} yrs tenure, est. installment ~${formatPKR(emi)}/mo)` : '';
    const msg = encodeURIComponent(`Salam ${name}! Regarding your car financing inquiry for ${car}${details} on IGNITION, I can help you process your pre-approval.`);
    window.open(`https://api.whatsapp.com/send?phone=${intlPhone}&text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Creator Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/40 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
                  Creator Control Terminal
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
                  CREATOR ACCESS ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Welcome, Creator. Manage your network of drivers, monetize bank leads, and broadcast daily fuel.
              </p>
            </div>
          </div>

          <button
            onClick={exitCreatorMode}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-xs border border-white/10 transition-all self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Creator Mode</span>
          </button>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
            Registered Drivers
          </span>
          <div className="text-2xl font-black font-heading text-cyan-400">
            {drivers.length} Drivers
          </div>
          <span className="text-xs text-slate-400">Active car downpayment goals</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-amber-500/30 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-bold text-amber-400">
              TURBO Subscriptions
            </span>
            {pendingSubs.length > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 animate-pulse">
                {pendingSubs.length} PENDING
              </span>
            )}
          </div>
          <div className="text-2xl font-black font-heading text-amber-400">
            {activeSubs.length} VIPs
          </div>
          <span className="text-xs text-amber-300/80 font-medium">
            Revenue: {formatPKR(verifiedRevenue)}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-emerald-500/30 text-white">
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
            Bank Financing Inquiries
          </span>
          <div className="text-2xl font-black font-heading text-emerald-400">
            {leads.length} Qualified Leads
          </div>
          <span className="text-xs text-emerald-300/80 font-medium">
            Potential Fees: ~₨ {leads.length * 15000} PKR
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
            Total Capital In Motion
          </span>
          <div className="text-2xl font-black font-heading text-cyan-300">
            {formatPKR(totalSavedAcrossPlatform)}
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {formatLacs(totalSavedAcrossPlatform)} saved across network
          </span>
        </div>
      </div>

      {/* NEW: TURBO Subscription Verification Desk */}
      <div className="p-5 rounded-2xl bg-white/5 border border-amber-500/40 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                <Zap className="w-4 h-4 fill-current text-amber-400" />
                <span>TURBO Subscription Verification Desk ({subscribers.length})</span>
              </h3>
              {pendingSubs.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 animate-pulse">
                  {pendingSubs.length} Pending Approval
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review TID submissions sent to your NayaPay / Raast (<strong>03134216028</strong> - <strong>Danish Muhammad Khan</strong>) and grant TURBO VIP status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              Verified Revenue: {formatPKR(verifiedRevenue)}
            </span>
          </div>
        </div>

        {subscribers.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Zap className="w-5 h-5 fill-current text-amber-400" />
            </div>
            <p className="text-xs font-bold text-slate-200">No subscription upgrade submissions yet</p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              When drivers submit their ₨ 100 transfer TID for verification to Danish Muhammad Khan, they will appear here for 1-click approval.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold">Driver</th>
                  <th className="pb-3 font-semibold">Plan & Fee</th>
                  <th className="pb-3 font-semibold">Channel</th>
                  <th className="pb-3 font-semibold">Sender Phone / Name</th>
                  <th className="pb-3 font-semibold">Transaction ID (TID)</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscribers.map((u) => {
                  const sub = u.subscription!;
                  const isPending = sub.status === 'pending';
                  const isActive = sub.status === 'active';
                  const isRejected = sub.status === 'rejected';

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-bold text-white">
                        <div>{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-white capitalize">{sub.planName}</div>
                        <div className="text-[10px] text-amber-400 font-mono font-bold">₨ {sub.amountPaid}</div>
                      </td>
                      <td className="py-3 capitalize text-slate-300">
                        {sub.paymentMethod === 'vip_pass' ? (
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">VIP Code</span>
                        ) : (
                          <span>{sub.paymentMethod}</span>
                        )}
                      </td>
                      <td className="py-3 text-slate-300">
                        <div className="font-mono text-white text-[11px]">{sub.senderPhone || '—'}</div>
                        <div className="text-[10px] text-slate-400">{sub.senderName || u.name}</div>
                      </td>
                      <td className="py-3 font-mono font-bold text-amber-300 text-xs">
                        {sub.trxId}
                      </td>
                      <td className="py-3">
                        {isActive ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <span>✓ Active VIP</span>
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                            <span>⏳ Review</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <span>✕ Rejected</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                onClick={() => verifySubscription(u.id, true)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition-all cursor-pointer shadow-sm"
                                title="Verify receipt and grant TURBO VIP"
                              >
                                Approve VIP
                              </button>
                              <button
                                onClick={() => verifySubscription(u.id, false, 'TID not found on NayaPay/Raast account statement.')}
                                className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-[11px] transition-all cursor-pointer"
                                title="Reject invalid TID"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {isActive && (
                            <button
                              onClick={() => verifySubscription(u.id, false, 'Revoked by Admin')}
                              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-300 text-[10px] transition-all cursor-pointer"
                              title="Revoke subscription"
                            >
                              Revoke
                            </button>
                          )}
                          {isRejected && (
                            <button
                              onClick={() => verifySubscription(u.id, true)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all cursor-pointer"
                            >
                              Re-Approve
                            </button>
                          )}
                          {sub.senderPhone && (
                            <button
                              onClick={() => {
                                const cleanDigits = sub.senderPhone!.replace(/\D/g, '');
                                const phone = cleanDigits.startsWith('0') ? '92' + cleanDigits.slice(1) : cleanDigits;
                                const msg = encodeURIComponent(`Salam ${u.name}! Regarding your IGNITION TURBO subscription inquiry (TID: ${sub.trxId})...`);
                                window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${msg}`, '_blank');
                              }}
                              className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer"
                              title="Chat with driver on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* NEW: Auto Financing Inquiries / Bank Leads Roster (MONETIZATION HUB) */}
      <div className="p-5 rounded-2xl bg-white/5 border border-emerald-500/30 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Auto Financing & Bank Leads Pipeline ({leads.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Drivers requesting 70% bank lease / Islamic Ijarah. Connect directly via WhatsApp to earn finder fees.
            </p>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-200">
              No leads submitted yet
            </p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              Auto financing inquiries submitted by drivers will appear here in real time and ping your WhatsApp (<span className="text-emerald-400 font-bold">03134216028</span>) directly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold">Lead Name</th>
                  <th className="pb-3 font-semibold">City</th>
                  <th className="pb-3 font-semibold">Monthly Income</th>
                  <th className="pb-3 font-semibold">Target Car</th>
                  <th className="pb-3 font-semibold">Downpayment Ready</th>
                  <th className="pb-3 font-semibold">Tenure & Est. EMI</th>
                  <th className="pb-3 font-semibold">Bank Preference</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-bold text-white">
                      <div>{l.fullName}</div>
                      <div className="text-[10px] text-slate-400">{l.employmentType}</div>
                    </td>
                    <td className="py-3 text-slate-300">{l.city}</td>
                    <td className="py-3 text-emerald-400 font-mono font-bold">{formatPKR(l.monthlySalary)}</td>
                    <td className="py-3 text-cyan-300 font-semibold">{l.carName}</td>
                    <td className="py-3 text-amber-300 font-mono font-bold">{formatPKR(l.downpaymentSaved)}</td>
                    <td className="py-3 text-slate-300">
                      {l.tenureYears ? (
                        <div>
                          <div className="font-bold text-white text-[11px]">{l.tenureYears} Yrs ({l.tenureYears * 12}m)</div>
                          <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                            ~{formatPKR(l.estimatedMonthlyInstallment || 0)}/mo
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">3 Yrs (~₨ 84k/m)</span>
                      )}
                    </td>
                    <td className="py-3 text-slate-300 max-w-[170px]">
                      {l.preferredBank.includes('Fast-Track') ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ⚡ {l.preferredBank.replace('⭐ ', '')}
                        </span>
                      ) : (
                        <span className="truncate block">{l.preferredBank}</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => openWhatsAppLead(l.phone, l.fullName, l.carName, l.tenureYears, l.estimatedMonthlyInstallment)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shadow-sm transition-all"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drivers Roster Table */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Registered Driver Network ({drivers.length})</span>
        </h3>

        {drivers.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No drivers registered yet. Users who create accounts will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold">Driver</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Target Car</th>
                  <th className="pb-3 font-semibold text-right">Saved In Hand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {drivers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-bold flex items-center space-x-2">
                      <span className="text-base">{u.avatar || '🏎️'}</span>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 text-slate-400 font-mono">{u.email}</td>
                    <td className="py-3 text-slate-300">{u.targetCarName || 'Suzuki Alto VXR'}</td>
                    <td className="py-3 text-right font-mono font-bold text-cyan-400">
                      {u.startingBalance ? formatPKR(u.startingBalance) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Broadcast Custom Quote Form */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-2">
          <Quote className="w-4 h-4 text-amber-400" />
          <span>Broadcast Daily Provocation to Drivers</span>
        </h3>

        <form onSubmit={handleBroadcastQuote} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Inspirational Quote</label>
            <input
              type="text"
              value={newQuoteText}
              onChange={(e) => setNewQuoteText(e.target.value)}
              placeholder="e.g. Stop driving through someone else's dreams. Buy your own machine."
              required
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Hard-hitting Provocation</label>
            <input
              type="text"
              value={newProvocation}
              onChange={(e) => setNewProvocation(e.target.value)}
              placeholder="e.g. Close the shopping app right now and transfer ₨ 2,000 to your vault."
              required
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400 text-xs text-white outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Creator of Ignition"
              className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none w-56"
            />

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/25"
            >
              {quoteSuccess ? '✓ Broadcasted Live!' : 'Broadcast to Drivers'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
