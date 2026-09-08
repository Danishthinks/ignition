import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Car, 
  Flame,
  Wallet,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  KeyRound,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatInputCommas, parseInputCommas, formatLacs } from '../utils/formatters';

const OFFICIAL_SUPPORT_WHATSAPP = '923134216028';
const DISPLAY_SUPPORT_WHATSAPP = '+92 313 4216028';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'signup' }) => {
  const { login, signup, resetPassword } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setLoginError('');
      setSignupError('');
      setRecoverStatus(null);
    }
  }, [isOpen, initialTab]);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Password / Account recovery state
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverNewPassword, setRecoverNewPassword] = useState('');
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);
  const [recoverStatus, setRecoverStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverStatus(null);
    if (!recoverEmail.trim() || !recoverNewPassword) return;

    if (recoverNewPassword.length < 6) {
      setRecoverStatus({
        type: 'error',
        message: 'New password must be at least 6 characters.'
      });
      return;
    }

    const res = resetPassword(recoverEmail.trim(), recoverNewPassword);
    if (res.success) {
      setRecoverStatus({
        type: 'success',
        message: res.message || 'Password reset successfully!'
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setRecoverStatus({
        type: 'error',
        message: res.message || 'Account recovery failed.'
      });
    }
  };

  const handleWhatsAppAssistance = () => {
    const text = `Salam Ignition Support! I need help recovering access to my car downpayment vault.`;
    const url = `https://api.whatsapp.com/send?phone=${OFFICIAL_SUPPORT_WHATSAPP}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Signup state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  // Start with empty string so NO annoying leading "0" exists
  const [startingBalanceStr, setStartingBalanceStr] = useState<string>('');
  const [carName, setCarName] = useState('Suzuki Alto VXR');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) return;
    const res = login(loginEmail.trim(), loginPassword);
    if (res.success) {
      onClose();
    } else {
      setLoginError(res.message || 'No driver account found with this email. Create your driver account below.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!name.trim() || !email.trim()) return;

    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters for security.');
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

    if (res.success) {
      onClose();
    } else {
      setSignupError(res.message || 'Could not create driver account.');
    }
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
          {tab === 'forgot' && (
            <button
              onClick={() => setTab('forgot')}
              className="flex-1 py-2 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-sm"
            >
              Recovery Help
            </button>
          )}
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setTab('forgot'); setLoginError(''); }}
                  className="text-[11px] text-cyan-400 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
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
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/25"
            >
              Sign In to Your Dashboard
            </button>

            <div className="pt-2 flex flex-col items-center space-y-1.5 text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => { setTab('forgot'); setLoginError(''); }}
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Forgot your email or need recovery help?
              </button>
              <p>
                New driver?{' '}
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Create a free account →
                </button>
              </p>
            </div>
          </form>
        ) : tab === 'signup' ? (
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

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
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
        ) : (
          /* Tab 3: Account Recovery & Assistance */
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-heading font-black text-base text-white">
                Account Recovery & Assistance
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Reset your password below using your registered email. If you forgot your email, contact our WhatsApp desk for manual assistance.
            </p>

            <form onSubmit={handleRecoverSubmit} className="space-y-3.5 pt-1">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Your Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                    placeholder="e.g. ali@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Set New Vault Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showRecoverPassword ? 'text' : 'password'}
                    value={recoverNewPassword}
                    onChange={(e) => setRecoverNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-sm text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecoverPassword(!showRecoverPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                  >
                    {showRecoverPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {recoverStatus && (
                <motion.div 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center space-x-2 ${
                    recoverStatus.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  {recoverStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                  )}
                  <span>{recoverStatus.message}</span>
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/25"
              >
                Reset Password & Unlock Vault
              </button>
            </form>

            {/* WhatsApp Assistance */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 mt-4">
              <div className="flex items-center space-x-2 text-emerald-400">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Forgot Your Registered Email?
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Contact our official WhatsApp support desk ({DISPLAY_SUPPORT_WHATSAPP}). Share your name or target car, and we will manually look up your account.
              </p>
              <button
                type="button"
                onClick={handleWhatsAppAssistance}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Support on WhatsApp ({DISPLAY_SUPPORT_WHATSAPP})</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                ← Back to Driver Sign In
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
