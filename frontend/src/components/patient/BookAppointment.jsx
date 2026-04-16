import { useState, useEffect } from 'react';
import { 
  FiCalendar, FiClock, FiUser, FiActivity, FiArrowRight, 
  FiFileText, FiMapPin, FiCheckCircle, FiVideo 
} from 'react-icons/fi';
import { initPayment, finalizePayment, getBookedSlots } from '../../api/appointmentApi';
import { sendNotification } from '../../api/notificationApi';
import { getDoctors } from '../../api/doctorApi';
import { MOCK_DOCTORS, TIME_SLOTS } from '../../data/mockData';

export default function BookAppointment({ patientId, onSuccess }) {
  const [form, setForm] = useState({
    doctorId: '', appointmentDate: '', slotTime: '', reason: '', consultationType: 'ONLINE'
  });
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [doctors, setDoctors] = useState([]); // Start empty to avoid collisions

  useEffect(() => {
    if (form.doctorId && form.appointmentDate) {
      getBookedSlots(form.doctorId, form.appointmentDate).then(setBookedSlots);
    } else {
      setBookedSlots([]);
    }
  }, [form.doctorId, form.appointmentDate]);

  useEffect(() => {
    getDoctors()
      .then((data) => {
        // Show all doctors who have completed their basic profile (name and specialization)
        const activeDoctors = data.filter((doctor) => doctor.name && doctor.specialization);
        setDoctors(activeDoctors.length ? activeDoctors : data);
      })
      .catch(() => setDoctors(MOCK_DOCTORS));
  }, []);

  const selectedDoctor = doctors.find(d => d.id === Number(form.doctorId));

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.doctorId || !form.appointmentDate || !form.slotTime) return;
    setLoading(true);
    try {
      const dateTime = new Date(form.appointmentDate + 'T' + form.slotTime.split(' ')[0]).toISOString();
      const fee = selectedDoctor ? (selectedDoctor.consultationFee || 1500) : 1500;
      
      const initData = await initPayment({
        patientId,
        doctorId: Number(form.doctorId),
        appointmentDate: dateTime,
        slotTime: form.slotTime,
        reason: form.reason,
        consultationType: form.consultationType,
        fee: fee
      });

      // Fetch secure hash from isolated payment-service
      const hashRes = await fetch('http://localhost:8084/api/payments/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: initData.orderId,
          amount: fee,
          currency: 'LKR'
        })
      });
      if (!hashRes.ok) throw new Error("Failed to contact payment service for secure token");
      const hashData = await hashRes.json();

      const payment = {
        "sandbox": true,
        "merchant_id": "1232121", 
        "return_url": "http://localhost:5173",
        "cancel_url": "http://localhost:5173",
        "notify_url": "http://localhost:8083/api/appointments/payment-webhook",
        "order_id": initData.orderId,
        "items": `Consultation with ${selectedDoctor?.name || 'Doctor'}`,
        "amount": fee.toFixed(2),
        "currency": "LKR",
        "hash": hashData.hash, 
        "first_name": "Patient",
        "last_name": "X",
        "email": "test@ravvycare.com",
        "phone": "0771234567",
        "address": "No 1, Galle Road",
        "city": "Colombo",
        "country": "Sri Lanka"
      };

      window.payhere.onCompleted = async function onCompleted(orderId) {
        setLoading(true);
        try {
            await finalizePayment(initData.appointmentId);
            await Promise.all([
              sendNotification({
                channel: 'EMAIL',
                recipientRole: 'PATIENT',
                recipientId: patientId,
                subject: 'Appointment confirmed',
                message: `Your appointment with ${selectedDoctor?.name || 'the doctor'} has been confirmed.`,
              }),
              sendNotification({
                channel: 'SMS',
                recipientRole: 'DOCTOR',
                recipientId: Number(form.doctorId),
                subject: 'New appointment booked',
                message: `A new ${form.consultationType.toLowerCase()} consultation was booked for ${form.appointmentDate}.`,
              }),
            ]);
            setForm({ doctorId: '', appointmentDate: '', slotTime: '', reason: '', consultationType: 'ONLINE' });
            onSuccess('Payment successful! Booking confirmed.', 'success');
        } catch (err) {
            onSuccess('Payment received, but error syncing status.', 'error');
        } finally {
            setLoading(false);
        }
      };

      window.payhere.onDismissed = function onDismissed() {
        setLoading(false);
        onSuccess('Payment cancelled.', 'warning');
      };

      window.payhere.onError = function onError(error) {
        setLoading(false);
        onSuccess('Payment error: ' + error, 'error');
      };

      window.payhere.startPayment(payment);

    } catch (err) {
      setLoading(false);
      const msg = err.message || 'Failed to initialize payment.';
      onSuccess(msg.includes('already booked') ? 'This slot was just booked by someone else!' : 'Failed to initialize payment', 'error');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-header-icon blue">
            <FiCalendar />
          </div>
          <div>
            <h3>Schedule a Consultation</h3>
            <p>Select your specialist and preferred time</p>
          </div>
        </div>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Doctor Select */}
            <div className="form-group">
              <label className="form-label"><FiUser /> Select Doctor</label>
              <select name="doctorId" value={form.doctorId} onChange={handleChange} required>
                <option value="">-- Choose a Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label"><FiCalendar /> Preferred Date</label>
              <input type="date" name="appointmentDate" value={form.appointmentDate}
                min={today} onChange={handleChange} required />
            </div>

            {/* Time Slot */}
            <div className="form-group">
              <label className="form-label"><FiClock /> Available Slots</label>
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

            {/* Consultation Type */}
            <div className="form-group">
              <label className="form-label"><FiActivity /> Visit Type</label>
              <select name="consultationType" value={form.consultationType} onChange={handleChange} required>
                <option value="ONLINE">🎥 Online Video Call</option>
                <option value="PHYSICAL">🏨 Physical Visit</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label"><FiFileText /> Symptoms / Reason for Visit</label>
            <textarea name="reason" value={form.reason} onChange={handleChange}
              placeholder="Briefly describe your medical concerns..." />
          </div>

          {/* Doctor Info Card */}
          {selectedDoctor && (
            <div className="doctor-preview">
              <div className="doctor-preview-avatar">
                {selectedDoctor.name.replace('Dr. ', '').charAt(0)}
              </div>
              <div className="doctor-preview-info">
                <h4>{selectedDoctor.name}</h4>
                <p>
                  Specialization: {selectedDoctor.specialization} · 
                  {form.consultationType === 'ONLINE' ? <><FiVideo /> Online</> : <><FiMapPin /> Clinic</>}
                </p>
              </div>
              <div className="fee-chip">
                 LKR {(selectedDoctor.consultationFee || 0).toLocaleString()}
              </div>
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <button className="btn btn-primary btn-lg btn-full shadow-colored" type="submit" disabled={loading}>
              {loading ? (
                <><div className="spinner" style={{ width: 14, height: 14, borderTopColor: 'white' }} /> Initializing Secure Payment...</>
              ) : (
                <><FiCheckCircle /> Confirm & Proceed to Payment <FiArrowRight /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
