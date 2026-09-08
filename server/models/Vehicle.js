const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nickname: { type: String, trim: true },
  make: { type: String, required: true },        // e.g. "Toyota"
  model: { type: String, required: true },       // e.g. "Fortuner"
  year: { type: Number },
  licensePlate: { type: String, required: true, uppercase: true },
  color: { type: String },
  type: { type: String, enum: ['sedan', 'suv', 'hatchback', 'truck', 'van', 'other'], default: 'sedan' },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
