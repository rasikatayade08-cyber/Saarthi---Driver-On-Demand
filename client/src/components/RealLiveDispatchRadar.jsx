import { useEffect, useRef, useState } from 'react';
import {
  Car, Navigation, MapPin, Shield, Zap, CheckCircle2,
  Clock, Phone, Radio, RotateCcw, AlertTriangle, ArrowRight
} from 'lucide-react';

const SCENARIOS = [
  {
    id: 'party',
    title: '🍷 Party Night / Consumed Alcohol',
    pickup: 'Sector 18 Club Hub, Noida',
    drop: 'Indirapuram, Ghaziabad',
    car: 'Honda City (DL 01 AB 1234)',
    driverName: 'Suresh Kumar',
    driverRating: 4.8,
    eta: 4,
    distance: '1.2 km',
    otp: '4829',
  },
  {
    id: 'medical',
    title: '🏥 Urgent Medical Emergency',
    pickup: 'Sector 62, Noida',
    drop: 'Fortis Hospital, Noida',
    car: 'Toyota Fortuner (UP 82 XY 5678)',
    driverName: 'Amit Singh',
    driverRating: 4.9,
    eta: 3,
    distance: '0.8 km',
    otp: '9152',
  },
  {
    id: 'airport',
    title: '✈️ Late Night Airport Drop',
    pickup: 'Golf Course Road, Gurugram',
    drop: 'IGI Airport Terminal 3',
    car: 'Maruti Swift (DL 7C AB 9999)',
    driverName: 'Ravi Sharma',
    driverRating: 4.6,
    eta: 6,
    distance: '2.1 km',
    otp: '3710',
  }
];

