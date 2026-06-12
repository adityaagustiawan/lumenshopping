"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Minimize2, Loader2, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to LabFin Commerce Intelligence! I'm your AI co-pilot for e-commerce optimization. How can I help you analyze your sales, improve conversion rates, or manage inventory today?",
      timestamp: new Date(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "";
      
      if (input.toLowerCase().includes("sales") || input.toLowerCase().includes("revenue")) {
        response = "Based on your current sales data, I recommend focusing on upselling to your Electronics category customers. This segment shows a 32% higher average order value (AOV) compared to other categories. The conversion rate optimization (CRO) for this segment is calculated as: $$CRO = \\frac{Total\\ Conversions}{Total\\ Visitors} = 4.2\\%$$ This is 1.8% above your baseline.";
      } else if (input.toLowerCase().includes("inventory") || input.toLowerCase().includes("stock")) {
        response = "Your inventory turnover ratio is currently at 5.2, which is healthy for your industry. However, stock levels for 'Smart Watches' are running 23% below the reorder point. I recommend placing a restock order immediately to avoid stockouts. The reorder quantity is calculated using the economic order quantity (EOQ) model: $$EOQ = \\sqrt{\\frac{2DS}{H}}$$";
      } else if (input.toLowerCase().includes("customer") || input.toLowerCase().includes("conversion")) {
        response = "Your customer retention rate is 68%, which is excellent. The churn rate is only 3.2% monthly. I suggest implementing a loyalty program to further increase customer lifetime value (CLV). The projected CLV is: $$CLV = \\frac{Average\\ Order\\ Value \\times Purchase\\ Frequency}{Churn\\ Rate} = \\$1,247$$";
      } else {
        response = "I can help you with sales forecasting, inventory optimization, customer segmentation, and pricing strategy. What specific metric or challenge would you like me to analyze for your store today?";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Welcome to LabFin Commerce Intelligence! I'm your AI co-pilot for e-commerce optimization. How can I help you analyze your sales, improve conversion rates, or manage inventory today?",
        timestamp: new Date(),
      }
    ]);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <Bot size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-white font-bold">LabFin Commerce</h3>
            <p className="text-blue-100 text-xs">AI Analytics Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMinimized(true)} 
            className="text-white/80 hover:text-white p-1"
          >
            <Minimize2 size={18} />
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-white/80 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.content.split('$$').map((part, i) => 
                  i % 2 === 1 ? (
                    <span key={i} className="block my-2 p-2 bg-slate-950 rounded text-center font-mono text-xs">
                      {part}
                    </span>
                  ) : (
                    part
                  )
                )}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none">
              <Loader2 className="animate-spin text-blue-400" size={16} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <form onSubmit={handleSend} className="flex gap-2">
          <button 
            type="button"
            onClick={clearChat}
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            Clear
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sales, inventory, or customers..."
            className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
