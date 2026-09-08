import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Car, 
  Flame,
  Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatInputCommas, parseInputCommas, formatLacs } from '../utils/formatters';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'signup' }) => {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Start with empty string so NO annoying leading "0" exists
  const [startingBalanceStr, setStartingBalanceStr] = useState<string>('');
  const [carName, setCarName] = useState('Suzuki Alto VXR');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) return;
    const success = login(loginEmail.trim());
    if (success) {
      onClose();
    } else {
      setLoginError('No driver account found with this email. Create your driver account below.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const numericBalance = parseInputCommas(startingBalanceStr);

    signup({
      name: name.trim(),
      email: email.trim(),
      startingBalance: numericBalance,
      carName: carName.trim() || 'Suzuki Alto VXR'
    });

    onClose();
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputCommas(e.target.value);
    setStartingBalanceStr(formatted);
  };

  const numericValue = parseInputCommas(startingBalanceStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Flame className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-white uppercase tracking-wide">
              Driver Pass
            </h3>
            <p className="text-xs text-slate-400">
              Access your personal car downpayment vault
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-5">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'signup'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Driver Account
          </button>
        </div>

        {/* Forms */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Your Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. ali@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-medium">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/25"
            >
              Sign In to Your Dashboard
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setTab('signup')}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                New driver? Create a free account →
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ali Khan"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
                />
              </div>
            </div>

            {/* Current Real Cash in Hand with Auto-Comma Format */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-1.5">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Exact Money Saved Right Now (PKR ₨)</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-black text-cyan-400">₨</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={startingBalanceStr}
                    onChange={handleBalanceChange}
                    placeholder="e.g. 1,35,000"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 focus:border-cyan-400 text-sm font-bold text-white outline-none"
                  />
                </div>
                {numericValue > 0 ? (
                  <p className="text-[11px] text-cyan-400/90 font-mono mt-1">
                    Equates to: <strong>₨ {startingBalanceStr}</strong> ({formatLacs(numericValue)})
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Enter the exact cash or bank balance you currently have saved.
                  </p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block mb-1">
                  Target Dream Car
                </label>
                <div className="relative">
                  <Car className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={carName}
                    onChange={(e) => setCarName(e.target.value)}
                    placeholder="Suzuki Alto VXR, Cultus, Swift..."
                    required
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-400 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/25"
            >
              Create Account & Launch Ignition
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                Already have an account? Sign In →
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
