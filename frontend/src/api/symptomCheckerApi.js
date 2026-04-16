const BASE_URL = 'http://localhost:8087/api/symptom-checker';

export const analyzeSymptoms = async (payload) => {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to analyze symptoms');
  return res.json();
};
