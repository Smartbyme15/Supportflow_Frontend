import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Search, Filter, ChevronDown } from 'lucide-react';
import './Dashboard.css';

const AgentTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, filters, searchTerm]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets/assigned');
      setTickets(response.data.tickets);
      setError('');
    } catch (err) {
      setError('Failed to load tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    if (filters.status !== 'All') {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters.priority !== 'All') {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(term) ||
          t.subject.toLowerCase().includes(term) ||
          t.customer?.name?.toLowerCase().includes(term)
      );
    }

    setFilteredTickets(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      New: { bg: '#2b6cb020', color: '#63b3ed' },
      Assigned: { bg: '#ecc94b20', color: '#ecc94b' },
      'In Progress': { bg: '#ed893620', color: '#ed8936' },
      Resolved: { bg: '#48bb7820', color: '#48bb78' },
    };
    return colors[status] || { bg: '#a0aec020', color: '#a0aec0' };
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: '#a0aec0',
      Medium: '#ed8936',
      High: '#fc8181',
    };
    return colors[priority] || '#a0aec0';
  };

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
          <h1>All Tickets</h1>
          <p className="subtitle">Manage your assigned tickets</p>
        </div>
        <span className="badge-agent">{tickets.length} assigned</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="ticket-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by number, subject, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-select">
            <Filter size={16} />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="filter-select">
            <ChevronDown size={16} />
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      {filteredTickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tickets found</h3>
          <p>{searchTerm ? 'Try adjusting your search' : 'No tickets assigned to you yet'}</p>
        </div>
      ) : (
        <div className="ticket-table-container">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Subject</th>
                <th>Customer</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => {
                const statusStyle = getStatusColor(ticket.status);
                return (
                  <tr key={ticket._id}>
                    <td>
                      <span className="ticket-number-text">{ticket.ticketNumber}</span>
                    </td>
                    <td>
                      <span className="ticket-subject-text">{ticket.subject}</span>
                    </td>
                    <td>{ticket.customer?.name || 'Unknown'}</td>
                    <td>
                      <span
                        className="priority-dot"
                        style={{ background: getPriorityColor(ticket.priority) }}
                      />
                      {ticket.priority}
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/agent/tickets/${ticket._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentTickets;