const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers||{}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:res.statusText}));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}
