# ⚠️ IMPORTANT: Environment Variables Required

This application requires environment variables to be configured for production deployment.

## Frontend Environment Variables

**REQUIRED** for production builds:

### `VITE_API_URL`

- **Description**: Full URL to your backend API (must end with `/api`)
- **Example**: `https://my-chatapp-backend.onrender.com/api`
- **Where to set**:
  - **Vercel**: Dashboard → Project Settings → Environment Variables
  - **Netlify**: Site Settings → Build & deploy → Environment
  - **Local Production Test**: Create `frontend/.env.production` file

**Without this variable set, the frontend will fail to connect to the backend in production!**

---

## Backend Environment Variables

**REQUIRED** for backend to run:

### `MONGODB_URI`

- MongoDB connection string
- Get from MongoDB Atlas

### `JWT_SECRET`

- Secret key for JWT tokens
- Generate: `openssl rand -base64 32`

### `CLOUDINARY_CLOUD_NAME`

### `CLOUDINARY_API_KEY`

### `CLOUDINARY_API_SECRET`

- For profile picture uploads
- Get from cloudinary.com dashboard

### `FRONTEND_URL`

- Your deployed frontend URL (for CORS)
- Example: `https://my-chatapp.vercel.app`

### `NODE_ENV`

- Set to `production` for deployed environments

### `PORT`

- Port number (usually auto-set by hosting platform)

---

## Quick Setup

### Backend (.env)

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
```

### Frontend (for local production test)

```bash
cp frontend/.env.example frontend/.env.production
# Set VITE_API_URL to your backend URL
```

---

## Testing Before Deployment

### Test backend locally:

```bash
cd backend
NODE_ENV=production npm start
```

### Test frontend production build locally:

```bash
cd frontend
VITE_API_URL=http://localhost:5001/api npm run build
npm run preview
```

This ensures everything works before deploying to production.
