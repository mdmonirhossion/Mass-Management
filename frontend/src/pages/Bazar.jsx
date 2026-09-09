import React, { useEffect, useState } from 'react';
import { fetchBazar, fetchMembers, addBazar, deleteBazar, updateBazar } from '../services/api';
import { Plus, Trash2, Edit2, Lock } from 'lucide-react';

export default function Bazar({ currentMonth, user }) {
  const [bazarList, setBazarList] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const canEdit = user?.role === 'admin' || user?.isGranted;

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [member, setMember] = useState('');
  const [items, setItems] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchBazar(currentMonth), fetchMembers()])
      .then(([bazarData, membersData]) => {
        setBazarList(bazarData);
        setMembers(membersData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert('Access Restricted: Main Manager has not granted you edit permissions.');
      return;
    }
    if (!date || !member || !items.trim() || !amount || Number(amount) <= 0) {
      alert('Please fill out all fields with valid information.');
      return;
    }

    setSubmitting(true);
    try {
      await addBazar({
        date,
        member,
        items: items.trim(),
        amount: Number(amount),
        month: currentMonth
      });
      setItems('');
      setAmount('');
      loadData();
    } catch (err) {
      alert('Failed to add bazar entry: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canEdit) {
      alert('Access Restricted: Main Manager has not granted you edit permissions.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await deleteBazar(id);
      loadData();
    } catch (err) {
      alert('Failed to delete bazar entry');
    }
  };

  const handleEdit = async (item) => {
    if (!canEdit) {
      alert('Access Restricted: Main Manager has not granted you edit permissions.');
      return;
    }
    const newItems = prompt('Update items:', item.items);
    if (newItems === null || !newItems.trim()) return;

    const newAmount = prompt('Update amount (৳):', item.amount);
    if (newAmount === null || isNaN(newAmount) || Number(newAmount) <= 0) return;

    try {
      await updateBazar(item._id, newItems.trim(), Number(newAmount));
      loadData();
    } catch (err) {
      alert('Error updating: ' + err.message);
    }
  };

  const totalAmount = bazarList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  if (loading) return <div className="loading-spinner">Loading bazar details...</div>;

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid-2">
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>🛒 Total Bazar Expense</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px' }}>৳{totalAmount.toLocaleString()}</h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>📋 Total Entries</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px' }}>{bazarList.length}</h2>
        </div>
      </div>

      {/* Add Bazar Entry Form */}
      <section className="card" style={{ marginBottom: '32px' }}>
        <div className="section-header">
          <div>
            <h2>Add Bazar Entry</h2>
            <p>Enter today's bazar information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Purchased By</label>
              <select
                className="select-field"
                value={member}
                onChange={(e) => setMember(e.target.value)}
                required
              >
                <option value="">Select Member</option>
                {members.map((m) => (
                  <option key={m._id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Items Description</label>
              <textarea
                className="textarea-field"
                rows={2}
                placeholder="Example: Rice, Chicken, Vegetables, Oil"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Amount (৳)</label>
              <input
                type="number"
                min="1"
                className="input-field"
                placeholder="Enter total amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                <Plus size={18} />
                {submitting ? 'Adding...' : 'Add Bazar'}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Bazar Table */}
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Recent Bazar Entries</h2>
            <p>List of all bazar purchases for {currentMonth}</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Purchased By</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bazarList.length > 0 ? (
                bazarList.map((entry, idx) => (
                  <tr key={entry._id}>
                    <td>{idx + 1}</td>
                    <td>
                      {new Date(entry.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td><strong>{entry.member}</strong></td>
                    <td>{entry.items}</td>
                    <td><strong>৳{Number(entry.amount).toLocaleString()}</strong></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 10px' }} onClick={() => handleEdit(entry)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(entry._id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No bazar entries found for this month.
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
