import { useState } from 'react';
import { ShieldCheck, Lock, Navigation, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SaarthiShield({ isCompact = false, onClick = null }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { isDark } = useTheme();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / (rect.height / 2)) * 8,
      y: (x / (rect.width / 2)) * 8,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const PILLARS = [
    { icon: <ShieldCheck size={18} color="#10b981" />, title: 'Verified Driver', desc: 'Police cleared & commercial DL vetted' },
    { icon: <Lock size={18} color="#3b82f6" />, title: 'OTP Protected', desc: 'Ride starts strictly after your secret OTP' },
    { icon: <Navigation size={18} color="#8b5cf6" />, title: 'Live Tracking', desc: 'Real-time telemetry & family route share' },
    { icon: <PhoneCall size={18} color="#f43f5e" />, title: 'Emergency Support', desc: 'Instant SOS & 24/7 rapid ops team' },
  ];

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        cursor: onClick ? 'pointer' : 'default',
        width: '100%',
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isHovered ? 'scale(1.01)' : 'scale(1)'}`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          background: isDark
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isDark
            ? '1px solid rgba(96, 165, 250, 0.25)'
            : '1px solid rgba(37, 99, 235, 0.2)',
          borderRadius: 'var(--radius-2xl)',
          padding: isCompact ? '16px' : '22px',
          boxShadow: isHovered
            ? (isDark
              ? '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.25)'
              : '0 16px 40px rgba(37, 99, 235, 0.12), 0 0 20px rgba(37, 99, 235, 0.1)')
            : (isDark
              ? '0 12px 36px rgba(0, 0, 0, 0.35)'
              : '0 8px 30px rgba(0, 0, 0, 0.06)'),
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-20%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: isDark
              ? 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
              }}
            >
              <ShieldCheck size={20} color="white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: 900,
                  color: isDark ? '#ffffff' : 'var(--color-slate-900)',
                  letterSpacing: '0.02em'
                }}>
                  Saarthi Shield™
                </span>
                <span
                  className="shimmer-badge"
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5',
                    border: isDark ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #10b981',
                    color: isDark ? '#34d399' : '#059669',
                  }}
                >
                  ACTIVE 24/7
                </span>
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'var(--color-slate-600)',
                marginTop: 2
              }}>
                4-Layer Safety Protocol for Your Car
              </div>
            </div>
          </div>

          <Sparkles size={18} color="#2563eb" style={{ opacity: 0.8 }} />
        </div>

        {/* 4 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isCompact ? '1fr 1fr' : 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 10,
          }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.title}
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.85)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--color-slate-200)',
                borderRadius: 'var(--radius-lg)',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span style={{
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  color: isDark ? '#f8fafc' : 'var(--color-slate-900)'
                }}>
                  {p.title}
                </span>
              </div>
              <div style={{
                fontSize: '0.6875rem',
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--color-slate-600)',
                lineHeight: 1.35
              }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
