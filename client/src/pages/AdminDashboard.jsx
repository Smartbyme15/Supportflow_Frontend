import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Users, 
  Ticket, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare,
  Shield,
  TrendingUp
} from 'lucide-react';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
      setRecentTickets(response.data.recentTickets);
      setError('');
    } catch (err) {
      setError('Failed to load admin data');
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const statCards = stats ? [
    { icon: Users, label: 'Total Users', value: stats.users.total, color: '#355E3B' },
    { icon: Users, label: 'Customers', value: stats.users.customers, color: '#63b3ed' },
    { icon: Shield, label: 'Agents', value: stats.users.agents, color: '#ecc94b' },
    { icon: Ticket, label: 'Total Tickets', value: stats.tickets.total, color: '#ed8936' },
    { icon: TrendingUp, label: 'In Progress', value: stats.tickets.inProgress, color: '#ed8936' },
    { icon: CheckCircle, label: 'Resolved', value: stats.tickets.resolved, color: '#48bb78' },
    { icon: AlertTriangle, label: 'High Priority', value: stats.tickets.highPriority, color: '#fc8181' },
    { icon: MessageSquare, label: 'Messages', value: stats.messages.total, color: '#a78bfa' },
  ] : [];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Welcome back, {user?.name}</p>
        </div>
        <div className="header-actions">
          <span className="badge-agent" style={{ background: '#4a1a1a', color: '#fc8181', borderColor: '#fc8181' }}>
            🛡️ Admin
          </span>
        </div>
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

      {/* Quick Actions */}
      <div className="admin-actions" style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={() => navigate('/admin/users')}>
          <Users size={18} /> Manage Users
        </button>
        <button className="btn-primary" onClick={() => navigate('/admin/tickets')}>
          <Ticket size={18} /> All Tickets
        </button>
      </div>

      {/* Recent Tickets */}
      <div className="ticket-section">
        <div className="section-header">
          <h2>Recent Tickets</h2>
          <button className="btn-secondary" onClick={() => navigate('/admin/tickets')}>
            View All
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tickets yet</h3>
            <p>Tickets will appear here</p>
          </div>
        ) : (
          <div className="ticket-list">
            {recentTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="ticket-item"
                onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;