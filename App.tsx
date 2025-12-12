import React, { useState, useEffect } from 'react';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { BankLinking } from './components/Onboarding/BankLinking';
import { FinancialProfile } from './components/Onboarding/FinancialProfile';
import { GoalSetting } from './components/Onboarding/GoalSetting';
import { User, ViewState, BankDetails, FinancialData } from './types';
import { userService } from './services/userService';

function App() {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Handle Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Helper to persist user data incrementally via service
  const updateUserAndPersist = async (updatedFields: Partial<User>) => {
    if (!currentUser) return;

    // Optimistic UI Update
    const updatedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(updatedUser);

    try {
        if (currentUser.email) {
            await userService.updateUser(currentUser.email, updatedFields);
        }
    } catch (e) {
      console.error("Failed to persist update", e);
      // Ideally revert state here on failure
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    
    if (user.isAdmin) {
        setView(ViewState.ADMIN_DASHBOARD);
        return;
    }

    // Determine next step based on profile completeness
    if (!user.bankDetails) {
      setView(ViewState.LINK_BANK);
    } else if (!user.financialData) {
      setView(ViewState.FINANCIAL_PROFILE);
    } else if (!user.goals) {
      setView(ViewState.SET_GOALS);
    } else {
      setView(ViewState.DASHBOARD);
    }
  };

  const handleSignup = (user: User) => {
    setCurrentUser(user);
    setView(ViewState.LINK_BANK);
  };

  const handleBankLinked = (details: BankDetails) => {
    updateUserAndPersist({ bankDetails: details });
    setView(ViewState.FINANCIAL_PROFILE);
  };

  const handleFinancialData = (data: FinancialData) => {
    updateUserAndPersist({ financialData: data });
    setView(ViewState.SET_GOALS);
  };

  const handleGoalsSet = (goals: string[]) => {
    updateUserAndPersist({ goals });
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView(ViewState.LOGIN);
  };

  const isDashboard = view === ViewState.DASHBOARD && currentUser;
  const isAdmin = view === ViewState.ADMIN_DASHBOARD;

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-300">
        
        {/* Fixed Background - Ambient effects stay put while content scrolls. Only show on Auth/Onboarding to keep Dashboard clean. */}
        {!isDashboard && !isAdmin && (
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70" />
                <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-teal-200/30 rounded-full blur-[80px] mix-blend-multiply opacity-70" />
            </div>
        )}

        {/* Main Content Scrollable Area */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {isDashboard ? (
             <Dashboard 
                user={currentUser} 
                onLogout={handleLogout} 
                onUserUpdate={updateUserAndPersist}
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
             />
          ) : isAdmin ? (
             <AdminDashboard onLogout={handleLogout} />
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 py-12">
                {/* Auth & Onboarding Container - Centered but Scrollable */}
                
                {view === ViewState.LOGIN && (
                    <Login onLogin={handleLogin} onGoToSignup={() => setView(ViewState.SIGNUP)} />
                )}

                {view === ViewState.SIGNUP && (
                    <Signup onSignup={handleSignup} onBack={() => setView(ViewState.LOGIN)} />
                )}

                {view === ViewState.LINK_BANK && (
                    <BankLinking onComplete={handleBankLinked} />
                )}

                {view === ViewState.FINANCIAL_PROFILE && (
                    <FinancialProfile onComplete={handleFinancialData} />
                )}

                {view === ViewState.SET_GOALS && (
                    <GoalSetting onComplete={handleGoalsSet} />
                )}
            </div>
          )}
        </div>
    </div>
  );
}

export default App;