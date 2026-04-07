import { useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi';
import { addDoctorAvailability, getDoctorAvailability, removeDoctorAvailability } from '../../api/doctorApi';
import { EmptyState, Loading } from '../common/UI';

const initialSlot = {
  dayOfWeek: '',
  startTime: '',
  endTime: '',
};

export default function DoctorAvailability({ doctorId, onSuccess }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialSlot);

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

  const handleAdd = async (event) => {
    event.preventDefault();
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
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon purple">
              <FiCalendar />
            </div>
            <div>
              <h3>Availability Planner</h3>
              <p>Publish recurring clinic and telemedicine windows</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleAdd}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Day of Week</label>
                <select value={form.dayOfWeek} onChange={(e) => setForm((prev) => ({ ...prev, dayOfWeek: e.target.value }))} required>
                  <option value="">Select day</option>
                  {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label"><FiClock /> Start Time</label>
                <input type="time" value={form.startTime} onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label"><FiClock /> End Time</label>
                <input type="time" value={form.endTime} onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))} required />
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                <FiPlus /> {saving ? 'Adding...' : 'Add Availability Slot'}
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
              <h3>Published Slots</h3>
              <p>Your currently configured recurring schedule</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {slots.length === 0 ? (
            <EmptyState title="No availability yet" subtitle="Add consultation windows so patients can understand when you practice." />
          ) : (
            <div className="appointment-list">
              {slots.map((slot) => (
                <div className="appt-item" key={slot.id}>
                  <div className="appt-item-left">
                    <div className="appt-avatar doctor">
                      <FiCalendar />
                    </div>
                    <div className="appt-info">
                      <h4>{slot.dayOfWeek}</h4>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip">{slot.startTime}</span>
                        <span className="appt-meta-chip">to</span>
                        <span className="appt-meta-chip">{slot.endTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="appt-item-right">
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(slot.id)}>
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
