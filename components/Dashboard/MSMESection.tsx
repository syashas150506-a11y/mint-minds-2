
import React, { useState } from 'react';
import { 
  Calculator, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  IndianRupee, 
  Landmark, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Percent,
  Banknote,
  Info
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface BusinessLoanScheme {
    id: string;
    name: string;
    description: string;
    loanLimit: string;
    interestRate: string;
    link: string;
    eligibility: string[];
    type: 'govt' | 'private';
}

const MSME_LOANS: BusinessLoanScheme[] = [
    {
        id: 'mudra',
        name: 'Pradhan Mantri Mudra Yojana',
        description: 'Govt loans for non-corporate, non-farm small/micro enterprises up to ₹10L.',
        loanLimit: '₹10 Lakhs',
        interestRate: '8% - 12%',
        link: 'https://www.mudra.org.in/',
        eligibility: ['Small Manufacturing', 'Shopkeepers', 'Artisans'],
        type: 'govt'
    },
    {
        id: 'cgtmse',
        name: 'CGTMSE Scheme',
        description: 'Collateral-free credit for MSEs with guarantee cover up to ₹2 Crores.',
        loanLimit: '₹2 Crores',
        interestRate: 'Bank Linked',
        link: 'https://www.cgtmse.in/',
        eligibility: ['New & Existing MSEs', 'Manufacturing/Service'],
        type: 'govt'
    },
    {
        id: 'hdfc_biz',
        name: 'HDFC Business Growth Loan',
        description: 'Collateral-free business loans for expansion and working capital.',
        loanLimit: '₹50 Lakhs',
        interestRate: '11.90% onwards',
        link: 'https://www.hdfcbank.com/personal/borrow/popular-loans/business-loan',
        eligibility: ['3 Years Business Vintage', 'ITR > 1.5 Lakhs'],
        type: 'private'
    },
    {
        id: 'sbi_sme',
        name: 'SBI SME Collateral Free',
        description: 'Simplified small business loans for registered MSME units.',
        loanLimit: '₹2 Crores',
        interestRate: 'Competitive',
        link: 'https://sbi.co.in/web/business/sme',
        eligibility: ['Udyam Registered', 'Profit making for 2 yrs'],
        type: 'private'
    },
    {
        id: 'icici_insta',
        name: 'ICICI InstaOD',
        description: 'Instant Overdraft facility for existing customers with zero paperwork.',
        loanLimit: '₹50 Lakhs',
        interestRate: '16% - 21%',
        link: 'https://www.icicibank.com/business-banking/loans/business-loan',
        eligibility: ['Current Account Holder', 'Good Credit Score'],
        type: 'private'
    },
    {
        id: 'standup',
        name: 'Stand-Up India Scheme',
        description: 'Loans for SC/ST and Women entrepreneurs for greenfield projects.',
        loanLimit: '₹1 Crore',
        interestRate: 'Base Rate + 3%',
        link: 'https://www.standupmitra.in/',
        eligibility: ['SC/ST', 'Women Entrepreneurs'],
        type: 'govt'
    }
];

export const MSMESection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'health' | 'loan' | 'schemes'>('health');
    
    // Health Calculator State
    const [calcData, setCalcData] = useState({
        revenue: '',
        cogs: '',
        operatingExpenses: '',
        depreciation: '',
        interest: '',
        taxes: ''
    });

    // Loan Calculator State
    const [loanInput, setLoanInput] = useState({
        amount: '1000000',
        rate: '12',
        tenure: '5',
        processingFee: '2' // Default 2%
    });

    // Health Calc Logic
    const calculateMetrics = () => {
        const rev = parseFloat(calcData.revenue) || 0;
        const cogs = parseFloat(calcData.cogs) || 0;
        const opex = parseFloat(calcData.operatingExpenses) || 0;
        const dep = parseFloat(calcData.depreciation) || 0;
        const int = parseFloat(calcData.interest) || 0;
        const tax = parseFloat(calcData.taxes) || 0;

        const grossProfit = rev - cogs;
        const ebitda = grossProfit - opex;
        const ebit = ebitda - dep;
        const ebt = ebit - int;
        const netProfit = ebt - tax;
        const operatingCost = cogs + opex;

        return { grossProfit, ebitda, netProfit, operatingCost };
    };

    const metrics = calculateMetrics();

    const healthChartData = [
        { name: 'COGS', value: parseFloat(calcData.cogs) || 0, color: '#f59e0b' },
        { name: 'Operating Exp', value: parseFloat(calcData.operatingExpenses) || 0, color: '#3b82f6' },
        { name: 'Net Profit', value: Math.max(0, metrics.netProfit), color: '#10b981' },
    ].filter(d => d.value > 0);

    // Loan Calc Logic
    const calculateLoan = () => {
        const P = parseFloat(loanInput.amount) || 0;
        const R = (parseFloat(loanInput.rate) || 0) / 12 / 100;
        const N = (parseFloat(loanInput.tenure) || 0) * 12;
        const F = parseFloat(loanInput.processingFee) || 0;

        if (P === 0 || R === 0 || N === 0) return { emi: 0, totalInterest: 0, totalPayable: 0, feeAmount: 0, totalOutgo: 0 };

        const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
        const totalPayable = emi * N;
        const totalInterest = totalPayable - P;
        const feeAmount = P * (F / 100);
        const totalOutgo = totalPayable + feeAmount;

        return { 
            emi: Math.round(emi), 
            totalInterest: Math.round(totalInterest), 
            totalPayable: Math.round(totalPayable),
            feeAmount: Math.round(feeAmount),
            totalOutgo: Math.round(totalOutgo)
        };
    };

    const loanResult = calculateLoan();
    const loanChartData = [
        { name: 'Principal', value: parseFloat(loanInput.amount) || 0, color: '#6366f1' },
        { name: 'Interest', value: loanResult.totalInterest, color: '#f43f5e' },
        { name: 'Proc. Fee', value: loanResult.feeAmount, color: '#f59e0b' },
    ];

    return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shadow-sm"><Building2 size={32} /></div>
                        MSME Hub
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium ml-1">Tools and finance options for business growth.</p>
                </div>
                
                <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto">
                    <button 
                        onClick={() => setActiveTab('health')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'health' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Health Check
                    </button>
                    <button 
                        onClick={() => setActiveTab('loan')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'loan' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        EMI Calculator
                    </button>
                    <button 
                        onClick={() => setActiveTab('schemes')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'schemes' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Loans & Schemes
                    </button>
                </div>
            </div>

            {/* --- Health Calculator --- */}
            {activeTab === 'health' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Calculator className="text-blue-600" /> Business Metrics Input
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Total Monthly Revenue (₹)</label>
                                <input 
                                    type="number" 
                                    value={calcData.revenue}
                                    onChange={(e) => setCalcData({...calcData, revenue: e.target.value})}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    placeholder="e.g. 500000"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Cost of Goods</label>
                                    <input 
                                        type="number" 
                                        value={calcData.cogs}
                                        onChange={(e) => setCalcData({...calcData, cogs: e.target.value})}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Operating Exp</label>
                                    <input 
                                        type="number" 
                                        value={calcData.operatingExpenses}
                                        onChange={(e) => setCalcData({...calcData, operatingExpenses: e.target.value})}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Rent, Salary..."
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-xs font-bold text-slate-400 mb-3 uppercase">Advanced (Optional)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <input type="number" placeholder="Depreciation" value={calcData.depreciation} onChange={(e) => setCalcData({...calcData, depreciation: e.target.value})} className="w-full p-2 text-sm bg-white border border-slate-200 rounded-lg outline-none" />
                                    <input type="number" placeholder="Interest" value={calcData.interest} onChange={(e) => setCalcData({...calcData, interest: e.target.value})} className="w-full p-2 text-sm bg-white border border-slate-200 rounded-lg outline-none" />
                                    <input type="number" placeholder="Taxes" value={calcData.taxes} onChange={(e) => setCalcData({...calcData, taxes: e.target.value})} className="w-full p-2 text-sm bg-white border border-slate-200 rounded-lg outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center">
                            <h3 className="font-bold text-slate-800 mb-6">Revenue Breakdown</h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={healthChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {healthChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-1 gap-3 w-full mt-4">
                                <div className="flex justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <span className="text-emerald-700 font-bold">Net Profit</span>
                                    <span className="text-emerald-700 font-black">₹{metrics.netProfit.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EMI Calculator --- */}
            {activeTab === 'loan' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Banknote className="text-blue-600" /> Business Loan Estimator
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Loan Amount (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="number" 
                                        value={loanInput.amount}
                                        onChange={(e) => setLoanInput({...loanInput, amount: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Interest Rate (%)</label>
                                    <input 
                                        type="number" 
                                        value={loanInput.rate}
                                        onChange={(e) => setLoanInput({...loanInput, rate: e.target.value})}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tenure (Years)</label>
                                    <input 
                                        type="number" 
                                        value={loanInput.tenure}
                                        onChange={(e) => setLoanInput({...loanInput, tenure: e.target.value})}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between items-center">
                                    Processing Fee (%)
                                    <span className="text-blue-600 font-bold">{loanInput.processingFee}%</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="0" max="10" step="0.1"
                                    value={loanInput.processingFee}
                                    onChange={(e) => setLoanInput({...loanInput, processingFee: e.target.value})}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-24 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Info size={20} className="text-blue-400" /> Loan Cost Breakdown
                            </h3>
                            
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Monthly EMI</p>
                                    <p className="text-4xl font-black text-white">₹{loanResult.emi.toLocaleString()}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Total Interest</p>
                                        <p className="text-lg font-bold text-rose-400">₹{loanResult.totalInterest.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Processing Fee</p>
                                        <p className="text-lg font-bold text-amber-400">₹{loanResult.feeAmount.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Cost (Principal + Int + Fees)</p>
                                    <p className="text-2xl font-black text-emerald-400">₹{loanResult.totalOutgo.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Cost Split Chart */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex items-center">
                            <div className="h-[150px] w-1/2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={loanChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {loanChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 space-y-2">
                                {loanChartData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-xs font-bold text-slate-500">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Schemes List --- */}
            {activeTab === 'schemes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {MSME_LOANS.map((scheme) => (
                        <div key={scheme.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all group flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${scheme.type === 'govt' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <Landmark size={24} />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${scheme.type === 'govt' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {scheme.type === 'govt' ? 'Government' : 'Private'}
                                </span>
                            </div>
                            
                            <h4 className="font-bold text-slate-800 text-lg mb-2">{scheme.name}</h4>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{scheme.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Max Limit</p>
                                    <p className="text-sm font-bold text-slate-700">{scheme.loanLimit}</p>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Interest</p>
                                    <p className="text-sm font-bold text-slate-700">{scheme.interestRate}</p>
                                </div>
                            </div>

                            <a 
                                href={scheme.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors"
                            >
                                Learn More <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
