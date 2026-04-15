import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiActivity, FiArrowRight, FiShield, FiCheckCircle } from 'react-icons/fi';
import { login, register, forgotPassword } from '../../api/authApi';
import { RiHospitalLine } from 'react-icons/ri';

export default function AuthForms({ onSuccess, onError }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [registrationPending, setRegistrationPending] = useState(false);
  const [registeredName, setRegisteredName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'PATIENT'
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isForgot) {
        await forgotPassword(form.email);
        setForgotSuccess(true);
      } else if (isLogin) {
        const authResponse = await login({ email: form.email, password: form.password });
        onSuccess(authResponse);
      } else {
        const authResponse = await register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role
        });
        // Show pending screen instead of logging in
        setRegisteredName(form.fullName);
        setRegistrationPending(true);
      }
    } catch (err) {
      onError(err.message, 'error');
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
            <p>Authentication Portal</p>
          </div>
        </div>

        <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '30px', background: 'var(--bg-card)', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
          {registrationPending ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ color: '#f59e0b', marginBottom: '20px' }}>
                <FiShield size={48} />
              </div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Registration Submitted!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.95rem' }}>
                Hey <strong>{registeredName}</strong>, your account is now pending admin review.
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.85rem', lineHeight: 1.6 }}>
                You will receive an email notification once an administrator approves your account. You won't be able to log in until then.
              </p>
              <button className="btn btn-primary btn-full" onClick={() => { setRegistrationPending(false); setIsLogin(true); }}>
                Back to Login
              </button>
            </div>
          ) : forgotSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ color: '#10b981', marginBottom: '20px' }}><FiCheckCircle size={48} /></div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Reset Link Sent!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.9rem' }}>
                We've sent a password reset link to <strong>{form.email}</strong>. Please check your inbox.
              </p>
              <button className="btn btn-secondary btn-full" onClick={() => { setIsForgot(false); setForgotSuccess(false); }}>
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', color: 'var(--text-primary)', textAlign: 'center' }}>
                {isForgot ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create an Account')}
              </h2>
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '28px', fontSize: '0.9rem' }}>
                {isForgot ? 'Enter your email to receive a reset link.' : (isLogin ? 'Enter your details to access your portal.' : 'Join MediCare and access modern healthcare.')}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {!isLogin && !isForgot && (
                  <div className="form-group">
                    <label className="form-label"><FiUser /> Full Name</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={form.fullName} 
                      onChange={handleChange} 
                      required={!isLogin && !isForgot} 
                      placeholder="e.g. John Doe"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label"><FiMail /> Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="name@example.com"
                  />
                </div>

                {!isForgot && (
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label"><FiLock /> Password</label>
                      {isLogin && (
                        <span 
                          onClick={() => setIsForgot(true)} 
                          style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Forgot?
                        </span>
                      )}
                    </div>
                    <input 
                      type="password" 
                      name="password" 
                      value={form.password} 
                      onChange={handleChange} 
                      required={!isForgot} 
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {!isLogin && !isForgot && (
                  <div className="form-group">
                    <label className="form-label"><FiActivity /> Select Role</label>
                    <select name="role" value={form.role} onChange={handleChange} required>
                      <option value="PATIENT">Patient (Book Appointments)</option>
                      <option value="DOCTOR">Doctor (Provide Consultations)</option>
                      <option value="ADMIN">Admin (Manage Platform)</option>
                    </select>
                  </div>
                )}

                <button 
                  className="btn btn-primary btn-full shadow-colored" 
                  type="submit" 
                  disabled={loading}
                  style={{ marginTop: '10px', padding: '14px', fontSize: '1.05rem', justifyContent: 'center' }}
                >
                   {loading ? (
                     <><div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'white' }} /> Processing...</>
                   ) : (
                     <>{isForgot ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Register Account')} <FiArrowRight /></>
                   )}
                </button>
              </form>

              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {isForgot ? (
                  <span onClick={() => setIsForgot(false)} style={{ color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>
                    Back to Login
                  </span>
                ) : (
                  <>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span 
                      onClick={() => setIsLogin(!isLogin)} 
                      style={{ color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {isLogin ? 'Register now' : 'Sign in instead'}
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
