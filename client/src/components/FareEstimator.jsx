import { useState, useCallback } from 'react';
import {
  MapPin, Navigation, Clock, Route, Calculator,
  ChevronDown, ChevronUp, X, Zap, Calendar,
  Car, Package, DollarSign, Info, ArrowRight, Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ─── Fare Tables ──────────────────────────────────────────────────────────── */
const BASE_FARE = 49;                // ₹ platform fee
const PER_KM    = 12;               // ₹ per km
const PER_MIN   = 1.5;              // ₹ per minute (traffic wait)
const NIGHT_SURCHARGE  = 0.25;      // +25% between 11 PM – 5 AM
const HOLIDAY_SURCHARGE = 0.15;

const PACKAGE_OPTIONS = [
  {
    id: 'ondemand',
    icon: '⚡',
    label: 'Driver Now',
    sublabel: 'On-demand chauffeur, billed by km',
    badge: 'Fastest',
    badgeColor: 'badge-emergency',
  },
  {
    id: 'hourly',
    icon: '⏱️',
    label: 'Hourly Hire',
    sublabel: 'Fixed hourly rate, unlimited stops',
    badge: 'Flexible',
    badgeColor: 'badge-primary',
  },
  {
    id: 'outstation',
    icon: '🛣️',
    label: 'Outstation / Long Drive',
    sublabel: 'Intercity drive, flat day rate + fuel',
    badge: 'Best Value',
    badgeColor: 'badge-success',
  },
];

const HOURLY_RATES = [
  { hours: 2, km: 30,  price: 399,  label: '2 hrs · 30 km' },
  { hours: 4, km: 60,  price: 699,  label: '4 hrs · 60 km' },
  { hours: 8, km: 120, price: 1199, label: '8 hrs · 120 km' },
  { hours: 12, km: 180, price: 1699, label: '12 hrs · 180 km (Full Day)' },
];

const OUTSTATION_RATES = [
  { km: 100,  label: 'Up to 100 km',    base: 999  },
  { km: 200,  label: '101–200 km',      base: 1799 },
  { km: 300,  label: '201–300 km',      base: 2499 },
  { km: 9999, label: '300+ km (Quoted)',base: null  },
];

/* ─── Fare Calculator Helpers ─────────────────────────────────────────────── */
function estimateKm(pickup, drop) {
  if (!pickup || !drop) return 0;
  // Very rough mock: count characters × 0.9 for "km" simulation
  const diff = Math.abs(pickup.length - drop.length) + 7;
  return Math.min(Math.max(diff * 1.4, 6), 85);
}

function calcOnDemandFare(km, isNight = false, isHoliday = false) {
  if (!km) return null;
  const dist      = parseFloat(km) || 0;
  const base      = BASE_FARE;
  const distFare  = Math.round(dist * PER_KM);
  const trafficFee= Math.round(dist * PER_MIN * 0.6); // avg 0.6 min/km
  let subtotal    = base + distFare + trafficFee;
  let surcharges  = 0;
  if (isNight)   surcharges += Math.round(subtotal * NIGHT_SURCHARGE);
  if (isHoliday) surcharges += Math.round(subtotal * HOLIDAY_SURCHARGE);
  const taxes     = Math.round((subtotal + surcharges) * 0.05);
  const total     = subtotal + surcharges + taxes;
  return { base, distFare, trafficFee, surcharges, taxes, total, dist };
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function FareEstimator({ isOpen, onClose, onBookNow }) {
  const { isDark } = useTheme();

  const [pickup,      setPickup]      = useState('');
  const [drop,        setDrop]        = useState('');
  const [packageType, setPackageType] = useState('ondemand');
  const [hours,       setHours]       = useState(HOURLY_RATES[0]);
  const [outstation,  setOutstation]  = useState(OUTSTATION_RATES[0]);
  const [isNight,     setIsNight]     = useState(false);
  const [isHoliday,   setIsHoliday]   = useState(false);
  const [showSurcharge, setShowSurcharge] = useState(false);

  if (!isOpen) return null;

  // ─── Derived fare ──────────────────────────────────────────────────────────
  const estKm   = estimateKm(pickup, drop);
  const fare    = packageType === 'ondemand'
    ? calcOnDemandFare(estKm, isNight, isHoliday)
    : null;
  const hasInputs = pickup.trim().length > 2 && drop.trim().length > 2;

  // ─── Theme tokens ──────────────────────────────────────────────────────────
  const bg       = isDark ? '#0f172a'                     : '#ffffff';
  const overlay  = isDark ? 'rgba(0,0,0,0.75)'            : 'rgba(0,0,0,0.45)';
  const surface  = isDark ? 'rgba(30, 41, 59, 0.9)'       : '#f8fafc';
  const card     = isDark ? 'rgba(15, 23, 42, 0.95)'      : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.1)'       : '#e2e8f0';
  const text     = isDark ? '#ffffff'                     : '#0f172a';
  const muted    = isDark ? 'rgba(255,255,255,0.6)'       : '#64748b';
  const inputBg  = isDark ? 'rgba(255,255,255,0.06)'      : '#ffffff';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: overlay,
          zIndex: 200,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 520,
        maxHeight: '92dvh',
        overflowY: 'auto',
        background: bg,
        borderRadius: '28px 28px 0 0',
        zIndex: 201,
        boxShadow: isDark
          ? '0 -20px 80px rgba(0,0,0,0.8)'
          : '0 -12px 50px rgba(0,0,0,0.18)',
        border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e2e8f0',
        animation: 'slide-up-panel 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}>

        {/* Handle */}
        <div style={{
          width: 44, height: 5,
          borderRadius: 3,
          background: isDark ? 'rgba(255,255,255,0.25)' : '#cbd5e1',
          margin: '14px auto 0',
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
            }}>
              <Calculator size={19} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: text }}>
                Fare Estimator
              </div>
              <div style={{ fontSize: '0.73rem', color: muted }}>
                Transparent pricing · No hidden charges
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
              border: `1px solid ${border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: muted,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '0 20px 24px' }}>

          {/* ─── PACKAGE SELECTOR ───────────────────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            marginBottom: 18,
          }}>
            {PACKAGE_OPTIONS.map(p => {
              const active = packageType === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPackageType(p.id)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 14,
                    border: active
                      ? '2px solid #2563eb'
                      : `1.5px solid ${border}`,
                    background: active
                      ? (isDark ? 'rgba(37,99,235,0.2)' : '#eff6ff')
                      : (isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{p.icon}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: active ? '#2563eb' : text,
                    lineHeight: 1.2,
                  }}>
                    {p.label}
                  </span>
                  {active && (
                    <span style={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      background: '#2563eb',
                      color: 'white',
                      borderRadius: 99,
                      padding: '1px 6px',
                      marginTop: 2,
                    }}>
                      {p.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ─── LOCATION INPUTS ────────────────────────────────────────────── */}
          <div style={{
            background: surface,
            borderRadius: 18,
            border: `1px solid ${border}`,
            overflow: 'hidden',
            marginBottom: 16,
          }}>
            {/* Pickup */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '13px 16px',
              borderBottom: `1px solid ${border}`,
            }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: 'rgba(220,38,38,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <MapPin size={16} color="#dc2626" />
              </div>
              <input
                type="text"
                placeholder="Pickup location"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: text,
                  '::placeholder': { color: muted },
                }}
              />
              {pickup && (
                <button onClick={() => setPickup('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Dotted connector */}
            <div style={{
              marginLeft: 28,
              height: 20,
              borderLeft: `2px dashed ${isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1'}`,
            }} />

            {/* Drop */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '13px 16px',
            }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: 'rgba(37,99,235,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Navigation size={16} color="#2563eb" />
              </div>
              <input
                type="text"
                placeholder="Drop-off destination"
                value={drop}
                onChange={e => setDrop(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: text,
                }}
              />
              {drop && (
                <button onClick={() => setDrop('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* ─── PACKAGE-SPECIFIC OPTIONS ───────────────────────────────────── */}
          {packageType === 'hourly' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: muted, textTransform: 'uppercase', marginBottom: 8 }}>
                Select Package
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {HOURLY_RATES.map(h => (
                  <button
                    key={h.hours}
                    onClick={() => setHours(h)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 14,
                      border: hours.hours === h.hours
                        ? '2px solid #2563eb'
                        : `1.5px solid ${border}`,
                      background: hours.hours === h.hours
                        ? (isDark ? 'rgba(37,99,235,0.18)' : '#eff6ff')
                        : (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Clock size={16} color={hours.hours === h.hours ? '#2563eb' : muted} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: text }}>{h.label}</span>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: '0.9375rem', color: hours.hours === h.hours ? '#2563eb' : text }}>
                      ₹{h.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {packageType === 'outstation' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: muted, textTransform: 'uppercase', marginBottom: 8 }}>
                Trip Distance Band
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {OUTSTATION_RATES.map(o => (
                  <button
                    key={o.km}
                    onClick={() => setOutstation(o)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 14,
                      border: outstation.km === o.km
                        ? '2px solid #16a34a'
                        : `1.5px solid ${border}`,
                      background: outstation.km === o.km
                        ? (isDark ? 'rgba(22,163,74,0.18)' : '#f0fdf4')
                        : (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Route size={16} color={outstation.km === o.km ? '#16a34a' : muted} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: text }}>{o.label}</span>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: '0.9375rem', color: outstation.km === o.km ? '#16a34a' : text }}>
                      {o.base ? `₹${o.base}` : 'Get Quote'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Outstation note */}
              <div style={{
                marginTop: 12,
                padding: '10px 14px',
                borderRadius: 10,
                background: isDark ? 'rgba(234, 179, 8, 0.1)' : '#fefce8',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                fontSize: '0.78rem',
                color: isDark ? '#fde047' : '#854d0e',
                lineHeight: 1.5,
              }}>
                <strong>ℹ️ Includes:</strong> Driver allowance, tolls (shared). Fuel extra — driver uses your vehicle.
              </div>
            </div>
          )}

          {/* ─── SURCHARGE TOGGLES ──────────────────────────────────────────── */}
          {packageType === 'ondemand' && (
            <div style={{ marginBottom: 14 }}>
              <button
                onClick={() => setShowSurcharge(s => !s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.78rem', fontWeight: 700,
                  color: muted,
                  marginBottom: showSurcharge ? 10 : 0,
                }}
              >
                {showSurcharge ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Add surge conditions (Night / Holiday)
              </button>

              {showSurcharge && (
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { key: 'night', label: '🌙 Night (11 PM–5 AM)', val: isNight, set: setIsNight, pct: '+25%' },
                    { key: 'holiday', label: '🎉 Public Holiday', val: isHoliday, set: setIsHoliday, pct: '+15%' },
                  ].map(s => (
                    <button
                      key={s.key}
                      onClick={() => s.set(v => !v)}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: `1.5px solid ${s.val ? '#f59e0b' : border}`,
                        background: s.val
                          ? (isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb')
                          : (isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                      }}
                    >
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: text }}>{s.label}</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#f59e0b' }}>{s.pct}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── FARE BREAKDOWN CARD ─────────────────────────────────────────── */}
          {packageType === 'ondemand' && (
            <div style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))'
                : 'linear-gradient(135deg, #0f172a, #1e3a5f)',
              borderRadius: 20,
              padding: '18px 20px',
              marginBottom: 16,
              color: 'white',
              boxShadow: '0 8px 32px rgba(37,99,235,0.25)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Fare Breakdown
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: 'rgba(16,185,129,0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 99,
                  padding: '2px 8px',
                }}>
                  GST Included
                </span>
              </div>

              {!hasInputs ? (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📍</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    Enter pickup & drop-off to see<br />your estimated fare
                  </div>
                </div>
              ) : fare ? (
                <>
                  {/* Route summary line */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 16,
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '0.78rem',
                    color: 'rgba(255,255,255,0.8)',
                  }}>
                    <Route size={14} color="#93c5fd" />
                    <span style={{ fontWeight: 700, color: '#93c5fd' }}>~{fare.dist.toFixed(1)} km</span>
                    <span>·</span>
                    <span>Est. drive time ~{Math.round(fare.dist * 2.8)} min</span>
                  </div>

                  {/* Line items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 14, fontSize: '0.8125rem' }}>
                    {[
                      { label: 'Platform Fee', amount: fare.base, note: 'One-time booking charge' },
                      { label: `Distance Charge (${fare.dist.toFixed(1)} km × ₹${PER_KM})`, amount: fare.distFare },
                      { label: 'Wait / Traffic Allowance', amount: fare.trafficFee },
                      ...(fare.surcharges > 0 ? [{ label: 'Night / Holiday Surcharge', amount: fare.surcharges, warn: true }] : []),
                      { label: 'GST (5%)', amount: fare.taxes },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: item.warn ? '#fbbf24' : 'rgba(255,255,255,0.7)' }}>
                          {item.label}
                          {item.note && <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 4, fontSize: '0.7rem' }}>({item.note})</span>}
                        </span>
                        <span style={{ fontWeight: 700, color: item.warn ? '#fbbf24' : 'rgba(255,255,255,0.9)' }}>₹{item.amount}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', marginBottom: 12 }} />

                  {/* Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
                      Estimated Total
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#34d399', lineHeight: 1 }}>
                        ₹{fare.total}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                        ± ₹30 based on actual route
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Hourly & Outstation summary cards */}
          {packageType === 'hourly' && (
            <div style={{
              background: isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff',
              border: '1.5px solid #2563eb',
              borderRadius: 18,
              padding: '16px 20px',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: muted }}>
                  Hourly Package · {hours.label}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563eb' }}>
                  ₹{hours.price}
                </span>
              </div>
              {[
                [`Included Km`, `${hours.km} km`],
                [`Km over limit`, `₹${PER_KM}/km`],
                [`GST (5%)`, `₹${Math.round(hours.price * 0.05)}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 6, color: muted }}>
                  <span>{k}</span>
                  <span style={{ fontWeight: 700, color: text }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 10, background: isDark ? 'rgba(37,99,235,0.2)' : '#dbeafe', fontSize: '0.75rem', color: isDark ? '#93c5fd' : '#1d4ed8' }}>
                ✅ Unlimited stops within package hours
              </div>
            </div>
          )}

          {packageType === 'outstation' && (
            <div style={{
              background: isDark ? 'rgba(22,163,74,0.12)' : '#f0fdf4',
              border: '1.5px solid #16a34a',
              borderRadius: 18,
              padding: '16px 20px',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: muted }}>
                  Outstation · {outstation.label}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#16a34a' }}>
                  {outstation.base ? `₹${outstation.base}` : 'Get Quote'}
                </span>
              </div>
              {[
                [`Driver Allowance`, `Included`],
                [`Tolls`, `Shared (split equally)`],
                [`Fuel`, `Customer's account`],
                [`Waiting (2 hrs free)`, `₹50/hr after`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 6, color: muted }}>
                  <span>{k}</span>
                  <span style={{ fontWeight: 700, color: text }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* ─── TRUST PILLS ───────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
            {[
              '🛡️ No surge from driver',
              '✅ Verified chauffeurs only',
              '📋 Fixed before you book',
              '💸 Pay after ride',
            ].map(pill => (
              <span key={pill} style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: isDark ? '#a5b4fc' : '#3730a3',
                background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 99,
                padding: '4px 10px',
              }}>
                {pill}
              </span>
            ))}
          </div>

          {/* ─── CTA BUTTONS ────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: '0 0 auto',
                padding: '14px 20px',
                borderRadius: 14,
                background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                border: `1px solid ${border}`,
                color: text,
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose?.();
                onBookNow?.({
                  pickup,
                  drop,
                  packageType,
                  estimatedFare: packageType === 'ondemand' ? fare?.total : packageType === 'hourly' ? hours.price : outstation.base,
                });
              }}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: 'white',
                fontWeight: 900,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
              }}
            >
              Book Chauffeur <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up-panel {
          from { transform: translateX(-50%) translateY(100%); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
