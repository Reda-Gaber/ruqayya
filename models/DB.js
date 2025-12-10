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
  // In serverless (Vercel), reuse existing connection if available
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 30000, // Increase to 30 seconds for slow connections
      connectTimeoutMS: 30000, // Connection timeout
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      w: 'majority',
      // Additional options for better connection stability
      heartbeatFrequencyMS: 10000,
      retryReads: true,
    };

    console.log('Attempting to connect to MongoDB...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✓ Successfully connected to MongoDB Atlas');
      cached.conn = mongooseInstance;
      return mongooseInstance;
    }).catch((error) => {
      console.error('✗ Failed to connect to MongoDB:', error.message);
      if (error.message.includes('authentication')) {
        console.error('  → Check your username and password in MONGODB_URI');
      } else if (error.message.includes('timeout')) {
        console.error('  → Check your network connection and MongoDB Atlas IP whitelist');
        console.error('  → In MongoDB Atlas: Network Access → Add IP Address → 0.0.0.0/0 (for testing)');
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('  → Check your MongoDB cluster hostname in MONGODB_URI');
      }
      cached.promise = null; // Reset promise on error
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