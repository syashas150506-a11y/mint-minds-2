import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { MOCK_TRANSACTIONS, ECONOMIC_NEWS, SAVING_GOALS } from '../../constants';
import { AiAdvisor } from './AiAdvisor';
import { StudentCorner } from './StudentCorner';
import { PPFSection } from './PPFSection';
import { LoansSection } from './LoansSection';
import { AdvisorSection } from './AdvisorSection';
import { SettingsSection } from './SettingsSection';
import { BudgetSection } from './BudgetSection';
import { getStockMarketAnalysis } from '../../services/geminiService';
import { 
  LogOut, Wallet, TrendingUp, PieChart as PieChartIcon, PiggyBank, Shield, Banknote, 
  GraduationCap, ArrowLeft, Bot, Activity, Globe, Landmark, Goal, Brain, 
  RefreshCw, ArrowUpRight, ArrowDownRight, Sparkles, Search, Plus, Check, 
  Trash2, X, Zap, Briefcase, Coins, Percent, Layers, Factory, TrendingDown, 
  AlertTriangle, Calculator, Calendar, Info, ArrowRight, MessageCircle, FileText,
  Newspaper, ExternalLink, Users, Settings
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AreaChart, Area, ResponsiveContainer, YAxis, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (data: Partial<User>) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

type DashboardSection = 'HOME' | 'STATUS' | 'STOCKS' | 'MUTUAL_FUNDS' | 'PPF' | 'INSURANCE' | 'LOANS' | 'STUDENT' | 'MSME' | 'ADVISOR' | 'SETTINGS' | 'BUDGET';

const generateMockHistory = (basePrice: number, isUp: boolean) => {
    const data = [];
    let current = isUp ? basePrice * 0.96 : basePrice * 1.04;
    for (let i = 0; i < 7; i++) {
        data.push({ value: current });
        const move = (Math.random() - (isUp ? 0.35 : 0.65)) * (basePrice * 0.02);
        current += move;
    }
    data.push({ value: basePrice }); 
    return data;
};

const INITIAL_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹2,985.60', val: 2985.60, change: '+1.45%', isUp: true, market: 'NSE', high52: '₹3,024.90', low52: '₹2,220.30' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹4,120.30', val: 4120.30, change: '-0.85%', isUp: false, market: 'NSE', high52: '₹4,254.75', low52: '₹3,310.00' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '₹1,450.75', val: 1450.75, change: '+0.25%', isUp: true, market: 'NSE', high52: '₹1,757.50', low52: '₹1,363.55' },
  { symbol: 'INFY', name: 'Infosys', price: '₹1,670.50', val: 1670.50, change: '+1.10%', isUp: true, market: 'NSE', high52: '₹1,733.00', low52: '₹1,215.00' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$185.60', val: 185.60, change: '+1.20%', isUp: true, market: 'NASDAQ', high52: '$199.62', low52: '$164.08' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$172.50', val: 172.50, change: '-0.40%', isUp: false, market: 'NASDAQ', high52: '$179.95', low52: '$130.00' },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: '$415.20', val: 415.20, change: '+0.90%', isUp: true, market: 'NASDAQ', high52: '$430.82', low52: '$310.00' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$178.40', val: 178.40, change: '-2.30%', isUp: false, market: 'NASDAQ', high52: '$299.29', low52: '$152.37' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: '₹980.20', val: 980.20, change: '+3.45%', isUp: true, market: 'NSE', high52: '₹1,065.60', low52: '₹400.40' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '₹1,090.50', val: 1090.50, change: '+0.60%', isUp: true, market: 'NSE', high52: '₹1,110.00', low52: '₹890.00' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: '$850.10', val: 850.10, change: '+4.50%', isUp: true, market: 'NASDAQ', high52: '$974.00', low52: '$400.00' },
  { symbol: 'AMZN', name: 'Amazon.com', price: '$178.30', val: 178.30, change: '+0.75%', isUp: true, market: 'NASDAQ', high52: '$181.00', low52: '$110.00' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: '₹1,120.40', val: 1120.40, change: '+1.15%', isUp: true, market: 'NSE', high52: '₹1,220.50', low52: '₹750.00' },
  { symbol: 'SBIN', name: 'State Bank of India', price: '₹760.80', val: 760.80, change: '-0.30%', isUp: false, market: 'NSE', high52: '₹790.00', low52: '₹550.00' },
  { symbol: 'LICI', name: 'LIC India', price: '₹980.00', val: 980.00, change: '+0.50%', isUp: true, market: 'NSE', high52: '₹1,175.00', low52: '₹530.00' },
].map(s => ({
    ...s,
    history: generateMockHistory(s.val, s.isUp)
}));

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUserUpdate, darkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('HOME');
  const [showAi, setShowAi] = useState(false);
  const [stockAnalysis, setStockAnalysis] = useState<string | null>(null);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [stockSearch, setStockSearch] = useState('');
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [goalInput, setGoalInput] = useState({ cost: '', years: '3' });
  const INFLATION_RATE = 6.2;

  useEffect(() => {
    const interval = setInterval(() => {
        refreshMarket();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const refreshMarket = () => {
    setIsRefreshing(true);
    setTimeout(() => {
        setStocks(currentStocks => currentStocks.map(stock => {
            const volatility = 0.005; 
            const changeFactor = 1 + (Math.random() - 0.5) * volatility * 2;
            const newVal = stock.val * changeFactor;
            const symbol = stock.price.charAt(0);
            const formattedVal = newVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const newPriceStr = `${symbol}${formattedVal}`;
            const newHistory = [...stock.history.slice(1), { value: newVal }];
            const currentChangeNum = parseFloat(stock.change.replace(/[^0-9.-]/g, ''));
            const newChangeNum = currentChangeNum + (Math.random() - 0.5) * 0.1;
            const isUp = newChangeNum >= 0; 
            const newChangeStr = `${newChangeNum >= 0 ? '+' : ''}${newChangeNum.toFixed(2)}%`;
            return { ...stock, val: newVal, price: newPriceStr, change: newChangeStr, isUp: isUp, history: newHistory };
        }));
        setIsRefreshing(false);
    }, 600);
  };

  const addNewCustomStock = () => {
    if (!stockSearch.trim()) return;
    const symbol = stockSearch.toUpperCase();
    
    // Check if it already exists in the list
    if (stocks.some(s => s.symbol === symbol)) {
        if (!user.watchlist?.includes(symbol)) {
            toggleWatchlist(symbol);
        }
        setStockSearch('');
        return;
    }

    const basePrice = Math.floor(Math.random() * 2000) + 100;
    const isUp = Math.random() > 0.5;
    const changeVal = (Math.random() * 5).toFixed(2);
    
    const newStock = {
        symbol,
        name: `${symbol} Custom Ltd`,
        price: `₹${basePrice.toFixed(2)}`,
        val: basePrice,
        change: `${isUp ? '+' : '-'}${changeVal}%`,
        isUp,
        market: 'CUSTOM',
        high52: `₹${(basePrice * 1.2).toFixed(2)}`,
        low52: `₹${(basePrice * 0.8).toFixed(2)}`,
        history: generateMockHistory(basePrice, isUp)
    };
    
    setStocks(prev => [newStock, ...prev]);
    toggleWatchlist(symbol);
    setStockSearch('');
  };

  const calculateGoalMetrics = (cost: number, years: number) => {
    const futureCost = cost * Math.pow((1 + INFLATION_RATE / 100), years);
    const inflationImpact = futureCost - cost;
    let roi = 0;
    let strategy = '';
    let recommendation = '';
    let icon = null;

    if (years <= 3) {
        roi = 7.5;
        strategy = 'Conservative (FD/Debt)';
        recommendation = 'For short-term goals, prioritize capital safety. Use Liquid Funds or FDs to match inflation.';
        icon = <PiggyBank className="text-blue-500" />;
    } else if (years <= 7) {
        roi = 11;
        strategy = 'Balanced (Hybrid Funds)';
        recommendation = 'For medium-term goals, mix equity and debt. Aggressive Hybrid Funds can beat inflation by 3-4%.';
        icon = <PieChartIcon className="text-purple-500" />;
    } else {
        roi = 14;
        strategy = 'Aggressive (Equity/Stocks)';
        recommendation = 'For long-term goals, you must invest in Equity/Stocks to generate real wealth and outpace inflation significantly.';
        icon = <TrendingUp className="text-emerald-500" />;
    }

    const r = roi / 12 / 100;
    const n = years * 12;
    const sipRequired = futureCost / ( ( (Math.pow(1 + r, n) - 1) / r ) * (1 + r) );

    return { futureCost, inflationImpact, sipRequired, strategy, recommendation, roi, icon };
  };

  const menuItems = [
    { id: 'STATUS', label: 'My Monetary Status', icon: <Wallet size={24} />, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'BUDGET', label: 'Budget Planner', icon: <Calculator size={24} />, image: 'https://images.unsplash.com/photo-1565514020176-db792f4b6d96?auto=format&fit=crop&q=80&w=800', color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'STOCKS', label: 'Stocks', icon: <TrendingUp size={24} />, image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'MUTUAL_FUNDS', label: 'Mutual Fund', icon: <PieChartIcon size={24} />, image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=800', color: 'text-violet-600', bg: 'bg-violet-50' },
    { id: 'PPF', label: 'PPF', icon: <PiggyBank size={24} />, image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800', color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'INSURANCE', label: 'Insurance', icon: <Shield size={24} />, image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800', color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'LOANS', label: 'Loans', icon: <Banknote size={24} />, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'ADVISOR', label: 'Talk to Advisor', icon: <Users size={24} />, image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800', color: 'text-teal-600', bg: 'bg-teal-50' },
    { id: 'MSME', label: 'MSME', icon: <Factory size={24} />, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'STUDENT', label: 'Student Corner', icon: <GraduationCap size={24} />, image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800', color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'SETTINGS', label: 'Settings', icon: <Settings size={24} />, image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800', color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  const fetchStockAdvice = async () => {
    setLoadingStocks(true);
    const analysis = await getStockMarketAnalysis();
    setStockAnalysis(analysis);
    setLoadingStocks(false);
  };

  const toggleWatchlist = (symbol: string) => {
    const currentWatchlist = user.watchlist || [];
    let newWatchlist;
    if (currentWatchlist.includes(symbol)) {
        newWatchlist = currentWatchlist.filter(s => s !== symbol);
    } else {
        newWatchlist = [...currentWatchlist, symbol];
    }
    onUserUpdate({ watchlist: newWatchlist });
  };

  const filteredStocks = stocks.filter(stock => stock.name.toLowerCase().includes(stockSearch.toLowerCase()) || stock.symbol.toLowerCase().includes(stockSearch.toLowerCase()));

  const StockCard = ({ stock, isAdded, onToggle }: { stock: typeof stocks[0], isAdded: boolean, onToggle: () => void }) => (
    <div className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all bg-white group flex flex-col justify-between h-full relative overflow-hidden">
        <div className="mb-2 flex justify-between items-start z-10">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-base">{stock.symbol}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{stock.market}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1" title={stock.name}>{stock.name}</p>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className={`p-2 rounded-full transition-all shadow-sm ${isAdded ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                title={isAdded ? "Remove from Watchlist" : "Add to Watchlist"}
            >
                {isAdded ? <Trash2 size={16} /> : <Plus size={16} />}
            </button>
        </div>
        <div className="h-16 w-full my-3 -ml-2">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stock.history}>
                    <defs>
                        <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={stock.isUp ? "#10b981" : "#ef4444"} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={stock.isUp ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Area type="monotone" dataKey="value" stroke={stock.isUp ? "#10b981" : "#ef4444"} strokeWidth={2} fill={`url(#gradient-${stock.symbol})`} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-auto space-y-2 z-10">
            <div className="flex justify-between items-end">
                <span className="block font-bold text-lg text-slate-800">{stock.price}</span>
                <span className={`text-sm font-bold flex items-center ${stock.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stock.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {stock.change}
                </span>
            </div>
        </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'HOME':
        return (
          <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as DashboardSection)}
                        className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 hover:-translate-y-2 h-[280px]"
                    >
                        <div className="h-[65%] w-full overflow-hidden relative">
                            <img src={item.image} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="h-[35%] w-full p-4 flex flex-col items-center justify-center bg-white dark:bg-slate-800 relative z-10">
                            <div className={`p-2 rounded-xl ${item.bg} ${item.color} mb-1 transition-transform group-hover:scale-110 shadow-sm`}>{item.icon}</div>
                            <span className={`font-bold text-lg text-slate-800 dark:text-white`}>{item.label}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* News Section */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                            <Newspaper size={24} />
                        </div>
                        Live Financial News
                    </h2>
                    <span className="flex items-center gap-2 text-xs font-bold text-red-500 animate-pulse bg-red-50 px-2 py-1 rounded-full border border-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-500"/> LIVE UPDATES
                    </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Featured News (First item) */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                        <div className="h-48 md:h-auto md:w-1/3 bg-slate-100 rounded-2xl overflow-hidden relative group">
                             {/* Placeholder Image for news */}
                             <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="News" />
                             <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">BREAKING</div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">{ECONOMIC_NEWS[0].source}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs text-slate-500">{ECONOMIC_NEWS[0].time}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight hover:text-blue-600 transition-colors cursor-pointer" onClick={() => window.open(ECONOMIC_NEWS[0].url, '_blank')}>{ECONOMIC_NEWS[0].title}</h3>
                            <p className="text-slate-500 mb-6 line-clamp-2">Global markets are showing significant movement today as major economic indicators are released. Investors are closely monitoring the situation.</p>
                            <a href={ECONOMIC_NEWS[0].url} target="_blank" rel="noopener noreferrer" className="text-white bg-slate-900 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors w-fit">
                                Read Full Story <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Other News Items */}
                    {ECONOMIC_NEWS.slice(1).map(news => (
                        <div key={news.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">{news.source}</span>
                                    <span className="text-xs text-slate-400 font-medium">{news.time}</span>
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{news.title}</h3>
                            </div>
                            <a href={news.url} target="_blank" rel="noopener noreferrer" className="mt-4 text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-blue-600 transition-colors">
                                Read More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        );
      case 'STOCKS':
         return (
             <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                        <h2 className="text-3xl font-extrabold flex items-center gap-3 text-slate-800">
                            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shadow-sm"><TrendingUp size={32} /></div>
                            Live Market & Watchlist
                        </h2>
                        <p className="text-slate-500 mt-1 font-medium ml-1">Track your favorite stocks from NSE, BSE & Global Indices</p>
                     </div>
                     <div className="flex items-center gap-3">
                         <button onClick={refreshMarket} className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm font-bold text-sm group ${isRefreshing ? 'opacity-70 cursor-wait' : ''}`}>
                            <RefreshCw size={18} className={`${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                            <span className="hidden sm:inline">Refresh Prices</span>
                         </button>
                         <button onClick={fetchStockAdvice} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                            <Brain size={20} />
                            {loadingStocks ? 'Analyzing...' : 'Get AI Market Picks'}
                         </button>
                     </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Check size={20} className="text-emerald-500" /> My Watchlist</h3>
                    {!user.watchlist || user.watchlist.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300"><p className="text-slate-400 font-medium">Your watchlist is empty.</p></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                             {stocks.filter(s => user.watchlist?.includes(s.symbol)).map(stock => (
                                 <div key={stock.symbol} className="h-full"><StockCard stock={stock} isAdded={true} onToggle={() => toggleWatchlist(stock.symbol)} /></div>
                             ))}
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                     <h3 className="text-xl font-bold text-slate-800 mb-4">Add Stocks</h3>
                     <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input type="text" placeholder="Search by Symbol or Name..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" value={stockSearch} onChange={(e) => setStockSearch(e.target.value)} />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 p-1">
                        {filteredStocks.length > 0 ? filteredStocks.map(stock => {
                             const isAdded = user.watchlist?.includes(stock.symbol) || false;
                             return (<div key={stock.symbol} className="h-full"><StockCard stock={stock} isAdded={isAdded} onToggle={() => toggleWatchlist(stock.symbol)} /></div>)
                        }) : stockSearch ? (
                            <div className="col-span-full py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                <p className="text-slate-500 font-medium mb-4">Stock "{stockSearch.toUpperCase()}" not found in directory.</p>
                                <button 
                                    onClick={addNewCustomStock}
                                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 mx-auto"
                                >
                                    <Plus size={18} /> Add "{stockSearch.toUpperCase()}" as Custom Stock
                                </button>
                            </div>
                        ) : (
                            <div className="col-span-full text-center text-slate-400 py-4">Start typing to search stocks...</div>
                        )}
                     </div>
                </div>
                {stockAnalysis && (
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden animate-fade-in-up">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Bot size={120} /></div>
                        <div className="flex items-center gap-2 mb-6 text-blue-600"><Sparkles className="animate-pulse" /><span className="font-bold tracking-widest text-xs uppercase">Generated by Wealth Waves Intelligence</span></div>
                        <div className="prose prose-slate max-w-none"><ReactMarkdown>{stockAnalysis}</ReactMarkdown></div>
                    </div>
                )}
             </div>
         );
      case 'STATUS':
        const goalCalculated = selectedGoalId ? calculateGoalMetrics(parseFloat(goalInput.cost) || 0, parseFloat(goalInput.years) || 3) : null;
        
        // Investment Split Calculation
        const monthlySavings = user.financialData?.monthlySavings || 0;
        const equity = monthlySavings * 0.5; // 50%
        const debt = monthlySavings * 0.3;   // 30%
        const liquid = monthlySavings * 0.2; // 20%
        
        const investmentData = [
            { name: 'Equity (High Growth)', value: equity, color: '#10b981', desc: 'Stocks, Equity Mutual Funds' },
            { name: 'Debt (Stability)', value: debt, color: '#f59e0b', desc: 'PPF, FD, Debt Funds' },
            { name: 'Liquid/Gold (Safety)', value: liquid, color: '#3b82f6', desc: 'Emergency Fund, Gold Bonds' },
        ];

        return (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <h2 className="text-3xl font-extrabold flex items-center gap-3 mb-6 text-slate-800"><div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 shadow-sm"><Wallet size={32} /></div> My Monetary Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Monthly Profile</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50"><span className="text-slate-500 font-medium">Monthly Income</span><span className="text-2xl font-bold text-emerald-600">${user.financialData?.monthlyIncome.toLocaleString() || 0}</span></div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50"><span className="text-slate-500 font-medium">Monthly Expenses</span><span className="text-2xl font-bold text-rose-500">${user.financialData?.monthlyExpenses.toLocaleString() || 0}</span></div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50"><span className="text-slate-500 font-medium">Monthly Savings</span><span className="text-2xl font-bold text-blue-600">${user.financialData?.monthlySavings.toLocaleString() || 0}</span></div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 relative overflow-hidden text-white">
                     <div className="absolute top-0 right-0 p-24 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                     <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-bold flex items-center gap-2"><TrendingDown className="text-red-400" /> Inflation Reality</h3><div className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/20">Live CPI: {INFLATION_RATE}%</div></div>
                     <div className="space-y-4 relative z-10">
                         <div className="bg-white/5 p-4 rounded-xl border border-white/10"><p className="text-slate-400 text-xs font-bold uppercase mb-1">Purchasing Power Erosion</p><p className="text-sm text-slate-300 leading-relaxed">Your savings in a standard bank account (3.5%) lose <span className="text-red-400 font-bold">{(INFLATION_RATE - 3.5).toFixed(1)}%</span> value every year due to inflation.</p></div>
                     </div>
                </div>
            </div>

            {/* Smart Investment Allocation */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-cyan-50">
                    <div>
                         <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Sparkles className="text-emerald-500" /> Smart Investment Allocation</h3>
                         <p className="text-slate-500 text-sm font-medium mt-1">Suggested breakdown of your <span className="font-bold text-slate-800">₹{monthlySavings.toLocaleString()}</span> monthly savings.</p>
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
                                     formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                         {investmentData.map((item, idx) => (
                             <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                                 <div className="flex items-center gap-4">
                                     <div className={`p-3 rounded-lg ${idx === 0 ? 'bg-emerald-100 text-emerald-600' : idx === 1 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                         {idx === 0 ? <TrendingUp size={20} /> : idx === 1 ? <Shield size={20} /> : <Coins size={20} />}
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                                         <p className="text-xs text-slate-500">{item.desc}</p>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <p className="font-extrabold text-slate-800">₹{item.value.toLocaleString()}</p>
                                     <p className="text-xs font-bold text-slate-400">{Math.round((item.value/monthlySavings)*100)}%</p>
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                 <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Goal className="text-purple-600" /> Interactive Goal Planner</h3>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="col-span-1 space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                         {user.goals && user.goals.map(goalId => {
                                const goalDef = SAVING_GOALS.find(g => g.id === goalId);
                                if (!goalDef) return null;
                                const isSelected = selectedGoalId === goalId;
                                return (
                                    <button key={goalId} onClick={() => setSelectedGoalId(goalId)} className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${isSelected ? 'bg-purple-50 border-2 border-purple-500 shadow-md' : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'}`}>
                                        <span className="text-2xl">{goalDef.icon}</span><span className={`font-bold ${isSelected ? 'text-purple-700' : 'text-slate-700'}`}>{goalDef.label}</span>
                                    </button>
                                );
                            })}
                    </div>
                    <div className="col-span-1 lg:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                        {selectedGoalId ? (
                            <div className="animate-fade-in space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Cost</label><input type="number" value={goalInput.cost} onChange={(e) => setGoalInput({...goalInput, cost: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-800" placeholder="e.g. 50000" /></div>
                                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Years to Achieve</label><input type="number" value={goalInput.years} onChange={(e) => setGoalInput({...goalInput, years: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-800" placeholder="e.g. 5" /></div>
                                </div>
                                {goalCalculated && (
                                    <div className="space-y-4 pt-4 border-t border-slate-200">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm"><p className="text-slate-400 text-xs font-bold uppercase mb-1">Future Cost</p><p className="text-2xl font-extrabold text-slate-800">${Math.round(goalCalculated.futureCost).toLocaleString()}</p></div>
                                            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm"><p className="text-slate-400 text-xs font-bold uppercase mb-1">SIP Required</p><p className="text-2xl font-extrabold text-emerald-600">${Math.round(goalCalculated.sipRequired).toLocaleString()}</p></div>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100"><h4 className="font-bold text-purple-800 text-sm mb-1">Strategy: {goalCalculated.strategy}</h4><p className="text-slate-600 text-xs">{goalCalculated.recommendation}</p></div>
                                    </div>
                                )}
                            </div>
                        ) : (<div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60"><Calculator size={48} /><p className="font-medium mt-2">Select a goal</p></div>)}
                    </div>
                 </div>
            </div>
          </div>
        );
      case 'INSURANCE':
        return (
          <div className="animate-fade-in space-y-8 max-w-5xl mx-auto">
             <h2 className="text-3xl font-extrabold flex items-center gap-3 mb-6 text-slate-800"><div className="p-3 bg-rose-100 rounded-2xl text-rose-600 shadow-sm"><Shield size={32} /></div> Insurance Portfolio</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-3xl flex flex-col items-center text-center gap-6 border border-slate-100 hover:shadow-xl transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-red-600" />
                    <div className="p-6 bg-rose-50 rounded-full text-rose-600 shadow-sm"><Activity size={40} /></div>
                    <div><h3 className="text-2xl font-bold text-slate-800 mb-2">Health Insurance</h3><p className="text-slate-500 font-medium">Medical coverage for you and family.</p></div>
                    <button className="px-8 py-3 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-600 hover:text-white transition-all">Check Plans</button>
                 </div>
                 <div className="bg-white p-8 rounded-3xl flex flex-col items-center text-center gap-6 border border-slate-100 hover:shadow-xl transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                    <div className="p-6 bg-blue-50 rounded-full text-blue-600 shadow-sm"><Shield size={40} /></div>
                    <div><h3 className="text-2xl font-bold text-slate-800 mb-2">Life Insurance</h3><p className="text-slate-500 font-medium">Secure your family's future.</p></div>
                    <button className="px-8 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all">Check Plans</button>
                 </div>
             </div>
          </div>
        );
      case 'MUTUAL_FUNDS':
        return (
            <div className="animate-fade-in max-w-4xl mx-auto text-center py-20">
                <PieChartIcon size={64} className="mx-auto text-violet-300 mb-4" />
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Mutual Funds</h2>
                <p className="text-slate-500">Curated funds based on your risk profile coming soon.</p>
            </div>
        );
      case 'LOANS':
        return <LoansSection />;
      case 'ADVISOR':
        return <AdvisorSection user={user} />;
      case 'MSME':
        return (
             <div className="animate-fade-in max-w-4xl mx-auto text-center py-20">
                <Factory size={64} className="mx-auto text-orange-300 mb-4" />
                <h2 className="text-3xl font-bold text-slate-800 mb-2">MSME Support</h2>
                <p className="text-slate-500">Business loans and government scheme information.</p>
            </div>
        );
      case 'STUDENT':
        return <StudentCorner />;
      case 'PPF':
        return <PPFSection />;
      case 'BUDGET':
        return <BudgetSection transactions={MOCK_TRANSACTIONS} />;
      case 'SETTINGS':
        return <SettingsSection user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} onUpdateUser={onUserUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <aside className="w-20 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col z-20 shadow-sm transition-colors duration-300">
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-xl text-white shadow-lg shadow-emerald-500/20"><Brain size={24} /></div>
            <span className="font-extrabold text-xl text-slate-800 dark:text-white hidden lg:block tracking-tight">Wealth Waves</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-hide">
            {menuItems.map((item) => (
                <button key={item.id} onClick={() => setActiveSection(item.id as DashboardSection)} className={`w-full p-3 rounded-xl flex items-center gap-4 transition-all ${activeSection === item.id ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                    <span className={`${activeSection === item.id ? 'text-white' : item.color}`}>{item.icon}</span>
                    <span className="font-bold hidden lg:block">{item.label}</span>
                </button>
            ))}
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button onClick={onLogout} className="w-full p-3 rounded-xl flex items-center gap-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors">
                <LogOut size={20} />
                <span className="font-bold hidden lg:block">Logout</span>
            </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 sticky top-0 transition-colors duration-300">
            <div className="flex items-center gap-4 md:hidden">
                 <div className="p-2 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-lg text-white"><Brain size={20} /></div>
                 <span className="font-extrabold text-lg text-slate-800 dark:text-white">Wealth Waves</span>
            </div>
            <div className="hidden md:block">
                <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">
                    {activeSection === 'HOME' ? `Welcome back, ${user.name.split(' ')[0]}` : menuItems.find(m => m.id === activeSection)?.label}
                </h1>
                {activeSection === 'HOME' && <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Here is your financial overview for today.</p>}
            </div>
            <div className="flex items-center gap-4">
                <button onClick={() => setShowAi(!showAi)} className="relative group overflow-hidden bg-slate-900 dark:bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all flex items-center gap-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center gap-2"><Sparkles size={16} /> AI Advisor</span>
                </button>
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold border-2 border-white dark:border-slate-600 shadow-sm">{user.name.charAt(0)}</div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
             {activeSection !== 'HOME' && (
                 <button onClick={() => setActiveSection('HOME')} className="mb-6 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold transition-colors w-fit">
                     <ArrowLeft size={20} /> Back to Dashboard
                 </button>
             )}
             {renderContent()}
        </div>
        
        {showAi && (
            <div className="absolute right-6 bottom-6 w-96 h-[600px] z-50 animate-fade-in-up">
                <AiAdvisor user={user} transactions={MOCK_TRANSACTIONS} onClose={() => setShowAi(false)} />
            </div>
        )}
      </main>
    </div>
  );
};