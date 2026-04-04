import { useState } from 'react';
import { useToast } from './hooks/useToast';
import { Toast } from './components/common/UI';
import BookAppointment from './components/patient/BookAppointment';
import PatientAppointments from './components/patient/PatientAppointments';
import DoctorAppointments from './components/doctor/DoctorAppointments';

function App() {
  const { toasts, addToast } = useToast();
  const [role, setRole] = useState(null); // 'PATIENT' or 'DOCTOR'
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Mock IDs for demo
  const PATIENT_ID = 42;
  const DOCTOR_ID = 1;

  if (!role) {
    return (
      <div className="role-selector-screen">
        <div className="role-selector-content">
          <h1>Healthcare Platform</h1>
          <p>Select your portal to continue</p>
          <div className="role-cards">
            <div className="role-card" onClick={() => { setRole('PATIENT'); setActiveTab('BOOK'); }}>
              <span className="role-emoji">👨‍👩‍👧</span>
              <h3>Patient Portal</h3>
              <p>Book appointments & view history</p>
            </div>
            <div className="role-card" onClick={() => { setRole('DOCTOR'); setActiveTab('DASHBOARD'); }}>
              <span className="role-emoji">🩺</span>
              <h3>Doctor Portal</h3>
              <p>Manage schedule & patients</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <h1><span className="logo-icon">⚕️</span> RavvyCare</h1>
        </div>
        
        <div className="sidebar-nav">
          <div className="nav-label">Main Menu</div>
          
          {role === 'PATIENT' && (
            <>
              <button 
                className={`nav-item ${activeTab === 'BOOK' ? 'active' : ''}`}
                onClick={() => setActiveTab('BOOK')}
              >
                <span className="icon">➕</span> Book Appointment
              </button>
              <button 
                className={`nav-item ${activeTab === 'MY_APPOINTMENTS' ? 'active' : ''}`}
                onClick={() => setActiveTab('MY_APPOINTMENTS')}
              >
                <span className="icon">📅</span> My Appointments
              </button>
            </>
          )}

          {role === 'DOCTOR' && (
            <button 
              className={`nav-item ${activeTab === 'DASHBOARD' ? 'active' : ''}`}
              onClick={() => setActiveTab('DASHBOARD')}
            >
              <span className="icon">📋</span> Request Dashboard
            </button>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="role-badge">
            <div className="role-avatar">{role[0]}</div>
            <div className="role-info">
              <div className="role-name">{role === 'PATIENT' ? 'John Doe' : 'Dr. Amal Perera'}</div>
              <div className="role-type">{role.toLowerCase()}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setRole(null)} style={{ padding: 4 }}>
              🚪
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h2>{role === 'PATIENT' ? 'Patient Portal' : 'Doctor Dashboard'}</h2>
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* --- PATIENT VIEWS --- */}
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

        {/* --- DOCTOR VIEWS --- */}
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
