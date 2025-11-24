# Travel Planner App

A mobile application that allows users to save and plan their favorite travel places.

## Features

- User authentication (login/register)
- Save places with name, category, description, and location
- View places on a map
- List view with filtering and sorting
- Mark places as favorites or visited
- Clean, modern UI design

## Tech Stack

### Frontend (Client)
- React Native
- React Navigation
- React Native Maps
- Async Storage for local data storage

### Backend (Server)
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- React Native development environment set up

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/travelapp
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React Native development server:
   ```
   npm start
   ```

4. Run on Android or iOS:
   ```
   npm run android
   # or
   npm run ios
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Places
- `GET /api/places` - Get all places for user (protected)
- `GET /api/places/location?country=&city=` - Get places by location (protected)
- `GET /api/places/:id` - Get place by ID (protected)
- `POST /api/places` - Create new place (protected)
- `PUT /api/places/:id` - Update place (protected)
- `DELETE /api/places/:id` - Delete place (protected)
- `PATCH /api/places/:id/favorite` - Toggle favorite status (protected)
- `PATCH /api/places/:id/visited` - Toggle visited status (protected)

## Deployment

### Backend Deployment
The backend can be deployed to any Node.js hosting platform like:
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

### Frontend Deployment
The mobile app can be built and deployed to:
- Google Play Store
- Apple App Store

## Future Enhancements

- Image upload for places
- Offline support
- Social sharing features
- Advanced search and filtering
- Trip planning functionality
- Integration with external APIs (weather, reviews, etc.)

## License

This project is licensed under the MIT License.