import { useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { addDoctorAvailability, getDoctorAvailability, removeDoctorAvailability } from '../../api/doctorApi';
import { EmptyState, Loading } from '../common/UI';

const initialSlot = {
  date: new Date().toISOString().split('T')[0],
  startTime: '',
  endTime: '',
};

export default function DoctorAvailability({ doctorId, onSuccess }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialSlot);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getDoctorAvailability(doctorId);
        setSlots(data);
      } catch {
        onSuccess('Failed to load doctor availability', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [doctorId, onSuccess]);

  const validateTimes = () => {
    const now = new Date();
    const currentTimeStr = now.toTimeString().slice(0, 5); // HH:mm
    
    if (form.date === today && form.startTime < currentTimeStr) {
      return "For today, you must select a start time in the future.";
    }
    
    if (form.endTime && form.startTime >= form.endTime) {
      return "End time must be later than start time.";
    }

    return null;
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    
    const timeError = validateTimes();
    if (timeError) {
      setError(timeError);
      return;
    }
    
    setError('');
    setSaving(true);
    try {
      const created = await addDoctorAvailability(doctorId, form);
      setSlots((prev) => [...prev, created]);
      setForm(initialSlot);
      onSuccess('Availability slot added', 'success');
    } catch {
      onSuccess('Failed to add availability slot', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slotId) => {
    try {
      await removeDoctorAvailability(slotId);
      setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
      onSuccess('Availability slot removed', 'success');
    } catch {
      onSuccess('Failed to remove availability slot', 'error');
    }
  };

  if (loading) return <Loading text="Loading availability planner..." />;

  return (
    <div className="section-gap">
      <div className="card shadow-colored">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon purple">
              <FiCalendar />
            </div>
            <div>
              <h3>Availability Planner</h3>
              <p>Schedule specific consultation windows starting from today</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleAdd}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label"><FiCalendar /> Select Date</label>
                <input 
                  type="date" 
                  min={today}
                  value={form.date} 
                  onChange={(e) => {
                    setError('');
                    setForm((prev) => ({ ...prev, date: e.target.value }));
                  }} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label"><FiClock /> Start Time</label>
                <input 
                  type="time" 
                  value={form.startTime} 
                  onChange={(e) => {
                    setError('');
                    setForm((prev) => ({ ...prev, startTime: e.target.value }));
                  }} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label"><FiClock /> End Time</label>
                <input 
                  type="time" 
                  value={form.endTime} 
                  onChange={(e) => {
                    setError('');
                    setForm((prev) => ({ ...prev, endTime: e.target.value }));
                  }} 
                  required 
                />
              </div>
            </div>

            {error && (
              <div className="error-alert" style={{marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontSize: '0.85rem'}}>
                <FiAlertCircle /> {error}
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <button className="btn btn-primary btn-full" type="submit" disabled={saving || !!error}>
                <FiPlus /> {saving ? 'Verifying & Adding...' : 'Add Availability Slot'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon green">
              <FiClock />
            </div>
            <div>
              <h3>Scheduled Clinical Sessions</h3>
              <p>Your confirmed availability windows</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {slots.length === 0 ? (
            <EmptyState title="No availability yet" subtitle="Slots you add will appear here. Patients can only book future windows." />
          ) : (
            <div className="appointment-list">
              {[...slots].sort((a,b) => new Date(a.date) - new Date(b.date)).map((slot) => (
                <div className="appt-item" key={slot.id}>
                  <div className="appt-item-left">
                    <div className="appt-avatar doctor">
                      <FiCalendar />
                    </div>
                    <div className="appt-info">
                      <h4>{new Date(slot.date).toDateString()}</h4>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip"><FiClock /> {slot.startTime}</span>
                        <span className="appt-meta-chip">to</span>
                        <span className="appt-meta-chip">{slot.endTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="appt-item-right">
                    <button className="btn btn-sm btn-ghost" onClick={() => handleDelete(slot.id)}>
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
