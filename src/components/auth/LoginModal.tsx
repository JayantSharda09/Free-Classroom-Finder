import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, ShieldAlert, GraduationCap, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, showToast } = useApp();
  const [email, setEmail] = useState('student@college.edu');
  const [password, setPassword] = useState('student123');
  const [activeRole, setActiveRole] = useState<'student' | 'admin'>('student');
  const [isForgot, setIsForgot] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter an email address.', 'error');
      return;
    }
    const success = login(email, activeRole);
    if (success) {
      onClose();
    }
  };

  const handleQuickDemo = (role: 'student' | 'admin') => {
    const demoEmail = role === 'admin' ? 'admin@college.edu' : 'student@college.edu';
    login(demoEmail, role);
    onClose();
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetEmailSent(true);
    showToast('Password reset link sent to ' + email, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isForgot ? 'Reset Password' : 'Sign In to Campus'}
                </h3>
                <p className="text-xs text-slate-400">Free Classroom Finder Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isForgot ? (
            <>
              {/* Role Toggle Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 mb-6 bg-slate-950/60 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('student');
                    setEmail('student@college.edu');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeRole === 'student'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Student Role
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('admin');
                    setEmail('admin@college.edu');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeRole === 'admin'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Administrator
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@college.edu"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgot(true)}
                      className="text-xs text-teal-400 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-teal-900/30 transition-all flex items-center justify-center gap-2 group mt-2"
                >
                  <span>Sign In as {activeRole === 'admin' ? 'Admin' : 'Student'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Quick Demo Logins Section */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <p className="text-xs text-center text-slate-400 mb-3 font-medium">
                  Instant Demo 1-Click Access
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickDemo('student')}
                    className="py-2 px-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                    Demo Student
                  </button>

                  <button
                    onClick={() => handleQuickDemo('admin')}
                    className="py-2 px-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Demo Admin
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Forgot Password Flow */
            <div className="space-y-4">
              {resetEmailSent ? (
                <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-center space-y-2">
                  <ShieldAlert className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-semibold text-emerald-200">Reset Email Dispatched</h4>
                  <p className="text-xs text-slate-300">
                    If an account exists for <span className="font-semibold text-white">{email}</span>, you will receive instructions to reset your password.
                  </p>
                  <button
                    onClick={() => {
                      setIsForgot(false);
                      setResetEmailSent(false);
                    }}
                    className="mt-3 text-xs text-teal-400 font-semibold hover:underline block mx-auto"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Enter your college email address below and we'll send you instructions to reset your password.
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@college.edu"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-sm shadow-md transition-colors"
                  >
                    Send Reset Link
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsForgot(false)}
                    className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Back to Sign In
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
