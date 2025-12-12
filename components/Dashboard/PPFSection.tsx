import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Coins, 
  CalendarClock, 
  TrendingUp, 
  ArrowRight, 
  IndianRupee, 
  Calculator, 
  Info,
  CheckCircle2,
  Lock,
  Building2,
  ArrowLeftRight,
  Star,
  Smartphone,
  Globe,
  Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PPFData {
  amount: string;
  frequency: 'Monthly' | 'Yearly';
  startYear: string;
  tenure: string;
  age: string;
  goalAmount: string;
  existingBalance: string;
}

interface BankInfo {
  id: string;
  name: string;
  rate: string;
  minDeposit: string;
  digitalScore: number; // Out of 5
  customerRating: number; // Out of 5
  onlineOpening: boolean;
  features: string[];
  color: string;
}

const PPF_BANKS: BankInfo[] = [
  { 
    id: 'sbi', 
    name: 'State Bank of India', 
    rate: '7.1%', 
    minDeposit: '₹500', 
    digitalScore: 4.2, 
    customerRating: 4.5, 
    onlineOpening: true, 
    features: ['Largest Network', 'YONO App Support', 'Auto-Sweep'],
    color: 'bg-blue-50 text-blue-700'
  },
  { 
    id: 'hdfc', 
    name: 'HDFC Bank', 
    rate: '7.1%', 
    minDeposit: '₹500', 
    digitalScore: 4.8, 
    customerRating: 4.6, 
    onlineOpening: true, 
    features: ['Instant Opening', 'Seamless Netbanking', '24/7 Support'],
    color: 'bg-indigo-50 text-indigo-700'
  },
  { 
    id: 'icici', 
    name: 'ICICI Bank', 
    rate: '7.1%', 
    minDeposit: '₹500', 
    digitalScore: 4.7, 
    customerRating: 4.5, 
    onlineOpening: true, 
    features: ['iMobile Integration', 'One-Click Investment', 'Paperless'],
    color: 'bg-orange-50 text-orange-700'
  },
  { 
    id: 'axis', 
    name: 'Axis Bank', 
    rate: '7.1%', 
    minDeposit: '₹500', 
    digitalScore: 4.4, 
    customerRating: 4.3, 
    onlineOpening: true, 
    features: ['Quick Transfer', 'Statement Analysis', 'Tax Reports'],
    color: 'bg-rose-50 text-rose-700'
  },
  { 
    id: 'kotak', 
    name: 'Kotak Mahindra', 
    rate: '7.1%', 
    minDeposit: '₹500', 
    digitalScore: 4.6, 
    customerRating: 4.4, 
    onlineOpening: true, 
    features: ['811 Integration', 'Zero Paperwork', 'Video KYC'],
    color: 'bg-red-50 text-red-700'
  },
  { 
    id: 'pnb', 
    name: 'Punjab National Bank', 
    rate: '7.1%', 
    minDeposit: '₹500', 
    digitalScore: 3.8, 
    customerRating: 4.0, 
    onlineOpening: false, 
    features: ['Govt Backed', 'Wide Reach', 'Secure'],
    color: 'bg-yellow-50 text-yellow-700'
  },
];

