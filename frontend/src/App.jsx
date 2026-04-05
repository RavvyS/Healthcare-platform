import { useState, useEffect } from 'react';
import {
  FiCalendar, FiClipboard, FiLogOut, FiMenu,
  FiUserPlus, FiList, FiActivity
} from 'react-icons/fi';
import { RiHospitalLine } from 'react-icons/ri';
import { useToast } from './hooks/useToast';
import { Toast, ThemeToggle } from './components/common/UI';
import BookAppointment from './components/patient/BookAppointment';
import PatientAppointments from './components/patient/PatientAppointments';
import DoctorAppointments from './components/doctor/DoctorAppointments';

function App() {
  const { toasts, addToast } = useToast();
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [theme, setTheme] = useState('light');

  const PATIENT_ID = 42;
  const DOCTOR_ID = 1;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  /* ── Landing / Role Selector ── */
  if (!role) {
    return (
      <div className="landing-screen">
        <div className="landing-bg-orb landing-bg-orb-1" />
        <div className="landing-bg-orb landing-bg-orb-2" />

        <div className="landing-top-bar">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <div className="landing-content">
          {/* Brand */}
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
            Seamless appointments, secure payments, and virtual consultations —<br />
            all in one intelligent healthcare platform.
          </p>

          <div className="role-cards">
            <div className="role-card" onClick={() => { setRole('PATIENT'); setActiveTab('BOOK'); }}>
              <div className="role-card-icon">
                <FiUserPlus size={28} />
              </div>
              <h3>Patient Portal</h3>
              <p>Book consultations, pay securely, and attend video visits from home.</p>
            </div>
            <div className="role-card" onClick={() => { setRole('DOCTOR'); setActiveTab('DASHBOARD'); }}>
              <div className="role-card-icon">
                <FiActivity size={28} />
              </div>
              <h3>Doctor Portal</h3>
              <p>Review requests, manage your schedule, and host video consultations.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Sidebar Nav Items ── */
  const patientNav = [
    { id: 'BOOK',            icon: <FiCalendar size={16} />,   label: 'Book Appointment' },
    { id: 'MY_APPOINTMENTS', icon: <FiList     size={16} />,   label: 'My Appointments'  },
  ];
  const doctorNav = [
    { id: 'DASHBOARD', icon: <FiClipboard size={16} />, label: 'Appointment Dashboard' },
  ];
  const navItems = role === 'PATIENT' ? patientNav : doctorNav;

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <nav className="sidebar">
        {/* Logo */}
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

        {/* Nav */}
        <div className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map(item => (
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

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              {role === 'PATIENT' ? 'J' : 'A'}
            </div>
            <div className="user-info">
              <div className="user-name">{role === 'PATIENT' ? 'John Doe' : 'Dr. Amal Perera'}</div>
              <div className="user-role">{role === 'PATIENT' ? 'Patient' : 'General Physician'}</div>
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

      {/* ── Main Content ── */}
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h2>
              {role === 'PATIENT' ? <><FiCalendar size={22} /> Patient Portal</> : <><FiClipboard size={22} /> Doctor Dashboard</>}
            </h2>
            <p>
              <FiCalendar size={12} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {role === 'PATIENT' && activeTab === 'BOOK' && (
          <BookAppointment
            patientId={PATIENT_ID}
            onSuccess={(msg, type) => {
              addToast(msg, type);
              if (type !== 'error') {
                setActiveTab('MY_APPOINTMENTS');
                setRefreshTrigger(prev => prev + 1);
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

        {role === 'DOCTOR' && activeTab === 'DASHBOARD' && (
          <DoctorAppointments
            doctorId={DOCTOR_ID}
            onSuccess={addToast}
          />
        )}
      </main>

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
