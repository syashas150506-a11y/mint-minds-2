
import React, { useState } from 'react';
import { Input } from '../UI/Input';
import { BankDetails } from '../../types';
import { Landmark, Smartphone, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

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
  const [isVerifying, setIsVerifying] = useState(false);

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
      setIsVerifying(true);
      // Short artificial delay for realistic feel
      setTimeout(() => {
        setIsVerifying(false);
        onComplete(details);
      }, 1000);
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
            placeholder="e.g. HDFC, SBI, ICICI"
            value={details.bankName}
            onChange={(e) => { setDetails({ ...details, bankName: e.target.value }); setError(''); }}
          />
          <Input
            label="Account Number"
            placeholder="1234567890"
            value={details.accountNumber}
            onChange={(e) => { setDetails({ ...details, accountNumber: e.target.value }); setError(''); }}
          />
          <Input
            label="IFSC / Routing Number"
            placeholder="ABCD0123456"
            value={details.ifsc}
            onChange={(e) => { setDetails({ ...details, ifsc: e.target.value }); setError(''); }}
          />
          {error && <p className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded-lg text-center border border-red-100">{error}</p>}
          <button
            onClick={handleSendOtp}
            className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95"
          >
            <Smartphone size={20} />
            Continue to Verify
          </button>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase mt-4">
              <ShieldCheck size={12} /> SECURE 256-BIT ENCRYPTION
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center shadow-inner">
            <p className="text-slate-400 text-[10px] font-black uppercase mb-2 tracking-widest">Bank Verification Code</p>
            <p className="text-4xl font-mono font-bold text-teal-600 tracking-[0.3em]">{generatedOtp}</p>
          </div>

          <div className="text-center">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Enter OTP sent to linked mobile</label>
            <input
              type="text"
              maxLength={4}
              placeholder="0 0 0 0"
              value={inputOtp}
              onChange={(e) => { setInputOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
              className="w-full text-center tracking-[0.5em] text-3xl font-black p-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center font-bold">{error}</p>}

          <button
            onClick={handleVerify}
            disabled={isVerifying || inputOtp.length < 4}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-4 rounded-2xl font-bold transition-transform transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20 disabled:opacity-50"
          >
            {isVerifying ? <Loader2 className="animate-spin" /> : (
                <>Link Account Securely <ArrowRight size={20} /></>
            )}
          </button>
          
          <button 
             onClick={() => setStep('form')}
             disabled={isVerifying}
             className="w-full text-slate-400 text-sm hover:text-slate-600 font-bold transition-colors"
          >
             Edit Details
          </button>
        </div>
      )}
    </div>
  );
};
