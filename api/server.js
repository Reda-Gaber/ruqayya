/**
 * Vercel Serverless Handler
 * 
 * This file is the entry point for Vercel serverless functions.
 * It wraps the Express app with serverless-http to make it compatible with Vercel's serverless environment.
 * 
 * Environment variables required in Vercel dashboard:
 * - MONGODB_URI: Your MongoDB Atlas connection string
 * - SESSION_SECRET: Secret key for session encryption
 * - CLOUDINARY_CLOUD_NAME: Cloudinary cloud name (optional, if using Cloudinary)
 * - CLOUDINARY_API_KEY: Cloudinary API key (optional)
 * - CLOUDINARY_API_SECRET: Cloudinary API secret (optional)
 * - FRONTEND_URL: Your frontend URL for CORS (optional, defaults to '*')
 * - NODE_ENV: Set to 'production' for production environment
 */

const serverless = require('serverless-http');
const app = require('../server');

// Wrap the Express app with serverless-http
// This makes it compatible with Vercel's serverless function format
module.exports = serverless(app, {
  binary: ['image/*', 'application/pdf', 'application/zip'] // Handle binary responses
});