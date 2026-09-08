import { Bell, Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 'var(--container-max)',
      height: 'var(--navbar-height)',
      background: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--color-slate-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 50,
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 2px 16px rgba(0,0,0,0.05)',
      transition: 'background 0.3s ease, border-color 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 14px rgba(37, 99, 235, 0.4)',
        }}>
          <Shield size={18} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{
            fontSize: '1rem',
            fontWeight: 800,
            color: isDark ? '#ffffff' : 'var(--color-slate-800)',
            lineHeight: 1.1,
          }}>
            Saarthi
          </div>
          <div style={{
            fontSize: '0.625rem',
            fontWeight: 500,
            color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--color-slate-400)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Driver on Demand
          </div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-icon btn-ghost"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            color: isDark ? '#fbbf24' : 'var(--color-slate-700)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun size={18} color="#fbbf24" style={{ animation: 'spin-slow 20s linear infinite' }} />
          ) : (
            <Moon size={18} color="#475569" />
          )}
        </button>

        {/* Notification */}
        <button className="btn btn-icon btn-ghost" style={{ position: 'relative' }} aria-label="Notifications">
          <Bell size={20} color={isDark ? 'rgba(255,255,255,0.7)' : 'var(--color-slate-600)'} />
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 8,
            height: 8,
            background: 'var(--color-emergency)',
            borderRadius: '50%',
            border: isDark ? '2px solid #0f172a' : '2px solid white',
          }} />
        </button>

        {/* Avatar */}
        {user && (
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: '0 2px 10px rgba(124, 58, 237, 0.35)',
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
