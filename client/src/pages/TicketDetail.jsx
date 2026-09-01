import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { io } from 'socket.io-client';
import { ArrowLeft, Send, Bot, User, CheckCircle, AlertCircle } from 'lucide-react';
import './TicketDetail.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const isAgent = user?.role === 'agent';

  useEffect(() => {
    fetchTicketDetails();
    fetchMessages();

    // Setup Socket.IO
    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      newSocket.emit('joinTicket', id);
    });

    newSocket.on('newMessage', (data) => {
      if (data.ticketId === id) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    newSocket.on('ticketStatusChanged', (data) => {
      if (data.ticketId === id) {
        setTicket(prev => ({ ...prev, status: data.status, resolutionNote: data.resolutionNote }));
      }
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit('leaveTicket', id);
        newSocket.disconnect();
      }
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTicketDetails = async () => {
    try {
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data.ticket);
    } catch (err) {
      setError('Failed to load ticket');
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets/${id}/messages`);
      setMessages(response.data.messages);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (ticket?.status === 'Resolved') {
      setError('Cannot send messages on resolved tickets');
      return;
    }

    setSending(true);
    try {
      const response = await api.post(`/tickets/${id}/messages`, {
        message: newMessage.trim(),
      });
      setMessages(prev => [...prev, response.data.message]);
      setNewMessage('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': '#63b3ed',
      'Assigned': '#ecc94b',
      'In Progress': '#ed8936',
      'Resolved': '#48bb78',
    };
    return colors[status] || '#a0aec0';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#a0aec0',
      'Medium': '#ed8936',
      'High': '#fc8181',
    };
    return colors[priority] || '#a0aec0';
  };

  if (loading) {
    return (
      <div className="ticket-detail-container">
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center', color: '#a0aec0' }}>Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-container">
        <div className="error-message">Ticket not found</div>
        <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="ticket-detail-container">
      {/* Header */}
      <div className="ticket-detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="ticket-detail-title">
          <h1>{ticket.ticketNumber}</h1>
          <p>{ticket.subject}</p>
        </div>
        <div className="ticket-detail-badges">
          <span 
            className="status-badge-lg"
            style={{ background: getStatusColor(ticket.status) + '20', color: getStatusColor(ticket.status) }}
          >
            {ticket.status}
          </span>
          <span 
            className="priority-badge-lg"
            style={{ background: getPriorityColor(ticket.priority) + '20', color: getPriorityColor(ticket.priority) }}
          >
            {ticket.priority}
          </span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Ticket Info */}
      <div className="ticket-info-grid">
        <div className="ticket-info-item">
          <span className="info-label">Category</span>
          <span className="info-value">{ticket.category || 'Other'}</span>
        </div>
        <div className="ticket-info-item">
          <span className="info-label">Customer</span>
          <span className="info-value">{ticket.customer?.name}</span>
        </div>
        <div className="ticket-info-item">
          <span className="info-label">Agent</span>
          <span className="info-value">{ticket.assignedAgent?.name || 'Not assigned'}</span>
        </div>
        <div className="ticket-info-item">
          <span className="info-label">Created</span>
          <span className="info-value">{new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Description */}
      <div className="ticket-description-section">
        <h3>Description</h3>
        <p>{ticket.description}</p>
      </div>

      {/* AI Suggestion */}
      {ticket.aiSuggestion && !ticket.aiSuggestion.error && (
        <div className="ai-suggestion-card">
          <div className="ai-suggestion-header">
            <Bot size={18} />
            <span>AI Triage Suggestion</span>
          </div>
          <div className="ai-suggestion-grid">
            <div>
              <label>Category</label>
              <span>{ticket.aiSuggestion.category}</span>
            </div>
            <div>
              <label>Priority</label>
              <span>{ticket.aiSuggestion.priority}</span>
            </div>
            <div className="full-width">
              <label>Summary</label>
              <span>{ticket.aiSuggestion.summary}</span>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Note */}
      {ticket.resolutionNote && (
        <div className="resolution-section">
          <div className="resolution-header">
            <CheckCircle size={18} color="#48bb78" />
            <span>Resolution Note</span>
          </div>
          <p>{ticket.resolutionNote}</p>
        </div>
      )}

      {/* Conversation */}
      <div className="conversation-section">
        <h3>Conversation</h3>
        <div className="message-list">
          {messages.length === 0 ? (
            <div className="empty-messages">
              <p>No messages yet</p>
              <span>Start the conversation by sending a message</span>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender._id === user._id;
              const isAgentMsg = msg.sender.role === 'agent';
              
              return (
                <div
                  key={msg._id}
                  className={`message-item ${isOwn ? 'message-own' : 'message-other'} ${isAgentMsg ? 'message-agent' : 'message-customer'}`}
                >
                  <div className="message-avatar">
                    {isAgentMsg ? (
                      <div className="avatar-agent">
                        <Bot size={16} />
                      </div>
                    ) : (
                      <div className="avatar-customer">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {msg.sender.name}
                        <span className="message-role">({msg.sender.role})</span>
                      </span>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="message-text">{msg.message}</div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {ticket.status !== 'Resolved' ? (
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isAgent ? "Type your reply..." : "Type your message..."}
              disabled={sending}
            />
            <button type="submit" disabled={sending || !newMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        ) : (
          <div className="resolved-message">
            <CheckCircle size={18} />
            This ticket is resolved. Cannot send new messages.
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;