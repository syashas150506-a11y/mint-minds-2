import React, { useState, useEffect, useRef } from 'react';
import { User, Transaction, ChatMessage } from '../../types';
import { getFinancialAdvice } from '../../services/geminiService';
import { Send, Loader2, Sparkles, X } from 'lucide-react';

interface AiAdvisorProps {
  user: User;
  transactions: Transaction[];
  onClose: () => void;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ user, transactions, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hello ${user.name}! I'm Wealth Waves AI, your intelligent financial assistant. How can I help you today?` }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    const responseText = await getFinancialAdvice(
      transactions,
      user.profession,
      user.age,
      userMsg.text
    );

    const botMsg: ChatMessage = { role: 'model', text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="bg-white w-full h-full flex flex-col shadow-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-500 to-cyan-600 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2">
           <div className="p-1.5 bg-white/20 rounded-lg">
             <Sparkles size={18} className="text-white" />
           </div>
           <div>
             <h3 className="font-bold text-white text-sm">Wealth Waves AI</h3>
             <p className="text-xs text-emerald-100 font-medium">Your Personal Advisor</p>
           </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2 border border-slate-200 shadow-sm">
              <Loader2 className="animate-spin text-emerald-600" size={16} />
              <span className="text-xs text-slate-500 font-medium">Analyzing financial data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about stocks, savings, or goals..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-400 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 flex-shrink-0 shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};