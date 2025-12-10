// models/DB.js
// MongoDB connection handler optimized for serverless environments (Vercel)
require('dotenv').config();

// Debug logs (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Loading environment variables...');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found ✓' : 'Missing ✗');
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined!');
  console.error('Please add it to your .env file (local) or Vercel environment variables (production).');
  // Don't exit in serverless - let the connection attempt fail gracefully
  if (require.main === module) {
    process.exit(1);
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
const mongoose = require('mongoose');

let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongooseInstance) => {
      console.log('Successfully connected to MongoDB Atlas');
      return mongooseInstance;
    }).catch((error) => {
      console.error('Failed to connect to MongoDB:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// Persist connection across hot reloads in development
global.mongoose = cached;

module.exports = dbConnect;