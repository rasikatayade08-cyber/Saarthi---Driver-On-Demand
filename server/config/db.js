const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saarthi';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000, // Quick timeout for mock mode
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️   MongoDB offline: running seamlessly in Mock Data Mode`);
  }
};

module.exports = connectDB;
