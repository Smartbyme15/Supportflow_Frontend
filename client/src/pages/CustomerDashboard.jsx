import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
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
        <p>Loading your tickets...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="subtitle">Customer Dashboard</p>
        </div>
        <Link to="/customer/tickets/new" className="btn-primary">
          + New Ticket
        </Link>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="ticket-section">
        <h2>Your Tickets</h2>
        {tickets.length === 0 ? (
          <div className="empty-state">
            <p>No tickets yet</p>
            <Link to="/customer/tickets/new" className="btn-secondary">
              Create your first ticket
            </Link>
          </div>
        ) : (
          <div className="ticket-grid">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="ticket-card"
                onClick={() => navigate(`/customer/tickets/${ticket._id}`)}
              >
                <div className="ticket-card-header">
                  <span className="ticket-number">{ticket.ticketNumber}</span>
                  <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <h3 className="ticket-subject">{ticket.subject}</h3>
                <p className="ticket-description">{ticket.description?.substring(0, 100)}...</p>
                <div className="ticket-card-footer">
                  <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className="ticket-date">
                    {new Date(ticket.createdAt).toLocaleDateString()}
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