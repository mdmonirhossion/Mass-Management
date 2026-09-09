import React from 'react';
import { Sun, Moon, LogOut, Shield, User } from 'lucide-react';

export default function Topbar({
  title,
  subtitle,
  currentMonth,
  setCurrentMonth,
  darkMode,
  setDarkMode,
  user,
  onLogout
}) {
  const months = ['September 2026', 'October 2026', 'November 2026', 'December 2026'];

  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <div className="month-selector">
          <select value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)}>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Light / Dark Mode"
        >
          {darkMode ? <Sun size={16} style={{ color: '#f59e0b' }} /> : <Moon size={16} />}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>

        {user && (
          <div className="user-profile-badge">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role-label">
                {user.role === 'admin' ? (
                  <span className="badge badge-admin">👑 Main Manager</span>
                ) : user.isGranted ? (
                  <span className="badge badge-granted">✅ Granted</span>
                ) : (
                  <span className="badge badge-restricted">🔒 Read-Only</span>
                )}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '6px 10px', fontSize: '12px', marginLeft: '4px' }}
              onClick={onLogout}
              title="Log Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
