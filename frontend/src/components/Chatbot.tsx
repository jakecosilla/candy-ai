import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

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
      const response = await fetch('http://localhost:8000/chat', {
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
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 32px var(--accent-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'transform 0.2s',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div 
          className="glass-card"
          style={{
            position: 'fixed',
            bottom: '6.5rem',
            right: '2rem',
            width: '350px',
            height: '500px',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--accent-color)', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
              <Bot size={20} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>Candy AI</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Recruiting Assistant</p>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                backgroundColor: msg.sender === 'user' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                borderBottomRightRadius: msg.sender === 'user' ? 0 : '1rem',
                borderBottomLeftRadius: msg.sender === 'bot' ? 0 : '1rem',
                fontSize: '0.95rem'
              }}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                borderBottomLeftRadius: 0,
              }}>
                <div className="typing-indicator" style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite alternate' }}></span>
                  <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite alternate 0.2s' }}></span>
                  <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite alternate 0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="select-base"
              style={{ flex: 1, padding: '0.75rem', backgroundImage: 'none' }}
              placeholder="Type a message..."
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              className="btn btn-primary"
              style={{ padding: '0.75rem' }}
              onClick={handleSend}
            >
              <Send size={18} />
            </button>
          </div>
          
          <style>{`
            @keyframes bounce {
              0% { transform: translateY(0); }
              100% { transform: translateY(-3px); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
