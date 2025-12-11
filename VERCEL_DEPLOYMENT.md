# Vercel Deployment Guide

This project is configured for deployment on Vercel as a serverless API.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas cluster (or your MongoDB connection string)
3. Cloudinary account (for image uploads)

## Environment Variables

Add the following environment variables in your Vercel dashboard:

### Required Variables

- `MONGODB_URI`: Your MongoDB Atlas connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
  
- `SESSION_SECRET`: A random secret string for session encryption
  - Generate one: `openssl rand -base64 32`

### Optional Variables

- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `FRONTEND_URL`: Your frontend URL for CORS (e.g., `https://yourdomain.com`)
  - If not set, CORS will allow all origins (`*`)
- `NODE_ENV`: Set to `production` (automatically set by Vercel)

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository

2. Go to https://vercel.com/new

3. Import your GitHub repository

4. Vercel will automatically detect the configuration

5. Add environment variables in the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all required variables

6. Deploy!

## Project Structure

- `server.js`: Main Express application
- `api/server.js`: Vercel serverless handler (entry point for Vercel)
- `vercel.json`: Vercel configuration file
- `package.json`: Dependencies and scripts

## Important Notes

1. **Database Connections**: The MongoDB connection is cached globally to work efficiently in serverless environments. Connections are reused across function invocations.

2. **Sessions**: Sessions are stored in MongoDB using `connect-mongo`. Make sure your MongoDB connection string is correct.

3. **File Uploads**: File uploads are handled via Cloudinary. Images are not stored on Vercel's filesystem (which is read-only).

4. **Static Files**: Static files in the `public` folder are served via Vercel's CDN.

5. **Cold Starts**: The first request after inactivity may be slower due to serverless cold starts. Subsequent requests will be faster.

## Testing Locally

To test the serverless setup locally:

```bash
npm install
npm run dev
```

The app will run on `http://localhost:3003` (or the PORT specified in your .env).

## Troubleshooting

### Connection Issues

- Verify `MONGODB_URI` is correctly set in Vercel dashboard
- Check MongoDB Atlas IP whitelist (allow all IPs: `0.0.0.0/0` for testing)
- Ensure MongoDB Atlas cluster is running

### Session Issues

- Verify `SESSION_SECRET` is set
- Check that `secure` cookie setting works with HTTPS (automatically handled by Vercel)

### CORS Issues

- Set `FRONTEND_URL` environment variable to your frontend domain
- Or update CORS configuration in `server.js`

## Support

For issues specific to Vercel deployment, check:
- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions


