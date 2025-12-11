// models/DB.js  أو  lib/mongodb.js  (غيّر المسار زي ما تحب)
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in Vercel Environment Variables');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and across serverless invocations in production.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,            // ده المهم عشان ميحصلش الـ error اللي شايفينه
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('MongoDB Connected Successfully');
        return mongooseInstance;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        cached.promise = null; // مهم عشان يحاول تاني في الطلب الجاي
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;