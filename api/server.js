// api/server.js - Vercel Serverless Handler for Express App
const serverless = require('serverless-http');
const app = require('../server'); // يشير لـ server.js في الـ root

// Wrap the Express app with serverless-http
const handler = serverless(app, {
  // Optional: Custom options (مش ضروري دلوقتي)
  // binary: ['*/*'], // لو عايزة تدعمي binary files زي images
  request: (req, event, context) => {
    // يمكن تضيفي custom logic هنا لو لزم الأمر (مثل logging)
    // console.log('Incoming request:', req.method, req.url);
  },
});

// Export the handler
module.exports = handler;
// أو module.exports.handler = handler; لو حابة