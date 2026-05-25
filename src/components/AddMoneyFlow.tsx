import React, { useState } from 'react';
import { motion } from 'framer-motion'; // এখানে 'motion/react' থেকে 'framer-motion' স্ট্যান্ডার্ড করা হয়েছে
import { ShieldCheck, Crown, Copy, Check, Info, Coins, Send } from 'lucide-react';
import { User, Transaction } from '../types';

interface AddMoneyFlowProps {
  user: User;
  onAddMoneySuccess: (amount: number, details: string, txId: string) => void;
  onBack: () => void;
}

export default function AddMoneyFlow({ user, onAddMoneySuccess, onBack }: AddMoneyFlowProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal'); // Default 'personal' স্ক্রিনশটের সাথে মিল রেখে
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [copiedType, setCopiedType] = useState<'bkash' | 'nagad' | null>(null);
  const [amount, setAmount] = useState('');
  const [txId, setTxId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // স্ক্রিনশট অনুযায়ী ডাইনামিক ডেটা অবজেক্ট
  const dataConfig = {
    personal: {
      minAmount: 550,
      minAmountBn: '৫৫০',
      subAdminAmountBn: '৩,১৫০',
      bkashPhone: '01333858547',
      nagadPhone: '01747156607',
    },
    business: {
      minAmount: 1550,
      minAmountBn: '১,৫৫০',
      subAdminAmountBn: '৩,১৫০',
      bkashPhone: '01333858547', // প্রয়োজন অনুযায়ী পরিবর্তন করতে পারেন
      nagadPhone: '01747156607',
    }
  };

  const currentData = dataConfig[activeTab];

  const handleCopy = (text: string, type: 'bkash' | 'nagad') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
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

    if (parsedAmount < currentData.minAmount) {
      setErrorMsg(`দুঃখিত! ${activeTab === 'business' ? 'বিজনেস' : 'পার্সোনাল'} অ্যাকাউন্টের জন্য সর্বনিম্ন ৳${currentData.minAmount} অ্যাড করতে হবে।`);
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

    const gatewayName = selectedMethod === 'bkash' ? 'BKASH (PERSONAL)' : 'NAGAD (PERSONAL)';

    // Success Simulation
    onAddMoneySuccess(parsedAmount, `${gatewayName} পেমেন্ট ভেরিফিকেশন`, txId);
    setSuccessMsg(`অভিনন্দন! আপনার ব্যালেন্সে সফলভাবে ৳${parsedAmount} যোগ হয়েছে।`);
    setAmount('');
    setTxId('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans">

      {/* Mode Tabs matching screenshot UI */}
      <div className="grid grid-cols-2 gap-3.5 bg-slate-100/70 p-2 rounded-2xl">
        <button
          onClick={() => { setActiveTab('personal'); setErrorMsg(''); }}
          className={`py-3 px-4 font-bold text-sm rounded-xl transition-all duration-300 ${activeTab === 'personal'
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
            : 'text-slate-600 hover:bg-slate-50'
            }`}
        >
          Personal Account
        </button>
        <button
          onClick={() => { setActiveTab('business'); setErrorMsg(''); }}
          className={`py-3 px-4 font-bold text-sm rounded-xl transition-all duration-300 ${activeTab === 'business'
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
            : 'text-slate-600 hover:bg-slate-50'
            }`}
        >
          Business Account
        </button>
      </div>

      {/* Support Instant Added banner */}
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

      {/* Main card box showing minimum amount based on active tab */}
      <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-md space-y-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-wider text-pink-500">
          সর্বনিম্ন রিকোয়ারমেন্ট
        </p>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-500">
            {activeTab === 'business' ? 'Business' : 'Personal'} অ্যাকাউন্টের জন্য সর্বনিম্ন
          </p>
          <p className="text-3xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-rose-500 bg-clip-text text-transparent">
            {currentData.minAmountBn} টাকা
          </p>
          <p className="text-xs font-bold text-slate-400 mt-0.5">
            অ্যাড করতে হবে
          </p>
        </div>
      </div>

      {/* Sub Admin Promo card */}
      <div className="bg-gradient-to-r from-[#211749] via-[#3a1c71] to-[#6a3093] text-white rounded-3xl p-5 shadow-xl relative overflow-hidden flex items-start gap-4">
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 blur-xl rounded-full" />
        <div className="w-11 h-11 rounded-2xl bg-white/15 text-yellow-300 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
          <Crown size={22} />
        </div>
        <div className="space-y-1.5 flex-1 z-10">
          <h4 className="font-extrabold text-white text-sm tracking-wide flex items-center gap-1.5">
            সাব এডমিন হওয়ার সুযোগ!
          </h4>
          <p className="text-xs text-purple-200/90 leading-relaxed font-semibold">
            আমাদের অ্যাকাউন্টে <span className="py-0.5 px-1.5 rounded bg-purple-100/20 text-white">সাব এডমিন</span> নিতে চাইলে মাত্র <span className="underline decoration-pink-400 font-extrabold">{currentData.subAdminAmountBn} ৳</span> একবার যোগ করুন — সারাজীবন সর্বোচ্চ ব্যবসা ও ডাবল কমিশন সুবিধা উপভোগ করুন।
          </p>
        </div>
      </div>

      {/* MFS side-by-side display & validation block */}
      <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-md space-y-5">

        {/* বিকাশ এবং নগদ নম্বর পাশাপাশি প্রদর্শনের জন্য গ্রিড লেআউট */}
        <div className="grid grid-cols-2 gap-3">
          {/* bKash Card */}
          <div className="p-3 bg-white border border-pink-100 rounded-2xl shadow-sm space-y-2">
            <div className="text-[10px] font-black text-pink-600 tracking-wide uppercase">
              BKASH [PERSONAL]
            </div>
            <div className="text-sm font-black text-slate-800 tracking-tight">
              {currentData.bkashPhone}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(currentData.bkashPhone, 'bkash')}
              className="w-full py-1.5 px-2 rounded-xl border border-pink-100 text-[11px] font-bold text-pink-600 bg-pink-50/50 flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              {copiedType === 'bkash' ? <Check size={12} /> : <Copy size={12} />}
              {copiedType === 'bkash' ? 'কপি হয়েছে' : 'Copy'}
            </button>
          </div>

          {/* Nagad Card */}
          <div className="p-3 bg-white border border-orange-100 rounded-2xl shadow-sm space-y-2">
            <div className="text-[10px] font-black text-orange-600 tracking-wide uppercase">
              NAGAD [PERSONAL]
            </div>
            <div className="text-sm font-black text-slate-800 tracking-tight">
              {currentData.nagadPhone}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(currentData.nagadPhone, 'nagad')}
              className="w-full py-1.5 px-2 rounded-xl border border-orange-100 text-[11px] font-bold text-orange-600 bg-orange-50/50 flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              {copiedType === 'nagad' ? <Check size={12} /> : <Copy size={12} />}
              {copiedType === 'nagad' ? 'কপি হয়েছে' : 'Copy'}
            </button>
          </div>
        </div>

        {/*পেমেন্ট গেটওয়ে মেথড সিলেক্টর ট্যাব (bKash / Nagad) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedMethod('bkash')}
            className={`py-2 px-3 text-xs font-black rounded-lg transition-all ${selectedMethod === 'bkash'
              ? 'bg-white text-purple-700 shadow-sm border border-purple-100'
              : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            bKash
          </button>
          <button
            type="button"
            onClick={() => setSelectedMethod('nagad')}
            className={`py-2 px-3 text-xs font-black rounded-lg transition-all ${selectedMethod === 'nagad'
              ? 'bg-white text-purple-700 shadow-sm border border-purple-100'
              : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Nagad
          </button>
        </div>

        {/* Validate inputs Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl text-center flex flex-col items-center gap-2">
              <Check size={20} className="text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Sender Number / Method Context */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                Sender Number ({selectedMethod === 'bkash' ? 'bKash' : 'Nagad'})
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <span className="text-xs font-bold">#</span>
                </span>
                <input
                  type="number"
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Transaction ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Transaction ID</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Send size={16} className="-rotate-45" />
                </span>
                <input
                  type="text"
                  placeholder="TRX1234567"
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm text-slate-800 font-extrabold uppercase"
                />
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">টাকার পরিমাণ (৳)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Coins size={16} />
                </span>
                <input
                  type="number"
                  placeholder={`সর্বনিম্ন ${currentData.minAmount} টাকা`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm text-slate-800 font-extrabold"
                />
              </div>
            </div>
          </div>



          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#502894] text-white font-extrabold text-xs shadow-lg active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              ⚡ তাৎক্ষনিক ভেরিফাই করুন
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 rounded-xl border border-slate-200 font-extrabold text-xs text-slate-600 bg-white hover:bg-slate-50 active:scale-98 transition-all flex items-center justify-center gap-1"
            >
              ↩ ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}