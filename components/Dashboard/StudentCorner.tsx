import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
    PiggyBank, 
    Briefcase, 
    Wallet, 
    RefreshCw, 
    TrendingUp, 
    School, 
    Coffee, 
    Gamepad2,
    ArrowRight,
    Coins,
    Landmark,
    Baby,
    CreditCard,
    CheckCircle2
} from 'lucide-react';

interface StudentData {
    age: string;
    source: string;
    amount: string;
}

const INCOME_SOURCES = [
    { id: 'pocket_money', label: 'Pocket Money from Parents', icon: <Baby size={24} />, color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { id: 'freelancing', label: 'Freelancing / Gig Work', icon: <Briefcase size={24} />, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    { id: 'other', label: 'Other Sources', icon: <Wallet size={24} />, color: 'bg-purple-100 text-purple-600 border-purple-200' },
];

export const StudentCorner: React.FC = () => {
    const [step, setStep] = useState<'input' | 'result'>('input');
    const [data, setData] = useState<StudentData>({
        age: '',
        source: '',
        amount: ''
    });

    const handleGenerate = () => {
        if (!data.age || !data.source || !data.amount) return;
        setStep('result');
    };

    const reset = () => {
        setStep('input');
        setData({ age: '', source: '', amount: '' });
    };

    // Calculation Logic
    const amount = parseFloat(data.amount) || 0;
    const age = parseInt(data.age) || 0;
    
    // Determine Ratios
    let savingsRate = 0.2; // Default 20%
    if (data.source === 'freelancing') savingsRate = 0.4; // 40% if earning
    if (data.source === 'pocket_money' && age < 18) savingsRate = 0.15; // 15% for younger

    const savingsAmount = Math.round(amount * savingsRate);
    const spendingAmount = amount - savingsAmount;

    // Chart Data
    const chartData = [
        { name: 'Spending (Needs & Wants)', value: spendingAmount, color: '#f43f5e' }, // Rose 500
        { name: 'Savings & Investments', value: savingsAmount, color: '#10b981' }, // Emerald 500
    ];

    // Recommendations
    const getRecommendations = () => {
        const recs = [];
        
        // Age Based
        if (age < 18) {
            recs.push({
                title: "Junior/Minor Savings Account",
                desc: "Ask your parents to open a kids' bank account. It's the safest place to start.",
                icon: <Landmark size={20} className="text-blue-500" />
            });
            recs.push({
                title: "Physical Piggy Bank",
                desc: "Keep small cash handy for immediate needs. It builds a habit of seeing money grow.",
                icon: <PiggyBank size={20} className="text-pink-500" />
            });
        } else {
            // Adult Student
            if (savingsAmount >= 500) {
                recs.push({
                    title: "Recurring Deposit (RD)",
                    desc: "Best for students! Bank auto-deducts ₹500/month. 6-7% safe returns.",
                    icon: <RefreshCw size={20} className="text-blue-500" />
                });
            }
            if (savingsAmount >= 100 && savingsAmount < 500) {
                 recs.push({
                    title: "Digital Gold",
                    desc: "You can buy gold for as low as ₹1. Good hedge against inflation.",
                    icon: <Coins size={20} className="text-amber-500" />
                });
            }
            if (data.source === 'freelancing' && savingsAmount > 1000) {
                 recs.push({
                    title: "Systematic Investment Plan (SIP)",
                    desc: "Start a micro-SIP in an Index Fund. Great for long-term wealth creation.",
                    icon: <TrendingUp size={20} className="text-emerald-500" />
                });
            } else if (data.source === 'other' || data.source === 'pocket_money') {
                 recs.push({
                    title: "Penny Funds / High Interest Savings",
                    desc: "Keep money in a savings account that offers >4% interest (e.g. Neo Banks).",
                    icon: <Wallet size={20} className="text-purple-500" />
                });
            }
        }
        return recs;
    };

    if (step === 'input') {
        return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-rose-500" />
                    
                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-pink-100 rounded-2xl text-pink-600 shadow-sm">
                                <School size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-800">Student Corner</h2>
                                <p className="text-slate-500 font-medium">Let's build a smart budget for you.</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Age Input */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">How old are you?</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter your age (e.g. 19)"
                                    className="w-full md:w-1/2 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-slate-800"
                                    value={data.age}
                                    onChange={(e) => setData({...data, age: e.target.value})}
                                />
                            </div>

                            {/* Income Source */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-4">Where does your money come from?</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {INCOME_SOURCES.map((src) => (
                                        <button
                                            key={src.id}
                                            onClick={() => setData({...data, source: src.id})}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${
                                                data.source === src.id 
                                                ? src.color + ' border-current shadow-md scale-105' 
                                                : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                                            }`}
                                        >
                                            {src.icon}
                                            <span className="font-bold text-sm">{src.label}</span>
                                            {data.source === src.id && <CheckCircle2 size={18} className="absolute top-3 right-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Monthly Amount */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Total Amount (Pocket Money / Earnings)</label>
                                <div className="relative md:w-1/2">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input 
                                        type="number" 
                                        placeholder="e.g. 2000"
                                        className="w-full p-4 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-slate-800"
                                        value={data.amount}
                                        onChange={(e) => setData({...data, amount: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!data.age || !data.source || !data.amount}
                                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                Generate My Plan <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in-up">
             <button 
                onClick={reset}
                className="mb-6 text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 transition-colors"
            >
                <ArrowRight className="rotate-180" size={20} /> Recalculate
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Split */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Suggested Monthly Split</h3>
                    <p className="text-slate-400 text-sm font-medium mb-6">Based on a budget of ₹{amount}</p>
                    
                    <div className="w-full h-[300px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number) => [`₹${value}`, 'Amount']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                            <span className="text-xs text-slate-400 font-bold uppercase">Savings</span>
                            <div className="text-3xl font-extrabold text-emerald-500">{Math.round(savingsRate * 100)}%</div>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                            <Coffee className="mx-auto text-rose-500 mb-2" size={24} />
                            <p className="text-xs text-slate-500 font-bold uppercase">You Spend</p>
                            <p className="text-xl font-extrabold text-rose-600">₹{spendingAmount}</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                            <PiggyBank className="mx-auto text-emerald-500 mb-2" size={24} />
                            <p className="text-xs text-slate-500 font-bold uppercase">You Save</p>
                            <p className="text-xl font-extrabold text-emerald-600">₹{savingsAmount}</p>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-20 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Sparkles size={20} className="text-yellow-400" /> Smart Recommendations
                        </h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            {age < 18 
                                ? "Since you are under 18, focusing on habit building is key. Ask your parents for help with accounts." 
                                : `As a ${data.source === 'freelancing' ? 'freelancer' : 'student'}, maximizing your ₹${savingsAmount} savings is crucial.`}
                        </p>

                        <div className="space-y-3">
                            {getRecommendations().map((rec, idx) => (
                                <div key={idx} className="bg-white/10 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
                                    <div className="p-2 bg-white rounded-lg shadow-sm shrink-0 mt-1">
                                        {rec.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm mb-1">{rec.title}</h4>
                                        <p className="text-slate-300 text-xs leading-relaxed">{rec.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Gamepad2 className="text-purple-500" /> Spending Tips
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                Use student discounts (Spotify, Amazon Prime).
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                Avoid impulse buying. Wait 24 hours before big purchases.
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                Track your {data.source === 'freelancing' ? 'freelance income' : 'pocket money'} using this app.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Sparkles icon locally since it wasn't imported in this file context yet
const Sparkles = ({size, className}: {size:number, className?:string}) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
);
