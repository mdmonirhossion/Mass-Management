import React, { useEffect, useState } from 'react';
import { fetchMembers, addMember, deleteMember } from '../services/api';
import { UserPlus, Trash2, ShieldCheck, ShieldAlert, Key, CheckCircle, Lock } from 'lucide-react';

export default function Members({ user }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Persistent Granted Members Access state
  const [grantedAccessMap, setGrantedAccessMap] = useState(() => {
    try {
      const saved = localStorage.getItem('mess_granted_access');
      return saved ? JSON.parse(saved) : { 'Tanvir': true };
    } catch (e) {
      return { 'Tanvir': true };
    }
  });

  const isMainManager = user?.role === 'admin';

  const loadMembersList = () => {
    setLoading(true);
    fetchMembers()
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMembersList();
  }, []);

  const toggleAccess = (memberName) => {
    if (!isMainManager) {
      alert('Only the Main Manager can grant or revoke member access.');
      return;
    }
    const updatedMap = {
      ...grantedAccessMap,
      [memberName]: !grantedAccessMap[memberName]
    };
    setGrantedAccessMap(updatedMap);
    localStorage.setItem('mess_granted_access', JSON.stringify(updatedMap));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isMainManager) {
      alert('Access Restricted: Only the Main Manager can add new members.');
      return;
    }
    if (!name.trim()) {
      alert('Please enter member name.');
      return;
    }

    setSubmitting(true);
    try {
      await addMember(name.trim(), room.trim());
      setName('');
      setRoom('');
      loadMembersList();
    } catch (err) {
      alert('Failed to add member: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, memberName) => {
    if (!isMainManager) {
      alert('Access Restricted: Only the Main Manager can remove members.');
      return;
    }
    if (!window.confirm(`Remove ${memberName} from the mess?`)) return;
    try {
      await deleteMember(id);
      loadMembersList();
    } catch (err) {
      alert('Failed to delete member: ' + err.message);
    }
  };

  if (loading) return <div className="loading-spinner">Loading members list...</div>;

  return (
    <div>
      {/* Access Permission Banner if Regular User */}
      {!isMainManager && (
        <div className="permission-banner">
          <ShieldAlert size={20} />
          <div>
            <strong>Member View Mode:</strong> You are logged in as <span>{user?.name}</span> ({user?.isGranted ? 'Access Granted by Manager' : 'Read-Only Access'}). Main Manager controls access permissions.
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid-3">
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>👥 Total Members</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px' }}>{members.length}</h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>🔑 Granted Edit Access</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px', color: '#3b82f6' }}>
            {members.filter((m) => grantedAccessMap[m.name]).length + 1}
          </h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>👑 Main Manager</p>
          <h2 style={{ fontSize: '20px', marginTop: '4px', color: '#10b981' }}>Active Manager</h2>
        </div>
      </div>

      {/* Add Member Form (Manager Only) */}
      {isMainManager ? (
        <section className="card" style={{ marginBottom: '32px' }}>
          <div className="section-header">
            <div>
              <h2>Add New Member</h2>
              <p>Enter member details to join the mess</p>
            </div>
          </div>

          <form onSubmit={handleAdd}>
            <div className="form-grid">
              <div className="form-group">
                <label>Member Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter member name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Room / ID</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Example: Room 101"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                  <UserPlus size={18} />
                  {submitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </div>
          </form>
        </section>
      ) : (
        <div className="card" style={{ marginBottom: '32px', background: 'var(--table-header-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
            <Lock size={20} />
            <span>Adding/Removing members is restricted to the <strong>Main Manager</strong>.</span>
          </div>
        </div>
      )}

      {/* Members Directory & Access Control Table */}
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Member Directory & Access Rights</h2>
            <p>Main Manager can grant or revoke task execution rights to members</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Member Name</th>
                <th>Room / ID</th>
                <th>System Role</th>
                <th>Access Permission</th>
                {isMainManager && <th>Manager Action</th>}
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member, idx) => {
                  const hasAccess = !!grantedAccessMap[member.name];
                  return (
                    <tr key={member._id}>
                      <td>{idx + 1}</td>
                      <td><strong>{member.name}</strong></td>
                      <td>{member.room || 'Not Assigned'}</td>
                      <td>
                        <span className="badge badge-receive">Member</span>
                      </td>
                      <td>
                        {hasAccess ? (
                          <span className="badge badge-granted">
                            <CheckCircle size={12} /> Granted (Can Edit)
                          </span>
                        ) : (
                          <span className="badge badge-restricted">
                            <Lock size={12} /> Read-Only
                          </span>
                        )}
                      </td>
                      {isMainManager && (
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className={`btn ${hasAccess ? 'btn-secondary' : 'btn-success'}`}
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => toggleAccess(member.name)}
                            >
                              <Key size={14} />
                              {hasAccess ? 'Revoke Access' : 'Grant Access'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => handleDelete(member._id, member.name)}
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isMainManager ? 6 : 5} className="empty-state">
                    No members added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
