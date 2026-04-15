import axios from 'axios';

// Base URL for Patient Service
// Simulated patientId — replace with JWT-decoded value in production
export const PATIENT_ID = '42';

const BASE_URL = 'http://localhost:8080/api/patients';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Profile ──────────────────────────────────────────────────────────
export const getProfile = async (patientId) => {
  const { data } = await client.get(`/${patientId}/profile`);
  return data;
};

export const updateProfile = async (patientId, profileData) => {
  const { data } = await client.put(`/${patientId}/profile`, profileData);
  return data;
};

// ── Legacy aliases (used by existing PatientRecords / PatientDashboard) ──
export const getPatientProfile = getProfile;
export const updatePatientProfile = updateProfile;

// ── Reports ───────────────────────────────────────────────────────────
export const getReports = async (patientId) => {
  const { data } = await client.get(`/${patientId}/reports`);
  return data;
};

export const addReport = async (patientId, reportData) => {
  const { data } = await client.post(`/${patientId}/reports`, reportData);
  return data;
};

// ── Legacy aliases (used by existing PatientRecords / PatientDashboard) ──
export const getPatientReports = getReports;
export const addPatientReport = addReport;
