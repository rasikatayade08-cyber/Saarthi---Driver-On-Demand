import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Shield, Heart, Users, Crown, Calendar, Zap, ChevronRight, Navigation } from 'lucide-react';

/* ─── Cinematic 3D Scene Builder with Mobile Optimization ─── */
function buildScene(container) {
  const isMobile = window.innerWidth < 768;
  const W = container.clientWidth || window.innerWidth;
  const H = container.clientHeight || window.innerHeight;

  /* ── Scene ── */
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05080f, isMobile ? 0.024 : 0.018);
  scene.background = new THREE.Color(0x05080f);

  /* ── Camera ── */
  const camera = new THREE.PerspectiveCamera(isMobile ? 60 : 50, W / H, 0.1, 200);
  camera.position.set(isMobile ? -1.8 : -2.8, isMobile ? 2.5 : 2.0, isMobile ? 8.5 : 7.2);
  camera.lookAt(0.3, 0.5, 0);

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = !isMobile;
  if (!isMobile) {
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
  }
  container.appendChild(renderer.domElement);

  /* ── Lights ── */
  scene.add(new THREE.AmbientLight(0x0d1a2e, 9));

  const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.8);
  keyLight.position.set(-8, 14, 6);
  if (!isMobile) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
  }
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffd580, 1.8);
  fillLight.position.set(10, 6, 2);
  scene.add(fillLight);

  const cyanGlow = new THREE.PointLight(0x06b6d4, 4.5, 12);
  cyanGlow.position.set(0, 0.3, 1.5);
  scene.add(cyanGlow);

  /* ── Road ── */
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9, metalness: 0.1 });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(80, 7.5), roadMat);
  road.rotation.x = -Math.PI / 2;
  road.receiveShadow = !isMobile;
  scene.add(road);

  // Wet reflective road strip
  const wetMat = new THREE.MeshStandardMaterial({ color: 0x0a0f1d, roughness: 0.08, metalness: 0.85 });
  const wet = new THREE.Mesh(new THREE.PlaneGeometry(80, 3.0), wetMat);
  wet.rotation.x = -Math.PI / 2;
  wet.position.set(0, 0.005, 0.3);
  scene.add(wet);

  // Lane dashes
  for (let i = -38; i < 40; i += 5) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.14), new THREE.MeshBasicMaterial({ color: 0x334155 }));
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(i, 0.01, 0);
    scene.add(dash);
  }

  // Yellow borders
  [-3.4, 3.4].forEach((z) => {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(80, 0.12), new THREE.MeshBasicMaterial({ color: 0xeab308 }));
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.01, z);
    scene.add(line);
  });

  /* ── Buildings ── */
  const buildingList = [
    [-16, -7, 3.5, 14, 3], [-11, -7, 2.5, 9, 3], [-7, -7, 4.0, 18, 3],
    [-3, -7, 2.8, 11, 3], [1, -7, 5.0, 22, 3], [6, -7, 3.2, 13, 3],
    [10, -7, 2.8, 16, 3], [15, -7, 3.8, 10, 3],
    [-14, 7, 3.5, 12, 3], [-9, 7, 3.0, 17, 3], [-5, 7, 4.2, 9, 3],
    [-1, 7, 3.6, 14, 3], [4, 7, 5.0, 19, 3], [9, 7, 3.0, 11, 3],
    [13, 7, 3.5, 15, 3],
  ];

  const winMats = [
    new THREE.MeshBasicMaterial({ color: 0xfef3c7 }),
    new THREE.MeshBasicMaterial({ color: 0xbae6fd }),
  ];

  buildingList.forEach(([x, z, w, h, d]) => {
    const bMat = new THREE.MeshStandardMaterial({ color: 0x091220, roughness: 0.85 });
    const building = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bMat);
    building.position.set(x, h / 2, z);
    if (!isMobile) {
      building.castShadow = true;
      building.receiveShadow = true;
    }
    scene.add(building);

    // Glowing windows
    const stepY = isMobile ? 1.6 : 0.9;
    const stepX = isMobile ? 1.0 : 0.6;
    for (let wy = 0.5; wy < h - 0.5; wy += stepY) {
      for (let wx = -w / 2 + 0.3; wx < w / 2 - 0.2; wx += stepX) {
        if (Math.random() > 0.45) {
          const mat = winMats[Math.random() > 0.6 ? 1 : 0];
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.03), mat);
          win.position.set(wx, wy - h / 2, d / 2 + 0.015);
          building.add(win);
        }
      }
    }
  });

  /* ── Street Lamps with Sodium Glow ── */
  [-8, -2, 4, 10].forEach((x) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 4.5, 8), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    pole.position.set(x, 2.25, -3.8);
    scene.add(pole);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    bulb.position.set(x, 4.5, -3.8);
    scene.add(bulb);
    const lampGlow = new THREE.PointLight(0xfef08a, 2.2, 7);
    lampGlow.position.copy(bulb.position);
    scene.add(lampGlow);
  });

  /* ── Hero Car ── */
  const carGroup = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.92, roughness: 0.16 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x0f172a, metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.88 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.98, roughness: 0.08 });
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
  const redMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const blueMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd });

  // Chassis
  const lower = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.46, 1.14), bodyMat);
  lower.position.y = 0.34;
  if (!isMobile) lower.castShadow = true;
  carGroup.add(lower);

  // Cabin
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.42, 1.0), glassMat);
  cabin.position.set(-0.06, 0.84, 0);
  if (!isMobile) cabin.castShadow = true;
  carGroup.add(cabin);

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.07, 1.01), bodyMat);
  roof.position.set(-0.06, 1.065, 0);
  carGroup.add(roof);

  // Headlights
  [-0.4, 0.4].forEach((z) => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.12, 0.22), blueMat);
    hl.position.set(1.29, 0.38, z);
    carGroup.add(hl);
    const sp = new THREE.SpotLight(0xffffff, 5.5, 16, Math.PI / 8, 0.35);
    sp.position.set(1.4, 0.4, z);
    sp.target.position.set(10, -0.3, z * 1.1);
    scene.add(sp);
    scene.add(sp.target);
  });

  // Taillights
  [-0.4, 0.4].forEach((z) => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.12, 0.22), redMat);
    tl.position.set(-1.3, 0.38, z);
    carGroup.add(tl);
  });

  // 4 Wheels
  const wheels = [];
  [[0.76, 0.21, 0.58], [0.76, 0.21, -0.58], [-0.76, 0.21, 0.58], [-0.76, 0.21, -0.58]].forEach(([x, y, z]) => {
    const wg = new THREE.Group();
    wg.position.set(x, y, z);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 16), blackMat);
    tire.rotation.x = Math.PI / 2;
    wg.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.19, 10), chromeMat);
    rim.rotation.x = Math.PI / 2;
    wg.add(rim);
    carGroup.add(wg);
    wheels.push(wg);
  });

  // Rooftop Emergency / Mode Strobe Bar
  const strobeBar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  strobeBar.position.set(-0.06, 1.1, 0);
  carGroup.add(strobeBar);
  const strobeLight = new THREE.PointLight(0xef4444, 4.5, 6);
  strobeLight.position.set(-0.06, 1.15, 0);
  carGroup.add(strobeLight);

  scene.add(carGroup);

  /* ── Background Moving Cars ── */
  const bgCars = [];
  const bgColors = [0xef4444, 0x22c55e, 0xf59e0b, 0x64748b, 0xa78bfa, 0x0ea5e9];
  const bgCount = isMobile ? 4 : 8;
  for (let i = 0; i < bgCount; i++) {
    const c = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.45, 1.0),
      new THREE.MeshStandardMaterial({ color: bgColors[i % bgColors.length], metalness: 0.75, roughness: 0.3 })
    );
    c.position.set(-30 + i * (60 / bgCount), 0.23, i % 2 === 0 ? 1.3 : -1.3);
    scene.add(c);
    bgCars.push({ mesh: c, speed: (i % 2 === 0 ? 1 : -1) * (0.045 + Math.random() * 0.04) });
  }

  /* ── Atmospheric Light Rain Particles ── */
  const RAIN_COUNT = isMobile ? 600 : 1600;
  const rainPos = new Float32Array(RAIN_COUNT * 3);
  const rainVel = new Float32Array(RAIN_COUNT);
  for (let i = 0; i < RAIN_COUNT; i++) {
    rainPos[i * 3] = (Math.random() - 0.5) * 55;
    rainPos[i * 3 + 1] = Math.random() * 20;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * 22;
    rainVel[i] = 0.16 + Math.random() * 0.18;
  }
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  const rain = new THREE.Points(
    rainGeo,
    new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: isMobile ? 0.05 : 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(rain);

  /* ── Interactive Parallax Tracking on Mouse / Gyro ── */
  let targetCamX = isMobile ? -1.8 : -2.8;
  let targetCamY = isMobile ? 2.5 : 2.0;

  const handleMouseMove = (e) => {
    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetCamX = (isMobile ? -1.8 : -2.8) + normX * 0.8;
    targetCamY = (isMobile ? 2.5 : 2.0) - normY * 0.4;
  };
  window.addEventListener('mousemove', handleMouseMove);

  /* ── Animation Loop ── */
  const clock = new THREE.Clock();
  let rafId;

  const animate = () => {
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Car suspension bounce & gentle wheel turn
    carGroup.position.y = Math.sin(t * 4.5) * 0.016;
    carGroup.rotation.y = Math.sin(t * 0.16) * 0.05;

    // Wheel spin
    wheels.forEach((w) => {
      w.children[0].rotation.y += 0.07;
    });

    // Strobe light pulse
    const on = Math.sin(t * 12) > 0;
    strobeLight.intensity = on ? 5.5 : 0;
    strobeBar.material.color.setHex(on ? 0xef4444 : 0x1d4ed8);

    // Cyan ground pulse
    cyanGlow.intensity = 3.2 + Math.sin(t * 3) * 1.2;

    // Traffic cars
    bgCars.forEach((bc) => {
      bc.mesh.position.x += bc.speed;
      if (bc.mesh.position.x > 32) bc.mesh.position.x = -32;
      if (bc.mesh.position.x < -32) bc.mesh.position.x = 32;
    });

    // Rain drop update
    const rp = rainGeo.attributes.position;
    for (let i = 0; i < RAIN_COUNT; i++) {
      rp.array[i * 3 + 1] -= rainVel[i];
      if (rp.array[i * 3 + 1] < 0) rp.array[i * 3 + 1] = 20;
    }
    rp.needsUpdate = true;

    // Smooth camera lerp with parallax
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.lookAt(0.3, 0.5, 0);

    renderer.render(scene, camera);
  };
  animate();

  /* ── Resize ── */
  const onResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', handleMouseMove);
    renderer.dispose();
  };
}

