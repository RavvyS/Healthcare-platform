import { FiFileText, FiExternalLink, FiCalendar, FiTag } from 'react-icons/fi';
import { EmptyState } from '../common/UI';

/**
 * ReportList
 * Displays a list of medical reports in a rich card-table hybrid layout.
 */
export default function ReportList({ reports }) {
  if (!reports || reports.length === 0) {
    return (
      <EmptyState
        icon={<FiFileText />}
        title="No reports yet"
        subtitle="Upload lab tests, scans, or referral documents — they'll appear here."
      />
    );
  }

  return (
    <div className="report-list" role="list">
      {reports.map((report, idx) => (
        <div
          key={report.id ?? idx}
          className="report-item"
          role="listitem"
          id={`report-item-${report.id ?? idx}`}
        >
          {/* ── Left: avatar + info ── */}
          <div className="report-item-left">
            <div className="report-avatar">
              <FiFileText />
            </div>
            <div className="report-info">
              <h4 className="report-name">{report.reportName}</h4>
              <div className="report-meta">
                <span className="report-chip">
                  <FiTag size={11} />
                  {report.reportType || 'General'}
                </span>
                {report.uploadedAt && (
                  <span className="report-chip">
                    <FiCalendar size={11} />
                    {new Date(report.uploadedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </span>
                )}
                {report.notes && (
                  <span className="report-chip report-chip-note">
                    {report.notes}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: action ── */}
          <div className="report-item-right">
            <span
              className={`badge ${
                report.reportType === 'Blood Test'   ? 'badge-confirmed'  :
                report.reportType === 'X-Ray'        ? 'badge-online'     :
                report.reportType === 'MRI Scan'     ? 'badge-completed'  :
                report.reportType === 'Prescription' ? 'badge-pending'    :
                'badge-unpaid'
              }`}
            >
              {report.reportType || 'General'}
            </span>
            {report.documentUrl ? (
              <a
                className="btn btn-sm btn-outline"
                href={report.documentUrl}
                target="_blank"
                rel="noreferrer"
                id={`report-open-${report.id ?? idx}`}
              >
                <FiExternalLink size={13} />
                Open
              </a>
            ) : (
              <span className="report-no-url">No file</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
