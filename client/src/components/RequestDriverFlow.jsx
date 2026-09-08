import { useState } from 'react';
import {
  X, MapPin, Car, Zap, Calendar, CheckCircle2,
  Search, ChevronRight, Clock, Navigation, AlertTriangle,
  User, Phone, Star, ShieldCheck, Radio, Award, Share2, Sparkles
} from 'lucide-react';
import LiveMap from './LiveMap';
import SaarthiShield from './SaarthiShield';
import { useTheme } from '../context/ThemeContext';

const MOCK_VEHICLES = [
  { _id: 'veh_001', nickname: 'My City', make: 'Honda', model: 'City', year: 2022, licensePlate: 'DL 01 AB 1234', color: 'Pearl White', type: 'sedan' },
  { _id: 'veh_002', nickname: 'Family SUV', make: 'Toyota', model: 'Fortuner', year: 2021, licensePlate: 'UP 82 XY 5678', color: 'Phantom Black', type: 'suv' },
  { _id: 'veh_003', nickname: 'Office Car', make: 'Maruti', model: 'Swift', year: 2023, licensePlate: 'DL 7C AB 9999', color: 'Magma Red', type: 'hatchback' },
];

const NEARBY_DRIVERS = [
  {
    id: 'drv_001',
    name: 'Suresh Kumar',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    experience: '8 yrs',
    totalRides: 1420,
    languages: ['Hindi', 'English', 'Punjabi'],
    phone: '+91 77889 90011',
    distance: '0.8 km',
    eta: '3 mins',
    matchScore: 99,
    rank: 1,
    badge: '🏆 Top Rated Chauffeur',
    verified: true,
    photoColor: '#2563eb',
    specialties: ['Automatic & Manual', 'Defensive Driving', 'VIP Etiquette']
  },
  {
    id: 'drv_002',
    name: 'Ravi Sharma',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.7,
    experience: '6 yrs',
    totalRides: 980,
    languages: ['Hindi', 'English'],
    phone: '+91 88990 01122',
    distance: '1.5 km',
    eta: '5 mins',
    matchScore: 94,
    rank: 2,
    badge: '⚡ Fast Response',
    verified: true,
    photoColor: '#7c3aed',
    specialties: ['City Navigation', 'Night Drive Pro']
  },
  {
    id: 'drv_003',
    name: 'Amit Singh',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    experience: '10 yrs',
    totalRides: 2150,
    languages: ['Hindi', 'English', 'Bengali'],
    phone: '+91 99001 12233',
    distance: '2.4 km',
    eta: '7 mins',
    matchScore: 90,
    rank: 3,
    badge: '🛡️ Highway Specialist',
    verified: true,
    photoColor: '#059669',
    specialties: ['Long Distance', 'Luxury Sedan Specialist']
  }
];

const STEPS = [
  { number: 1, label: 'Location' },
  { number: 2, label: 'Vehicle' },
  { number: 3, label: 'Type' },
  { number: 4, label: 'Confirm' },
];

const SUGGESTED_LOCATIONS = [
  'Current Location (GPS)',
  'Home - Sector 18, Noida',
  'Office - Cyber Hub, Gurugram',
  'Railway Station, New Delhi',
];


const VEHICLE_EMOJIS = { sedan: '🚗', suv: '🚙', hatchback: '🚘', truck: '🛻', van: '🚐', other: '🚗' };

