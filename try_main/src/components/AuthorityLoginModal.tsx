import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, User, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthorityLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (authorityName: string, role: string) => void;
}

export const AuthorityLoginModal: React.FC<AuthorityLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('sewasathi123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('Municipal Officer', 'Intake & Ward Administrator');
      onClose();
    }, 350);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md rounded-3xl bg-white border border-neutral-200 shadow-2xl overflow-hidden my-auto flex flex-col text-neutral-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-red-700" />
              <span className="font-sans-ui text-lg text-neutral-900 font-bold">Authority Login</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="text-left">
              <h3 className="font-sans-ui text-xl text-neutral-900 font-bold tracking-tight">
                Municipal Authority Portal
              </h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Access administrative controls to verify, assign, update progress, and resolve public complaints.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold font-mono">
                  Username / ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter official ID"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 font-mono shadow-xs"
                  />
                  <User size={15} className="absolute left-3 top-3 text-neutral-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold font-mono">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 font-mono shadow-xs"
                  />
                  <Lock size={15} className="absolute left-3 top-3 text-neutral-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full py-3 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 border border-red-700 hover:border-red-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-900/15 active:scale-[0.98]"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
