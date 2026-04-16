const BASE_URL = 'http://localhost:8081/auth';

export const login = async (credentials) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Login failed. Please check your credentials.');
  return res.json();
};

export const register = async (userData) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.message || 'Registration failed.');
  return data;
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Failed to send reset link.');
  return true;
};

export const resetPassword = async (token, newPassword) => {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  if (!res.ok) throw new Error('Failed to reset password.');
  return true;
};
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const getUserStats = async () => {
  const res = await fetch(`${BASE_URL}/users/stats`);
  if (!res.ok) throw new Error('Failed to fetch user stats');
  return res.json();
};

export const updateUserStatus = async (id, accountStatus) => {
  const res = await fetch(`${BASE_URL}/users/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountStatus }),
  });
  if (!res.ok) throw new Error('Failed to update user status');
  return res.json();
};
