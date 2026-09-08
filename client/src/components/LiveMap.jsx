import { useState, useEffect, useRef } from 'react';
import { Navigation, MapPin, Compass, Locate, Car, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Dark Cinematic Theme for Google Maps
const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#cbd5e1" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#475569" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2563eb" }, { lightness: -20 }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1d4ed8" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f8fafc" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0b1329" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3b82f6" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0b1329" }],
  },
];

export default function LiveMap({
  pickup = { lat: 28.5355, lng: 77.3910, address: 'Sector 18, Noida' },
  destination = { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi' },
  driverLocation = null,
  isTracking = true,
  height = '280px',
  showRoute = true,
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
}) {
  const { isDark } = useTheme();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const watchIdRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [currentGps, setCurrentGps] = useState(pickup);
  const [driverPos, setDriverPos] = useState(driverLocation || { lat: pickup.lat - 0.008, lng: pickup.lng - 0.008 });
  const [distanceRemaining, setDistanceRemaining] = useState('1.2 km');
  const [eta, setEta] = useState('4 mins');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);

  // 1. Load Google Maps Script if apiKey exists or window.google exists
  useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    if (!apiKey) {
      // If no API key provided, we gracefully run simulated fallback mode
      setLoadError(true);
      return;
    }

    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      script.onerror = () => setLoadError(true);
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => initMap());
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [apiKey]);

  // 2. Initialize Google Map Instance
  const initMap = () => {
    if (!mapContainerRef.current || !window.google?.maps) return;

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: pickup,
        zoom: 14,
        styles: isDark ? DARK_MAP_STYLE : [],
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;

      // User / Pickup Marker
      userMarkerRef.current = new window.google.maps.Marker({
        position: pickup,
        map,
        title: 'Your Location (Car)',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      });

      // Destination Marker
      if (showRoute && destination) {
        new window.google.maps.Marker({
          position: destination,
          map,
          title: 'Destination',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#10b981',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
        });

        // Route Polyline
        routePolylineRef.current = new window.google.maps.Polyline({
          path: [pickup, destination],
          geodesic: true,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map,
        });
      }

      // Driver Marker
      driverMarkerRef.current = new window.google.maps.Marker({
        position: driverPos,
        map,
        title: 'Chauffeur En Route',
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          rotation: 45,
        },
      });

      setMapLoaded(true);
      setLoadError(false);
    } catch (err) {
      console.error('Google Maps init error:', err);
      setLoadError(true);
    }
  };

  // 3. Update theme styles if toggled
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      mapInstanceRef.current.setOptions({
        styles: isDark ? DARK_MAP_STYLE : [],
      });
    }
  }, [isDark]);

  // 4. Live Geolocation Watcher
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentGps(coords);
        setGpsAccuracy(Math.round(position.coords.accuracy));

        // Update Google Maps user marker & pan smoothly
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(coords);
        }
      },
      (err) => {
        console.warn('Geolocation watch error:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // 5. Driver Simulation Movement
  useEffect(() => {
    if (!isTracking) return;

    let step = 0;
    const interval = setInterval(() => {
      step += 0.05;
      if (step >= 1) step = 1;

      const newLat = (pickup.lat - 0.008) + 0.008 * step;
      const newLng = (pickup.lng - 0.008) + 0.008 * step;
      const newPos = { lat: newLat, lng: newLng };

      setDriverPos(newPos);

      if (driverMarkerRef.current) {
        driverMarkerRef.current.setPosition(newPos);
      }

      const dist = (1.2 * (1 - step)).toFixed(1);
      const remainingEta = Math.ceil(4 * (1 - step));
      setDistanceRemaining(dist <= 0.1 ? 'Arrived!' : `${dist} km`);
      setEta(remainingEta <= 0 ? 'Now' : `${remainingEta} min`);

      if (step >= 1) clearInterval(interval);
    }, 1500);

    return () => clearInterval(interval);
  }, [pickup, isTracking]);

  // 6. Smooth Pan to User Location
  const handlePanToUser = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentGps(coords);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(coords);
            mapInstanceRef.current.setZoom(16);
          }
          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition(coords);
          }
        },
        () => {
          setIsLocating(false);
          // Fallback pan to default
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(pickup);
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: height,
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--color-slate-200)',
      background: '#090d16',
    }}>
      {/* ── GOOGLE MAP CONTAINER ── */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          display: mapLoaded && !loadError ? 'block' : 'none',
        }}
      />

      {/* ── CINEMATIC VECTOR FALLBACK (When Google Maps key is not present or loading) ── */}
      {(!mapLoaded || loadError) && (
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, opacity: 0.95 }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" />
            </pattern>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="#090d16" />
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Road Network */}
          <path d="M -20 180 Q 150 120 400 220" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="16" />
          <path d="M 120 -20 Q 200 150 250 300" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="20" />
          <path d="M 0 80 Q 220 80 440 160" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />

          {/* Route path */}
          {showRoute && (
            <>
              <path
                d="M 90 170 C 140 100, 220 120, 310 70"
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="5"
                strokeDasharray="6 4"
              />
              <circle cx="200" cy="110" r="4" fill="#60a5fa">
                <animate attributeName="r" values="3;7;3" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </>
          )}
        </svg>
      )}

      {/* Simulated Markers on Fallback */}
      {(!mapLoaded || loadError) && (
        <>
          {/* Pickup Marker */}
          <div style={{
            position: 'absolute',
            top: '65%',
            left: '25%',
            transform: 'translate(-50%, -100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 5,
          }}>
            <div style={{
              background: 'var(--color-primary)',
              color: 'white',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.6875rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              marginBottom: 4,
              boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
            }}>
              📍 Pickup (Car)
            </div>
            <MapPin size={26} color="#3b82f6" fill="rgba(37,99,235,0.3)" />
          </div>

          {/* Destination Marker */}
          {showRoute && (
            <div style={{
              position: 'absolute',
              top: '25%',
              left: '75%',
              transform: 'translate(-50%, -100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 5,
            }}>
              <div style={{
                background: 'var(--color-success)',
                color: 'white',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.6875rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                marginBottom: 4,
                boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
              }}>
                🏁 Drop-off
              </div>
              <Navigation size={22} color="#10b981" fill="rgba(16,185,129,0.3)" />
            </div>
          )}

          {/* Live Moving Driver Marker */}
          {isTracking && (
            <div style={{
              position: 'absolute',
              top: '52%',
              left: '46%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(37,99,235,0.8)',
                border: '2px solid white',
              }}>
                <Car size={18} color="white" />
              </div>
            </div>
          )}
        </>
      )}

      {/* ── TOP TELEMETRY INFO BAR ── */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-lg)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        zIndex: 15,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(37,99,235,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Compass size={18} color="#60a5fa" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{mapLoaded ? 'GOOGLE MAPS TELEMETRY' : 'RADAR TELEMETRY'}</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.65)' }}>
              Chauffeur: <strong>{distanceRemaining}</strong> · ETA: <strong>{eta}</strong>
            </div>
          </div>
        </div>

        {/* Pan / Re-center Location Button */}
        <button
          onClick={handlePanToUser}
          disabled={isLocating}
          style={{
            background: isLocating ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            padding: '6px 10px',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            border: 'none',
            cursor: isLocating ? 'wait' : 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}
          title="Smooth pan to my GPS location"
        >
          <Locate size={13} className={isLocating ? 'animate-spin' : ''} />
          {isLocating ? 'Locating...' : 'Pan to Me'}
        </button>
      </div>

      {/* ── BOTTOM LIVE SATELLITE STATUS PILL ── */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'rgba(16, 185, 129, 0.85)',
        backdropFilter: 'blur(8px)',
        color: 'white',
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.6875rem',
        fontWeight: 700,
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
        <span>Live GPS {gpsAccuracy ? `(±${gpsAccuracy}m)` : 'Connected'}</span>
      </div>
    </div>
  );
}
