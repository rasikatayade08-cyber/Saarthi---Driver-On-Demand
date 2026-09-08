import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import MainLayout from '../layouts/MainLayout';
import ThreeDHome from '../components/ThreeDHome';
import ReasonModal from '../components/ReasonModal';
import RequestDriverFlow from '../components/RequestDriverFlow';
import SaarthiShield from '../components/SaarthiShield';
import SafetySuiteModal from '../components/SafetySuiteModal';
import PaymentRatingModal from '../components/PaymentRatingModal';
import FareEstimator from '../components/FareEstimator';
import {
  MapPin, Calendar, Car, Clock, ChevronRight,
  Star, Plus, CreditCard, ShieldCheck, Heart, Crown, Users, Zap, Calculator
} from 'lucide-react';


const MOCK_VEHICLES = [
  { _id: 'veh_001', nickname: 'My City', make: 'Honda', model: 'City', licensePlate: 'DL 01 AB 1234', type: 'sedan', color: 'Pearl White' },
  { _id: 'veh_002', nickname: 'Family SUV', make: 'Toyota', model: 'Fortuner', licensePlate: 'UP 82 XY 5678', type: 'suv', color: 'Phantom Black' },
];

const MOCK_BOOKINGS = [
  {
    _id: 'bkg_001',
    driverName: 'Suresh Kumar',
    driverRating: 4.9,
    vehicleName: 'Honda City · DL 01 AB 1234',
    pickupAddress: 'Sector 18 Metro, Noida',
    status: 'completed',
    type: 'emergency',
    mode: 'Safe Return Mode',
    reason: 'Had a few drinks',
    fare: 380,
    date: 'Yesterday',
  },
  {
    _id: 'bkg_002',
    driverName: 'Ravi Sharma',
    driverRating: 4.7,
    vehicleName: 'Toyota Fortuner · UP 82 XY 5678',
    pickupAddress: 'Home – Sector 62',
    status: 'completed',
    type: 'scheduled',
    mode: 'Journey Mode',
    reason: 'Airport / Long journey',
    fare: 850,
    date: '4 days ago',
  },
  {
    _id: 'bkg_003',
    driverName: null,
    vehicleName: 'Honda City · DL 01 AB 1234',
    pickupAddress: 'Current Location',
    status: 'pending',
    type: 'emergency',
    mode: 'Express Mode',
    reason: 'On-Demand Chauffeur',
    fare: 299,
    date: '10 min ago',
  },
];

const VEHICLE_EMOJIS = { sedan: '🚗', suv: '🚙', hatchback: '🚘', truck: '🛻', van: '🚐', other: '🚗' };

const STATUS_CONFIG = {
  completed: { label: 'Completed', badgeClass: 'badge-success' },
  pending:   { label: 'Searching...', badgeClass: 'badge-warning' },
  accepted:  { label: 'Chauffeur Found', badgeClass: 'badge-primary' },
  en_route:  { label: 'En Route', badgeClass: 'badge-primary' },
  cancelled: { label: 'Cancelled', badgeClass: 'badge-slate' },
};

