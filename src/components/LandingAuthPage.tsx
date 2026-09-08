import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { 
  formatInputCommas, 
  parseInputCommas, 
  formatLacs 
} from '../utils/formatters';
import { 
  Flame, 
  Car, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  User as UserIcon, 
  Wallet, 
  Sun, 
  Moon, 
  TrendingUp, 
  Lock, 
  Zap, 
  ChevronRight,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingAuthPageProps {
  onOpenCreatorModal: () => void;
}

const CAR_OPTIONS = [
  'Suzuki Alto VXR',
  'Suzuki Cultus VXL',
  'Suzuki Swift GLX',
  'Honda City 1.2 LS',
  'Toyota Yaris ATIV'
];

export const LandingAuthPage: React.FC<LandingAuthPageProps> = ({ onOpenCreatorModal }) => {
  const { login, signup } = useAuth();
  const { isDarkMode, toggleTheme } = useFinance();

  const [tab, setTab] = useState<'signup' | 'login'>('signup');

  // Sign in state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Sign up state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [startingBalanceStr, setStartingBalanceStr] = useState('');
  const [carName, setCarName] = useState('Suzuki Alto VXR');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) return;

    const res = login(loginEmail.trim(), loginPassword);
    if (!res.success) {
      setLoginError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!name.trim() || !email.trim()) return;

    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters for vault security.');
      return;
    }

    const numericBalance = parseInputCommas(startingBalanceStr);
    const res = signup({
      name: name.trim(),
      email: email.trim(),
      password: password,
      startingBalance: numericBalance,
      carName: carName.trim() || 'Suzuki Alto VXR'
    });

    if (!res.success) {
      setSignupError(res.message || 'Could not create driver account.');
    }
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputCommas(e.target.value);
    setStartingBalanceStr(formatted);
  };

  const numericValue = parseInputCommas(startingBalanceStr);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B12] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col justify-between">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.08, rotate: -5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-white font-black"
            >
              <Flame className="w-5 h-5 text-amber-300" />
            </motion.div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-black text-xl tracking-wider text-slate-900 dark:text-white uppercase">
                  Ignition
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  1st CAR VAULT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Pakistan's 30% Downpayment Engine & 70% Auto Lease Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileTap={{ rotate: 180 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border border-slate-200 dark:border-white/10"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Cockpit Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </motion.button>

            <button
              onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/20 hover:border-cyan-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              {tab === 'login' ? 'Create Account' : 'Driver Sign In'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Auth Portal */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Product Value, Story & Trust */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 dark:text-cyan-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target: ₨ 8.5 – 9.0 Lacs First Car Downpayment</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Stop dreaming about your first car. <br />
              <span className="bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 bg-clip-text text-transparent">
                Turn the ignition key.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              IGNITION is a dedicated finance tracker built for young Pakistanis to secure their <strong>30% downpayment</strong> and connect directly with <strong>70% auto lease & Islamic Ijarah bank financing</strong>.
            </p>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold">
                  <Car className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-heading font-bold text-slate-900 dark:text-white">
                  30% Downpayment Vault
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Real-time tachometer speedometer tracking your progress to ₨ 8.75 Lacs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-heading font-bold text-slate-900 dark:text-white">
                  70% Auto Lease Desk
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Match with Meezan Bank Ijarah, Alfalah & BankIslami with 1 click.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-heading font-bold text-slate-900 dark:text-white">
                  Impulse Stopper & Revs
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Daily gritty provocations and audio cues to keep your cash disciplined.
                </p>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center space-x-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Free Forever</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-cyan-500" />
                <span>Isolated Private Vault</span>
              </div>
              <span>•</span>
              <span>Calibrated for Pakistan</span>
            </div>
          </motion.div>

          {/* Right Column: Interactive Sign Up / Sign In Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl bg-slate-900/95 dark:bg-[#0E1422]/95 border border-cyan-500/30 text-white shadow-2xl shadow-cyan-950/50 p-6 sm:p-8 backdrop-blur-xl">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Form Tab Switcher */}
              <div className="flex rounded-2xl bg-white/5 p-1 mb-6 border border-white/10">
                <button
                  type="button"
                  onClick={() => { setTab('signup'); setLoginError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    tab === 'signup'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Driver Account
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('login'); setLoginError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    tab === 'login'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Driver Sign In
                </button>
              </div>

              {/* Tab 1: Sign Up Form */}
              {tab === 'signup' ? (
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
                        placeholder="e.g. Danish Ali"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none transition-colors"
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
                        placeholder="danish@example.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Vault Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password (min. 6 chars)"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Savings Calibration */}
                  <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-1 mb-1">
                        <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Exact Cash Saved Right Now (PKR ₨)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-sm font-black text-cyan-400">₨</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={startingBalanceStr}
                          onChange={handleBalanceChange}
                          placeholder="e.g. 1,50,000 (or leave 0)"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 focus:border-cyan-400 text-sm font-bold text-white outline-none"
                        />
                      </div>
                      {numericValue > 0 ? (
                        <p className="text-[11px] text-cyan-300 font-mono mt-1">
                          Current Fuel: <strong>₨ {startingBalanceStr}</strong> ({formatLacs(numericValue)})
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400 mt-1">
                          Starting at ₨ 0 is fine. Every rupee counts.
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

                      {/* Quick car pills */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {CAR_OPTIONS.slice(0, 3).map((car) => (
                          <button
                            key={car}
                            type="button"
                            onClick={() => setCarName(car)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${
                              carName === car
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                : 'bg-white/5 text-slate-400 border-white/10 hover:border-cyan-400/50'
                            }`}
                          >
                            {car.split(' ')[1] || car}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {signupError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center space-x-2"
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{signupError}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Claim Driver Pass & Launch Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="text-cyan-400 hover:underline font-bold"
                    >
                      Sign In here
                    </button>
                  </p>
                </form>
              ) : (
                /* Tab 2: Sign In Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. danish@example.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Vault Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your account password"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center space-x-2"
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center text-[11px] text-slate-400">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('signup')}
                      className="text-cyan-400 hover:underline font-bold"
                    >
                      Create free account
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </main>

      {/* Automotive Footer with Stealth Creator Access */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 py-6 bg-white/50 dark:bg-black/30 text-center text-xs text-slate-500 dark:text-slate-400 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-heading font-bold text-slate-700 dark:text-slate-300">
              IGNITION
            </span>
            <span>•</span>
            <span>Target: 8.5 – 9.0 Lacs PKR First Car Downpayment</span>
            {/* Discreet Stealth Creator Access Trigger */}
            <span
              onClick={onOpenCreatorModal}
              className="cursor-pointer opacity-20 hover:opacity-100 transition-opacity text-slate-400 hover:text-cyan-400 px-1"
              title="•"
            >
              •
            </span>
          </div>
          <p>
            Stay hungry. Stay disciplined. Turn the key.
          </p>
        </div>
      </footer>
    </div>
  );
};
