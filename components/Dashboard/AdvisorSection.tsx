import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../../types';
import { getAdvisorChatResponse } from '../../services/geminiService';
import { 
  Users, 
  MessageCircle, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft, 
  Send, 
  Loader2, 
  CheckCheck,
  Award,
  Star
} from 'lucide-react';

interface Advisor {
  id: string;
  name: string;
  role: string;
  expertise: string;
  image: string;
  online: boolean;
  rating: number;
  experience: string;
}

const ADVISORS: Advisor[] = [
  { 
    id: '1', 
    name: 'Dr. Rajesh Kumar', 
    role: 'Certified Financial Planner', 
    expertise: 'Retirement & Pension', 
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400', 
    online: true,
    rating: 4.9,
    experience: '15+ Years'
  },
  { 
    id: '2', 
    name: 'Ms. Priya Sharma', 
    role: 'Investment Banker', 
    expertise: 'Stocks & Mutual Funds', 
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', 
    online: true,
    rating: 4.8,
    experience: '10+ Years'
  },
  { 
    id: '3', 
    name: 'CA Amit Patel', 
    role: 'Chartered Accountant', 
    expertise: 'Taxation & Auditing', 
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', 
    online: false,
    rating: 4.7,
    experience: '12 Years'
  },
  { 
    id: '4', 
    name: 'Mrs. Sneha Reddy', 
    role: 'Wealth Manager', 
    expertise: 'Real Estate & Gold', 
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', 
    online: true,
    rating: 4.9,
    experience: '18 Years'
  },
  { 
    id: '5', 
    name: 'Mr. Vikram Singh', 
    role: 'Loan Consultant', 
    expertise: 'Debt & Loans', 
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400', 
    online: true,
    rating: 4.6,
    experience: '8 Years'
  },
];

interface AdvisorSectionProps {
  user: User;
}

export const AdvisorSection: React.FC<AdvisorSectionProps> = ({ user }) => {
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSelectAdvisor = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setMessages([
      { role: 'model', text: `Namaste ${user.name}! I am ${advisor.name}. I specialize in ${advisor.expertise}. How can I assist you with your finances today?` }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedAdvisor) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getAdvisorChatResponse(
      selectedAdvisor.name,
      selectedAdvisor.role,
      selectedAdvisor.expertise,
      userMsg.text,
      messages
    );

    const advisorMsg: ChatMessage = { role: 'model', text: response };
    setMessages(prev => [...prev, advisorMsg]);
    setIsTyping(false);
  };

  if (selectedAdvisor) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in relative">
        {/* Chat Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedAdvisor(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
              <ArrowLeft size={20} />
            </button>
            <div className="relative">
              <img src={selectedAdvisor.image} alt={selectedAdvisor.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              {selectedAdvisor.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{selectedAdvisor.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                {selectedAdvisor.role} • <span className="text-green-600 font-medium">Online</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <button className="p-2 hover:bg-slate-100 rounded-full"><Phone size={18} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full"><Video size={18} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] space-y-4 relative">
             {/* Chat background pattern overlay */}
             <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
             
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
                 <div className={`max-w-[75%] p-3 rounded-xl text-sm shadow-sm relative ${
                   msg.role === 'user' 
                     ? 'bg-[#d9fdd3] text-slate-800 rounded-tr-none' 
                     : 'bg-white text-slate-800 rounded-tl-none'
                 }`}>
                   {msg.text}
                   <div className="flex justify-end mt-1">
                     <span className="text-[10px] text-slate-400 flex items-center gap-1">
                       {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       {msg.role === 'user' && <CheckCheck size={12} className="text-blue-500" />}
                     </span>
                   </div>
                 </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex justify-start relative z-10">
                 <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm flex items-center gap-2">
                   <div className="flex gap-1">
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[#f0f2f5] border-t border-slate-200 flex items-center gap-2 z-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white border border-transparent focus:border-slate-300 rounded-full px-5 py-3 text-sm focus:outline-none shadow-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors shadow-sm disabled:opacity-50 disabled:scale-95 transform active:scale-90"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-8 pb-10">
       <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 flex items-center justify-center gap-3">
                <Users className="text-emerald-600" size={32} /> Talk to Advisor
            </h2>
            <p className="text-slate-500">Connect with certified experts to clarify your financial doubts instantly.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADVISORS.map((advisor) => (
             <div key={advisor.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-bl-[100px] -z-0" />
                
                <div className="flex items-start gap-4 mb-4 z-10">
                    <div className="relative">
                        <img src={advisor.image} alt={advisor.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${advisor.online ? 'bg-green-500' : 'bg-slate-400'}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 leading-tight">{advisor.name}</h3>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mt-1">{advisor.role}</p>
                        <div className="flex items-center gap-1 mt-1 text-slate-400">
                             <Star size={12} className="fill-yellow-400 text-yellow-400" />
                             <span className="text-xs font-bold text-slate-700">{advisor.rating}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-6 z-10">
                    <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-2">
                        <Award size={16} className="text-emerald-500" />
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Expertise</p>
                            <p className="text-sm font-semibold text-slate-700">{advisor.expertise}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCheck size={14} className="text-emerald-500" /> {advisor.experience} Experience
                    </div>
                </div>

                <button 
                    onClick={() => handleSelectAdvisor(advisor)}
                    className="mt-auto w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-emerald-600 transition-colors"
                >
                    <MessageCircle size={18} /> Chat Now
                </button>
             </div>
          ))}
       </div>
    </div>
  );
};