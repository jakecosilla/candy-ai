import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'init', sender: 'bot', text: 'Hi! I am the Candy AI assistant. Ask me anything about our roles or company culture.' }]);
  const [inputStr, setInputStr] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputStr.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: inputStr };
    setMessages(prev => [...prev, userMsg]);
    setInputStr('');
    setIsTyping(true);

    try {
      const aiUrl = import.meta.env.VITE_AI_URL || 'http://localhost:8000';
      const response = await fetch(`${aiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });
      const data = await response.json();
      
      const botMsg: ChatMessage = { id: Date.now().toString() + 'b', sender: 'bot', text: data.reply || 'Sorry, I am having trouble connecting to my knowledge base right now.' };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = { id: Date.now().toString() + 'e', sender: 'bot', text: 'I am currently offline. Please try again later.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center text-white z-[100] transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-sky-600'}`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-white border border-slate-200 rounded-3xl shadow-2xl z-[99] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <header className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Candy AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Online Assistant</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-sky-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm space-x-1 flex items-center">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          <footer className="p-4 bg-white border-t border-slate-100 space-y-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 transition-all"
                placeholder="Ask me about roles, culture, or process..."
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                className="bg-sky-600 text-white p-3 rounded-xl hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/20 disabled:opacity-50"
                onClick={handleSend}
                disabled={!inputStr.trim()}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <Sparkles size={10} />
              Powered by Candy Agentic AI Core
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
