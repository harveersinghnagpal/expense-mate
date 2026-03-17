import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm ExpenseMate. Ask me anything about your expenses or budget!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/chat', { message: input });
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat Error Details:', error);
      const errorMsg = error.response?.data?.error || error.message || "Unknown error";
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMsg}. Please ensure your Server is running and API keys are valid.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-[#9B5CFF] to-[#3CF2FF] rounded-[18px] flex items-center justify-center shadow-[0_0_20px_rgba(155,92,255,0.4)] hover:shadow-[0_0_30px_rgba(60,242,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 relative group"
        >
          <div className="absolute inset-0 bg-white/20 rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Bot className="text-white w-7 h-7" />
          
          {/* Notification Dot */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5A0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00F5A0] border-2 border-[#16161F]"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] h-[580px] card flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-10 origin-bottom-right group rounded-2xl">
          {/* Header */}
          <div className="p-4 bg-[rgba(31,31,43,0.7)] backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9B5CFF] to-[#3CF2FF] flex items-center justify-center shadow-[0_0_15px_rgba(60,242,255,0.3)] p-[1px]">
                  <div className="w-full h-full bg-[#16161F] rounded-full flex items-center justify-center">
                    <Bot className="text-[#3CF2FF] w-5 h-5" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00F5A0] rounded-full border border-[#16161F]"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm tracking-wide">ExpenseMate AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-pulse"></div>
                  <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider font-medium">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex items-end gap-2.5", msg.role === 'user' ? "flex-row-reverse" : "")}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9B5CFF] to-[#3CF2FF] flex items-center justify-center shrink-0 shadow-lg">
                    <Bot size={12} className="text-white" />
                  </div>
                )}
                
                <div className={cn(
                  "px-4 py-2.5 text-[13.5px] leading-relaxed max-w-[80%] shadow-lg transition-all",
                  msg.role === 'user' 
                    ? "bg-gradient-to-r from-[#9B5CFF] to-[#3CF2FF] text-white rounded-[20px] rounded-br-[4px]" 
                    : "bg-[rgba(255,255,255,0.03)] border border-white/10 text-white rounded-[20px] rounded-bl-[4px] backdrop-blur-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9B5CFF] to-[#3CF2FF] flex items-center justify-center shrink-0 shadow-lg">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 px-4 py-3.5 rounded-[20px] rounded-bl-[4px] backdrop-blur-sm flex items-center gap-1.5 w-16">
                  <span className="w-2 h-2 rounded-full bg-[#3CF2FF] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[#9B5CFF] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-[rgba(31,31,43,0.7)] backdrop-blur-md border-t border-white/5">
            <div className="relative flex items-center group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message ExpenseMate AI..."
                className="w-full bg-[rgba(0,0,0,0.2)] border border-white/10 focus:border-[#3CF2FF]/50 outline-none rounded-2xl py-3 pl-4 pr-12 text-white text-sm transition-all focus:shadow-[0_0_15px_rgba(60,242,255,0.1)] placeholder-white/30"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 bg-gradient-to-r from-[#9B5CFF] to-[#3CF2FF] text-white rounded-xl transition-all hover:shadow-[0_0_15px_rgba(155,92,255,0.5)] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:hover:shadow-none"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </div>
            <div className="mt-2 text-center">
              <span className="text-[10px] text-white/30 font-medium">ExpenseMate AI can make mistakes. Consider verifying important info.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
