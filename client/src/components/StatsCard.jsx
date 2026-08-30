import React from 'react';
import './StatsCard.css';

const StatsCard = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ background: color }}>
        <Icon size={24} color="white" />
      </div>
      <div className="stats-content">
        <span className="stats-value">{value}</span>
        <span className="stats-label">{label}</span>
      </div>
    </div>
  );
};

export default StatsCard;