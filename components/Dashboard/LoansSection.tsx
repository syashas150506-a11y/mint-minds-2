import React, { useState } from 'react';
import { 
  Home, 
  Car, 
  GraduationCap, 
  Briefcase, 
  Coins, 
  Building2, 
  ArrowRight, 
  Calculator, 
  IndianRupee, 
  Percent, 
  CheckCircle2, 
  Loader2,
  ArrowLeftRight,
  Info,
  Banknote
} from 'lucide-react';

// Loan Types Definition
const LOAN_TYPES = [
  { id: 'home', label: 'Home Loan', icon: <Home size={32} />, rateRange: '8.35% - 9.5%', desc: 'Buy or construct your dream house.' },
  { id: 'personal', label: 'Personal Loan', icon: <Briefcase size={32} />, rateRange: '10.5% - 14%', desc: 'For travel, wedding, or medical needs.' },
  { id: 'car', label: 'Car Loan', icon: <Car size={32} />, rateRange: '8.7% - 11%', desc: 'Drive home your new vehicle.' },
  { id: 'education', label: 'Education Loan', icon: <GraduationCap size={32} />, rateRange: '9.0% - 12%', desc: 'Study in India or abroad.' },
  { id: 'gold', label: 'Gold Loan', icon: <Coins size={32} />, rateRange: '7.5% - 9.0%', desc: 'Instant cash against gold ornaments.' },
  { id: 'mortgage', label: 'Loan Against Property', icon: <Building2 size={32} />, rateRange: '9.5% - 11%', desc: 'Leverage your property value.' },
];

// Mock Data representing Indian Banks API response
const BANK_OFFERS: Record<string, any[]> = {
  'home': [
    { id: 'sbi', name: 'SBI', rate: 8.40, fee: 'Nil', features: ['No Hidden Charges', 'Overdraft Facility'], type: 'Public' },
    { id: 'hdfc', name: 'HDFC Bank', rate: 8.50, fee: '₹3,000', features: ['Doorstep Service', 'Quick Approval'], type: 'Private' },
    { id: 'icici', name: 'ICICI Bank', rate: 8.60, fee: '0.50%', features: ['Pre-approved offers', 'Part-payment allowed'], type: 'Private' },
    { id: 'kotak', name: 'Kotak Mahindra', rate: 8.70, fee: '0.25%', features: ['Digital Process', 'Tax Benefits'], type: 'Private' },
    { id: 'axis', name: 'Axis Bank', rate: 8.75, fee: '₹10,000', features: ['12 EMI Waiver*', 'Top-up available'], type: 'Private' },
  ],
  'personal': [
    { id: 'hdfc', name: 'HDFC Bank', rate: 10.50, fee: '1.50%', features: ['10 Second Disbursal', 'Flexible Tenure'], type: 'Private' },
    { id: 'icici', name: 'ICICI Bank', rate: 10.75, fee: '1.25%', features: ['No Collateral', 'Minimal Docs'], type: 'Private' },
    { id: 'sbi', name: 'SBI', rate: 11.00, fee: '1.00%', features: ['Low Rates', 'Daily reducing balance'], type: 'Public' },
  ],
  'car': [
    { id: 'sbi', name: 'SBI', rate: 8.65, fee: 'Nil', features: ['On-road funding', 'Longest Tenure'], type: 'Public' },
    { id: 'axis', name: 'Axis Bank', rate: 8.90, fee: '₹4,000', features: ['100% Funding', 'Fast Track'], type: 'Private' },
    { id: 'hdfc', name: 'HDFC Bank', rate: 9.00, fee: '0.50%', features: ['ZipDrive Instant', 'Foreclosure allowed'], type: 'Private' },
  ],
  // Fallback for others
  'default': [
    { id: 'sbi', name: 'State Bank of India', rate: 9.50, fee: '0.50%', features: ['Trusted', 'Low Processing Fee'], type: 'Public' },
    { id: 'bob', name: 'Bank of Baroda', rate: 9.60, fee: '0.75%', features: ['Quick Processing', 'Digital'], type: 'Public' },
    { id: 'indus', name: 'IndusInd Bank', rate: 10.00, fee: '1.00%', features: ['Minimal Paperwork', 'Flexible'], type: 'Private' },
  ]
};

