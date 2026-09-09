import React from 'react';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Receipt, Wallet, Users, LogOut, ShieldCheck, UserCheck } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'daily-meal', label: 'Daily Meal', icon: UtensilsCrossed },
    { id: 'bazar', label: 'Bazar', icon: ShoppingBag },
    { id: 'monthly-bills', label: 'Monthly Bills', icon: Receipt },
    { id: 'settlement', label: 'Settlement', icon: Wallet },
    { id: 'members', label: 'Members & Access', icon: Users },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span style={{ fontSize: '24px' }}>🏠</span>
        <span>Our Mess</span>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {user && (
        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '15px' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {user.role === 'admin' ? '👑 Main Manager' : user.isGranted ? '✅ Access Granted' : '🔒 Read-Only'}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="nav-item"
            style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
