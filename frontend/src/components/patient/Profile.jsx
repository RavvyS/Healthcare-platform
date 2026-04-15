import { useState } from 'react';
import {
  FiUser, FiSave, FiRefreshCw, FiCheckCircle,
  FiAlertCircle, FiEdit3, FiEye,
} from 'react-icons/fi';
import { Loading } from '../common/UI';
import { usePatientProfile } from '../../hooks/usePatientProfile';
import ProfileForm from './ProfileForm';

/**
 * Profile
 * Full patient-profile page:
 *   – Fetches profile via usePatientProfile hook
 *   – Supports view / edit toggle
 *   – Saves via PUT /api/patients/{id}/profile
 *   – Shows success / error banners inline
 */
export default function Profile({ patientId, onSuccess }) {
  const { profile, setProfile, loading, saving, error, saveProfile } =
    usePatientProfile(patientId);

  const [editMode, setEditMode] = useState(false);
  const [draft,    setDraft]    = useState(null);
  const [banner,   setBanner]   = useState(null); // { type: 'success'|'error', msg }

  /* ── Enter edit mode: clone current profile into draft ─────────── */
  const startEdit = () => {
    setDraft({ ...profile });
    setEditMode(true);
    setBanner(null);
  };

  /* ── Cancel edit ───────────────────────────────────────────────── */
  const cancelEdit = () => {
    setDraft(null);
    setEditMode(false);
  };

  /* ── Submit ─────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await saveProfile(draft);
    if (result.success) {
      setProfile(draft);
      setEditMode(false);
      setDraft(null);
      setBanner({ type: 'success', msg: 'Profile updated successfully!' });
      onSuccess?.('Profile updated successfully!', 'success');
    } else {
      setBanner({ type: 'error', msg: result.message || 'Failed to update profile.' });
      onSuccess?.(result.message || 'Failed to update profile.', 'error');
    }
    setTimeout(() => setBanner(null), 4000);
  };

  /* ── Loading ──────────────────────────────────────────────────────── */
  if (loading) return <Loading text="Loading your profile…" />;

  /* ── API error with no data yet ───────────────────────────────────── */
  if (error && !profile) {
    return (
      <div className="patient-error-state">
        <FiAlertCircle size={32} />
        <h3>Could not load profile</h3>
        <p>{error}</p>
      </div>
    );
  }

  const displayProfile = editMode ? draft : profile;

  return (
    <div className="section-gap">
      {/* ── Hero strip ───────────────────────────── */}
      <div className="profile-hero">
        <div className="profile-hero-avatar">
          {(profile?.fullName || 'P').charAt(0).toUpperCase()}
        </div>
        <div className="profile-hero-info">
          <span className="hero-kicker">Patient Profile</span>
          <h3 className="profile-hero-name">
            {profile?.fullName || 'Your Profile'}
          </h3>
          <p className="profile-hero-sub">
            {profile?.email || '—'} &nbsp;·&nbsp; {profile?.phone || '—'}
          </p>
        </div>
        <div className="profile-hero-actions">
          {!editMode ? (
            <button
              id="profile-edit-btn"
              className="btn btn-outline"
              onClick={startEdit}
            >
              <FiEdit3 size={15} /> Edit Profile
            </button>
          ) : (
            <button
              id="profile-view-btn"
              className="btn btn-ghost"
              onClick={cancelEdit}
            >
              <FiEye size={15} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── Inline banner ────────────────────────── */}
      {banner && (
        <div className={`profile-banner ${banner.type}`}>
          {banner.type === 'success'
            ? <FiCheckCircle size={16} />
            : <FiAlertCircle size={16} />}
          {banner.msg}
        </div>
      )}

      {/* ── Form card ────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon blue">
              <FiUser />
            </div>
            <div>
              <h3>{editMode ? 'Edit Profile' : 'Profile Details'}</h3>
              <p>
                {editMode
                  ? 'Update your personal and medical information below.'
                  : 'Your health and contact details stored securely.'}
              </p>
            </div>
          </div>
        </div>

        <div className="card-body">
          <form id="patient-profile-form" onSubmit={handleSubmit}>
            <ProfileForm
              profile={displayProfile || {}}
              onChange={editMode ? setDraft : () => {}}
              disabled={!editMode || saving}
            />

            {editMode && (
              <div className="profile-form-actions">
                <button
                  id="profile-save-btn"
                  className="btn btn-primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? (
                    <><span className="spinner" /> Saving…</>
                  ) : (
                    <><FiSave /> Save Changes</>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  <FiRefreshCw size={14} /> Discard
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ── Quick-info strip ─────────────────────── */}
      {profile && !editMode && (
        <div className="profile-quick-strip">
          <div className="profile-quick-item">
            <span className="profile-quick-label">Blood Group</span>
            <span className="profile-quick-value blood-group">
              {profile.bloodGroup || '—'}
            </span>
          </div>
          <div className="profile-quick-item">
            <span className="profile-quick-label">Allergies</span>
            <span className="profile-quick-value">
              {profile.allergies || 'None recorded'}
            </span>
          </div>
          <div className="profile-quick-item">
            <span className="profile-quick-label">Emergency Contact</span>
            <span className="profile-quick-value">
              {profile.emergencyContact || '—'}
            </span>
          </div>
          <div className="profile-quick-item">
            <span className="profile-quick-label">Medical Notes</span>
            <span className="profile-quick-value">
              {profile.medicalNotes || 'None recorded'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
