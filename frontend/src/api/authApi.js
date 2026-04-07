const BASE_URL = 'http://localhost:8081/auth';

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
