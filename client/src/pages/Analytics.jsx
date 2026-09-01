import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BarChart3, Ticket, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data.stats);
      setError('');
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { icon: Ticket, label: 'Total', value: stats.total, color: '#355E3B' },
    { icon: Clock, label: 'New', value: stats.new, color: '#63b3ed' },
    { icon: TrendingUp, label: 'In Progress', value: stats.inProgress, color: '#ed8936' },
    { icon: CheckCircle, label: 'Resolved', value: stats.resolved, color: '#48bb78' },
    { icon: AlertTriangle, label: 'High Priority', value: stats.highPriority, color: '#fc8181' },
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
          <h1>Analytics</h1>
          <p className="subtitle">Ticket performance overview</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stats-card-analytics">
            <div className="stats-icon-analytics" style={{ background: stat.color + '20', color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stats-content-analytics">
              <span className="stats-value-analytics">{stat.value}</span>
              <span className="stats-label-analytics">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;