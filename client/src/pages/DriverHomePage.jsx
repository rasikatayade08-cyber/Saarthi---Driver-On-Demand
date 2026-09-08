import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Power, ShieldCheck, MapPin, Navigation, Phone, Car, Star,
  CheckCircle2, Clock, DollarSign, AlertTriangle, ArrowRight, X,
  Radio, Lock, KeyRound, Sun, Moon
} from 'lucide-react';

const INITIAL_REQUESTS = [
  {
    id: 'req_101',
    customerName: 'Raj Sharma',
    customerPhone: '+91 98765 43210',
    type: 'emergency',
    pickupAddress: 'Sector 18 Metro Station, Noida',
    destinationAddress: 'Connaught Place, New Delhi',
    distance: '1.2 km away',
    tripDistance: '14.5 km',
    vehicleName: 'Honda City (Sedan)',
    vehiclePlate: 'DL 01 AB 1234',
    vehicleColor: 'Pearl White',
    estimatedFare: 380,
    requestedAt: 'Just now',
    otp: '4829',
  },
  {
    id: 'req_102',
    customerName: 'Priya Mehta',
    customerPhone: '+91 87654 32109',
    type: 'scheduled',
    scheduledTime: 'Today, 6:30 PM',
    pickupAddress: 'Koramangala Block 4, Bangalore',
    destinationAddress: 'Kempegowda Int. Airport (KIA)',
    distance: '3.4 km away',
    tripDistance: '38.0 km',
    vehicleName: 'Toyota Fortuner (SUV)',
    vehiclePlate: 'UP 82 XY 5678',
    vehicleColor: 'Phantom Black',
    estimatedFare: 850,
    requestedAt: '5 min ago',
    otp: '9152',
  }
];

