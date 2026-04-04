export function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'success' ? '✅' : '❌'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function StatusBadge({ status }) {
  const icons = {
    PENDING: '🕐', CONFIRMED: '✅', CANCELLED: '❌',
    COMPLETED: '🎉', REJECTED: '🚫',
  };
  return (
    <span className={`status-badge ${status}`}>
      {icons[status] || '•'} {status}
    </span>
  );
}

export function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
      Loading...
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}
