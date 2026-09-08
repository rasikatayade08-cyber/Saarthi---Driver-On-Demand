import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerHomePage from './pages/CustomerHomePage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import DriverHomePage from './pages/DriverHomePage';
import DriverVerificationPage from './pages/DriverVerificationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'driver') return <Navigate to={user?.isVerified ? "/driver/home" : "/driver/verify"} replace />;
    return <Navigate to="/home" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return children;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'driver') {
    return <Navigate to={user?.isVerified ? "/driver/home" : "/driver/verify"} replace />;
  }
  return <Navigate to="/home" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Customer Protected pages */}
      <Route path="/home" element={<PrivateRoute allowedRoles={['customer']}><CustomerHomePage /></PrivateRoute>} />
      <Route path="/bookings" element={<PrivateRoute allowedRoles={['customer']}><BookingsPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute allowedRoles={['customer']}><ProfilePage /></PrivateRoute>} />

      {/* Driver Protected pages */}
      <Route path="/driver/home" element={<PrivateRoute allowedRoles={['driver']}><DriverHomePage /></PrivateRoute>} />
      <Route path="/driver/verify" element={<PrivateRoute allowedRoles={['driver']}><DriverVerificationPage /></PrivateRoute>} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboardPage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

