const fs = require('fs');
const path = require('path');

// 1. Update frontend/src/services/api.js
const apiPath = path.join(__dirname, '../frontend/src/services/api.js');
const apiContent = `const API_BASE = '/api';

export async function loginUser(username, password) {
    const res = await fetch(\`\${API_BASE}/auth/login\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
}

export async function registerUser(name, email, password) {
    const res = await fetch(\`\${API_BASE}/auth/register\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
}

export async function fetchSummary(month) {
    const res = await fetch(\`\${API_BASE}/summary?month=\${encodeURIComponent(month)}\`);
    if (!res.ok) throw new Error('Failed to fetch summary data');
    return res.json();
}

export async function fetchMembers() {
    const res = await fetch(\`\${API_BASE}/members\`);
    if (!res.ok) throw new Error('Failed to fetch members');
    return res.json();
}

export async function addMember(name, room) {
    const res = await fetch(\`\${API_BASE}/members\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, room })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add member');
    return data;
}

export async function deleteMember(id) {
    const res = await fetch(\`\${API_BASE}/members/\${id}\`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete member');
    return res.json();
}

export async function fetchMeals(month) {
    const res = await fetch(\`\${API_BASE}/meals?month=\${encodeURIComponent(month)}\`);
    if (!res.ok) throw new Error('Failed to fetch meals');
    return res.json();
}

export async function saveMeals(month, meals, date) {
    const res = await fetch(\`\${API_BASE}/meals\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, meals, date })
    });
    if (!res.ok) throw new Error('Failed to save meals');
    return res.json();
}

export async function fetchBazar(month) {
    const res = await fetch(\`\${API_BASE}/bazar?month=\${encodeURIComponent(month)}\`);
    if (!res.ok) throw new Error('Failed to fetch bazar data');
    return res.json();
}

export async function addBazar(entry) {
    const res = await fetch(\`\${API_BASE}/bazar\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add bazar entry');
    return data;
}

export async function updateBazar(id, items, amount) {
    const res = await fetch(\`\${API_BASE}/bazar/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, amount })
    });
    if (!res.ok) throw new Error('Failed to update bazar entry');
    return res.json();
}

export async function deleteBazar(id) {
    const res = await fetch(\`\${API_BASE}/bazar/\${id}\`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete bazar entry');
    return res.json();
}

export async function fetchBills(month) {
    const res = await fetch(\`\${API_BASE}/bills?month=\${encodeURIComponent(month)}\`);
    if (!res.ok) throw new Error('Failed to fetch bills');
    return res.json();
}

export async function addBill(name, amount, month) {
    const res = await fetch(\`\${API_BASE}/bills\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount, month })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add bill');
    return data;
}

export async function updateBill(id, amount) {
    const res = await fetch(\`\${API_BASE}/bills/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    });
    if (!res.ok) throw new Error('Failed to update bill');
    return res.json();
}

export async function deleteBill(id) {
    const res = await fetch(\`\${API_BASE}/bills/\${id}\`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete bill');
    return res.json();
}

export async function settleMember(member, month) {
    const res = await fetch(\`\${API_BASE}/settlements\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member, month })
    });
    if (!res.ok) throw new Error('Failed to settle member');
    return res.json();
}
`;

fs.writeFileSync(apiPath, apiContent, 'utf8');
console.log('api.js updated successfully');

