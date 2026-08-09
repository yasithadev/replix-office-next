"use client";

import React, { useState, useEffect } from 'react';

// Custom SVGs to avoid external dependencies while maintaining visual excellence
const Icons = {
  Google: (props) => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 inline" {...props}>
      <path
        fill="#EA4335"
        d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 15.02.8 12 .8 7.42.8 3.51 3.42 1.64 7.27l3.9 3.03C6.46 7.42 9 5.04 12 5.04z"
      />
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.81-.07-1.6-.2-2.36H12v4.51h6.43c-.28 1.44-1.1 2.66-2.33 3.48l3.62 2.81c2.12-1.95 3.77-4.83 3.77-8.44z"
      />
      <path
        fill="#FBBC05"
        d="M5.54 14.7c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.64 7.07C.6 9.17 0 11.51 0 14s.6 4.83 1.64 6.93l3.9-3.23z"
      />
      <path
        fill="#34A853"
        d="M12 23.2c3.24 0 5.97-1.07 7.96-2.91l-3.62-2.81c-1.01.68-2.3 1.09-4.34 1.09-3 0-5.54-2.38-6.46-5.26l-3.9 3.03C3.51 20.58 7.42 23.2 12 23.2z"
      />
    </svg>
  ),
  Github: (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5 mr-2 inline" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  ),
  Eye: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644M12 5.625c4.478 0 8.268 2.943 9.542 7M12 18.375c-4.478 0-8.268-2.943-9.542-7m14.225 0a4.5 4.5 0 11-9.043 0 4.5 4.5 0 019.043 0z" />
    </svg>
  ),
  EyeOff: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ),
  CheckCircle: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 mr-1.5" {...props}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  )
};

const SLIDE_INTERVAL = 5000;
const brandingSlides = [
  {
    title: "Streamline your development pipeline.",
    description: "Connect your version control systems, setup secure environments, and deploy cloud-scale apps effortlessly.",
    author: "Elena Rostova",
    role: "Lead DevOps, TechVanguard"
  },
  {
    title: "Secure by default, fast by choice.",
    description: "Designed with industry-standard compliance. Built on highly optimized client modules and server pipelines.",
    author: "Marcus Aureli",
    role: "SecOps Director, CloudPinnacle"
  },
  {
    title: "Collaborative layouts and features.",
    description: "Engage with your development team in absolute real-time inside structured workspaces designed for execution.",
    author: "Sarah Connor",
    role: "Engineering Director, NextLayout"
  }
];

export default function SplitLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % brandingSlides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear validation error when user begins typing again
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isLogin && !formData.name.trim()) {
      tempErrors.name = "Name is required";
    }
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (!isLogin && !formData.agreeTerms) {
      tempErrors.agreeTerms = "You must agree to the Terms & Conditions";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');

    // Simulating API call latency
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(
        isLogin 
          ? "Logged in successfully! Redirecting..." 
          : "Account created successfully! Welcome aboard."
      );
      // Reset sensitive states
      setFormData({ name: '', email: '', password: '', agreeTerms: false });
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* LEFT PANEL: Branding & Dynamic Testimonials Section */}
      {/* Hidden on small viewports, fully customized immersive viewport on 1024px+ screens */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-slate-950 text-white overflow-hidden select-none">
        {/* Animated fluid abstract canvas gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-emerald-950 opacity-90" />
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[65%] h-[65%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        {/* Decorative Grid Pattern Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Brand Identity Header */}
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/20">
              N
            </span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              NextLayout
            </span>
          </div>

          {/* Interactive Testimonial Slider */}
          <div className="my-auto max-w-lg">
            <div className="relative h-52 flex flex-col justify-end">
              {brandingSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out transform ${
                    index === currentSlide
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                      : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                  }`}
                >
                  <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight mb-4 text-white">
                    {slide.title}
                  </h2>
                  <p className="text-slate-400 text-base leading-relaxed mb-6">
                    {slide.description}
                  </p>
                  
                  {/* Testimonial Quote Author Signature */}
                  <div className="flex items-center gap-3 border-t border-slate-800/60 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-slate-800 text-xs font-semibold text-white">
                      {slide.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-200">{slide.author}</div>
                      <div className="text-xs text-slate-500">{slide.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Navigation Pagination Bullets */}
            <div className="flex gap-2 mt-8">
              {brandingSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Footer legal text */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>© 2026 NextLayout Corp.</span>
            <div className="flex gap-4">
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Dynamic Authentication Form Panel */}
      {/* High performance, accessibility-compliant form layout */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-16 xl:px-24 bg-white">
        
        {/* Brand identity displayed on mobile layouts instead */}
        <div className="lg:hidden flex items-center gap-2 mb-10 self-start">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow">
            N
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">NextLayout</span>
        </div>

        <div className="w-full max-w-md">
          {/* Header switch elements */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              {isLogin ? "New to NextLayout? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setSuccessMessage('');
                }}
                className="font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition-colors"
              >
                {isLogin ? "Sign up for free" : "Sign in to account"}
              </button>
            </p>
          </div>

          {/* Success Banner Alert feedback panel */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center animate-fade-in">
              <Icons.CheckCircle className="flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Social Logins Action Triggers */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="flex items-center justify-center py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all duration-200"
            >
              <Icons.Google />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all duration-200"
            >
              <Icons.Github />
              GitHub
            </button>
          </div>

          {/* Form Divider Graphic Separator */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Primary Form Elements */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Dynamic Name Input - Sign Up Page Only */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 outline-none ${
                    errors.name 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
              </div>
            )}

            {/* Email Address Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 outline-none ${
                  errors.email 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-100' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
            </div>

            {/* Password Input Block with dynamic Visibility Toggle */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-4 pr-11 py-2.5 rounded-xl border text-sm transition-all duration-200 outline-none ${
                    errors.password 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>}
            </div>

            {/* Dynamic agreement layout checkboxes depends on action context */}
            {isLogin ? (
              <div className="flex items-center justify-between">
                <label className="relative flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all duration-200 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600">Keep me logged in</span>
                </label>
              </div>
            ) : (
              <div>
                <label className="relative flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 mt-0.5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all duration-200 cursor-pointer"
                  />
                  <span className="text-xs text-slate-500 leading-normal">
                    I agree to NextLayout's{" "}
                    <button type="button" className="text-indigo-600 font-semibold hover:underline">Terms of Service</button>
                    {" "}and{" "}
                    <button type="button" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</button>.
                  </span>
                </label>
                {errors.agreeTerms && <p className="mt-1 text-xs font-medium text-red-500">{errors.agreeTerms}</p>}
              </div>
            )}

            {/* Submit Action Button trigger */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-md shadow-indigo-500/10 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="ml-2">Connecting...</span>
                </div>
              ) : (
                <span>{isLogin ? "Sign In" : "Get Started Now"}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}