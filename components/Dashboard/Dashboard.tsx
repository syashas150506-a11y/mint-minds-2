
import React, { useState, useEffect } from 'react';
import { User, Language } from '../../types';
import { TRANSLATIONS } from '../../translations';
import { MOCK_TRANSACTIONS, ECONOMIC_NEWS, SAVING_GOALS, ALL_STOCKS } from '../../constants';
import { AiAdvisor } from './AiAdvisor';
import { GeneralChatBot } from './GeneralChatBot';
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
  BarChart3, LayoutGrid, Home as HomeIcon, ArrowLeft, Building2, Search, Loader2, MessageSquare
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
  const [showGeneralChat, setShowGeneralChat] = useState(false);
  const [marketAnalysis, setMarketAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // News State
  const [news, setNews] = useState(ECONOMIC_NEWS);
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);

  // Stock State Management
  const [stocks, setStocks] = useState(ALL_STOCKS);
  const [isRefreshingStocks, setIsRefreshingStocks] = useState(false);
  const [stockSearchTerm, setStockSearchTerm] = useState('');
  const [marketFilter, setMarketFilter] = useState<'All' | 'NSE' | 'BSE'>('All');
  const [filteredStocks, setFilteredStocks] = useState(ALL_STOCKS);

  // Translation helper
  const lang = user.language || 'en';
  const t = (key: string) => TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;

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

  // PERIODIC REFRESH EFFECT (60 Seconds)
  useEffect(() => {
    const autoRefreshTimer = setInterval(() => {
      // 1. Silent Stock Refresh
      setStocks(prev => prev.map(s => {
        const fluctuation = 1 + (Math.random() - 0.5) * 0.015; // +/- 1.5%
        const newPrice = parseFloat((s.price * fluctuation).toFixed(2));
        const priceDiff = newPrice - s.price;
        const newChange = parseFloat((s.change + (priceDiff / s.price * 100)).toFixed(2));
        return {
          ...s,
          price: newPrice,
          change: newChange,
          isUp: newChange >= 0
        };
      }));

      // 2. Silent News Shuffle
      setNews(prev => {
        const shuffled = [...ECONOMIC_NEWS].sort(() => Math.random() - 0.5);
        return shuffled;
      });

      console.debug("Wealth Waves: Periodic auto-sync completed at " + new Date().toLocaleTimeString());
    }, 60000);

    return () => clearInterval(autoRefreshTimer);
  }, []);

  // Update filtered stocks when either stocks list, search term, or market filter changes
  useEffect(() => {
      const lowerTerm = stockSearchTerm.toLowerCase();
      const filtered = stocks.filter(stock => {
          const matchesSearch = stock.name.toLowerCase().includes(lowerTerm) || 
                              stock.symbol.toLowerCase().includes(lowerTerm);
          const matchesMarket = marketFilter === 'All' || stock.market === marketFilter;
          return matchesSearch && matchesMarket;
      });
      setFilteredStocks(filtered);
  }, [stockSearchTerm, stocks, marketFilter]);

  const handleRefreshNews = () => {
    setIsRefreshingNews(true);
    // Simulate fetching fresh news
    setTimeout(() => {
      const shuffledNews = [...ECONOMIC_NEWS].sort(() => Math.random() - 0.5);
      setNews(shuffledNews);
      setIsRefreshingNews(false);
    }, 800);
  };

  const handleRefreshStocks = () => {
    setIsRefreshingStocks(true);
    // Simulate API network delay
    setTimeout(() => {
      setStocks(prev => prev.map(s => {
        // Random fluctuation between -1% and +1%
        const fluctuation = 1 + (Math.random() - 0.5) * 0.02;
        const newPrice = parseFloat((s.price * fluctuation).toFixed(2));
        const priceDiff = newPrice - s.price;
        const newChange = parseFloat((s.change + (priceDiff / s.price * 100)).toFixed(2));
        
        return {
          ...s,
          price: newPrice,
          change: newChange,
          isUp: newChange >= 0
        };
      }));
      setIsRefreshingStocks(false);
    }, 800);
  };

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
      { id: 'HOME', label: t('home'), icon: <HomeIcon size={20} />, color: 'text-indigo-600 bg-indigo-50', darkColor: 'dark:text-indigo-400 dark:bg-indigo-900/20' },
      { id: 'STOCKS', label: t('stocks'), icon: <TrendingUp size={20} />, color: 'text-emerald-600 bg-emerald-50', darkColor: 'dark:text-emerald-400 dark:bg-emerald-900/20' },
      { id: 'STATUS', label: t('status'), icon: <BarChart3 size={20} />, color: 'text-blue-600 bg-blue-50', darkColor: 'dark:text-blue-400 dark:bg-blue-900/20' },
      { id: 'BUDGET', label: t('budget'), icon: <Wallet size={20} />, color: 'text-rose-600 bg-rose-50', darkColor: 'dark:text-rose-400 dark:bg-rose-900/20' },
      { id: 'MSME', label: t('msme'), icon: <Building2 size={20} />, color: 'text-amber-600 bg-amber-50', darkColor: 'dark:text-amber-400 dark:bg-amber-900/20' },
      { id: 'MUTUAL_FUNDS', label: t('mutualFunds'), icon: <PieChartIcon size={20} />, color: 'text-violet-600 bg-violet-50', darkColor: 'dark:text-violet-400 dark:bg-violet-900/20' },
      { id: 'INSURANCE', label: t('insurance'), icon: <Shield size={20} />, color: 'text-red-600 bg-red-50', darkColor: 'dark:text-red-400 dark:bg-red-900/20' },
      { id: 'LOANS', label: t('loans'), icon: <Banknote size={20} />, color: 'text-cyan-600 bg-cyan-50', darkColor: 'dark:text-cyan-400 dark:bg-cyan-900/20' },
      { id: 'PPF', label: t('ppf'), icon: <RefreshCw size={20} />, color: 'text-orange-600 bg-orange-50', darkColor: 'dark:text-orange-400 dark:bg-orange-900/20' },
      { id: 'INFO', label: t('govtSchemes'), icon: <Landmark size={20} />, color: 'text-teal-600 bg-teal-50', darkColor: 'dark:text-teal-400 dark:bg-teal-900/20' },
      { id: 'STUDENT', label: t('studentCorner'), icon: <GraduationCap size={20} />, color: 'text-pink-600 bg-pink-50', darkColor: 'dark:text-pink-400 dark:bg-pink-900/20' },
      { id: 'ADVISOR', label: t('advisor'), icon: <Users size={20} />, color: 'text-purple-600 bg-purple-50', darkColor: 'dark:text-purple-400 dark:bg-purple-900/20' },
      { id: 'SETTINGS', label: t('settings'), icon: <Settings size={20} />, color: 'text-slate-600 bg-slate-50', darkColor: 'dark:text-slate-400 dark:bg-slate-900/20' },
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

  const LiveBadge = () => (
    <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">Live</span>
    </div>
  );

  const renderContent = () => {
      switch(activeSection) {
          case 'HOME':
            return (
                <div className="animate-fade-in space-y-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
                            {t('welcome')}, <span className="text-emerald-600">{user.name.split(' ')[0]}</span>!
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            {t('manageWealth')}
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

                    {/* Market News on Home */}
                    <div className="mt-12">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Newspaper size={24} className="text-indigo-500" /> {t('latestNews')}
                                <LiveBadge />
                            </h3>
                            <button 
                                onClick={handleRefreshNews}
                                disabled={isRefreshingNews}
                                className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                            >
                                <RefreshCw size={16} className={`${isRefreshingNews ? 'animate-spin' : ''}`} />
                                {isRefreshingNews ? 'Refreshing...' : t('refreshNews')}
                            </button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {news.map(newsItem => (
                                <a 
                                    key={newsItem.id} 
                                    href={newsItem.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="block bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-xl transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg uppercase tracking-wide">{newsItem.source}</span>
                                        <span className="text-xs text-slate-400 font-medium">{newsItem.time}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 dark:text-white text-base line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                                        {newsItem.title}
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

            const emergencyFundGoal = monthlyExpenses * 3;
            const isEmergencyFundHealthy = jarBalance >= emergencyFundGoal;

            let equitySplit = 0;
            let debtSplit = 0;
            let jarSplit = 0;
            let adviceText = "";
            let remainingForInvestment = totalMonthlySavings;

            if (!isEmergencyFundHealthy) {
                jarSplit = totalMonthlySavings * 0.30;
                debtSplit = totalMonthlySavings * 0.40; 
                equitySplit = totalMonthlySavings * 0.30; 
                remainingForInvestment = totalMonthlySavings - jarSplit; 
                
                adviceText = `Your Savings Jar (₹${jarBalance.toLocaleString('en-IN')}) is below the recommended emergency fund of ₹${emergencyFundGoal.toLocaleString('en-IN')}. We recommend allocating 30% of your monthly savings to your Bank/Jar until it's built up. Invest the remaining ₹${remainingForInvestment.toLocaleString('en-IN')} in balanced Debt/Equity funds.`;
            } else {
                jarSplit = totalMonthlySavings * 0.05; 
                debtSplit = totalMonthlySavings * 0.20;
                equitySplit = totalMonthlySavings * 0.75; 
                remainingForInvestment = totalMonthlySavings; 

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
                <h2 className="text-3xl font-extrabold flex items-center gap-3 mb-6 text-slate-800 dark:text-white"><div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 shadow-sm"><BarChart3 size={32} /></div> {t('status')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                    <SavingsJar 
                        balance={user.savingsJarBalance || 0} 
                        onUpdate={(bal) => onUserUpdate({ savingsJarBalance: bal })} 
                    />

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
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                              <div>
                                  <h2 className="text-3xl font-bold flex items-center">{t('stocks')} <LiveBadge /></h2>
                                  <p className="text-emerald-100 max-w-lg">Track live stocks, analyze trends with AI, and stay ahead of the curve.</p>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                  <button onClick={handleRefreshStocks} disabled={isRefreshingStocks} className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group">
                                      <RefreshCw size={20} className={`${isRefreshingStocks ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} /> 
                                      {isRefreshingStocks ? 'Refreshing...' : 'Update Live Prices'}
                                  </button>
                                  <button onClick={fetchAnalysis} disabled={loadingAnalysis} className="bg-emerald-700/50 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2 border border-emerald-500/30">
                                      <Sparkles size={20} /> {loadingAnalysis ? 'Analyzing...' : 'Refresh AI Analysis'}
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              );
      }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
        
        {mobileMenuOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-600 p-2 rounded-xl text-white">
                        <Brain size={24} />
                    </div>
                    <h1 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">Wealth Waves</h1>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-500">
                    <X size={24} />
                </button>
            </div>

            <nav className="px-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveSection(item.id as DashboardSection); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                            activeSection === item.id 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                    <LogOut size={20} /> {t('logout')}
                </button>
            </div>
        </aside>

        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative">
             <div className="lg:hidden p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
                    <Menu size={24} />
                </button>
                <div className="font-bold text-slate-800 dark:text-white">
                    {menuItems.find(m => m.id === activeSection)?.label}
                </div>
                <div className="w-10" /> 
             </div>

             <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                <div className="max-w-7xl mx-auto">
                    {activeSection !== 'HOME' && (
                        <button 
                            onClick={() => setActiveSection('HOME')}
                            className="mb-6 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold transition-colors group"
                        >
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600">
                                <ArrowLeft size={18} />
                            </div>
                            {t('backToDashboard')}
                        </button>
                    )}
                    {renderContent()}
                </div>
             </div>

             {/* Global ChatBot Floating Area */}
             <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
                {showGeneralChat && (
                    <div className="mb-4 w-[350px] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-slide-up-fade">
                        <GeneralChatBot user={user} onClose={() => setShowGeneralChat(false)} />
                    </div>
                )}
                <button 
                    onClick={() => setShowGeneralChat(!showGeneralChat)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-90 ${showGeneralChat ? 'bg-slate-800 text-white rotate-90' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-110'}`}
                >
                    {showGeneralChat ? <X size={28} /> : (
                        <div className="relative">
                            <MessageSquare size={28} />
                            <div className="absolute -top-1 -right-1 bg-white p-0.5 rounded-full">
                                <Sparkles size={12} className="text-emerald-500" />
                            </div>
                        </div>
                    )}
                </button>
             </div>
        </main>

        {showAiAdvisor && (
            <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center pointer-events-none p-4 sm:p-0">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={() => setShowAiAdvisor(false)} />
                <div className="bg-white w-full max-w-lg h-[80vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl shadow-2xl relative pointer-events-auto overflow-hidden animate-slide-up sm:animate-scale-in">
                    <AiAdvisor user={user} transactions={MOCK_TRANSACTIONS} onClose={() => setShowAiAdvisor(false)} />
                </div>
            </div>
        )}
    </div>
  );
};