// 2. Update frontend/src/pages/LoginPage.jsx
const loginPath = path.join(__dirname, '../frontend/src/pages/LoginPage.jsx');
const loginContent = `import React, { useState } from 'react';
import { LogIn, User, Lock, Mail, UserPlus, ShieldCheck, CheckCircle, ShieldAlert } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      id: '1',
      label: '👑 Main Manager (Full Control)',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      isGranted: true,
      desc: 'Username: admin | Pass: admin123 (Full edit & admin control)'
    },
    {
      id: '2',
      label: '✅ Granted Member (Edit Access)',
      username: 'member',
      password: 'member123',
      role: 'member',
      isGranted: true,
      desc: 'Can edit daily meals & daily bazar entries'
    },
    {
      id: '3',
      label: '🔒 Member (Read-Only Access)',
      username: 'viewer',
      password: 'viewer123',
      role: 'member',
      isGranted: false,
      desc: 'View dashboard & reports only (Access locked by Manager)'
    }
  ];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!username.trim() || !password) {
        throw new Error('Please enter username/email and password.');
      }

      // Perform API Login
      const userData = await loginUser(username.trim(), password);
      onLogin(userData);
    } catch (err) {
      // Fallback for Admin / Offline mode if server is initializing
      const lowerUser = username.trim().toLowerCase();
      if ((lowerUser === 'admin' || lowerUser === 'manager') && password === 'admin123') {
        onLogin({
          id: 'admin-001',
          username: 'admin',
          name: 'Main Manager (Admin)',
          role: 'admin',
          isGranted: true
        });
      } else {
        setError(err.message || 'Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!name.trim()) throw new Error('Full Name is required.');
      if (!email.trim() || !email.includes('@')) throw new Error('Valid Gmail / Email is required.');
      if (!password || password.length < 4) throw new Error('Password must be at least 4 characters.');

      const regData = await registerUser(name.trim(), email.trim(), password);
      setSuccess('Gmail Registration Successful! Automatically logged in with Edit access to Meals & Bazar.');
      setTimeout(() => {
        onLogin(regData);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (account) => {
    setUsername(account.username);
    setPassword(account.password);
    setIsRegisterMode(false);
    setError('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="login-header">
          <span className="logo-icon">🏠</span>
          <h1>Our Mess Portal</h1>
          <p>Mess Management Access & Role Control Portal</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
          <button
            type="button"
            className={\`btn \${!isRegisterMode ? 'btn-primary' : ''}\`}
            style={{ flex: 1, padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: 'none' }}
            onClick={() => { setIsRegisterMode(false); setError(''); setSuccess(''); }}
          >
            <LogIn size={15} style={{ marginRight: '6px' }} /> Account Log In
          </button>
          <button
            type="button"
            className={\`btn \${isRegisterMode ? 'btn-primary' : ''}\`}
            style={{ flex: 1, padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: 'none' }}
            onClick={() => { setIsRegisterMode(true); setError(''); setSuccess(''); }}
          >
            <UserPlus size={15} style={{ marginRight: '6px' }} /> General Member Gmail Register
          </button>
        </div>

        {error && (
          <div
            className="permission-banner"
            style={{
              background: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              borderColor: 'var(--danger-border)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px'
            }}
          >
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        {success && (
          <div
            className="permission-banner"
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              borderColor: '#10b981',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px'
            }}
          >
            <CheckCircle size={16} /> {success}
          </div>
        )}

        {!isRegisterMode ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Username / Registered Gmail</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter username (e.g. admin) or Gmail"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter password (e.g. admin123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              <LogIn size={18} /> {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        ) : (
          /* GENERAL MEMBER REGISTER FORM */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your full name (e.g. Wohid)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Gmail / Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Enter your Gmail (e.g. wohid@gmail.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Create Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Set your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }}
                />
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Registering with Gmail grants instant Edit Access to Daily Meals & Bazar.
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              <UserPlus size={18} /> {loading ? 'Registering...' : 'Register & Get Edit Access'}
            </button>
          </form>
        )}

        {/* DEMO ACCOUNTS INFOS */}
        <div className="demo-account-pills" style={{ marginTop: '24px' }}>
          <p>⚡ ACCOUNTS QUICK ACCESS & TEST CREDENTIALS</p>
          <div className="demo-buttons">
            {demoAccounts.map((acc) => (
              <button key={acc.id} type="button" className="demo-btn" onClick={() => handleDemoClick(acc)}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '700' }}>{acc.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{acc.desc}</div>
                </div>
                <LogIn size={16} style={{ color: 'var(--accent-primary)' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(loginPath, loginContent, 'utf8');
console.log('LoginPage.jsx updated successfully');
