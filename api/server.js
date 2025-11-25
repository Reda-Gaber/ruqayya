// api/server.js   ← ده الملف اللي هيشغّل Vercel كل حاجة
const serverless = require('serverless-http');
const app = require('../server'); // أو الملف اللي كان فيه الكود القديم كله (هنسميه server.js دلوقتي)

module.exports.handler = serverless(app);