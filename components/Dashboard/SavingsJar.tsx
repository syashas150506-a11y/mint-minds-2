import React, { useState } from 'react';
import { PiggyBank, Plus, Minus, X, Check, ArrowRight } from 'lucide-react';

interface SavingsJarProps {
  balance: number;
  onUpdate: (newBalance: number) => void;
}

export const SavingsJar: React.FC<SavingsJarProps> = ({ balance = 0, onUpdate }) => {
  const [mode, setMode] = useState<'view' | 'deposit' | 'withdraw'>('view');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleTransaction = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    if (mode === 'deposit') {
      onUpdate((balance || 0) + value);
      reset();
    } else if (mode === 'withdraw') {
      if (value > (balance || 0)) {
        setError('Insufficient balance in Jar.');
        return;
      }
      onUpdate((balance || 0) - value);
      reset();
    }
  };

  const reset = () => {
    setMode('view');
    setAmount('');
    setError('');
  };

  const safeBalance = balance || 0;
  const percentFull = Math.min(100, Math.max(5, (safeBalance / 50000) * 100)); // Cap visual at 50k for demo

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-xl border border-amber-100 p-6 relative overflow-hidden h-full flex flex-col justify-between transition-all duration-300 hover:shadow-2xl">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <PiggyBank size={120} className="text-amber-600" />
      </div>

      <div className="z-10">
        <div className="flex justify-between items-start mb-4">
            <h3 className="font-extrabold text-amber-900 text-lg flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><PiggyBank size={20} /></div>
                Savings Jar
            </h3>
            {mode === 'view' && (
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full border border-amber-200">
                    Active
                </span>
            )}
        </div>

        {mode === 'view' ? (
            <div className="space-y-6 animate-fade-in">
                <div>
                    <p className="text-amber-700/60 text-xs font-bold uppercase mb-1">Current Balance</p>
                    <p className="text-4xl font-black text-amber-900 tracking-tight">
                        ₹{safeBalance.toLocaleString()}
                    </p>
                </div>

                {/* Visual Jar Level */}
                <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden border border-amber-100">
                    <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 ease-out" 
                        style={{ width: `${percentFull}%` }} 
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setMode('deposit')}
                        className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
                    >
                        <Plus size={16} /> Deposit
                    </button>
                    <button 
                        onClick={() => setMode('withdraw')}
                        className="flex items-center justify-center gap-2 bg-white border-2 border-amber-200 hover:border-amber-400 text-amber-700 py-3 rounded-xl font-bold text-sm transition-colors active:bg-amber-50"
                    >
                        <Minus size={16} /> Withdraw
                    </button>
                </div>
            </div>
        ) : (
            <div className="animate-fade-in-up h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold text-slate-700">
                        {mode === 'deposit' ? 'Add Money' : 'Withdraw Money'}
                    </p>
                    <button onClick={reset} className="p-1 hover:bg-amber-200/50 rounded-full text-amber-800 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                    <input 
                        type="number" 
                        autoFocus
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setError(''); }}
                        className={`w-full pl-8 pr-4 py-4 rounded-xl border-2 outline-none font-bold text-xl text-slate-800 transition-all ${error ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-amber-200 bg-white focus:border-amber-400'}`}
                        placeholder="0.00"
                    />
                </div>
                
                {error && <p className="text-red-500 text-xs font-bold mb-3 bg-red-50 p-2 rounded-lg">{error}</p>}

                <div className="mt-auto">
                    <button 
                        onClick={handleTransaction}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                            mode === 'deposit' 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/20' 
                            : 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-rose-500/20'
                        }`}
                    >
                        {mode === 'deposit' ? 'Add to Jar' : 'Withdraw'} <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};