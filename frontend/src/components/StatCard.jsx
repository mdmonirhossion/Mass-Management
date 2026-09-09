import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'blue' }) {
  return (
    <div className="card stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}
