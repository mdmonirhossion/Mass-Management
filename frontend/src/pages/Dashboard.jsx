import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { ShoppingBag, UtensilsCrossed, TrendingUp, Users } from 'lucide-react';
import { fetchSummary } from '../services/api';

export default function Dashboard({ currentMonth, setCurrentPage }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchSummary(currentMonth)
      .then((data) => {
        if (isMounted) {
          setSummary(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [currentMonth]);

  if (loading) return <div className="loading-spinner">Loading dashboard data...</div>;

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid-4">
        <StatCard
          title="Total Bazar"
          value={`৳${summary?.totalBazar?.toLocaleString() || 0}`}
          icon={ShoppingBag}
          color="amber"
        />
        <StatCard
          title="Total Meal"
          value={summary?.totalMeal || 0}
          icon={UtensilsCrossed}
          color="emerald"
        />
        <StatCard
          title="Meal Rate"
          value={`৳${summary?.mealRate?.toFixed(2) || '0.00'}`}
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Members"
          value={summary?.totalMembers || 0}
          icon={Users}
          color="blue"
        />
      </div>

      {/* Member Summary */}
      <section className="card" style={{ marginBottom: '32px' }}>
        <div className="section-header">
          <div>
            <h2>Member Summary</h2>
            <p>Current month's meal and bazar information</p>
          </div>
          <button className="btn btn-primary" onClick={() => setCurrentPage('daily-meal')}>
            + Add Entry
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Member</th>
                <th>Total Meal</th>
                <th>Bazar Paid</th>
                <th>Meal Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {summary?.memberSummaries?.map((member, idx) => (
                <tr key={member.id}>
                  <td>{idx + 1}</td>
                  <td><strong>{member.name}</strong></td>
                  <td>{member.totalMeal}</td>
                  <td>৳{member.bazarPaid?.toLocaleString()}</td>
                  <td>৳{member.mealCost?.toLocaleString()}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid-2">
        {/* Recent Bazar */}
        <section className="card">
          <div className="section-header">
            <div>
              <h2>Recent Bazar</h2>
              <p>Latest bazar entries</p>
            </div>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('bazar')}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {summary?.recentBazar?.length > 0 ? (
              summary.recentBazar.map((item) => (
                <div key={item._id} className="list-item-row">
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </strong>
                    <p style={{ fontWeight: '600', marginTop: '2px', color: 'var(--text-primary)' }}>{item.items}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>৳{item.amount?.toLocaleString()}</strong>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.member}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No bazar entries yet.</p>
            )}
          </div>
        </section>

        {/* Monthly Bills */}
        <section className="card">
          <div className="section-header">
            <div>
              <h2>Monthly Bills</h2>
              <p>Per person split</p>
            </div>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('monthly-bills')}>
              Edit Bills
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {summary?.monthlyBills?.length > 0 ? (
              summary.monthlyBills.map((bill) => (
                <div key={bill._id} className="list-item-row">
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{bill.name}</span>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    ৳
                    {summary?.totalMembers > 0
                      ? Math.round(bill.amount / summary.totalMembers).toLocaleString()
                      : 0}
                  </strong>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No monthly bills added.</p>
            )}

            <div className="total-person-row">
              <span>Total / Person</span>
              <span>৳{summary?.billPerPerson?.toLocaleString() || 0}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