/* ════════════════════════════════════════════════════
   HERO COMPONENT
════════════════════════════════════════════════════ */
export default function ThreeDHome({
  onGetDriverNow,
  onScheduleDriver,
  onQuickAction,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const cleanup = buildScene(mountRef.current);
    return cleanup;
  }, []);

  const QUICK_ACTIONS = [
    { id: 'driver_now', icon: <Zap size={16} />, label: 'Driver Now', color: '#ef4444', action: onGetDriverNow },
    { id: 'schedule', icon: <Calendar size={16} />, label: 'Schedule', color: '#f59e0b', action: onScheduleDriver },
    { id: 'preferred', icon: <Heart size={16} />, label: 'Preferred Drivers', color: '#ec4899', action: () => onQuickAction?.('preferred') },
    { id: 'family', icon: <Users size={16} />, label: 'Family', color: '#10b981', action: () => onQuickAction?.('family') },
    { id: 'shield', icon: <Shield size={16} />, label: 'Saarthi Shield', color: '#3b82f6', action: () => onQuickAction?.('shield') },
    { id: 'premium', icon: <Crown size={16} />, label: 'Premium', color: '#a855f7', action: () => onQuickAction?.('premium') },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        overflow: 'hidden',
        background: '#05080f',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* ── 3D Canvas ── */}
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      {/* ── Gradient Vignette ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(to right, rgba(5,8,15,0.88) 0%, rgba(5,8,15,0.45) 55%, rgba(5,8,15,0.15) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(5,8,15,0.95) 0%, rgba(5,8,15,0.4) 30%, transparent 60%)',
        }}
      />

      {/* ── Top-Right Live Stats ── */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          display: 'flex',
          gap: 10,
          zIndex: 10,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        {[
          ['847', 'Drivers Live', '#34d399'],
          ['4.9★', 'Avg Rating', '#fbbf24'],
          ['< 6 min', 'Fast ETA', '#60a5fa'],
        ].map(([val, lbl, color]) => (
          <div
            key={lbl}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-lg)',
              padding: '8px 14px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ color, fontWeight: 900, fontSize: '0.9375rem' }}>{val}</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.6875rem', marginTop: 1, fontWeight: 600 }}>
              {lbl}
            </div>
          </div>
        ))}
      </div>

      {/* ── Hero Overlay Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '0 24px 32px',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              color: '#fca5a5',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#ef4444',
                display: 'inline-block',
                animation: 'pulse-emergency 1.5s infinite',
              }}
            />
            SAARTHI · VERIFIED CHAUFFEURS
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.8125rem', fontWeight: 600 }}>
            Your Car · Our Driver
          </span>
        </div>

        {/* Hero Headlines */}
        <div>
          <h1
            style={{
              fontSize: 'clamp(1.85rem, 5vw, 3.1rem)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 32px rgba(0,0,0,0.8)',
            }}
          >
            Wherever you&apos;re going, you don&apos;t have to drive.
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)',
              lineHeight: 1.5,
              marginTop: 10,
              fontWeight: 500,
              maxWidth: '540px',
            }}
          >
            Get a verified driver for your own car whenever you need one.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
          <button
            id="hero-get-driver-now-btn"
            onClick={onGetDriverNow}
            style={{
              padding: '14px 28px',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              fontWeight: 900,
              fontSize: '1rem',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.55)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 0 45px rgba(239, 68, 68, 0.75)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.55)';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🚨</span>
            Get a Driver Now
          </button>

          <button
            id="hero-schedule-driver-btn"
            onClick={onScheduleDriver}
            style={{
              padding: '14px 24px',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Calendar size={18} color="#f59e0b" />
            Schedule a Driver
          </button>
        </div>

        {/* ── Interactive Quick Actions Chips Bar ── */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Services
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              scrollbarWidth: 'none',
            }}
          >
            {QUICK_ACTIONS.map((qa) => (
              <button
                key={qa.id}
                onClick={qa.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexShrink: 0,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
                  e.currentTarget.style.borderColor = qa.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 18px ${qa.color}33`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ color: qa.color }}>{qa.icon}</span>
                <span>{qa.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
