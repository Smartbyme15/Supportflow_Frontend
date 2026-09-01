import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import './AIChat.css';

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hello! I'm your AI Support Assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const aiResponses = [
        "I understand your concern. Let me help you with that.",
        "Great question! Here's what you can do...",
        "I recommend checking your ticket status in the dashboard.",
        "You can create a new ticket from the 'New Ticket' option.",
        "For urgent issues, please mark the priority as 'High'.",
        "I'll connect you with a support agent if needed."
      ];
      
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div className="ai-chat-header-left">
          <div className="ai-avatar">
            <Bot size={24} />
          </div>
          <div>
            <h2>AI Support Assistant</h2>
            <p className="ai-status">🟢 Online • Ready to help</p>
          </div>
        </div>
        <div className="ai-badge">
          <Sparkles size={16} />
          <span>AI Powered</span>
        </div>
      </div>

      <div className="ai-chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`ai-message ${msg.sender === 'ai' ? 'ai-message-ai' : 'ai-message-user'}`}
          >
            <div className="ai-message-avatar">
              {msg.sender === 'ai' ? (
                <div className="ai-avatar-small">
                  <Bot size={16} />
                </div>
              ) : (
                <div className="user-avatar-small">
                  <User size={16} />
                </div>
              )}
            </div>
            <div className="ai-message-content">
              <div className="ai-message-text">{msg.text}</div>
              <div className="ai-message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="ai-message ai-message-ai">
            <div className="ai-message-avatar">
              <div className="ai-avatar-small">
                <Bot size={16} />
              </div>
            </div>
            <div className="ai-message-content">
              <div className="ai-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="ai-chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about your tickets..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AIChat;