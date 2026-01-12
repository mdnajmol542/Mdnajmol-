
import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  LogIn, 
  UserPlus, 
  ArrowRightLeft, 
  History, 
  LogOut, 
  Smartphone, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck,
  ArrowUpRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Gateway, Transaction, AuthView, AppView, AppState } from './types';

const App: React.FC = () => {
  // Auth & Navigation States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  
  // User & App Data
  const [state, setState] = useState<AppState>({
    isLoggedIn: false,
    user: { name: 'ব্যবহারকারী', balance: 50000.00 },
    transactions: [],
  });

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    number: '', 
    amount: '' 
  });

  // Authentication logic
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authView === 'signup' && formData.password !== formData.confirmPassword) {
      alert("পাসওয়ার্ড দুটি মিলছে না!");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 1500);
  };

  // Direct Money Transfer Logic
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    if (!selectedGateway || !formData.number || isNaN(amount)) return;
    if (amount > (state.user?.balance || 0)) {
      alert("আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newTx: Transaction = {
        id: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        gateway: selectedGateway,
        amount: amount,
        accountNumber: formData.number,
        status: 'Success',
        timestamp: new Date().toLocaleString('bn-BD'),
        type: 'Withdraw'
      };

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, balance: prev.user.balance - amount } : null,
        transactions: [newTx, ...prev.transactions]
      }));

      setIsLoading(false);
      setShowSuccess(true);
      
      // Clear form and return to dashboard after success
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentView('dashboard');
        setSelectedGateway(null);
        setFormData({ ...formData, number: '', amount: '' });
      }, 3000);
    }, 2500);
  };

  // Auth Screen (Login/Signup)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-10 text-center text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold">Direct Pay</h1>
            <p className="text-indigo-100 mt-2 text-sm">সরাসরি টাকা পাঠানোর আধুনিক মাধ্যম</p>
          </div>

          <form onSubmit={handleAuth} className="p-8 space-y-5">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
              <button 
                type="button"
                onClick={() => setAuthView('login')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${authView === 'login' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500'}`}
              >
                লগইন
              </button>
              <button 
                type="button"
                onClick={() => setAuthView('signup')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${authView === 'signup' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500'}`}
              >
                রেজিস্ট্রেশন
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="ইমেইল এড্রেস"
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="পাসওয়ার্ড"
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {authView === 'signup' && (
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="কনফার্ম পাসওয়ার্ড"
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {authView === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                  <span>{authView === 'login' ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-lg mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Wallet size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Direct Pay</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Digital Wallet</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)} 
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-6 space-y-6">
        {/* Modern Balance Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
          
          <div className="relative z-10">
            <p className="text-indigo-100 text-sm font-medium opacity-90 mb-2">আপনার ব্যালেন্স</p>
            <h2 className="text-4xl font-black tracking-tight mb-8">
              ৳ {state.user?.balance.toLocaleString('bn-BD', { minimumFractionDigits: 2 })}
            </h2>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentView('transfer')}
                className="flex-1 bg-white text-indigo-600 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                <ArrowUpRight size={18} /> টাকা পাঠান
              </button>
              <button 
                onClick={() => setCurrentView('history')}
                className="bg-white/20 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-white/30 transition-all"
              >
                <History size={18} />
              </button>
            </div>
          </div>
        </div>

        {currentView === 'dashboard' && (
          <div className="space-y-6 animate-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">কুইক এক্সেস</h3>
              <span className="text-xs font-semibold text-indigo-500 px-3 py-1 bg-indigo-50 rounded-full">সরাসরি উইথড্র</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {(['bKash', 'Nagad', 'Rocket'] as Gateway[]).map(g => (
                <button 
                  key={g}
                  onClick={() => { setSelectedGateway(g); setCurrentView('transfer'); }}
                  className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3 hover:border-indigo-300 hover:shadow-md transition-all active:scale-95"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    g === 'bKash' ? 'bg-pink-100 text-pink-600' : 
                    g === 'Nagad' ? 'bg-orange-100 text-orange-600' : 
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    <Smartphone size={28} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{g}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-10">
              <h3 className="text-lg font-bold text-slate-800">সাম্প্রতিক লেনদেন</h3>
              <button onClick={() => setCurrentView('history')} className="text-indigo-600 text-sm font-bold hover:underline">সব দেখুন</button>
            </div>

            <div className="space-y-4">
              {state.transactions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <History size={32} />
                  </div>
                  <p className="text-slate-400 font-medium">এখনও কোনো লেনদেন হয়নি</p>
                </div>
              ) : (
                state.transactions.slice(0, 4).map(tx => (
                  <div key={tx.id} className="bg-white p-5 rounded-2xl border border-slate-50 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        tx.gateway === 'bKash' ? 'bg-pink-50 text-pink-500' : 
                        tx.gateway === 'Nagad' ? 'bg-orange-50 text-orange-500' : 
                        'bg-indigo-50 text-indigo-500'
                      }`}>
                        <ArrowRightLeft size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{tx.gateway} উইথড্র</p>
                        <p className="text-[11px] text-slate-400 font-medium">{tx.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-red-500">৳ {tx.amount.toLocaleString('bn-BD')}</p>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">সফল</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentView === 'transfer' && (
          <div className="animate-in">
             {showSuccess ? (
               <div className="bg-white p-12 rounded-[2.5rem] text-center shadow-2xl border border-green-50 border-t-4 border-t-green-500">
                 <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-short">
                   <CheckCircle2 size={48} />
                 </div>
                 <h2 className="text-3xl font-black text-slate-800 mb-3">টাকা সফলভাবে গেছে!</h2>
                 <p className="text-slate-500 leading-relaxed">
                   আপনার অনুরোধকৃত ৳{formData.amount} টাকা সফলভাবে {formData.number} নাম্বারে পাঠিয়ে দেওয়া হয়েছে।
                 </p>
                 <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">ট্রানজ্যাকশন আইডি</p>
                   <p className="font-mono font-bold text-indigo-600">{state.transactions[0]?.id}</p>
                 </div>
               </div>
             ) : (
               <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <button onClick={() => setCurrentView('dashboard')} className="mb-6 p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 font-bold text-sm">
                  ← ফিরে যান
                </button>
                <h2 className="text-2xl font-black text-slate-800 mb-8">টাকা উইথড্র করুন</h2>
                
                <div className="grid grid-cols-3 gap-3 mb-10">
                  {(['bKash', 'Nagad', 'Rocket'] as Gateway[]).map(g => (
                    <button 
                      key={g}
                      onClick={() => setSelectedGateway(g)}
                      className={`py-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                        selectedGateway === g 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100' 
                        : 'border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleTransfer} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">একাউন্ট নাম্বার</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="01XXXXXXXXX"
                      className="w-full px-6 py-5 rounded-[1.25rem] border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-bold tracking-widest"
                      value={formData.number}
                      onChange={e => setFormData({...formData, number: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">পরিমাণ (টাকা)</label>
                    <input 
                      type="number" 
                      required
                      min="100"
                      placeholder="৳ ০.০০"
                      className="w-full px-6 py-5 rounded-[1.25rem] border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-black text-2xl text-indigo-600"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isLoading || !selectedGateway}
                    className="w-full bg-indigo-600 text-white py-6 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:shadow-none"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'এখনই পাঠান'}
                  </button>
                </form>
               </div>
             )}
          </div>
        )}

        {currentView === 'history' && (
          <div className="animate-in space-y-6">
             <div className="flex items-center justify-between">
                <button onClick={() => setCurrentView('dashboard')} className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors">
                  ← ফিরে যান
                </button>
                <h2 className="text-xl font-black text-slate-800">লেনদেনের ইতিহাস</h2>
                <div className="w-10 h-10"></div>
             </div>
             
             <div className="space-y-4">
                {state.transactions.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">এখনও কোনো লেনদেন নেই</p>
                  </div>
                ) : (
                  state.transactions.map(tx => (
                    <div key={tx.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-50 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                          tx.gateway === 'bKash' ? 'bg-pink-50 text-pink-500' : 
                          tx.gateway === 'Nagad' ? 'bg-orange-50 text-orange-500' : 
                          'bg-indigo-50 text-indigo-500'
                        }`}>
                          <ArrowRightLeft size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800">{tx.gateway} উইথড্র</p>
                          <p className="text-xs text-slate-400 font-medium mb-1">{tx.timestamp}</p>
                          <code className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">ID: {tx.id}</code>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-red-500 text-lg">৳ {tx.amount.toLocaleString('bn-BD')}</p>
                        <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase tracking-tighter">সফল</span>
                      </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}
      </main>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/80 backdrop-blur-xl border border-white/20 px-8 py-5 flex justify-between items-center rounded-[2rem] shadow-2xl z-50">
        <button onClick={() => setCurrentView('dashboard')} className={`group flex flex-col items-center gap-1 transition-all ${currentView === 'dashboard' ? 'text-indigo-600 scale-110' : 'text-slate-300 hover:text-slate-500'}`}>
          <div className={`p-2 rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-indigo-50' : 'group-hover:bg-slate-50'}`}>
            <Wallet size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">হোম</span>
        </button>
        
        <button onClick={() => setCurrentView('transfer')} className={`group flex flex-col items-center gap-1 transition-all ${currentView === 'transfer' ? 'text-indigo-600 scale-110' : 'text-slate-300 hover:text-slate-500'}`}>
          <div className={`p-2 rounded-xl transition-all ${currentView === 'transfer' ? 'bg-indigo-50' : 'group-hover:bg-slate-50'}`}>
            <ArrowRightLeft size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">ট্রান্সফার</span>
        </button>
        
        <button onClick={() => setCurrentView('history')} className={`group flex flex-col items-center gap-1 transition-all ${currentView === 'history' ? 'text-indigo-600 scale-110' : 'text-slate-300 hover:text-slate-500'}`}>
          <div className={`p-2 rounded-xl transition-all ${currentView === 'history' ? 'bg-indigo-50' : 'group-hover:bg-slate-50'}`}>
            <History size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">হিস্ট্রি</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
