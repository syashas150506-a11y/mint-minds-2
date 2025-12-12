import React, { useState } from 'react';
import { Input } from '../UI/Input';
import { BankDetails } from '../../types';
import { Landmark, Smartphone, ArrowRight } from 'lucide-react';

interface BankLinkingProps {
  onComplete: (details: BankDetails) => void;
}

export const BankLinking: React.FC<BankLinkingProps> = ({ onComplete }) => {
  const [details, setDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifsc: '',
  });
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [inputOtp, setInputOtp] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = () => {
    if (!details.bankName || !details.accountNumber || !details.ifsc) {
      setError("Please fill in all bank details.");
      return;
    }
    // Simulate OTP generation
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setStep('otp');
    setError('');
  };

  const handleVerify = () => {
    if (inputOtp === generatedOtp) {
      onComplete(details);
    } else {
      setError("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 glass-panel rounded-3xl shadow-xl animate-fade-in-up bg-white/90 border border-white/50">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-teal-100 rounded-2xl text-teal-600 shadow-sm">
            <Landmark size={28} />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Link Bank Account</h2>
            <p className="text-slate-500 text-sm font-medium">Step 1 of 3</p>
        </div>
      </div>

      {step === 'form' ? (
        <div className="space-y-4">
          <Input
            label="Bank Name"
            placeholder="e.g. Chase, Bank of America"
            value={details.bankName}
            onChange={(e) => setDetails({ ...details, bankName: e.target.value })}
          />
          <Input
            label="Account Number"
            placeholder="1234567890"
            value={details.accountNumber}
            onChange={(e) => setDetails({ ...details, accountNumber: e.target.value })}
          />
          <Input
            label="IFSC / Routing Number"
            placeholder="ABCD0123456"
            value={details.ifsc}
            onChange={(e) => setDetails({ ...details, ifsc: e.target.value })}
          />
          {error && <p className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded-lg text-center">{error}</p>}
          <button
            onClick={handleSendOtp}
            className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
          >
            <Smartphone size={18} />
            Verify with OTP
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center shadow-inner">
            <p className="text-slate-500 text-sm mb-2 font-medium">For testing purposes, your OTP is:</p>
            <p className="text-4xl font-mono font-bold text-teal-600 tracking-[0.2em]">{generatedOtp}</p>
          </div>

          <Input
            label="Enter OTP"
            placeholder="XXXX"
            value={inputOtp}
            onChange={(e) => setInputOtp(e.target.value)}
            className="text-center tracking-widest text-lg font-bold"
          />

          {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}

          <button
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-3.5 rounded-xl font-bold transition-transform transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
          >
            Verify & Continue
            <ArrowRight size={18} />
          </button>
          
          <button 
             onClick={() => setStep('form')}
             className="w-full text-slate-500 text-sm hover:text-slate-800 font-medium"
          >
             Go Back
          </button>
        </div>
      )}
    </div>
  );
};