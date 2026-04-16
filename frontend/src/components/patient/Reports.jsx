import { useState } from 'react';
import {
  FiUploadCloud, FiList, FiRefreshCw,
  FiAlertCircle, FiCheckCircle,
} from 'react-icons/fi';
import { Loading } from '../common/UI';
import { useMedicalReports } from '../../hooks/useMedicalReports';
import ReportForm from './ReportForm';
import ReportList from './ReportList';

const TABS = [
  { id: 'list',   label: 'My Reports',  icon: <FiList size={14} /> },
  { id: 'add',    label: 'Add Report',  icon: <FiUploadCloud size={14} /> },
];

/**
 * Reports
 * Full medical-reports page:
 *   – Fetch all reports via useMedicalReports hook
 *   – Display in ReportList
 *   – Add a new report via ReportForm
 *   – Refresh list after adding
 *   – Inline success / error banners
 */
export default function Reports({ patientId, onSuccess }) {
  const { reports, loading, submitting, error, submitReport, refetch } =
    useMedicalReports(patientId);

  const [activeTab, setActiveTab] = useState('list');
  const [banner,    setBanner]    = useState(null);

  /* ── Handle report submission ────────────────────────────────────── */
  const handleAddReport = async (data) => {
    const result = await submitReport(data);
    if (result.success) {
      setBanner({ type: 'success', msg: 'Report added successfully!' });
      onSuccess?.('Medical report added!', 'success');
      setActiveTab('list');
    } else {
      setBanner({ type: 'error', msg: result.message || 'Failed to add report.' });
      onSuccess?.(result.message || 'Failed to add report.', 'error');
    }
    setTimeout(() => setBanner(null), 4000);
    return result;
  };

  /* ── Loading ─────────────────────────────────────────────────────── */
  if (loading) return <Loading text="Loading your medical reports…" />;

  /* ── API error with no data yet ──────────────────────────────────── */
  if (error && reports.length === 0) {
    return (
      <div className="patient-error-state">
        <FiAlertCircle size={32} />
        <h3>Could not load reports</h3>
        <p>{error}</p>
        <button className="btn btn-outline" onClick={refetch} style={{ marginTop: 16 }}>
          <FiRefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="section-gap">
      {/* ── Hero strip ────────────────────────────── */}
      <div className="hero-panel">
        <div className="hero-panel-copy">
          <span className="hero-kicker">Medical Records</span>
          <h3>Your health reports, always accessible</h3>
          <p>
            Upload lab results, imaging reports, or specialist referrals.
            Share with your doctor before every consultation.
          </p>
        </div>
        <div className="hero-panel-card">
          <div className="hero-mini-label">Total Reports</div>
          <div className="hero-mini-title" style={{ fontSize: '2.4rem' }}>
            {reports.length}
          </div>
          <button
            id="reports-refresh-btn"
            className="btn btn-ghost btn-sm"
            onClick={refetch}
            style={{ marginTop: 8 }}
          >
            <FiRefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Banner ────────────────────────────────── */}
      {banner && (
        <div className={`profile-banner ${banner.type}`}>
          {banner.type === 'success'
            ? <FiCheckCircle size={16} />
            : <FiAlertCircle size={16} />}
          {banner.msg}
        </div>
      )}

      {/* ── Tabs ──────────────────────────────────── */}
      <div className="filter-tabs" role="tablist" aria-label="Reports tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`reports-tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'list' && (
              <span className="tab-count">{reports.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: List ─────────────────────────────── */}
      {activeTab === 'list' && (
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-header-icon purple">
                <FiList />
              </div>
              <div>
                <h3>Report History</h3>
                <p>All uploaded medical documents and test results</p>
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setActiveTab('add')}
              id="reports-add-btn"
            >
              <FiUploadCloud size={13} /> Add Report
            </button>
          </div>
          <div className="card-body">
            <ReportList reports={reports} />
          </div>
        </div>
      )}

      {/* ── Tab: Add ──────────────────────────────── */}
      {activeTab === 'add' && (
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-header-icon blue">
                <FiUploadCloud />
              </div>
              <div>
                <h3>Add New Report</h3>
                <p>Submit a lab result, scan reference, or specialist document</p>
              </div>
            </div>
          </div>
          <div className="card-body">
            <ReportForm onSubmit={handleAddReport} submitting={submitting} />
          </div>
        </div>
      )}
    </div>
  );
}
