# AirBnb Clone

A full-stack Airbnb-style web application built with Node.js, Express, MongoDB, Passport.js, Cloudinary, and Mapbox.

Deployed: https://airbnb-jfx0.onrender.com

## Overview

This project is a rental listing app where users can:
- Register and log in
- Create, edit, and delete rental listings
- Upload images for listings via Cloudinary
- Add and remove reviews on listings
- View listing details with location information and map display

The application follows a modular MVC-style architecture with separate route, controller, model, and view layers.

## Architecture & Methodology

- **Express.js** for server and routing
- **EJS** templates for server-side rendered views
- **Mongoose** for MongoDB object modeling
- **Passport.js** with `passport-local-mongoose` for authentication
- **Joi** for request validation
- **connect-mongo** for persistent session storage
- **Cloudinary** for image uploads and storage
- **Mapbox** for geocoding and map rendering
- **Middleware** to enforce authentication, authorization, and error handling
- **Async wrapper** for centralized async error handling (`utils/wrapAsync.js`)

## Key Features

- User registration and login
- Session management with persistent MongoDB sessions
- Listing creation with image upload and geocoding
- Listing ownership authorization: only owners can edit/delete their own posts
- Review submission and deletion
- Global error handling with custom `ExpressError`
- Flash message support for UI feedback
- Mapbox geocoding for location coordinates

## Services Used

- **MongoDB**
  - Stores users, listings, reviews, and session data
  - Connected using `process.env.MONGO_URL`
- **Cloudinary**
  - Stores uploaded listing images
  - Configured via `CLOUD_NAME`, `CLOUD_API_KEY`, and `CLOUD_API_SECRET`
  - Uses `multer-storage-cloudinary` for direct upload handling
- **Passport.js**
  - Handles local authentication and password hashing
  - User model extends Passport-local via `passport-local-mongoose`
- **Mapbox**
  - Forward geocoding based on listing location
  - Map rendering on the frontend via `mapboxgl`
- **connect-mongo**
  - Stores Express session data in MongoDB for persistence
- **dotenv**
  - Loads environment variables during development

## Important Files

- `app.js` — main server entrypoint and middleware setup
- `cloudConfig.js` — Cloudinary upload configuration
- `schema.js` — Joi validation schemas for listings and reviews
- `middleware.js` — authentication and authorization middleware
- `routes/lists.js` — listing CRUD routes including upload handling
- `routes/reviews.js` — routes for review creation and deletion
- `routes/users.js` — registration, login, and logout routes
- `Models/List.js` — listing schema and review deletion middleware
- `Models/user.js` — user schema and authentication plugin
- `Models/review.js` — review schema
- `utils/ExpressError.js` — custom error class
- `utils/wrapAsync.js` — async error wrapper
- `controllers/list.js` — listing controller logic and Mapbox geocoding

## Setup Instructions

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with the following values:
   - `MONGO_URL`
   - `SECRET`
   - `CLOUD_NAME`
   - `CLOUD_API_KEY`
   - `CLOUD_API_SECRET`
   - `MAP_TOKEN`
   - `NODE_ENV=production` (optional for production)
4. Start the app:
   - `node app.js`
   - or `nodemon app.js`
5. Open `http://localhost:8080`

## Notes

- The app listens on port `8080`
- Listing image uploads are stored in the Cloudinary folder `airbnb_DEV`
- Route protection ensures only logged-in users can create or edit listings
- The owner of a listing is tracked in the `owner` field of the `List` model
- Deleted listings also trigger deletion of associated reviews

## Technical Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Passport.js
- Cloudinary
- Mapbox
- EJS
- Joi
- Multer
- connect-mongo
