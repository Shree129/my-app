import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatBot.css';

const API_BASE = ''; // Use relative paths for proxy/serverless compatibility

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hello! 👋 Welcome to JP Furnishing!\n\nI'm your AI shopping assistant. I can help you with:\n• 🛍️ Product recommendations\n• 📏 Size & material guidance\n• 💰 Pricing information\n• 📦 Order tracking & returns\n• 🎨 Interior design tips\n\nHow can I help you today?",
};

const QUICK_ACTIONS = [
  { label: '🪟 Curtains', text: 'Show me your curtain collection' },
  { label: '🛏️ Bedsheets', text: 'I need bedsheets for my bedroom' },
  { label: '💰 Best deals', text: 'What are your best deals right now?' },
  { label: '📦 Track order', text: 'I want to track my order' },
  { label: '🔄 Returns', text: 'What is your return policy?' },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }, []);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  }, [isOpen, handleClose]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      // Send only the conversation messages (not including welcome)
      const conversationHistory = [...messages, userMessage]
        .filter(m => m.role !== 'system')
        .map(({ role, content }) => ({ role, content }));

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          context: `User is browsing JP Furnishing website. Current page: ${window.location.pathname}`,
        }),
      });

      if (!res.ok) throw new Error('Failed to get response');

      const data = await res.json();
      const botMessage = {
        role: 'assistant',
        content: data.reply || "I'm sorry, I couldn't process that. Please try again!",
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      // Fallback: use client-side responses if server is unavailable
      const fallback = getClientFallback(text);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallback,
      }]);
    }

    setIsLoading(false);
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (text) => {
    sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        id="chatbot-toggle-btn"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbot-window ${isClosing ? 'closing' : ''}`} role="dialog" aria-label="Chat with JP Furnishing AI Assistant">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-avatar">🏠</div>
            <div className="chatbot-header-info">
              <h3 className="chatbot-header-title">JP Furnishing AI</h3>
              <div className="chatbot-header-status">
                <span className="dot"></span>
                Online — typically replies instantly
              </div>
            </div>
            <button className="chatbot-close" onClick={handleClose} aria-label="Close chat">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role === 'user' ? 'user' : 'bot'}`}>
                <div className="chat-message-avatar">
                  {msg.role === 'user' ? '👤' : '🏠'}
                </div>
                <div className="chat-bubble">
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}

            {/* Quick actions after welcome */}
            {showQuickActions && messages.length === 1 && (
              <div className="chat-quick-actions">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    className="chat-quick-btn"
                    onClick={() => handleQuickAction(action.text)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="chatbot-input"
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              id="chatbot-input-field"
              autoComplete="off"
            />
            <button
              type="submit"
              className="chatbot-send"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

/**
 * Client-side fallback responses when server is unavailable
 */
function getClientFallback(query) {
  const q = query.toLowerCase();

  if (/curtain/i.test(q)) {
    return "🪟 We have a beautiful curtain collection! Visit our Curtain Section for options in sheer, blackout, and cotton blends. Prices start from ₹400/panel. Check them out in the Buyer Dashboard!";
  }
  if (/bedsheet|bed sheet/i.test(q)) {
    return "🛏️ Our bedsheets come in King and Queen sizes with premium fabrics. Browse our Bedsheet Section from the dashboard — prices range from ₹500-₹3000!";
  }
  if (/sofa|cover/i.test(q)) {
    return "🛋️ Sofa covers in stretchable and custom-fit options are available! Visit the Sofa Cover Section for our full collection (₹800-₹4000).";
  }
  if (/price|cost|cheap|budget/i.test(q)) {
    return "💰 Our price ranges:\n• Curtains: ₹400-₹2500/panel\n• Bedsheets: ₹500-₹3000\n• Sofa Covers: ₹800-₹4000\n• Pillow Covers: ₹150-₹800/pair\n• Doormats: ₹200-₹1200";
  }
  if (/return|refund/i.test(q)) {
    return "📦 Return Policy: 7-day return window, product must be unused and in original packaging. Refunds processed within 5-7 business days.";
  }
  if (/track|order|delivery/i.test(q)) {
    return "📍 Please share your order ID and I'll help track it! Standard delivery takes 5-10 business days.";
  }
  if (/hi|hello|hey/i.test(q)) {
    return "Hello! 😊 How can I help you today? I can assist with product recommendations, pricing, orders, and more!";
  }

  return "Thanks for your question! 😊 I can help with product recommendations, pricing, orders, returns, and interior design tips. Could you provide more details about what you're looking for?";
}
