import { useState, useEffect } from 'react';
import { 
  FiCalendar, FiClock, FiCheck, FiX, FiActivity, 
  FiFilter, FiInbox, FiCheckCircle, FiTrash2, FiUser
} from 'react-icons/fi';
import { RiHospitalLine } from 'react-icons/ri';
import { getDoctorAppointments, updateAppointmentStatus } from '../../api/appointmentApi';
import { sendNotification } from '../../api/notificationApi';
import { StatusBadge, Loading, EmptyState, ConsultationBadge } from '../common/UI';

export default function DoctorAppointments({ doctorId, onSuccess }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      const appointment = appointments.find((item) => item.id === id);
      if (appointment) {
        await sendNotification({
          channel: 'EMAIL',
          recipientRole: 'PATIENT',
          recipientId: appointment.patientId,
          subject: 'Appointment status updated',
          message: `Your appointment #${id} is now marked as ${status}.`,
        });
      }
      onSuccess(`Appointment marked as ${status}`, 'success');
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch {
      onSuccess('Failed to update status', 'error');
    }
  };

  if (loading) return <Loading text="Fetching your clinical schedule..." />;

  const filteredAppointments = appointments.filter(a => {
    if (filterType === 'ALL') return true;
    return a.consultationType === filterType;
  });

  const pendingAppointments = filteredAppointments.filter(a => a.status === 'PENDING');
  const confirmedAppointments = filteredAppointments.filter(a => a.status === 'CONFIRMED');
  const cancelledAppointments = filteredAppointments.filter(a => ['CANCELLED', 'REJECTED'].includes(a.status));

  return (
    <div className="section-gap">
      {/* ── Filter Tabs ── */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filterType === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          <FiFilter /> All Visits
        </button>
        <button 
          className={`filter-tab ${filterType === 'ONLINE' ? 'active' : ''}`}
          onClick={() => setFilterType('ONLINE')}
        >
          <FiActivity /> Online
        </button>
        <button 
          className={`filter-tab ${filterType === 'PHYSICAL' ? 'active' : ''}`}
          onClick={() => setFilterType('PHYSICAL')}
        >
          <RiHospitalLine style={{fontSize: '1rem'}} /> Physical
        </button>
      </div>

      {/* ── Pending Requests ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon amber">
              <FiInbox />
            </div>
            <div>
              <h3>New Consultation Requests</h3>
              <p>Patients waiting for your approval</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {pendingAppointments.length === 0 ? (
            <EmptyState 
              icon={<FiInbox />} 
              title="No pending requests" 
              subtitle="Looks like you're all caught up for now!" 
            />
          ) : (
            <div className="appointment-list">
              {pendingAppointments.map(app => (
                <div key={app.id} className="appt-item">
                  <div className="appt-item-left">
                    <div className="appt-avatar patient">
                      <FiUser />
                    </div>
                    <div className="appt-info">
                      <h4>Patient #{app.patientId}</h4>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip"><FiCalendar /> {new Date(app.appointmentDate).toDateString()}</span>
                        <span className="appt-meta-chip"><FiClock /> {app.slotTime}</span>
                        <ConsultationBadge type={app.consultationType} />
                      </div>
                      {app.reason && <div className="appt-meta-chip" style={{marginTop:'4px'}}><FiActivity /> {app.reason}</div>}
                    </div>
                  </div>
                  <div className="appt-item-right">
                    <button className="btn btn-sm btn-success" onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}>
                      <FiCheck /> Accept
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleUpdateStatus(app.id, 'REJECTED')}>
                      <FiX /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Confirmed Appointments ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon blue">
              <FiCheckCircle />
            </div>
            <div>
              <h3>Today's Confirmed Sessions</h3>
              <p>Active and upcoming medical sessions</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {confirmedAppointments.length === 0 ? (
            <EmptyState 
              icon={<FiCheckCircle />} 
              title="No confirmed sessions" 
              subtitle="Accepted appointments will appear here." 
            />
          ) : (
            <div className="appointment-list">
              {confirmedAppointments.map(app => (
                <div key={app.id} className="appt-item">
                  <div className="appt-item-left">
                    <div className="appt-avatar patient">
                      <FiUser />
                    </div>
                    <div className="appt-info">
                      <h4>Patient #{app.patientId}</h4>
                      <div className="appt-info-meta">
                         <span className="appt-meta-chip"><FiCalendar /> {new Date(app.appointmentDate).toDateString()}</span>
                         <span className="appt-meta-chip"><FiClock /> {app.slotTime}</span>
                         <ConsultationBadge type={app.consultationType} />
                      </div>
                    </div>
                  </div>
                  <div className="appt-item-right">
                    <StatusBadge status={app.status} />
                    
                    {app.status === 'CONFIRMED' && app.consultationType === 'ONLINE' && (
                      <button
                        onClick={() => window.open(`/consultation.html?id=${app.id}`, '_blank')}
                        className="btn btn-sm btn-primary"
                      >
                        <FiActivity /> Join Session
                      </button>
                    )}
                    
                    <button className="btn btn-sm btn-ghost" onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}>
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Cancelled History ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon red">
              <FiTrash2 />
            </div>
            <div>
              <h3>Cancelled / Rejected</h3>
              <p>Recently declined or withdrawn sessions</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {cancelledAppointments.length === 0 ? (
            <EmptyState 
              icon={<FiTrash2 />} 
              title="No cancelled records" 
              subtitle="Recent cancellations will show up here." 
            />
          ) : (
            <div className="appointment-list">
              {cancelledAppointments.map(app => (
                <div key={app.id} className="appt-item" style={{ opacity: 0.7 }}>
                  <div className="appt-item-left">
                    <div className="appt-avatar patient" style={{ filter: 'grayscale(1)' }}>
                      <FiUser />
                    </div>
                    <div className="appt-info">
                      <h4>Patient #{app.patientId}</h4>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip">{new Date(app.appointmentDate).toDateString()}</span>
                        <ConsultationBadge type={app.consultationType} />
                      </div>
                    </div>
                  </div>
                  <div className="appt-item-right">
                    <StatusBadge status={app.status} />
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

