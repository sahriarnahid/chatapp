# Chat App

A real-time chat application built with React, Node.js, Express, Socket.io, and MongoDB.

## Features

- 🔐 User authentication (signup/login)
- 💬 Real-time messaging
- 👥 Friend requests system
- 🟢 Online/offline status
- 📷 Profile picture uploads (Cloudinary)
- 🎨 Multiple themes
- 📱 Responsive design

## Tech Stack

### Frontend

- React 18
- Vite
- Zustand (state management)
- Socket.io-client
- Axios
- TailwindCSS + DaisyUI
- React Router

### Backend

- Node.js + Express
- Socket.io
- MongoDB + Mongoose
- JWT authentication
- Cloudinary (image uploads)
- bcryptjs (password hashing)

## Local Development Setup

### Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for profile pictures)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd chatapp
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Setup Frontend**

   ```bash
   cd frontend
   npm install
   ```

4. **Configure Environment Variables**

   Edit `backend/.env`:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   NODE_ENV=development
   PORT=5001
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the Application**

   Terminal 1 (Backend):

   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001/api

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
chatapp/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── lib/            # Utilities (DB, Socket.io, etc.)
│   ├── index.js            # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   └── lib/            # Utilities
│   └── package.json
└── README.md
```

## API Endpoints

### Auth

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check auth status
- `PUT /api/auth/update-profile` - Update profile picture

### Messages

- `GET /api/messages/users` - Get all users for sidebar
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user

### Friends

- `POST /api/friends/request/:id` - Send friend request
- `POST /api/friends/accept/:id` - Accept friend request
- `POST /api/friends/reject/:id` - Reject friend request
- `GET /api/friends` - Get all friends

## Socket.io Events

### Client → Server

- `send_friend_request` - Send friend request
- `accept_friend_request` - Accept friend request
- `sendMessage` - Send chat message

### Server → Client

- `getOnlineUsers` - Receive online users list
- `receive_friend_request` - Receive friend request
- `friend_request_accepted` - Friend request accepted
- `receiveMessage` - Receive chat message

## License

ISC

## Author

Nadeen Menacy
