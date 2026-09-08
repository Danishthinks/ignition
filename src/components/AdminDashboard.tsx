import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatPKR, formatLacs } from '../utils/formatters';
import { 
  Zap, 
  Users, 
  ShieldCheck, 
  Quote, 
  Crown,
  LogOut,
  Car
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, exitCreatorMode } = useAuth();

  const [newQuoteText, setNewQuoteText] = useState('');
  const [newProvocation, setNewProvocation] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const drivers = users.filter(u => u.role === 'driver');
  const totalSavedAcrossPlatform = drivers.reduce((acc, u) => acc + (u.startingBalance || 0), 0);

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
                Welcome, Creator. Manage your network of drivers and broadcast daily motivational fuel.
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
            Registered Drivers
          </span>
          <div className="text-2xl font-black font-heading text-cyan-400">
            {drivers.length} Drivers
          </div>
          <span className="text-xs text-slate-400">Active car downpayment goals</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
            Total Capital In Motion
          </span>
          <div className="text-2xl font-black font-heading text-emerald-400">
            {formatPKR(totalSavedAcrossPlatform)}
          </div>
          <span className="text-xs text-emerald-300/80 font-medium">
            {formatLacs(totalSavedAcrossPlatform)} saved across network
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
            Platform Status
          </span>
          <div className="text-2xl font-black font-heading text-amber-400 flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% Operational</span>
          </div>
          <span className="text-xs text-slate-400">PKR Currency Engine Active</span>
        </div>
      </div>

      {/* Drivers Roster Table */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Registered Driver Network ({drivers.length})</span>
        </h3>

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
