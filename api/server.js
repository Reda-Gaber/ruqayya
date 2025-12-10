/**
 * Vercel Serverless Handler
 * This is the entry point for Vercel serverless functions
 * 
 * IMPORTANT: Make sure these environment variables are set in Vercel Dashboard:
 * - MONGODB_URI
 * - SESSION_SECRET
 * - CLOUDINARY_CLOUD_NAME (optional)
 * - CLOUDINARY_API_KEY (optional)
 * - CLOUDINARY_API_SECRET (optional)
 */
const serverless = require('serverless-http');
const app = require('../server');

// Create serverless handler
const handler = serverless(app, {
  binary: ['image/*', 'application/pdf', 'application/zip', 'application/octet-stream']
});

// Export for Vercel - Vercel looks for a default export
module.exports = handler;