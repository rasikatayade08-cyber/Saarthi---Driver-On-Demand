import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Upload, FileText, CheckCircle2, AlertCircle, Clock, ArrowRight, Sun, Moon } from 'lucide-react';

export default function DriverVerificationPage() {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [docs, setDocs] = useState({
    license: user?.documentsUploaded?.license || false,
    aadhar: user?.documentsUploaded?.aadhar || false,
    policeCheck: user?.documentsUploaded?.policeCheck || false,
  });

  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber || '');
  const [experience, setExperience] = useState(user?.experience || 5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(user?.verificationStatus === 'pending');

  const handleUpload = (docKey) => {
    setDocs(prev => ({ ...prev, [docKey]: true }));
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    updateUser({
      licenseNumber,
      experience,
      verificationStatus: 'pending',
      documentsUploaded: docs,
    });
  };

  const handleSimulateAdminApproval = () => {
    updateUser({
      isVerified: true,
      verificationStatus: 'approved',
    });
    navigate('/driver/home');
  };

  const textColor = isDark ? '#ffffff' : 'var(--color-slate-900)';
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : 'var(--color-slate-600)';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.88)' : '#ffffff';
  const itemBg = isDark ? 'rgba(30, 41, 59, 0.6)' : 'var(--color-slate-50)';
  const borderCol = isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-slate-200)';

  return (
    <div
      className="page-wrapper"
      style={{
        padding: '24px 20px',
        minHeight: '100vh',
        background: isDark ? '#090d16' : '#f8fafc',
        color: textColor,
        transition: 'background 0.3s ease'
      }}
    >
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        
        {/* Top Header Row with Theme Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button
            onClick={toggleTheme}
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${borderCol}`,
              borderRadius: 'var(--radius-full)',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isDark ? '#fbbf24' : '#475569',
            }}
            title="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
          }}>
            <ShieldCheck size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: textColor }}>Driver Verification</h1>
          <p style={{ fontSize: '0.875rem', color: textMuted, marginTop: 4 }}>
            Verify your profile to start accepting driver requests
          </p>
        </div>

        {/* Verification Status Banner */}
        <div style={{
          background: user?.verificationStatus === 'approved' 
            ? (isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5')
            : submitted || user?.verificationStatus === 'pending'
            ? (isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb')
            : (isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff'),
          border: `1px solid ${
            user?.verificationStatus === 'approved' ? 'var(--color-success)' :
            submitted || user?.verificationStatus === 'pending' ? 'var(--color-warning)' : 'var(--color-primary)'
          }`,
          borderRadius: 'var(--radius-xl)',
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          {user?.verificationStatus === 'approved' ? (
            <CheckCircle2 size={24} color="var(--color-success)" />
          ) : submitted || user?.verificationStatus === 'pending' ? (
            <Clock size={24} color="var(--color-warning)" />
          ) : (
            <AlertCircle size={24} color="var(--color-primary-light)" />
          )}

          <div>
            <div style={{
              fontWeight: 700,
              fontSize: '0.9375rem',
              color: user?.verificationStatus === 'approved'
                ? (isDark ? '#34d399' : 'var(--color-success-dark)')
                : submitted || user?.verificationStatus === 'pending'
                ? (isDark ? '#fbbf24' : 'var(--color-warning-dark)')
                : (isDark ? '#93c5fd' : 'var(--color-primary-dark)')
            }}>
              {user?.verificationStatus === 'approved'
                ? '✅ Verification Complete'
                : submitted || user?.verificationStatus === 'pending'
                ? '⏳ Under Review (Est. 2-4 hrs)'
                : '📝 Documents Required'}
            </div>
            <div style={{
              fontSize: '0.8125rem',
              color: user?.verificationStatus === 'approved'
                ? (isDark ? '#a7f3d0' : 'var(--color-success-dark)')
                : submitted || user?.verificationStatus === 'pending'
                ? (isDark ? '#fde68a' : 'var(--color-warning-dark)')
                : (isDark ? '#bfdbfe' : 'var(--color-primary-dark)'),
              marginTop: 2
            }}>
              {user?.verificationStatus === 'approved'
                ? 'You are approved to accept emergency and scheduled rides!'
                : submitted || user?.verificationStatus === 'pending'
                ? 'Our compliance team is verifying your DL and background details.'
                : 'Please complete form & document upload to get verified.'}
            </div>
          </div>
        </div>

        {!user?.isVerified && (
          <form onSubmit={handleSubmitVerification}>
            {/* Driving Details */}
            <div style={{
              background: cardBg,
              border: `1px solid ${borderCol}`,
              borderRadius: 'var(--radius-xl)',
              padding: '20px',
              marginBottom: 20,
              boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.04)',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: textColor }}>
                <FileText size={18} color="var(--color-primary)" /> License Information
              </h3>

              <div className="input-group" style={{ marginBottom: 14 }}>
                <label className="input-label" style={{ color: textMuted }}>Driving License Number</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. DL-1420110012345"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: textMuted }}>Driving Experience (Years)</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  max="40"
                  value={experience}
                  onChange={e => setExperience(parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>

            {/* Upload Documents */}
            <div style={{
              background: cardBg,
              border: `1px solid ${borderCol}`,
              borderRadius: 'var(--radius-xl)',
              padding: '20px',
              marginBottom: 24,
              boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.04)',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: textColor }}>
                <Upload size={18} color="var(--color-primary)" /> Required Verification Documents
              </h3>

              {[
                { key: 'license', title: 'Driving License (Front & Back)', desc: 'Valid Commercial or LMV License' },
                { key: 'aadhar', title: 'Aadhaar Card / ID Proof', desc: 'Government issued identity proof' },
                { key: 'policeCheck', title: 'Police Clearance Certificate', desc: 'Optional for fast-track badge' },
              ].map(d => (
                <div
                  key={d.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-lg)',
                    background: itemBg,
                    border: `1px solid ${borderCol}`,
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: textColor }}>{d.title}</div>
                    <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: 2 }}>{d.desc}</div>
                  </div>

                  {docs[d.key] ? (
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} /> Uploaded
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpload(d.key)}
                      className="btn btn-sm btn-outline"
                      style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                    >
                      <Upload size={13} /> Upload
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg btn-block"
              style={{ marginBottom: 16 }}
            >
              {isSubmitting ? 'Uploading Documents...' : 'Submit Profile for Verification'}
            </button>
          </form>
        )}

        {/* Demo Fast-Track Approval Tool */}
        <div style={{
          background: isDark ? 'rgba(30, 41, 59, 0.4)' : '#f1f5f9',
          border: `1px dashed ${borderCol}`,
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.75rem', color: textMuted, marginBottom: 8 }}>
            🛠️ <strong>Demo Shortcut:</strong> Instant Simulator
          </div>
          <button
            onClick={handleSimulateAdminApproval}
            className="btn btn-sm btn-success"
            style={{ margin: '0 auto', fontSize: '0.8125rem' }}
          >
            ⚡ Simulate Instant Admin Approval & Proceed to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
