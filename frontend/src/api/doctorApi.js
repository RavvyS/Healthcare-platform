const BASE_URL = 'http://localhost:8082';

export const getDoctors = async (specialization = '') => {
  const url = specialization ? `${BASE_URL}/doctors?specialization=${encodeURIComponent(specialization)}` : `${BASE_URL}/doctors`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return res.json();
};

export const updateDoctorVerification = async (doctorId, verified) => {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}/verification?verified=${verified}`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to update doctor verification');
  return res.json();
};

export const getPatientPrescriptions = async (patientId) => {
  const res = await fetch(`${BASE_URL}/prescriptions/${patientId}`);
  if (!res.ok) throw new Error('Failed to fetch prescriptions');
  return res.json();
};

export const getDoctorById = async (doctorId) => {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}`);
  if (!res.ok) throw new Error('Failed to fetch doctor profile');
  return res.json();
};

export const updateDoctorProfile = async (doctorId, payload) => {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update doctor profile');
  return res.json();
};

export const getDoctorAvailability = async (doctorId) => {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}/availability`);
  if (!res.ok) throw new Error('Failed to fetch doctor availability');
  return res.json();
};

export const addDoctorAvailability = async (doctorId, payload) => {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}/availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add doctor availability');
  return res.json();
};

export const removeDoctorAvailability = async (availabilityId) => {
  const res = await fetch(`${BASE_URL}/availability/${availabilityId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove doctor availability');
};

export const getPatientInfo = async (patientId) => {
  const res = await fetch(`${BASE_URL}/patients/${patientId}`);
  if (!res.ok) throw new Error('Failed to fetch patient profile');
  return res.json();
};

export const issuePrescription = async (appointmentId, payload) => {
  const res = await fetch(`${BASE_URL}/prescriptions?appointmentId=${appointmentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to issue prescription');
  return res.json();
};
