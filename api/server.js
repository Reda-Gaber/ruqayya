// api/server.js - Vercel Serverless Handler
const serverless = require('serverless-http');
const app = require('../server');

module.exports.handler = serverless(app);