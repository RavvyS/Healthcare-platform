import {
  FiCheckCircle, FiXCircle, FiClock, FiAward, FiAlertCircle,
  FiLoader, FiInbox, FiSun, FiMoon, FiWifi, FiMapPin, FiAlertTriangle
} from 'react-icons/fi';
import { MdOutlineVerified } from 'react-icons/md';

/* ── Toast ─────────────────────────────── */
const TOAST_ICON = {
  success: <FiCheckCircle size={16} />,
  error:   <FiXCircle     size={16} />,
  warning: <FiAlertTriangle size={16} />,
  info:    <FiAlertCircle size={16} />,
};

export function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          {TOAST_ICON[t.type] || TOAST_ICON.info}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ── StatusBadge ────────────────────────── */
const STATUS_META = {
  PENDING:   { icon: <FiClock size={10} />,        cls: 'badge badge-pending'   },
  CONFIRMED: { icon: <FiCheckCircle size={10} />,  cls: 'badge badge-confirmed' },
  CANCELLED: { icon: <FiXCircle size={10} />,      cls: 'badge badge-cancelled' },
  COMPLETED: { icon: <MdOutlineVerified size={10}/>,cls: 'badge badge-completed' },
  REJECTED:  { icon: <FiXCircle size={10} />,      cls: 'badge badge-rejected'  },
  UNPAID:    { icon: <FiAlertCircle size={10} />,  cls: 'badge badge-unpaid'    },
};

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { icon: null, cls: 'badge' };
  return (
    <span className={meta.cls}>
      {meta.icon}
      {status}
    </span>
  );
}

/* ── ConsultationBadge ──────────────────── */
export function ConsultationBadge({ type }) {
  if (!type) return null;
  const isOnline = type === 'ONLINE';
  return (
    <span className={`badge ${isOnline ? 'badge-online' : 'badge-physical'}`}>
      {isOnline ? <FiWifi size={10} /> : <FiMapPin size={10} />}
      {isOnline ? 'Online' : 'Physical'}
    </span>
  );
}

/* ── Loading ────────────────────────────── */
export function Loading({ text = 'Loading data...' }) {
  return (
    <div className="loading">
      <div className="loading-spinner" />
      <p>{text}</p>
    </div>
  );
}

/* ── EmptyState ─────────────────────────── */
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon || <FiInbox />}</div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}

/* ── ThemeToggle ────────────────────────── */
export function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="icon-btn" onClick={onToggle} title="Toggle theme">
      {theme === 'light' ? <FiMoon size={15} /> : <FiSun size={15} />}
    </button>
  );
}
