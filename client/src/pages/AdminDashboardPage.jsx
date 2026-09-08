import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LiveMap from '../components/LiveMap';
import {
  ShieldAlert, ShieldCheck, Users, Car, CheckCircle2, XCircle,
  AlertTriangle, Phone, MapPin, Activity, DollarSign, Clock,
  Search, Eye, LogOut, Radio, RefreshCw, Filter, FileText, Check,
  Navigation, AlertOctagon, PhoneCall, ExternalLink, Sun, Moon
} from 'lucide-react';

const INITIAL_DRIVERS_APPLICATIONS = [
  {
    id: 'drv_app_1',
    name: 'Vikram Singh',
    phone: '+91 88776 65544',
    email: 'vikram@saarthi.in',
    city: 'Noida, UP',
    experience: '4 years',
    licenseNumber: 'UP-1620220098765',
    appliedDate: '12 Aug 2026',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    documents: {
      license: true,
      aadhar: true,
      policeClearance: false,
    },
    rating: 5.0,
    vehicleTypes: ['Sedan', 'Hatchback'],
  },
  {
    id: 'drv_app_2',
    name: 'Manoj Verma',
    phone: '+91 99112 23344',
    email: 'manoj.v@gmail.com',
    city: 'Delhi NCR',
    experience: '8 years',
    licenseNumber: 'DL-0420180054321',
    appliedDate: '11 Aug 2026',
    status: 'pending',
    documents: {
      license: true,
      aadhar: true,
      policeClearance: true,
    },
    rating: 4.9,
    vehicleTypes: ['Sedan', 'SUV', 'Luxury'],
  },
  {
    id: 'drv_app_3',
    name: 'Suresh Kumar',
    phone: '+91 77889 90011',
    email: 'suresh@saarthi.in',
    city: 'Noida, UP',
    experience: '7 years',
    licenseNumber: 'DL-1420110012345',
    appliedDate: '1 Aug 2026',
    status: 'approved',
    documents: {
      license: true,
      aadhar: true,
      policeClearance: true,
    },
    rating: 4.8,
    vehicleTypes: ['Sedan', 'SUV', 'Automatic', 'Manual'],
  },
  {
    id: 'drv_app_4',
    name: 'Rajesh Gupta',
    phone: '+91 98101 23456',
    email: 'rajesh.g@yahoo.com',
    city: 'Gurugram',
    experience: '2 years',
    licenseNumber: 'HR-2620230011223',
    appliedDate: '10 Aug 2026',
    status: 'rejected',
    documents: {
      license: false,
      aadhar: true,
      policeClearance: false,
    },
    rating: 3.8,
    vehicleTypes: ['Hatchback'],
  }
];

const LIVE_TRIPS = [
  {
    id: 'bkg_live_01',
    customer: 'Raj Sharma',
    customerPhone: '+91 98765 43210',
    driver: 'Suresh Kumar',
    driverPhone: '+91 77889 90011',
    vehicle: 'Honda City (DL 01 AB 1234)',
    pickup: 'Sector 18 Metro, Noida',
    drop: 'Connaught Place, New Delhi',
    type: 'emergency',
    status: 'trip_started',
    eta: '18 mins left',
    fare: 380,
    hasSOS: false,
  },
  {
    id: 'bkg_live_02',
    customer: 'Priya Mehta',
    customerPhone: '+91 87654 32109',
    driver: 'Ravi Sharma',
    driverPhone: '+91 88990 01122',
    vehicle: 'Toyota Fortuner (UP 82 XY 5678)',
    pickup: 'Koramangala, Bangalore',
    drop: 'Kempegowda Int. Airport',
    type: 'scheduled',
    status: 'arriving',
    eta: '5 mins to pickup',
    fare: 850,
    hasSOS: false,
  },
  {
    id: 'bkg_live_03',
    customer: 'Aakash Verma',
    customerPhone: '+91 99887 76655',
    driver: 'Amit Singh',
    driverPhone: '+91 99001 12233',
    vehicle: 'Maruti Swift (DL 7C AB 9999)',
    pickup: 'Cyber Hub, Gurugram',
    drop: 'Saket, New Delhi',
    type: 'emergency',
    status: 'sos_alert',
    eta: '12 mins left',
    fare: 420,
    hasSOS: true,
  }
];

