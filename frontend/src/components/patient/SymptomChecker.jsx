import { useState } from 'react';
import { FiActivity, FiAlertTriangle, FiArrowRightCircle } from 'react-icons/fi';
import { analyzeSymptoms } from '../../api/symptomCheckerApi';

export default function SymptomChecker({ onSuccess }) {
  const [form, setForm] = useState({ symptoms: '', age: 30, severity: 2 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await analyzeSymptoms({
        symptoms: form.symptoms,
        age: Number(form.age),
        severity: Number(form.severity),
      });
      setResult(response);
      onSuccess('AI symptom check completed', 'success');
    } catch {
      onSuccess('Failed to analyze symptoms', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-header-icon purple">
            <FiActivity />
          </div>
          <div>
            <h3>AI Symptom Checker</h3>
            <p>Get a preliminary suggestion and specialty recommendation</p>
          </div>
        </div>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" min="1" max="120" value={form.age} onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Severity (1-5)</label>
              <input type="number" min="1" max="5" value={form.severity} onChange={(e) => setForm((prev) => ({ ...prev, severity: e.target.value }))} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label"><FiAlertTriangle /> Symptoms</label>
            <textarea
              value={form.symptoms}
              onChange={(e) => setForm((prev) => ({ ...prev, symptoms: e.target.value }))}
              placeholder="Describe the symptoms, duration, and any triggers..."
              required
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              <FiArrowRightCircle /> {loading ? 'Analyzing...' : 'Run AI Assessment'}
            </button>
          </div>
        </form>

        {result && (
          <>
            <div className="divider" />
            <div className="doctor-preview" style={{ alignItems: 'flex-start' }}>
              <div className="doctor-preview-avatar">
                AI
              </div>
              <div className="doctor-preview-info">
                <h4>{result.recommendedSpecialty}</h4>
                <p>{result.summary}</p>
                <div className="appt-meta-chip" style={{ marginTop: 8 }}>Urgency: {result.urgency}</div>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {result.suggestedNextSteps.map((step) => (
                    <span className="appt-meta-chip" key={step}>{step}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
