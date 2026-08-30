import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { io } from 'socket.io-client';
import './Dashboard.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

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
  const [statusUpdate, setStatusUpdate] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [showResolution, setShowResolution] = useState(false);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTicketDetails();
    fetchMessages();

    // Setup socket
    const token = localStorage.getItem('token');
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      socketRef.current.emit('joinTicket', id);
    });

    socketRef.current.on('newMessage', (data) => {
      if (data.ticketId === id) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    socketRef.current.on('ticketStatusChanged', (data) => {
      if (data.ticketId === id) {
        setTicket(prev => ({ ...prev, status: data.status, resolutionNote: data.resolutionNote }));
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leaveTicket', id);
        socketRef.current.disconnect();
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

  const updateStatus = async (newStatus) => {
    if (newStatus === 'Resolved' && !resolutionNote.trim()) {
      setShowResolution(true);
      return;
    }

    try {
      const payload = { status: newStatus };
      if (newStatus === 'Resolved') {
        payload.resolutionNote = resolutionNote.trim();
      }
      
      await api.patch(`/tickets/${id}/status`, payload);
      setStatusUpdate('');
      setResolutionNote('');
      setShowResolution(false);
      // Socket will update the status
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    }
  };

  const reviewAI = async (category, priority, summary) => {
    try {
      await api.patch(`/tickets/${id}/ai-review`, { category, priority, summary });
      await fetchTicketDetails();
    } catch (err) {
      setError('Failed to review AI suggestion');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': 'status-new',
      'Assigned': 'status-assigned',
      'In Progress': 'status-progress',
      'Resolved': 'status-resolved',
    };
    return colors[status] || 'status-new';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'priority-low',
      'Medium': 'priority-medium',
      'High': 'priority-high',
    };
    return colors[priority] || 'priority-medium';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="dashboard-container">
        <div className="error-message">Ticket not found</div>
        <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
      </div>
    );
  }

  const isCustomer = user?.role === 'customer';
  const isAgent = user?.role === 'agent';
  const canEdit = isAgent && ticket.assignedAgent?._id === user._id;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>{ticket.ticketNumber}</h1>
          <p className="subtitle">{ticket.subject}</p>
        </div>
        <button onClick={() => navigate(isCustomer ? '/customer/dashboard' : '/agent/dashboard')} className="btn-secondary">
          Back
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="ticket-detail-grid">
        <div className="ticket-info-card">
          <div className="info-row">
            <span className="label">Status</span>
            <span className={`status-badge ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Priority</span>
            <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Category</span>
            <span>{ticket.category}</span>
          </div>
          <div className="info-row">
            <span className="label">Customer</span>
            <span>{ticket.customer?.name}</span>
          </div>
          <div className="info-row">
            <span className="label">Agent</span>
            <span>{ticket.assignedAgent?.name || 'Not assigned'}</span>
          </div>
          {ticket.resolutionNote && (
            <div className="info-row">
              <span className="label">Resolution Note</span>
              <span>{ticket.resolutionNote}</span>
            </div>
          )}
        </div>

        {isAgent && canEdit && ticket.aiSuggestion && !ticket.aiSuggestion.reviewed && (
          <div className="ai-card">
            <h3>🤖 AI Suggestion</h3>
            {ticket.aiSuggestion.error ? (
              <p className="ai-error">AI analysis unavailable: {ticket.aiSuggestion.error}</p>
            ) : (
              <>
                <div className="ai-field">
                  <label>Category</label>
                  <span>{ticket.aiSuggestion.category}</span>
                </div>
                <div className="ai-field">
                  <label>Priority</label>
                  <span>{ticket.aiSuggestion.priority}</span>
                </div>
                <div className="ai-field">
                  <label>Summary</label>
                  <span>{ticket.aiSuggestion.summary}</span>
                </div>
                <button
                  onClick={() => reviewAI(
                    ticket.aiSuggestion.category,
                    ticket.aiSuggestion.priority,
                    ticket.aiSuggestion.summary
                  )}
                  className="btn-primary"
                >
                  Apply AI Suggestion
                </button>
              </>
            )}
          </div>
        )}

        {isAgent && canEdit && ticket.status !== 'Resolved' && (
          <div className="status-controls">
            <h3>Update Status</h3>
            <div className="status-buttons">
              {['New', 'Assigned', 'In Progress', 'Resolved'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusUpdate(status);
                    if (status === 'Resolved') {
                      setShowResolution(true);
                    } else {
                      updateStatus(status);
                    }
                  }}
                  className={`btn-status ${ticket.status === status ? 'active' : ''}`}
                  disabled={ticket.status === 'Resolved' && status !== 'Resolved'}
                >
                  {status}
                </button>
              ))}
            </div>
            {showResolution && (
              <div className="resolution-input">
                <textarea
                  placeholder="Resolution note (required)"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  rows={3}
                />
                <div className="resolution-actions">
                  <button
                    onClick={() => updateStatus('Resolved')}
                    className="btn-primary"
                    disabled={!resolutionNote.trim()}
                  >
                    Resolve Ticket
                  </button>
                  <button
                    onClick={() => {
                      setShowResolution(false);
                      setResolutionNote('');
                      setStatusUpdate('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="chat-section">
        <h3>Conversation</h3>
        <div className="message-list">
          {messages.length === 0 ? (
            <p className="empty-messages">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`message ${msg.sender._id === user._id ? 'message-own' : 'message-other'}`}
              >
                <div className="message-header">
                  <strong>{msg.sender.name}</strong>
                  <span className="message-role">({msg.sender.role})</span>
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-body">{msg.message}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {ticket.status !== 'Resolved' ? (
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
            />
            <button type="submit" disabled={sending || !newMessage.trim()}>
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        ) : (
          <p className="resolved-message">This ticket is resolved. Cannot send new messages.</p>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;