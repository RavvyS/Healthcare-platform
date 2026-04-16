import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiVideo, FiMapPin, FiX, FiInfo, FiInbox } from 'react-icons/fi';
import { getPatientAppointments, cancelAppointment } from '../../api/appointmentApi';
import { getDoctors } from '../../api/doctorApi';
import { StatusBadge, Loading, EmptyState, ConsultationBadge } from '../common/UI';
import { MOCK_DOCTORS } from '../../data/mockData';

export default function PatientAppointments({ patientId, refreshTrigger, onSuccess }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctors().then(setDoctors).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getPatientAppointments(patientId);
        data.sort((a, b) => b.id - a.id);
        setAppointments(data);
      } catch (err) {
        onSuccess('Failed to load your appointments', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, refreshTrigger]);

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

  const activeAppointments = appointments.filter(a => !['COMPLETED', 'CANCELLED', 'REJECTED', 'UNPAID'].includes(a.status));
  const pastAppointments = appointments.filter(a => ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(a.status));

  if (loading) return <Loading text="Retrieving your medical schedule..." />;

  return (
    <div className="section-gap">
      {/* ── Active Appointments ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon blue">
              <FiCalendar />
            </div>
            <div>
              <h3>Upcoming Appointments</h3>
              <p>Your scheduled consultations and visits</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {activeAppointments.length === 0 ? (
            <EmptyState 
              icon={<FiCalendar />} 
              title="No upcoming appointments" 
              subtitle="Your scheduled medical visits will appear here once booked." 
            />
          ) : (
            <div className="appointment-list">
              {activeAppointments.map(app => {
                const doctor = doctors.find(d => d.id === app.doctorId) || MOCK_DOCTORS.find(d => d.id === app.doctorId);
                return (
                  <div key={app.id} className="appt-item">
                    <div className="appt-item-left">
                      <div className="appt-avatar doctor">
                        {doctor ? doctor.name[4] : 'D'}
                      </div>
                      <div className="appt-info">
                        <h4>{doctor ? doctor.name : `Doctor #${app.doctorId}`}</h4>
                        <div className="appt-info-meta">
                          <span className="appt-meta-chip">
                            <FiCalendar /> {new Date(app.appointmentDate).toDateString()}
                          </span>
                          <span className="appt-meta-chip">
                            <FiClock /> {app.slotTime}
                          </span>
                          <ConsultationBadge type={app.consultationType} />
                        </div>
                        {app.reason && (
                          <div className="appt-meta-chip" style={{ marginTop: '4px' }}>
                            <FiInfo /> {app.reason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="appt-item-right">
                      <StatusBadge status={app.status} />
                      
                      {app.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancel(app.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <FiX /> Cancel
                        </button>
                      )}
                      
                      {app.status === 'CONFIRMED' && app.consultationType === 'ONLINE' && (
                        <button
                          onClick={() => window.open(`/consultation.html?id=${app.id}`, '_blank')}
                          className="btn btn-sm btn-primary"
                        >
                          <FiVideo /> Join Consultation
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Past Appointments ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon green">
              <FiInbox />
            </div>
            <div>
              <h3>Appointment History</h3>
              <p>Completed and past records</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {pastAppointments.length === 0 ? (
            <EmptyState 
              icon={<FiInbox />} 
              title="No history yet" 
              subtitle="Records of your visits will be kept here for your convenience." 
            />
          ) : (
            <div className="appointment-list">
              {pastAppointments.map(app => {
                const doctor = doctors.find(d => d.id === app.doctorId) || MOCK_DOCTORS.find(d => d.id === app.doctorId);
                return (
                  <div key={app.id} className="appt-item" style={{ opacity: 0.8 }}>
                    <div className="appt-item-left">
                      <div className="appt-avatar doctor" style={{ filter: 'grayscale(0.5)' }}>
                        {doctor ? doctor.name[4] : 'D'}
                      </div>
                      <div className="appt-info">
                        <h4>{doctor ? doctor.name : `Doctor #${app.doctorId}`}</h4>
                        <div className="appt-info-meta">
                          <span className="appt-meta-chip">
                             <FiCalendar /> {new Date(app.appointmentDate).toDateString()}
                          </span>
                          <ConsultationBadge type={app.consultationType} />
                        </div>
                      </div>
                    </div>
                    <div className="appt-item-right">
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
