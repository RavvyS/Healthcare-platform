import { useEffect, useState } from 'react';
import { FiActivity, FiCheckCircle, FiShield, FiUsers, FiUserCheck, FiBell } from 'react-icons/fi';
import { getUserStats, getUsers, updateUserStatus } from '../../api/authApi';
import { getDoctors, updateDoctorVerification } from '../../api/doctorApi';
import { getNotifications } from '../../api/notificationApi';
import { EmptyState, Loading } from '../common/UI';

export default function AdminDashboard({ onSuccess }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [statsData, userData, doctorData, notificationData] = await Promise.all([
        getUserStats(),
        getUsers(),
        getDoctors().catch(() => []),
        getNotifications().catch(() => []),
      ]);
      setStats(statsData);
      setUsers(userData);
      setDoctors(doctorData);
      setNotifications(notificationData);
    } catch {
      onSuccess('Failed to load admin dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUserStatus = async (id, status) => {
    try {
      const updated = await updateUserStatus(id, status);
      setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
      setStats((prev) => prev ? {
        ...prev,
        activeCount: status === 'ACTIVE' ? prev.activeCount + 1 : Math.max(prev.activeCount - 1, 0),
      } : prev);
      onSuccess(`User updated to ${status}`, 'success');
      load();
    } catch {
      onSuccess('Failed to update user status', 'error');
    }
  };

  const handleDoctorVerification = async (id, verified) => {
    try {
      const updated = await updateDoctorVerification(id, verified);
      setDoctors((prev) => prev.map((doctor) => (doctor.id === id ? updated : doctor)));
      onSuccess(`Doctor ${verified ? 'verified' : 'marked unverified'}`, 'success');
    } catch {
      onSuccess('Failed to update doctor verification', 'error');
    }
  };

  if (loading) return <Loading text="Loading administrative controls..." />;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: <FiUsers /> },
    { label: 'Doctors', value: stats?.doctorCount ?? 0, icon: <FiUserCheck /> },
    { label: 'Active Accounts', value: stats?.activeCount ?? 0, icon: <FiCheckCircle /> },
    { label: 'Pending Verification', value: stats?.pendingVerificationCount ?? 0, icon: <FiShield />, color: '#f59e0b' },
  ];

  const pendingUsers = users.filter(u => u.accountStatus === 'PENDING_VERIFICATION');
  const managedUsers = users.filter(u => u.accountStatus !== 'PENDING_VERIFICATION');

  return (
    <div className="section-gap">
      <div className="stats-grid">
        {statCards.map((card) => (
          <div className="stat-card" key={card.label} style={card.color ? { borderColor: card.color } : {}}>
            <div className="stat-icon" style={card.color ? { color: card.color } : {}}>{card.icon}</div>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">{card.value}</div>
          </div>
        ))}
      </div>

      {/* --- SECTION 1: VERIFICATION REQUESTS --- */}
      <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon amber">
              <FiShield />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ margin: 0 }}>Verification Requests</h3>
                {pendingUsers.length > 0 && (
                  <span className="badge badge-warning">{pendingUsers.length} Pending</span>
                )}
              </div>
              <p>Approve new registrations for Doctors and Patients</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {pendingUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
              <FiCheckCircle size={32} style={{ marginBottom: 10, color: '#10b981' }} />
              <p>All clear! No employee or patient registrations are pending verification.</p>
            </div>
          ) : (
            <div className="appointment-list">
              {pendingUsers.map((user) => (
                <div className="appt-item" key={user.id} style={{ borderLeft: user.role === 'DOCTOR' ? '3px solid #6366f1' : 'none' }}>
                  <div className="appt-item-left">
                    <div className={`appt-avatar ${user.role === 'DOCTOR' ? 'doctor' : 'patient'}`}>
                      {user.role === 'DOCTOR' ? <FiUserCheck /> : <FiUsers />}
                    </div>
                    <div className="appt-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4>{user.fullName || user.email}</h4>
                        <span className={`badge ${user.role === 'DOCTOR' ? 'badge-primary' : 'badge-ghost'}`} style={{ fontSize: '0.7rem' }}>
                          {user.role}
                        </span>
                      </div>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip">{user.email}</span>
                        <span className="appt-meta-chip text-warning">Waiting for Approval</span>
                      </div>
                    </div>
                  </div>
                  <div className="appt-item-right">
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '8px 20px' }}
                      onClick={() => handleUserStatus(user.id, 'ACTIVE')}
                    >
                      Approve Account
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- SECTION 2: USER MANAGEMENT --- */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon indigo">
              <FiUsers />
            </div>
            <div>
              <h3>User Management</h3>
              <p>Manage existing active and suspended accounts</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {managedUsers.length === 0 ? (
            <EmptyState title="No active users" subtitle="Registered and approved users will appear here." />
          ) : (
            <div className="appointment-list">
              {managedUsers.map((user) => (
                <div className="appt-item" key={user.id}>
                  <div className="appt-item-left">
                    <div className={`appt-avatar ${user.role === 'DOCTOR' ? 'doctor' : 'patient'}`}>
                      {user.fullName?.[0] || 'U'}
                    </div>
                    <div className="appt-info">
                      <h4>{user.fullName || user.email}</h4>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip">{user.email}</span>
                        <span className="appt-meta-chip">{user.role}</span>
                        <span className={`appt-meta-chip ${user.accountStatus === 'ACTIVE' ? 'text-success' : 'text-danger'}`}>
                          {user.accountStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="appt-item-right">
                    {user.accountStatus === 'ACTIVE' ? (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleUserStatus(user.id, 'SUSPENDED')}>Suspend</button>
                    ) : (
                      <button className="btn btn-sm btn-success" onClick={() => handleUserStatus(user.id, 'ACTIVE')}>Reactivate</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- SECTION 3: DOCTOR PROFILE VERIFICATION (SYSTEM READINESS) --- */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon blue">
              <FiActivity />
            </div>
            <div>
              <h3>Doctor System Readiness</h3>
              <p>Verify clinical profiles and consultation settings</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {doctors.length === 0 ? (
            <EmptyState title="No doctor profiles" subtitle="Approved doctor clinical data will appear here." />
          ) : (
            <div className="appointment-list">
              {doctors.map((doctor) => (
                <div className="appt-item" key={doctor.id}>
                  <div className="appt-item-left">
                    <div className="appt-avatar patient">{doctor.name?.replace('Dr. ', '').charAt(0) || 'D'}</div>
                    <div className="appt-info">
                      <h4>{doctor.name}</h4>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip">{doctor.specialization}</span>
                        <span className="appt-meta-chip">{doctor.hospital}</span>
                        <span className={`appt-meta-chip ${doctor.verified ? 'text-success' : 'text-warning'}`}>
                          {doctor.verified ? 'Profile Verified' : 'Profile Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="appt-item-right">
                    {!doctor.verified ? (
                      <button className="btn btn-sm btn-success" onClick={() => handleDoctorVerification(doctor.id, true)}>Verify Profile</button>
                    ) : (
                      <button className="btn btn-sm btn-ghost" onClick={() => handleDoctorVerification(doctor.id, false)}>Mark Pending</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon green">
              <FiBell />
            </div>
            <div>
              <h3>Recent Notifications</h3>
              <p>Operational messages sent by the platform</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {notifications.length === 0 ? (
            <EmptyState title="No notifications yet" subtitle="Appointment and workflow alerts will appear here." />
          ) : (
            <div className="appointment-list">
              {notifications.slice(0, 8).map((notification) => (
                <div className="appt-item" key={notification.id}>
                  <div className="appt-item-left">
                    <div className="appt-avatar doctor">
                      <FiBell />
                    </div>
                    <div className="appt-info">
                      <h4>{notification.subject}</h4>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip">{notification.channel}</span>
                        <span className="appt-meta-chip">{notification.recipientRole} #{notification.recipientId}</span>
                      </div>
                      <div className="appt-meta-chip" style={{ marginTop: 4 }}>{notification.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
