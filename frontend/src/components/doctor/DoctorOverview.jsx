import { useEffect, useState } from 'react';
import { FiActivity, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';
import { getDoctorAppointments } from '../../api/appointmentApi';
import { EmptyState, Loading, StatusBadge } from '../common/UI';

export default function DoctorOverview({ doctorId, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getDoctorAppointments(doctorId);
        setAppointments(data);
      } catch {
        onSuccess('Failed to load doctor overview', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [doctorId, onSuccess]);

  if (loading) return <Loading text="Preparing your doctor workspace..." />;

  const pending = appointments.filter((item) => item.status === 'PENDING');
  const confirmed = appointments.filter((item) => item.status === 'CONFIRMED');
  const completed = appointments.filter((item) => item.status === 'COMPLETED');
  const online = appointments.filter((item) => item.consultationType === 'ONLINE');

  const stats = [
    { label: 'Pending Requests', value: pending.length, icon: <FiClock /> },
    { label: 'Confirmed Sessions', value: confirmed.length, icon: <FiCalendar /> },
    { label: 'Completed Visits', value: completed.length, icon: <FiCheckCircle /> },
    { label: 'Online Consults', value: online.length, icon: <FiActivity /> },
  ];

  return (
    <div className="section-gap">
      <div className="hero-panel doctor-hero">
        <div className="hero-panel-copy">
          <span className="hero-kicker">Doctor Workspace</span>
          <h3>See the clinic pipeline and act on new requests faster</h3>
          <p>
            Keep appointment approvals, consultation flow, and patient load visible
            from a single overview before diving into detailed actions.
          </p>
        </div>
        <div className="hero-panel-card">
          <div className="hero-mini-label">Priority Queue</div>
          <div className="hero-mini-title">{pending.length} request{pending.length === 1 ? '' : 's'} waiting</div>
          <div className="hero-mini-empty">Open the appointments tab to accept, reject, or complete visits.</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon amber">
              <FiClock />
            </div>
            <div>
              <h3>Immediate Attention Queue</h3>
              <p>Most recent appointments waiting for your action</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {pending.length === 0 ? (
            <EmptyState title="No pending requests" subtitle="New consultation requests will show up here." />
          ) : (
            <div className="compact-list">
              {pending.slice(0, 5).map((appointment) => (
                <div className="compact-list-item" key={appointment.id}>
                  <div>
                    <strong>Patient #{appointment.patientId}</strong>
                    <span>{new Date(appointment.appointmentDate).toDateString()} at {appointment.slotTime}</span>
                  </div>
                  <StatusBadge status={appointment.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
