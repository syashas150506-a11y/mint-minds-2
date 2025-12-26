
import React, { useState } from 'react';
import { 
    PieChart, PieChart as PieIcon, TrendingUp, Shield, Zap, Search, 
    ArrowRight, ArrowLeftRight, CheckCircle2, X, ExternalLink, Info, Loader2, Sparkles,
    AlertTriangle, RefreshCw
} from 'lucide-react';
import { getMutualFundAnalysis } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';

// --- Data Definitions ---

interface Fund {
    id: string;
    name: string;
    category: string; // Equity, Debt, Hybrid
    subCategory: string; // Large Cap, Liquid, etc.
    risk: 'High' | 'Moderate' | 'Low';
    rating: number;
    returns: {
        '1Y': number;
        '3Y': number;
        '5Y': number;
    };
    expenseRatio: number;
    minSIP: number;
    fundSize: string; // AUM in Crores
}

const INITIAL_FUNDS: Fund[] = [
    { id: '1', name: 'Quant Small Cap Fund', category: 'Equity', subCategory: 'Small Cap', risk: 'High', rating: 5, returns: { '1Y': 45.2, '3Y': 38.5, '5Y': 28.1 }, expenseRatio: 0.77, minSIP: 1000, fundSize: '₹9,500 Cr' },
    { id: '2', name: 'HDFC Mid-Cap Opportunities', category: 'Equity', subCategory: 'Mid Cap', risk: 'High', rating: 4, returns: { '1Y': 32.1, '3Y': 24.5, '5Y': 18.2 }, expenseRatio: 0.95, minSIP: 500, fundSize: '₹45,000 Cr' },
    { id: '3', name: 'Parag Parikh Flexi Cap', category: 'Equity', subCategory: 'Flexi Cap', risk: 'Moderate', rating: 5, returns: { '1Y': 22.5, '3Y': 19.8, '5Y': 17.5 }, expenseRatio: 0.82, minSIP: 1000, fundSize: '₹55,000 Cr' },
    { id: '4', name: 'SBI Bluechip Fund', category: 'Equity', subCategory: 'Large Cap', risk: 'Moderate', rating: 4, returns: { '1Y': 15.8, '3Y': 14.2, '5Y': 13.5 }, expenseRatio: 1.05, minSIP: 500, fundSize: '₹38,000 Cr' },
    { id: '5', name: 'ICICI Pru Liquid Fund', category: 'Debt', subCategory: 'Liquid', risk: 'Low', rating: 5, returns: { '1Y': 7.2, '3Y': 5.8, '5Y': 5.5 }, expenseRatio: 0.25, minSIP: 500, fundSize: '₹62,000 Cr' },
    { id: '6', name: 'Aditya Birla Sun Life Corporate Bond', category: 'Debt', subCategory: 'Corporate Bond', risk: 'Low', rating: 4, returns: { '1Y': 7.8, '3Y': 6.9, '5Y': 7.1 }, expenseRatio: 0.35, minSIP: 1000, fundSize: '₹22,000 Cr' },
    { id: '7', name: 'SBI Equity Hybrid Fund', category: 'Hybrid', subCategory: 'Aggressive Hybrid', risk: 'Moderate', rating: 4, returns: { '1Y': 18.5, '3Y': 16.2, '5Y': 14.8 }, expenseRatio: 0.98, minSIP: 500, fundSize: '₹58,000 Cr' },
    { id: '8', name: 'Mirae Asset Large Cap', category: 'Equity', subCategory: 'Large Cap', risk: 'Moderate', rating: 4, returns: { '1Y': 14.5, '3Y': 13.8, '5Y': 13.2 }, expenseRatio: 0.65, minSIP: 500, fundSize: '₹35,000 Cr' },
    { id: '9', name: 'Nippon India Small Cap', category: 'Equity', subCategory: 'Small Cap', risk: 'High', rating: 5, returns: { '1Y': 48.5, '3Y': 36.2, '5Y': 26.5 }, expenseRatio: 0.85, minSIP: 1000, fundSize: '₹32,000 Cr' },
];

interface Broker {
    name: string;
    url: string;
    logo: string;
    color: string;
    desc: string;
}

const BROKERS: Broker[] = [
    { name: 'Zerodha Coin', url: 'https://coin.zerodha.com/', logo: 'Z', color: 'bg-blue-600', desc: 'Direct MF, No Commissions' },
    { name: 'Groww', url: 'https://groww.in/mutual-funds', logo: 'G', color: 'bg-emerald-500', desc: 'Simple, Fast Investing' },
    { name: 'Paytm Money', url: 'https://www.paytmmoney.com/mutual-funds', logo: 'P', color: 'bg-indigo-500', desc: 'Low Cost, High Tech' },
    { name: 'ET Money', url: 'https://www.etmoney.com/mutual-funds', logo: 'E', color: 'bg-green-600', desc: 'Report & Analysis' },
    { name: 'Kuvera', url: 'https://kuvera.in/', logo: 'K', color: 'bg-blue-500', desc: 'Goal Based Investing' },
    { name: 'Angel One', url: 'https://www.angelone.in/mutual-funds', logo: 'A', color: 'bg-orange-500', desc: 'Full Service Broker' },
];

