import { useState, useEffect, useCallback } from 'react';
import { getProfile, updateProfile } from '../api/patientApi';

/**
 * usePatientProfile
 * Manages fetching and updating a patient profile.
 *
 * @param {string|number} patientId  — replace with JWT-decoded ID in production
 * @param {string} userEmail — Email from login session
 */
export function usePatientProfile(patientId, userEmail) {
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [error,   setError]     = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile(patientId);
      
      // Auto-fetch email from login context if not in profile
      if (!data.email && userEmail) {
        data.email = userEmail;
      }
      
      setProfile(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load patient profile');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ── Update ─────────────────────────────────────────────────────────
  const saveProfile = useCallback(async (profileData) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile(patientId, profileData);
      setProfile(updated);
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to update profile';
      setError(message);
      return { success: false, message };
    } finally {
      setSaving(false);
    }
  }, [patientId]);

  return { profile, setProfile, loading, saving, error, saveProfile, refetch: fetchProfile };
}
