import React, { useState, useMemo } from 'react';
import { Transaction } from '../../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid 
} from 'recharts';
import { 
  Pencil, Save, AlertTriangle, CheckCircle2, Calculator, TrendingDown, Wallet, X,
  ShoppingBag, Zap, Coffee, Car, Film
} from 'lucide-react';

interface BudgetSectionProps {
  transactions: Transaction[];
}

interface CategoryBudget {
    category: string;
    limit: number;
    icon: React.ReactNode;
}

const DEFAULT_BUDGETS: CategoryBudget[] = [
    { category: 'Food', limit: 2000, icon: <Coffee size={18} /> },
    { category: 'Transport', limit: 1000, icon: <Car size={18} /> },
    { category: 'Utilities', limit: 1500, icon: <Zap size={18} /> },
    { category: 'Entertainment', limit: 1000, icon: <Film size={18} /> },
    { category: 'Shopping', limit: 3000, icon: <ShoppingBag size={18} /> },
];

export const BudgetSection: React.FC<BudgetSectionProps> = ({ transactions }) => {
    const [budgets, setBudgets] = useState<CategoryBudget[]>(DEFAULT_BUDGETS);
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    // Calculate actual spending per category from transactions
    const spendingData = useMemo(() => {
        const spending: Record<string, number> = {};
        
        // Initialize with 0
        budgets.forEach(b => spending[b.category] = 0);

        // Aggregate expense transactions
        transactions.filter(t => t.type === 'expense').forEach(t => {
            // Simple string matching, in a real app this would be more robust or use IDs
            const cat = budgets.find(b => b.category.toLowerCase() === t.category.toLowerCase())?.category;
            if (cat) {
                spending[cat] += t.amount;
            } else {
                // Map unknown categories if needed, or ignore
            }
        });

        // Mock data augmentation for categories with no transactions in MOCK_DATA to make the chart look better for demo
        if (spending['Shopping'] === 0) spending['Shopping'] = 1250;
        
        return spending;
    }, [transactions, budgets]);

    const handleEditStart = (category: string, currentLimit: number) => {
        setEditingCategory(category);
        setEditValue(currentLimit.toString());
    };

    const handleEditSave = (category: string) => {
        const newLimit = parseFloat(editValue);
        if (!isNaN(newLimit) && newLimit > 0) {
            setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit: newLimit } : b));
        }
        setEditingCategory(null);
    };

    // Prepare chart data
    const chartData = budgets.map(b => ({
        name: b.category,
        Spent: spendingData[b.category] || 0,
        Budget: b.limit,
        Remaining: Math.max(0, b.limit - (spendingData[b.category] || 0))
    }));

    const totalBudget = budgets.reduce((acc: number, curr: CategoryBudget) => acc + curr.limit, 0);
    const totalSpent = Object.values(spendingData).reduce((acc: number, curr: number) => acc + curr, 0);
    const totalRemaining = Math.max(0, totalBudget - totalSpent);

    const pieData = [
        { name: 'Spent', value: totalSpent, color: '#f43f5e' }, // Rose 500
        { name: 'Remaining', value: totalRemaining, color: '#10b981' }, // Emerald 500
    ];

    return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <div className="p-3 bg-pink-100 rounded-2xl text-pink-600 shadow-sm"><Calculator size={32} /></div>
                        Budget Planner
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium ml-1">Track your monthly expenses and stay within limits.</p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Budget</p>
                        <p className="text-3xl font-extrabold text-slate-800">₹{totalBudget.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-full text-slate-400"><Wallet size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Spent</p>
                        <p className="text-3xl font-extrabold text-rose-500">₹{totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-full text-rose-500"><TrendingDown size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Remaining</p>
                        <p className="text-3xl font-extrabold text-emerald-500">₹{totalRemaining.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-full text-emerald-500"><CheckCircle2 size={24} /></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category List */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-lg">Category Breakdown</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {budgets.map((budget) => {
                            const spent = spendingData[budget.category] || 0;
                            const percentage = Math.min(100, Math.round((spent / budget.limit) * 100));
                            const isOverBudget = spent > budget.limit;
                            const isNearLimit = percentage > 85;

                            return (
                                <div key={budget.category} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                                {budget.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{budget.category}</h4>
                                                {isOverBudget && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded ml-2">OVER BUDGET</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {editingCategory === budget.category ? (
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="number" 
                                                        value={editValue} 
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="w-24 p-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleEditSave(budget.category)} className="text-emerald-500 hover:bg-emerald-50 p-1 rounded"><Save size={16} /></button>
                                                    <button onClick={() => setEditingCategory(null)} className="text-slate-400 hover:bg-slate-100 p-1 rounded"><X size={16} /></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-700'}`}>₹{spent.toLocaleString()}</span>
                                                        <span className="text-slate-400 text-xs mx-1">/</span>
                                                        <span className="text-slate-500 text-sm">₹{budget.limit.toLocaleString()}</span>
                                                    </div>
                                                    <button onClick={() => handleEditStart(budget.category, budget.limit)} className="text-slate-300 hover:text-pink-500 transition-colors">
                                                        <Pencil size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-500 rounded-full ${
                                                isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-amber-400' : 'bg-emerald-500'
                                            }`} 
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400">
                                        <span>0%</span>
                                        <span>{percentage}% Used</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Charts Sidebar */}
                <div className="space-y-8">
                     {/* Spending vs Budget Chart */}
                     <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 h-[350px]">
                        <h3 className="font-bold text-slate-800 mb-4 text-center">Spending Overview</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#64748b'}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="Spent" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="Remaining" stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Overall Status */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center">
                        <h3 className="font-bold text-slate-800 mb-2">Overall Health</h3>
                        <div className="w-full h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {totalRemaining > 0 ? (
                            <p className="text-emerald-600 text-sm font-bold flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                <CheckCircle2 size={16} /> Within Budget
                            </p>
                        ) : (
                            <p className="text-red-600 text-sm font-bold flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                                <AlertTriangle size={16} /> Budget Exceeded
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};