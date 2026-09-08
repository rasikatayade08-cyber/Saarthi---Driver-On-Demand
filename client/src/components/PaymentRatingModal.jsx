import { useState } from 'react';
import {
  CreditCard, Smartphone, Banknote, QrCode, CheckCircle2,
  Star, Heart, ArrowRight, ShieldCheck, Receipt, Sparkles, X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FEEDBACK_TAGS = [
  '🛡️ Safe Driving',
  '⏱️ On Time',
  '🗣️ Polite & Helpful',
  '🧭 Smooth Route',
  '🧼 Clean & Careful',
];

const TIP_OPTIONS = [0, 20, 50, 100];

export default function PaymentRatingModal({
  isOpen,
  onClose,
  booking = {
    _id: 'bkg_98214',
    driverName: 'Suresh Kumar',
    driverRating: 4.8,
    vehicleName: 'Honda City (Sedan)',
    licensePlate: 'DL 01 AB 1234',
    pickupAddress: 'Sector 18 Metro, Noida',
    destinationAddress: 'Connaught Place, New Delhi',
    baseFare: 299,
    distanceKm: 14.5,
    distanceFare: 120,
    taxes: 21,
    totalFare: 440,
  },
  onComplete,
}) {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1); // 1 = Payment, 2 = Processing, 3 = Rating & Tip, 4 = Thank You
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cash' | 'wallet'
  const [upiId, setUpiId] = useState('raj@upi');
  const [tip, setTip] = useState(50);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState(['🛡️ Safe Driving', '⏱️ On Time']);
  const [reviewText, setReviewText] = useState('');
  const [txnId, setTxnId] = useState('');

  if (!isOpen) return null;

  const totalPayable = (booking?.totalFare || 440) + tip;

  const handlePayNow = async () => {
    setStep(2); // Processing state
    await new Promise(r => setTimeout(r, 1800));
    setTxnId(`TXN_${Math.floor(100000 + Math.random() * 900000)}`);
    setStep(3); // Move to Rating step
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitRating = () => {
    setStep(4);
    setTimeout(() => {
      onComplete?.({
        bookingId: booking._id,
        paymentMethod,
        totalPayable,
        rating,
        reviewText,
        tip,
        txnId,
      });
    }, 2000);
  };

  const textColor = isDark ? '#ffffff' : 'var(--color-slate-900)';
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : 'var(--color-slate-600)';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.95)' : '#ffffff';
  const itemBg = isDark ? 'rgba(30, 41, 59, 0.6)' : 'var(--color-slate-50)';
  const borderCol = isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-slate-200)';

  return (
    <>
      <div className="overlay" onClick={onClose} />

      <div
        className="modal-sheet"
        style={{
          paddingBottom: 32,
          background: cardBg,
          color: textColor,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
        }}
      >
        <div className="modal-handle" style={{ background: isDark ? 'rgba(255, 255, 255, 0.25)' : undefined }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: textColor }}>
              {step === 1 ? '💳 Fare Payment' : step === 3 ? '⭐ Rate Your Driver' : step === 4 ? '🎉 Payment Complete' : 'Processing...'}
            </div>
            <div style={{ fontSize: '0.8125rem', color: textMuted, marginTop: 2 }}>
              {step === 1 ? 'Choose digital payment method' : step === 3 ? `How was your ride with ${booking.driverName}?` : ''}
            </div>
          </div>

          <button className="btn btn-icon btn-ghost" onClick={onClose} style={{ color: textMuted }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0 20px' }}>

          {/* ── STEP 1: PAYMENT METHOD & FARE BREAKDOWN ── */}
          {step === 1 && (
            <div style={{ animation: 'slide-up 0.3s ease forwards' }}>
              
              {/* Fare Breakdown Card */}
              <div style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))'
                  : 'linear-gradient(135deg, var(--color-slate-900), var(--color-slate-800))',
                color: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                marginBottom: 20,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
                boxShadow: 'var(--shadow-md)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
                    Trip Receipt Summary
                  </span>
                  <span className="badge badge-success">Verified Chauffeur</span>
                </div>

                <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 14 }}>
                  ₹{booking.totalFare || 440}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Base Driver Fee</span>
                    <span>₹{booking.baseFare || 299}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Distance Charge (14.5 km)</span>
                    <span>₹{booking.distanceFare || 120}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Taxes & Platform Care (5%)</span>
                    <span>₹{booking.taxes || 21}</span>
                  </div>
                </div>
              </div>

              {/* Payment Options Header */}
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', marginBottom: 12 }}>
                Select Payment Method
              </div>

              {[
                { id: 'upi', icon: <Smartphone size={20} color="var(--color-primary)" />, title: 'UPI (GPay / PhonePe / Paytm / BHIM)', desc: 'Instant 1-click payment' },
                { id: 'card', icon: <CreditCard size={20} color="var(--color-purple)" />, title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                { id: 'cash', icon: <Banknote size={20} color="var(--color-success-dark)" />, title: 'Cash to Driver', desc: 'Pay cash directly upon arrival' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-lg)',
                    background: paymentMethod === opt.id
                      ? (isDark ? 'rgba(37,99,235,0.15)' : 'var(--color-primary-50)')
                      : itemBg,
                    border: `2px solid ${paymentMethod === opt.id ? 'var(--color-primary)' : borderCol}`,
                    marginBottom: 10,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: isDark ? 'none' : 'var(--shadow-sm)'
                  }}>
                    {opt.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: textColor }}>{opt.title}</div>
                    <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: 2 }}>{opt.desc}</div>
                  </div>
                  {paymentMethod === opt.id && <CheckCircle2 size={18} color="var(--color-primary)" />}
                </button>
              ))}

              {/* UPI ID Input if UPI selected */}
              {paymentMethod === 'upi' && (
                <div className="input-group" style={{ marginTop: 10, marginBottom: 16 }}>
                  <label className="input-label" style={{ color: textMuted }}>Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="name@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                  />
                </div>
              )}

              {/* Pay Action Button */}
              <button
                id="pay-submit-btn"
                onClick={handlePayNow}
                className="btn btn-success btn-lg btn-block"
                style={{ marginTop: 14 }}
              >
                Pay ₹{booking.totalFare || 440} Securely <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* ── STEP 2: PAYMENT PROCESSING STATE ── */}
          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '40px 0', animation: 'fade-in 0.3s forwards' }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: isDark ? 'rgba(37,99,235,0.2)' : 'var(--color-primary-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  border: '3px solid var(--color-primary)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin-slow 0.8s linear infinite',
                }} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: textColor, marginBottom: 6 }}>
                Processing Digital Payment...
              </h3>
              <p style={{ fontSize: '0.875rem', color: textMuted }}>
                Connecting to payment gateway. Please do not close or refresh.
              </p>
            </div>
          )}

          {/* ── STEP 3: RATING, TIP & FEEDBACK ── */}
          {step === 3 && (
            <div style={{ animation: 'slide-up 0.3s ease forwards' }}>
              
              {/* Payment Success Banner */}
              <div style={{
                background: isDark ? 'rgba(16, 185, 129, 0.15)' : 'var(--color-success-50)',
                border: '1px solid var(--color-success)',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 16px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={20} color="var(--color-success-dark)" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isDark ? '#34d399' : 'var(--color-success-dark)' }}>
                    Payment Successful (₹{booking.totalFare})
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: textMuted, fontWeight: 600 }}>{txnId}</span>
              </div>

              {/* Driver Info */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-purple))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '1.5rem',
                  margin: '0 auto 10px',
                  boxShadow: 'var(--shadow-primary)',
                }}>
                  {booking.driverName?.charAt(0) || 'S'}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.125rem', color: textColor }}>
                  {booking.driverName}
                </div>
                <div style={{ fontSize: '0.8125rem', color: textMuted, marginTop: 2 }}>
                  Verified Saarthi Partner Driver
                </div>
              </div>

              {/* Star Rating Input */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transform: rating >= star ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    <Star
                      size={36}
                      color={rating >= star ? 'var(--color-warning)' : (isDark ? 'rgba(255,255,255,0.2)' : 'var(--color-slate-300)')}
                      fill={rating >= star ? 'var(--color-warning)' : 'transparent'}
                    />
                  </button>
                ))}
              </div>

              {/* Feedback Tag Chips */}
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>
                What did you like about the drive?
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
                {FEEDBACK_TAGS.map(tag => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        border: `1px solid ${active ? 'var(--color-primary)' : borderCol}`,
                        background: active
                          ? (isDark ? 'rgba(37,99,235,0.2)' : 'var(--color-primary-50)')
                          : itemBg,
                        color: active
                          ? (isDark ? '#93c5fd' : 'var(--color-primary-dark)')
                          : textColor,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Tip Driver Option */}
              <div style={{ background: itemBg, padding: '14px', borderRadius: 'var(--radius-xl)', marginBottom: 20, border: `1px solid ${borderCol}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: textColor, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Heart size={16} color="var(--color-emergency)" fill="var(--color-emergency)" /> Add Tip for Driver
                  </span>
                  <span style={{ fontSize: '0.75rem', color: textMuted }}>100% goes to driver</span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {TIP_OPTIONS.map(amt => (
                    <button
                      key={amt}
                      onClick={() => setTip(amt)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        border: `1.5px solid ${tip === amt ? 'var(--color-success)' : borderCol}`,
                        background: tip === amt
                          ? (isDark ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-success-50)')
                          : (isDark ? 'rgba(255,255,255,0.06)' : 'white'),
                        color: tip === amt
                          ? (isDark ? '#34d399' : 'var(--color-success-dark)')
                          : textColor,
                        cursor: 'pointer',
                      }}
                    >
                      {amt === 0 ? 'No Tip' : `+ ₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Textarea */}
              <div className="input-group" style={{ marginBottom: 20 }}>
                <label className="input-label" style={{ color: textMuted }}>Additional Comments (Optional)</label>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="Write a quick thank you note for your driver..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                />
              </div>

              {/* Submit Rating Button */}
              <button
                id="submit-rating-btn"
                onClick={handleSubmitRating}
                className="btn btn-primary btn-lg btn-block"
              >
                Submit Rating & Feedback <Sparkles size={18} />
              </button>
            </div>
          )}

          {/* ── STEP 4: THANK YOU CONFIRMATION ── */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '32px 0 16px', animation: 'bounce-in 0.5s forwards' }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 900, color: textColor, marginBottom: 6 }}>
                Thank You for Choosing Saarthi!
              </h3>
              <p style={{ fontSize: '0.875rem', color: textMuted, marginBottom: 24 }}>
                Your feedback helps us maintain verified, top-tier safety standards.
              </p>

              <div style={{ background: itemBg, padding: '16px', borderRadius: 'var(--radius-lg)', textAlign: 'left', marginBottom: 24, fontSize: '0.8125rem', border: `1px solid ${borderCol}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: textMuted }}>Transaction ID</span>
                  <span style={{ fontWeight: 700, color: textColor }}>{txnId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: textMuted }}>Total Paid</span>
                  <span style={{ fontWeight: 800, color: isDark ? '#34d399' : 'var(--color-success-dark)' }}>₹{totalPayable}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: textMuted }}>Driver Rating Given</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-warning-dark)' }}>★ {rating}.0</span>
                </div>
              </div>

              <button onClick={onClose} className="btn btn-primary btn-block">
                Return to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
