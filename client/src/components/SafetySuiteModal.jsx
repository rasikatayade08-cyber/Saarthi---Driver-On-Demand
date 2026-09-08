import { useState } from 'react';
import {
  ShieldAlert, Phone, Share2, UserPlus, Trash2, CheckCircle2,
  Copy, ExternalLink, AlertTriangle, X, Shield, PhoneCall
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const INITIAL_CONTACTS = [
  { id: 'c1', name: 'Ramesh Sharma (Father)', phone: '+91 98110 12345', relation: 'Father' },
  { id: 'c2', name: 'Anjali Sharma (Spouse)', phone: '+91 98220 54321', relation: 'Spouse' },
];

export default function SafetySuiteModal({
  isOpen,
  onClose,
  activeBooking = null,
  initialTab = 'sos',
}) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: 'Family' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    const contact = {
      id: `c_${Date.now()}`,
      ...newContact,
    };
    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', phone: '', relation: 'Family' });
    setShowAddForm(false);
    showToast('✅ Emergency contact added!');
  };

  const handleDeleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast('Contact removed');
  };

  const handleSendSOSAlert = () => {
    setSosSent(true);
    showToast('🚨 EMERGENCY SOS SENT to contacts & police hotline!');
  };

  const tripShareUrl = `https://saarthi.in/track/${activeBooking?._id || 'bkg_live_7891'}`;

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(tripShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    showToast('📋 Trip link copied to clipboard!');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🚨 *Saarthi Live Trip Tracking*\nI'm riding in my car with a verified Saarthi driver.\n\n📍 *Track My Live Route:* ${tripShareUrl}\n🚘 *Vehicle:* ${activeBooking?.vehicle?.make || 'Honda City'} (${activeBooking?.vehicle?.licensePlate || 'DL 01 AB 1234'})\n👨‍✈️ *Driver:* ${activeBooking?.driver?.name || 'Suresh Kumar'}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
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

        {/* Toast */}
        {toastMsg && <div className="toast">{toastMsg}</div>}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-emergency), #7f1d1d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(220,38,38,0.4)',
            }}>
              <ShieldAlert size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: textColor }}>
                Safety & Emergency Suite
              </div>
              <div style={{ fontSize: '0.75rem', color: textMuted }}>
                24/7 Protection & Live Sharing
              </div>
            </div>
          </div>

          <button className="btn btn-icon btn-ghost" onClick={onClose} style={{ color: textMuted }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${borderCol}`, padding: '0 20px', gap: 12 }}>
          {[
            { id: 'sos', label: '🆘 SOS Alert' },
            { id: 'contacts', label: '👥 Contacts' },
            { id: 'share', label: '🔗 Share Trip' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 14px',
                fontSize: '0.875rem',
                fontWeight: activeTab === tab.id ? 800 : 600,
                color: activeTab === tab.id ? 'var(--color-emergency)' : textMuted,
                borderBottom: activeTab === tab.id ? '3px solid var(--color-emergency)' : '3px solid transparent',
                background: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '20px' }}>

          {/* ── TAB 1: SOS ALERT ── */}
          {activeTab === 'sos' && (
            <div style={{ animation: 'slide-up 0.3s ease forwards' }}>
              {sosSent ? (
                <div style={{ textAlign: 'center', padding: '16px 0', animation: 'bounce-in 0.4s forwards' }}>
                  <div style={{ fontSize: 64, marginBottom: 12 }}>🚨</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-emergency)', marginBottom: 6 }}>
                    SOS Alert Transmitted!
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: textMuted, marginBottom: 20, lineHeight: 1.5 }}>
                    Your live GPS coordinates & vehicle details have been dispatched to Police Control (112) and your {contacts.length} emergency contacts.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    <a href="tel:112" className="btn btn-emergency btn-lg btn-block">
                      <PhoneCall size={18} /> Call National Police Helpline (112)
                    </a>
                    <a href="tel:18007227844" className="btn btn-outline btn-block" style={{ borderColor: borderCol, color: textColor }}>
                      <Phone size={18} /> Call Saarthi 24/7 Safety Command (1800-SAARTHI)
                    </a>
                  </div>

                  <button onClick={() => setSosSent(false)} className="btn btn-ghost" style={{ color: textMuted }}>
                    Dismiss SOS Screen
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{
                    background: isDark ? 'rgba(239, 68, 68, 0.15)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    border: '2px solid var(--color-emergency)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '20px',
                    textAlign: 'center',
                    marginBottom: 20,
                  }}>
                    <div style={{ fontSize: 44, marginBottom: 8 }}>🆘</div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 900, color: isDark ? '#fca5a5' : 'var(--color-emergency-dark)', marginBottom: 6 }}>
                      Emergency SOS Panic Button
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: isDark ? 'rgba(255,255,255,0.7)' : 'var(--color-slate-600)', marginBottom: 20, lineHeight: 1.5 }}>
                      Pressing this button immediately alerts emergency services and notifies your trusted emergency contacts with your live location.
                    </p>

                    <button
                      id="sos-panic-btn"
                      onClick={handleSendSOSAlert}
                      className="btn btn-emergency btn-xl btn-block pulse-emergency"
                      style={{ fontSize: '1.0625rem', fontWeight: 900 }}
                    >
                      🚨 TRIGGER EMERGENCY SOS NOW
                    </button>
                  </div>

                  {/* Hotlines */}
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', marginBottom: 10 }}>
                    Quick Emergency Hotlines
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <a
                      href="tel:112"
                      className="card"
                      style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${borderCol}`, background: itemBg }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-emergency-50)', color: 'var(--color-emergency)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Phone size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.875rem', color: textColor }}>Police 112</div>
                        <div style={{ fontSize: '0.7rem', color: textMuted }}>National Hotline</div>
                      </div>
                    </a>

                    <a
                      href="tel:108"
                      className="card"
                      style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${borderCol}`, background: itemBg }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-success-50)', color: 'var(--color-success-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Phone size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.875rem', color: textColor }}>Ambulance 108</div>
                        <div style={{ fontSize: '0.7rem', color: textMuted }}>Medical Emergency</div>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: CONTACTS ── */}
          {activeTab === 'contacts' && (
            <div style={{ animation: 'slide-up 0.3s ease forwards' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: textMuted }}>
                  Trusted Family & Friends ({contacts.length})
                </span>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="btn btn-sm btn-primary"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  <UserPlus size={14} /> + Add Contact
                </button>
              </div>

              {/* Add form */}
              {showAddForm && (
                <form onSubmit={handleAddContact} style={{ background: itemBg, padding: '14px', borderRadius: 'var(--radius-lg)', marginBottom: 16, border: `1px solid ${borderCol}` }}>
                  <div className="input-group" style={{ marginBottom: 10 }}>
                    <label className="input-label" style={{ color: textMuted }}>Full Name & Relation</label>
                    <input
                      className="input"
                      placeholder="e.g. Papa / Priya (Sister)"
                      value={newContact.name}
                      onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 14 }}>
                    <label className="input-label" style={{ color: textMuted }}>Mobile Number</label>
                    <input
                      className="input"
                      placeholder="+91 98765 43210"
                      value={newContact.phone}
                      onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline btn-sm" style={{ flex: 1, borderColor: borderCol, color: textMuted }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      Save Contact
                    </button>
                  </div>
                </form>
              )}

              {/* Contacts list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {contacts.map(c => (
                  <div
                    key={c.id}
                    className="card"
                    style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${borderCol}`, background: itemBg }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: textColor }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: textMuted }}>{c.phone}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="btn btn-icon btn-ghost"
                      style={{ color: 'var(--color-slate-400)' }}
                      title="Remove contact"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 3: SHARE TRIP ── */}
          {activeTab === 'share' && (
            <div style={{ animation: 'slide-up 0.3s ease forwards', textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>📡</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: textColor, marginBottom: 6 }}>
                Live GPS Ride Telemetry
              </h3>
              <p style={{ fontSize: '0.8125rem', color: textMuted, marginBottom: 20, lineHeight: 1.5 }}>
                Share your active ride link with family so they can track your vehicle, driver details, and route on a live map in real time.
              </p>

              <div style={{ background: itemBg, padding: '12px 14px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, border: `1px solid ${borderCol}` }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {tripShareUrl}
                </span>
                <button
                  onClick={handleCopyShareLink}
                  className="btn btn-sm btn-ghost"
                  style={{ color: copiedLink ? 'var(--color-success)' : 'var(--color-primary)', fontWeight: 700, padding: '4px 8px' }}
                >
                  {copiedLink ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                onClick={handleWhatsAppShare}
                className="btn btn-lg btn-block"
                style={{ background: '#25D366', color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}
              >
                <Share2 size={18} /> Share Live Ride on WhatsApp
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
