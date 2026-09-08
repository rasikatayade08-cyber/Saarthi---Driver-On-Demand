import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = {
  customer: {
    _id: 'usr_001',
    name: 'Raj Sharma',
    email: 'raj@saarthi.in',
    phone: '+91 98765 43210',
    role: 'customer',
    address: 'Sector 18, Noida, UP',
    isVerified: true,
    memberSince: 'Jan 2024',
  },
  driver: {
    _id: 'drv_001',
    name: 'Suresh Kumar',
    email: 'suresh@saarthi.in',
    phone: '+91 77889 90011',
    role: 'driver',
    licenseNumber: 'DL-1420110012345',
    experience: 7,
    rating: 4.8,
    totalRides: 1243,
    todayEarnings: 1450,
    isVerified: true,
    verificationStatus: 'approved', // 'pending' | 'approved' | 'rejected'
    isOnline: true,
    documentsUploaded: {
      license: true,
      aadhar: true,
      policeCheck: true,
    },
  },
  new_driver: {
    _id: 'drv_002',
    name: 'Vikram Singh',
    email: 'vikram@saarthi.in',
    phone: '+91 88776 65544',
    role: 'driver',
    licenseNumber: 'UP-1620220098765',
    experience: 4,
    rating: 5.0,
    totalRides: 0,
    todayEarnings: 0,
    isVerified: false,
    verificationStatus: 'pending',
    isOnline: false,
    documentsUploaded: {
      license: true,
      aadhar: true,
      policeCheck: false,
    },
  },
  admin: {
    _id: 'adm_001',
    name: 'Operations Admin',
    email: 'admin@saarthi.in',
    phone: '+91 1800 722784',
    role: 'admin',
    isVerified: true,
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    let matchedUser = MOCK_USERS.customer;
    if (email.includes('admin')) {
      matchedUser = MOCK_USERS.admin;
    } else if (email.includes('suresh') || email.includes('driver')) {
      matchedUser = MOCK_USERS.driver;
    } else if (email.includes('vikram')) {
      matchedUser = MOCK_USERS.new_driver;
    }
    
    setUser(matchedUser);
    setLoading(false);
    return { success: true, user: matchedUser };
  };

  const register = async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const isDriver = data.role === 'driver';
    const isAdm = data.role === 'admin';
    const newUser = {
      _id: `${isAdm ? 'adm' : isDriver ? 'drv' : 'usr'}_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role || 'customer',
      isVerified: isAdm,
      verificationStatus: isDriver ? (data.licenseNumber ? 'pending' : 'incomplete') : 'approved',
      licenseNumber: data.licenseNumber || '',
      experience: data.experience || 0,
      rating: 5.0,
      totalRides: 0,
      todayEarnings: 0,
      isOnline: false,
      documentsUploaded: {
        license: !!data.licenseNumber,
        aadhar: false,
        policeCheck: false,
      }
    };

    setUser(newUser);
    setLoading(false);
    return { success: true, user: newUser };
  };

  const updateUser = (updates) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUser, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