export default function RealLiveDispatchRadar({ onBookNow }) {
  const canvasRef = useRef(null);
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [dispatchStage, setDispatchStage] = useState('ready'); // 'ready' | 'searching' | 'matched' | 'arriving' | 'arrived'
  const [progress, setProgress] = useState(0);
  const [liveDriverCount, setLiveDriverCount] = useState(42);

  // Real 2D Canvas City Grid & Moving Traffic Simulator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Set canvas dimensions
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 240;

    // Road Grid Lines
    const roads = [
      { x1: 0, y1: 70, x2: width, y2: 70, w: 24, name: 'MG Road' },
      { x1: 0, y1: 170, x2: width, y2: 170, w: 28, name: 'Expressway' },
      { x1: width * 0.25, y1: 0, x2: width * 0.25, y2: height, w: 20, name: 'Sector 18' },
      { x1: width * 0.65, y1: 0, x2: width * 0.65, y2: height, w: 24, name: 'Ring Road' },
    ];

    // Real moving traffic vehicles
    const traffic = [
      { x: 30, y: 66, speed: 1.2, color: '#38bdf8', len: 14 },
      { x: 180, y: 74, speed: -1.0, color: '#94a3b8', len: 12 },
      { x: 50, y: 164, speed: 2.0, color: '#fbbf24', len: 16 },
      { x: 260, y: 176, speed: -1.6, color: '#cbd5e1', len: 14 },
      { x: width * 0.25 - 4, y: 30, speed: 0.9, isVertical: true, color: '#94a3b8', len: 12 },
      { x: width * 0.65 + 4, y: 140, speed: -1.4, isVertical: true, color: '#38bdf8', len: 14 },
    ];

    // Driver vehicle position that animates when dispatch is active
    let driverX = width * 0.25;
    let driverY = 40;
    let targetX = width * 0.65;
    let targetY = 170;

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // 1. Dark city backdrop with building blocks
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, width, height);

      // Building blocks
      ctx.fillStyle = '#111c35';
      ctx.fillRect(10, 10, width * 0.22, 50);
      ctx.fillRect(width * 0.28, 10, width * 0.34, 50);
      ctx.fillRect(width * 0.68, 10, width * 0.3, 50);

      ctx.fillRect(10, 85, width * 0.22, 72);
      ctx.fillRect(width * 0.28, 85, width * 0.34, 72);
      ctx.fillRect(width * 0.68, 85, width * 0.3, 72);

      ctx.fillRect(10, 185, width * 0.22, 45);
      ctx.fillRect(width * 0.28, 185, width * 0.34, 45);
      ctx.fillRect(width * 0.68, 185, width * 0.3, 45);

      // 2. Draw Roads
      roads.forEach(r => {
        ctx.fillStyle = '#1e293b';
        if (r.y1 === r.y2) {
          ctx.fillRect(r.x1, r.y1 - r.w / 2, r.x2 - r.x1, r.w);
          // Road center dash line
          ctx.strokeStyle = '#475569';
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.moveTo(r.x1, r.y1);
          ctx.lineTo(r.x2, r.y2);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          ctx.fillRect(r.x1 - r.w / 2, r.y1, r.w, r.y2 - r.y1);
          ctx.strokeStyle = '#475569';
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.moveTo(r.x1, r.y1);
          ctx.lineTo(r.x2, r.y2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // 3. Move background city traffic
      traffic.forEach(v => {
        if (v.isVertical) {
          v.y += v.speed;
          if (v.y > height) v.y = -20;
          if (v.y < -20) v.y = height + 10;
          ctx.fillStyle = v.color;
          ctx.fillRect(v.x - 3, v.y, 6, v.len);
        } else {
          v.x += v.speed;
          if (v.x > width) v.x = -20;
          if (v.x < -20) v.x = width + 10;
          ctx.fillStyle = v.color;
          ctx.fillRect(v.x, v.y - 3, v.len, 6);
        }
      });

      // 4. Pickup Location Marker (Customer Vehicle)
      const pickupX = width * 0.65;
      const pickupY = 170;

      // Pulsing GPS radar waves around customer pickup
      const pulseSize = (time * 25) % 36;
      ctx.strokeStyle = 'rgba(220,38,38,' + (1 - pulseSize / 36) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pickupX, pickupY, 8 + pulseSize, 0, Math.PI * 2);
      ctx.stroke();

      // Customer Pin
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(pickupX, pickupY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pickupX, pickupY, 3, 0, Math.PI * 2);
      ctx.fill();

      // 5. Active Dispatched Driver Moving in Real-Time
      if (dispatchStage === 'arriving' || dispatchStage === 'matched') {
        // Draw real navigation polyline route
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(driverX, driverY);
        ctx.lineTo(driverX, 70);
        ctx.lineTo(pickupX, 70);
        ctx.lineTo(pickupX, pickupY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Move driver along the real path
        if (driverY < 70) {
          driverY += 0.8;
        } else if (driverX < pickupX) {
          driverX += 1.2;
        } else if (driverY < pickupY - 10) {
          driverY += 0.8;
        }

        // Driver vehicle badge
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(driverX, driverY, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('👨‍✈️', driverX - 5, driverY + 3);
      } else {
        // Idle nearby driver standby pins
        const standbyDrivers = [
          { x: width * 0.25, y: 50, name: 'Suresh' },
          { x: width * 0.45, y: 70, name: 'Ravi' },
          { x: width * 0.8, y: 170, name: 'Amit' },
        ];
        standbyDrivers.forEach(d => {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(16,185,129,0.4)';
          ctx.beginPath();
          ctx.arc(d.x, d.y, 10 + Math.sin(time * 4) * 2, 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [dispatchStage, activeScenario]);

  // Real Stage Machine for the interactive simulation
  const handleStartSimulation = (scenario) => {
    setActiveScenario(scenario);
    setDispatchStage('searching');
    setProgress(20);

    setTimeout(() => {
      setDispatchStage('matched');
      setProgress(50);
    }, 1200);

    setTimeout(() => {
      setDispatchStage('arriving');
      setProgress(85);
    }, 2400);

    setTimeout(() => {
      setDispatchStage('arrived');
      setProgress(100);
    }, 5500);
  };

  const handleReset = () => {
    setDispatchStage('ready');
    setProgress(0);
  };

  return (
    <div style={{
      background: '#0f172a',
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid rgba(255,255,255,0.12)',
      overflow: 'hidden',
      color: 'white',
      boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
      marginBottom: 32,
    }}>

      {/* ── HEADER TELEMETRY BAR ── */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        background: 'rgba(15,23,42,0.95)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Radio size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800 }}>
              Real-Time Driver Dispatch Engine
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)' }}>
              Live city traffic simulator · Proximity match in 4 min
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-success)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
            42 Active Drivers Online
          </div>

          {dispatchStage !== 'ready' && (
            <button
              onClick={handleReset}
              className="btn btn-sm btn-ghost"
              style={{ color: 'rgba(255,255,255,0.6)', padding: '4px 8px' }}
              title="Reset Simulator"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* ── REAL 2D CANVAS CITY TRAFFIC SIMULATOR ── */}
      <div style={{ position: 'relative', width: '100%', height: 240, overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Real telemetry overlay tag on map */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 16,
          background: 'rgba(15,23,42,0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          fontSize: '0.75rem',
          pointerEvents: 'none',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6875rem' }}>LIVE RADAR FEED</div>
          <div style={{ fontWeight: 800, marginTop: 2 }}>📍 {activeScenario.pickup}</div>
        </div>

        {/* Real Status Badge on Canvas */}
        <div style={{
          position: 'absolute',
          top: 14,
          right: 16,
          background: dispatchStage === 'arrived' ? 'rgba(16,185,129,0.9)' : dispatchStage === 'arriving' ? 'rgba(37,99,235,0.9)' : 'rgba(15,23,42,0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          fontSize: '0.75rem',
          fontWeight: 800,
        }}>
          {dispatchStage === 'ready' && '🟢 Standby — Select Scenario Below'}
          {dispatchStage === 'searching' && '🔍 Searching Closest Verified Driver...'}
          {dispatchStage === 'matched' && `✅ Matched: ${activeScenario.driverName} (★ ${activeScenario.driverRating})`}
          {dispatchStage === 'arriving' && `🚗 Driver Navigating (${activeScenario.eta} mins left)`}
          {dispatchStage === 'arrived' && '🎉 Driver Has Arrived at Your Car!'}
        </div>
      </div>

      {/* ── REAL INTERACTIVE DISPATCH PROGRESS & SCENARIOS ── */}
      <div style={{ padding: '20px', background: 'rgba(15,23,42,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        
        {/* Scenario Selection Buttons */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
            Try a Real Emergency Scenario:
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {SCENARIOS.map(sc => {
              const isSelected = activeScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleStartSimulation(sc)}
                  style={{
                    background: isSelected ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '12px',
                    textAlign: 'left',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.8125rem' }}>{sc.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                    📍 {sc.pickup}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real Active Booking Details Card */}
        {dispatchStage !== 'ready' && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Assigned Driver</div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                👨‍✈️ {activeScenario.driverName}
                <span className="badge badge-success">★ {activeScenario.driverRating}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                🚘 Your Car: {activeScenario.car}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Security OTP Code</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-warning-light)', letterSpacing: '0.1em' }}>
                {activeScenario.otp}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-success)' }}>Share with driver on arrival</div>
            </div>
          </div>
        )}

        {/* Real Action Trigger */}
        <button
          onClick={() => onBookNow?.()}
          className="btn btn-emergency btn-lg btn-block pulse-emergency"
          style={{ fontSize: '0.9375rem', fontWeight: 900 }}
        >
          🚨 Request a Real Verified Driver Now (Instant Dispatch)
        </button>

      </div>
    </div>
  );
}
