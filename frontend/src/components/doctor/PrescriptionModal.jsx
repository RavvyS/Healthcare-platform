import { useState } from 'react';
import { FiX, FiFileText, FiSave, FiCalendar } from 'react-icons/fi';
import { issuePrescription } from '../../api/doctorApi';

export default function PrescriptionModal({ appointment, onClose, onSuccess }) {
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  if (!appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await issuePrescription(appointment.id, { details, date });
      onSuccess('Prescription issued successfully', 'success');
      onClose();
    } catch {
      onSuccess('Failed to issue prescription', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <div className="card-header-left">
            <div className="card-header-icon blue">
              <FiFileText />
            </div>
            <div>
              <h3>Issue Prescription</h3>
              <p>For Appointment #{appointment.id}</p>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label"><FiCalendar /> Prescription Date</label>
              <input 
                type="date" 
                value={date} 
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label className="form-label"><FiFileText /> Medical Instructions / Medication</label>
              <textarea 
                placeholder="Type dosage, medication, and advice here..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={{ height: '150px' }}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-ghost" type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              <FiSave /> {saving ? 'Issuing...' : 'Issue Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
