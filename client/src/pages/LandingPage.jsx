import { useNavigate } from 'react-router-dom';
import RealLiveDispatchRadar from '../components/RealLiveDispatchRadar';
import SaarthiShield from '../components/SaarthiShield';
import { useTheme } from '../context/ThemeContext';
import {
  Shield, Zap, Calendar, Star, CheckCircle2, ArrowRight,
  Phone, MapPin, Radio, Activity, Navigation, Sparkles, Clock, AlertTriangle,
  Sun, Moon, LogIn
} from 'lucide-react';

const FEATURES = [
  { icon: '🔐', title: '100% Police & Identity Verified', desc: 'Every driver undergoes strict commercial DL verification and criminal record screening.' },
  { icon: '⚡', title: 'Instant 4-Min Response', desc: 'Nearby verified drivers reach your vehicle in under 4–8 minutes for urgent needs.' },
  { icon: '📡', title: 'Live Satellite Telemetry', desc: 'Real-time GPS tracking, speed telemetry, and 1-tap SOS family trip sharing.' },
  { icon: '🌟', title: '5-Star Pro Chauffeurs', desc: 'Only top-rated, skilled commercial drivers authorized for Sedans, SUVs, and luxury cars.' },
];

const TRUST_STATS = [
  { value: '50K+', label: 'Successful Trips', icon: '🚗' },
  { value: '4.9 ★', label: 'Driver Rating', icon: '⭐' },
  { value: '< 5 min', label: 'Avg Arrival Time', icon: '⏱️' },
  { value: '100%', label: 'Safety Verified', icon: '🛡️' },
];

