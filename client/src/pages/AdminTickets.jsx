import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, Eye, UserCheck } from 'lucide-react';
import './Dashboard.css';

const AdminTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [reassignModal, setReassignModal] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, filters, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, usersRes] = await Promise.all([
        api.get('/admin/tickets'),
        api.get('/admin/users?role=agent'),
      ]);
      setTickets(ticketsRes.data.tickets);
      setAgents(usersRes.data.users);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];
    if (filters.status !== 'all') filtered = filtered.filter(t => t.status === filters.status);
    if (filters.priority !== 'all') filtered = filtered.filter(t => t.priority === filters.priority);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.ticketNumber.toLowerCase().includes(term) ||
        t.subject.toLowerCase().includes(term) ||
        t.customer?.name?.toLowerCase().includes(term)
      );
    }

    setFilteredTickets(filtered);
  };

  const handleReassign = async () => {
    if (!selectedAgent) return;
    try {
      await api.patch(`/admin/tickets/${reassignModal._id}/assign`, {
        agentId: selectedAgent,
      });
      await fetchData();
      setReassignModal(null);
      setSelectedAgent('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reassign ticket');
    }
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
    const colors = { Low: '#a0aec0', Medium: '#ed8936', High: '#fc8181' };
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
          <p className="subtitle">View and manage all support tickets</p>
        </div>
        <span className="badge-agent">{tickets.length} total</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="ticket-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <div className="filter-select">
            <Filter size={16} />
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div className="filter-select">
            <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
              <option value="all">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tickets found</h3>
        </div>
      ) : (
        <div className="ticket-table-container">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Subject</th>
                <th>Customer</th>
                <th>Agent</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => {
                const statusStyle = getStatusColor(ticket.status);
                return (
                  <tr key={ticket._id}>
                    <td><span className="ticket-number-text">{ticket.ticketNumber}</span></td>
                    <td>{ticket.subject}</td>
                    <td>{ticket.customer?.name || 'Unknown'}</td>
                    <td>{ticket.assignedAgent?.name || <span style={{ color: '#666' }}>Unassigned</span>}</td>
                    <td>
                      <span className="priority-dot" style={{ background: getPriorityColor(ticket.priority) }} />
                      {ticket.priority}
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn-view"
                          onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn-view"
                          onClick={() => {
                            setReassignModal(ticket);
                            setSelectedAgent(ticket.assignedAgent?._id || '');
                          }}
                          title="Reassign"
                          style={{ background: '#2a4d2f' }}
                        >
                          <UserCheck size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reassign Modal */}
      {reassignModal && (
        <div className="modal-overlay" onClick={() => setReassignModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reassign Ticket</h2>
            </div>
            <p style={{ color: '#a0aec0', marginBottom: '16px' }}>
              {reassignModal.ticketNumber} - {reassignModal.subject}
            </p>
            <div className="form-group">
              <label>Select Agent</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  color: '#e0e0e0',
                }}
              >
                <option value="">-- Unassign --</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name} ({agent.ticketCount || 0} tickets)
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setReassignModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleReassign}>Reassign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;