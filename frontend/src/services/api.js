const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : '/api';

async function parseResponse(res, fallbackMessage) {
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
        if (contentType.includes('application/json')) {
            const data = await res.json();
            throw new Error(data.message || fallbackMessage);
        } else {
            throw new Error(`Backend Connection Error (${res.status}): Make sure backend Vercel URL is set in VITE_API_BASE_URL.`);
        }
    }
    if (contentType.includes('application/json')) {
        return res.json();
    }
    return {};
}

export async function loginUser(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return parseResponse(res, 'Login failed');
}

export async function registerUser(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    return parseResponse(res, 'Registration failed');
}

export async function fetchSummary(month) {
    const res = await fetch(`${API_BASE}/summary?month=${encodeURIComponent(month)}`);
    return parseResponse(res, 'Failed to fetch summary data');
}

export async function fetchMembers() {
    const res = await fetch(`${API_BASE}/members`);
    return parseResponse(res, 'Failed to fetch members');
}

export async function addMember(name, room) {
    const res = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, room })
    });
    return parseResponse(res, 'Failed to add member');
}

export async function deleteMember(id) {
    const res = await fetch(`${API_BASE}/members/${id}`, { method: 'DELETE' });
    return parseResponse(res, 'Failed to delete member');
}

export async function fetchMeals(month, date) {
    let url = `${API_BASE}/meals?month=${encodeURIComponent(month)}`;
    if (date) url += `&date=${encodeURIComponent(date)}`;
    const res = await fetch(url);
    return parseResponse(res, 'Failed to fetch meals');
}

export async function saveMeals(month, meals, date) {
    const res = await fetch(`${API_BASE}/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, meals, date })
    });
    return parseResponse(res, 'Failed to save meals');
}

export async function fetchBazar(month) {
    const res = await fetch(`${API_BASE}/bazar?month=${encodeURIComponent(month)}`);
    return parseResponse(res, 'Failed to fetch bazar data');
}

export async function addBazar(entry) {
    const res = await fetch(`${API_BASE}/bazar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    });
    return parseResponse(res, 'Failed to add bazar entry');
}

export async function updateBazar(id, items, amount) {
    const res = await fetch(`${API_BASE}/bazar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, amount })
    });
    return parseResponse(res, 'Failed to update bazar entry');
}

export async function deleteBazar(id) {
    const res = await fetch(`${API_BASE}/bazar/${id}`, { method: 'DELETE' });
    return parseResponse(res, 'Failed to delete bazar entry');
}

export async function fetchBills(month) {
    const res = await fetch(`${API_BASE}/bills?month=${encodeURIComponent(month)}`);
    return parseResponse(res, 'Failed to fetch bills');
}

export async function addBill(name, amount, month) {
    const res = await fetch(`${API_BASE}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount, month })
    });
    return parseResponse(res, 'Failed to add bill');
}

export async function updateBill(id, amount) {
    const res = await fetch(`${API_BASE}/bills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    });
    return parseResponse(res, 'Failed to update bill');
}

export async function deleteBill(id) {
    const res = await fetch(`${API_BASE}/bills/${id}`, { method: 'DELETE' });
    return parseResponse(res, 'Failed to delete bill');
}

export async function settleMember(member, month) {
    const res = await fetch(`${API_BASE}/settlements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member, month })
    });
    return parseResponse(res, 'Failed to settle member');
}
