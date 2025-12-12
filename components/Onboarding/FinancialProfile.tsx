import React, { useState } from 'react';
import { Input } from '../UI/Input';
import { FinancialData } from '../../types';
import { Wallet, ArrowRight } from 'lucide-react';

interface FinancialProfileProps {
  onComplete: (data: FinancialData) => void;
}

export const FinancialProfile: React.FC<FinancialProfileProps> = ({ onComplete }) => {
  const [data, setData] = useState({
    income: '',
    expense: '',
    savings: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const income = parseFloat(data.income);
    const expense = parseFloat(data.expense);
    const savings = parseFloat(data.savings);

    if (isNaN(income) || isNaN(expense) || isNaN(savings)) {
      setError("Please enter valid numbers for all fields.");
      return;
    }

    onComplete({
      monthlyIncome: income,
      monthlyExpenses: expense,
      monthlySavings: savings,
    });
  };

  return (
    <div className="w-full max-w-md p-8 glass-panel rounded-3xl shadow-xl animate-fade-in-up bg-white/90 border border-white/50">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shadow-sm">
            <Wallet size={28} />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Financial Profile</h2>
            <p className="text-slate-500 text-sm font-medium">Step 2 of 3</p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Monthly Income"
          type="number"
          placeholder="0.00"
          value={data.income}
          onChange={(e) => setData({ ...data, income: e.target.value })}
        />
        <Input
          label="Monthly Expenses"
          type="number"
          placeholder="0.00"
          value={data.expense}
          onChange={(e) => setData({ ...data, expense: e.target.value })}
        />
        <Input
          label="Current Monthly Savings"
          type="number"
          placeholder="0.00"
          value={data.savings}
          onChange={(e) => setData({ ...data, savings: e.target.value })}
        />

        {error && <p className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded-lg text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-transform transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          Next Step
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};