import { FiUser, FiActivity, FiX, FiDroplet, FiHeart, FiFileText } from 'react-icons/fi';

export default function PatientInfoModal({ patient, onClose }) {
  if (!patient) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <div className="card-header-left">
            <div className="card-header-icon blue">
              <FiUser />
            </div>
            <div>
              <h3>Patient Clinical Profile</h3>
              <p>Medical history and vital information</p>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="clinical-grid">
            <div className="clinical-item">
              <label><FiUser /> Full Name</label>
              <span>{patient.name}</span>
            </div>
            <div className="clinical-item">
              <label><FiDroplet style={{color: '#ff4d4d'}} /> Blood Group</label>
              <span className="badge badge-error">{patient.bloodGroup || 'O+'}</span>
            </div>
            <div className="clinical-item">
              <label><FiHeart /> Age</label>
              <span>{patient.age || 35} Years</span>
            </div>
            <div className="clinical-item">
              <label><FiActivity /> Last Symptom</label>
              <span>{patient.lastReportedSymptom || 'Mild fatigue'}</span>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="form-label"><FiFileText /> Medical History</label>
            <div className="history-box">
              {patient.medicalHistory || 'No major clinical records found.'}
            </div>
          </div>
          
          <div className="form-group" style={{ marginTop: '15px' }}>
            <label className="form-label"><FiActivity /> Attached Reports</label>
            <div className="reports-list">
              {(patient.reports || []).map(report => (
                <div key={report} className="report-link">
                  <FiFileText /> {report}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-primary btn-full" onClick={onClose}>
            Close Clinical View
          </button>
        </div>
      </div>
    </div>
  );
}
