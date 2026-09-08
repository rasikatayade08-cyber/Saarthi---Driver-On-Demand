import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import MainLayout from '../layouts/MainLayout';
import {
  Car, Star, Shield, Phone, MapPin, LogOut, ChevronRight,
  Sun, Moon, X, Plus, Trash2, CheckCircle2, ShieldCheck, Heart, AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Active modal state for menu items
  const [activeModal, setActiveModal] = useState(null); // 'vehicles' | 'reviews' | 'safety' | 'support' | 'places' | null
  const [toastMsg, setToastMsg] = useState('');

  // Sample data states
  const [vehicles, setVehicles] = useState([
    { id: 'veh_1', nickname: 'My City', make: 'Honda', model: 'City', year: 2022, number: 'DL 01 AB 1234', type: 'Sedan', color: 'Pearl White' },
    { id: 'veh_2', nickname: 'Family SUV', make: 'Toyota', model: 'Fortuner', year: 2021, number: 'UP 82 XY 5678', type: 'SUV', color: 'Phantom Black' },
    { id: 'veh_3', nickname: 'Office Car', make: 'Maruti', model: 'Swift', year: 2023, number: 'DL 7C AB 9999', type: 'Hatchback', color: 'Magma Red' },
  ]);

  const [savedPlaces, setSavedPlaces] = useState([
    { id: 'p_1', title: 'Home', address: 'Sector 62, Noida, Uttar Pradesh', icon: '🏠' },
    { id: 'p_2', title: 'Office', address: 'Cyber Hub, DLF Phase 2, Gurugram', icon: '🏢' },
    { id: 'p_3', title: 'Airport', address: 'Terminal 3, IGI Airport, New Delhi', icon: '✈️' },
  ]);

  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Pooja Sharma (Spouse)', phone: '+91 98765 43210' },
    { name: 'Dr. Alok Verma (Family)', phone: '+91 99112 23344' },
  ]);

  const [reviews] = useState([
    { driver: 'Suresh Kumar', rating: 5, date: 'Yesterday', comment: 'Punctual, smooth driving, very polite chauffeur.' },
    { driver: 'Ravi Sharma', rating: 5, date: '4 days ago', comment: 'Handled traffic effortlessly during late night return.' },
    { driver: 'Amit Singh', rating: 4.8, date: 'Last week', comment: 'Excellent outstation driving experience on expressway.' },
  ]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const textColor = isDark ? '#ffffff' : 'var(--color-slate-900)';
  const textMuted = isDark ? 'rgba(255,255,255,0.6)' : 'var(--color-slate-500)';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.88)' : '#ffffff';
  const itemBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'var(--color-slate-50)';
  const borderCol = isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-slate-200)';

  const MENU_ITEMS = [
    {
      id: 'vehicles',
      icon: Car,
      label: 'My Vehicles',
      desc: `${vehicles.length} registered cars`,
      color: '#2563eb',
      action: () => setActiveModal('vehicles'),
    },
    {
      id: 'reviews',
      icon: Star,
      label: 'My Reviews',
      desc: `${reviews.length} chauffeur ratings given`,
      color: '#f59e0b',
      action: () => setActiveModal('reviews'),
    },
    {
      id: 'safety',
      icon: Shield,
      label: 'Safety Settings',
      desc: 'Emergency SOS contacts & Saarthi Shield™',
      color: '#10b981',
      action: () => setActiveModal('safety'),
    },
    {
      id: 'support',
      icon: Phone,
      label: 'Support & Help Desk',
      desc: '24/7 dedicated chauffeur support line',
      color: '#8b5cf6',
      action: () => setActiveModal('support'),
    },
    {
      id: 'places',
      icon: MapPin,
      label: 'Saved Places',
      desc: `${savedPlaces.length} locations saved`,
      color: '#ec4899',
      action: () => setActiveModal('places'),
    },
  ];

  return (
    <MainLayout>
      <div style={{
        padding: '20px',
        minHeight: 'calc(100vh - var(--navbar-height) - var(--bottom-nav-height))',
        background: isDark ? '#090d16' : '#f8fafc',
        transition: 'background 0.3s ease',
      }}>

        {/* Toast Feedback */}
        {toastMsg && <div className="toast">{toastMsg}</div>}

        {/* Avatar + Profile Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          borderRadius: 'var(--radius-2xl)',
          padding: '28px 20px',
          textAlign: 'center',
          color: 'white',
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(37,99,235,0.3)',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ width: 74, height: 74, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '2rem', fontWeight: 800, border: '3px solid rgba(255,255,255,0.4)', position: 'relative', zIndex: 1 }}>
            {user?.name?.charAt(0).toUpperCase() || 'R'}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 4, position: 'relative', zIndex: 1 }}>{user?.name || 'Customer Account'}</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.85, marginBottom: 4, position: 'relative', zIndex: 1 }}>{user?.email}</div>
          <div style={{ fontSize: '0.8125rem', opacity: 0.75, position: 'relative', zIndex: 1 }}>{user?.phone || '+91 98110 02233'}</div>
          {user?.isVerified !== false && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.18)', borderRadius: 'var(--radius-full)', padding: '4px 14px', marginTop: 12, fontSize: '0.75rem', fontWeight: 700 }}>
              <ShieldCheck size={14} color="#34d399" /> Verified Saarthi Member
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { value: `${vehicles.length}`, label: 'Vehicles', onClick: () => setActiveModal('vehicles') },
            { value: '12', label: 'Rides', onClick: () => navigate('/bookings') },
            { value: '4.9★', label: 'Rating', onClick: () => setActiveModal('reviews') },
          ].map(s => (
            <button
              key={s.label}
              onClick={s.onClick}
              className="card card-interactive"
              style={{
                padding: '14px 10px',
                textAlign: 'center',
                background: cardBg,
                border: `1px solid ${borderCol}`,
                borderRadius: 'var(--radius-xl)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: textColor }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.72rem', color: textMuted, fontWeight: 600, marginTop: 2 }}>
                {s.label}
              </div>
            </button>
          ))}
        </div>

        {/* Theme Quick Toggle Card */}
        <button
          onClick={toggleTheme}
          className="card card-interactive"
          style={{
            width: '100%',
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: cardBg,
            border: `1px solid ${borderCol}`,
            borderRadius: 'var(--radius-xl)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: isDark ? 'rgba(251, 191, 36, 0.15)' : 'rgba(37, 99, 235, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDark ? '#fbbf24' : 'var(--color-primary)',
            }}>
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: textColor }}>
                App Theme
              </div>
              <div style={{ fontSize: '0.75rem', color: textMuted }}>
                Currently {isDark ? 'Dark (Cinematic)' : 'Light (Daylight)'} Mode
              </div>
            </div>
          </div>
          <span className="badge" style={{
            background: isDark ? 'rgba(251, 191, 36, 0.2)' : 'var(--color-primary-50)',
            color: isDark ? '#fbbf24' : 'var(--color-primary)',
            fontWeight: 700,
          }}>
            Toggle
          </span>
        </button>

        {/* Interactive Menu List */}
        <div style={{
          background: cardBg,
          border: `1px solid ${borderCol}`,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: 20,
        }}>
          {MENU_ITEMS.map(({ id, icon: Icon, label, desc, color, action }, i) => (
            <button
              key={id}
              onClick={action}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px',
                borderBottom: i < MENU_ITEMS.length - 1 ? `1px solid ${borderCol}` : 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s ease, transform 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'var(--color-slate-100)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-lg)',
                background: isDark ? `${color}25` : `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: textColor }}>
                  {label}
                </div>
                <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: 2 }}>
                  {desc}
                </div>
              </div>
              <ChevronRight size={18} color={isDark ? 'rgba(255,255,255,0.3)' : 'var(--color-slate-400)'} />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-block"
          style={{
            background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
            color: 'var(--color-emergency)',
            border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fee2e2',
            fontWeight: 800,
            borderRadius: 'var(--radius-xl)',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <LogOut size={18} /> Sign Out
        </button>

        {/* ── MODALS FOR MENU ITEMS ── */}
        {activeModal && (
          <>
            {/* Backdrop */}
            <div
              className="overlay"
              onClick={() => setActiveModal(null)}
              style={{ zIndex: 100 }}
            />

            {/* Bottom Sheet Modal */}
            <div
              className="modal-sheet"
              style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: 520,
                maxHeight: '85dvh',
                overflowY: 'auto',
                background: isDark ? '#0f172a' : '#ffffff',
                border: `1px solid ${borderCol}`,
                borderRadius: '24px 24px 0 0',
                zIndex: 101,
                padding: '20px',
                animation: 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: textColor }}>
                  {activeModal === 'vehicles' && '🚗 My Registered Vehicles'}
                  {activeModal === 'reviews' && '⭐ Ratings & Reviews'}
                  {activeModal === 'safety' && '🛡️ Safety & SOS Protocols'}
                  {activeModal === 'support' && '📞 24/7 Chauffeur Support'}
                  {activeModal === 'places' && '📍 Saved Locations'}
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: textMuted,
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* 1. Vehicles Modal */}
              {activeModal === 'vehicles' && (
                <div>
                  <p style={{ fontSize: '0.8125rem', color: textMuted, marginBottom: 14 }}>
                    Drivers on Saarthi operate your registered car. Add or manage your vehicles below:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    {vehicles.map(v => (
                      <div
                        key={v.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-lg)',
                          background: itemBg,
                          border: `1px solid ${borderCol}`,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: textColor }}>{v.nickname}</div>
                          <div style={{ fontSize: '0.78rem', color: textMuted }}>{v.make} {v.model} ({v.year}) · {v.color}</div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: 2 }}>{v.number}</div>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: isDark ? 'rgba(37,99,235,0.2)' : '#dbeafe', color: 'var(--color-primary)' }}>
                          {v.type}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      showToast('✅ Vehicle added successfully to your garage');
                      setActiveModal(null);
                    }}
                    className="btn btn-primary btn-block"
                  >
                    <Plus size={16} /> Add Another Car
                  </button>
                </div>
              )}

              {/* 2. Reviews Modal */}
              {activeModal === 'reviews' && (
                <div>
                  <p style={{ fontSize: '0.8125rem', color: textMuted, marginBottom: 14 }}>
                    Recent feedback and star ratings submitted for your private chauffeurs:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {reviews.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-lg)',
                          background: itemBg,
                          border: `1px solid ${borderCol}`,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontWeight: 800, fontSize: '0.875rem', color: textColor }}>{r.driver}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>★ {r.rating}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: textMuted, margin: 0, lineHeight: 1.4 }}>"{r.comment}"</p>
                        <div style={{ fontSize: '0.6875rem', color: textMuted, marginTop: 4 }}>{r.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Safety Settings */}
              {activeModal === 'safety' && (
                <div>
                  <div style={{
                    background: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 16,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#10b981', fontSize: '0.875rem', marginBottom: 2 }}>
                      <ShieldCheck size={16} /> Saarthi Shield™ Active
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isDark ? '#a7f3d0' : '#065f46' }}>
                      Every trip includes 4-tier live telemetry, geo-fence monitoring, and 1-tap police broadcast.
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: textColor, marginBottom: 8 }}>
                    Emergency SOS Contacts
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    {emergencyContacts.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: itemBg,
                          border: `1px solid ${borderCol}`,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: textColor }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: textMuted }}>{c.phone}</div>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Active SOS</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      showToast('🛡️ Emergency SOS contact updated');
                      setActiveModal(null);
                    }}
                    className="btn btn-outline btn-block"
                  >
                    + Add Emergency Contact
                  </button>
                </div>
              )}

              {/* 4. Support Modal */}
              {activeModal === 'support' && (
                <div>
                  <div style={{ textAlign: 'center', padding: '10px 0 16px' }}>
                    <div style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'rgba(37,99,235,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px',
                    }}>
                      <Phone size={24} color="var(--color-primary)" />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: textColor, margin: 0 }}>Saarthi 24/7 Priority Support</h3>
                    <p style={{ fontSize: '0.78rem', color: textMuted, marginTop: 4 }}>
                      Dedicated desk for active rides, driver delays, or billing inquiries.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                    <a
                      href="tel:18001237227"
                      className="btn btn-primary btn-block"
                      style={{ textDecoration: 'none' }}
                    >
                      <Phone size={16} /> Call Toll-Free: 1800-123-SAARTHI
                    </a>
                    <button
                      onClick={() => {
                        showToast('💬 Opening live agent chat...');
                        setActiveModal(null);
                      }}
                      className="btn btn-outline btn-block"
                    >
                      Chat with Live Agent
                    </button>
                  </div>
                </div>
              )}

              {/* 5. Saved Places */}
              {activeModal === 'places' && (
                <div>
                  <p style={{ fontSize: '0.8125rem', color: textMuted, marginBottom: 14 }}>
                    Quick-pick addresses for 1-tap pickup or destination selection:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                    {savedPlaces.map(p => (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-lg)',
                          background: itemBg,
                          border: `1px solid ${borderCol}`,
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{p.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '0.875rem', color: textColor }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: 1 }}>{p.address}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      showToast('📍 New location saved');
                      setActiveModal(null);
                    }}
                    className="btn btn-primary btn-block"
                  >
                    <Plus size={16} /> Add New Saved Place
                  </button>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </MainLayout>
  );
}
