import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  PlusCircle, 
  Ticket, 
  Clock, 
  CheckCircle, 
  TrendingUp
} from 'lucide-react';
import './Dashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets/my');
      setTickets(response.data.tickets);
      setError('');
    } catch (err) {
      setError('Failed to load tickets');
      console.error(err);
    } finally {
      setLoading(false);
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

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status !== 'Resolved').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
  };

  const statCards = [
    { icon: Ticket, label: 'Total', value: stats.total, color: '#355E3B' },
    { icon: Clock, label: 'Open', value: stats.open, color: '#63b3ed' },
    { icon: TrendingUp, label: 'In Progress', value: stats.inProgress, color: '#ed8936' },
    { icon: CheckCircle, label: 'Resolved', value: stats.resolved, color: '#48bb78' },
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center', color: '#a0aec0' }}>Loading your tickets...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p className="subtitle">Customer Dashboard</p>
        </div>
        <Link to="/customer/tickets/new" className="btn-primary-lg">
          <PlusCircle size={20} />
          + New Ticket
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stats-card">
            <div className="stats-icon" style={{ background: stat.color + '20', color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stats-content">
              <span className="stats-value">{stat.value}</span>
              <span className="stats-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ticket-section">
        <div className="section-header">
          <h2>Your Tickets</h2>
          <span className="ticket-count">{tickets.length} tickets</span>
        </div>

        {tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No tickets yet</h3>
            <p>Create your first support ticket to get started</p>
            <Link to="/customer/tickets/new" className="btn-secondary" style={{ marginTop: '16px' }}>
              Create New Ticket
            </Link>
          </div>
        ) : (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="ticket-item"
                onClick={() => navigate(`/customer/tickets/${ticket._id}`)}
              >
                <div className="ticket-item-left">
                  <span className="ticket-number">{ticket.ticketNumber}</span>
                  <h4 className="ticket-title">{ticket.subject}</h4>
                  <div className="ticket-meta">
                    <span className="ticket-category">{ticket.category || 'Other'}</span>
                    <span className="ticket-date">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="ticket-item-right">
                  <span 
                    className="status-badge"
                    style={{ 
                      background: getStatusColor(ticket.status) + '20', 
                      color: getStatusColor(ticket.status) 
                    }}
                  >
                    {ticket.status}
                  </span>
                  <span 
                    className="priority-badge"
                    style={{ 
                      background: getPriorityColor(ticket.priority) + '20', 
                      color: getPriorityColor(ticket.priority) 
                    }}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;