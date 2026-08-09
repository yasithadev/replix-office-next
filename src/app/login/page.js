"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  ChevronLeft,
  Building2,
  Cpu
} from 'lucide-react';
import Authentication from './Authentication';
import { signIn } from './LoginAPI';
// Single Static Background Image for Left Panel
const LEFT_PANEL_BG = "/download.jpg";




export default function App() {
  const router = useRouter();

  // Navigation mode: 'login' | 'forgot'
  const [mode, setMode] = useState('login');
  
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Interactive UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || (mode === 'login' && !password)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (mode !== 'login') {
      // TODO: wire this branch to your password-reset endpoint separately
      return;
    }

    setIsLoading(true);

    try {
      const data = await signIn(email, password);

      // Populate the singleton so any component/page can call
      // Authentication.getInstance().hasPermission(...) afterwards
      Authentication.getInstance(data.token, data.permissions ?? []);

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        router.push('/'); // adjust to your actual post-login route
      }, 1200);
    } catch (err) {
      setIsLoading(false);

      if (err.message === 'INVALID_CREDENTIALS') {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Framed Container (Two-sided Card) */}
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 shadow-2xl shadow-slate-200/60 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* ================================================================= */}
        {/* LEFT SIDE: Static Image Panel with Logo, System Name & Footer    */}
        {/* ================================================================= */}
        <div className="relative md:col-span-5 hidden md:flex flex-col justify-between p-8 sm:p-10 overflow-hidden group border-r border-slate-100">
          
          {/* Static Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${LEFT_PANEL_BG})` }}
          />

          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-900/30" />

          {/* Center-Focused Prominent Brand Header: Company Logo, Name & System Name */}
          <div className="relative z-10 my-auto space-y-6">
            {/* Larger Company Logo Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-600/30 ring-1 ring-white/20">
              <Building2 className="w-9 h-9 text-white" />
            </div>

            <div className="space-y-2">
              {/* Larger Company Name */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
                Acme Global <span className="text-indigo-400">Inc.</span>
              </h1>
              
              {/* Larger System Name */}
              <div className="flex items-center gap-2 text-sm sm:text-base text-indigo-200 font-medium tracking-wide">
                <Cpu className="w-4.5 h-4.5 text-indigo-300 shrink-0" />
                <span>Enterprise Management System</span>
              </div>
            </div>
          </div>

          {/* Bottom Left Footer: Copyright, All Rights Reserved & Powered By */}
          <div className="relative z-10 pt-4 border-t border-white/15 space-y-1 text-xs text-slate-300">
            <p className="font-medium text-white">
              © {currentYear} Acme Global Inc. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-[11px] text-slate-300">
              <span>Powered by</span>
              <span className="font-semibold text-indigo-300">Vanguard Security Engine</span>
            </p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT SIDE: Interactive Login / Password Reset Form               */}
        {/* ================================================================= */}
        <div className="md:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
          
          {/* Mobile Top Brand (visible on small screens) */}
          <div className="flex md:hidden flex-col gap-2 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-slate-900 block leading-tight">Acme Global</span>
                <span className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  Enterprise Management System
                </span>
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5 pt-2">
            {mode === 'forgot' && (
              <button
                onClick={() => handleModeChange('login')}
                className="inline-flex items-center text-xs text-slate-500 hover:text-slate-900 transition-colors mb-2 gap-1 font-medium"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Sign In
              </button>
            )}

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Sign In to Portal' : 'Reset Password'}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === 'login' 
                ? 'Enter your authorization credentials to continue.' 
                : 'Provide your official email to recover account access.'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="my-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              {errorMessage}
            </div>
          )}

          {isSuccess && (
            <div className="my-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {mode === 'login' 
                ? 'Authenticated! Redirecting to System Dashboard...' 
                : 'Password recovery instructions sent.'}
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4 my-auto py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@acmeglobal.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all"
                />
              </div>
            </div>

            {mode === 'login' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => handleModeChange('forgot')}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-100 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-white cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer select-none">
                  Keep session active on this device
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' ? 'Authenticate' : 'Send Recovery Email'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Right Mobile Footer (shows on small screens) */}
          <div className="mt-6 pt-4 border-t border-slate-100 md:hidden text-center space-y-1 text-[11px] text-slate-400">
            <p>© {currentYear} Acme Global Inc. All rights reserved.</p>
            <p>Powered by Vanguard Security Engine</p>
          </div>

        </div>
      </div>
    </div>
  );
}