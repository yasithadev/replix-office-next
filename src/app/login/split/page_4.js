"use client";

import React, { useState } from 'react';
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

// Single Static Background Image for Left Panel
const LEFT_PANEL_BG = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200";

export default function App() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || (mode === 'login' && !password)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1200);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Framed Container (Two-sided Card) */}
      <div className="relative w-full max-w-5xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* ================================================================= */}
        {/* LEFT SIDE: Static Image Panel with Logo, System Name & Footer    */}
        {/* ================================================================= */}
        <div className="relative md:col-span-5 hidden md:flex flex-col justify-between p-8 sm:p-10 overflow-hidden group border-r border-zinc-800/80">
          
          {/* Static Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${LEFT_PANEL_BG})` }}
          />

          {/* Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/50" />

          {/* Center-Focused Prominent Brand Header: Company Logo, Name & System Name */}
          <div className="relative z-10 my-auto space-y-6">
            {/* Larger Company Logo Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 ring-1 ring-white/20">
              <Building2 className="w-9 h-9 text-white" />
            </div>

            <div className="space-y-2">
              {/* Larger Company Name */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
                Acme Global <span className="text-indigo-400">Inc.</span>
              </h1>
              
              {/* Larger System Name */}
              <div className="flex items-center gap-2 text-sm sm:text-base text-indigo-300 font-medium tracking-wide">
                <Cpu className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                <span>Enterprise Management System</span>
              </div>
            </div>
          </div>

          {/* Bottom Left Footer: Copyright, All Rights Reserved & Powered By */}
          <div className="relative z-10 pt-4 border-t border-white/10 space-y-1 text-xs text-zinc-400">
            <p className="font-medium text-zinc-300">
              © {currentYear} Acme Global Inc. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-[11px] text-zinc-400">
              <span>Powered by</span>
              <span className="font-semibold text-indigo-300">Vanguard Security Engine</span>
            </p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT SIDE: Interactive Login / Password Reset Form               */}
        {/* ================================================================= */}
        <div className="md:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-zinc-900">
          
          {/* Mobile Top Brand (visible on small screens) */}
          <div className="flex md:hidden flex-col gap-2 mb-6 pb-4 border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white block leading-tight">Acme Global</span>
                <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
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
                className="inline-flex items-center text-xs text-zinc-400 hover:text-white transition-colors mb-2 gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Sign In
              </button>
            )}

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {mode === 'login' ? 'Sign In to Portal' : 'Reset Password'}
            </h2>
            <p className="text-sm text-zinc-400">
              {mode === 'login' 
                ? 'Enter your authorization credentials to continue.' 
                : 'Provide your official email to recover account access.'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="my-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              {errorMessage}
            </div>
          )}

          {isSuccess && (
            <div className="my-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {mode === 'login' 
                ? 'Authenticated! Redirecting to System Dashboard...' 
                : 'Password recovery instructions sent.'}
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4 my-auto py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@acmeglobal.com"
                  className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {mode === 'login' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
                  <button
                    type="button"
                    onClick={() => handleModeChange('forgot')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
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
                  className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900"
                />
                <label htmlFor="remember" className="text-xs text-zinc-400 cursor-pointer select-none">
                  Keep session active on this device
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
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
          <div className="mt-6 pt-4 border-t border-zinc-800/80 md:hidden text-center space-y-1 text-[11px] text-zinc-500">
            <p>© {currentYear} Acme Global Inc. All rights reserved.</p>
            <p>Powered by Vanguard Security Engine</p>
          </div>

        </div>
      </div>
    </div>
  );
}