import { useState, useEffect } from 'react';
import { bookAppointment, getBookedSlots } from '../../api/appointmentApi';
import { MOCK_DOCTORS, TIME_SLOTS } from '../../data/mockData';

export default function BookAppointment({ patientId, onSuccess }) {
  const [form, setForm] = useState({
    doctorId: '', appointmentDate: '', slotTime: '', reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    if (form.doctorId && form.appointmentDate) {
      getBookedSlots(form.doctorId, form.appointmentDate).then(setBookedSlots);
    } else {
      setBookedSlots([]);
    }
  }, [form.doctorId, form.appointmentDate]);

  const selectedDoctor = MOCK_DOCTORS.find(d => d.id === Number(form.doctorId));

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.doctorId || !form.appointmentDate || !form.slotTime) return;
    setLoading(true);
    try {
      // Combine date + slot into ISO datetime
      const dateTime = new Date(form.appointmentDate + 'T' + form.slotTime.split(' ')[0]).toISOString();
      await bookAppointment({
        patientId,
        doctorId: Number(form.doctorId),
        appointmentDate: dateTime,
        slotTime: form.slotTime,
        reason: form.reason,
      });
      setForm({ doctorId: '', appointmentDate: '', slotTime: '', reason: '' });
      onSuccess('Appointment booked successfully! Status: PENDING');
    } catch (err) {
      const msg = err.message || 'Failed to book appointment.';
      onSuccess(msg.includes('already booked') ? 'This slot was just booked by someone else!' : 'Failed to book appointment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card">
      <div className="card-title">📅 Book a New Appointment</div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Doctor Select */}
          <div className="form-group">
            <label>Select Doctor</label>
            <select name="doctorId" value={form.doctorId} onChange={handleChange} required>
              <option value="">-- Choose a Doctor --</option>
              {MOCK_DOCTORS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Appointment Date</label>
            <input type="date" name="appointmentDate" value={form.appointmentDate}
              min={today} onChange={handleChange} required />
          </div>

          {/* Time Slot */}
          <div className="form-group">
            <label>Time Slot</label>
            <select name="slotTime" value={form.slotTime} onChange={handleChange} required disabled={!form.appointmentDate || !form.doctorId}>
              <option value="">-- Choose a Time Slot --</option>
              {TIME_SLOTS.map(s => {
                const isBooked = bookedSlots.includes(s);
                return (
                  <option key={s} value={s} disabled={isBooked}>
                    {s} {isBooked ? '(Booked)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Fee Preview */}
          <div className="form-group">
            <label>Consultation Fee</label>
            <input
              readOnly
              value={selectedDoctor ? `Rs. ${selectedDoctor.fee.toLocaleString()}` : 'Select a doctor'}
              style={{ cursor: 'default', color: selectedDoctor ? '#10b981' : undefined }}
            />
          </div>
        </div>

        {/* Reason */}
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Reason / Symptoms</label>
          <textarea name="reason" value={form.reason} onChange={handleChange}
            placeholder="Describe your symptoms or reason for visit..." />
        </div>

        {selectedDoctor && (
          <div style={{
            marginTop: 16, padding: '12px 16px',
            background: 'rgba(59,130,246,0.08)', borderRadius: 8,
            border: '1px solid rgba(59,130,246,0.2)',
            fontSize: '0.85rem', color: '#94a3b8'
          }}>
            🩺 <strong style={{ color: '#f1f5f9' }}>{selectedDoctor.name}</strong> ·{' '}
            {selectedDoctor.specialization} · Fee: <strong style={{ color: '#10b981' }}>
              Rs. {selectedDoctor.fee.toLocaleString()}
            </strong>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Booking...</> : '📋 Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
