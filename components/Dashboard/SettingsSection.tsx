import React, { useState } from 'react';
import { User } from '../../types';
import { PROFESSIONS } from '../../constants';
import { 
  Moon, Sun, Lock, User as UserIcon, RefreshCw, Save, Check, 
  Globe, DollarSign, Smartphone, Briefcase, Eye, EyeOff 
} from 'lucide-react';

interface SettingsSectionProps {
  user: User;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onUpdateUser: (data: Partial<User>) => void;
}

const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', rate: 1, symbol: '$' },
    { code: 'INR', name: 'Indian Rupee', rate: 83.5, symbol: '₹' },
    { code: 'EUR', name: 'Euro', rate: 0.92, symbol: '€' },
    { code: 'GBP', name: 'British Pound', rate: 0.79, symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', rate: 151.0, symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', rate: 1.52, symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', rate: 1.36, symbol: 'C$' },
    { code: 'AED', name: 'UAE Dirham', rate: 3.67, symbol: 'dh' },
];

export const SettingsSection: React.FC<SettingsSectionProps> = ({ user, darkMode, toggleDarkMode, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'currency'>('profile');
  
  // Profile State
  const [profileData, setProfileData] = useState({
      name: user.name,
      mobile: user.mobile,
      profession: user.profession
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Password State
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [passMessage, setPassMessage] = useState({ text: '', type: '' });

  // Currency State
  const [convert, setConvert] = useState({ amount: '1', from: 'USD', to: 'INR' });

  // --- Handlers ---

  const handleProfileSave = () => {
      onUpdateUser({
          name: profileData.name,
          mobile: profileData.mobile,
          profession: profileData.profession
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
  };

  const handlePasswordChange = () => {
      if (passData.new !== passData.confirm) {
          setPassMessage({ text: "New passwords do not match.", type: 'error' });
          return;
      }
      if (passData.current !== user.password) {
          setPassMessage({ text: "Incorrect current password.", type: 'error' });
          return;
      }
      if (passData.new.length < 6) {
          setPassMessage({ text: "Password must be at least 6 characters.", type: 'error' });
          return;
      }
      
      onUpdateUser({ password: passData.new });
      setPassMessage({ text: "Password updated successfully!", type: 'success' });
      setPassData({ current: '', new: '', confirm: '' });
  };

  const calculateConversion = () => {
      const amount = parseFloat(convert.amount) || 0;
      const fromRate = CURRENCIES.find(c => c.code === convert.from)?.rate || 1;
      const toRate = CURRENCIES.find(c => c.code === convert.to)?.rate || 1;
      const result = (amount / fromRate) * toRate;
      return result.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const getSymbol = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || '';

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-6">Settings</h2>

        {/* Dark Mode Toggle Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-amber-100 text-amber-600'}`}>
                    {darkMode ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">Appearance</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Switch between Light and Dark themes.</p>
                </div>
            </div>
            <button 
                onClick={toggleDarkMode}
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 transform ${darkMode ? 'translate-x-8' : ''}`} />
            </button>
        </div>

        {/* Main Settings Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 p-4">
                <nav className="space-y-2">
                    <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <UserIcon size={20} /> Edit Profile
                    </button>
                    <button onClick={() => setActiveTab('password')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'password' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <Lock size={20} /> Password
                    </button>
                    <button onClick={() => setActiveTab('currency')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'currency' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <Globe size={20} /> Currency Converter
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 dark:text-slate-200">
                {activeTab === 'profile' && (
                    <div className="max-w-md space-y-6 animate-fade-in">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Personal Details</h3>
                            <p className="text-slate-500 text-sm">Update your public profile information.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mobile Number</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="text" value={profileData.mobile} onChange={e => setProfileData({...profileData, mobile: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Profession</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select value={profileData.profession} onChange={e => setProfileData({...profileData, profession: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                                        {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleProfileSave} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30">
                            {profileSaved ? <Check size={20} /> : <Save size={20} />}
                            {profileSaved ? 'Saved!' : 'Save Changes'}
                        </button>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="max-w-md space-y-6 animate-fade-in">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Change Password</h3>
                            <p className="text-slate-500 text-sm">Ensure your account uses a long, random password to stay secure.</p>
                        </div>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                                <input type="password" value={passData.current} onChange={e => setPassData({...passData, current: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                                    <input type={showPass ? "text" : "password"} value={passData.new} onChange={e => setPassData({...passData, new: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm New</label>
                                    <input type={showPass ? "text" : "password"} value={passData.confirm} onChange={e => setPassData({...passData, confirm: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="showPass" checked={showPass} onChange={() => setShowPass(!showPass)} className="accent-rose-500" />
                                <label htmlFor="showPass" className="text-sm text-slate-600 dark:text-slate-400">Show Password</label>
                            </div>
                        </div>
                        {passMessage.text && (
                            <div className={`p-3 rounded-xl text-sm font-bold ${passMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {passMessage.text}
                            </div>
                        )}
                        <button onClick={handlePasswordChange} className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-500/30">
                            <Lock size={20} /> Update Password
                        </button>
                    </div>
                )}

                {activeTab === 'currency' && (
                    <div className="max-w-lg space-y-6 animate-fade-in">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Global Currency Converter</h3>
                            <p className="text-slate-500 text-sm">Check real-time exchange rates for your international needs.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 relative">
                            <div className="grid grid-cols-5 gap-4 items-center">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">{getSymbol(convert.from)}</span>
                                        <input type="number" value={convert.amount} onChange={e => setConvert({...convert, amount: e.target.value})} className="w-full pl-8 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                                    </div>
                                    <select value={convert.from} onChange={e => setConvert({...convert, from: e.target.value})} className="w-full p-2 bg-transparent text-sm font-bold text-slate-600 dark:text-slate-300">
                                        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-1 flex justify-center pt-6">
                                    <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm text-slate-400">
                                        <RefreshCw size={20} />
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Converted</label>
                                    <div className="relative">
                                         <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">{getSymbol(convert.to)}</span>
                                        <div className="w-full pl-8 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold flex items-center h-[50px]">
                                            {calculateConversion()}
                                        </div>
                                    </div>
                                     <select value={convert.to} onChange={e => setConvert({...convert, to: e.target.value})} className="w-full p-2 bg-transparent text-sm font-bold text-slate-600 dark:text-slate-300">
                                        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};