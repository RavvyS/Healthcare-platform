import { useEffect, useState } from 'react';
import { FiActivity, FiCalendar, FiClock, FiFileText, FiShield } from 'react-icons/fi';
import { getPatientAppointments } from '../../api/appointmentApi';
import { getPatientReports } from '../../api/patientApi';
import { getPatientPrescriptions } from '../../api/doctorApi';
import { EmptyState, Loading, StatusBadge } from '../common/UI';
import { MOCK_DOCTORS } from '../../data/mockData';

export default function PatientDashboard({ patientId, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [appointmentData, reportData, prescriptionData] = await Promise.all([
          getPatientAppointments(patientId),
          getPatientReports(patientId).catch(() => []),
          getPatientPrescriptions(patientId).catch(() => []),
        ]);
        setAppointments(appointmentData);
        setReports(reportData);
        setPrescriptions(prescriptionData);
      } catch {
        onSuccess('Failed to load patient dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [patientId, onSuccess]);

  if (loading) return <Loading text="Preparing your healthcare overview..." />;

  const upcoming = appointments
    .filter((item) => ['PENDING', 'CONFIRMED'].includes(item.status))
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const nextAppointment = upcoming[0];
  const stats = [
    { label: 'Upcoming Visits', value: upcoming.length, icon: <FiCalendar /> },
    { label: 'Medical Reports', value: reports.length, icon: <FiFileText /> },
    { label: 'Prescriptions', value: prescriptions.length, icon: <FiShield /> },
    { label: 'Doctors Consulted', value: new Set(appointments.map((item) => item.doctorId)).size, icon: <FiActivity /> },
  ];

  return (
    <div className="section-gap">
      <div className="hero-panel">
        <div className="hero-panel-copy">
          <span className="hero-kicker">Patient Experience</span>
          <h3>Your care schedule, records, and health insights together</h3>
          <p>
            Review upcoming consultations, keep documents ready for specialists, and
            stay prepared for both physical visits and telemedicine sessions.
          </p>
        </div>
        <div className="hero-panel-card">
          <div className="hero-mini-label">Next Appointment</div>
          {nextAppointment ? (
            <>
              <div className="hero-mini-title">
                {MOCK_DOCTORS.find((doctor) => doctor.id === nextAppointment.doctorId)?.name || `Doctor #${nextAppointment.doctorId}`}
              </div>
              <div className="hero-mini-meta">
                <span><FiCalendar /> {new Date(nextAppointment.appointmentDate).toDateString()}</span>
                <span><FiClock /> {nextAppointment.slotTime}</span>
              </div>
              <StatusBadge status={nextAppointment.status} />
            </>
          ) : (
            <div className="hero-mini-empty">No appointment scheduled yet.</div>
          )}
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

      <div className="insight-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-header-icon blue">
                <FiCalendar />
              </div>
              <div>
                <h3>Upcoming Care Plan</h3>
                <p>Your next scheduled healthcare touchpoints</p>
              </div>
            </div>
          </div>
          <div className="card-body">
            {upcoming.length === 0 ? (
              <EmptyState title="No upcoming care booked" subtitle="Your confirmed and pending consultations will appear here." />
            ) : (
              <div className="compact-list">
                {upcoming.slice(0, 4).map((appointment) => (
                  <div className="compact-list-item" key={appointment.id}>
                    <div>
                      <strong>{MOCK_DOCTORS.find((doctor) => doctor.id === appointment.doctorId)?.name || `Doctor #${appointment.doctorId}`}</strong>
                      <span>{new Date(appointment.appointmentDate).toDateString()} at {appointment.slotTime}</span>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-header-icon green">
                <FiShield />
              </div>
              <div>
                <h3>Care Reminders</h3>
                <p>Quick tasks before your next consultation</p>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="check-list">
              <div className="check-list-item">Upload recent test reports before specialist visits.</div>
              <div className="check-list-item">Use the symptom checker when you are unsure which specialty to book.</div>
              <div className="check-list-item">Keep allergy and emergency contact details updated in your profile.</div>
              <div className="check-list-item">Join video consultations a few minutes early to test audio and camera.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
