import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Check, AlertCircle, Phone } from 'lucide-react';
import { User } from '../types';

interface WithdrawFlowProps {
  user: User;
  onWithdrawSuccess: (amount: number, gateway: string, number: string) => void;
  onBack: () => void;
}

export default function WithdrawFlow({ user, onWithdrawSuccess, onBack }: WithdrawFlowProps) {
  const [gateway, setGateway] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!number || number.length < 11) {
      setError('দয়া করে সঠিক ১১ ডিজিটের রিসিভার নম্বর দিন।');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 100) {
      setError('সর্বনিম্ন ৳১০০ বা তার বেশি উত্তোলন করা যাবে।');
      return;
    }

    if (user.balance < withdrawAmount) {
      setError('দুঃখিত! আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।');
      return;
    }

    onWithdrawSuccess(withdrawAmount, gateway, number);
    setSuccess(`আপনার ৳${withdrawAmount} উইথড্রল রিকোয়েস্ট জমা হয়েছে এবং প্রসেস করা হচ্ছে।`);
    setAmount('');
    setNumber('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans">
      <div className="text-center bg-gradient-to-r from-purple-100/50 via-pink-100/40 to-rose-100/50 p-4 rounded-3xl border border-purple-100/50">
        <p className="text-sm font-extrabold text-[#3a206a]">
          নিরাপদে আপনার অ্যাকাউন্ট থেকে ক্যাশ আউট অথবা উইথড্র করুন
        </p>
      </div>

      {/* Available Balance Box */}
      <div className="bg-gradient-to-tr from-purple-700 to-pink-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <span className="text-[10px] font-bold tracking-widest text-purple-200 uppercase block">উত্তোলনযোগ্য ব্যালেন্স</span>
        <h3 className="text-4xl font-extrabold tracking-tight mt-1">৳{user.balance.toFixed(2)}</h3>
      </div>

      {/* Withdraw Main Form Card */}
      <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-md space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 block">উইথড্র গেটওয়ে সিলেক্ট করুন</label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['bKash', 'Nagad', 'Rocket'] as const).map((gw) => (
              <button
                key={gw}
                type="button"
                onClick={() => setGateway(gw)}
                className={`py-3 px-4 rounded-2xl border font-bold text-xs tracking-wider transition-all text-center ${
                  gateway === gw
                    ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm ring-2 ring-purple-100'
                    : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {gw}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl text-center flex flex-col items-center gap-2">
              <Check size={20} className="text-emerald-600 animate-bounce" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">রিসিভার মোবাইল নম্বর ({gateway})</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Phone size={16} />
              </span>
              <input
                type="tel"
                placeholder="যেমন: 01XXXXXXXXX"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">টাকার পরিমাণ (৳)</label>
            <input
              type="number"
              placeholder="সর্বনিম্ন ১০০ টাকা"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm font-bold text-slate-800"
            />
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
              className="py-3.5 rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 text-white font-extrabold text-xs hover:opacity-95 shadow-lg shadow-purple-100 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              উইথড্র কনফার্ম করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
