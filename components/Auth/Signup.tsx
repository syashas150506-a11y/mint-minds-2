import React, { useState, useEffect } from 'react';
import { COUNTRIES, PROFESSIONS } from '../../constants';
import { User, CountryData } from '../../types';
import { Input } from '../UI/Input';
import { CountrySelector } from '../UI/CountrySelector';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { userService } from '../../services/userService';

interface SignupProps {
  onSignup: (user: User) => void;
  onBack: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSignup, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    profession: PROFESSIONS[0],
    gender: 'Male' as 'Male' | 'Female' | 'Other',
  });

  // DOB State
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(
    COUNTRIES.find(c => c.code === "US") || COUNTRIES[0]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [age, setAge] = useState<number | null>(null);

  // Generate arrays for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      const monthIndex = months.indexOf(dobMonth);
      const birthDate = new Date(parseInt(dobYear), monthIndex, parseInt(dobDay));
      const today = new Date();
      
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [dobDay, dobMonth, dobYear]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email address";

    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 chars";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    const cleanNumber = formData.mobile.replace(/\D/g, '');
    if (!cleanNumber) {
      newErrors.mobile = "Mobile number is required";
    } else {
      const isValidLength = selectedCountry.digits.includes(cleanNumber.length);
      if (!isValidLength) {
        const allowed = selectedCountry.digits.join(' or ');
        newErrors.mobile = `${selectedCountry.name} numbers must have exactly ${allowed} digits.`;
      }
    }

    if (!dobDay || !dobMonth || !dobYear) newErrors.dob = "Complete Date of Birth is required";
    if (age !== null && age < 18) newErrors.dob = "You must be at least 18 years old.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && age !== null) {
      setIsLoading(true);
      const monthIndex = months.indexOf(dobMonth) + 1;
      const formattedDob = `${dobYear}-${monthIndex.toString().padStart(2, '0')}-${dobDay.padStart(2, '0')}`;

      const user: User = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        countryCode: selectedCountry.dial_code,
        dob: formattedDob,
        age: age,
        gender: formData.gender,
        profession: formData.profession,
        password: formData.password
      };

      try {
        const newUser = await userService.register(user);
        onSignup(newUser);
      } catch (err: any) {
        console.error("Signup error", err);
        setErrors({ ...errors, general: err.message || "Failed to create account." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-xl p-8 glass-panel rounded-3xl shadow-xl animate-fade-in-up my-8 bg-white/90 border border-white/50">
      <div className="flex items-center mb-6">
        <button onClick={onBack} disabled={isLoading} className="text-slate-500 hover:text-slate-800 transition-colors mr-3 p-2 hover:bg-slate-100 rounded-full disabled:opacity-50">
            <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          Create Account
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            disabled={isLoading}
          />
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['Male', 'Female', 'Other'].map((g) => (
                <button
                  key={g}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setFormData({...formData, gender: g as any})}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    formData.gender === g 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              placeholder="••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              disabled={isLoading}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              disabled={isLoading}
            />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number</label>
          <div className="flex gap-2">
            <CountrySelector 
                selected={selectedCountry} 
                onSelect={setSelectedCountry} 
            />
            <div className="w-2/3">
                <input
                    type="tel"
                    disabled={isLoading}
                    className={`w-full bg-white border ${errors.mobile ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3 placeholder-slate-400 shadow-sm`}
                    placeholder={`e.g. ${'1'.repeat(selectedCountry.digits[0])}`}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
            </div>
          </div>
          {errors.mobile && <p className="mt-1 text-xs text-red-500 font-medium">{errors.mobile}</p>}
        </div>

        {/* Enhanced DOB Section */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-emerald-600" />
                <label className="text-sm font-bold text-slate-700">Date of Birth</label>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <select 
                    value={dobDay} 
                    onChange={(e) => setDobDay(e.target.value)}
                    disabled={isLoading}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 block p-2.5 shadow-sm"
                >
                    <option value="">Day</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select 
                    value={dobMonth} 
                    onChange={(e) => setDobMonth(e.target.value)}
                    disabled={isLoading}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 block p-2.5 shadow-sm"
                >
                    <option value="">Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select 
                    value={dobYear} 
                    onChange={(e) => setDobYear(e.target.value)}
                    disabled={isLoading}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 block p-2.5 shadow-sm"
                >
                    <option value="">Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
            {errors.dob && <p className="mt-2 text-xs text-red-500 font-bold">{errors.dob}</p>}
            {age !== null && (
                <div className="mt-2 flex items-center justify-end">
                    <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                        Age: {age} Years
                    </span>
                </div>
            )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Profession</label>
          <div className="relative">
            <select
                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3 appearance-none shadow-sm"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                disabled={isLoading}
            >
                {PROFESSIONS.map(p => (
                <option key={p} value={p}>{p}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>

        {errors.general && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">
                {errors.general}
                {errors.general.includes('exists') && (
                    <button onClick={onBack} className="block w-full mt-1 text-red-700 underline font-bold">
                        Back to Login
                    </button>
                )}
            </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-emerald-200 font-bold rounded-xl text-sm px-5 py-3.5 text-center transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-emerald-500/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
        </button>
      </form>
    </div>
  );
};