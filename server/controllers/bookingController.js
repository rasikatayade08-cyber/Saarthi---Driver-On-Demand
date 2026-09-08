const MOCK_BOOKINGS = [
  {
    _id: 'bkg_001',
    customer: 'usr_001',
    driver: { _id: 'drv_001', name: 'Suresh Kumar', rating: 4.8, phone: '+91 77889 90011', photo: '' },
    vehicle: { make: 'Honda', model: 'City', licensePlate: 'DL 01 AB 1234', color: 'White' },
    bookingType: 'emergency',
    pickupLocation: { address: 'Sector 18 Metro Station, Noida' },
    destination: { address: 'Connaught Place, New Delhi' },
    status: 'completed',
    otp: '4829',
    estimatedFare: 350,
    actualFare: 380,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 5,
  },
  {
    _id: 'bkg_002',
    customer: 'usr_001',
    driver: { _id: 'drv_002', name: 'Ravi Sharma', rating: 4.6, phone: '+91 88990 01122', photo: '' },
    vehicle: { make: 'Toyota', model: 'Fortuner', licensePlate: 'UP 82 XY 5678', color: 'Black' },
    bookingType: 'scheduled',
    pickupLocation: { address: 'Home - Sector 62, Noida' },
    destination: { address: 'IGI Airport, New Delhi' },
    status: 'completed',
    otp: '9152',
    estimatedFare: 850,
    actualFare: 850,
    scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4,
  },
];

// Helper to generate a random 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// GET /api/bookings
const getBookings = (req, res) => {
  const { status, type } = req.query;
  let bookings = [...MOCK_BOOKINGS];
  if (status) bookings = bookings.filter(b => b.status === status);
  if (type) bookings = bookings.filter(b => b.bookingType === type);
  res.json({ success: true, count: bookings.length, data: bookings });
};

// GET /api/bookings/:id
const getBookingById = (req, res) => {
  const booking = MOCK_BOOKINGS.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, data: booking });
};

// POST /api/bookings
const createBooking = (req, res) => {
  const { vehicleId, pickupLocation, destination, bookingType, scheduledAt, notes } = req.body;

  if (!vehicleId || !pickupLocation) {
    return res.status(400).json({ success: false, message: 'Vehicle and pickup location are required' });
  }

  const booking = {
    _id: `bkg_${Date.now()}`,
    customer: 'usr_001',
    driver: null,
    vehicle: { make: 'Your', model: 'Vehicle', licensePlate: vehicleId, color: 'N/A' },
    bookingType: bookingType || 'emergency',
    pickupLocation: { address: pickupLocation },
    destination: { address: destination || 'Central District' },
    scheduledAt: scheduledAt || null,
    status: 'requested', // 1. Requested
    otp: generateOTP(), // 4-digit security OTP
    estimatedFare: bookingType === 'emergency' ? 299 : 199,
    actualFare: 0,
    notes: notes || '',
    createdAt: new Date().toISOString(),
    rating: null,
  };

  MOCK_BOOKINGS.unshift(booking);

  res.status(201).json({
    success: true,
    message: 'Booking created! Searching for nearby drivers.',
    data: booking,
  });
};

// PATCH /api/bookings/:id/status — advance trip through the 7 stages
const updateBookingStatus = (req, res) => {
  const { status, driverOtp } = req.body;
  const booking = MOCK_BOOKINGS.find(b => b._id === req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const validStatuses = [
    'requested',        // 1. Requested
    'accepted',         // 2. Accepted
    'arriving',         // 3. Arriving
    'arrived',          // 4. Arrived
    'otp_verification', // 5. OTP Verification
    'trip_started',     // 6. Trip Started
    'completed',        // 7. Completed
    'cancelled'
  ];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Valid values: ${validStatuses.join(', ')}` });
  }

  // OTP Validation check when starting trip
  if (status === 'trip_started') {
    if (driverOtp && driverOtp !== booking.otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP! Please ask customer for correct 4-digit code.' });
    }
  }

  if (status) booking.status = status;
  if (status === 'completed') {
    booking.actualFare = booking.estimatedFare;
  }

  res.json({
    success: true,
    message: `Booking status updated to ${booking.status}`,
    data: booking,
  });
};

// PATCH /api/bookings/:id/cancel
const cancelBooking = (req, res) => {
  const booking = MOCK_BOOKINGS.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  booking.status = 'cancelled';
  res.json({ success: true, message: 'Booking cancelled', data: booking });
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
};