export const PPFSection: React.FC = () => {
  const [step, setStep] = useState<'info' | 'form' | 'result' | 'comparison'>('info');
  const [data, setData] = useState<PPFData>({
    amount: '10000',
    frequency: 'Yearly',
    startYear: new Date().getFullYear().toString(),
    tenure: '15',
    age: '',
    goalAmount: '',
    existingBalance: '0'
  });

  const [result, setResult] = useState<{
    invested: number;
    interest: number;
    maturity: number;
    chartData: any[];
  } | null>(null);

  // Comparison State
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [isFetchingBanks, setIsFetchingBanks] = useState(false);

  const calculatePPF = () => {
    const P = parseFloat(data.amount); // Installment
    const r = 7.1 / 100; // Interest Rate (approx)
    const n = parseInt(data.tenure); // Years
    const initialBalance = parseFloat(data.existingBalance) || 0;
    
    let currentBalance = initialBalance;
    let totalInvested = initialBalance;
    const chartData = [];
    const startYear = parseInt(data.startYear);

    // Simple yearly compounding approximation for visualization
    for (let i = 1; i <= n; i++) {
        const yearlyInvestment = data.frequency === 'Monthly' ? P * 12 : P;
        
        // Add investment
        currentBalance += yearlyInvestment;
        totalInvested += yearlyInvestment;
        
        // Add Interest
        const interest = currentBalance * r;
        currentBalance += interest;

        chartData.push({
            year: startYear + i,
            balance: Math.round(currentBalance),
            invested: Math.round(totalInvested)
        });
    }

    setResult({
        invested: Math.round(totalInvested),
        interest: Math.round(currentBalance - totalInvested),
        maturity: Math.round(currentBalance),
        chartData
    });
    setStep('result');
  };

  const handleCompareClick = () => {
      setIsFetchingBanks(true);
      // Simulate API call
      setTimeout(() => {
          setIsFetchingBanks(false);
          setStep('comparison');
      }, 1500);
  };

  const toggleBankSelection = (id: string) => {
    if (selectedBanks.includes(id)) {
        setSelectedBanks(selectedBanks.filter(b => b !== id));
    } else {
        if (selectedBanks.length < 3) {
            setSelectedBanks([...selectedBanks, id]);
        }
    }
  };

  const renderInfo = () => (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-amber-100 rounded-2xl text-amber-600 shadow-sm">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800">Public Provident Fund (PPF)</h2>
                        <p className="text-slate-500 font-medium">A to Z Guide to India's most trusted investment.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                        <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                            <CheckCircle2 size={20} /> Key Benefits
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Government Backed: 100% Risk-free returns.",
                                "EEE Tax Status: Exempt on Investment, Interest & Maturity.",
                                "Current Interest Rate: 7.1% p.a. (Compounded Annually).",
                                "Loan Facility: Available against balance from 3rd year."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Info size={20} /> Rules & Limits
                        </h3>
                         <ul className="space-y-3">
                            {[
                                "Lock-in Period: 15 Years (Can extend in blocks of 5).",
                                "Min Investment: ₹500 per financial year.",
                                "Max Investment: ₹1.5 Lakh per financial year.",
                                "Partial Withdrawal: Allowed from 7th financial year."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={() => setStep('form')}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-amber-500/30 transition-all transform hover:-translate-y-1"
                    >
                        Calculate Returns <Calculator size={20} />
                    </button>
                    <button 
                        onClick={handleCompareClick}
                        disabled={isFetchingBanks}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 hover:border-amber-500 text-slate-700 hover:text-amber-600 rounded-xl font-bold text-lg transition-all"
                    >
                        {isFetchingBanks ? <Loader2 className="animate-spin" size={20} /> : <Building2 size={20} />}
                        {isFetchingBanks ? "Fetching Banks..." : "Compare Banks"}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  const renderComparison = () => {
      const selectedBankData = PPF_BANKS.filter(b => selectedBanks.includes(b.id));

      return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
             <div className="flex items-center justify-between">
                <button onClick={() => setStep('info')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold">
                    <ArrowRight className="rotate-180" size={20} /> Back to Guide
                </button>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-slate-800">Bank Comparison</h2>
                    <p className="text-slate-500 text-sm">Select up to 3 banks to compare features</p>
                </div>
             </div>

             {/* Bank Selection Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PPF_BANKS.map(bank => {
                    const isSelected = selectedBanks.includes(bank.id);
                    return (
                        <button 
                            key={bank.id}
                            onClick={() => toggleBankSelection(bank.id)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                                isSelected 
                                ? 'border-amber-500 bg-amber-50 shadow-md' 
                                : 'border-slate-100 bg-white hover:border-amber-200'
                            }`}
                        >
                             <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg ${bank.color}`}>
                                    <Building2 size={24} />
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-amber-500 border-amber-500' : 'border-slate-300'}`}>
                                    {isSelected && <CheckCircle2 size={16} className="text-white" />}
                                </div>
                             </div>
                             <h3 className="font-bold text-slate-800 text-lg mb-1">{bank.name}</h3>
                             <div className="flex items-center gap-1 mb-2">
                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-sm font-bold text-slate-600">{bank.customerRating}</span>
                             </div>
                             <p className="text-xs text-slate-500 font-medium line-clamp-1">{bank.features.join(' • ')}</p>
                        </button>
                    )
                })}
             </div>

             {/* Comparison Table */}
             {selectedBanks.length > 0 && (
                 <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
                    <div className="p-6 bg-slate-50 border-b border-slate-200">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            <ArrowLeftRight size={20} className="text-amber-600" /> Side-by-Side Comparison
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="p-4 text-left text-sm font-medium text-slate-400 w-1/4">Feature</th>
                                    {selectedBankData.map(bank => (
                                        <th key={bank.id} className="p-4 text-left text-slate-800 font-bold text-lg min-w-[200px]">
                                            {bank.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-4 text-sm font-bold text-slate-500">Interest Rate</td>
                                    {selectedBankData.map(bank => (
                                        <td key={bank.id} className="p-4 font-bold text-emerald-600">{bank.rate}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-4 text-sm font-bold text-slate-500">Min. Deposit</td>
                                    {selectedBankData.map(bank => (
                                        <td key={bank.id} className="p-4 text-slate-700">{bank.minDeposit}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-4 text-sm font-bold text-slate-500">Online Opening</td>
                                    {selectedBankData.map(bank => (
                                        <td key={bank.id} className="p-4">
                                            {bank.onlineOpening ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                                    <Globe size={12} /> Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                                                    Visit Branch
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-4 text-sm font-bold text-slate-500">Digital Experience</td>
                                    {selectedBankData.map(bank => (
                                        <td key={bank.id} className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star 
                                                            key={s} 
                                                            size={14} 
                                                            className={`${s <= Math.round(bank.digitalScore) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold text-slate-400">({bank.digitalScore})</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-4 text-sm font-bold text-slate-500">Key Features</td>
                                    {selectedBankData.map(bank => (
                                        <td key={bank.id} className="p-4">
                                            <ul className="space-y-1">
                                                {bank.features.map((f, i) => (
                                                    <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-amber-500" />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                 </div>
             )}
             
             {selectedBanks.length === 0 && (
                 <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                     <p className="text-slate-400 font-medium">Select banks above to see a comparison.</p>
                 </div>
             )}
        </div>
      );
  };

  const renderForm = () => (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                    <button onClick={() => setStep('info')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                        <ArrowRight className="rotate-180" size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800">Plan Your PPF</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Amount */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Deposit Amount (₹)</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="number" 
                                value={data.amount}
                                onChange={(e) => setData({...data, amount: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-800"
                                placeholder="e.g. 5000"
                            />
                        </div>
                    </div>

                    {/* Frequency */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Deposit Frequency</label>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            {['Monthly', 'Yearly'].map((freq) => (
                                <button
                                    key={freq}
                                    onClick={() => setData({...data, frequency: freq as any})}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                        data.frequency === freq 
                                        ? 'bg-white text-amber-600 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {freq}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Start Year */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Start Year</label>
                        <div className="relative">
                            <CalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="number" 
                                value={data.startYear}
                                onChange={(e) => setData({...data, startYear: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Tenure */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                            <span>Tenure (Years)</span>
                            <span className="text-amber-600">{data.tenure} Years</span>
                        </label>
                        <input 
                            type="range" 
                            min="15" 
                            max="50" 
                            step="5"
                            value={data.tenure}
                            onChange={(e) => setData({...data, tenure: e.target.value})}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">* Min 15 Years (Lock-in)</p>
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Current Age</label>
                        <input 
                            type="number" 
                            value={data.age}
                            onChange={(e) => setData({...data, age: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-800"
                            placeholder="e.g. 25"
                        />
                    </div>

                     {/* Optional Fields Toggle */}
                     <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">Existing Balance (Optional)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="number" 
                                    value={data.existingBalance}
                                    onChange={(e) => setData({...data, existingBalance: e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-300 outline-none font-medium text-slate-600"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">Target Goal Amount (Optional)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="number" 
                                    value={data.goalAmount}
                                    onChange={(e) => setData({...data, goalAmount: e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-300 outline-none font-medium text-slate-600"
                                    placeholder="e.g. 5000000"
                                />
                            </div>
                        </div>
                     </div>
                </div>

                <button 
                    onClick={calculatePPF}
                    disabled={!data.amount || !data.tenure || !data.startYear}
                    className="w-full mt-8 flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Calculator size={20} /> Calculate Returns
                </button>
            </div>
        </div>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-4xl mx-auto animate-fade-in-up space-y-8">
        <button onClick={() => setStep('form')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold">
            <ArrowRight className="rotate-180" size={20} /> Modify Inputs
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Invested</p>
                <p className="text-2xl font-extrabold text-slate-800">₹{result?.invested.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Interest Earned</p>
                <p className="text-2xl font-extrabold text-emerald-500">+₹{result?.interest.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-3xl shadow-xl shadow-amber-500/20 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                <p className="text-amber-100 text-xs font-bold uppercase mb-2">Maturity Value</p>
                <p className="text-3xl font-extrabold">₹{result?.maturity.toLocaleString()}</p>
                <p className="text-[10px] text-amber-200 mt-1">@ 7.1% p.a.</p>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-[400px]">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="text-amber-500" /> Growth Trajectory
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result?.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorMaturity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#cbd5e1" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#cbd5e1" fontSize={12} tickFormatter={(val) => `₹${val/1000}k`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="invested" stackId="1" stroke="#94a3b8" fill="url(#colorInvested)" name="Invested Amount" />
                    <Area type="monotone" dataKey="balance" stackId="2" stroke="#f59e0b" fill="url(#colorMaturity)" name="Maturity Value" />
                </AreaChart>
            </ResponsiveContainer>
        </div>

        {/* Goal Check */}
        {data.goalAmount && result && (
             <div className={`p-6 rounded-2xl border ${result.maturity >= parseFloat(data.goalAmount) ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                    {result.maturity >= parseFloat(data.goalAmount) ? (
                        <CheckCircle2 className="text-emerald-500 mt-1" />
                    ) : (
                        <Lock className="text-red-500 mt-1" />
                    )}
                    <div>
                        <h4 className={`font-bold ${result.maturity >= parseFloat(data.goalAmount) ? 'text-emerald-800' : 'text-red-800'}`}>
                            {result.maturity >= parseFloat(data.goalAmount) ? 'Goal Achieved!' : 'Goal Not Met'}
                        </h4>
                        <p className={`text-sm mt-1 ${result.maturity >= parseFloat(data.goalAmount) ? 'text-emerald-600' : 'text-red-600'}`}>
                            {result.maturity >= parseFloat(data.goalAmount) 
                                ? "Great news! Your investment plan is sufficient to reach your target."
                                : `You are short by ₹${(parseFloat(data.goalAmount) - result.maturity).toLocaleString()}. Consider increasing your deposit amount or tenure.`}
                        </p>
                    </div>
                </div>
             </div>
        )}
    </div>
  );

  return (
    <div className="w-full">
        {step === 'info' && renderInfo()}
        {step === 'form' && renderForm()}
        {step === 'result' && renderResult()}
        {step === 'comparison' && renderComparison()}
    </div>
  );
};
