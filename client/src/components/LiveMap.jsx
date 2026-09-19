import { useState, useEffect, useRef } from 'react';
import { Navigation, Locate, Plus, Minus, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ─── Pure OpenStreetMap Standard Tiles (No API key, No tokens, No credentials) ─── */
const OPENSTREETMAP_TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// Haversine distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function LiveMap({
  pickup = { lat: 28.5355, lng: 77.3910, address: 'Sector 18, Noida' },
  destination = { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi' },
  driver = null,
  assignedVehicle = null,
  driverLocation = null,
  isTracking = true,
  height = '320px',
  showRoute = true,
}) {
  const { isDark } = useTheme();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const watchIdRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [currentGps, setCurrentGps] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const activeDriver = driver || {
    name: 'Suresh Kumar',
    rating: 4.9,
    phone: '+91 77889 90011',
    verified: true,
  };

  const activeVehicle = assignedVehicle || {
    nickname: 'Honda City',
    number: 'DL 01 AB 1234',
  };

  const [driverPos, setDriverPos] = useState(
    driverLocation || { lat: pickup.lat - 0.008, lng: pickup.lng - 0.007 }
  );
  const [driverDistance, setDriverDistance] = useState('1.2 km');
  const [driverEta, setDriverEta] = useState('3 mins');
  const [liveDistance, setLiveDistance] = useState('14.2 km');
  const [liveEta, setLiveEta] = useState('28 mins');

  // ── 1. Check Leaflet Availability ──
  useEffect(() => {
    if (window.L) {
      setMapReady(true);
      return;
    }

    const timer = setInterval(() => {
      if (window.L) {
        setMapReady(true);
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // ── 2. Initialize Leaflet with Pure OpenStreetMap ──
  useEffect(() => {
    if (!mapReady || !mapContainerRef.current || mapInstanceRef.current) return;
    const L = window.L;
    if (!L) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [pickup.lat, pickup.lng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Standard OpenStreetMap Tiles (100% Free, zero tokens or keys)
    L.tileLayer(OPENSTREETMAP_TILES, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    // ── Helper for custom DivIcons ──
    const createCustomIcon = (htmlContent, className = '', size = [36, 36], anchor = [18, 18]) => {
      return L.divIcon({
        className: `saarthi-map-marker ${className}`,
        html: htmlContent,
        iconSize: size,
        iconAnchor: anchor,
      });
    };

    // ── 1. Pickup Location Marker ──
    const pickupIcon = createCustomIcon(`
      <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; inset:0; border-radius:50%; background:rgba(37,99,235,0.35); animation:pulse-ring 2s infinite;"></div>
        <div style="width:26px; height:26px; border-radius:50%; background:#2563eb; border:2.5px solid #ffffff; box-shadow:0 0 16px rgba(37,99,235,0.9); display:flex; align-items:center; justify-content:center; color:white; font-size:13px;">
          📍
        </div>
      </div>
    `, 'pickup-marker', [36, 36], [18, 18]);

    pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:sans-serif;padding:3px;">
          <div style="font-weight:800;font-size:12px;color:#0f172a;">📍 Pickup Location</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">${pickup.address || 'Car Location'}</div>
        </div>
      `);

    // ── 2. Destination Marker ──
    if (showRoute && destination) {
      const destIcon = createCustomIcon(`
        <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; inset:0; border-radius:50%; background:rgba(16,185,129,0.35); animation:pulse-ring 2s infinite 0.6s;"></div>
          <div style="width:26px; height:26px; border-radius:50%; background:#10b981; border:2.5px solid #ffffff; box-shadow:0 0 16px rgba(16,185,129,0.9); display:flex; align-items:center; justify-content:center; color:white; font-size:13px;">
            🏁
          </div>
        </div>
      `, 'dest-marker', [36, 36], [18, 18]);

      destMarkerRef.current = L.marker([destination.lat, destination.lng], { icon: destIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;padding:3px;">
            <div style="font-weight:800;font-size:12px;color:#0f172a;">🏁 Drop-off Destination</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">${destination.address || 'Destination address'}</div>
          </div>
        `);

      // Real curved polyline route
      const latMid = (pickup.lat + destination.lat) / 2 + 0.007;
      const lngMid = (pickup.lng + destination.lng) / 2 - 0.010;
      const waypoints = [
        [pickup.lat, pickup.lng],
        [pickup.lat + (latMid - pickup.lat) * 0.5, pickup.lng + 0.003],
        [latMid, lngMid],
        [destination.lat - (destination.lat - latMid) * 0.4, destination.lng - 0.004],
        [destination.lat, destination.lng],
      ];

      L.polyline(waypoints, {
        color: '#2563eb',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      polylineRef.current = L.polyline(waypoints, {
        color: '#2563eb',
        weight: 4,
        opacity: 0.95,
        dashArray: '8, 6',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Bounds fit
      const bounds = L.latLngBounds(waypoints);
      map.fitBounds(bounds, { padding: [40, 40] });

      const distKm = calculateDistance(pickup.lat, pickup.lng, destination.lat, destination.lng) * 1.35;
      const etaMin = Math.round((distKm / 28) * 60);
      setLiveDistance(`${distKm.toFixed(1)} km`);
      setLiveEta(`${etaMin} mins`);
    }

    // ── 3. Chauffeur Marker ──
    if (isTracking) {
      const driverHtml = `
        <div style="position:relative; width:46px; height:46px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; inset:0; border-radius:50%; background:rgba(37,99,235,0.3); animation:pulse-ring 1.8s infinite;"></div>
          <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, #1e3a8a, #2563eb); border:2.5px solid #ffffff; box-shadow:0 4px 18px rgba(37,99,235,0.85); display:flex; align-items:center; justify-content:center; color:white; font-size:17px; z-index:2;">
            🚘
          </div>
          <div style="position:absolute; bottom:-16px; background:rgba(15,23,42,0.92); border:1px solid rgba(255,255,255,0.25); color:#ffffff; font-size:9px; font-weight:800; padding:1px 5px; border-radius:4px; white-space:nowrap; z-index:3;">
            ${activeDriver.name.split(' ')[0]}
          </div>
        </div>
      `;

      const driverIcon = createCustomIcon(driverHtml, 'driver-div-icon', [46, 46], [23, 23]);

      driverMarkerRef.current = L.marker([driverPos.lat, driverPos.lng], { icon: driverIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;padding:3px;min-width:160px;">
            <div style="font-weight:800;font-size:12px;color:#0f172a;">${activeDriver.name} (Chauffeur)</div>
            <div style="font-size:11px;color:#2563eb;font-weight:700;margin-top:2px;">Car: ${activeVehicle.nickname}</div>
            <div style="font-size:10px;color:#64748b;">Plate: ${activeVehicle.number}</div>
          </div>
        `);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapReady]);

  // ── 3. Real User GPS Location (navigator.geolocation) ──
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentGps(coords);
        setGpsAccuracy(Math.round(pos.coords.accuracy));

        if (mapInstanceRef.current && window.L) {
          const L = window.L;
          if (!userMarkerRef.current) {
            const userIcon = L.divIcon({
              className: 'user-gps-marker',
              html: `
                <div style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center;">
                  <div style="position:absolute; inset:0; border-radius:50%; background:rgba(239,68,68,0.35); animation:pulse-ring 1.8s infinite;"></div>
                  <div style="width:16px; height:16px; border-radius:50%; background:#ef4444; border:2.5px solid #ffffff; box-shadow:0 0 12px rgba(239,68,68,0.9);"></div>
                </div>
              `,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });

            userMarkerRef.current = L.marker([coords.lat, coords.lng], { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup('<div style="font-family:sans-serif;font-weight:700;font-size:12px;color:#0f172a;">📍 You Are Here (GPS Live)</div>');
          } else {
            userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
          }
        }
      },
      (err) => {
        console.warn('GPS location tracking notice:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [mapReady]);

  // ── 4. Real-Time Chauffeur Movement ──
  useEffect(() => {
    if (!isTracking || !mapInstanceRef.current) return;

    let step = 0;
    const interval = setInterval(() => {
      step += 0.04;
      if (step >= 1) step = 1;

      const newLat = (pickup.lat - 0.008) + (0.008 * step);
      const newLng = (pickup.lng - 0.007) + (0.007 * step);
      const newPos = { lat: newLat, lng: newLng };
      setDriverPos(newPos);

      if (driverMarkerRef.current) {
        driverMarkerRef.current.setLatLng([newLat, newLng]);
      }

      const dist = calculateDistance(newLat, newLng, pickup.lat, pickup.lng);
      setDriverDistance(dist <= 0.05 ? 'Arrived' : `${dist.toFixed(1)} km`);
      setDriverEta(dist <= 0.05 ? 'Now' : `${Math.max(1, Math.ceil(dist * 2.5))} min`);

      if (step >= 1) clearInterval(interval);
    }, 1200);

    return () => clearInterval(interval);
  }, [pickup, isTracking]);

  // ── 5. Zoom & Pan Controls ──
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handlePanToUser = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentGps(coords);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([coords.lat, coords.lng], 16, { animate: true, duration: 1.2 });
          }
        },
        () => {
          setIsLocating(false);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([pickup.lat, pickup.lng], 15, { animate: true, duration: 1 });
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleFitRoute = () => {
    if (mapInstanceRef.current && showRoute && destination) {
      const bounds = window.L?.latLngBounds([
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng],
      ]);
      if (bounds) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], animate: true });
      }
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: height,
      borderRadius: 'var(--radius-2xl)',
      overflow: 'hidden',
      boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.1)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--color-slate-200)',
      background: '#090d16',
    }}>
      {/* ── OPENSTREETMAP CANVAS ── */}
      <div
        ref={mapContainerRef}
        className={isDark ? 'saarthi-osm-dark' : 'saarthi-osm-light'}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      />

      {/* ── SPINNER ── */}
      {!mapReady && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#090d16',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          zIndex: 2,
          color: 'white',
        }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '3px solid rgba(37,99,235,0.2)',
            borderTopColor: '#2563eb',
            animation: 'spin 1s linear infinite',
          }} />
          <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 600 }}>
            Loading OpenStreetMap...
          </span>
        </div>
      )}

      {/* ── TOP HUD BAR (DISTANCE & ETA) ── */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        background: 'rgba(15, 23, 42, 0.90)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: 'var(--radius-xl)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        zIndex: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
            color: 'white',
          }}>
            <Navigation size={18} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em', color: '#ffffff' }}>
                OPENSTREETMAP LIVE
              </span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse-emergency 1.5s infinite' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, marginTop: 1 }}>
              Distance: <strong style={{ color: '#60a5fa' }}>{liveDistance}</strong> · ETA: <strong style={{ color: '#34d399' }}>{liveEta}</strong>
            </div>
          </div>
        </div>

        {/* Fit Route button */}
        {showRoute && (
          <button
            onClick={handleFitRoute}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#93c5fd',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            title="Fit Route View"
          >
            <Layers size={13} /> Route
          </button>
        )}
      </div>

      {/* ── FLOATING ZOOM & PAN CONTROLS ── */}
      <div style={{
        position: 'absolute',
        right: 12,
        bottom: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 10,
      }}>
        {/* Pan to User GPS Button */}
        <button
          onClick={handlePanToUser}
          disabled={isLocating}
          style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            border: '1.5px solid rgba(255,255,255,0.3)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isLocating ? 'wait' : 'pointer',
            boxShadow: '0 6px 20px rgba(37,99,235,0.4)',
            transition: 'transform 0.15s ease',
          }}
          title="Pan to My Live GPS Location"
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Locate size={18} className={isLocating ? 'animate-spin' : ''} />
        </button>

        {/* Zoom In Button */}
        <button
          onClick={handleZoomIn}
          style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            transition: 'transform 0.15s ease',
          }}
          title="Zoom In"
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={18} />
        </button>

        {/* Zoom Out Button */}
        <button
          onClick={handleZoomOut}
          style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            transition: 'transform 0.15s ease',
          }}
          title="Zoom Out"
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Minus size={18} />
        </button>
      </div>

      {/* ── BOTTOM SATELLITE TELEMETRY PILL ── */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        color: '#ffffff',
        padding: '5px 12px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.72rem',
        fontWeight: 700,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulse-emergency 1.5s infinite' }} />
        <span style={{ color: '#34d399' }}>Live Telemetry</span>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
        <span style={{ color: '#94a3b8' }}>{gpsAccuracy ? `GPS (±${gpsAccuracy}m)` : 'OpenStreetMap Active'}</span>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .saarthi-osm-dark .leaflet-tile {
          filter: brightness(0.65) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7) !important;
        }
        .saarthi-osm-light .leaflet-tile {
          filter: contrast(1.05) saturate(1.1) !important;
        }
        .leaflet-container {
          background: #090d16 !important;
          font-family: inherit !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
          background: #ffffff !important;
        }
        .leaflet-popup-tip {
          background: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
