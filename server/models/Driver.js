const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, required: true, unique: true },
  licenseExpiry: { type: Date },
  experience: { type: Number, default: 0 }, // years
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  totalRides: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
  },
  documents: {
    aadhar: { type: String, default: '' },
    panCard: { type: String, default: '' },
    policeClearance: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
