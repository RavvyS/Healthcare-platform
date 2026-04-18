import { useState, useEffect } from 'react';
import { FiLock, FiCheckCircle, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { RiHospitalLine } from 'react-icons/ri';
import { resetPassword } from '../../api/authApi';

export default function ResetPassword({ onBackToLogin }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
    } else {
      setError('Invalid or missing reset token.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await resetPassword(token, password);
      setSuccess(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-screen">
      <div className="landing-bg-orb landing-bg-orb-1" />
      <div className="landing-bg-orb landing-bg-orb-2" />
      
      <div className="landing-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
        
        <div className="landing-logo" style={{ marginBottom: 40, textAlign: 'center' }}>
          <div className="landing-logo-icon" style={{ margin: '0 auto 15px' }}>
            <RiHospitalLine size={32} />
          </div>
          <div className="landing-logo-text">
            <h1>Medi<em>Care</em></h1>
            <p>Password Recovery</p>
          </div>
        </div>

        <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '30px', background: 'var(--bg-card)', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ color: '#10b981', marginBottom: '20px' }}><FiCheckCircle size={48} /></div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Password Reset Successful!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.9rem' }}>
                Your password has been updated. You can now use your new password to sign in to your portal.
              </p>
              <button className="btn btn-primary btn-full shadow-colored" onClick={onBackToLogin}>
                Go to Login <FiArrowRight />
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', color: 'var(--text-primary)', textAlign: 'center' }}>
                Create New Password
              </h2>
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '28px', fontSize: '0.9rem' }}>
                Please enter a secure new password for your account.
              </p>

              {error && (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  color: '#ef4444', 
                  padding: '12px', 
                  borderRadius: '12px', 
                  marginBottom: '20px', 
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FiAlertCircle size={18} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label"><FiLock /> New Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="••••••••"
                    disabled={!token || loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label"><FiLock /> Confirm Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    placeholder="••••••••"
                    disabled={!token || loading}
                  />
                </div>

                <button 
                  className="btn btn-primary btn-full shadow-colored" 
                  type="submit" 
                  disabled={loading || !token}
                  style={{ marginTop: '10px', padding: '14px', fontSize: '1.05rem', justifyContent: 'center' }}
                >
                   {loading ? (
                     <><div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'white' }} /> Updating...</>
                   ) : (
                     <>Reset Password <FiArrowRight /></>
                   )}
                </button>
              </form>

              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span onClick={onBackToLogin} style={{ color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>
                  Back to Login
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
