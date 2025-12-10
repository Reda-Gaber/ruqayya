// api/server.js - Vercel Serverless Handler
const serverless = require('serverless-http');
const app = require('../server'); // المسار للملف الرئيسي بتاعك (اللي بعتيه)

module.exports.handler = serverless(app, {
  request: (request, event, context) => {
    // Optional: Add any custom logic here if needed
  }
});