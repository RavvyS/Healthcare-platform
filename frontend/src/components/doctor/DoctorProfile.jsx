import { useEffect, useState } from 'react';
import { FiBriefcase, FiMail, FiMapPin, FiSave, FiUser, FiPhone } from 'react-icons/fi';
import { getDoctorById, updateDoctorProfile } from '../../api/doctorApi';
import { Loading } from '../common/UI';

const initialProfile = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  hospital: '',
  consultationFee: '',
  availability: '',
  verified: false,
};

const MEDICAL_SPECIALIZATIONS = [
  'General Physician',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Oncology',
  'Gastroenterology',
  'Psychiatry',
  'Radiology',
  'Ophthalmology',
  'General Surgery',
  'Internal Medicine',
  'ENT (Otolaryngology)',
  'Obstetrics & Gynecology',
  'Urology',
  'Nephrology',
  'Pulmonology',
  'Hematology',
  'Endocrinology',
  'Rheumatology',
  'Anesthesiology',
  'Emergency Medicine',
  'Family Medicine',
  'Infectious Diseases',
  'Pathology',
  'Physical Medicine & Rehabilitation',
  'Sports Medicine'
];

export default function DoctorProfile({ doctorId, user, onSuccess }) {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getDoctorById(doctorId);
        
        // Pre-fill name and email from login session if missing in data
        const mergedProfile = { ...initialProfile, ...data };
        if (!mergedProfile.name && user?.fullName) mergedProfile.name = user.fullName;
        if (!mergedProfile.email && user?.email) mergedProfile.email = user.email;
        
        setProfile(mergedProfile);
      } catch {
        onSuccess('Failed to load doctor profile', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [doctorId, onSuccess]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateDoctorProfile(doctorId, {
        ...profile,
        consultationFee: Number(profile.consultationFee || 0),
      });
      setProfile({ ...initialProfile, ...updated });
      onSuccess('Doctor profile updated', 'success');
    } catch {
      onSuccess('Failed to update doctor profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text="Loading doctor profile..." />;

  return (
    <div className="card shadow-glass">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-header-icon blue">
            <FiUser />
          </div>
          <div>
            <h3>Doctor Profile</h3>
            <p>Maintain your consultation details and public listing</p>
          </div>
        </div>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label"><FiUser /> Full Name</label>
              <input value={profile.name || ''} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g. Dr. Amal Perera" />
            </div>
            <div className="form-group">
              <label className="form-label"><FiMail /> Email</label>
              <input value={profile.email || ''} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} placeholder="email@address.com" />
            </div>
            <div className="form-group">
              <label className="form-label"><FiPhone /> Phone Number</label>
              <input value={profile.phone || ''} onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))} placeholder="+94 7X XXX XXXX" />
            </div>
            <div className="form-group">
              <label className="form-label"><FiBriefcase /> Specialization</label>
              <select 
                value={profile.specialization || ''} 
                onChange={(e) => setProfile((prev) => ({ ...prev, specialization: e.target.value }))}
                required
              >
                <option value="">Select Specialty</option>
                {MEDICAL_SPECIALIZATIONS.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label"><FiMapPin /> Hospital / Clinic</label>
              <input value={profile.hospital || ''} onChange={(e) => setProfile((prev) => ({ ...prev, hospital: e.target.value }))} placeholder="Hospital Name" />
            </div>
            <div className="form-group">
              <label className="form-label">Consultation Fee (LKR)</label>
              <input type="number" value={profile.consultationFee || ''} onChange={(e) => setProfile((prev) => ({ ...prev, consultationFee: e.target.value }))} placeholder="2500" />
            </div>
            <div className="form-group">
              <label className="form-label">Verification Status</label>
              <input value={profile.verified ? '✓ Verified Practitioner' : '⚠️ Pending admin verification'} disabled style={{ fontWeight: 600, color: profile.verified ? 'var(--success)' : 'var(--warning)' }} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label">Professional Bio / Availability Summary</label>
            <textarea value={profile.availability || ''} onChange={(e) => setProfile((prev) => ({ ...prev, availability: e.target.value }))} placeholder="Briefly describe your clinical experience..."/>
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-primary btn-full" type="submit" disabled={saving}>
              <FiSave /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