const USE_CASES = [
  { icon: '🍷', label: 'Had a Few Drinks', desc: 'Zero risk. Hand over the keys to a verified pro.' },
  { icon: '🎉', label: 'Late Night & Parties', desc: 'Relax after the night out. Safe & smooth drive home.' },
  { icon: '😴', label: 'Too Tired / Fatigue', desc: 'Rest comfortably in the backseat while we drive.' },
  { icon: '🤒', label: 'Not Feeling Well', desc: 'Gentle, steady driving when you need quiet rest.' },
  { icon: '✈️', label: 'Airport & Long Trips', desc: 'Luggage assistance & stress-free drop.' },
  { icon: '🚗', label: 'Daily Office & Events', desc: 'Work productively while our driver handles traffic.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#05080f' : '#f8fafc',
      color: isDark ? '#ffffff' : 'var(--color-slate-900)',
      overflowX: 'hidden',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      
      {/* ── TOP NAV BAR ── */}
      <header style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1080,
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(37,99,235,0.4)',
          }}>
            <Shield size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: 900,
              color: isDark ? '#ffffff' : 'var(--color-slate-900)',
              lineHeight: 1.1
            }}>
              Saarthi
            </div>
            <div style={{
              fontSize: '0.625rem',
              fontWeight: 600,
              color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--color-slate-500)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              Driver on Demand
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid var(--color-slate-200)',
              borderRadius: 'var(--radius-full)',
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isDark ? '#fbbf24' : '#475569',
              transition: 'all 0.2s',
            }}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#475569" />}
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/login')}
            style={{ color: isDark ? 'rgba(255,255,255,0.85)' : 'var(--color-slate-700)', fontWeight: 700 }}
          >
            <LogIn size={15} /> Sign In
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/register')}
            style={{ fontWeight: 800 }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section style={{
        position: 'relative',
        padding: '40px 20px 48px',
        textAlign: 'center',
        maxWidth: 900,
        margin: '0 auto',
      }}>
        
        {/* Status Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(37,99,235,0.08)',
          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(37,99,235,0.2)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 18px',
          marginBottom: 24
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 10px var(--color-success)' }} />
          <span style={{
            fontSize: '0.8125rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: isDark ? '#ffffff' : 'var(--color-primary-dark)'
          }}>
            SAARTHI · ON-DEMAND DRIVER NETWORK
          </span>
          <span className="badge badge-emergency" style={{ fontSize: '0.625rem', fontWeight: 800 }}>
            LIVE 24/7
          </span>
        </div>

        {/* Hero Headline */}
        <h1 style={{
          fontSize: 'clamp(2.1rem, 6vw, 3.4rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: 18,
          letterSpacing: '-0.02em',
          color: isDark ? '#ffffff' : 'var(--color-slate-900)'
        }}>
          Wherever you&apos;re going, you{' '}
          <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            don&apos;t have to drive.
          </span>
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: isDark ? 'rgba(255,255,255,0.75)' : 'var(--color-slate-600)',
          lineHeight: 1.6,
          marginBottom: 32,
          maxWidth: 580,
          margin: '0 auto 32px'
        }}>
          Get a verified driver for your own car whenever you need one.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
          <button
            className="btn btn-emergency btn-xl"
            onClick={() => navigate('/home')}
            style={{
              padding: '15px 32px',
              fontSize: '1.0625rem',
              fontWeight: 900,
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.55)',
            }}
          >
            🚨 Get a Driver Now
          </button>
          <button
            className="btn btn-outline btn-xl"
            onClick={() => navigate('/home')}
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'var(--color-slate-300)',
              color: isDark ? 'white' : 'var(--color-slate-800)',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'white',
              padding: '15px 28px',
              fontSize: '1rem',
              fontWeight: 800,
              boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <Calendar size={18} color="#f59e0b" />
            Schedule a Driver
          </button>
        </div>

        {/* ── REAL INTERACTIVE DISPATCH & TRAFFIC RADAR ── */}
        <RealLiveDispatchRadar onBookNow={() => navigate('/home')} />

        {/* ── TRUST STATS GRID ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 14,
          maxWidth: 640,
          margin: '0 auto 48px',
        }}>
          {TRUST_STATS.map((s) => (
            <div
              key={s.label}
              className="card-interactive"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--color-slate-200)',
                borderRadius: 'var(--radius-xl)',
                padding: '16px 12px',
                textAlign: 'center',
                boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{
                fontSize: '1.375rem',
                fontWeight: 900,
                color: isDark ? '#ffffff' : 'var(--color-slate-900)'
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: isDark ? 'rgba(255,255,255,0.55)' : 'var(--color-slate-500)',
                fontWeight: 600,
                marginTop: 2
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SAARTHI SHIELD HIGHLIGHT SECTION ── */}
      <section style={{ padding: '40px 24px', maxWidth: 800, margin: '0 auto' }}>
        <SaarthiShield onClick={() => navigate('/home')} />
      </section>

      {/* ── SITUATION USE CASES ── */}
      <section style={{
        padding: '60px 24px',
        background: isDark ? 'rgba(255,255,255,0.02)' : '#f1f5f9',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid var(--color-slate-200)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{
            fontSize: '1.625rem',
            fontWeight: 900,
            marginBottom: 8,
            color: isDark ? '#ffffff' : 'var(--color-slate-900)'
          }}>
            When Do You Need Saarthi?
          </h2>
          <p style={{
            color: isDark ? 'rgba(255,255,255,0.55)' : 'var(--color-slate-600)',
            fontSize: '0.9375rem'
          }}>
            Never take the wheel when conditions aren&apos;t right
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, maxWidth: 720, margin: '0 auto' }}>
          {USE_CASES.map((u) => (
            <div
              key={u.label}
              className="card-interactive"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--color-slate-200)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px 14px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.04)',
              }}
              onClick={() => navigate('/home')}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>{u.icon}</div>
              <div style={{
                fontSize: '0.9375rem',
                fontWeight: 800,
                color: isDark ? '#ffffff' : 'var(--color-slate-900)',
                marginBottom: 4
              }}>
                {u.label}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--color-slate-600)',
                lineHeight: 1.4
              }}>
                {u.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY SAARTHI FEATURES ── */}
      <section style={{
        padding: '60px 24px',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid var(--color-slate-200)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{
            fontSize: '1.625rem',
            fontWeight: 900,
            marginBottom: 8,
            color: isDark ? '#ffffff' : 'var(--color-slate-900)'
          }}>
            Built for Safety & Speed
          </h2>
          <p style={{
            color: isDark ? 'rgba(255,255,255,0.55)' : 'var(--color-slate-600)',
            fontSize: '0.9375rem'
          }}>
            The most trusted driver-on-demand network in India
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 680, margin: '0 auto' }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card-interactive"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--color-slate-200)',
                borderRadius: 'var(--radius-xl)',
                padding: '22px',
                display: 'flex',
                gap: 16,
                boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  marginBottom: 6,
                  color: isDark ? '#ffffff' : 'var(--color-slate-900)'
                }}>
                  {f.title}
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--color-slate-600)',
                  lineHeight: 1.6
                }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{
        padding: '60px 24px 80px',
        textAlign: 'center',
        background: isDark
          ? 'linear-gradient(180deg, transparent, rgba(37,99,235,0.1))'
          : 'linear-gradient(180deg, transparent, rgba(37,99,235,0.06))'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 900,
          marginBottom: 12,
          color: isDark ? '#ffffff' : 'var(--color-slate-900)'
        }}>
          Ready for safer journeys in your car?
        </h2>
        <p style={{
          color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--color-slate-600)',
          marginBottom: 32,
          fontSize: '0.9375rem'
        }}>
          Join thousands of vehicle owners who travel stress-free with Saarthi
        </p>
        <button
          className="btn btn-primary btn-xl"
          onClick={() => navigate('/register')}
          style={{ margin: '0 auto', display: 'flex', maxWidth: 300 }}
          id="landing-signup-free-btn"
        >
          Sign Up Free <ArrowRight size={18} />
        </button>
      </section>

    </div>
  );
}
