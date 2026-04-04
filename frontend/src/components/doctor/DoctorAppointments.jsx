import { useState, useEffect } from 'react';
import { getDoctorAppointments, updateAppointmentStatus } from '../../api/appointmentApi';
import { StatusBadge, Loading, EmptyState } from '../common/UI';

export default function DoctorAppointments({ doctorId, onSuccess }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getDoctorAppointments(doctorId);
      data.sort((a, b) => b.id - a.id);
      setAppointments(data);
    } catch {
      onSuccess('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      onSuccess(`Appointment marked as ${status}`, 'success');
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch {
      onSuccess('Failed to update status', 'error');
    }
  };

  if (loading) return <Loading />;

  const pendingAppointments = appointments.filter(a => a.status === 'PENDING');
  const confirmedAppointments = appointments.filter(a => a.status === 'CONFIRMED');
  const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED');

  return (
    <div>
      <div className="card">
        <div className="card-title">🔔 Pending Requests</div>
        {pendingAppointments.length === 0 ? (
          <EmptyState icon="📬" title="No new requests" subtitle="All caught up!" />
        ) : (
          <div className="appointment-list">
            {pendingAppointments.map(app => (
              <div key={app.id} className="appointment-item">
                <div className="appointment-item-left">
                  <div className="appointment-avatar">P</div>
                  <div className="appointment-info">
                    <h4>Patient #{app.patientId}</h4>
                    <p>{new Date(app.appointmentDate).toDateString()} at {app.slotTime}</p>
                    {app.reason && <div className="appointment-meta">Reason: {app.reason}</div>}
                  </div>
                </div>
                <div className="appointment-item-right">
                  <button className="btn btn-sm btn-success" onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}>
                    ✅ Accept
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleUpdateStatus(app.id, 'REJECTED')}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">📅 Confirmed Appointments</div>
        {confirmedAppointments.length === 0 ? (
           <EmptyState icon="✅" title="No confirmed appointments" subtitle="You have no accepted appointments yet." />
        ) : (
          <div className="appointment-list">
            {confirmedAppointments.map(app => (
              <div key={app.id} className="appointment-item">
                <div className="appointment-item-left">
                  <div className="appointment-avatar" style={{ background: 'var(--success)' }}>P</div>
                  <div className="appointment-info">
                    <h4>Patient #{app.patientId}</h4>
                    <p>{new Date(app.appointmentDate).toDateString()} at {app.slotTime}</p>
                  </div>
                </div>
                <div className="appointment-item-right">
                  <StatusBadge status={app.status} />
                  <button className="btn btn-sm btn-ghost" onClick={() => handleUpdateStatus(app.id, 'COMPLETED')} style={{ marginLeft: 8 }}>
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">🚫 Cancelled Appointments</div>
        {cancelledAppointments.length === 0 ? (
           <EmptyState icon="🗓️" title="No cancelled appointments" subtitle="Good news! No one has cancelled." />
        ) : (
          <div className="appointment-list">
            {cancelledAppointments.map(app => (
              <div key={app.id} className="appointment-item" style={{ opacity: 0.7 }}>
                <div className="appointment-item-left">
                  <div className="appointment-avatar" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>P</div>
                  <div className="appointment-info">
                    <h4>Patient #{app.patientId}</h4>
                    <p>{new Date(app.appointmentDate).toDateString()} at {app.slotTime}</p>
                  </div>
                </div>
                <div className="appointment-item-right">
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
