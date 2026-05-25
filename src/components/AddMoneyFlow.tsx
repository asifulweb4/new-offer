import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Crown, Copy, Check, Info, Coins, Send } from 'lucide-react';
import { User, Transaction } from '../types';

interface AddMoneyFlowProps {
  user: User;
  onAddMoneySuccess: (amount: number, details: string, txId: string) => void;
  onBack: () => void;
}

export default function AddMoneyFlow({ user, onAddMoneySuccess, onBack }: AddMoneyFlowProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('business');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [amount, setAmount] = useState('');
  const [txId, setTxId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Mobile Financial Service credentials in Bangladesh
  const walletDetails = {
    personal: {
      gateway: 'BKASH (PERSONAL)',
      phone: '01333858547',
      minAmount: 500,
      minAmountBn: '৫০০',
    },
    business: {
      gateway: 'NAGAD (PERSONAL)',
      phone: '01747156607',
      minAmount: 1450,
      minAmountBn: '১,৪৫০',
    },
  };

  const activeWallet = walletDetails[activeTab];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => {
      setCopiedNumber(false);
    }, 2000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('দয়া করে একটি সঠিক অংকের টাকা প্রদান করুন।');
      return;
    }

    if (parsedAmount < activeWallet.minAmount) {
      setErrorMsg(`দুঃখিত! ${activeTab === 'business' ? 'বিজনেস' : 'পার্সোনাল'} অ্যাকাউন্টের জন্য সর্বনিম্ন ৳${activeWallet.minAmount} অ্যাড করতে হবে।`);
      return;
    }

    if (!txId) {
      setErrorMsg('দয়া করে পেমেন্টের Transaction ID (TrxID) দিন।');
      return;
    }

    if (txId.length < 8) {
      setErrorMsg('সঠিক পেমেন্ট ভেরিফিকেশনের জন্য সঠিক Transaction ID দিন।');
      return;
    }

    // Success Simulation
    onAddMoneySuccess(parsedAmount, `${activeWallet.gateway} পেমেন্ট ভেরিফিকেশন`, txId);
    setSuccessMsg(`অভিনন্দন! আপনার ব্যালেন্সে সফলভাবে ৳${parsedAmount} যোগ হয়েছে।`);
    setAmount('');
    setTxId('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans">
      {/* Header Info Banner matching screenshot text */}
      <div className="text-center bg-gradient-to-r from-purple-100/50 via-pink-100/40 to-rose-100/50 p-4 rounded-3xl border border-purple-100/50">
        <p className="text-sm font-extrabold text-[#3a206a] leading-relaxed">
          আপনার অ্যাকাউন্টে ব্যালেন্স যোগ করতে নিচের ফর্মটি পূরণ করুন
        </p>
      </div>

      {/* Mode Tabs matching screenshot UI */}
      <div className="grid grid-cols-2 gap-3.5 bg-slate-100/70 p-2 rounded-2xl">
        <button
          onClick={() => { setActiveTab('personal'); setErrorMsg(''); }}
          className={`py-3 px-4 font-bold text-sm rounded-xl transition-all duration-300 ${
            activeTab === 'personal'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Personal Account
        </button>
        <button
          onClick={() => { setActiveTab('business'); setErrorMsg(''); }}
          className={`py-3 px-4 font-bold text-sm rounded-xl transition-all duration-300 ${
            activeTab === 'business'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Business Account
        </button>
      </div>

      {/* Support Instant Added banner matching screenshot light green box */}
      <div className="bg-[#effdf5] border border-emerald-100 rounded-3xl p-4.5 flex items-start gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#00a86b] flex items-center justify-center shrink-0 shadow-inner">
          <ShieldCheck size={22} />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-emerald-800 text-sm tracking-wide">
            তাৎক্ষণিক ব্যালেন্স যোগ!
          </h4>
          <p className="text-xs text-emerald-600 font-medium">
            সাবমিট করার সাথে সাথেই স্বয়ংক্রিয় ভেরিফিকেশনের মাধ্যমে আপনার ব্যালেন্সে টাকা যোগ হবে।
          </p>
        </div>
      </div>

      {/* Main card box matching screenshot block */}
      <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-md space-y-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-wider text-pink-500">
          সর্বনিম্ন রিকোয়ারমেন্ট
        </p>
        
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-500">
            {activeTab === 'business' ? 'Business' : 'Personal'} অ্যাকাউন্টের জন্য সর্বনিম্ন
          </p>
          <p className="text-3xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-rose-500 bg-clip-text text-transparent">
            {activeWallet.minAmountBn} টাকা
          </p>
          <p className="text-xs font-bold text-slate-400 mt-0.5">
            অ্যাড করতে হবে
          </p>
        </div>
      </div>

      {/* Golden opportunitiies / Sub Admin Promo card matching screen */}
      <div className="bg-gradient-to-r from-[#211749] via-[#3a1c71] to-[#6a3093] text-white rounded-3xl p-5 shadow-xl relative overflow-hidden flex items-start gap-4">
        {/* Floating background glowing ball */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 blur-xl rounded-full" />
        
        <div className="w-11 h-11 rounded-2xl bg-white/15 text-yellow-300 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
          <Crown size={22} className="animate-bounce" />
        </div>
        
        <div className="space-y-1.5 flex-1 z-10">
          <h4 className="font-extrabold text-white text-sm tracking-wide flex items-center gap-1.5">
            সাব এডমিন হওয়ার সুযোগ!
          </h4>
          <p className="text-xs text-purple-200/90 leading-relaxed font-semibold">
            আমাদের অ্যাকাউন্টে <span className="py-0.5 px-1.5 rounded bg-purple-100/20 text-white">সাব এডমিন</span> নিতে চাইলে মাত্র <span className="underline decoration-pink-400 font-extrabold">২,৯৫০ ৳</span> একবার যোগ করুন — সারাজীবন সর্বোচ্চ ব্যবসা ও ডাবল কমিশন সুবিধা উপভোগ করুন।
          </p>
        </div>
      </div>

      {/* MFS copy address & validation block */}
      <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-md space-y-5">
        <div className="text-center pb-2 border-b border-purple-50">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest block mb-1">প্রথমে টাকা সেন্ডমানি বা ক্যাশ ইন করুন</span>
          <div className="py-2.5 px-4 rounded-2xl bg-rose-50 text-rose-600 text-sm font-black tracking-wide inline-flex items-center gap-2">
            <span>{activeWallet.gateway}</span>
            <span className="text-xs p-1 bg-rose-100 text-rose-700 rounded-lg">PERSONAL</span>
          </div>
        </div>

        {/* Copy Wallet Phone Input */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="text-center sm:text-left space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">সেন্ডমানি করার নম্বর</span>
            <span className="text-lg font-black tracking-wider text-slate-800">{activeWallet.phone}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(activeWallet.phone)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copiedNumber ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copiedNumber ? 'কপি হয়েছে' : 'নম্বর কপি'}
            </button>
          </div>
        </div>

        {/* Validate inputs */}
        <form onSubmit={handleVerify} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl text-center flex flex-col items-center gap-2">
              <Check size={20} className="text-emerald-600 animate-bounce" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">কত টাকা সেন্ড করেছেন?</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Coins size={16} />
                </span>
                <input
                  type="number"
                  placeholder={`যেমন: ${activeWallet.minAmount}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-slate-800 font-extrabold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Transaction ID (TrxID)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Send size={16} className="-rotate-45" />
                </span>
                <input
                  type="text"
                  placeholder="যেমন: 8N7X2M9K"
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-slate-800 font-extrabold uppercase placeholder:lowercase"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-50/50 border border-purple-100/30 rounded-2xl flex items-start gap-2.5 text-[11px] text-purple-700">
            <Info size={14} className="shrink-0 mt-0.5 text-pink-500" />
            <p>
              নিরাপদ পেমেন্ট গেটওয়ে। আপনি পেমেন্ট করার পর ট্রানজেকশন ID এবং এমাউন্ট সাবমিট করলেই ৫-১০ সেকেন্ডে আপনার ব্যালেন্সে টাকা অটোমেটিক ক্র্যাডিত হবে।
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="py-3.5 rounded-xl border border-purple-100 font-extrabold text-xs text-purple-700 hover:bg-slate-50 active:scale-98 transition-all"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
            <button
              type="submit"
              className="py-3.5 rounded-xl bg-gradient-to-r from-purple-700 to-[#3a1c71] text-white font-extrabold text-xs hover:opacity-95 shadow-lg shadow-purple-100 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              Verify Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
