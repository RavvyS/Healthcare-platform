import {
  FiUser, FiMail, FiPhone, FiMapPin,
  FiDroplet, FiAlertCircle, FiUserCheck, FiFileText,
} from 'react-icons/fi';

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

/**
 * ProfileForm
 * Pure presentational form — controlled by parent via `profile` + `onChange`.
 */
export default function ProfileForm({ profile, onChange, disabled }) {
  const handle = (field) => (e) =>
    onChange((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="profile-form-wrapper">
      {/* ── Row 1 ────────────────── */}
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label"><FiUser /> Full Name</label>
          <input
            id="patient-fullName"
            value={profile.fullName || ''}
            onChange={handle('fullName')}
            placeholder="Jane Doe"
            disabled={disabled}
          />
        </div>
        <div className="form-group">
          <label className="form-label"><FiMail /> Email Address</label>
          <input
            id="patient-email"
            type="email"
            value={profile.email || ''}
            onChange={handle('email')}
            placeholder="jane@example.com"
            disabled={disabled}
          />
        </div>
        <div className="form-group">
          <label className="form-label"><FiPhone /> Phone</label>
          <input
            id="patient-phone"
            value={profile.phone || ''}
            onChange={handle('phone')}
            placeholder="+94 77 000 0000"
            disabled={disabled}
          />
        </div>
        <div className="form-group">
          <label className="form-label"><FiMapPin /> Address</label>
          <input
            id="patient-address"
            value={profile.address || ''}
            onChange={handle('address')}
            placeholder="123 Main St, Colombo"
            disabled={disabled}
          />
        </div>
        <div className="form-group">
          <label className="form-label"><FiDroplet /> Blood Group</label>
          <select
            id="patient-bloodGroup"
            value={profile.bloodGroup || ''}
            onChange={handle('bloodGroup')}
            disabled={disabled}
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg || '— select —'}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label"><FiUserCheck /> Emergency Contact</label>
          <input
            id="patient-emergencyContact"
            value={profile.emergencyContact || ''}
            onChange={handle('emergencyContact')}
            placeholder="Name — +94 77 000 0001"
            disabled={disabled}
          />
        </div>
      </div>

      {/* ── Row 2 — wide fields ───── */}
      <div className="form-group" style={{ marginTop: 20 }}>
        <label className="form-label"><FiAlertCircle /> Known Allergies</label>
        <textarea
          id="patient-allergies"
          value={profile.allergies || ''}
          onChange={handle('allergies')}
          placeholder="e.g. Penicillin, Peanuts…"
          disabled={disabled}
        />
      </div>
      <div className="form-group" style={{ marginTop: 16 }}>
        <label className="form-label"><FiFileText /> Medical Notes</label>
        <textarea
          id="patient-medicalNotes"
          value={profile.medicalNotes || ''}
          onChange={handle('medicalNotes')}
          placeholder="Pre-existing conditions, chronic medications…"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
