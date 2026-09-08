import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  Terminal, 
  Lock, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CreatorTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatorTerminalModal: React.FC<CreatorTerminalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { unlockCreatorMode } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = unlockCreatorMode(passcode);
    if (ok) {
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-mono">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-sm rounded-2xl bg-[#090D14] border border-amber-500/40 text-white shadow-2xl p-6 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-amber-400 mb-2">
          <Terminal className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">
            CREATOR ACCESS TERMINAL
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-4 font-sans">
          Restricted to the creator of Ignition. Enter master security passcode:
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3 text-amber-500" />
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              placeholder="Enter Master Passcode..."
              autoFocus
              required
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black border border-amber-500/40 focus:border-amber-400 text-sm text-white font-mono outline-none"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-1.5 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Invalid Master Passcode. Access denied.</span>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all uppercase tracking-wider"
            >
              Verify Creator
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 rounded-xl bg-white/5 text-slate-400 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 text-center font-sans">
          Ignition Core Architecture • Master Key Protected
        </div>
      </motion.div>
    </div>
  );
};