export const MutualFunds: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [compareList, setCompareList] = useState<string[]>([]);
    const [showComparison, setShowComparison] = useState(false);
    const [funds, setFunds] = useState<Fund[]>(INITIAL_FUNDS);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // AI Insights
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [loadingAi, setLoadingAi] = useState(false);

    const filteredFunds = funds.filter(fund => {
        const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) || fund.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || fund.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleCompare = (id: string) => {
        if (compareList.includes(id)) {
            setCompareList(prev => prev.filter(item => item !== id));
        } else {
            if (compareList.length < 3) {
                setCompareList(prev => [...prev, id]);
            } else {
                alert("You can compare up to 3 funds.");
            }
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setFunds(prev => prev.map(f => {
                const fluctuation = 1 + (Math.random() - 0.5) * 0.01;
                return {
                    ...f,
                    returns: {
                        '1Y': parseFloat((f.returns['1Y'] * fluctuation).toFixed(1)),
                        '3Y': parseFloat((f.returns['3Y'] * fluctuation).toFixed(1)),
                        '5Y': parseFloat((f.returns['5Y'] * fluctuation).toFixed(1)),
                    }
                };
            }));
            setIsRefreshing(false);
        }, 1000);
    };

    const fetchAiInsight = async (category: string) => {
        setLoadingAi(true);
        const text = await getMutualFundAnalysis(category);
        setAiInsight(text);
        setLoadingAi(false);
    };

    // Render Components

    const renderComparisonOverlay = () => {
        const fundsToCompare = funds.filter(f => compareList.includes(f.id));
        
        return (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <ArrowLeftRight className="text-emerald-600" /> Fund Comparison
                        </h3>
                        <button onClick={() => setShowComparison(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>
                    
                    <div className="overflow-auto p-6">
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="p-4 text-sm font-bold text-slate-400 uppercase w-1/4">Parameter</th>
                                    {fundsToCompare.map(f => (
                                        <th key={f.id} className="p-4 min-w-[200px]">
                                            <div className="font-bold text-lg text-slate-800">{f.name}</div>
                                            <span className={`text-xs px-2 py-0.5 rounded ${f.risk === 'High' ? 'bg-red-50 text-red-600' : f.risk === 'Moderate' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {f.risk} Risk
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-4 font-bold text-slate-600">Category</td>
                                    {fundsToCompare.map(f => <td key={f.id} className="p-4 text-slate-700">{f.category} - {f.subCategory}</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-slate-600">1Y Returns</td>
                                    {fundsToCompare.map(f => <td key={f.id} className="p-4 font-bold text-emerald-600">{f.returns['1Y']}%</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-slate-600">3Y Returns</td>
                                    {fundsToCompare.map(f => <td key={f.id} className="p-4 font-bold text-emerald-600">{f.returns['3Y']}%</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-slate-600">Expense Ratio</td>
                                    {fundsToCompare.map(f => <td key={f.id} className="p-4 text-slate-700">{f.expenseRatio}%</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-slate-600">Fund Size (AUM)</td>
                                    {fundsToCompare.map(f => <td key={f.id} className="p-4 text-slate-700">{f.fundSize}</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-slate-600">Min SIP</td>
                                    {fundsToCompare.map(f => <td key={f.id} className="p-4 text-slate-700">₹{f.minSIP}</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4"></td>
                                    {fundsToCompare.map(f => (
                                        <td key={f.id} className="p-4">
                                            <button onClick={() => window.open('https://groww.in/mutual-funds', '_blank')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold text-sm transition-colors">
                                                Invest Now
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-10 pb-12">
            {showComparison && renderComparisonOverlay()}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2 flex items-center justify-center md:justify-start gap-3">
                        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm"><PieIcon size={32} /></div>
                        Mutual Fund Explorer
                    </h2>
                    <p className="text-slate-500 max-w-2xl text-lg font-medium">
                        Discover top-performing mutual funds and SIP options.
                    </p>
                </div>
                <button 
                    onClick={handleRefresh} 
                    disabled={isRefreshing}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-300 transition-all shadow-sm group"
                >
                    <RefreshCw size={18} className={`text-indigo-600 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    {isRefreshing ? 'Updating Data...' : 'Refresh Navs'}
                </button>
            </div>

            {/* Categories & AI Insight */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-6">
                     {/* Search & Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search funds..." 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            {['All', 'Equity', 'Debt', 'Hybrid'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                                        selectedCategory === cat 
                                        ? 'bg-indigo-600 text-white shadow-md' 
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Funds List */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredFunds.map(fund => (
                            <div key={fund.id} className={`bg-white p-6 rounded-2xl border transition-all hover:shadow-lg flex flex-col md:flex-row items-center gap-6 ${compareList.includes(fund.id) ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' : 'border-slate-200'}`}>
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{fund.name}</h3>
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{fund.subCategory}</span>
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded font-bold border ${fund.risk === 'High' ? 'bg-red-50 text-red-600 border-red-100' : fund.risk === 'Moderate' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                            {fund.risk} Risk
                                        </div>
                                    </div>
                                    <div className="flex gap-6 mt-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">1Y Return</p>
                                            <p className="text-emerald-600 font-bold">{fund.returns['1Y']}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">3Y Return</p>
                                            <p className="text-emerald-600 font-bold">{fund.returns['3Y']}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Expense Ratio</p>
                                            <p className="text-slate-700 font-bold">{fund.expenseRatio}%</p>
                                        </div>
                                        <div className="hidden md:block">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Fund Size</p>
                                            <p className="text-slate-700 font-bold">{fund.fundSize}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto flex md:flex-col gap-2">
                                     <button 
                                        onClick={() => toggleCompare(fund.id)}
                                        className={`flex-1 md:w-40 py-2.5 rounded-xl font-bold text-sm border-2 flex items-center justify-center gap-2 transition-all ${compareList.includes(fund.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}`}
                                    >
                                        {compareList.includes(fund.id) ? <CheckCircle2 size={16} /> : <ArrowLeftRight size={16} />}
                                        {compareList.includes(fund.id) ? 'Selected' : 'Compare'}
                                    </button>
                                    <button onClick={() => window.open('https://groww.in/mutual-funds', '_blank')} className="flex-1 md:w-40 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                                        Invest
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar - AI & Brokers */}
                <div className="space-y-6">
                    {/* Compare Button (Mobile Sticky or Sidebar) */}
                    {compareList.length > 0 && (
                        <div className="bg-indigo-900 text-white p-5 rounded-2xl shadow-xl flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">{compareList.length} Funds Selected</span>
                                <button onClick={() => setCompareList([])} className="text-xs text-indigo-300 hover:text-white">Clear</button>
                            </div>
                            <button 
                                onClick={() => setShowComparison(true)}
                                disabled={compareList.length < 2}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Compare Now
                            </button>
                        </div>
                    )}

                    {/* AI Analyst */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Sparkles className="text-yellow-300" size={20} /> AI Analyst
                        </h3>
                        <p className="text-indigo-100 text-sm mb-4">Get instant insights on {selectedCategory} funds.</p>
                        
                        {!aiInsight ? (
                             <button 
                                onClick={() => fetchAiInsight(selectedCategory)}
                                disabled={loadingAi}
                                className="w-full bg-white text-indigo-600 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                             >
                                {loadingAi ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                                Analyze {selectedCategory}
                             </button>
                        ) : (
                            <div className="bg-white/10 p-4 rounded-xl text-xs leading-relaxed space-y-2 border border-white/20 animate-fade-in">
                                <ReactMarkdown>{aiInsight}</ReactMarkdown>
                                <button onClick={() => setAiInsight(null)} className="text-xs text-indigo-200 underline mt-2">Close Analysis</button>
                            </div>
                        )}
                    </div>

                    {/* Brokers List */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ExternalLink size={18} className="text-slate-400" /> Invest via Broker
                        </h3>
                        <div className="space-y-3">
                            {BROKERS.map(broker => (
                                <a 
                                    key={broker.name} 
                                    href={broker.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                                >
                                    <div className={`w-10 h-10 rounded-full ${broker.color} text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                                        {broker.logo}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 text-sm">{broker.name}</h4>
                                        <p className="text-[10px] text-slate-500">{broker.desc}</p>
                                    </div>
                                    <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 leading-relaxed flex items-start md:items-center justify-center gap-2 text-left md:text-center">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5 md:mt-0" />
                    <span>
                        <strong>Disclaimer:</strong> Mutual Fund investments are subject to market risks, read all scheme related documents carefully. The NAVs of the schemes may go up or down depending upon the factors and forces affecting the securities market including the fluctuations in the interest rates. The past performance of the mutual funds is not necessarily indicative of future performance of the schemes. The information provided here is for educational purposes only and does not constitute financial advice.
                    </span>
                </p>
            </div>
        </div>
    );
};