const PLATFORM_USERS = [
  { id: 'usr_1', name: 'Raj Sharma', email: 'raj@saarthi.in', phone: '+91 98765 43210', rides: 14, spent: '₹5,420', status: 'Active', vehicles: 3 },
  { id: 'usr_2', name: 'Priya Mehta', email: 'priya@saarthi.in', phone: '+91 87654 32109', rides: 8, spent: '₹4,150', status: 'Active', vehicles: 2 },
  { id: 'usr_3', name: 'Aakash Verma', email: 'aakash@gmail.com', phone: '+91 99887 76655', rides: 22, spent: '₹8,900', status: 'Active', vehicles: 1 },
  { id: 'usr_4', name: 'Neha Kapoor', email: 'neha.k@outlook.com', phone: '+91 91234 56789', rides: 5, spent: '₹1,850', status: 'Active', vehicles: 1 },
];

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'drivers' | 'trips' | 'sos' | 'users'
  const [driverApps, setDriverApps] = useState(INITIAL_DRIVERS_APPLICATIONS);
  const [selectedDriverApp, setSelectedDriverApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [trips, setTrips] = useState(LIVE_TRIPS);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApproveDriver = (id) => {
    setDriverApps(prev =>
      prev.map(d => (d.id === id ? { ...d, status: 'approved' } : d))
    );
    setSelectedDriverApp(prev => prev ? { ...prev, status: 'approved' } : null);
    showToast('✅ Driver Application Approved!');
  };

  const handleRejectDriver = (id) => {
    setDriverApps(prev =>
      prev.map(d => (d.id === id ? { ...d, status: 'rejected' } : d))
    );
    setSelectedDriverApp(prev => prev ? { ...prev, status: 'rejected' } : null);
    showToast('❌ Driver Application Rejected');
  };

  const handleDispatchPolice = (tripId) => {
    showToast(`🚨 Police Dispatch & Safety Escalation triggered for ${tripId}`);
  };

  const filteredApps = driverApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const { isDark, toggleTheme } = useTheme();
  const pendingCount = driverApps.filter(d => d.status === 'pending').length;
  const activeSOSCount = trips.filter(t => t.hasSOS).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#090d16' : '#f8fafc',
      color: isDark ? '#f1f5f9' : '#0f172a',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      
      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}

      {/* ── TOP NAV HEADER ── */}
      <header style={{
        background: isDark ? 'rgba(15, 23, 42, 0.95)' : '#ffffff',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--color-slate-200)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
          }}>
            <Activity size={20} color="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: '1.125rem',
                fontWeight: 900,
                color: isDark ? 'white' : 'var(--color-slate-900)',
                letterSpacing: '-0.01em'
              }}>
                SAARTHI
              </span>
              <span className="badge badge-emergency" style={{ fontSize: '0.625rem' }}>
                OPS COMMAND
              </span>
            </div>
            <div style={{
              fontSize: '0.6875rem',
              color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--color-slate-500)',
              letterSpacing: '0.04em'
            }}>
              ADMINISTRATIVE CONTROL CENTER
            </div>
          </div>
        </div>

        {/* Right Header: Theme Toggle, Live Indicator & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid var(--color-slate-200)',
              borderRadius: 'var(--radius-full)',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isDark ? '#fbbf24' : '#475569',
            }}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)' }}>
              LIVE TELEMETRICS
            </span>
          </div>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="btn btn-sm btn-outline"
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'var(--color-slate-300)',
              color: isDark ? 'white' : 'var(--color-slate-800)'
            }}
          >
            <LogOut size={14} /> Exit Admin
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>

        {/* ── METRIC STATS KPI BAR ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          
          <div className="card-dark" style={{ padding: '18px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Active Trips</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: 4, color: 'white' }}>{trips.length}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(37,99,235,0.15)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              ● 2 Emergency · 1 Scheduled
            </div>
          </div>

          <div className="card-dark" style={{ padding: '18px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Pending Driver Verifications</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: 4, color: pendingCount > 0 ? 'var(--color-warning)' : 'white' }}>
                  {pendingCount}
                </div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(245,158,11,0.15)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>
              Requires Document Inspection
            </div>
          </div>

          <div className="card-dark" style={{ padding: '18px 20px', border: activeSOSCount > 0 ? '1px solid var(--color-emergency)' : '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Emergency SOS Alerts</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: 4, color: activeSOSCount > 0 ? 'var(--color-emergency)' : 'white' }}>
                  {activeSOSCount}
                </div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(220,38,38,0.15)', color: 'var(--color-emergency)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert size={20} className={activeSOSCount > 0 ? 'pulse-emergency' : ''} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: activeSOSCount > 0 ? 'var(--color-emergency)' : 'var(--color-success)', marginTop: 8 }}>
              {activeSOSCount > 0 ? '🚨 ACTIVE INCIDENT RESPOND NOW' : '● All Systems Secure'}
            </div>
          </div>

          <div className="card-dark" style={{ padding: '18px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Today's Platform GMV</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: 4, color: 'var(--color-success-light)' }}>
                  ₹28,450
                </div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16,185,129,0.15)', color: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>
              +18.4% vs last week
            </div>
          </div>

        </div>

        {/* ── CRITICAL SOS ALERT BANNER IF ACTIVE ── */}
        {activeSOSCount > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.2), rgba(127,29,29,0.3))',
            border: '2px solid var(--color-emergency)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            animation: 'pulse-emergency 2.5s infinite',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-emergency)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <AlertOctagon size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fca5a5' }}>
                  🚨 SOS PANIC ALERT TRIGGERED on Trip #bkg_live_03
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                  Customer: <strong>Aakash Verma</strong> · Vehicle: <strong>Maruti Swift (DL 7C AB 9999)</strong> · Driver: <strong>Amit Singh</strong> · Location: Cyber Hub, Gurugram
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <a href="tel:112" className="btn btn-sm btn-emergency" style={{ whiteSpace: 'nowrap' }}>
                <PhoneCall size={14} /> Call Police (112)
              </a>
              <button
                onClick={() => handleDispatchPolice('bkg_live_03')}
                className="btn btn-sm btn-primary"
                style={{ whiteSpace: 'nowrap' }}
              >
                Dispatch Emergency Unit
              </button>
            </div>
          </div>
        )}

        {/* ── NAVIGATION TABS ── */}
        <div style={{
          display: 'flex',
          gap: 8,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 24,
          overflowX: 'auto',
          paddingBottom: 4,
        }}>
          {[
            { id: 'overview', label: '📊 Overview & Live Radar' },
            { id: 'drivers', label: `👨‍✈️ Driver Verification (${pendingCount} Pending)` },
            { id: 'trips', label: '🚗 Active Trips & Dispatch' },
            { id: 'sos', label: `🚨 SOS Incident Log (${activeSOSCount})` },
            { id: 'users', label: '👥 Registered Customers' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.5)',
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: '0.875rem',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW & LIVE RADAR ── */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fade-in 0.3s forwards' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
              
              {/* Live Dispatch Map */}
              <div className="card-dark" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>National Real-Time Fleet Radar</h3>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Tracking all active Saarthi drivers, emergency dispatches & customer routes</p>
                  </div>
                  <span className="badge badge-success">● 42 Drivers Online</span>
                </div>

                <LiveMap height="320px" showRoute={true} isTracking={true} />
              </div>

              {/* Quick Summary Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                
                {/* Recent Verification Queue */}
                <div className="card-dark" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h4 style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Driver Verification Queue</h4>
                    <button onClick={() => setActiveTab('drivers')} style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      View all →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {driverApps.slice(0, 3).map(app => (
                      <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{app.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>DL: {app.licenseNumber} · {app.experience}</div>
                        </div>
                        <span className={`badge ${app.status === 'approved' ? 'badge-success' : app.status === 'pending' ? 'badge-warning' : 'badge-emergency'}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Trips Quick Monitor */}
                <div className="card-dark" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h4 style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Active Fleet Trips</h4>
                    <button onClick={() => setActiveTab('trips')} style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      View all →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {trips.map(trip => (
                      <div key={trip.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: trip.hasSOS ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', border: trip.hasSOS ? '1px solid var(--color-emergency)' : 'none' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {trip.customer} ➔ {trip.driver}
                            {trip.hasSOS && <span className="badge badge-emergency">SOS</span>}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{trip.vehicle}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>₹{trip.fare}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-success)' }}>{trip.eta}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: DRIVER VERIFICATION ONBOARDING HUB ── */}
        {activeTab === 'drivers' && (
          <div style={{ animation: 'fade-in 0.3s forwards' }}>
            
            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <div className="input-icon-wrap" style={{ flex: 1, minWidth: 260 }}>
                <Search size={16} className="input-icon" />
                <input
                  type="text"
                  className="input"
                  placeholder="Search driver by name, DL number..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {['all', 'pending', 'approved', 'rejected'].map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      border: `1px solid ${filterStatus === st ? 'var(--color-primary)' : 'rgba(255,255,255,0.12)'}`,
                      background: filterStatus === st ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)',
                      color: filterStatus === st ? 'var(--color-primary-light)' : 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications Table / Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: selectedDriverApp ? '1fr 380px' : '1fr', gap: 20 }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredApps.map(app => (
                  <div
                    key={app.id}
                    className="card-dark"
                    style={{
                      padding: '18px 20px',
                      border: `1px solid ${selectedDriverApp?.id === app.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedDriverApp(app)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-purple))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 900,
                        fontSize: '1.125rem',
                        flexShrink: 0,
                      }}>
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem' }}>{app.name}</span>
                          <span className={`badge ${app.status === 'approved' ? 'badge-success' : app.status === 'pending' ? 'badge-warning' : 'badge-emergency'}`}>
                            {app.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                          DL: <strong>{app.licenseNumber}</strong> · Exp: {app.experience} · City: {app.city}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                          Docs: DL {app.documents.license ? '✅' : '❌'} · Aadhaar {app.documents.aadhar ? '✅' : '❌'} · Police Clearance {app.documents.policeClearance ? '✅' : '⚠️ Pending'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApproveDriver(app.id); }}
                            className="btn btn-sm btn-success"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRejectDriver(app.id); }}
                            className="btn btn-sm btn-outline"
                            style={{ borderColor: 'var(--color-emergency)', color: 'var(--color-emergency)' }}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedDriverApp(app)}
                        className="btn btn-sm btn-ghost"
                        style={{ color: 'var(--color-primary-light)' }}
                      >
                        <Eye size={16} /> Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inspection Sidebar Drawer */}
              {selectedDriverApp && (
                <div className="card-dark animate-slide-up" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.12)', height: 'fit-content' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 900 }}>Application Details</h3>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Applied on {selectedDriverApp.appliedDate}</div>
                    </div>
                    <button onClick={() => setSelectedDriverApp(null)} className="btn btn-icon btn-ghost">
                      ✕
                    </button>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 4 }}>{selectedDriverApp.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>📞 {selectedDriverApp.phone}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>✉️ {selectedDriverApp.email}</div>
                  </div>

                  {/* Document Verification Checklist */}
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: 'var(--radius-lg)', marginBottom: 20 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 10 }}>
                      Document Verification Checklist
                    </div>

                    {[
                      { name: 'Driving License (LMV/Commercial)', ok: selectedDriverApp.documents.license, val: selectedDriverApp.licenseNumber },
                      { name: 'Aadhaar Identity Proof', ok: selectedDriverApp.documents.aadhar, val: 'Verified with UIDAI' },
                      { name: 'Police Verification Clearance', ok: selectedDriverApp.documents.policeClearance, val: selectedDriverApp.documents.policeClearance ? 'Clean Record' : 'Pending Background Scan' },
                    ].map((doc, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.8125rem' }}>
                        <div>
                          <div>{doc.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{doc.val}</div>
                        </div>
                        {doc.ok ? (
                          <span className="badge badge-success">Verified</span>
                        ) : (
                          <span className="badge badge-warning">Required</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button
                      onClick={() => handleApproveDriver(selectedDriverApp.id)}
                      className="btn btn-success btn-block"
                      disabled={selectedDriverApp.status === 'approved'}
                    >
                      <CheckCircle2 size={16} /> Approve & Grant Driver Access
                    </button>
                    <button
                      onClick={() => handleRejectDriver(selectedDriverApp.id)}
                      className="btn btn-outline btn-block"
                      style={{ borderColor: 'rgba(220,38,38,0.5)', color: '#fca5a5' }}
                      disabled={selectedDriverApp.status === 'rejected'}
                    >
                      <XCircle size={16} /> Reject Application
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── TAB 3: ACTIVE TRIPS & DISPATCH ── */}
        {activeTab === 'trips' && (
          <div style={{ animation: 'fade-in 0.3s forwards' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Live Fleet Operations</h3>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>Manage live requests, driver assignments & status overrides</p>
              </div>
              <button onClick={() => showToast('Fleet telemetry refreshed')} className="btn btn-sm btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                <RefreshCw size={14} /> Refresh Fleet
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {trips.map(t => (
                <div
                  key={t.id}
                  className="card-dark"
                  style={{
                    padding: '20px',
                    border: t.hasSOS ? '2px solid var(--color-emergency)' : '1px solid rgba(255,255,255,0.08)',
                    background: t.hasSOS ? 'rgba(220,38,38,0.06)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`badge ${t.type === 'emergency' ? 'badge-emergency' : 'badge-warning'}`}>
                          {t.type === 'emergency' ? '🚨 Emergency Request' : '📅 Scheduled'}
                        </span>
                        <span className="badge badge-primary">
                          {t.status.toUpperCase()}
                        </span>
                        {t.hasSOS && (
                          <span className="badge badge-emergency pulse-emergency">
                            🆘 SOS PANIC ACTIVE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, marginTop: 6 }}>
                        👤 {t.customer} ({t.customerPhone}) ➔ 👨‍✈️ {t.driver} ({t.driverPhone})
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                        🚘 Vehicle: <strong>{t.vehicle}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--color-success-light)' }}>
                        ₹{t.fare}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t.eta}</div>
                    </div>
                  </div>

                  {/* Route Bar */}
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={14} color="var(--color-emergency)" />
                      <strong>Pickup:</strong> {t.pickup}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}>➔</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Navigation size={14} color="var(--color-primary)" />
                      <strong>Drop:</strong> {t.drop}
                    </div>
                  </div>

                  {/* Admin Override Actions */}
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    {t.hasSOS && (
                      <button
                        onClick={() => handleDispatchPolice(t.id)}
                        className="btn btn-sm btn-emergency"
                      >
                        <PhoneCall size={14} /> Dispatch Police Unit (112)
                      </button>
                    )}
                    <button
                      onClick={() => showToast(`Driver reassign requested for ${t.id}`)}
                      className="btn btn-sm btn-outline"
                      style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                      Reassign Driver
                    </button>
                    <button
                      onClick={() => showToast(`Trip ${t.id} cancelled by Admin`)}
                      className="btn btn-sm btn-ghost"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      Cancel Trip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: SOS INCIDENT LOG ── */}
        {activeTab === 'sos' && (
          <div style={{ animation: 'fade-in 0.3s forwards' }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-emergency-light)' }}>
                Emergency SOS Incident Command
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
                Real-time incident response log with GPS coordinates & direct police dispatch
              </p>
            </div>

            <div className="card-dark" style={{ padding: '24px', border: '1px solid var(--color-emergency)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-emergency)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                    <ShieldAlert size={28} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#fca5a5' }}>
                        INCIDENT #SOS-2026-0891
                      </span>
                      <span className="badge badge-emergency">ACTIVE PRIORITY 1</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', marginTop: 4 }}>
                      Customer <strong>Aakash Verma</strong> triggered panic alarm
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                      Triggered at: 12:12 AM · Cyber Hub, Gurugram (Lat: 28.4950, Lng: 77.0890)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <a href="tel:112" className="btn btn-emergency">
                    <PhoneCall size={16} /> Call Police Control (112)
                  </a>
                </div>
              </div>

              {/* Live Incident Map */}
              <div style={{ marginBottom: 20 }}>
                <LiveMap height="240px" showRoute={true} isTracking={true} />
              </div>

              {/* Incident Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Customer</div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Aakash Verma</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>+91 99887 76655</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Assigned Driver</div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Amit Singh (★ 4.9)</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>+91 99001 12233</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Vehicle Plate</div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Maruti Swift</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)' }}>DL 7C AB 9999</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: REGISTERED CUSTOMERS DIRECTORY ── */}
        {activeTab === 'users' && (
          <div style={{ animation: 'fade-in 0.3s forwards' }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Vehicle Owners Registry</h3>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>Registered vehicle owners, active cars & lifetime ride history</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PLATFORM_USERS.map(u => (
                <div key={u.id} className="card-dark" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(37,99,235,0.2)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{u.email} · {u.phone}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{u.vehicles}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Vehicles</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{u.rides}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Total Rides</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--color-success-light)' }}>{u.spent}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Spent</div>
                    </div>
                    <span className="badge badge-success">
                      {u.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