export const LoansSection: React.FC = () => {
  const [step, setStep] = useState<'type' | 'input' | 'comparison'>('type');
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState({
    amount: '',
    tenure: '5', // Years
    creditScore: '750',
  });
  const [loading, setLoading] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  // Calculation Helper
  const calculateEMI = (principal: number, rate: number, years: number) => {
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const handleSearch = () => {
    if (!formData.amount || !formData.tenure) return;
    setLoading(true);
    // Simulate API Delay
    setTimeout(() => {
        setLoading(false);
        setStep('comparison');
    }, 1500);
  };

  const toggleCompare = (id: string) => {
      if (compareList.includes(id)) {
          setCompareList(compareList.filter(item => item !== id));
      } else {
          if (compareList.length < 3) setCompareList([...compareList, id]);
      }
  };

  const renderTypeSelection = () => (
    <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 flex items-center justify-center gap-3">
                <Banknote className="text-indigo-600" size={32} /> Select Loan Type
            </h2>
            <p className="text-slate-500">Choose the type of financial assistance you are looking for.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOAN_TYPES.map((loan) => (
                <button
                    key={loan.id}
                    onClick={() => { setSelectedType(loan.id); setStep('input'); }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all group text-left"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {loan.icon}
                        </div>
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                            {loan.rateRange}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{loan.label}</h3>
                    <p className="text-sm text-slate-500">{loan.desc}</p>
                </button>
            ))}
        </div>
    </div>
  );

  const renderInputForm = () => {
      const typeLabel = LOAN_TYPES.find(t => t.id === selectedType)?.label;

      return (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
            <button onClick={() => setStep('type')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold">
                <ArrowRight className="rotate-180" size={20} /> Change Loan Type
            </button>
            
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calculator className="text-indigo-600" /> {typeLabel} Details
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Loan Amount Required (₹)</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="number" 
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                placeholder="e.g. 5000000"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tenure (Years)</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="range" 
                                min="1" max="30" 
                                value={formData.tenure}
                                onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <span className="min-w-[80px] text-center font-bold text-indigo-600 bg-indigo-50 py-2 rounded-lg border border-indigo-100">
                                {formData.tenure} Years
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            CIBIL Score
                            <span className="ml-2 text-xs font-normal text-slate-400">(Higher score = Lower Interest Rate)</span>
                        </label>
                        <div className="relative">
                            <div className="w-full h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-full mb-2 opacity-50"></div>
                            <input 
                                type="range" 
                                min="300" max="900" 
                                value={formData.creditScore}
                                onChange={(e) => setFormData({...formData, creditScore: e.target.value})}
                                className="w-full h-2 bg-transparent absolute top-0.5 left-0 appearance-none cursor-pointer accent-slate-800"
                            />
                            <div className="text-center font-bold text-slate-800 mt-1">{formData.creditScore}</div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSearch}
                        disabled={!formData.amount || loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Info size={20} />}
                        {loading ? 'Fetching Bank Offers...' : 'Find Best Rates'}
                    </button>
                </div>
            </div>
        </div>
      );
  };

  const renderComparison = () => {
      const amount = parseFloat(formData.amount);
      const tenure = parseFloat(formData.tenure);
      // Logic: If credit score > 750, reduce rate by 0.15%
      const creditScoreDiscount = parseInt(formData.creditScore) > 750 ? 0.15 : 0;

      const offers = (BANK_OFFERS[selectedType] || BANK_OFFERS['default']).map(bank => {
          const finalRate = parseFloat((bank.rate - creditScoreDiscount).toFixed(2));
          const emi = calculateEMI(amount, finalRate, tenure);
          return { ...bank, finalRate, emi };
      }).sort((a, b) => a.emi - b.emi); // Sort cheapest first

      const bestOffer = offers[0];
      const comparisonData = offers.filter(o => compareList.includes(o.id));

      return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
            <div className="flex items-center justify-between">
                <button onClick={() => setStep('input')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold">
                    <ArrowRight className="rotate-180" size={20} /> Adjust Inputs
                </button>
                <div className="text-right">
                    <p className="text-slate-500 text-sm">Loan Amount: <span className="font-bold text-slate-800">₹{amount.toLocaleString()}</span> | Tenure: <span className="font-bold text-slate-800">{tenure} Years</span></p>
                </div>
            </div>

            {/* Comparison Table Overlay */}
            {compareList.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl mb-8 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><ArrowLeftRight className="text-indigo-600" /> Comparison</h3>
                        <button onClick={() => setCompareList([])} className="text-xs font-bold text-red-500 hover:underline">Clear</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-500 text-sm">
                                    <th className="pb-2">Bank</th>
                                    <th className="pb-2">Interest Rate</th>
                                    <th className="pb-2">Monthly EMI</th>
                                    <th className="pb-2">Processing Fee</th>
                                    <th className="pb-2">Total Interest</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {comparisonData.map(bank => (
                                    <tr key={bank.id}>
                                        <td className="py-3 font-bold text-slate-800">{bank.name}</td>
                                        <td className="py-3 font-bold text-indigo-600">{bank.finalRate}%</td>
                                        <td className="py-3 font-bold text-slate-800">₹{bank.emi.toLocaleString()}</td>
                                        <td className="py-3 text-slate-600 text-sm">{bank.fee}</td>
                                        <td className="py-3 text-slate-600 text-sm">₹{((bank.emi * tenure * 12) - amount).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* List of Offers */}
            <div className="grid grid-cols-1 gap-4">
                {offers.map((bank, index) => {
                    const isCheapest = index === 0;
                    return (
                        <div key={bank.id} className={`bg-white rounded-2xl p-6 border transition-all hover:shadow-lg ${isCheapest ? 'border-emerald-500 shadow-emerald-100 ring-1 ring-emerald-500' : 'border-slate-200'}`}>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                {/* Bank Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-slate-800">{bank.name}</h3>
                                        {isCheapest && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"><CheckCircle2 size={12} /> Lowest Rate</span>}
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${bank.type === 'Public' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{bank.type}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                        <span className="flex items-center gap-1"><Percent size={14} className="text-slate-400" /> Processing Fee: <strong>{bank.fee}</strong></span>
                                        <span className="flex items-center gap-1 text-slate-400">|</span>
                                        {bank.features.map((f: string, i: number) => (
                                            <span key={i} className="bg-slate-50 px-2 py-0.5 rounded text-xs border border-slate-100">{f}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Rate & EMI */}
                                <div className="flex items-center gap-8 text-center md:text-right">
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Interest Rate</p>
                                        <p className="text-2xl font-bold text-indigo-600">{bank.finalRate}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Monthly EMI</p>
                                        <p className="text-2xl font-bold text-slate-800">₹{bank.emi.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
                                        Apply Now
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id={`compare-${bank.id}`}
                                            checked={compareList.includes(bank.id)}
                                            onChange={() => toggleCompare(bank.id)}
                                            className="w-4 h-4 accent-indigo-600 cursor-pointer"
                                        />
                                        <label htmlFor={`compare-${bank.id}`} className="text-xs font-bold text-slate-500 cursor-pointer select-none">Add to Compare</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      );
  };

  return (
    <div className="w-full pb-10">
        {step === 'type' && renderTypeSelection()}
        {step === 'input' && renderInputForm()}
        {step === 'comparison' && renderComparison()}
    </div>
  );
};