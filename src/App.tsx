import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User as UserIcon,
  Crown,
  Wallet,
  PlusCircle,
  ArrowUpRight,
  History,
  HelpCircle,
  Sparkles,
  Eye,
  EyeOff,
  LogOut,
  TrendingUp,
  Compass,
  Smartphone,
  CheckCircle,
  Database
} from 'lucide-react';
import { AccountTier, User, Offer, Transaction } from './types';
import Auth from './components/Auth';
import OperatorPacks from './components/OperatorPacks';
import AddMoneyFlow from './components/AddMoneyFlow';
import WithdrawFlow from './components/WithdrawFlow';
import HelpSupport from './components/HelpSupport';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'add_money' | 'withdraw'>('dashboard');
  const [activeTab, setActiveTab] = useState<'offers' | 'history' | 'database'>('offers');
  const [showBalance, setShowBalance] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize data on load
  useEffect(() => {
    // Check if user is logged in
    const cachedPhone = localStorage.getItem('current_user_phone');
    if (cachedPhone) {
      const savedUsersRaw = localStorage.getItem('users_database');
      const savedUsers: Record<string, User> = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};
      const foundUser = savedUsers[cachedPhone];
      if (foundUser) {
        setUser({
          name: foundUser.name,
          phone: foundUser.phone,
          tier: foundUser.tier,
          balance: parseFloat(foundUser.balance as any) || 0,
        });
      }
    }

    // Set initial realistic default transaction list
    const initialTxs: Transaction[] = [
      {
        id: 'tx-init-1',
        type: 'add_money',
        amount: 2500,
        details: 'bKash Wallet পেমেন্ট সফল',
        status: 'success',
        date: '২৫ মে, ২০২৬',
        gateway: 'bKash',
      },
      {
        id: 'tx-init-2',
        type: 'upgrade_tier',
        amount: 1550,
        details: 'বিজনেস অ্যাকাউন্ট আপগ্রেড সম্পন্ন',
        status: 'success',
        date: '২৫ মে, ২০২৬',
      }
    ];

    const cachedTxs = localStorage.getItem('transaction_logs');
    if (cachedTxs) {
      setTransactions(JSON.parse(cachedTxs));
    } else {
      setTransactions(initialTxs);
      localStorage.setItem('transaction_logs', JSON.stringify(initialTxs));
    }
  }, []);

  // Update backend cache of balance on change
  const updateOfflineUserBalance = (newBalance: number) => {
    if (!user) return;
    const updatedUser = { ...user, balance: newBalance };
    setUser(updatedUser);

    const savedUsersRaw = localStorage.getItem('users_database');
    const savedUsers: Record<string, User> = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};
    if (savedUsers[user.phone]) {
      savedUsers[user.phone].balance = newBalance;
      localStorage.setItem('users_database', JSON.stringify(savedUsers));
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user_phone');
    setUser(null);
    setActiveScreen('dashboard');
  };

  const handleAddMoneySuccess = (amount: number, details: string, txId: string) => {
    if (!user) return;
    const newBalance = user.balance + amount;
    updateOfflineUserBalance(newBalance);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'add_money',
      amount,
      details,
      status: 'success',
      date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      txId,
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    localStorage.setItem('transaction_logs', JSON.stringify(updatedTxs));
  };

  const handleWithdrawSuccess = (amount: number, gateway: string, targetNumber: string) => {
    if (!user) return;
    const newBalance = user.balance - amount;
    updateOfflineUserBalance(newBalance);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'withdraw',
      amount,
      details: `${gateway} উইথড্রল রিকোয়েস্ট সফল`,
      status: 'pending', // Pending request simulates admin approval
      date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      number: targetNumber,
      gateway,
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    localStorage.setItem('transaction_logs', JSON.stringify(updatedTxs));
  };

  const handlePurchaseSuccess = (offer: Offer, finalPrice: number, targetNumber: string) => {
    if (!user) return;
    const newBalance = user.balance - finalPrice;
    updateOfflineUserBalance(newBalance);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'buy_offer',
      amount: finalPrice,
      details: `${offer.title} (${targetNumber})`,
      status: 'success', // Displays success immediately
      date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      number: targetNumber,
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    localStorage.setItem('transaction_logs', JSON.stringify(updatedTxs));
  };

  // Auth Guard
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Active Screen Renderer helper
  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'add_money':
        return (
          <AddMoneyFlow
            user={user}
            onAddMoneySuccess={handleAddMoneySuccess}
            onBack={() => setActiveScreen('dashboard')}
          />
        );
      case 'withdraw':
        return (
          <WithdrawFlow
            user={user}
            onWithdrawSuccess={handleWithdrawSuccess}
            onBack={() => setActiveScreen('dashboard')}
          />
        );
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">বর্তমান সুবিধাসমূহ</span>
                  <span className="text-xs font-bold text-purple-700 capitalize">
                    {user.tier === 'personal' && 'পার্সোনাল প্যাক রেট'}
                    {user.tier === 'business' && '১৫ টাকা ছাড়/প্যাক'}
                    {user.tier === 'sub_admin' && '৩২ টাকা ছাড়/প্যাক'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">টোটাল ট্রানজেকশন</span>
                  <span className="text-sm font-black text-slate-800 tracking-tight">
                    {transactions.length} টি
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                  <CheckCircle size={16} />
                </div>
              </div>
            </div>

            {/* Feature portal Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              <button
                onClick={() => setActiveTab('offers')}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${activeTab === 'offers'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <Compass size={14} />
                ডিল ও অফার সমূহ
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${activeTab === 'history'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <History size={14} />
                আগের লেনদেন
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${activeTab === 'database'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <Database size={14} />
                ডাটাবেজ ও গাইড
              </button>
            </div>

            {/* Dynamic tabs render with animations */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'offers' && (
                  <OperatorPacks user={user} onPurchase={handlePurchaseSuccess} />
                )}

                {activeTab === 'history' && (
                  <div className="space-y-5 bg-white rounded-3xl p-5 border border-purple-50 shadow-md">
                    <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                      <h3 className="font-extrabold text-slate-800 text-sm">আপনার ট্রানজেকশনসমূহ</h3>
                      <span className="text-[10px] py-0.5 px-2 rounded-full bg-purple-50 text-purple-600 font-extrabold uppercase">
                        হিস্ট্রি লগ
                      </span>
                    </div>

                    {transactions.length > 0 ? (
                      <div className="space-y-3 shadow-inner max-h-96 overflow-y-auto pr-1">
                        {transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="p-3.5 rounded-2xl border border-slate-50 hover:border-purple-100 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between text-xs"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${tx.type === 'add_money'
                                ? 'bg-emerald-100 text-emerald-600'
                                : tx.type === 'withdraw'
                                  ? 'bg-rose-100 text-rose-600'
                                  : 'bg-indigo-100 text-indigo-600'
                                }`}>
                                {tx.type === 'add_money' ? 'ADD' : tx.type === 'withdraw' ? 'OUT' : 'BUY'}
                              </div>
                              <div className="space-y-1">
                                <p className="font-extrabold text-slate-800 leading-snug">{tx.details}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{tx.date}</p>
                              </div>
                            </div>

                            <div className="text-right space-y-1">
                              <p className={`font-black tracking-tight text-sm ${tx.type === 'add_money' ? 'text-emerald-600' : 'text-slate-800'
                                }`}>
                                {tx.type === 'add_money' ? '+' : '-'}৳{tx.amount.toFixed(2)}
                              </p>
                              {tx.status === 'pending' ? (
                                <span className="text-[9px] py-0.5 px-2 bg-amber-50 text-amber-600 border border-amber-100 font-extrabold rounded-full">
                                  পেন্ডিং
                                </span>
                              ) : (
                                <span className="text-[9px] py-0.5 px-2 bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold rounded-full">
                                  সফল
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-sm font-semibold text-slate-400">কোনো লেনদেন রেকর্ড পাওয়া যায়নি।</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'database' && <HelpSupport />}
              </motion.div>
            </AnimatePresence>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f5f3ff] via-[#fff5f5] to-[#fdf4ff] text-slate-800 font-sans relative overflow-hidden flex flex-col items-center py-8 px-4">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-purple-200 to-pink-100 blur-3xl opacity-60 -top-24 -left-12 z-0 animate-pulse duration-5000 pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-br from-pink-200 to-rose-100 blur-3xl opacity-50 -bottom-24 -right-12 z-0 pointer-events-none" />

      {/* Main Container styled as elegant Android / iOS hybrid phone frame on desktop */}
      <div className="w-full max-w-4xl bg-white/40 backdrop-blur-md rounded-[38px] border border-white/50 p-4 sm:p-5 shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 gap-6 relative">

        {/* Profile Sidebar */}
        <div className="md:col-span-4 bg-white/80 backdrop-blur-md border border-white rounded-[28px] p-6 flex flex-col justify-between gap-6 shadow-sm">
          {/* User info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3.5 border-b border-purple-50">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-purple-100">
                  <UserIcon size={22} />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-800 text-sm tracking-tight">{user.name}</h2>
                  <p className="text-[10px] text-slate-400 font-bold tracking-wider">{user.phone}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 flex items-center justify-center transition-all shadow-inner active:scale-95"
                title="লগআউট করুন"
              >
                <LogOut size={15} />
              </button>
            </div>

            {/* Custom Tap Balance Card Box */}
            <div className="bg-gradient-to-tr from-[#3a1d71] via-[#521356] to-[#7f005d] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden select-none border border-white/10">
              <div className="absolute top-0 right-0 w-16 h-full bg-white/5 transform skew-x-12 translate-x-4 pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-purple-200/80 font-bold block">Wallet Balance</span>
                  <div className="h-10 flex items-center">
                    {showBalance ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-2xl font-black tracking-tight"
                      >
                        ৳{user.balance.toFixed(2)}
                      </motion.span>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-bold tracking-wider text-purple-200"
                      >
                        ব্যালেন্স দেখতে টেপ করুন
                      </motion.span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all shadow-inner"
                  title={showBalance ? "ব্যালেন্স হাইড করুন" : "ব্যালেন্স দেখুন"}
                >
                  {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Account badge */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-white/90">
                <span className="flex items-center gap-1">
                  <Crown size={12} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                  {user.tier === 'personal' && 'Personal Account'}
                  {user.tier === 'business' && 'Business Member'}
                  {user.tier === 'sub_admin' && 'Sub Admin Portal'}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>

            {/* Action quick links */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">সহজ লেনদেন</span>

              <button
                onClick={() => { setActiveScreen('add_money'); }}
                className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-purple-100 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <PlusCircle size={16} />
                টাকা যোগ করুন (Add Money)
              </button>

              <button
                onClick={() => { setActiveScreen('withdraw'); }}
                className="w-full py-4.5 rounded-2xl bg-[#eff6ff] hover:bg-[#e0f2fe] text-[#2563eb] font-extrabold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <ArrowUpRight size={16} />
                টাকা উত্তোলন (Withdraw)
              </button>
            </div>
          </div>

          {/* Quick Notice footer */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] text-slate-500 leading-normal">
            ⚙️ <strong className="text-purple-600">NEW OFFER</strong> - এটি একটি প্রিমিয়াম মোবাইল অপারেটর পোর্টাল এবং টকটাইম/ইন্টারনেট অফার সিস্টেম।
          </div>
        </div>

        {/* Dynamic content Screen Area */}
        <div className="md:col-span-8 bg-white/80 backdrop-blur-md border border-white rounded-[28px] p-5 sm:p-6 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            {/* Real Top status layout matching video branding */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-50 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  NO
                </div>
                <div>
                  <h1 className="text-sm font-extrabold text-[#111] leading-none tracking-tight">NEW OFFER</h1>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#9333ea]">Premium App</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="py-1 px-3 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg border border-purple-100 flex items-center gap-1.5 capitalize animate-pulse">
                  <Sparkles size={11} className="text-pink-500" />
                  {user.tier} Account
                </span>

                {activeScreen !== 'dashboard' && (
                  <button
                    onClick={() => setActiveScreen('dashboard')}
                    className="py-1 px-3 text-slate-500 hover:text-purple-600 text-[10px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
                  >
                    ফিরে যান ↩
                  </button>
                )}
              </div>
            </div>

            {renderActiveScreen()}
          </div>
        </div>
      </div>
    </div>
  );
}
