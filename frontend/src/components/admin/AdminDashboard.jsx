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
    { label: 'Pending Verification', value: stats?.pendingVerificationCount ?? 0, icon: <FiShield /> },
  ];

  return (
    <div className="section-gap">
      <div className="stats-grid">
        {statCards.map((card) => (
          <div className="stat-card" key={card.label}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-header-icon amber">
              <FiShield />
            </div>
            <div>
              <h3>User Accounts</h3>
              <p>Activate, suspend, and oversee platform identities</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {users.length === 0 ? (
            <EmptyState title="No users found" subtitle="Registered users will appear here." />
          ) : (
            <div className="appointment-list">
              {users.map((user) => (
                <div className="appt-item" key={user.id}>
                  <div className="appt-item-left">
                    <div className="appt-avatar doctor">{user.fullName?.[0] || 'U'}</div>
                    <div className="appt-info">
                      <h4>{user.fullName || user.email}</h4>
                      <div className="appt-info-meta">
                        <span className="appt-meta-chip">{user.email}</span>
                        <span className="appt-meta-chip">{user.role}</span>
                        <span className="appt-meta-chip">{user.accountStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="appt-item-right">
                    <button className="btn btn-sm btn-success" onClick={() => handleUserStatus(user.id, 'ACTIVE')}>Activate</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleUserStatus(user.id, 'SUSPENDED')}>Suspend</button>
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
            <div className="card-header-icon blue">
              <FiActivity />
            </div>
            <div>
              <h3>Doctor Verification</h3>
              <p>Approve registrations and check consultation readiness</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {doctors.length === 0 ? (
            <EmptyState title="No doctors found" subtitle="Doctor registrations will appear here." />
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
                        <span className="appt-meta-chip">{doctor.verified ? 'Verified' : 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="appt-item-right">
                    <button className="btn btn-sm btn-success" onClick={() => handleDoctorVerification(doctor.id, true)}>Verify</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => handleDoctorVerification(doctor.id, false)}>Mark Pending</button>
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
