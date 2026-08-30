import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react';
import './Dashboard.css';

const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, statsRes] = await Promise.all([
        api.get('/tickets/assigned'),
        api.get('/dashboard/stats'),
      ]);
      setTickets(ticketsRes.data.tickets);
      setStats(statsRes.data.stats);
      setError('');
    } catch (err) {
      setError('Failed to load data');
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

  const statData = stats ? [
    { 
      icon: Ticket, 
      label: 'Total Tickets', 
      value: stats.total, 
      color: '#355E3B' 
    },
    { 
      icon: Clock, 
      label: 'New', 
      value: stats.new, 
      color: '#2b6cb0' 
    },
    { 
      icon: TrendingUp, 
      label: 'In Progress', 
      value: stats.inProgress, 
      color: '#ed8936' 
    },
    { 
      icon: CheckCircle, 
      label: 'Resolved', 
      value: stats.resolved, 
      color: '#38a169' 
    },
    { 
      icon: AlertTriangle, 
      label: 'High Priority', 
      value: stats.highPriority, 
      color: '#e53e3e' 
    },
  ] : [];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name} 👋</h1>
          <p className="subtitle">Here's what's happening with your tickets</p>
        </div>
        <div className="header-actions">
          <span className="badge-agent">Agent</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Stats Grid */}
      <div className="stats-grid">
        {statData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="ticket-section">
        <div className="section-header">
          <h2>Your Assigned Tickets</h2>
          <span className="ticket-count">{tickets.length} tickets</span>
        </div>

        {tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No tickets assigned</h3>
            <p>When tickets are assigned to you, they'll appear here</p>
          </div>
        ) : (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="ticket-item"
                onClick={() => navigate(`/agent/tickets/${ticket._id}`)}
              >
                <div className="ticket-item-left">
                  <span className="ticket-number">{ticket.ticketNumber}</span>
                  <h4 className="ticket-title">{ticket.subject}</h4>
                  <div className="ticket-meta">
                    <span className="ticket-customer">{ticket.customer?.name}</span>
                    <span className="ticket-date">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="ticket-item-right">
                  <span 
                    className="status-badge"
                    style={{ background: getStatusColor(ticket.status) + '20', color: getStatusColor(ticket.status) }}
                  >
                    {ticket.status}
                  </span>
                  <span 
                    className="priority-badge"
                    style={{ background: getPriorityColor(ticket.priority) + '20', color: getPriorityColor(ticket.priority) }}
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

export default AgentDashboard;