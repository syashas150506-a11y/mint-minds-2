
import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../../types';
import { getGeneralChatResponse } from '../../services/geminiService';
import { Send, Loader2, Sparkles, X, Bot, MessageSquare } from 'lucide-react';

interface GeneralChatBotProps {
  user: User;
  onClose: () => void;
}

export const GeneralChatBot: React.FC<GeneralChatBotProps> = ({ user, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi ${user.name.split(' ')[0]}! 🌊 I'm Wavey, your Wealth Waves assistant. Ask me anything about the app or your money!` }
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

    const responseText = await getGeneralChatResponse(
      user.name,
      user.profession,
      userMsg.text,
      messages
    );

    const botMsg: ChatMessage = { role: 'model', text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full animate-scale-in">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-600 to-cyan-700 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-white/20 rounded-xl">
             <Bot size={20} className="text-white" />
           </div>
           <div>
             <h3 className="font-bold text-white text-sm">Wavey AI</h3>
             <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">Online</span>
             </div>
           </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
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
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2 border border-slate-200 shadow-sm">
              <Loader2 className="animate-spin text-emerald-600" size={16} />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Wavey is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder-slate-400"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !query.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
