import React, { useEffect, useState } from 'react';
import { fetchMembers, fetchMeals, saveMeals } from '../services/api';
import { Save, Lock } from 'lucide-react';

export default function DailyMeal({ currentMonth, user }) {
  const [members, setMembers] = useState([]);
  const [mealData, setMealData] = useState({});
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const canEdit = user?.role === 'admin' || user?.isGranted;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([fetchMembers(), fetchMeals(currentMonth, mealDate)])
      .then(([membersList, mealsList]) => {
        if (!isMounted) return;
        setMembers(membersList);
        const map = {};
        mealsList.forEach((m) => {
          map[m.member] = {
            breakfast: m.breakfast !== undefined && m.breakfast !== null ? m.breakfast : '',
            lunch: m.lunch !== undefined && m.lunch !== null ? m.lunch : '',
            dinner: m.dinner !== undefined && m.dinner !== null ? m.dinner : ''
          };
        });
        setMealData(map);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [currentMonth, mealDate]);

  const handleInputChange = (memberName, field, value) => {
    if (!canEdit) return;
    setMealData((prev) => ({
      ...prev,
      [memberName]: {
        breakfast: '',
        lunch: '',
        dinner: '',
        ...prev[memberName],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!canEdit) {
      alert('Access Restricted: Main Manager has not granted you edit permissions.');
      return;
    }
    setSaving(true);
    try {
      const mealsArray = members.map((m) => ({
        member: m.name,
        breakfast: parseFloat(mealData[m.name]?.breakfast) || 0,
        lunch: parseFloat(mealData[m.name]?.lunch) || 0,
        dinner: parseFloat(mealData[m.name]?.dinner) || 0
      }));

      await saveMeals(currentMonth, mealsArray, mealDate);
      alert(`Meals saved successfully for ${mealDate}!`);
    } catch (err) {
      alert('Failed to save meals: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Daily totals calculation
  let totalBreakfast = 0;
  let totalLunch = 0;
  let totalDinner = 0;

  members.forEach((m) => {
    totalBreakfast += parseFloat(mealData[m.name]?.breakfast) || 0;
    totalLunch += parseFloat(mealData[m.name]?.lunch) || 0;
    totalDinner += parseFloat(mealData[m.name]?.dinner) || 0;
  });

  totalBreakfast = Number(totalBreakfast.toFixed(2));
  totalLunch = Number(totalLunch.toFixed(2));
  totalDinner = Number(totalDinner.toFixed(2));

  if (loading) return <div className="loading-spinner">Loading meal details...</div>;

  return (
    <div>
      {!canEdit && (
        <div className="permission-banner">
          <Lock size={18} />
          <div>
            <strong>Read-Only Mode:</strong> Editing meals is locked because the Main Manager has not granted access to your account.
          </div>
        </div>
      )}

      {/* Date & Action Controls */}
      <section className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0, minWidth: '220px' }}>
            <label>Select Date</label>
            <input
              type="date"
              className="input-field"
              value={mealDate}
              onChange={(e) => setMealDate(e.target.value)}
            />
          </div>

          <button
            className={`btn ${canEdit ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleSave}
            disabled={saving || !canEdit}
          >
            <Save size={18} />
            {saving ? 'Saving...' : canEdit ? 'Save Meal Data' : 'Locked (Read-Only)'}
          </button>
        </div>
      </section>

      {/* Summary Cards */}
      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>🍚 Breakfast Total</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px' }}>{totalBreakfast}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>🍛 Lunch Total</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px' }}>{totalLunch}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>🍽️ Dinner Total</p>
          <h2 style={{ fontSize: '28px', marginTop: '4px' }}>{totalDinner}</h2>
        </div>
      </div>

      {/* Meal Entry Table */}
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Member Meal Entry ({mealDate})</h2>
            <p>Enter meal count for each member (Supports fractions e.g. 0.5, 1.05)</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Member</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
                <th>Total Meal</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, idx) => {
                const bVal = mealData[member.name]?.breakfast !== undefined ? mealData[member.name]?.breakfast : '';
                const lVal = mealData[member.name]?.lunch !== undefined ? mealData[member.name]?.lunch : '';
                const dVal = mealData[member.name]?.dinner !== undefined ? mealData[member.name]?.dinner : '';

                const bNum = parseFloat(bVal) || 0;
                const lNum = parseFloat(lVal) || 0;
                const dNum = parseFloat(dVal) || 0;
                const rowTotal = Number((bNum + lNum + dNum).toFixed(2));

                return (
                  <tr key={member._id}>
                    <td>{idx + 1}</td>
                    <td><strong>{member.name}</strong></td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        className="input-field"
                        style={{ width: '90px', textAlign: 'center' }}
                        value={bVal}
                        disabled={!canEdit}
                        onChange={(e) => handleInputChange(member.name, 'breakfast', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        className="input-field"
                        style={{ width: '90px', textAlign: 'center' }}
                        value={lVal}
                        disabled={!canEdit}
                        onChange={(e) => handleInputChange(member.name, 'lunch', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        className="input-field"
                        style={{ width: '90px', textAlign: 'center' }}
                        value={dVal}
                        disabled={!canEdit}
                        onChange={(e) => handleInputChange(member.name, 'dinner', e.target.value)}
                      />
                    </td>
                    <td>
                      <strong>{rowTotal}</strong>
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
