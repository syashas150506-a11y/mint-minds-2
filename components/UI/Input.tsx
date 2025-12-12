import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        className={`w-full bg-white border ${error ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3 placeholder-slate-400 transition-all shadow-sm ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};