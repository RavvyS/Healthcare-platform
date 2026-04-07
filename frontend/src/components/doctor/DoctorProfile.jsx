import { useEffect, useState } from 'react';
import { FiBriefcase, FiMail, FiMapPin, FiSave, FiUser } from 'react-icons/fi';
import { getDoctorById, updateDoctorProfile } from '../../api/doctorApi';
import { Loading } from '../common/UI';

const initialProfile = {
  name: '',
  email: '',
  specialization: '',
  hospital: '',
  consultationFee: '',
  availability: '',
  verified: false,
};

export default function DoctorProfile({ doctorId, onSuccess }) {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getDoctorById(doctorId);
        setProfile({ ...initialProfile, ...data });
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
    <div className="card">
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
              <input value={profile.name || ''} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label"><FiMail /> Email</label>
              <input value={profile.email || ''} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label"><FiBriefcase /> Specialization</label>
              <input value={profile.specialization || ''} onChange={(e) => setProfile((prev) => ({ ...prev, specialization: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label"><FiMapPin /> Hospital / Clinic</label>
              <input value={profile.hospital || ''} onChange={(e) => setProfile((prev) => ({ ...prev, hospital: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Consultation Fee</label>
              <input type="number" value={profile.consultationFee || ''} onChange={(e) => setProfile((prev) => ({ ...prev, consultationFee: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Verification Status</label>
              <input value={profile.verified ? 'Verified by admin' : 'Pending admin verification'} disabled />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label">Availability Summary</label>
            <textarea value={profile.availability || ''} onChange={(e) => setProfile((prev) => ({ ...prev, availability: e.target.value }))} />
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              <FiSave /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