export default function DriverHomePage() {
  const { user, updateUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(user?.isOnline ?? true);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeTrip, setActiveTrip] = useState(null);
  
  // 7-Stage State Machine: 'accepted' | 'arriving' | 'arrived' | 'otp' | 'trip_started' | 'completed'
  const [tripStage, setTripStage] = useState('accepted');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    updateUser({ isOnline: nextState });
    showToast(nextState ? '🟢 You are now ONLINE & ready for rides' : '🔴 You are now OFFLINE');
  };

  const handleAcceptRequest = (req) => {
    setActiveTrip(req);
    setTripStage('accepted');
    setRequests(prev => prev.filter(r => r.id !== req.id));
    showToast(`✅ Stage 2: Request Accepted!`);
  };

  const handleDeclineRequest = (reqId) => {
    setRequests(prev => prev.filter(r => r.id !== reqId));
    showToast('Request declined');
  };

  const handleNextStage = () => {
    if (tripStage === 'accepted') {
      setTripStage('arriving');
      showToast('🚗 Stage 3: En route to pickup location...');
    } else if (tripStage === 'arriving') {
      setTripStage('arrived');
      showToast('📍 Stage 4: Arrived at pickup location!');
    } else if (tripStage === 'arrived') {
      setTripStage('otp');
      showToast('🔐 Stage 5: Please ask customer for 4-digit OTP code');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpError('');
    if (enteredOtp !== activeTrip?.otp) {
      setOtpError(`Incorrect OTP (${enteredOtp}). Ask customer for code.`);
      return;
    }

    setTripStage('trip_started');
    showToast('🚀 Stage 6: OTP Verified! Trip Started');
  };

  const handleCompleteTrip = () => {
    setTripStage('completed');
    updateUser({
      todayEarnings: (user?.todayEarnings || 0) + (activeTrip?.estimatedFare || 0),
      totalRides: (user?.totalRides || 0) + 1,
    });
    showToast('🎉 Stage 7: Trip Completed & Payment Logged!');
  };

  const handleFinishTrip = () => {
    setActiveTrip(null);
    setTripStage('accepted');
    setEnteredOtp('');
    setOtpError('');
  };

  const textColor = isDark ? '#ffffff' : 'var(--color-slate-900)';
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : 'var(--color-slate-600)';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.88)' : '#ffffff';
  const itemBg = isDark ? 'rgba(30, 41, 59, 0.65)' : 'var(--color-slate-50)';
  const borderCol = isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-slate-200)';

  return (
    <div className="app-shell" style={{
      background: isDark ? '#090d16' : '#f8fafc',
      minHeight: '100vh',
      transition: 'background 0.3s ease'
    }}>
      
      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}

      {/* Driver Header */}
      <header style={{
        background: isDark ? 'rgba(15, 23, 42, 0.95)' : '#0f172a',
        color: 'white',
        padding: '20px 20px 24px',
        borderRadius: '0 0 24px 24px',
        boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.5)' : 'var(--shadow-md)',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.125rem',
              boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
            }}>
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>{user?.name || 'Suresh Kumar'}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={12} color="var(--color-warning)" fill="var(--color-warning)" />
                {user?.rating || 4.8} rating · Chauffeur Partner
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-full)',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#fbbf24' : '#ffffff',
                cursor: 'pointer',
              }}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.1)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Verification Status Warning if not verified */}
        {!user?.isVerified && (
          <div style={{
            background: 'rgba(245,158,11,0.2)',
            border: '1px solid var(--color-warning)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 14px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
          }}>
            <span style={{ color: '#fef08a' }}>⚠️ Verification Pending</span>
            <button
              onClick={() => navigate('/driver/verify')}
              style={{ background: 'var(--color-warning)', color: 'black', fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Verify Docs
            </button>
          </div>
        )}

        {/* Online / Offline Toggle Bar */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: isOnline ? 'var(--color-success)' : 'var(--color-slate-400)',
              boxShadow: isOnline ? '0 0 10px var(--color-success)' : 'none',
            }} />
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'white' }}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>
                {isOnline ? 'Receiving nearby driver requests' : 'Toggle online to get rides'}
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleOnline}
            style={{
              width: 54,
              height: 30,
              borderRadius: 30,
              background: isOnline ? 'var(--color-success)' : 'rgba(255,255,255,0.2)',
              position: 'relative',
              transition: 'all 0.3s ease',
              padding: 3,
              cursor: 'pointer',
            }}
            id="online-toggle-btn"
          >
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'white',
              transform: isOnline ? 'translateX(24px)' : 'translateX(0)',
              transition: 'transform 0.3s ease',
              boxShadow: 'var(--shadow-sm)',
            }} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" style={{ paddingTop: 16, paddingBottom: 32, paddingLeft: 16, paddingRight: 16 }}>

        {/* Driver Stats Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          <div className="card" style={{ padding: '12px', textAlign: 'center', background: cardBg, border: `1px solid ${borderCol}` }}>
            <div style={{ fontSize: '0.75rem', color: textMuted, fontWeight: 600 }}>Today&apos;s Pay</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-success-dark)', marginTop: 2 }}>
              ₹{user?.todayEarnings || 1450}
            </div>
          </div>
          <div className="card" style={{ padding: '12px', textAlign: 'center', background: cardBg, border: `1px solid ${borderCol}` }}>
            <div style={{ fontSize: '0.75rem', color: textMuted, fontWeight: 600 }}>Rides</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: textColor, marginTop: 2 }}>
              {user?.totalRides || 1243}
            </div>
          </div>
          <div className="card" style={{ padding: '12px', textAlign: 'center', background: cardBg, border: `1px solid ${borderCol}` }}>
            <div style={{ fontSize: '0.75rem', color: textMuted, fontWeight: 600 }}>Rating</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-warning-dark)', marginTop: 2 }}>
              ★ {user?.rating || 4.8}
            </div>
          </div>
        </div>

        {/* ── ACTIVE TRIP STAGE PROGRESSION (7 STAGES) ── */}
        {activeTrip ? (
          <div className="card animate-bounce-in" style={{ padding: '20px', border: '2px solid var(--color-primary)', background: cardBg }}>
            
            {/* Stage Badge & Fare Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span className="badge badge-primary">
                🚗 Stage: {tripStage.toUpperCase()}
              </span>
              <span style={{ fontWeight: 800, fontSize: '1.125rem', color: isDark ? '#34d399' : 'var(--color-success-dark)' }}>
                ₹{activeTrip.estimatedFare}
              </span>
            </div>

            {/* Customer & Vehicle Info */}
            <div style={{ background: itemBg, padding: '14px', borderRadius: 'var(--radius-lg)', marginBottom: 16, border: `1px solid ${borderCol}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: textColor }}>
                    👤 {activeTrip.customerName}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: textMuted, marginTop: 2 }}>
                    Vehicle: <strong style={{ color: textColor }}>{activeTrip.vehicleName}</strong> ({activeTrip.vehiclePlate})
                  </div>
                </div>

                <a
                  href={`tel:${activeTrip.customerPhone}`}
                  className="btn btn-sm btn-success btn-icon"
                  style={{ borderRadius: '50%', padding: 10 }}
                >
                  <Phone size={18} />
                </a>
              </div>
            </div>

            {/* Route */}
            <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <MapPin size={16} color="var(--color-emergency)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: textMuted, fontWeight: 600 }}>PICKUP LOCATION</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: textColor }}>{activeTrip.pickupAddress}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <Navigation size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: textMuted, fontWeight: 600 }}>DESTINATION</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: textColor }}>{activeTrip.destinationAddress}</div>
                </div>
              </div>
            </div>

            {/* STAGE 2: ACCEPTED → MOVE TO ARRIVING */}
            {tripStage === 'accepted' && (
              <div>
                <div style={{ fontSize: '0.8125rem', color: textMuted, marginBottom: 12 }}>
                  ✅ Request Accepted. Click below to start driving towards customer&apos;s location.
                </div>
                <button onClick={handleNextStage} className="btn btn-primary btn-lg btn-block">
                  🚗 Stage 3: Start Driving to Pickup Location
                </button>
              </div>
            )}

            {/* STAGE 3: ARRIVING → MOVE TO ARRIVED */}
            {tripStage === 'arriving' && (
              <div>
                <div style={{
                  background: isDark ? 'rgba(37,99,235,0.18)' : 'var(--color-primary-50)',
                  border: isDark ? '1px solid rgba(37,99,235,0.35)' : '1px solid var(--color-primary-100)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 14,
                  fontSize: '0.8125rem',
                  color: isDark ? '#bfdbfe' : 'var(--color-primary-dark)'
                }}>
                  📡 Driving to pickup: <strong>{activeTrip.pickupAddress}</strong> (1.2 km away · ETA 4 mins)
                </div>
                <button onClick={handleNextStage} className="btn btn-emergency btn-lg btn-block">
                  📍 Stage 4: Mark &quot;Arrived at Pickup Location&quot;
                </button>
              </div>
            )}

            {/* STAGE 4: ARRIVED → MOVE TO OTP VERIFICATION */}
            {tripStage === 'arrived' && (
              <div>
                <div style={{
                  background: isDark ? 'rgba(16, 185, 129, 0.18)' : 'var(--color-success-50)',
                  border: isDark ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--color-success-100)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 14,
                  fontSize: '0.8125rem',
                  color: isDark ? '#a7f3d0' : 'var(--color-success-dark)'
                }}>
                  ✅ Customer notified of arrival! Meet customer and request their 4-digit security OTP.
                </div>
                <button onClick={handleNextStage} className="btn btn-success btn-lg btn-block">
                  🔐 Stage 5: Enter Security OTP Code
                </button>
              </div>
            )}

            {/* STAGE 5: OTP VERIFICATION INPUT */}
            {tripStage === 'otp' && (
              <form onSubmit={handleVerifyOtp} style={{ background: itemBg, padding: '16px', borderRadius: 'var(--radius-lg)', marginBottom: 10, border: `1px solid ${borderCol}` }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: textColor, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <KeyRound size={18} color="var(--color-primary)" /> Enter 4-Digit Customer OTP
                </div>
                <div style={{ fontSize: '0.75rem', color: textMuted, marginBottom: 14 }}>
                  Ask the vehicle owner for the security OTP shown on their mobile screen. (Demo OTP: <strong>{activeTrip.otp}</strong>)
                </div>

                {otpError && (
                  <div style={{ background: '#fef2f2', border: '1px solid var(--color-emergency)', padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--color-emergency)', fontSize: '0.8125rem', marginBottom: 12 }}>
                    ⚠️ {otpError}
                  </div>
                )}

                <div className="input-group" style={{ marginBottom: 14 }}>
                  <input
                    type="text"
                    maxLength={4}
                    className="input"
                    placeholder="Enter 4-Digit OTP (e.g. 4829)"
                    value={enteredOtp}
                    onChange={e => setEnteredOtp(e.target.value)}
                    style={{ fontSize: '1.25rem', fontWeight: 800, textAlign: 'center', letterSpacing: '0.2em' }}
                    autoFocus
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Verify OTP & Start Trip
                </button>
              </form>
            )}

            {/* STAGE 6: TRIP STARTED → MOVE TO COMPLETED */}
            {tripStage === 'trip_started' && (
              <div>
                <div style={{
                  background: isDark ? 'rgba(16, 185, 129, 0.18)' : 'var(--color-success-50)',
                  border: '1px solid var(--color-success)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 14,
                  fontSize: '0.8125rem',
                  color: isDark ? '#a7f3d0' : 'var(--color-success-dark)',
                  fontWeight: 600
                }}>
                  🚀 Trip in progress! Driving owner&apos;s car to {activeTrip.destinationAddress}.
                </div>
                <button onClick={handleCompleteTrip} className="btn btn-success btn-lg btn-block">
                  🏁 Stage 7: Complete Trip & Collect ₹{activeTrip.estimatedFare}
                </button>
              </div>
            )}

            {/* STAGE 7: COMPLETED RECEIPT */}
            {tripStage === 'completed' && (
              <div style={{ textAlign: 'center', paddingTop: 8 }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#34d399' : 'var(--color-success-dark)', marginBottom: 4 }}>
                  Trip Successfully Completed!
                </h3>
                <p style={{ fontSize: '0.875rem', color: textMuted, marginBottom: 16 }}>
                  Fare of ₹{activeTrip.estimatedFare} added to your earnings.
                </p>

                <div style={{ background: itemBg, padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: 16, textAlign: 'left', fontSize: '0.8125rem', border: `1px solid ${borderCol}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: textMuted }}>Base Fare</span>
                    <span style={{ fontWeight: 700, color: textColor }}>₹{activeTrip.estimatedFare}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: textMuted }}>Payment Method</span>
                    <span style={{ fontWeight: 700, color: isDark ? '#34d399' : 'var(--color-success-dark)' }}>UPI / Cash</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${borderCol}`, paddingTop: 6 }}>
                    <span style={{ fontWeight: 700, color: textColor }}>Total Collected</span>
                    <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: textColor }}>₹{activeTrip.estimatedFare}</span>
                  </div>
                </div>

                <button onClick={handleFinishTrip} className="btn btn-primary btn-block">
                  Back to Available Requests
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── INCOMING RIDE REQUESTS LIST ── */
          <div>
            <div className="section-header">
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: textColor }}>
                <Radio size={18} color={isOnline ? 'var(--color-success)' : 'var(--color-slate-400)'} />
                Incoming Requests ({isOnline ? requests.length : 0})
              </h2>
              {isOnline && requests.length > 0 && (
                <span className="badge badge-emergency pulse-emergency">⚡ Live Feed</span>
              )}
            </div>

            {!isOnline ? (
              <div className="card" style={{ padding: '32px 20px', textAlign: 'center', background: cardBg, border: `1px solid ${borderCol}` }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>⏸️</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: textColor, marginBottom: 6 }}>
                  You are currently Offline
                </h3>
                <p style={{ fontSize: '0.875rem', color: textMuted, marginBottom: 20 }}>
                  Switch your status toggle to Online above to receive driver booking requests.
                </p>
                <button onClick={handleToggleOnline} className="btn btn-success">
                  Go Online Now
                </button>
              </div>
            ) : requests.length === 0 ? (
              <div className="card" style={{ padding: '32px 20px', textAlign: 'center', background: cardBg, border: `1px solid ${borderCol}` }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📡</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: textColor, marginBottom: 6 }}>
                  Searching for nearby requests...
                </h3>
                <p style={{ fontSize: '0.875rem', color: textMuted }}>
                  Stay online. Emergency & scheduled driver requests will pop up here in real time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {requests.map(req => (
                  <div
                    key={req.id}
                    className="card animate-slide-up"
                    style={{
                      padding: '18px',
                      background: cardBg,
                      border: `1px solid ${borderCol}`,
                      borderLeft: `5px solid ${req.type === 'emergency' ? 'var(--color-emergency)' : 'var(--color-warning)'}`,
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <span className={`badge ${req.type === 'emergency' ? 'badge-emergency' : 'badge-warning'}`}>
                          {req.type === 'emergency' ? '🚨 Emergency Request' : '📅 Scheduled Trip'}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: 4 }}>
                          Requested {req.requestedAt} · {req.distance}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: textColor }}>
                          ₹{req.estimatedFare}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: textMuted }}>Estimated fare</div>
                      </div>
                    </div>

                    {/* Customer & Vehicle info */}
                    <div style={{ background: itemBg, padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: 14, border: `1px solid ${borderCol}` }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: textColor }}>
                        👤 {req.customerName}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: textMuted, marginTop: 3 }}>
                        🚘 Vehicle: <strong style={{ color: textColor }}>{req.vehicleName}</strong> ({req.vehiclePlate})
                      </div>
                    </div>

                    {/* Location preview */}
                    <div style={{ fontSize: '0.875rem', color: textColor, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <MapPin size={14} color="var(--color-emergency)" />
                        <strong>Pickup:</strong> <span style={{ color: textMuted }}>{req.pickupAddress}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Navigation size={14} color="var(--color-primary)" />
                        <strong>Drop:</strong> <span style={{ color: textMuted }}>{req.destinationAddress}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="btn btn-outline"
                        style={{ flex: '0 0 auto', borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'var(--color-slate-300)', color: textMuted }}
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        className={`btn btn-block ${req.type === 'emergency' ? 'btn-emergency' : 'btn-primary'}`}
                        style={{ flex: 1 }}
                      >
                        Accept Ride Request <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
