import MainLayout from '../layouts/MainLayout';
import { Clock, MapPin, Star, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const BOOKINGS = [
  { _id: 'b1', type: 'emergency', status: 'completed', driver: 'Suresh Kumar', rating: 4.8, vehicle: 'Honda City', plate: 'DL 01 AB 1234', pickup: 'Sector 18 Metro, Noida', date: '9 Aug 2026', fare: 380 },
  { _id: 'b2', type: 'scheduled', status: 'completed', driver: 'Ravi Sharma', rating: 4.6, vehicle: 'Toyota Fortuner', plate: 'UP 82 XY 5678', pickup: 'Home – Sector 62', date: '6 Aug 2026', fare: 850 },
  { _id: 'b3', type: 'emergency', status: 'pending', driver: null, rating: null, vehicle: 'Honda City', plate: 'DL 01 AB 1234', pickup: 'Current Location', date: '11 Aug 2026', fare: 299 },
  { _id: 'b4', type: 'emergency', status: 'cancelled', driver: null, rating: null, vehicle: 'Maruti Swift', plate: 'DL 7C AB 9999', pickup: 'Office – Cyber Hub', date: '3 Aug 2026', fare: 0 },
];

const STATUS = {
  completed: { label: 'Completed', bg: 'var(--color-success-50)', color: 'var(--color-success-dark)', darkBg: 'rgba(16, 185, 129, 0.15)', darkColor: '#34d399' },
  pending: { label: 'Searching...', bg: 'var(--color-warning-50)', color: 'var(--color-warning-dark)', darkBg: 'rgba(245, 158, 11, 0.15)', darkColor: '#fbbf24' },
  cancelled: { label: 'Cancelled', bg: 'var(--color-slate-100)', color: 'var(--color-slate-500)', darkBg: 'rgba(255, 255, 255, 0.08)', darkColor: 'rgba(255, 255, 255, 0.6)' },
  en_route: { label: 'En Route', bg: 'var(--color-primary-50)', color: 'var(--color-primary-dark)', darkBg: 'rgba(37, 99, 235, 0.2)', darkColor: '#93c5fd' },
};

export default function BookingsPage() {
  const { isDark } = useTheme();

  return (
    <MainLayout>
      <div style={{
        padding: '20px',
        minHeight: 'calc(100vh - var(--navbar-height) - var(--bottom-nav-height))',
        background: isDark ? '#090d16' : '#f8fafc',
        transition: 'background 0.3s ease',
      }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : 'var(--color-slate-900)' }}>
            My Bookings
          </h1>
          <p style={{ fontSize: '0.8125rem', color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--color-slate-600)', marginTop: 4 }}>
            {BOOKINGS.length} total rides
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BOOKINGS.map(b => {
            const s = STATUS[b.status];
            return (
              <div
                key={b._id}
                className="card"
                style={{
                  padding: '16px',
                  background: isDark ? 'rgba(15, 23, 42, 0.85)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--color-slate-200)',
                  boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{b.type === 'emergency' ? '⚡' : '📅'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isDark ? '#ffffff' : 'var(--color-slate-900)' }}>
                        {b.vehicle}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--color-slate-500)' }}>
                        {b.plate}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    background: isDark ? s.darkBg : s.bg,
                    color: isDark ? s.darkColor : s.color,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {s.label}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.8125rem',
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'var(--color-slate-600)',
                  marginBottom: 8
                }}>
                  <MapPin size={12} /> {b.pickup}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--color-slate-400)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Clock size={11} /> {b.date}
                    </span>
                    {b.driver && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: isDark ? 'rgba(255,255,255,0.7)' : 'var(--color-slate-600)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        marginLeft: 10
                      }}>
                        <Star size={11} color="var(--color-warning)" fill="var(--color-warning)" /> {b.driver}
                      </span>
                    )}
                  </div>
                  {b.fare > 0 && (
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.9375rem',
                      color: isDark ? '#ffffff' : 'var(--color-slate-900)'
                    }}>
                      ₹{b.fare}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
