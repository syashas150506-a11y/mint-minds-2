import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { User } from '../../types';
import { LogOut, Search, Users, Download, Eye, TrendingUp, ShieldCheck, Database, Calendar, PiggyBank } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (e) {
      console.error("Failed to load users", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    !u.isAdmin && (
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const stats = {
      totalUsers: users.filter(u => !u.isAdmin).length,
      usersWithBank: users.filter(u => u.bankDetails && !u.isAdmin).length,
      usersWithGoals: users.filter(u => u.goals && u.goals.length > 0 && !u.isAdmin).length
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
                <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight">Wealth Waves <span className="text-indigo-400">Admin</span></h1>
                <p className="text-xs text-slate-400 font-medium">Web Owner Panel</p>
            </div>
        </div>
        <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors text-sm font-bold"
        >
            <LogOut size={16} /> Logout
        </button>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><Users size={24} /></div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
                  </div>
                  <p className="text-4xl font-extrabold text-white">{stats.totalUsers}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><Database size={24} /></div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bank Accounts Linked</span>
                  </div>
                  <p className="text-4xl font-extrabold text-white">{stats.usersWithBank}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400"><TrendingUp size={24} /></div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Goals</span>
                  </div>
                  <p className="text-4xl font-extrabold text-white">{stats.usersWithGoals}</p>
              </div>
          </div>

          {/* User Table */}
          <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                      <Users className="text-slate-400" size={20} /> Registered Users
                  </h2>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 w-64"
                      />
                  </div>
              </div>

              {loading ? (
                  <div className="p-12 text-center text-slate-400">Loading database...</div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4 border-b border-slate-700">User Details</th>
                                <th className="p-4 border-b border-slate-700">Profession</th>
                                <th className="p-4 border-b border-slate-700">Bank Status</th>
                                <th className="p-4 border-b border-slate-700">Financial Data</th>
                                <th className="p-4 border-b border-slate-700">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No users found in database.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, idx) => (
                                    <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{user.name}</div>
                                            <div className="text-xs text-slate-400">{user.email}</div>
                                            <div className="text-xs text-slate-500">{user.countryCode} {user.mobile}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs border border-slate-600">
                                                {user.profession}
                                            </span>
                                            <div className="text-xs text-slate-500 mt-1">{user.age} Years • {user.gender}</div>
                                        </td>
                                        <td className="p-4">
                                            {user.bankDetails ? (
                                                <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                    Linked: {user.bankDetails.bankName}
                                                </div>
                                            ) : (
                                                <div className="text-slate-500 text-xs font-bold flex items-center gap-1">
                                                     <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                                                     Pending
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {user.financialData ? (
                                                <div className="text-xs space-y-1">
                                                    <div className="text-slate-300">Inc: ₹{user.financialData.monthlyIncome.toLocaleString()}</div>
                                                    <div className="text-slate-500">Sav: ₹{user.financialData.monthlySavings.toLocaleString()}</div>
                                                    {/* Added Jar Balance Display */}
                                                    <div className="text-amber-400 font-bold flex items-center gap-1">
                                                        <PiggyBank size={12} />
                                                        Jar: ₹{(user.savingsJarBalance || 0).toLocaleString()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-600 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                  </div>
              )}
          </div>
      </main>
    </div>
  );
};