const API_BASE = '/api';

export async function loginUser(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
}

export async function registerUser(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
}

export async function fetchSummary(month) {
    const res = await fetch(`${API_BASE}/summary?month=${encodeURIComponent(month)}`);
    if (!res.ok) throw new Error('Failed to fetch summary data');
    return res.json();
}

export async function fetchMembers() {
    const res = await fetch(`${API_BASE}/members`);
    if (!res.ok) throw new Error('Failed to fetch members');
    return res.json();
}

export async function addMember(name, room) {
    const res = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, room })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add member');
    return data;
}

export async function deleteMember(id) {
    const res = await fetch(`${API_BASE}/members/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete member');
    return res.json();
}

export async function fetchMeals(month) {
    const res = await fetch(`${API_BASE}/meals?month=${encodeURIComponent(month)}`);
    if (!res.ok) throw new Error('Failed to fetch meals');
    return res.json();
}

export async function saveMeals(month, meals, date) {
    const res = await fetch(`${API_BASE}/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, meals, date })
    });
    if (!res.ok) throw new Error('Failed to save meals');
    return res.json();
}

export async function fetchBazar(month) {
    const res = await fetch(`${API_BASE}/bazar?month=${encodeURIComponent(month)}`);
    if (!res.ok) throw new Error('Failed to fetch bazar data');
    return res.json();
}

export async function addBazar(entry) {
    const res = await fetch(`${API_BASE}/bazar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add bazar entry');
    return data;
}

export async function updateBazar(id, items, amount) {
    const res = await fetch(`${API_BASE}/bazar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, amount })
    });
    if (!res.ok) throw new Error('Failed to update bazar entry');
    return res.json();
}

export async function deleteBazar(id) {
    const res = await fetch(`${API_BASE}/bazar/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete bazar entry');
    return res.json();
}

export async function fetchBills(month) {
    const res = await fetch(`${API_BASE}/bills?month=${encodeURIComponent(month)}`);
    if (!res.ok) throw new Error('Failed to fetch bills');
    return res.json();
}

export async function addBill(name, amount, month) {
    const res = await fetch(`${API_BASE}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount, month })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add bill');
    return data;
}

export async function updateBill(id, amount) {
    const res = await fetch(`${API_BASE}/bills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    });
    if (!res.ok) throw new Error('Failed to update bill');
    return res.json();
}

export async function deleteBill(id) {
    const res = await fetch(`${API_BASE}/bills/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete bill');
    return res.json();
}

export async function settleMember(member, month) {
    const res = await fetch(`${API_BASE}/settlements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member, month })
    });
    if (!res.ok) throw new Error('Failed to settle member');
    return res.json();
}
