import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Loader2 } from 'lucide-react';
import assistantImg from '../assets/david_avatar.png';
// Removendo assistantPreviewImg pois assistant.jpg agora é a nova imagem oficial


const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Como a Falco Assessoria Jurídica pode ajudar com seus direitos trabalhistas hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://laadyyerfyciabizqtel.supabase.co/functions/v1/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, threadId })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      if (data.threadId) setThreadId(data.threadId);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error.message.includes('Configuração')
        ? "⚠️ Erro de Configuração: As chaves da OpenAI não foram encontradas no Supabase. Por favor, siga as instruções de configuração."
        : "Desculpe, tive um problema na conexão. Pode tentar novamente?";

      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {/* Floating Button */}
      <button
        className={`chat-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div class="chat-avatar relative">
              <img src={assistantImg} alt="Falco Assessoria" className="w-full h-full object-cover rounded-full shadow-xl" />
            </div>
            <div>
              <h3 className="font-serif tracking-tight text-white/90">Falco Assessoria Jurídica</h3>
              <p className="flex items-center gap-1.5 uppercase tracking-[0.2em] text-[9px] font-black text-white/70">
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></span>
                Online
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="chat-close">
            <X size={20} />
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.role}`}>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message-content typing">
                <Loader2 size={16} className="animate-spin opacity-50" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={!input.trim() || isLoading}>
            <Send size={20} />
          </button>
        </form>
      </div>

      <style>{`
        .chat-widget {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9999;
          font-family: 'Inter', sans-serif;
        }

        .chat-toggle {
          width: 65px;
          height: 65px;
          border-radius: 18px;
          background: linear-gradient(135deg, #c19a6b 0%, #d4af37 100%);
          color: black;
          border: none;
          box-shadow: 0 8px 25px rgba(193, 154, 107, 0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-toggle:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 12px 30px rgba(193, 154, 107, 0.4);
        }

        .chat-window {
          position: absolute;
          bottom: 85px;
          right: 0;
          width: 400px;
          height: 600px;
          background: rgba(18, 18, 18, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid #c19a6b;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(193, 154, 107, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px) scale(0.95);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-window.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .chat-header {
          padding: 25px;
          background: linear-gradient(to right, rgba(193, 154, 107, 0.15), rgba(18, 18, 18, 0));
          border-bottom: 1px solid rgba(193, 154, 107, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .chat-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
        }

        .chat-avatar {
          width: 55px;
          height: 55px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .chat-header h3 {
          font-size: 0.95rem;
          color: #ffffff;
          font-weight: 600;
          margin: 0;
          letter-spacing: -0.01em;
          font-family: 'Cinzel', serif;
        }

        .chat-header p {
          font-size: 0.7rem;
          color: #ffffff;
          margin: 0;
          opacity: 0.9;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .chat-close {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 8px;
          border-radius: 10px;
          transition: all 0.3s;
        }

        .chat-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #d4af37;
        }

        .chat-messages {
          flex: 1;
          padding: 25px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: transparent;
        }

        .message-wrapper {
          display: flex;
          gap: 12px;
          max-width: 85%;
        }

        .message-wrapper.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(193, 154, 107, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #d4af37;
          border: 1px solid rgba(193, 154, 107, 0.1);
        }

        .user .message-icon {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .message-content {
          padding: 14px 18px;
          border-radius: 18px;
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .assistant .message-content {
          background: rgba(45, 55, 72, 0.4);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(193, 154, 107, 0.1);
          border-top-left-radius: 4px;
        }

        .user .message-content {
          background: linear-gradient(135deg, #c19a6b 0%, #d4af37 100%);
          color: #000000;
          border-top-right-radius: 4px;
          font-weight: 600;
        }

        .chat-input-area {
          padding: 20px 25px;
          border-top: 1px solid rgba(193, 154, 107, 0.2);
          display: flex;
          gap: 12px;
          background: rgba(18, 18, 18, 0.5);
        }

        .chat-input-area input {
          flex: 1;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(193, 154, 107, 0.3);
          border-radius: 12px;
          padding: 14px 18px;
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .chat-input-area input:focus {
          border-color: #d4af37;
          background: rgba(0, 0, 0, 0.5);
          box-shadow: 0 0 0 3px rgba(193, 154, 107, 0.1);
        }

        .chat-input-area button {
          background: linear-gradient(135deg, #c19a6b 0%, #d4af37 100%);
          color: black;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-input-area button:hover:not(:disabled) {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 5px 15px rgba(193, 154, 107, 0.4);
        }

        .chat-input-area button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .text-gold { color: #d4af37; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 120px);
            bottom: 80px;
            right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
