import { useState, useEffect, useCallback } from 'react';
import { getReports, addReport } from '../api/patientApi';

/**
 * useMedicalReports
 * Manages fetching and adding medical reports for a patient.
 *
 * @param {string|number} patientId  — replace with JWT-decoded ID in production
 */
export function useMedicalReports(patientId) {
  const [reports,    setReports]   = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]     = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────
  const fetchReports = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getReports(patientId);
      setReports(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load medical reports');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ── Add New Report ─────────────────────────────────────────────────
  const submitReport = useCallback(async (reportData) => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await addReport(patientId, reportData);
      setReports((prev) => [created, ...prev]);
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to add report';
      setError(message);
      return { success: false, message };
    } finally {
      setSubmitting(false);
    }
  }, [patientId]);

  return { reports, loading, submitting, error, submitReport, refetch: fetchReports };
}
