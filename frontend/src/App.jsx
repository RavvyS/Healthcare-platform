import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiCalendar,
  FiClipboard,
  FiClock,
  FiFileText,
  FiHome,
  FiList,
  FiLogOut,
  FiShield,
  FiUser,
  FiUserPlus,
} from 'react-icons/fi';
import { RiHospitalLine } from 'react-icons/ri';
import { Toast, ThemeToggle } from './components/common/UI';
import AdminDashboard from './components/admin/AdminDashboard';
import DoctorAppointments from './components/doctor/DoctorAppointments';
import DoctorAvailability from './components/doctor/DoctorAvailability';
import DoctorOverview from './components/doctor/DoctorOverview';
import DoctorProfile from './components/doctor/DoctorProfile';
import BookAppointment from './components/patient/BookAppointment';
import PatientAppointments from './components/patient/PatientAppointments';
import PatientDashboard from './components/patient/PatientDashboard';
import PatientRecords from './components/patient/PatientRecords';
import SymptomChecker from './components/patient/SymptomChecker';
import { useToast } from './hooks/useToast';

function App() {
  const { toasts, addToast } = useToast();
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [theme, setTheme] = useState('light');
  const [doctorProfile, setDoctorProfile] = useState(null);

  const PATIENT_ID = 42;
  const DOCTOR_ID = 1;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (role === 'DOCTOR') {
      import('./api/doctorApi').then(({ getDoctorById }) => {
        getDoctorById(DOCTOR_ID)
          .then(data => setDoctorProfile(data))
          .catch(err => console.error("Sidebar sync failed:", err));
      });
    }
  }, [role, refreshTrigger]);

  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));

  if (!role) {
    return (
      <div className="landing-screen">
        <div className="landing-bg-orb landing-bg-orb-1" />
        <div className="landing-bg-orb landing-bg-orb-2" />

        <div className="landing-top-bar">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <div className="landing-content">
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <RiHospitalLine size={32} />
            </div>
            <div className="landing-logo-text">
              <h1>Medi<em>Care</em></h1>
              <p>Smart Healthcare Platform</p>
            </div>
          </div>

          <p className="landing-tagline">
            Seamless appointments, secure payments, and virtual consultations
            <br />
            all in one intelligent healthcare platform.
          </p>

          <div className="role-cards">
            <div className="role-card" onClick={() => { setRole('PATIENT'); setActiveTab('OVERVIEW'); }}>
              <div className="role-card-icon">
                <FiUserPlus size={28} />
              </div>
              <h3>Patient Portal</h3>
              <p>Manage appointments, reports, prescriptions, and symptom guidance.</p>
            </div>
            <div className="role-card" onClick={() => { setRole('DOCTOR'); setActiveTab('OVERVIEW'); }}>
              <div className="role-card-icon">
                <FiActivity size={28} />
              </div>
              <h3>Doctor Portal</h3>
              <p>Track requests, manage availability, and maintain consultation readiness.</p>
            </div>
            <div className="role-card" onClick={() => { setRole('ADMIN'); setActiveTab('ADMIN'); }}>
              <div className="role-card-icon">
                <FiShield size={28} />
              </div>
              <h3>Admin Console</h3>
              <p>Verify doctors, manage users, and monitor platform operations.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const patientNav = [
    { id: 'OVERVIEW', icon: <FiHome size={16} />, label: 'Overview' },
    { id: 'BOOK', icon: <FiCalendar size={16} />, label: 'Book Appointment' },
    { id: 'MY_APPOINTMENTS', icon: <FiList size={16} />, label: 'My Appointments' },
    { id: 'RECORDS', icon: <FiFileText size={16} />, label: 'My Records' },
    { id: 'SYMPTOMS', icon: <FiActivity size={16} />, label: 'AI Symptom Check' },
  ];

  const doctorNav = [
    { id: 'OVERVIEW', icon: <FiHome size={16} />, label: 'Overview' },
    { id: 'DASHBOARD', icon: <FiClipboard size={16} />, label: 'Appointments' },
    { id: 'AVAILABILITY', icon: <FiClock size={16} />, label: 'Availability' },
    { id: 'PROFILE', icon: <FiUser size={16} />, label: 'Profile' },
  ];

  const adminNav = [
    { id: 'ADMIN', icon: <FiShield size={16} />, label: 'Admin Dashboard' },
  ];

  const navItems = role === 'PATIENT' ? patientNav : role === 'DOCTOR' ? doctorNav : adminNav;

  const roleMeta = {
    PATIENT: { initials: 'J', name: 'John Doe', roleText: 'Patient' },
    DOCTOR: { 
      initials: doctorProfile?.name?.charAt(0) || 'A', 
      name: doctorProfile?.name || 'Dr. Amal Perera', 
      roleText: doctorProfile?.specialization || 'General Physician' 
    },
    ADMIN: { initials: 'N', name: 'Nadeesha Admin', roleText: 'Platform Administrator' },
  };

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-inner">
            <div className="sidebar-logo-icon">
              <RiHospitalLine size={20} />
            </div>
            <div className="sidebar-brand-text">
              <h2>Medi<em>Care</em></h2>
              <span>Healthcare Platform</span>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              {roleMeta[role].initials}
            </div>
            <div className="user-info">
              <div className="user-name">{roleMeta[role].name}</div>
              <div className="user-role">{roleMeta[role].roleText}</div>
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          <button
            className="btn btn-ghost btn-sm btn-full"
            onClick={() => setRole(null)}
            style={{ gap: 7 }}
          >
            <FiLogOut size={14} />
            Sign Out
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h2>
              {role === 'PATIENT' && <><FiCalendar size={22} /> Patient Portal</>}
              {role === 'DOCTOR' && <><FiClipboard size={22} /> Doctor Dashboard</>}
              {role === 'ADMIN' && <><FiShield size={22} /> Admin Control Center</>}
            </h2>
            <p>
              <FiCalendar size={12} />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {role === 'PATIENT' && activeTab === 'OVERVIEW' && (
          <PatientDashboard patientId={PATIENT_ID} onSuccess={addToast} />
        )}

        {role === 'PATIENT' && activeTab === 'BOOK' && (
          <BookAppointment
            patientId={PATIENT_ID}
            onSuccess={(msg, type) => {
              addToast(msg, type);
              if (type !== 'error') {
                setActiveTab('MY_APPOINTMENTS');
                setRefreshTrigger((prev) => prev + 1);
              }
            }}
          />
        )}

        {role === 'PATIENT' && activeTab === 'MY_APPOINTMENTS' && (
          <PatientAppointments
            patientId={PATIENT_ID}
            refreshTrigger={refreshTrigger}
            onSuccess={addToast}
          />
        )}

        {role === 'PATIENT' && activeTab === 'RECORDS' && (
          <PatientRecords patientId={PATIENT_ID} onSuccess={addToast} />
        )}

        {role === 'PATIENT' && activeTab === 'SYMPTOMS' && (
          <SymptomChecker onSuccess={addToast} />
        )}

        {role === 'DOCTOR' && activeTab === 'OVERVIEW' && (
          <DoctorOverview doctorId={DOCTOR_ID} onSuccess={addToast} />
        )}

        {role === 'DOCTOR' && activeTab === 'DASHBOARD' && (
          <DoctorAppointments doctorId={DOCTOR_ID} onSuccess={addToast} />
        )}

        {role === 'DOCTOR' && activeTab === 'AVAILABILITY' && (
          <DoctorAvailability doctorId={DOCTOR_ID} onSuccess={addToast} />
        )}

        {role === 'DOCTOR' && activeTab === 'PROFILE' && (
          <DoctorProfile 
            doctorId={DOCTOR_ID} 
            onSuccess={(msg, type) => {
              addToast(msg, type);
              if (type !== 'error') setRefreshTrigger(prev => prev + 1);
            }} 
          />
        )}

        {role === 'ADMIN' && activeTab === 'ADMIN' && (
          <AdminDashboard onSuccess={addToast} />
        )}
      </main>

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
