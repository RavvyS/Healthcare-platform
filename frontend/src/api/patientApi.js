const BASE_URL = 'http://localhost:8086/api/patients';

export const getPatientProfile = async (patientId) => {
  const res = await fetch(`${BASE_URL}/${patientId}/profile`);
  if (!res.ok) throw new Error('Failed to fetch patient profile');
  return res.json();
};

export const updatePatientProfile = async (patientId, profile) => {
  const res = await fetch(`${BASE_URL}/${patientId}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to update patient profile');
  return res.json();
};

export const getPatientReports = async (patientId) => {
  const res = await fetch(`${BASE_URL}/${patientId}/reports`);
  if (!res.ok) throw new Error('Failed to fetch patient reports');
  return res.json();
};

export const addPatientReport = async (patientId, report) => {
  const res = await fetch(`${BASE_URL}/${patientId}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
  if (!res.ok) throw new Error('Failed to add patient report');
  return res.json();
};