export default function CustomerHomePage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showFlow, setShowFlow] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [bookingType, setBookingType] = useState('emergency');
  const [showSOS, setShowSOS] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedBookingForPay, setSelectedBookingForPay] = useState(null);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [toastMsg, setToastMsg] = useState('');
  const [showFareEstimator, setShowFareEstimator] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleFareBookNow = (fareData) => {
    setShowFareEstimator(false);
    setSelectedReason({
      id: 'fare_calc',
      emoji: '💰',
      title: fareData.packageType === 'hourly' ? 'Hourly Hire' : fareData.packageType === 'outstation' ? 'Outstation Trip' : 'On-Demand',
      mode: fareData.packageType === 'outstation' ? 'Journey Mode' : fareData.packageType === 'hourly' ? 'Hourly Mode' : 'Express Mode',
      modeBadge: fareData.packageType === 'outstation' ? '🛣️ Journey Mode' : fareData.packageType === 'hourly' ? '⏱️ Hourly Mode' : '⚡ Express Mode',
    });
    setBookingType('emergency');
    setShowFlow(true);
  };


  const handleGetDriverNow = () => {
    setBookingType('emergency');
    setShowReasonModal(true);
  };

  const handleScheduleDriver = () => {
    setBookingType('scheduled');
    setSelectedReason(null);
    setShowFlow(true);
  };

  const handleReasonSelected = (reasonObj) => {
    setSelectedReason(reasonObj);
    setShowReasonModal(false);
    setShowFlow(true);
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'driver_now') {
      handleGetDriverNow();
    } else if (actionId === 'schedule') {
      handleScheduleDriver();
    } else if (actionId === 'preferred') {
      showToast('❤️ Preferred Chauffeurs: Suresh Kumar (★4.9) & Amit Singh (★4.8) available');
    } else if (actionId === 'family') {
      setSelectedReason({
        id: 'family',
        emoji: '👨‍👩‍👧',
        title: 'Family travel',
        mode: 'Family Safety Mode',
        modeBadge: '👨‍👩‍👧 Family Safety Mode',
      });
      setBookingType('emergency');
      setShowFlow(true);
    } else if (actionId === 'shield') {
      showToast('🛡️ Saarthi Shield™ Active: All 4 safety protocols enforced on your account');
    } else if (actionId === 'premium') {
      showToast('⭐ Saarthi Luxury Chauffeurs: Top 1% commercial executive drivers');
    }
  };

  const handleBookingSuccess = (booking) => {
    setShowFlow(false);
    setBookings((prev) => [
      {
        ...booking,
        driverName: booking.driver?.name || 'Suresh Kumar',
        driverRating: booking.driver?.rating || 4.9,
        vehicleName: `${booking.selectedVehicle?.nickname || 'Your Vehicle'} · ${booking.selectedVehicle?.licensePlate || ''}`,
        pickupAddress: booking.pickupLocation,
        status: 'completed',
        type: booking.bookingType,
        mode: booking.mode || 'Safety Mode',
        reason: booking.reason || 'On-Demand Driver',
        fare: booking.bookingType === 'emergency' ? 299 : 199,
        date: 'Just now',
      },
      ...prev,
    ]);

    showToast(
      booking.bookingType === 'emergency'
        ? `🚨 Driver trip completed! Mode: ${booking.mode || 'Safety Mode'}`
        : '📅 Chauffeur scheduled successfully!'
    );

    setSelectedBookingForPay({
      _id: booking.id || 'bkg_new',
      driverName: booking.driver?.name || 'Suresh Kumar',
      totalFare: booking.bookingType === 'emergency' ? 299 : 199,
      baseFare: booking.bookingType === 'emergency' ? 240 : 160,
      distanceFare: 40,
      taxes: 19,
    });
    setShowPayment(true);
  };

  const handlePaymentComplete = (payData) => {
    setShowPayment(false);
    showToast(`✅ Payment of ₹${payData.totalPayable} received! Rating submitted.`);
  };

  return (
    <MainLayout>
      {/* Toast Notification */}
      {toastMsg && <div className="toast">{toastMsg}</div>}

      {/* Reason Selection Modal (Step 1 of Driver Now) */}
      <ReasonModal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        onSelectReason={handleReasonSelected}
      />

      {/* Request Driver Flow Modal */}
      {showFlow && (
        <RequestDriverFlow
          onClose={() => setShowFlow(false)}
          onSuccess={handleBookingSuccess}
          initialReason={selectedReason}
          initialBookingType={bookingType}
        />
      )}

      {/* Safety & Emergency Suite Modal */}
      <SafetySuiteModal
        isOpen={showSOS}
        onClose={() => setShowSOS(false)}
        activeBooking={bookings[0]}
        initialTab="sos"
      />

      {/* Fare Estimator Modal */}
      <FareEstimator
        isOpen={showFareEstimator}
        onClose={() => setShowFareEstimator(false)}
        onBookNow={handleFareBookNow}
      />

      {/* Payment & Rating Modal */}
      <PaymentRatingModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        booking={selectedBookingForPay}
        onComplete={handlePaymentComplete}
      />

      {/* ── FULL-BLEED 3D CINEMATIC HERO ── */}
      <ThreeDHome
        onGetDriverNow={handleGetDriverNow}
        onScheduleDriver={handleScheduleDriver}
        onQuickAction={handleQuickAction}
      />

      {/* ── BELOW-HERO CONTENT CONTAINER ── */}
      <div style={{
        padding: '24px 20px 0',
        background: isDark ? '#090d16' : '#f8fafc',
        transition: 'background 0.3s ease',
      }}>
        
        {/* ── FARE ESTIMATOR BANNER ── */}
        <button
          onClick={() => setShowFareEstimator(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 18px',
            borderRadius: 20,
            background: isDark
              ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(124, 58, 237, 0.18))'
              : 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
            border: isDark
              ? '1.5px solid rgba(99, 102, 241, 0.35)'
              : '1.5px solid rgba(99, 102, 241, 0.25)',
            cursor: 'pointer',
            marginBottom: 20,
            boxShadow: isDark
              ? '0 4px 20px rgba(37,99,235,0.12)'
              : '0 4px 20px rgba(99,102,241,0.08)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = isDark
              ? '0 8px 30px rgba(37,99,235,0.2)'
              : '0 8px 30px rgba(99,102,241,0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isDark
              ? '0 4px 20px rgba(37,99,235,0.12)'
              : '0 4px 20px rgba(99,102,241,0.08)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
            }}>
              <Calculator size={22} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '0.9375rem',
                fontWeight: 800,
                color: isDark ? '#ffffff' : '#1e1b4b',
              }}>
                💰 Fare Estimator
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: isDark ? 'rgba(255,255,255,0.6)' : '#6366f1',
                marginTop: 2,
              }}>
                Get transparent pricing before you book
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            Check Price →
          </div>
        </button>

        {/* ── 3D SAARTHI SHIELD SHOWCASE ── */}
        <div style={{ marginBottom: 24 }}>
          <SaarthiShield onClick={() => handleQuickAction('shield')} />
        </div>


        {/* ── MY REGISTERED VEHICLES ── */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-header">
            <h2 className="section-title" style={{ color: isDark ? '#ffffff' : 'var(--color-slate-900)' }}>
              🚗 My Vehicles to Drive
            </h2>
            <button
              className="section-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 700 }}
              onClick={() => showToast('🚗 You can add more vehicles in your profile')}
            >
              + Add Car
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOCK_VEHICLES.map((v) => (
              <div
                key={v._id}
                className="card card-interactive"
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: isDark ? 'rgba(15, 23, 42, 0.85)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--color-slate-200)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: isDark
                      ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                      : 'linear-gradient(135deg, var(--color-slate-100), var(--color-slate-200))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  {VEHICLE_EMOJIS[v.type]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 800,
                    color: isDark ? '#ffffff' : 'var(--color-slate-900)',
                    fontSize: '0.9375rem'
                  }}>
                    {v.nickname}
                  </div>
                  <div style={{
                    fontSize: '0.8125rem',
                    color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--color-slate-600)',
                    marginTop: 2
                  }}>
                    {v.make} {v.model} · {v.color}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: 4,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      background: isDark ? 'rgba(37,99,235,0.15)' : 'var(--color-primary-50)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {v.licensePlate}
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleGetDriverNow}
                  style={{ flexShrink: 0 }}
                >
                  Get Driver
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── RECENT CHAUFFEUR TRIPS ── */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-header">
            <h2 className="section-title" style={{ color: isDark ? '#ffffff' : 'var(--color-slate-900)' }}>
              📋 Recent Chauffeur Trips
            </h2>
            <button className="section-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 700 }}>
              View all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bookings.slice(0, 3).map((b) => {
              const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.completed;
              return (
                <div
                  key={b._id}
                  className="card"
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-xl)',
                    background: isDark ? 'rgba(15, 23, 42, 0.85)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--color-slate-200)',
                    boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 'var(--radius-md)',
                        background: b.type === 'emergency'
                          ? (isDark ? 'rgba(239, 68, 68, 0.15)' : 'var(--color-emergency-50)')
                          : (isDark ? 'rgba(245, 158, 11, 0.15)' : 'var(--color-warning-50)'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {b.type === 'emergency' ? '⚡' : '📅'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div>
                          <div style={{
                            fontWeight: 800,
                            color: isDark ? '#ffffff' : 'var(--color-slate-900)',
                            fontSize: '0.9375rem'
                          }}>
                            {b.vehicleName}
                          </div>
                          {b.mode && (
                            <span
                              style={{
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                color: isDark ? '#60a5fa' : 'var(--color-primary-dark)',
                                background: isDark ? 'rgba(37, 99, 235, 0.2)' : 'var(--color-primary-50)',
                                padding: '1px 6px',
                                borderRadius: 'var(--radius-full)',
                                display: 'inline-block',
                                marginTop: 2,
                              }}
                            >
                              {b.mode}
                            </span>
                          )}
                        </div>
                        <span className={`badge ${cfg.badgeClass}`} style={{ flexShrink: 0 }}>
                          {cfg.label}
                        </span>
                      </div>

                      <div style={{
                        fontSize: '0.8125rem',
                        color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--color-slate-600)',
                        marginTop: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <MapPin size={12} />
                        {b.pickupAddress}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--color-slate-500)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <Clock size={12} /> {b.date}
                        </div>
                        {b.fare > 0 && (
                          <div style={{
                            fontWeight: 800,
                            fontSize: '0.9375rem',
                            color: isDark ? '#ffffff' : 'var(--color-slate-900)'
                          }}>
                            ₹{b.fare}
                          </div>
                        )}
                      </div>

                      {b.driverName && b.status === 'completed' && (
                        <div
                          style={{
                            marginTop: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'var(--color-slate-50)',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid var(--color-slate-100)',
                          }}
                        >
                          <div style={{
                            fontSize: '0.75rem',
                            color: isDark ? '#e2e8f0' : 'var(--color-slate-700)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}>
                            <Star size={12} color="var(--color-warning)" fill="var(--color-warning)" />
                            <strong>{b.driverName}</strong> · {b.driverRating}
                          </div>

                          <button
                            onClick={() => {
                              setSelectedBookingForPay({
                                _id: b._id,
                                driverName: b.driverName,
                                totalFare: b.fare || 380,
                                baseFare: 299,
                                distanceFare: 60,
                                taxes: 21,
                              });
                              setShowPayment(true);
                            }}
                            className="btn btn-sm btn-outline"
                            style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                          >
                            <CreditCard size={12} /> Pay & Rate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FLOATING EMERGENCY SOS BUTTON ── */}
      <button
        id="sos-float-btn"
        onClick={() => setShowSOS(true)}
        style={{
          position: 'fixed',
          bottom: 'calc(var(--bottom-nav-height) + 16px)',
          right: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-emergency), #7f1d1d)',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: 800,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          boxShadow: '0 0 24px rgba(220, 38, 38, 0.6)',
          animation: 'pulse-emergency 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          zIndex: 49,
          cursor: 'pointer',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          lineHeight: 1,
        }}
        aria-label="Emergency SOS"
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>🆘</span>
        <span style={{ fontSize: '0.5rem', letterSpacing: '0.1em' }}>SOS</span>
      </button>
    </MainLayout>
  );
}
