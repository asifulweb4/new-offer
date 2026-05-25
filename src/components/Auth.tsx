import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Lock, User, Crown, CreditCard, ShieldCheck, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { AccountTier, User as UserType } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTier, setSelectedTier] = useState<AccountTier>('personal');
  const [error, setError] = useState('');

  // Forgot Password step state elements
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [success, setSuccess] = useState('');

  // Pre-configured price packages
  const tierPrices = {
    personal: 550,
    business: 1550,
    sub_admin: 3150,
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotPhone) {
      setError('দয়া করে আপনার মোবাইল নম্বর দিন।');
      return;
    }

    if (forgotPhone.length < 11) {
      setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
      return;
    }

    // Check if user exists in database
    const savedUsersRaw = localStorage.getItem('users_database');
    const savedUsers: Record<string, UserType> = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};

    const userExists = savedUsers[forgotPhone] || forgotPhone === '01700000000';

    if (!userExists) {
      setError('সিস্টেমে এই মোবাইল নম্বর দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।');
      return;
    }

    // Simulate OTP sending
    setSuccess('আপনার মোবাইলে একটি ৪ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে। (কোড: 1234)');
    setForgotStep(2);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (forgotOtp !== '1234') {
      setError('ভেরিফিকেশন ওটিপি (OTP) সঠিক নয়। সঠিক কোডটি দিন (কোড: 1234)।');
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setError('নতুন পাসওয়ার্ড কমপক্ষে ৬ সংখ্যার হতে হবে।');
      return;
    }

    const savedUsersRaw = localStorage.getItem('users_database');
    const savedUsers: Record<string, UserType> = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};

    if (forgotPhone === '01700000000') {
      setError('দুঃখিত, টেস্ট/ডেমো অ্যাকাউন্টের পাসওয়ার্ড রিসেট করা যাবে না। অনুগ্রহ করে নতুন কোনো অ্যাকাউন্ট তৈরি করে ট্রাই করুন।');
      return;
    }

    if (savedUsers[forgotPhone]) {
      savedUsers[forgotPhone].password = forgotNewPassword;
      localStorage.setItem('users_database', JSON.stringify(savedUsers));
      setSuccess('পাসওয়ার্ড সফলভাবে রিসেট হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');

      setTimeout(() => {
        setIsForgotPassword(false);
        setForgotStep(1);
        setPhone(forgotPhone);
        setPassword('');
        setSuccess('');
        setError('');
      }, 2500);
    } else {
      setError('কোনো ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || !password || (isRegister && !name)) {
      setError('দয়া করে সব ঘর পূরণ করুন।');
      return;
    }

    if (phone.length < 11) {
      setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
      return;
    }

    if (isRegister) {
      // Save to localStorage simulated database
      const newUser: UserType = {
        name,
        phone,
        tier: selectedTier,
        balance: 0, // Starts with 0 balance
      };

      const savedUsersRaw = localStorage.getItem('users_database');
      const savedUsers: Record<string, UserType> = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};

      if (savedUsers[phone]) {
        setError('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে।');
        return;
      }

      savedUsers[phone] = { ...newUser, password };
      localStorage.setItem('users_database', JSON.stringify(savedUsers));
      localStorage.setItem('current_user_phone', phone);
      onLogin(newUser);
    } else {
      // Login flow
      const savedUsersRaw = localStorage.getItem('users_database');
      const savedUsers: Record<string, UserType> = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};

      const user = savedUsers[phone];
      if (user && user.password === password) {
        localStorage.setItem('current_user_phone', phone);
        onLogin({
          name: user.name,
          phone: user.phone,
          tier: user.tier,
          balance: user.balance,
        });
      } else {
        // Fallback for default test user or if database is empty
        if (phone === '01700000000' && password === '123456') {
          const defaultUser: UserType = {
            name: 'Asiful Islam',
            phone: '01700000000',
            tier: 'sub_admin',
            balance: 10500,
          };
          onLogin(defaultUser);
        } else {
          setError('ফোন নম্বর অথবা পাসওয়ার্ড ভুল। (টেস্ট অ্যাকাউন্ট: 01700000000 / ১২৩৪৫৬)');
        }
      }
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center bg-gradient-to-tr from-[#f5f3ff] via-[#fff5f5] to-[#fdf4ff] text-slate-800 font-sans relative overflow-hidden">
      {/* Decorative Orbs with Pink/Purple Gradients */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-r from-purple-200 to-pink-200 blur-3xl opacity-60 -top-20 -left-10 z-0 animate-pulse duration-5000" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-pink-200 to-indigo-200 blur-3xl opacity-50 -bottom-20 -right-10 z-0" />

      {/* Main Container */}
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 z-10 relative">
        <div className="text-center mb-6">
          {/* Logo */}
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-purple-500 via-pink-500 to-rose-400 rounded-2xl shadow-lg shadow-pink-200 text-white mb-3">
            <Crown size={32} className="animate-bounce" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 bg-clip-text text-transparent tracking-tight">
            NEW OFFER
          </h1>
          <p className="text-xs font-semibold text-purple-600 tracking-wider uppercase mt-1">
            Premium Operator Portal
          </p>
        </div>

        {isForgotPassword ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-purple-800">পাসওয়ার্ড পুনরুদ্ধার করুন</h2>
              <p className="text-xs text-slate-500 mt-1">আপনার রেজিস্টার্ড মোবাইল নম্বর দিয়ে ওটিপি ভেরিফাই করুন</p>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold"
              >
                {success}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                {error}
              </motion.div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-700 block">মোবাইল নম্বর</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-purple-400">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      placeholder="যেমন: 01XXXXXXXXX"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-purple-50/50 border border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-slate-800 text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(false); setForgotStep(1); setError(''); setSuccess(''); }}
                    className="flex-1 py-3.5 rounded-2xl border border-purple-200 font-bold text-sm text-purple-700 hover:bg-slate-50 transition-all text-center"
                  >
                    আগের পেজ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-md hover:underline transition-all text-center"
                  >
                    ওটিপি পাঠান
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-700 block text-center">৪ ডিজিটের কোড (OTP) লিখুন</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="কোড দিন (যেমন: 1234)"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-slate-800 text-sm font-bold text-center tracking-widest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-700 block">নতুন পাসওয়ার্ড</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-purple-400">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      placeholder="কমপক্ষে ৬ সংখ্যার নতুন পাসওয়ার্ড"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3.5 bg-purple-50/50 border border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-slate-800 text-sm font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-600"
                    >
                      {showForgotNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => { setForgotStep(1); setError(''); setSuccess(''); }}
                    className="flex-1 py-3.5 rounded-2xl border border-purple-200 font-bold text-sm text-purple-700 hover:bg-slate-50 transition-all text-center"
                  >
                    ধাপ পরিবর্তন
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-md hover:underline transition-all text-center"
                  >
                    পাসওয়ার্ড সেট করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* Toggle Mode Tab */}
            <div className="flex bg-purple-100 rounded-2xl p-1.5 mb-6">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${!isRegister
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-purple-700 hover:bg-purple-50'
                  }`}
              >
                লগইন
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${isRegister
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-purple-700 hover:bg-purple-50'
                  }`}
              >
                অ্যাকাউন্ট তৈরি
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-semibold flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-bold text-purple-700 block">আপনার নাম</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-purple-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="যেমন: আসিফুল ইসলাম"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-purple-50/50 border border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-slate-800 text-sm font-medium transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-purple-700 block">মোবাইল নম্বর <span className="text-slate-400 font-normal">(অ্যাকাউন্ট আইডি)</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-purple-400">
                    <Phone size={18} />
                  </span>
                  <input
                    type="tel"
                    placeholder="যেমন: 01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-purple-50/50 border border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-slate-800 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-purple-700 block">পাসওয়ার্ড</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-purple-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="৬ বা তার বেশি সংখ্যার পাসওয়ার্ড"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-purple-50/50 border border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-slate-800 text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isRegister && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setForgotPhone(phone); setError(''); setSuccess(''); }}
                    className="text-xs font-bold text-purple-600 hover:text-pink-600 hover:underline transition-colors"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                </div>
              )}

              {/* Registration Account Tier Choice with visual Pricing Cards */}
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 pt-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-purple-700 block">অ্যাকাউন্টের ধরন নির্বাচন করুন</label>
                    <span className="text-[10px] uppercase font-extrabold tracking-wide py-0.5 px-2 rounded-full bg-pink-100 text-pink-600">
                      NEW OFFER
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTier('personal')}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${selectedTier === 'personal'
                        ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-400 shadow-sm'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                        }`}
                    >
                      <User size={16} className={selectedTier === 'personal' ? 'text-purple-600' : 'text-slate-400'} />
                      <span className="text-[11px] font-bold mt-1 block">পার্সোনাল</span>
                      <span className="text-[10px] font-semibold text-purple-500">৳{tierPrices.personal}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTier('business')}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${selectedTier === 'business'
                        ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-400 shadow-sm'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                        }`}
                    >
                      <ShoppingBag size={16} className={selectedTier === 'business' ? 'text-pink-600' : 'text-slate-400'} />
                      <span className="text-[11px] font-bold mt-1 block">বিজনেস</span>
                      <span className="text-[10px] font-semibold text-pink-500">৳{tierPrices.business}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTier('sub_admin')}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${selectedTier === 'sub_admin'
                        ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400 shadow-sm'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                        }`}
                    >
                      <Crown size={16} className={selectedTier === 'sub_admin' ? 'text-amber-600' : 'text-slate-400'} />
                      <span className="text-[11px] font-bold mt-1 block">সাব অ্যাডমিন</span>
                      <span className="text-[10px] font-semibold text-amber-600">৳{tierPrices.sub_admin}</span>
                    </button>
                  </div>

                  {/* Dynamic Benefits Card Based on Choice */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-100 mt-2 text-xs leading-relaxed text-slate-700">
                    {selectedTier === 'personal' && (
                      <p>🔹 <strong className="text-purple-700">পার্সোনাল অ্যাকাউন্ট সুবিধা:</strong> আমাদের প্যাক রেট অনুযায়ী সকল অফার উপভোগ করতে পারবেন। অ্যাকাউন্ট অ্যাক্টিভেশন ফি মাত্র ৫৫০ টাকা।</p>
                    )}
                    {selectedTier === 'business' && (
                      <p>🔹 <strong className="text-pink-700">বিজনেস অ্যাকাউন্ট সুবিধা:</strong> প্রতিটি অফারের মূল দাম থেকে <strong className="underline">১৫ টাকা পর্যন্ত কমে</strong> অফার নিতে পারবেন। যারা নিয়মিত অফার সেল করেন তাদের জন্য এটি সবচেয়ে লাভজনক। অ্যাক্টিভেশন ফি ১৫৫০ টাকা।</p>
                    )}
                    {selectedTier === 'sub_admin' && (
                      <p>🔹 <strong className="text-amber-700">সাব অ্যাডমিন সুবিধা:</strong> প্রতিটি অফারের মূল্য থেকে <strong className="underline">৩২ টাকা পর্যন্ত কমে</strong> অফার পাবেন। হোলসেল ও বড় পরিসরে ব্যবসার জন্য এটি সবচেয়ে সুবিধাজনক ও লাভজনক। অ্যাক্টিভেশন ফি ৩১৫০ টাকা।</p>
                    )}
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:opacity-95 transition-all text-center flex items-center justify-center gap-2 relative overflow-hidden active:scale-98"
              >
                <div className="absolute top-0 right-0 w-16 h-full bg-white/20 transform skew-x-12 translate-x-12 animate-pulse duration-1000" />
                {isRegister ? `রেজিস্ট্রেশন করুন ও অ্যাক্টিভ করুন` : `অ্যাকাউন্টে প্রবেশ করুন`}
              </button>
            </form>

            {!isRegister && (
              <div className="mt-5 text-center p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-600">টেস্ট বা ডেমো ইউজার হিসেবে লগইন করতে:</p>
                <p>নম্বর: <strong className="text-purple-600">01700000000</strong> | পাসওয়ার্ড: <strong className="text-purple-600">123456</strong></p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Account Facility / Benefits Block Below login Box as beautifully described by user */}
      <div className="w-full max-w-lg mt-8 z-10">
        <div className="text-center mb-4">
          <h2 className="text-lg font-extrabold text-purple-800 flex items-center justify-center gap-1">
            <ShieldCheck className="text-pink-500" size={18} />
            অ্যাকাউন্ট সুবিধাসমূহ — NEW OFFER
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-1.5" />
        </div>

        <div className="space-y-3.5">
          {/* Facility 1 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/9w hover:bg-white border border-purple-100/80 shadow-md rounded-2xl p-4 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-100 to-pink-100 text-purple-600 flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm">Personal Account Facility</h3>
                  <span className="py-0.5 px-2 bg-purple-100 text-purple-700 text-[9px] font-bold rounded-full">৳৫৫০</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  পার্সোনাল অ্যাকাউন্ট নিলে আমাদের প্যাক রেট অনুযায়ী সকল অফার উপভোগ করতে পারবেন।
                </p>
              </div>
            </div>
          </motion.div>

          {/* Facility 2 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/90 hover:bg-white border border-pink-100/80 shadow-md rounded-2xl p-4 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-100 to-rose-100 text-pink-600 flex items-center justify-center shrink-0">
                <ShoppingBag size={16} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm">Business Account Facility</h3>
                  <span className="py-0.5 px-2 bg-pink-100 text-pink-700 text-[9px] font-bold rounded-full">৳১৫৫০</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  বিজনেস অ্যাকাউন্ট নিলে প্রতিটি অফারের মূল দাম থেকে <strong className="text-pink-600">১৫ টাকা পর্যন্ত কমে</strong> অফার নিতে পারবেন। যারা নিয়মিত অফার সেল করেন তাদের জন্য এটি বেশ লাভজনক।
                </p>
              </div>
            </div>
          </motion.div>

          {/* Facility 3 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/90 hover:bg-white border border-amber-100/80 shadow-md rounded-2xl p-4 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-100 to-orange-100 text-amber-600 flex items-center justify-center shrink-0">
                <Crown size={16} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm">Sub Admin Facility</h3>
                  <span className="py-0.5 px-2 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-full">৳৩১৫০</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  সাব অ্যাডমিন অ্যাকাউন্ট নিলে প্রতিটি অফারের মূল্য থেকে <strong className="text-amber-600">৩২ টাকা পর্যন্ত কমে</strong> অফার পাবেন। হোলসেল ও বড় পরিসরে ব্যবসার জন্য এটি সবচেয়ে সুবিধাজনক।
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
