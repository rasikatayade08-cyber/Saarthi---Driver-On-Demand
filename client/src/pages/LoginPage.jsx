import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { email: 'raj@saarthi.in', password: 'demo123', label: 'Raj Sharma', role: 'Customer' },
  { email: 'suresh@saarthi.in', password: 'demo123', label: 'Suresh Kumar', role: 'Driver (Verified)' },
  { email: 'vikram@saarthi.in', password: 'demo123', label: 'Vikram Singh', role: 'Driver (Pending)' },
  { email: 'admin@saarthi.in', password: 'demo123', label: 'Admin Ops Center', role: 'Platform Admin' },
];

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleRedirect = (usr) => {
    if (usr.role === 'admin') {
      navigate('/admin');
    } else if (usr.role === 'driver') {
      if (!usr.isVerified && usr.verificationStatus !== 'approved') {
        navigate('/driver/verify');
      } else {
        navigate('/driver/home');
      }
    } else {
      navigate('/home');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please enter your email and password.');
    const res = await login(form.email, form.password);
    if (res.success) {
      handleRedirect(res.user);
    } else {
      setError('Invalid credentials. Try a demo account below.');
    }
  };

  const quickLogin = async (account) => {
    setForm({ email: account.email, password: account.password });
    const res = await login(account.email, account.password);
    if (res.success) {
      handleRedirect(res.user);
    }
  };

  return (
    <div className="auth-page">
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-10%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '-10%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 12px 40px rgba(37,99,235,0.4)',
          }}>
            <Shield size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Sign in to your Saarthi account</p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-2xl)',
          padding: '28px 24px',
          backdropFilter: 'blur(20px)',
        }}>
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.15)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              color: '#fca5a5',
              fontSize: '0.875rem',
              marginBottom: 20,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label className="input-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group" style={{ marginBottom: 8 }}>
              <label className="input-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', color: 'white', paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button type="button" style={{ fontSize: '0.8125rem', color: 'var(--color-primary-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Forgot password?
              </button>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>

        {/* Quick Demo Login */}
        <div style={{ marginTop: 20 }}>
          <div className="divider" style={{ color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Quick Demo Logins</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => quickLogin(acc)}
                id={`demo-${acc.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}-btn`}
                disabled={loading}
                style={{
                  width: '100%',
                  background: acc.role === 'Platform Admin' ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${acc.role === 'Platform Admin' ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseOver={e => e.currentTarget.style.background = acc.role === 'Platform Admin' ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.12)'}
                onMouseOut={e => e.currentTarget.style.background = acc.role === 'Platform Admin' ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.06)'}
              >
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{acc.label}</span>
                  <span style={{ fontSize: '0.75rem', color: acc.role === 'Platform Admin' ? '#c4b5fd' : 'rgba(255,255,255,0.5)', marginLeft: 8 }}>({acc.role})</span>
                </div>
                <ArrowRight size={14} color="rgba(255,255,255,0.4)" />
              </button>
            ))}
          </div>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
