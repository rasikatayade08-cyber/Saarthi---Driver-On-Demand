import { useState } from 'react';
import { X, ShieldCheck, HeartHandshake, Sparkles, ChevronRight, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const REASONS = [
  {
    id: 'drinks',
    emoji: '🍷',
    title: 'Had a few drinks',
    subtitle: 'Zero risk. Let a pro drive you home in your own car.',
    mode: 'Safe Return Mode',
    modeBadge: '🛡️ Safe Return Mode',
    sensitive: true,
    safetyMsg: 'Responsible choice! We have your back. Our driver will handle your car with maximum care.',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    accent: '#ef4444',
  },
  {
    id: 'party',
    emoji: '🎉',
    title: 'Coming from a party',
    subtitle: 'Relax after the night out. Safe & smooth drive.',
    mode: 'Safe Return Mode',
    modeBadge: '🛡️ Safe Return Mode',
    sensitive: true,
    safetyMsg: 'Enjoyed your evening? Rest easy in the backseat while our verified driver takes you home.',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    accent: '#a855f7',
  },
  {
    id: 'tired',
    emoji: '😴',
    title: 'Too tired to drive',
    subtitle: 'Avoid fatigue driving. Rest and recharge.',
    mode: 'Safety Mode',
    modeBadge: '🛡️ Safety Mode',
    sensitive: true,
    safetyMsg: 'Fatigue is dangerous. Great decision to hand over the keys and rest comfortably.',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    accent: '#3b82f6',
  },
  {
    id: 'unwell',
    emoji: '🤒',
    title: 'Not feeling well',
    subtitle: 'Gentle, steady driving when you need rest.',
    mode: 'Safety Mode',
    modeBadge: '🛡️ Safety Mode',
    sensitive: true,
    safetyMsg: 'Take care! Our driver is instructed to drive smoothly with quiet comfort.',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    accent: '#14b8a6',
  },
  {
    id: 'replacement',
    emoji: '🚗',
    title: 'Regular driver unavailable',
    subtitle: 'Instant replacement chauffeur for your schedule.',
    mode: 'Replacement Driver Mode',
    modeBadge: '👔 Replacement Driver Mode',
    sensitive: false,
    safetyMsg: 'Seamless chauffeur handoff for your daily routine or office run.',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    accent: '#f59e0b',
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧',
    title: 'Family travel',
    subtitle: 'Extra care, smooth speeds & verified top driver.',
    mode: 'Family Safety Mode',
    modeBadge: '👨‍👩‍👧 Family Safety Mode',
    sensitive: false,
    safetyMsg: 'Family comes first. We assign our top 1% highest-rated family chauffeurs.',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    accent: '#10b981',
  },
  {
    id: 'airport',
    emoji: '✈️',
    title: 'Airport / Long journey',
    subtitle: 'Luggage help, punctual pickup & highway certified.',
    mode: 'Journey Mode',
    modeBadge: '✈️ Journey Mode',
    sensitive: false,
    safetyMsg: 'On-time guarantee with luggage assistance for stress-free travel.',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    accent: '#06b6d4',
  },
  {
    id: 'hospital',
    emoji: '🏥',
    title: 'Hospital visit',
    subtitle: 'Priority urgent dispatch and patient care.',
    mode: 'Priority Medical Mode',
    modeBadge: '🚨 Priority Medical Mode',
    sensitive: true,
    safetyMsg: 'Priority dispatch activated. Fast driver routing directly to medical facilities.',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    accent: '#ef4444',
  },
  {
    id: 'outstation',
    emoji: '🧳',
    title: 'Outstation trip',
    subtitle: 'Intercity vetted driver for multi-hour highway runs.',
    mode: 'Journey Mode',
    modeBadge: '🧳 Outstation Journey Mode',
    sensitive: false,
    safetyMsg: 'Experienced highway driver with verified long-distance driving record.',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    accent: '#6366f1',
  },
  {
    id: 'other',
    emoji: '⚡',
    title: 'Other urgent need',
    subtitle: 'Fast on-demand driver for any situation.',
    mode: 'Express Mode',
    modeBadge: '⚡ Express Driver Mode',
    sensitive: false,
    safetyMsg: 'Top available verified driver matched in under 4 minutes.',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    accent: '#eab308',
  },
];

export default function ReasonModal({ isOpen, onClose, onSelectReason }) {
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const handleProceed = () => {
    onSelectReason(selectedReason);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: isDark ? 'rgba(5, 8, 15, 0.85)' : 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fade-in 0.25s ease-out forwards',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-2xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          background: isDark ? 'rgba(15, 23, 42, 0.95)' : '#ffffff',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--color-slate-200)',
          boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(0,0,0,0.18)',
          color: isDark ? '#ffffff' : 'var(--color-slate-900)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--color-slate-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isDark ? 'rgba(15, 23, 42, 0.98)' : '#ffffff',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.25rem' }}>🛡️</span>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: isDark ? '#ffffff' : 'var(--color-slate-900)',
                letterSpacing: '-0.01em'
              }}>
                Why do you need a driver today?
              </h2>
            </div>
            <p style={{
              fontSize: '0.8125rem',
              color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'var(--color-slate-600)',
              marginTop: 4
            }}>
              Select a reason to customize your safety protocol and driver instructions.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--color-slate-600)',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Reason Cards Grid */}
        <div
          style={{
            padding: '18px 24px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
            flex: 1,
            background: isDark ? 'transparent' : '#f8fafc',
          }}
        >
          {REASONS.map((r) => {
            const isSelected = selectedReason.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedReason(r)}
                style={{
                  background: isSelected
                    ? (isDark
                      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'
                      : '#ffffff')
                    : (isDark
                      ? 'rgba(255, 255, 255, 0.03)'
                      : '#ffffff'),
                  border: isSelected
                    ? `2px solid ${r.accent}`
                    : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--color-slate-200)'),
                  borderRadius: 'var(--radius-xl)',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected
                    ? `0 10px 25px ${r.glowColor}`
                    : (isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)'),
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{r.emoji}</span>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: isSelected ? `2px solid ${r.accent}` : (isDark ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid var(--color-slate-300)'),
                      background: isSelected ? r.accent : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && <Check size={12} color="white" />}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontWeight: 800,
                    fontSize: '0.9375rem',
                    color: isDark ? '#ffffff' : 'var(--color-slate-900)'
                  }}>
                    {r.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--color-slate-600)',
                    marginTop: 2,
                    lineHeight: 1.35
                  }}>
                    {r.subtitle}
                  </div>
                </div>

                <div style={{ marginTop: 2 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: r.accent,
                      background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {r.mode}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safety Feedback Banner + Proceed Button */}
        <div
          style={{
            padding: '16px 24px 20px',
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--color-slate-100)',
            background: isDark ? 'rgba(15, 23, 42, 0.98)' : '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Supportive message for selected reason */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 'var(--radius-lg)',
              background: isDark ? 'rgba(37, 99, 235, 0.12)' : 'var(--color-primary-50)',
              border: isDark ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--color-primary-100)',
            }}
          >
            <HeartHandshake size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <div style={{
              fontSize: '0.8125rem',
              color: isDark ? '#e0f2fe' : 'var(--color-primary-dark)',
              lineHeight: 1.4
            }}>
              <strong>{selectedReason.modeBadge}:</strong> {selectedReason.safetyMsg}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '13px 20px',
                borderRadius: 'var(--radius-lg)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--color-slate-300)',
                color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'var(--color-slate-700)',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--color-slate-100)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              style={{
                flex: 2,
                padding: '13px 24px',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 0 24px rgba(239, 68, 68, 0.45)',
              }}
            >
              <span>Continue with {selectedReason.mode}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
