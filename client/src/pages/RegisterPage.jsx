import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, Shield, Car, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'customer' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1=role, 2=details

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { name, email, phone, password } = form;
    if (!name || !email || !phone || !password) return setError('All fields are required.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    const res = await register(form);
    if (res.success) {
      if (form.role === 'driver') {
        navigate('/driver/verify');
      } else {
        navigate('/home');
      }
    } else setError('Registration failed. Please try again.');
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.12)',
    color: 'white',
  };

  return (
    <div className="auth-page" style={{ justifyContent: 'flex-start', paddingTop: 40 }}>
      {/* Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '5%', right: '-15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg, var(--color-success), #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 12px 40px rgba(16,185,129,0.35)' }}>
            <Shield size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 900, color: 'white', marginBottom: 4 }}>Join Saarthi</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Create your account in 30 seconds</p>
        </div>

        {/* Step 1: Role selection */}
        {step === 1 && (
          <div style={{ animation: 'slide-up 0.3s ease forwards' }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginBottom: 20 }}>
              How will you use Saarthi?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { value: 'customer', icon: '🚗', title: 'I\'m a Vehicle Owner', desc: 'I need a driver for my car', color: 'var(--color-primary)' },
                { value: 'driver', icon: '👨‍✈️', title: 'I\'m a Driver', desc: 'I want to offer my driving services', color: 'var(--color-success)' },
              ].map(opt => (
                <button
                  key={opt.value}
                  id={`role-${opt.value}-btn`}
                  onClick={() => { update('role', opt.value); setStep(2); }}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: `2px solid ${form.role === opt.value ? opt.color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'white',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ fontSize: 36, lineHeight: 1 }}>{opt.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{opt.title}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{opt.desc}</div>
                  </div>
                  <ArrowRight size={18} color="rgba(255,255,255,0.3)" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details form */}
        {step === 2 && (
          <div style={{ animation: 'slide-up 0.3s ease forwards' }}>
            <button
              onClick={() => setStep(1)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ← Back
            </button>

            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-2xl)', padding: '28px 24px', backdropFilter: 'blur(20px)' }}>
              {error && (
                <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 14px', color: '#fca5a5', fontSize: '0.875rem', marginBottom: 20 }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="input-group" style={{ marginBottom: 14 }}>
                  <label className="input-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Full Name</label>
                  <div className="input-icon-wrap">
                    <User size={16} className="input-icon" />
                    <input id="reg-name" type="text" className="input" placeholder="Your full name" value={form.name} onChange={e => update('name', e.target.value)} style={inputStyle} />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 14 }}>
                  <label className="input-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Email Address</label>
                  <div className="input-icon-wrap">
                    <Mail size={16} className="input-icon" />
                    <input id="reg-email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} style={inputStyle} />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 14 }}>
                  <label className="input-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Phone Number</label>
                  <div className="input-icon-wrap">
                    <Phone size={16} className="input-icon" />
                    <input id="reg-phone" type="tel" className="input" placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} style={inputStyle} />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 24 }}>
                  <label className="input-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
                  <div className="input-icon-wrap" style={{ position: 'relative' }}>
                    <Lock size={16} className="input-icon" />
                    <input
                      id="reg-password"
                      type={showPass ? 'text' : 'password'}
                      className="input"
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      style={{ ...inputStyle, paddingRight: 44 }}
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button id="register-submit-btn" type="submit" className="btn btn-success btn-lg btn-block" disabled={loading}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} />
                      Creating account...
                    </span>
                  ) : (
                    <> Create Account <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Login link */}
        <p style={{ textAlign: 'center', marginTop: 28, color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
