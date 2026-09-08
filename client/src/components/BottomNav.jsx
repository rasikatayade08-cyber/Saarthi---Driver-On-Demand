import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarDays, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/bookings', icon: CalendarDays, label: 'Bookings' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { isDark } = useTheme();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 'var(--container-max)',
      height: 'var(--bottom-nav-height)',
      background: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--color-slate-100)',
      display: 'flex',
      alignItems: 'stretch',
      zIndex: 50,
      boxShadow: isDark ? '0 -4px 24px rgba(0,0,0,0.4)' : '0 -4px 24px rgba(0,0,0,0.06)',
      transition: 'background 0.3s ease, border-color 0.3s ease',
    }}>
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
        const active = pathname === path;
        return (
          <Link key={path} to={path} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '8px',
            color: active
              ? 'var(--color-primary)'
              : (isDark ? 'rgba(255, 255, 255, 0.45)' : 'var(--color-slate-400)'),
            transition: 'all var(--transition-fast)',
            position: 'relative',
          }}>
            {active && (
              <span style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 32,
                height: 3,
                background: 'var(--color-primary)',
                borderRadius: '0 0 4px 4px',
                boxShadow: '0 0 10px var(--color-primary)',
              }} />
            )}
            <Icon size={active ? 22 : 20} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: active ? 700 : 500,
              letterSpacing: '0.02em',
            }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
