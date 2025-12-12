
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { MOCK_TRANSACTIONS, ECONOMIC_NEWS, SAVING_GOALS, ALL_STOCKS } from '../../constants';
import { AiAdvisor } from './AiAdvisor';
import { StudentCorner } from './StudentCorner';
import { PPFSection } from './PPFSection';
import { LoansSection } from './LoansSection';
import { AdvisorSection } from './AdvisorSection';
import { SettingsSection } from './SettingsSection';
import { BudgetSection } from './BudgetSection';
import { InfoSection } from './InfoSection';
import { InsuranceSection } from './InsuranceSection';
import { SavingsJar } from './SavingsJar';
import { MutualFunds } from './MutualFunds';
import { MSMESection } from './MSMESection';
import { getStockMarketAnalysis, generatePortfolio } from '../../services/geminiService';
import { 
  LogOut, Wallet, TrendingUp, PieChart as PieChartIcon, PiggyBank, Shield, Banknote, 
  GraduationCap, Bot, Activity, Landmark, Brain, 
  ArrowUpRight, ArrowDownRight, Sparkles, Plus, 
  Zap, TrendingDown, 
  AlertTriangle, Info, MessageCircle,
  Newspaper, ExternalLink, Users, Settings, Menu, RefreshCw, Lightbulb, Goal, Calculator, X,
  BarChart3, LayoutGrid, Home as HomeIcon, ArrowLeft, Building2, Search, Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (data: Partial<User>) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

type DashboardSection = 'HOME' | 'STATUS' | 'STOCKS' | 'MUTUAL_FUNDS' | 'PPF' | 'INSURANCE' | 'LOANS' | 'STUDENT' | 'MSME' | 'ADVISOR' | 'SETTINGS' | 'BUDGET' | 'INFO';

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUserUpdate, darkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('HOME');
  const [showAiAdvisor, setShowAiAdvisor] = useState(false);
  const [marketAnalysis, setMarketAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Stock Search State
  const [stockSearchTerm, setStockSearchTerm] = useState('');
  const [filteredStocks, setFilteredStocks] = useState(ALL_STOCKS);

  // Portfolio Planner State
  const [portfolioParams, setPortfolioParams] = useState({
      amount: '',
      duration: '5',
      returnRate: '15'
  });
  const [portfolioResult, setPortfolioResult] = useState<string | null>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  // Goal Planner State
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [goalInput, setGoalInput] = useState({ cost: '', years: '3' });
  const INFLATION_RATE = 6.2;

  useEffect(() => {
      const lowerTerm = stockSearchTerm.toLowerCase();
      const filtered = ALL_STOCKS.filter(stock => 
          stock.name.toLowerCase().includes(lowerTerm) || 
          stock.symbol.toLowerCase().includes(lowerTerm)
      );
      setFilteredStocks(filtered);
  }, [stockSearchTerm]);

  const fetchAnalysis = async () => {
    setLoadingAnalysis(true);
    const analysis = await getStockMarketAnalysis();
    setMarketAnalysis(analysis);
    setLoadingAnalysis(false);
  };

  const handleGeneratePortfolio = async () => {
    if (!portfolioParams.amount) return;
    setLoadingPortfolio(true);
    const result = await generatePortfolio(portfolioParams.amount, portfolioParams.duration, portfolioParams.returnRate);
    setPortfolioResult(result);
    setLoadingPortfolio(false);
  };

  const handleRiskSelect = (type: 'Conservative' | 'Balanced' | 'Aggressive') => {
      let rate = '15';
      if (type === 'Conservative') rate = '10';
      if (type === 'Aggressive') rate = '22';
      setPortfolioParams(prev => ({ ...prev, returnRate: rate }));
  };

  const menuItems = [
      { id: 'HOME', label: 'Home', icon: <HomeIcon size={20} />, color: 'text-indigo-600 bg-indigo-50', darkColor: 'dark:text-indigo-400 dark:bg-indigo-900/20' },
      { id: 'STOCKS', label: 'Stocks & Market', icon: <TrendingUp size={20} />, color: 'text-emerald-600 bg-emerald-50', darkColor: 'dark:text-emerald-400 dark:bg-emerald-900/20' },
      { id: 'STATUS', label: 'My Monetary Status', icon: <BarChart3 size={20} />, color: 'text-blue-600 bg-blue-50', darkColor: 'dark:text-blue-400 dark:bg-blue-900/20' },
      { id: 'BUDGET', label: 'Budget Planner', icon: <Wallet size={20} />, color: 'text-rose-600 bg-rose-50', darkColor: 'dark:text-rose-400 dark:bg-rose-900/20' },
      { id: 'MSME', label: 'MSME / Business', icon: <Building2 size={20} />, color: 'text-amber-600 bg-amber-50', darkColor: 'dark:text-amber-400 dark:bg-amber-900/20' },
      { id: 'MUTUAL_FUNDS', label: 'Mutual Funds', icon: <PieChartIcon size={20} />, color: 'text-violet-600 bg-violet-50', darkColor: 'dark:text-violet-400 dark:bg-violet-900/20' },
      { id: 'INSURANCE', label: 'Insurance', icon: <Shield size={20} />, color: 'text-red-600 bg-red-50', darkColor: 'dark:text-red-400 dark:bg-red-900/20' },
      { id: 'LOANS', label: 'Loans', icon: <Banknote size={20} />, color: 'text-cyan-600 bg-cyan-50', darkColor: 'dark:text-cyan-400 dark:bg-cyan-900/20' },
      { id: 'PPF', label: 'PPF Calculator', icon: <RefreshCw size={20} />, color: 'text-orange-600 bg-orange-50', darkColor: 'dark:text-orange-400 dark:bg-orange-900/20' },
      { id: 'INFO', label: 'Govt Schemes', icon: <Landmark size={20} />, color: 'text-teal-600 bg-teal-50', darkColor: 'dark:text-teal-400 dark:bg-teal-900/20' },
      { id: 'STUDENT', label: 'Student Corner', icon: <GraduationCap size={20} />, color: 'text-pink-600 bg-pink-50', darkColor: 'dark:text-pink-400 dark:bg-pink-900/20' },
      { id: 'ADVISOR', label: 'Talk to Expert', icon: <Users size={20} />, color: 'text-purple-600 bg-purple-50', darkColor: 'dark:text-purple-400 dark:bg-purple-900/20' },
      { id: 'SETTINGS', label: 'Settings', icon: <Settings size={20} />, color: 'text-slate-600 bg-slate-50', darkColor: 'dark:text-slate-400 dark:bg-slate-900/20' },
  ];

  const handleJarUpdate = (newBalance: number) => {
    onUserUpdate({ savingsJarBalance: newBalance });
  };

  const calculateGoalMetrics = (cost: number, years: number) => {
    const futureCost = cost * Math.pow((1 + INFLATION_RATE / 100), years);
    let roi = 0;
    let strategy = '';
    let recommendation = '';

    if (years <= 3) {
        roi = 7.5;
        strategy = 'Conservative (FD/Debt)';
        recommendation = 'For short-term goals, prioritize capital safety. Use Liquid Funds or FDs to match inflation.';
    } else if (years <= 7) {
        roi = 11;
        strategy = 'Balanced (Hybrid Funds)';
        recommendation = 'For medium-term goals, mix equity and debt. Aggressive Hybrid Funds can beat inflation by 3-4%.';
    } else {
        roi = 14;
        strategy = 'Aggressive (Equity/Stocks)';
        recommendation = 'For long-term goals, you must invest in Equity/Stocks to generate real wealth and outpace inflation significantly.';
    }

    const r = roi / 12 / 100;
    const n = years * 12;
    const sipRequired = futureCost / ( ( (Math.pow(1 + r, n) - 1) / r ) * (1 + r) );

    return { futureCost, sipRequired, strategy, recommendation };
  };

  const renderContent = () => {
      switch(activeSection) {
          case 'HOME':
            return (
                <div className="animate-fade-in space-y-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
                            Welcome back, <span className="text-emerald-600">{user.name.split(' ')[0]}</span>!
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Manage your wealth, track investments, and plan your future all in one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {menuItems
                            .filter(item => item.id !== 'HOME' && item.id !== 'SETTINGS')
                            .map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id as DashboardSection)}
                                    className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-4 group hover:border-transparent"
                                >
                                    <div className={`p-5 rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-110 ${item.color} ${item.darkColor}`}>
                                        {React.cloneElement(item.icon as React.ReactElement<any>, { size: 32 })}
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200 text-lg group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                    </div>

                    {/* Market News (Moved from Stocks) */}
                    <div className="mt-12">
                         <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <Newspaper size={24} className="text-indigo-500" /> Latest Financial News
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ECONOMIC_NEWS.map(news => (
                                <a 
                                    key={news.id} 
                                    href={news.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="block bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-xl transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg uppercase tracking-wide">{news.source}</span>
                                        <span className="text-xs text-slate-400 font-medium">{news.time}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 dark:text-white text-base line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                                        {news.title}
                                    </h4>
                                </a>
                            ))}
                         </div>
                    </div>
                </div>
            );
          case 'STATUS':
            const monthlyIncome = user.financialData?.monthlyIncome || 0;
            const monthlyExpenses = user.financialData?.monthlyExpenses || 0;
            const totalMonthlySavings = user.financialData?.monthlySavings || 0;
            const jarBalance = user.savingsJarBalance || 0;

            // Logic: 3 months expenses is a healthy emergency fund
            const emergencyFundGoal = monthlyExpenses * 3;
            const isEmergencyFundHealthy = jarBalance >= emergencyFundGoal;

            // Allocation Logic
            let equitySplit = 0;
            let debtSplit = 0;
            let jarSplit = 0;
            let adviceText = "";
            let remainingForInvestment = totalMonthlySavings;

            if (!isEmergencyFundHealthy) {
                // Scenario: Need to build safety net
                // Suggest saving 30% of surplus into Jar/Bank, invest rest conservatively
                jarSplit = totalMonthlySavings * 0.30;
                debtSplit = totalMonthlySavings * 0.40; // Safer funds
                equitySplit = totalMonthlySavings * 0.30; // Small growth
                remainingForInvestment = totalMonthlySavings - jarSplit; // Visual deduction guidance
                
                adviceText = `Your Savings Jar (₹${jarBalance.toLocaleString('en-IN')}) is below the recommended emergency fund of ₹${emergencyFundGoal.toLocaleString('en-IN')}. We recommend allocating 30% of your monthly savings to your Bank/Jar until it's built up. Invest the remaining ₹${remainingForInvestment.toLocaleString('en-IN')} in balanced Debt/Equity funds.`;
            } else {
                // Scenario: Healthy Safety Net
                // Suggest Aggressive Growth
                jarSplit = totalMonthlySavings * 0.05; // Maintain habit
                debtSplit = totalMonthlySavings * 0.20;
                equitySplit = totalMonthlySavings * 0.75; // Go aggressive
                remainingForInvestment = totalMonthlySavings; // Treat almost all as investable

                adviceText = `Great job! Your Savings Jar is healthy. You can afford to take more risks. We suggest investing ~90% of your monthly savings (₹${(equitySplit + debtSplit).toLocaleString('en-IN')}) into High Growth Stocks, Mutual Funds, and SIPs to maximize wealth creation.`;
            }

            const investmentData = [
                { name: 'Equity (Stocks/MF)', value: equitySplit, color: '#10b981', desc: 'High Growth Potential' },
                { name: 'Debt (PPF/Bonds)', value: debtSplit, color: '#f59e0b', desc: 'Moderate Stability' },
                { name: 'Bank/Jar (Safety)', value: jarSplit, color: '#3b82f6', desc: 'Emergency Cash' },
            ];

            const goalCalculated = selectedGoalId ? calculateGoalMetrics(parseFloat(goalInput.cost) || 0, parseFloat(goalInput.years) || 3) : null;

            return (
              <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
                <h2 className="text-3xl font-extrabold flex items-center gap-3 mb-6 text-slate-800 dark:text-white"><div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 shadow-sm"><BarChart3 size={32} /></div> My Monetary Status</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Monthly Profile Card */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Monthly Profile</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50"><span className="text-slate-500 dark:text-slate-400 font-medium">Income</span><span className="text-2xl font-bold text-emerald-600">₹{monthlyIncome.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50"><span className="text-slate-500 dark:text-slate-400 font-medium">Expenses</span><span className="text-2xl font-bold text-rose-500">₹{monthlyExpenses.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                <span className="text-blue-700 dark:text-blue-300 font-bold">Total Savings</span>
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{totalMonthlySavings.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Savings Jar Card */}
                    <SavingsJar 
                        balance={user.savingsJarBalance || 0} 
                        onUpdate={(bal) => onUserUpdate({ savingsJarBalance: bal })} 
                    />

                    {/* Financial Health Advice */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 relative overflow-hidden text-white flex flex-col">
                         <div className="absolute top-0 right-0 p-24 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
                         <div className="flex items-center gap-2 mb-4 relative z-10">
                             <Lightbulb className="text-yellow-400" />
                             <h3 className="text-lg font-bold">Investment Guidance</h3>
                         </div>
                         <div className="flex-1 relative z-10">
                             <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                                {adviceText}
                             </p>
                         </div>
                         <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
                             <span className="text-xs text-slate-400 uppercase font-bold">Recommended Action</span>
                             <span className={`text-sm font-bold ${isEmergencyFundHealthy ? 'text-emerald-400' : 'text-blue-400'}`}>
                                 {isEmergencyFundHealthy ? '🚀 Invest Aggressively' : '🛡️ Secure Bank Savings'}
                             </span>
                         </div>
                    </div>
                </div>

                {/* Smart Investment Allocation */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20">
                        <div>
                             <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><Sparkles className="text-emerald-500" /> Smart Investment Plan</h3>
                             <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                                Suggested breakdown of your 
                                <span className="font-bold text-slate-800 dark:text-slate-200 mx-1">₹{totalMonthlySavings.toLocaleString('en-IN')}</span> 
                                monthly savings.
                             </p>
                        </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="h-[300px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={investmentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {investmentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                         formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Allocation']}
                                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-4">
                             {investmentData.map((item, idx) => (
                                 <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                                     <div className="flex items-center gap-4">
                                         <div className={`p-3 rounded-lg ${idx === 0 ? 'bg-emerald-100 text-emerald-600' : idx === 1 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                             {idx === 0 ? <TrendingUp size={20} /> : idx === 1 ? <Shield size={20} /> : <PiggyBank size={20} />}
                                         </div>
                                         <div>
                                             <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</h4>
                                             <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                                         </div>
                                     </div>
                                     <div className="text-right">
                                         <p className="font-extrabold text-slate-800 dark:text-white">₹{Math.round(item.value).toLocaleString('en-IN')}</p>
                                         <p className="text-xs font-bold text-slate-400">{Math.round((item.value/totalMonthlySavings)*100)}%</p>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                     <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Goal className="text-purple-600" /> Interactive Goal Planner</h3>
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="col-span-1 space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                             {user.goals && user.goals.map(goalId => {
                                    const goalDef = SAVING_GOALS.find(g => g.id === goalId);
                                    if (!goalDef) return null;
                                    const isSelected = selectedGoalId === goalId;
                                    return (
                                        <button key={goalId} onClick={() => setSelectedGoalId(goalId)} className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${isSelected ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-500 shadow-md' : 'bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
                                            <span className="text-2xl">{goalDef.icon}</span><span className={`font-bold ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-slate-300'}`}>{goalDef.label}</span>
                                        </button>
                                    );
                                })}
                        </div>
                        <div className="col-span-1 lg:col-span-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            {selectedGoalId ? (
                                <div className="animate-fade-in space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Current Cost (₹)</label>
                                            <input type="number" value={goalInput.cost} onChange={(e) => setGoalInput({...goalInput, cost: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-white" placeholder="e.g. 50000" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Years to Achieve</label>
                                            <input type="number" value={goalInput.years} onChange={(e) => setGoalInput({...goalInput, years: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-white" placeholder="e.g. 5" />
                                        </div>
                                    </div>
                                    {goalCalculated && (
                                        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"><p className="text-slate-400 text-xs font-bold uppercase mb-1">Future Cost</p><p className="text-2xl font-extrabold text-slate-800 dark:text-white">₹{Math.round(goalCalculated.futureCost).toLocaleString('en-IN')}</p></div>
                                                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"><p className="text-slate-400 text-xs font-bold uppercase mb-1">SIP Required</p><p className="text-2xl font-extrabold text-emerald-600">₹{Math.round(goalCalculated.sipRequired).toLocaleString('en-IN')}</p></div>
                                            </div>
                                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800"><h4 className="font-bold text-purple-800 dark:text-purple-300 text-sm mb-1">Strategy: {goalCalculated.strategy}</h4><p className="text-slate-600 dark:text-slate-400 text-xs">{goalCalculated.recommendation}</p></div>
                                        </div>
                                    )}
                                </div>
                            ) : (<div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60"><Calculator size={48} /><p className="font-medium mt-2">Select a goal</p></div>)}
                        </div>
                     </div>
                </div>
              </div>
            );
          case 'BUDGET': return <BudgetSection transactions={MOCK_TRANSACTIONS} />;
          case 'STUDENT': return <StudentCorner />;
          case 'PPF': return <PPFSection />;
          case 'LOANS': return <LoansSection />;
          case 'ADVISOR': return <AdvisorSection user={user} />;
          case 'SETTINGS': return <SettingsSection user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} onUpdateUser={onUserUpdate} />;
          case 'INFO': return <InfoSection />;
          case 'INSURANCE': return <InsuranceSection />;
          case 'MUTUAL_FUNDS': return <MutualFunds />;
          case 'MSME': return <MSMESection />;
          case 'STOCKS':
              return (
                  <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
                      {/* AI Header */}
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                              <div>
                                  <h2 className="text-3xl font-bold mb-2">Market Overview 📈</h2>
                                  <p className="text-emerald-100 max-w-lg">Track live stocks, analyze trends with AI, and stay ahead of the curve.</p>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                  <button onClick={fetchAnalysis} disabled={loadingAnalysis} className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                                      <TrendingUp size={20} /> {loadingAnalysis ? 'Analyzing...' : 'Refresh AI Analysis'}
                                  </button>
                              </div>
                          </div>
                          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                              <TrendingUp size={200} />
                          </div>
                      </div>

                      {/* AI Analysis Result */}
                      {marketAnalysis && (
                          <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl shadow-xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-20 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                              <div className="flex items-center gap-2 mb-4">
                                  <Sparkles className="text-yellow-400" />
                                  <h3 className="font-bold text-lg">AI Market Insights</h3>
                              </div>
                              <div className="prose prose-invert prose-sm max-w-none">
                                  <ReactMarkdown>{marketAnalysis}</ReactMarkdown>
                              </div>
                          </div>
                      )}

                      {/* Portfolio Planner Section */}
                      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                          {/* Header */}
                          <div className="flex items-center gap-3 mb-6">
                              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                                  <Sparkles size={24} />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">AI Portfolio Planner</h3>
                                  <p className="text-slate-500 dark:text-slate-400 text-sm">Build a personalized stock portfolio based on your goals.</p>
                              </div>
                          </div>

                          {/* Risk Profile Selectors (New) */}
                          <div className="mb-6">
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Select Risk Profile</label>
                              <div className="flex gap-3">
                                  {['Conservative', 'Balanced', 'Aggressive'].map((profile) => {
                                      const currentRate = parseInt(portfolioParams.returnRate);
                                      const isSelected = 
                                          (profile === 'Conservative' && currentRate <= 12) ||
                                          (profile === 'Balanced' && currentRate > 12 && currentRate <= 18) ||
                                          (profile === 'Aggressive' && currentRate > 18);
                                      
                                      return (
                                          <button
                                              key={profile}
                                              onClick={() => handleRiskSelect(profile as any)}
                                              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${
                                                  isSelected
                                                  ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300'
                                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                              }`}
                                          >
                                              {profile}
                                          </button>
                                      );
                                  })}
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                              {/* Amount */}
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Investment Amount (₹)</label>
                                  <input 
                                      type="number" 
                                      value={portfolioParams.amount}
                                      onChange={(e) => setPortfolioParams({...portfolioParams, amount: e.target.value})}
                                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl font-bold focus:ring-2 focus:ring-purple-500 outline-none dark:text-white"
                                      placeholder="e.g. 100000"
                                  />
                              </div>
                              
                              {/* Duration */}
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Duration (Years)</label>
                                  <select
                                      value={portfolioParams.duration}
                                      onChange={(e) => setPortfolioParams({...portfolioParams, duration: e.target.value})}
                                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl font-bold focus:ring-2 focus:ring-purple-500 outline-none dark:text-white"
                                  >
                                      {[1, 3, 5, 7, 10, 15, 20].map(y => <option key={y} value={y}>{y} Years</option>)}
                                  </select>
                              </div>

                              {/* Return Rate */}
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Expected Return ({portfolioParams.returnRate}%)</label>
                                  <input 
                                      type="range" 
                                      min="8" max="30" step="1"
                                      value={portfolioParams.returnRate}
                                      onChange={(e) => setPortfolioParams({...portfolioParams, returnRate: e.target.value})}
                                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                  />
                                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                      <span>Conservative (8%)</span>
                                      <span>Aggressive (30%)</span>
                                  </div>
                              </div>
                          </div>

                          <button 
                              onClick={handleGeneratePortfolio}
                              disabled={loadingPortfolio || !portfolioParams.amount}
                              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              {loadingPortfolio ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                              {loadingPortfolio ? 'Generating Strategy...' : 'Generate My Portfolio'}
                          </button>

                          {portfolioResult && (
                              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 prose prose-sm max-w-none dark:prose-invert">
                                  <ReactMarkdown>{portfolioResult}</ReactMarkdown>
                              </div>
                          )}
                      </div>

                      {/* Search Bar */}
                      <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                          <input 
                              type="text" 
                              placeholder="Search stocks by Symbol or Name (e.g., RELIANCE, TCS)..." 
                              value={stockSearchTerm}
                              onChange={(e) => setStockSearchTerm(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 font-medium"
                          />
                      </div>

                      {/* Stock List */}
                      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                          <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                  <thead>
                                      <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                                          <th className="p-5">Symbol</th>
                                          <th className="p-5">Company Name</th>
                                          <th className="p-5">Market</th>
                                          <th className="p-5 text-right">Price</th>
                                          <th className="p-5 text-right">Change</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                      {filteredStocks.length > 0 ? (
                                          filteredStocks.map((stock) => (
                                              <tr key={stock.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                                  <td className="p-5">
                                                      <span className="font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-sm">{stock.symbol}</span>
                                                  </td>
                                                  <td className="p-5 font-medium text-slate-600 dark:text-slate-300">{stock.name}</td>
                                                  <td className="p-5">
                                                      <span className="text-xs font-bold text-slate-400 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded">{stock.market}</span>
                                                  </td>
                                                  <td className="p-5 text-right font-bold text-slate-800 dark:text-white">₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                                  <td className="p-5 text-right">
                                                      <span className={`inline-flex items-center gap-1 font-bold text-sm ${stock.isUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-lg'}`}>
                                                          {stock.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={