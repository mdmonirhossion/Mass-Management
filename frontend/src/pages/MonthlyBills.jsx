import React, { useEffect, useState } from 'react';
import { fetchBills, fetchMembers, addBill, deleteBill, updateBill } from '../services/api';
import { Plus, Trash2, Edit2, Lock } from 'lucide-react';

export default function MonthlyBills({ currentMonth, user }) {
  const [bills, setBills] = useState([]);
  const [membersCount, setMembersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const canEdit = user?.role === 'admin' || user?.isGranted;

  // Form
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchBills(currentMonth), fetchMembers()])
      .then(([billsData, membersData]) => {
        setBills(billsData);
        setMembersCount(membersData.length);
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
    if (!name.trim() || !amount || Number(amount) <= 0) {
      alert('Please enter a valid bill name and amount.');
      return;
    }

    setSubmitting(true);
    try {
      await addBill(name.trim(), Number(amount), currentMonth);
      setName('');
      setAmount('');
      loadData();
    } catch (err) {
      alert('Failed to add bill: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canEdit) {
      alert('Access Restricted: Main Manager has not granted you edit permissions.');
      return;
    }
    if (!window.confirm('Delete this monthly bill?')) return;
    try {
      await deleteBill(id);
      loadData();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleEdit = async (bill) => {
    if (!canEdit) {
      alert('Access Restricted: Main Manager has not granted you edit permissions.');
      return;
    }
    const newAmount = prompt(`Enter new amount for ${bill.name} (৳):`, bill.amount);
    if (newAmount === null || isNaN(newAmount) || Number(newAmount) <= 0) return;

    try {
      await updateBill(bill._id, Number(newAmount));
      loadData();
    } catch (err) {
      alert('Error updating: ' + err.message);
    }
  };

  const totalBills = bills.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const perPerson = membersCount > 0 ? Math.round(totalBills / membersCount) : 0;

  if (loading) return <div className="loading-spinner">Loading monthly bills...</div>;

  return (
    <div>
      {!canEdit && (
        <div className="permission-banner">
          <Lock size={18} />
          <div>
            <strong>Read-Only Mode:</strong> Adding or editing monthly bills is restricted until granted by the Main Manager.
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid-2">
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>🧾 Total Monthly Bills</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px' }}>৳{totalBills.toLocaleString()}</h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>👤 Bill Per Person ({membersCount} Members)</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px', color: 'var(--accent-primary)' }}>
            ৳{perPerson.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Add Bill Form */}
      <section className="card" style={{ marginBottom: '32px' }}>
        <div className="section-header">
          <div>
            <h2>Add Monthly Expense</h2>
            <p>Enter a fixed monthly mess expense (Electricity, Water, Cook, Wifi)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Bill Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Example: Cook Bill"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Amount (৳)</label>
              <input
                type="number"
                min="1"
                className="input-field"
                placeholder="Enter bill amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                <Plus size={18} />
                {submitting ? 'Adding...' : 'Add Bill'}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Bill List */}
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Monthly Expenses List</h2>
            <p>Breakdown for {currentMonth}</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Bill Name</th>
                <th>Total Amount</th>
                <th>Per Person</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.length > 0 ? (
                bills.map((bill, idx) => {
                  const billPerPerson = membersCount > 0 ? Math.round(bill.amount / membersCount) : 0;
                  return (
                    <tr key={bill._id}>
                      <td>{idx + 1}</td>
                      <td><strong>{bill.name}</strong></td>
                      <td><strong>৳{Number(bill.amount).toLocaleString()}</strong></td>
                      <td>৳{billPerPerson.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-secondary" style={{ padding: '6px 10px' }} onClick={() => handleEdit(bill)}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(bill._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="empty-state">
                    No monthly bills added yet.
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
