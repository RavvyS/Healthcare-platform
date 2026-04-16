import { useEffect, useState } from 'react';
import { FiFileText, FiSave, FiUploadCloud, FiUser, FiShield, FiPhone, FiMapPin } from 'react-icons/fi';
import { EmptyState, Loading } from '../common/UI';
import {
  addPatientReport,
  getPatientProfile,
  getPatientReports,
  updatePatientProfile,
} from '../../api/patientApi';
import { getPatientPrescriptions } from '../../api/doctorApi';

const emptyProfile = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  bloodGroup: '',
  allergies: '',
  emergencyContact: '',
  medicalNotes: '',
};

const emptyReport = {
  reportName: '',
  reportType: '',
  notes: '',
  documentUrl: '',
};

export default function PatientRecords({ patientId, onSuccess }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [reportForm, setReportForm] = useState(emptyReport);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profileData, reportData, prescriptionData] = await Promise.all([
          getPatientProfile(patientId),
          getPatientReports(patientId),
          getPatientPrescriptions(patientId).catch(() => []),
        ]);
        setProfile(profileData);
        setReports(reportData);
        setPrescriptions(prescriptionData);
      } catch {
        onSuccess('Failed to load patient records', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [patientId, onSuccess]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updatePatientProfile(patientId, profile);
      setProfile(updated);
      onSuccess('Patient profile updated', 'success');
    } catch {
      onSuccess('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const uploadReport = async (event) => {
    event.preventDefault();
    setUploading(true);
    try {
      const created = await addPatientReport(patientId, reportForm);
      setReports((prev) => [created, ...prev]);
      setReportForm(emptyReport);
      onSuccess('Medical report added to history', 'success');
    } catch {
      onSuccess('Failed to upload report metadata', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loading text="Loading your profile and medical records..." />;

  return (
    <div className="section-gap">
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon blue">
              <FiUser />
            </div>
            <div>
              <h3>Patient Profile</h3>
              <p>Keep your health and contact details current</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={saveProfile}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label"><FiUser /> Full Name</label>
                <input value={profile.fullName || ''} onChange={(e) => setProfile((prev) => ({ ...prev, fullName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label"><FiShield /> Email</label>
                <input value={profile.email || ''} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label"><FiPhone /> Phone</label>
                <input value={profile.phone || ''} onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label"><FiMapPin /> Address</label>
                <input value={profile.address || ''} onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <input value={profile.bloodGroup || ''} onChange={(e) => setProfile((prev) => ({ ...prev, bloodGroup: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Emergency Contact</label>
                <input value={profile.emergencyContact || ''} onChange={(e) => setProfile((prev) => ({ ...prev, emergencyContact: e.target.value }))} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Allergies</label>
              <textarea value={profile.allergies || ''} onChange={(e) => setProfile((prev) => ({ ...prev, allergies: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Medical Notes</label>
              <textarea value={profile.medicalNotes || ''} onChange={(e) => setProfile((prev) => ({ ...prev, medicalNotes: e.target.value }))} />
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                <FiSave /> {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon purple">
              <FiUploadCloud />
            </div>
            <div>
              <h3>Medical Reports</h3>
              <p>Upload lab, scan, and referral references</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={uploadReport}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Report Name</label>
                <input value={reportForm.reportName} onChange={(e) => setReportForm((prev) => ({ ...prev, reportName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Report Type</label>
                <input value={reportForm.reportType} onChange={(e) => setReportForm((prev) => ({ ...prev, reportType: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Document URL</label>
              <input value={reportForm.documentUrl} onChange={(e) => setReportForm((prev) => ({ ...prev, documentUrl: e.target.value }))} placeholder="https://example.com/report.pdf" />
            </div>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Notes</label>
              <textarea value={reportForm.notes} onChange={(e) => setReportForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Short summary for your doctor" />
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-primary" type="submit" disabled={uploading}>
                <FiUploadCloud /> {uploading ? 'Uploading...' : 'Add Report'}
              </button>
            </div>
          </form>

          <div className="divider" />

          {reports.length === 0 ? (
            <EmptyState icon={<FiFileText />} title="No reports yet" subtitle="Uploaded lab tests, scans, and referral notes will appear here." />
          ) : (
            <div className="appointment-list">
              {reports.map((report) => (
                <div className="appt-item" key={report.id}>
                  <div className="appt-item-left">
                    <div className="appt-avatar doctor">
                      <FiFileText />
                    </div>
                    <div className="appt-info">
                      <h4>{report.reportName}</h4>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip">{report.reportType}</span>
                        <span className="appt-meta-chip">{new Date(report.uploadedAt).toLocaleString()}</span>
                      </div>
                      {report.notes && <div className="appt-meta-chip" style={{ marginTop: 4 }}>{report.notes}</div>}
                    </div>
                  </div>
                  <div className="appt-item-right">
                    {report.documentUrl && (
                      <a className="btn btn-sm btn-outline" href={report.documentUrl} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    )}
                  </div>
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
              <h3>Prescription History</h3>
              <p>Digital prescriptions issued by doctors</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {prescriptions.length === 0 ? (
            <EmptyState icon={<FiShield />} title="No prescriptions yet" subtitle="Digital prescriptions will appear here after consultations." />
          ) : (
            <div className="appointment-list">
              {prescriptions.map((prescription) => (
                <div className="appt-item" key={prescription.id}>
                  <div className="appt-item-left">
                    <div className="appt-avatar patient">
                      Rx
                    </div>
                    <div className="appt-info">
                      <h4>{prescription.medication}</h4>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip">{prescription.dosage}</span>
                        <span className="appt-meta-chip">{new Date(prescription.issuedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="appt-meta-chip" style={{ marginTop: 4 }}>{prescription.instructions}</div>
                    </div>
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
