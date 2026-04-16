const BASE_URL = 'http://localhost:8083/api/appointments';
const DOCTOR_SERVICE_URL = 'http://localhost:8082';

export const initPayment = async (data) => {
  const res = await fetch(`${BASE_URL}/init-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to init payment');
  }
  return res.json();
};

export const finalizePayment = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/finalize-payment`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to finalize payment');
};

export const getBookedSlots = async (doctorId, date) => {
  if (!doctorId || !date) return [];
  const res = await fetch(`${BASE_URL}/doctor/${doctorId}/booked-slots?date=${date}`);
  if (!res.ok) return [];
  return res.json();
};

export const createTelemedicineSession = async (appointmentId) => {
  const res = await fetch(`http://localhost:8085/api/telemedicine/create-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appointmentId })
  });
  if (!res.ok) throw new Error('Failed to generate conference link');
  return res.json();
};

export const getPatientAppointments = async (patientId) => {
  const res = await fetch(`${BASE_URL}/patient/${patientId}`);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
};

export const getDoctorAppointments = async (doctorId) => {
  // Redirected to standalone Doctor Service
  const res = await fetch(`${DOCTOR_SERVICE_URL}/doctors/${doctorId}/appointments`);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
};

export const updateAppointmentStatus = async (id, status) => {
  // Mapping UI 'CONFIRMED' to Backend 'ACCEPTED' for assignment compliance
  const backendStatus = status === 'CONFIRMED' ? 'ACCEPTED' : status;
  
  // Redirected to standalone Doctor Service
  const res = await fetch(`${DOCTOR_SERVICE_URL}/appointments/${id}/status?status=${backendStatus}`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
};

export const cancelAppointment = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/cancel`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to cancel appointment');
};
