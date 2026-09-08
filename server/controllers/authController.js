// Mock auth controller — no real DB/JWT for this foundation version
const MOCK_USERS = [
  {
    _id: 'usr_001',
    name: 'Raj Sharma',
    email: 'raj@saarthi.in',
    phone: '+91 98765 43210',
    role: 'customer',
    profilePhoto: '',
    address: 'Sector 18, Noida, UP',
    isVerified: true,
  },
  {
    _id: 'usr_002',
    name: 'Priya Mehta',
    email: 'priya@saarthi.in',
    phone: '+91 87654 32109',
    role: 'customer',
    profilePhoto: '',
    address: 'Koramangala, Bangalore, KA',
    isVerified: true,
  },
];

// POST /api/auth/login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  // Mock: accept any email that matches our demo users with any non-empty password
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  return res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token: `mock_jwt_token_${user._id}_${Date.now()}`,
    },
  });
};

// POST /api/auth/register
const register = (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const newUser = {
    _id: `usr_${Date.now()}`,
    name,
    email,
    phone,
    role: role || 'customer',
    profilePhoto: '',
    address: '',
    isVerified: false,
  };

  return res.status(201).json({
    success: true,
    message: 'Registration successful! Please verify your account.',
    data: {
      user: newUser,
      token: `mock_jwt_token_${newUser._id}`,
    },
  });
};

// GET /api/auth/me
const getMe = (req, res) => {
  return res.json({
    success: true,
    data: { user: MOCK_USERS[0] },
  });
};

module.exports = { login, register, getMe };
