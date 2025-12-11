import dbConnect from '../models/DB.js';
import projectsRoute from './projects.route.js';
import employeeRoute from './employee.route.js';
import newsRoute from './news.route.js';
import settingsRoute from './settings.route.js';
// أضف باقي الروتس لو فيه

import express from 'express';
const app = express();
app.use(express.json());

await dbConnect(); // مهم جدًا

app.use('/projects', projectsRoute);
app.use('/employee', employeeRoute);
app.use('/news', newsRoute);
app.use('/settings', settingsRoute);
// أضف الباقي

// Vercel handler
export default async function handler(req, res) {
  // كل الطلبات هتيجي هنا وExpress هيتعامل معاها
  app(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
