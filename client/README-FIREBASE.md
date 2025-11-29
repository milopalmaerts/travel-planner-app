# Firebase Setup Instructions

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter a project name (e.g., "travel-planner-app")
4. Accept the terms and conditions
5. Select whether you want to enable Google Analytics (optional)
6. Click "Create project"

## 2. Register Your App

1. In the Firebase Console, click the web icon (</>) to create a web app
2. Enter an app nickname (e.g., "travel-planner-client")
3. Optionally, set up Firebase Hosting
4. Click "Register app"
5. Copy the Firebase configuration object

## 3. Enable Authentication

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 4. Enable Firestore Database

1. In the Firebase Console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for development only)
4. Choose a location near you
5. Click "Enable"

## 5. Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the values from your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## 6. Run the Application

```bash
npm run dev
```

The app should now be connected to Firebase and ready to use!