const VEHICLE_CATEGORIES = [
  {
    id: 'hatchback_manual',
    emoji: '🚘',
    label: 'Hatchback',
    subLabel: 'Manual Gearbox',
    transmission: 'manual',
    bodyType: 'hatchback',
    examples: 'Swift, Polo, i20, WagonR',
    driverBadge: '🔧 Manual Specialist',
    badgeColor: '#0284c7',
    badgeBg: 'rgba(2, 132, 199, 0.15)',
    matchNote: 'Matched with manual-certified drivers',
    surcharge: 0,
  },
  {
    id: 'sedan_manual',
    emoji: '🚗',
    label: 'Sedan',
    subLabel: 'Manual Gearbox',
    transmission: 'manual',
    bodyType: 'sedan',
    examples: 'City, Verna, Ciaz, Rapid',
    driverBadge: '🔧 Manual Specialist',
    badgeColor: '#0284c7',
    badgeBg: 'rgba(2, 132, 199, 0.15)',
    matchNote: 'Matched with manual-certified drivers',
    surcharge: 0,
  },
  {
    id: 'sedan_auto',
    emoji: '🚗',
    label: 'Sedan',
    subLabel: 'Automatic / CVT',
    transmission: 'automatic',
    bodyType: 'sedan',
    examples: 'City CVT, Vento AT, Camry',
    driverBadge: '⚙️ Automatic Expert',
    badgeColor: '#7c3aed',
    badgeBg: 'rgba(124, 58, 237, 0.15)',
    matchNote: 'Verified automatic-transmission drivers',
    surcharge: 0,
  },
  {
    id: 'suv_auto',
    emoji: '🚙',
    label: 'SUV / MUV',
    subLabel: 'Automatic / 4WD',
    transmission: 'automatic',
    bodyType: 'suv',
    examples: 'Fortuner, Creta AT, Compass',
    driverBadge: '🚙 SUV Certified',
    badgeColor: '#059669',
    badgeBg: 'rgba(5, 150, 105, 0.15)',
    matchNote: 'SUV-licensed & highway specialist drivers',
    surcharge: 20,
  },
  {
    id: 'luxury',
    emoji: '👑',
    label: 'Luxury / Premium',
    subLabel: 'Executive Chauffeur',
    transmission: 'automatic',
    bodyType: 'luxury',
    examples: 'BMW, Mercedes, Audi, Jaguar',
    driverBadge: '👔 Executive Chauffeur',
    badgeColor: '#b45309',
    badgeBg: 'rgba(180, 83, 9, 0.15)',
    matchNote: 'Top 1% PSV-licensed luxury drivers',
    surcharge: 80,
  },
  {
    id: 'ev',
    emoji: '⚡',
    label: 'Electric Vehicle',
    subLabel: 'EV Specialist',
    transmission: 'automatic',
    bodyType: 'ev',
    examples: 'Nexon EV, MG ZS EV, Tata Tigor',
    driverBadge: '⚡ EV Certified',
    badgeColor: '#16a34a',
    badgeBg: 'rgba(22, 163, 74, 0.15)',
    matchNote: 'EV-trained drivers with regen knowledge',
    surcharge: 0,
  },
];

