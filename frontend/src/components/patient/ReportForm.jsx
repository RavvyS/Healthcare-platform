import { useState } from 'react';
import { FiUploadCloud, FiFileText, FiLink, FiTag, FiAlignLeft } from 'react-icons/fi';

const REPORT_TYPES = [
  '', 'Blood Test', 'Urine Test', 'X-Ray', 'MRI Scan',
  'CT Scan', 'Ultrasound', 'ECG', 'Biopsy', 'Prescription',
  'Referral Letter', 'Discharge Summary', 'Other',
];

const emptyForm = {
  reportName: '',
  reportType: '',
  documentUrl: '',
  notes: '',
};

/**
 * ReportForm
 * Self-contained form that calls `onSubmit(data)` with the report payload.
 */
export default function ReportForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(emptyForm);

  const handle = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit({ ...form });
    if (result?.success) setForm(emptyForm);
  };

  return (
    <form onSubmit={handleSubmit} id="report-form" aria-label="Add Medical Report">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label"><FiFileText /> Report Name</label>
          <input
            id="report-name"
            value={form.reportName}
            onChange={handle('reportName')}
            placeholder="e.g. Annual Blood Panel"
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label className="form-label"><FiTag /> Report Type</label>
          <select
            id="report-type"
            value={form.reportType}
            onChange={handle('reportType')}
            required
            disabled={submitting}
          >
            {REPORT_TYPES.map((t) => (
              <option key={t} value={t}>{t || '— select type —'}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: 16 }}>
        <label className="form-label"><FiLink /> Document URL</label>
        <input
          id="report-documentUrl"
          type="url"
          value={form.documentUrl}
          onChange={handle('documentUrl')}
          placeholder="https://drive.google.com/report.pdf"
          disabled={submitting}
        />
      </div>

      <div className="form-group" style={{ marginTop: 16 }}>
        <label className="form-label"><FiAlignLeft /> Notes</label>
        <textarea
          id="report-notes"
          value={form.notes}
          onChange={handle('notes')}
          placeholder="Brief summary for your doctor…"
          disabled={submitting}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          id="report-submit-btn"
          className="btn btn-primary"
          type="submit"
          disabled={submitting}
        >
          <FiUploadCloud />
          {submitting ? 'Uploading…' : 'Add Report'}
        </button>
      </div>
    </form>
  );
}
