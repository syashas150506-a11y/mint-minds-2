import React, { useState } from 'react';
import { SAVING_GOALS } from '../../constants';
import { Target, CheckCircle2 } from 'lucide-react';

interface GoalSettingProps {
  onComplete: (goals: string[]) => void;
}

export const GoalSetting: React.FC<GoalSettingProps> = ({ onComplete }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-3xl p-8 glass-panel rounded-3xl shadow-xl animate-fade-in-up bg-white/90 border border-white/50">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600 shadow-sm">
            <Target size={28} />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Set Your Goals</h2>
            <p className="text-slate-500 text-sm font-medium">Step 3 of 3: What are you saving for?</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {SAVING_GOALS.map((goal) => {
          const isSelected = selectedGoals.includes(goal.id);
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`relative p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                isSelected 
                  ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-md scale-105' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:shadow-sm hover:bg-slate-50'
              }`}
            >
              <span className="text-3xl filter drop-shadow-sm">{goal.icon}</span>
              <span className="text-sm font-semibold text-center leading-tight">{goal.label}</span>
              {isSelected && <CheckCircle2 size={20} className="absolute top-2 right-2 text-purple-600 bg-white rounded-full" />}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onComplete(selectedGoals)}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-[1.01] shadow-xl shadow-purple-500/20"
      >
        Complete Setup
      </button>
    </div>
  );
};