export default function RequestDriverFlow({
  onClose,
  onSuccess,
  initialReason = null,
  initialBookingType = 'emergency',
}) {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupLocation: 'Current Location (GPS)',
    pickupCustom: '',
    selectedVehicle: MOCK_VEHICLES[0],
    vehicleCategory: VEHICLE_CATEGORIES[0],
    bookingType: initialBookingType || 'emergency',
    scheduledDate: '',
    scheduledTime: '',
    reason: initialReason?.title || 'On-Demand Driver',
    mode: initialReason?.mode || 'Safety Mode',
  });

  const [searchingDrivers, setSearchingDrivers] = useState(false);
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [acceptedState, setAcceptedState] = useState(false);

  const update = (key, value) => setFormData(p => ({ ...p, [key]: value }));

  const canProceed = () => {
    if (step === 1) return !!(formData.pickupLocation);
    if (step === 2) return !!(formData.selectedVehicle) && !!(formData.vehicleCategory);
    if (step === 3) {
      if (formData.bookingType === 'emergency') return true;
      if (formData.bookingType === 'scheduled') return formData.scheduledDate && formData.scheduledTime;
      return false;
    }
    return true;
  };


  const handleNext = () => {
    if (step < 4) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  // Dispatch & Ranking logic
  const handleConfirm = async () => {
    setSearchingDrivers(true);
    
    await new Promise(r => setTimeout(r, 2200));
    
    const topDriver = NEARBY_DRIVERS[0];
    setAssignedDriver(topDriver);
    setSearchingDrivers(false);
    setConfirmed(true);

    setTimeout(() => {
      setAcceptedState(true);
      onSuccess?.({
        id: `bkg_${Date.now()}`,
        ...formData,
        driver: topDriver,
        status: 'accepted',
      });
    }, 1500);
  };

  const vehicle = formData.selectedVehicle;

  // Text and card color helpers based on active theme
  const textColor = isDark ? '#ffffff' : 'var(--color-slate-900)';
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : 'var(--color-slate-600)';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.95)' : '#ffffff';
  const itemBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'var(--color-slate-50)';
  const borderCol = isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-slate-200)';

  return (
    <>
      {/* Overlay */}
      <div className="overlay" onClick={onClose} />

      {/* Modal Sheet */}
      <div
        className="modal-sheet"
        style={{
          paddingBottom: 32,
          maxWidth: 540,
          background: cardBg,
          color: textColor,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
        }}
      >
        <div className="modal-handle" style={{ background: isDark ? 'rgba(255, 255, 255, 0.25)' : undefined }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: textColor, display: 'flex', alignItems: 'center', gap: 6 }}>
              {searchingDrivers ? '🔍 Matching Verified Chauffeurs...' : confirmed ? '✅ Driver Assigned & En Route' : 'Request a Driver'}
            </div>

            {/* Personalized Mode Badge */}
            {initialReason && !confirmed && !searchingDrivers && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 4,
                background: isDark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.08)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                border: isDark ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(37,99,235,0.2)'
              }}>
                <span style={{ fontSize: '0.75rem' }}>{initialReason.emoji}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isDark ? '#93c5fd' : 'var(--color-primary)' }}>
                  {initialReason.mode} · {initialReason.title}
                </span>
              </div>
            )}

            {!confirmed && !searchingDrivers && !initialReason && (
              <div style={{ fontSize: '0.8125rem', color: textMuted, marginTop: 2 }}>
                Step {step} of 4 — {STEPS[step - 1].label}
              </div>
            )}
          </div>
          <button
            className="btn btn-icon btn-ghost"
            onClick={onClose}
            aria-label="Close"
            style={{ color: textMuted }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Bar */}
        {!confirmed && !searchingDrivers && (
          <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center' }}>
            {STEPS.map((s, i) => (
              <div key={s.number} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <div className={`step-dot ${step > s.number ? 'completed' : step === s.number ? 'active' : 'inactive'}`}>
                  {step > s.number ? <CheckCircle2 size={14} /> : s.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`step-line ${step > s.number + 1 ? 'completed' : step > s.number ? 'active' : ''}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        <div style={{ padding: '0 20px' }}>

          {/* ── SEARCHING & RADAR SCANNING STATE ── */}
          {searchingDrivers && (
            <div style={{ textAlign: 'center', padding: '24px 0 16px', animation: 'fade-in 0.3s ease forwards' }}>
              <div style={{
                position: 'relative',
                width: 90,
                height: 90,
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.25))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Radio size={40} color="var(--color-primary)" className="pulse-emergency" />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px solid var(--color-primary)',
                  animation: 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                }} />
              </div>

              <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: textColor, marginBottom: 4 }}>
                Locating Closest Verified Chauffeurs...
              </h3>
              <p style={{ fontSize: '0.8125rem', color: textMuted, maxWidth: 320, margin: '0 auto 18px' }}>
                Scanning 12 drivers within 2.5 km · Enforcing {formData.mode} safety criteria.
              </p>

              {/* Live ranking preview list */}
              <div style={{ background: itemBg, borderRadius: 'var(--radius-xl)', padding: '12px', border: `1px solid ${borderCol}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', marginBottom: 8, textAlign: 'left' }}>
                  Smart Dispatch Candidate Match
                </div>
                {NEARBY_DRIVERS.map(drv => (
                  <div key={drv.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'white',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 6,
                    border: `1px solid ${borderCol}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, textAlign: 'left' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', background: isDark ? 'rgba(37,99,235,0.2)' : 'var(--color-primary-50)', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        #{drv.rank}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: textColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {drv.name}
                          <ShieldCheck size={14} color="#10b981" />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: textMuted }}>
                          ★ {drv.rating} · {drv.distance} · ETA {drv.eta}
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                      {drv.matchScore}% Match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CONFIRMED & DRIVER ACCEPTED STATE ── */}
          {confirmed && assignedDriver && (
            <div style={{ textAlign: 'center', padding: '12px 0 8px', animation: 'bounce-in 0.5s forwards' }}>
              
              {/* Status Header */}
              <div style={{
                background: acceptedState
                  ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5')
                  : (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb'),
                border: `1px solid ${acceptedState ? 'var(--color-success)' : 'var(--color-warning)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '12px 16px',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
                <CheckCircle2 size={20} color={acceptedState ? 'var(--color-success-dark)' : 'var(--color-warning-dark)'} />
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: acceptedState ? (isDark ? '#34d399' : 'var(--color-success-dark)') : (isDark ? '#fbbf24' : 'var(--color-warning-dark)') }}>
                  {acceptedState ? '🎉 Chauffeur Assigned & En Route to Your Car!' : '⚡ Dispatching details to driver...'}
                </span>
              </div>

              {/* Security OTP Code Box */}
              <div style={{
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                color: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '14px',
                marginBottom: 14,
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>
                  🔒 Trip Start Security OTP
                </div>
                <div style={{ fontSize: '1.875rem', fontWeight: 900, letterSpacing: '0.2em', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                  4829
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                  Share this 4-digit OTP only after driver {assignedDriver.name} arrives at your vehicle
                </div>
              </div>

              {/* Assigned Driver Match Card */}
              <div className="card" style={{
                padding: '18px',
                textAlign: 'left',
                border: '2px solid var(--color-primary)',
                boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.5)' : 'var(--shadow-lg)',
                background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'white',
                borderRadius: 'var(--radius-xl)',
                marginBottom: 14
              }}>
                {/* Top Profile Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={assignedDriver.photo}
                      alt={assignedDriver.name}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--color-primary)',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{
                      display: 'none',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                    }}>
                      {assignedDriver.name.charAt(0)}
                    </div>
                    {/* Live Online Badge Indicator */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: '#10b981',
                      border: '2px solid white',
                    }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: textColor }}>
                        {assignedDriver.name}
                      </span>
                      {assignedDriver.verified && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5',
                          color: isDark ? '#34d399' : '#059669',
                          padding: '2px 6px',
                          borderRadius: 99,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          border: '1px solid rgba(16, 185, 129, 0.4)'
                        }}>
                          <ShieldCheck size={11} color="#10b981" /> Verified
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        background: '#fef3c7',
                        color: '#b45309',
                        padding: '1px 6px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        fontWeight: 800,
                      }}>
                        <Star size={12} fill="#b45309" color="#b45309" /> {assignedDriver.rating}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: textMuted }}>
                        • {assignedDriver.experience} exp
                      </span>
                      <span style={{ fontSize: '0.75rem', color: textMuted }}>
                        • {assignedDriver.totalRides} trips
                      </span>
                    </div>

                    {/* Spoken Languages */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.68rem', color: textMuted, fontWeight: 600 }}>🗣️ Speaks:</span>
                      {assignedDriver.languages?.map((lang) => (
                        <span
                          key={lang}
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                            color: textColor,
                            border: `1px solid ${borderCol}`
                          }}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="badge badge-success" style={{ fontSize: '0.6875rem', alignSelf: 'flex-start' }}>
                    {assignedDriver.badge}
                  </span>
                </div>

                {/* Match Specialty Banner */}
                {formData.vehicleCategory && (
                  <div style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff',
                    border: `1px solid ${isDark ? 'rgba(37,99,235,0.3)' : '#bfdbfe'}`,
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '0.72rem', color: isDark ? '#93c5fd' : '#1e40af', fontWeight: 600 }}>
                      🎯 Matched for: <strong>{formData.vehicleCategory.label} ({formData.vehicleCategory.subLabel})</strong>
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: formData.vehicleCategory.badgeColor,
                      background: formData.vehicleCategory.badgeBg,
                      padding: '2px 6px',
                      borderRadius: 4
                    }}>
                      {formData.vehicleCategory.driverBadge}
                    </span>
                  </div>
                )}

                {/* Metrics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 8,
                  background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'var(--color-slate-50)',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 14,
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: textMuted, fontWeight: 600 }}>STATUS</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-primary)' }}>En Route</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: textMuted, fontWeight: 600 }}>ETA</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: isDark ? '#34d399' : 'var(--color-success-dark)' }}>{assignedDriver.eta}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: textMuted, fontWeight: 600 }}>DISTANCE</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: textColor }}>{assignedDriver.distance}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <a
                    href={`tel:${assignedDriver.phone}`}
                    className="btn btn-success"
                    style={{ flex: 1, borderRadius: 'var(--radius-lg)', padding: '10px' }}
                  >
                    <Phone size={16} /> Call Driver
                  </a>
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`🚨 *Saarthi Live Trip Tracking*\nDriver ${assignedDriver.name} is arriving for my ${vehicle?.nickname || 'car'}!\n\n📍 *Track Live:* https://saarthi.in/track/live_981`);
                      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                    }}
                    className="btn btn-outline"
                    style={{ flex: '0 0 auto', borderColor: '#25D366', color: '#25D366', padding: '10px 14px' }}
                    title="Share trip via WhatsApp"
                  >
                    <Share2 size={16} /> Share Trip
                  </button>
                </div>
              </div>

              {/* Saarthi Shield compact reminder */}
              <SaarthiShield isCompact={true} />
            </div>
          )}

          {/* ── STEP 1: PICKUP LOCATION ── */}
          {!confirmed && !searchingDrivers && step === 1 && (
            <div style={{ animation: 'slide-up 0.3s ease forwards' }}>
              <div className="input-group" style={{ marginBottom: 16 }}>
                <label className="input-label" style={{ color: textMuted }}>Where is your vehicle parked?</label>
                <div className="input-icon-wrap">
                  <Search size={16} className="input-icon" />
                  <input
                    className="input"
                    placeholder="Search address or landmark..."
                    value={formData.pickupLocation}
                    onChange={e => update('pickupLocation', e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: textMuted, marginBottom: 10 }}>
                Suggested Locations
              </div>
              {SUGGESTED_LOCATIONS.map((loc, i) => (
                <button
                  key={i}
                  onClick={() => update('pickupLocation', loc)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: formData.pickupLocation === loc
                      ? (isDark ? 'rgba(37,99,235,0.2)' : 'var(--color-primary-50)')
                      : itemBg,
                    border: `2px solid ${formData.pickupLocation === loc ? 'var(--color-primary)' : 'transparent'}`,
                    marginBottom: 8,
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                  }}
                >
                  <Navigation size={15} color={formData.pickupLocation === loc ? 'var(--color-primary)' : 'var(--color-slate-400)'} />
                  <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: textColor }}>
                    {loc}
                  </span>
                  {formData.pickupLocation === loc && <CheckCircle2 size={16} color="var(--color-primary)" />}
                </button>
              ))}
            </div>
          )}

          {/* ── STEP 2: SELECT VEHICLE & TRANSMISSION ── */}
          {!confirmed && !searchingDrivers && step === 2 && (
            <div style={{ animation: 'slide-up 0.3s ease forwards' }}>
              {/* Part A: Registered Car */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  1. Choose Your Car
                </div>
                {MOCK_VEHICLES.map(v => {
                  const selected = formData.selectedVehicle?._id === v._id;
                  return (
                    <button
                      key={v._id}
                      onClick={() => update('selectedVehicle', v)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-lg)',
                        background: selected
                          ? (isDark ? 'rgba(37,99,235,0.2)' : 'var(--color-primary-50)')
                          : itemBg,
                        border: `2px solid ${selected ? 'var(--color-primary)' : borderCol}`,
                        marginBottom: 8,
                        textAlign: 'left',
                        transition: 'all var(--transition-fast)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: 26, lineHeight: 1 }}>{VEHICLE_EMOJIS[v.type]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: textColor, fontSize: '0.9rem' }}>
                          {v.nickname}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: textMuted, marginTop: 1 }}>
                          {v.make} {v.model} · {v.color}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: selected ? 'var(--color-primary)' : textMuted, marginTop: 2, fontWeight: 600, letterSpacing: '0.05em' }}>
                          {v.licensePlate}
                        </div>
                      </div>
                      {selected && (
                        <CheckCircle2 size={18} color="var(--color-primary)" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Part B: Vehicle Category & Transmission */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    2. Vehicle Category & Transmission
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    🎯 Smart Driver Matching
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {VEHICLE_CATEGORIES.map(cat => {
                    const isSelected = formData.vehicleCategory?.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => update('vehicleCategory', cat)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '12px',
                          borderRadius: 'var(--radius-lg)',
                          border: isSelected ? '2px solid var(--color-primary)' : `1.5px solid ${borderCol}`,
                          background: isSelected
                            ? (isDark ? 'rgba(37,99,235,0.18)' : '#eff6ff')
                            : itemBg,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 24 }}>{cat.emoji}</span>
                          {isSelected && <CheckCircle2 size={16} color="var(--color-primary)" />}
                        </div>

                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: textColor, lineHeight: 1.2 }}>
                          {cat.label}
                        </div>
                        <div style={{ fontSize: '0.73rem', color: textMuted, marginTop: 2, fontWeight: 500 }}>
                          {cat.subLabel}
                        </div>

                        {/* Driver Matching Badge */}
                        <div style={{
                          marginTop: 8,
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          color: cat.badgeColor,
                          background: cat.badgeBg,
                          padding: '2px 6px',
                          borderRadius: 6,
                          border: `1px solid ${cat.badgeColor}33`,
                          display: 'inline-block',
                          lineHeight: 1.3,
                        }}>
                          {cat.driverBadge}
                        </div>

                        <div style={{ fontSize: '0.65rem', color: textMuted, marginTop: 4 }}>
                          {cat.examples}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {formData.vehicleCategory && (
                  <div style={{
                    marginTop: 12,
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: isDark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.06)',
                    border: isDark ? '1px solid rgba(37,99,235,0.3)' : '1px solid rgba(37,99,235,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <Sparkles size={14} color="var(--color-primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isDark ? '#93c5fd' : 'var(--color-primary)' }}>
                      {formData.vehicleCategory.matchNote}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: EMERGENCY / SCHEDULED ── */}
          {!confirmed && !searchingDrivers && step === 3 && (
            <div style={{ animation: 'slide-up 0.3s ease forwards' }}>
              <p style={{ fontSize: '0.875rem', color: textMuted, marginBottom: 16 }}>
                Trip Timing:
              </p>

              {/* Emergency Option */}
              <button
                onClick={() => update('bookingType', 'emergency')}
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-xl)',
                  padding: '16px',
                  background: formData.bookingType === 'emergency'
                    ? (isDark ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)')
                    : itemBg,
                  border: `2px solid ${formData.bookingType === 'emergency' ? 'var(--color-emergency)' : borderCol}`,
                  marginBottom: 12,
                  textAlign: 'left',
                  transition: 'all var(--transition-base)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: formData.bookingType === 'emergency' ? 'var(--color-emergency)' : (isDark ? '#334155' : 'var(--color-slate-200)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Zap size={20} color={formData.bookingType === 'emergency' ? 'white' : 'var(--color-slate-400)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      color: formData.bookingType === 'emergency'
                        ? (isDark ? '#fca5a5' : 'var(--color-emergency-dark)')
                        : textColor
                    }}>
                      🚨 Driver Now (Instant Dispatch)
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: textMuted, marginTop: 2 }}>
                      Nearby chauffeur arrives at your car in under 5–8 minutes.
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <span className="badge badge-emergency">⚡ 4–6 min ETA</span>
                      <span className="badge badge-slate">₹299 base</span>
                    </div>
                  </div>
                  {formData.bookingType === 'emergency' && <CheckCircle2 size={20} color="var(--color-emergency)" />}
                </div>
              </button>

              {/* Scheduled Option */}
              <button
                onClick={() => update('bookingType', 'scheduled')}
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-xl)',
                  padding: '16px',
                  background: formData.bookingType === 'scheduled'
                    ? (isDark ? 'rgba(245, 158, 11, 0.2)' : 'linear-gradient(135deg, #fffbeb, #fef3c7)')
                    : itemBg,
                  border: `2px solid ${formData.bookingType === 'scheduled' ? 'var(--color-warning)' : borderCol}`,
                  marginBottom: 12,
                  textAlign: 'left',
                  transition: 'all var(--transition-base)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: formData.bookingType === 'scheduled' ? 'var(--color-warning)' : (isDark ? '#334155' : 'var(--color-slate-200)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Calendar size={20} color={formData.bookingType === 'scheduled' ? 'white' : 'var(--color-slate-400)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      color: formData.bookingType === 'scheduled'
                        ? (isDark ? '#fde68a' : 'var(--color-warning-dark)')
                        : textColor
                    }}>
                      📅 Schedule Ahead
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: textMuted, marginTop: 2 }}>
                      Pre-book for airport, evening events, or outstation journeys.
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <span className="badge badge-warning">⏱ Guaranteed pickup</span>
                      <span className="badge badge-slate">₹199 base</span>
                    </div>
                  </div>
                  {formData.bookingType === 'scheduled' && <CheckCircle2 size={20} color="var(--color-warning-dark)" />}
                </div>
              </button>

              {/* Date/Time pickers */}
              {formData.bookingType === 'scheduled' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                  <div className="input-group">
                    <label className="input-label" style={{ color: textMuted }}>Date</label>
                    <input
                      type="date"
                      className="input"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.scheduledDate}
                      onChange={e => update('scheduledDate', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label" style={{ color: textMuted }}>Time</label>
                    <input
                      type="time"
                      className="input"
                      value={formData.scheduledTime}
                      onChange={e => update('scheduledTime', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 4: CONFIRM SUMMARY ── */}
          {!confirmed && !searchingDrivers && step === 4 && (
            <div style={{ animation: 'slide-up 0.3s ease forwards' }}>
              <div style={{
                background: itemBg,
                borderRadius: 'var(--radius-xl)',
                padding: '16px',
                marginBottom: 14,
                border: `1px solid ${borderCol}`,
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Trip & Chauffeur Summary
                </div>

                {[
                  { icon: <MapPin size={15} />, label: 'Vehicle Location', value: formData.pickupLocation, color: 'var(--color-emergency)' },
                  {
                    icon: <Car size={15} />,
                    label: 'Car to Drive',
                    value: vehicle ? `${vehicle.nickname} · ${vehicle.licensePlate}` : '—',
                    color: 'var(--color-primary)',
                  },
                  {
                    icon: <Sparkles size={15} />,
                    label: 'Transmission & Category',
                    value: formData.vehicleCategory ? `${formData.vehicleCategory.emoji} ${formData.vehicleCategory.label} (${formData.vehicleCategory.subLabel}) · ${formData.vehicleCategory.driverBadge}` : '—',
                    color: '#7c3aed',
                  },
                  {
                    icon: formData.bookingType === 'emergency' ? <Zap size={15} /> : <Calendar size={15} />,
                    label: 'Dispatch Priority',
                    value: formData.bookingType === 'emergency'
                      ? '🚨 Instant Dispatch (4–8 min)'
                      : `📅 Scheduled: ${formData.scheduledDate} at ${formData.scheduledTime}`,
                    color: formData.bookingType === 'emergency' ? 'var(--color-emergency)' : 'var(--color-warning-dark)',
                  },
                  {
                    icon: <ShieldCheck size={15} />,
                    label: 'Safety Mode',
                    value: formData.mode,
                    color: isDark ? '#34d399' : 'var(--color-success-dark)',
                  },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'var(--color-white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: row.color,
                      flexShrink: 0,
                      border: `1px solid ${borderCol}`,
                      marginTop: 1
                    }}>
                      {row.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: textMuted, textTransform: 'uppercase' }}>
                        {row.label}
                      </div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: textColor, marginTop: 1 }}>
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Fare */}
                <div style={{ borderTop: `1px solid ${borderCol}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: textMuted, fontWeight: 600 }}>Estimated Chauffeur Fare</span>
                  <span style={{ fontSize: '1.0625rem', fontWeight: 900, color: textColor }}>
                    ₹{formData.bookingType === 'emergency' ? '299' : '199'}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: textMuted, marginLeft: 4 }}>base</span>
                  </span>
                </div>
              </div>

              {/* Saarthi Shield guarantee snippet */}
              <div style={{
                background: isDark ? 'rgba(37,99,235,0.12)' : 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(16,185,129,0.06))',
                borderRadius: 'var(--radius-lg)',
                padding: '10px 12px',
                border: isDark ? '1px solid rgba(37,99,235,0.3)' : '1px solid rgba(37,99,235,0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, color: isDark ? '#93c5fd' : 'var(--color-primary-dark)' }}>
                  <ShieldCheck size={15} color="#10b981" />
                  <span>Saarthi Shield™ Guarantee: 100% Police & DL Verified Driver</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!confirmed && !searchingDrivers && (
          <div style={{ padding: '16px 20px 0', display: 'flex', gap: 10 }}>
            {step > 1 && (
              <button
                className="btn btn-outline btn-lg"
                onClick={handleBack}
                style={{ flex: '0 0 auto', padding: '12px 18px' }}
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                className={`btn btn-lg btn-block ${canProceed() ? 'btn-primary' : ''}`}
                onClick={handleNext}
                disabled={!canProceed()}
                style={{
                  flex: 1,
                  opacity: canProceed() ? 1 : 0.5,
                  background: canProceed() ? undefined : (isDark ? '#334155' : 'var(--color-slate-200)'),
                  color: canProceed() ? undefined : (isDark ? '#94a3b8' : 'var(--color-slate-400)'),
                  cursor: canProceed() ? 'pointer' : 'not-allowed',
                }}
              >
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <button
                className={`btn btn-lg btn-block ${formData.bookingType === 'emergency' ? 'btn-emergency' : 'btn-success'}`}
                onClick={handleConfirm}
                style={{ flex: 1 }}
              >
                {formData.bookingType === 'emergency' ? '🚨 Search & Dispatch Driver' : '📅 Confirm Schedule'}
                <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
