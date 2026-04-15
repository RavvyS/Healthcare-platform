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
import Profile from './components/patient/Profile';
import Reports from './components/patient/Reports';
import AuthForms from './components/common/AuthForms';
import HomePage from './components/common/HomePage';
import { useToast } from './hooks/useToast';

function App() {
  const { toasts, addToast } = useToast();
  
  // Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('medicare_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [role, setRole] = useState(() => localStorage.getItem('medicare_role'));
  const [showAuth, setShowAuth] = useState(() => localStorage.getItem('medicare_show_auth') === 'true');
  
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('medicare_active_tab') || 'DASHBOARD';
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('medicare_theme') || 'light');
  const [doctorProfile, setDoctorProfile] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('medicare_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('medicare_user');
    }
  }, [user]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('medicare_role', role);
    } else {
      localStorage.removeItem('medicare_role');
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem('medicare_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('medicare_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('medicare_show_auth', showAuth);
  }, [showAuth]);

  const PATIENT_ID = user?.userId?.toString() || '';
  const ADMIN_ID = user?.userId || '';
  const DOCTOR_ID = user?.userId || '';

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

  if (!user || !role) {
    if (!showAuth) {
      return <HomePage onGetStarted={() => setShowAuth(true)} theme={theme} toggleTheme={toggleTheme} />;
    }

    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
        <button 
          className="btn btn-ghost"
          style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}
          onClick={() => setShowAuth(false)}
        >
          ← Back to Home
        </button>
        <AuthForms 
          onSuccess={(authData) => {
            // Block users who are pending admin approval
            if (authData.accountStatus === 'PENDING_VERIFICATION') {
              addToast('Your account is pending admin approval. You will receive an email once approved.', 'warning');
              return; // Do NOT log them in
            }
            setUser(authData);
            setRole(authData.role);
            setActiveTab(authData.role === 'ADMIN' ? 'ADMIN' : 'OVERVIEW');
            addToast(`Welcome back, ${authData.fullName}!`, 'success');
          }} 
          onError={addToast} 
        />
        <Toast toasts={toasts} />
      </div>
    );
  }

  const patientNav = [
    { id: 'OVERVIEW',        icon: <FiHome size={16} />,     label: 'Overview' },
    { id: 'BOOK',           icon: <FiCalendar size={16} />, label: 'Book Appointment' },
    { id: 'MY_APPOINTMENTS',icon: <FiList size={16} />,     label: 'My Appointments' },
    { id: 'RECORDS',        icon: <FiFileText size={16} />, label: 'My Records' },
    { id: 'PROFILE',        icon: <FiUser size={16} />,     label: 'My Profile' },
    { id: 'REPORTS',        icon: <FiClipboard size={16} />,label: 'Medical Reports' },
    { id: 'SYMPTOMS',       icon: <FiActivity size={16} />, label: 'AI Symptom Check' },
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
    PATIENT: { initials: user.fullName ? user.fullName.charAt(0).toUpperCase() : 'P', name: user.fullName || 'Patient', roleText: 'Patient' },
    DOCTOR: { 
      initials: doctorProfile?.name?.charAt(0) || user.fullName?.charAt(0) || 'D', 
      name: doctorProfile?.name || user.fullName || 'Doctor', 
      roleText: doctorProfile?.specialization || 'General Physician' 
    },
    ADMIN: { initials: user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A', name: user.fullName || 'Admin', roleText: 'Platform Administrator' },
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
            onClick={() => {
              setRole(null);
              setUser(null);
              setShowAuth(false);
              localStorage.removeItem('medicare_user');
              localStorage.removeItem('medicare_role');
              localStorage.removeItem('medicare_active_tab');
              localStorage.removeItem('medicare_show_auth');
            }}
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

        {role === 'PATIENT' && activeTab === 'PROFILE' && (
          <Profile patientId={PATIENT_ID} onSuccess={addToast} />
        )}

        {role === 'PATIENT' && activeTab === 'REPORTS' && (
          <Reports patientId={PATIENT_ID} onSuccess={addToast} />
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
