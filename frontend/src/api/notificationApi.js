const BASE_URL = 'http://localhost:8088/api/notifications';

export const sendNotification = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to send notification');
    return res.json();
  } catch {
    return null;
  }
};

export const getNotifications = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
};
