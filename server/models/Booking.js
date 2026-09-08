const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  
  bookingType: { type: String, enum: ['emergency', 'scheduled'], default: 'emergency' },
  
  pickupLocation: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  destination: {
    address: { type: String, default: '' },
    lat: { type: Number },
    lng: { type: Number },
  },
  
  scheduledAt: { type: Date, default: null }, // null = immediate
  
  status: {
    type: String,
    enum: ['pending', 'accepted', 'driver_assigned', 'en_route', 'arrived', 'completed', 'cancelled'],
    default: 'pending',
  },
  
  estimatedFare: { type: Number, default: 0 },
  actualFare: { type: Number, default: 0 },
  
  notes: { type: String, default: '' },
  
  rating: { type: Number, min: 1, max: 5, default: null },
  review: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
