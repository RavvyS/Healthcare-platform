import { useState, useEffect } from 'react';
import { getPatientAppointments, cancelAppointment } from '../../api/appointmentApi';
import { StatusBadge, Loading, EmptyState } from '../common/UI';
import { MOCK_DOCTORS } from '../../data/mockData';

export default function PatientAppointments({ patientId, refreshTrigger, onSuccess }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getPatientAppointments(patientId);
        // Sort by id descending for latest first
        data.sort((a, b) => b.id - a.id);
        setAppointments(data);
      } catch (err) {
        onSuccess('Failed to load your appointments', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [patientId, refreshTrigger, onSuccess]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      onSuccess('Appointment cancelled', 'success');
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
    } catch {
      onSuccess('Failed to cancel appointment', 'error');
    }
  };

  const activeAppointments = appointments.filter(a => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(a.status));
  const pastAppointments = appointments.filter(a => ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(a.status));

  if (loading) return <Loading />;

  return (
    <div>
      <div className="card">
        <div className="card-title">🩺 Upcoming Appointments</div>
        {activeAppointments.length === 0 ? (
          <EmptyState icon="📅" title="No upcoming appointments" subtitle="You're all caught up." />
        ) : (
          <div className="appointment-list">
            {activeAppointments.map(app => {
              const doctor = MOCK_DOCTORS.find(d => d.id === app.doctorId);
              return (
                <div key={app.id} className="appointment-item">
                  <div className="appointment-item-left">
                    <div className="appointment-avatar">D</div>
                    <div className="appointment-info">
                      <h4>{doctor ? doctor.name : `Doctor #${app.doctorId}`}</h4>
                      <p>{new Date(app.appointmentDate).toDateString()} at {app.slotTime}</p>
                      {app.reason && <div className="appointment-meta">Reason: {app.reason}</div>}
                    </div>
                  </div>
                  <div className="appointment-item-right">
                    <StatusBadge status={app.status} />
                    {app.status === 'PENDING' && (
                      <button className="btn btn-sm btn-ghost" onClick={() => handleCancel(app.id)} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">⌛ History</div>
        {pastAppointments.length === 0 ? (
          <EmptyState icon="📂" title="No history" subtitle="Your past appointments will appear here." />
        ) : (
          <div className="appointment-list">
            {pastAppointments.map(app => {
              const doctor = MOCK_DOCTORS.find(d => d.id === app.doctorId);
              return (
                <div key={app.id} className="appointment-item" style={{ opacity: 0.7 }}>
                  <div className="appointment-item-left">
                    <div className="appointment-avatar" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>D</div>
                    <div className="appointment-info">
                      <h4>{doctor ? doctor.name : `Doctor #${app.doctorId}`}</h4>
                      <p>{new Date(app.appointmentDate).toDateString()} at {app.slotTime}</p>
                    </div>
                  </div>
                  <div className="appointment-item-right">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
