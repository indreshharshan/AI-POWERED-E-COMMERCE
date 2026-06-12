import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ShoppingBag, Loader2, Bot, Sparkles } from 'lucide-react';
import { API_URL } from '../config';
import Item from './Item';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Hi there! 👋 I am your Shopper Assistant. How can I help you today?', products: [] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          chatHistory: chatHistory.map(h => ({ role: h.role, content: h.content }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: data.message,
          products: data.products || []
        }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.', products: [] }]);
      }
    } catch (error) {
      console.error('Chatbot Error:', error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Could not connect to the assistant.', products: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (text) => {
    // Remove the {{PRODUCT_X}} tags for clean display
    return text.replace(/{{PRODUCT_\d+}}/gi, '').trim();
  };

  const suggestions = [
    "Trending clothes",
    "Shoes under Rs. 2000",
    "New arrivals",
    "Shipping info"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] sm:w-[450px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-red-500 p-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Shopper Assistant</h3>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                   Online & Ready to Help
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-6 text-left">
            {chatHistory.map((chat, index) => (
              <div key={index} className="space-y-3">
                <div 
                  className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      chat.role === 'user' 
                        ? 'bg-red-500 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                    }`}
                  >
                    {formatMessage(chat.content)}
                  </div>
                </div>

                {/* Render Product Cards if any */}
                {chat.products && chat.products.length > 0 && (
                  <div className="flex flex-col gap-4 ml-2 max-w-[90%]">
                    {chat.products.map((product) => (
                      <div key={product.id} className="bg-white p-3 rounded-2xl shadow-lg border border-gray-100">
                         <Item {...product} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Shopper is thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          {!isLoading && chatHistory.length < 3 && (
            <div className="px-4 py-2 flex flex-wrap gap-2 bg-white">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMessage(s);
                  }}
                  className="text-[11px] px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all border border-transparent hover:border-red-100 text-gray-600"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-100 text-sm py-2.5 px-4 rounded-full outline-none focus:ring-2 focus:ring-red-100 transition-all border-none"
            />
            <button 
              type="submit"
              disabled={isLoading || !message.trim()}
              className="w-10 h-10 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <div className="relative group z-50">
        {/* Animated Gradient Glow Background */}
        {!isOpen && (
          <div className="absolute -inset-1.5 bg-gradient-to-r from-red-400 via-red-500 to-orange-500 rounded-full blur-md opacity-75 group-hover:opacity-100 animate-spin-slow transition duration-500"></div>
        )}
        
        {/* Floating Emojis */}
        {!isOpen && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
            <span className="absolute text-xl animate-float-1 opacity-0">✨</span>
            <span className="absolute text-lg animate-float-2 opacity-0">💬</span>
            <span className="absolute text-xl animate-float-3 opacity-0">🛍️</span>
          </div>
        )}

        <button 
          onClick={() => {
            if (localStorage.getItem('auth-token')) {
              setIsOpen(!isOpen);
            } else {
              setShowLoginPrompt(true);
            }
          }}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 ${
            isOpen ? 'bg-gray-800' : 'bg-red-500 animate-bounce-slow'
          }`}
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <>
               <Bot size={32} className="relative z-10 text-white drop-shadow-md" />
               <Sparkles size={16} className="absolute top-2.5 right-2.5 text-yellow-300 animate-pulse" />
            </>
          )}
        </button>
          {/* Login Prompt Notification */}
          {showLoginPrompt && (
            <div className="fixed bottom-24 right-6 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
              <span>Please log in to use the chatbot.</span>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="ml-2 text-sm underline"
              >
                Close
              </button>
            </div>
          )}
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        @keyframes float-1 {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-30px, -90px) scale(1.2); opacity: 0; }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(30px, -100px) scale(1.1); opacity: 0; }
        }
        @keyframes float-3 {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(0px, -110px) scale(1.3); opacity: 0; }
        }
        .animate-float-1 { animation: float-1 3s ease-in infinite; }
        .animate-float-2 { animation: float-2 4s ease-in infinite 1.5s; }
        .animate-float-3 { animation: float-3 3.5s ease-in infinite 2.5s; }
      `}</style>
    </div>
  );
};

export default Chatbot;
