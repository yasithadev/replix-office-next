"use client";

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  ChevronLeft,
  Building2,
  Cpu
} from 'lucide-react';

// Custom inline SVG icons for social sign-in buttons
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
    />
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
    />
    <path
      fill="#FBBC05"
      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
    />
    <path
      fill="#34A853"
      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current text-zinc-100" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-4 h-4 fill-current text-zinc-100" viewBox="0 0 24 24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.67-.82 1.13-1.96.99-3.1-.98.04-2.18.66-2.88 1.48-.63.73-1.18 1.9-.1 3.02 1.09.08 2.21-.58 2.89-1.4z" />
  </svg>
);

// Single Static Background Image for Left Panel
const LEFT_PANEL_BG = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200";

export default function App() {
  // Navigation mode: 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState('login');
  
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
    
    if (!email || (mode !== 'forgot' && !password) || (mode === 'signup' && !name)) {
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
      <div className="relative w-full max-w-5xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[660px]">
        
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
        {/* RIGHT SIDE: Interactive Login/Signup/Forgot Form (7 cols)          */}
        {/* ================================================================= */}
        <div className="md:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-zinc-900">
          
          {/* Mobile Top Brand (visible on small screens) */}
          <div className="flex md:hidden flex-col gap-2 mb-6 pb-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
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
              
              <button 
                onClick={() => handleModeChange(mode === 'login' ? 'signup' : 'login')}
                className="text-xs text-indigo-400 font-medium hover:underline shrink-0"
              >
                {mode === 'login' ? 'Need an account?' : 'Already registered?'}
              </button>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5">
            {mode === 'forgot' && (
              <button
                onClick={() => handleModeChange('login')}
                className="inline-flex items-center text-xs text-zinc-400 hover:text-white transition-colors mb-2 gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Sign In
              </button>
            )}

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {mode === 'login' && 'Sign In to Portal'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-sm text-zinc-400">
              {mode === 'login' && 'Enter your authorization credentials to continue.'}
              {mode === 'signup' && 'Register your corporate identity for access.'}
              {mode === 'forgot' && "Provide your official email to recover account access."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="my-6 p-1 bg-zinc-800/80 rounded-xl flex items-center border border-zinc-700/50">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === 'login' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === 'signup' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              {errorMessage}
            </div>
          )}

          {isSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {mode === 'login' && 'Authenticated! Redirecting to System Dashboard...'}
              {mode === 'signup' && 'Account registered successfully.'}
              {mode === 'forgot' && 'Password recovery instructions sent.'}
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4 my-auto">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full bg-zinc-800/50 border border-zinc-700/60 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

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

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
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
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Authenticate'}
                    {mode === 'signup' && 'Register Account'}
                    {mode === 'forgot' && 'Send Recovery Email'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Authentication */}
          {mode !== 'forgot' && (
            <div className="mt-6 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <span className="relative px-3 bg-zinc-900 text-xs text-zinc-500 uppercase tracking-wider">
                  or sign in with SSO
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center py-2 px-3 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-300 hover:text-white transition-all text-xs font-medium gap-2"
                >
                  <GoogleIcon />
                  <span className="hidden sm:inline">Google</span>
                </button>
                
                <button
                  type="button"
                  className="flex items-center justify-center py-2 px-3 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-300 hover:text-white transition-all text-xs font-medium gap-2"
                >
                  <GithubIcon />
                  <span className="hidden sm:inline">GitHub</span>
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center py-2 px-3 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-300 hover:text-white transition-all text-xs font-medium gap-2"
                >
                  <AppleIcon />
                  <span className="hidden sm:inline">Apple</span>
                </button>
              </div>
            </div>
          )}

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