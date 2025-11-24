# Deployment Guide

## Deploying to Vercel

While Vercel is primarily designed for frontend applications, you can deploy the backend API of this travel planner app to Vercel using Serverless Functions.

### Backend Deployment to Vercel

1. Create a `vercel.json` file in the server directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "index.js"
       }
     ]
   }
   ```

2. Update the server code to work with Vercel's serverless environment:
   - Modify the database connection to use a MongoDB Atlas cluster
   - Update environment variables in Vercel dashboard

3. Deploy to Vercel:
   - Install Vercel CLI: `npm install -g vercel`
   - Login to Vercel: `vercel login`
   - Deploy: `vercel --prod`

### Frontend Deployment

For the mobile app, Vercel is not the ideal platform. Instead, you should:

1. Build the app for production:
   ```bash
   cd client
   npx react-native build-android
   # or for iOS
   npx react-native build-ios
   ```

2. Deploy to app stores:
   - Google Play Store for Android
   - Apple App Store for iOS

### Alternative: Deploy Frontend to Vercel as Web App

If you want to deploy the frontend as a web application to Vercel:

1. Add a `vercel.json` file to the client directory:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. Create a build script in package.json:
   ```json
   "scripts": {
     "build": "react-scripts build"
   }
   ```

3. Deploy using Vercel CLI:
   ```bash
   vercel --prod
   ```

Note: This will deploy the app as a web application, not a native mobile app.