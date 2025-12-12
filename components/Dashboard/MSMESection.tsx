
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
  PieChart,
  ArrowRight,
  Percent,
  Banknote
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
        tenure: '5'
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

        if (P === 0 || R === 0 || N === 0) return { emi: 0, totalInterest: 0, totalPayable: 0 };

        const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
        const totalPayable = emi * N;
        const totalInterest = totalPayable - P;

        return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalPayable: Math.round(totalPayable) };
    };

    const loanResult = calculateLoan();
    const loanChartData = [
        { name: 'Principal', value: parseFloat(loanInput.amount) || 0, color: '#6366f1' }, // Indigo
        { name: 'Interest', value: loanResult.totalInterest, color: '#f43f5e' }, // Rose
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
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-24 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10 grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">EBITDA</p>
                                    <p className="text-3xl font-extrabold text-blue-400">₹{metrics.ebitda.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Net Profit</p>
                                    <p className={`text-3xl font-extrabold ${metrics.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        ₹{metrics.netProfit.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-300">Total Operating Cost</span>
                                    <span className="font-bold">₹{metrics.operatingCost.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center">
                            <h4 className="font-bold text-slate-800 mb-2 text-sm">Cost vs Profit Breakdown</h4>
                            {healthChartData.length > 0 ? (
                                <div className="w-full h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie data={healthChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {healthChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />)}
                                            </Pie>
                                            <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">Enter data to visualize</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- Loan Calculator --- */}
            {activeTab === 'loan' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Banknote className="text-indigo-600" /> MSME Loan Calculator
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Loan Amount (₹)</label>
                                <input 
                                    type="number" 
                                    value={loanInput.amount}
                                    onChange={(e) => setLoanInput({...loanInput, amount: e.target.value})}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg text-slate-800"
                                    placeholder="e.g. 1000000"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Interest Rate (%)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={loanInput.rate}
                                            onChange={(e) => setLoanInput({...loanInput, rate: e.target.value})}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                                        />
                                        <Percent size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tenure (Years)</label>
                                    <input 
                                        type="number" 
                                        value={loanInput.tenure}
                                        onChange={(e) => setLoanInput({...loanInput, tenure: e.target.value})}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm"><InfoIcon /></div>
                                <p className="text-xs text-indigo-800 leading-relaxed">
                                    MSME loans typically range from 8% to 16% interest depending on the scheme (Mudra, CGTMSE) or Bank policy.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
                            <p className="text-slate-400 text-xs font-bold uppercase mb-2">Estimated Monthly EMI</p>
                            <p className="text-4xl font-black text-indigo-600 mb-6">₹{loanResult.emi.toLocaleString()}</p>
                            
                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Interest</p>
                                    <p className="text-lg font-bold text-rose-500">₹{loanResult.totalInterest.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Payable</p>
                                    <p className="text-lg font-bold text-slate-800">₹{loanResult.totalPayable.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 h-[250px]">
                             <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie data={loanChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {loanChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />)}
                                    </Pie>
                                    <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Schemes & Loans List --- */}
            {activeTab === 'schemes' && (
                <div className="animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {MSME_LOANS.map((loan) => (
                            <div key={loan.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl transition-colors ${loan.type === 'govt' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                        <Landmark size={24} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 mb-1">
                                            Max {loan.loanLimit}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">{loan.type === 'govt' ? 'Govt Scheme' : 'Bank Offer'}</span>
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{loan.name}</h3>
                                <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2 flex-1">
                                    {loan.description}
                                </p>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Interest Rate</span>
                                        <span className="text-sm font-bold text-slate-800">{loan.interestRate}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Eligibility</span>
                                        {loan.eligibility.slice(0, 2).map((e, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                                <CheckCircle2 size={12} className="text-blue-500" /> {e}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <a 
                                    href={loan.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                                >
                                    View Details <ExternalLink size={16} />
                                </a>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
                        <AlertCircle className="text-blue-600 shrink-0" size={24} />
                        <div>
                            <h4 className="font-bold text-blue-800 mb-1">Important Note</h4>
                            <p className="text-sm text-blue-700/80">
                                Always apply for government schemes through official .gov.in or .org.in portals. 
                                Wealth Waves only redirects you to official sources and does not process loan applications directly.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple Icon for internal use
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);
