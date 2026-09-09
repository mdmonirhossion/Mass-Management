import React, { useEffect, useState } from 'react';
import { fetchSummary, settleMember } from '../services/api';
import { CheckCircle2 } from 'lucide-react';

export default function Settlement({ currentMonth }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    fetchSummary(currentMonth)
      .then((data) => {
        setSummary(data);
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

  const handleSettle = async (memberName) => {
    if (!window.confirm(`Mark settlement complete for ${memberName}?`)) return;
    try {
      await settleMember(memberName, currentMonth);
      loadData();
    } catch (err) {
      alert('Failed to settle member: ' + err.message);
    }
  };

  if (loading) return <div className="loading-spinner">Loading settlement summary...</div>;

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid-3">
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>💰 Total Payable</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px', color: '#991b1b' }}>
            ৳{summary?.totalPayable?.toLocaleString() || 0}
          </h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>📥 Total Receivable</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px', color: '#166534' }}>
            ৳{summary?.totalReceivable?.toLocaleString() || 0}
          </h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>👥 Active Members</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px' }}>{summary?.totalMembers || 0}</h2>
        </div>
      </div>

      {/* Settlement Table */}
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Member Settlement Breakdown</h2>
            <p>Calculated meal cost vs. actual bazar payments for {currentMonth}</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Member</th>
                <th>Bazar Paid</th>
                <th>Meal Cost</th>
                <th>Difference</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {summary?.memberSummaries?.map((member, idx) => {
                const diffAbs = Math.abs(member.balance);
                return (
                  <tr
                    key={member.id}
                    style={{ opacity: member.isSettled ? 0.65 : 1 }}
                  >
                    <td>{idx + 1}</td>
                    <td><strong>{member.name}</strong></td>
                    <td>৳{member.bazarPaid?.toLocaleString()}</td>
                    <td>৳{member.mealCost?.toLocaleString()}</td>
                    <td><strong>৳{diffAbs.toLocaleString()}</strong></td>
                    <td>
                      <span
                        className={`badge ${
                          member.status === 'Receive'
                            ? 'badge-receive'
                            : member.status === 'Pay'
                            ? 'badge-pay'
                            : 'badge-settled'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td>
                      {member.isSettled ? (
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={16} color="#10b981" /> Settled
                        </span>
                      ) : (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleSettle(member.name)}
                        >
                          Settle
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
