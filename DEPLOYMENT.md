# Chat App - Deployment Guide

## 🚀 Deployment Overview

This chat application consists of:

- **Frontend**: React + Vite (deploy to Vercel/Netlify)
- **Backend**: Node.js + Express + Socket.io (deploy to Render/Railway)
- **Database**: MongoDB Atlas (cloud)

---

## 📋 Pre-Deployment Checklist

### 🔐 Security (CRITICAL)

- [ ] **Rotate all credentials** if `.env` was ever committed to Git:
  - Change MongoDB password
  - Generate new JWT secret (`openssl rand -base64 32`)
  - Regenerate Cloudinary API keys
- [ ] Verify `.env` is in `.gitignore`
- [ ] Remove `.env` from Git history if needed:
  ```bash
  git rm --cached backend/.env
  git commit -m "Remove .env from tracking"
  ```

### ✅ Code Verification

- [x] Backend uses environment variables
- [x] Frontend uses `VITE_API_URL` for production
- [x] CORS configured with allowed origins
- [x] Cookie settings: `secure: true` in production
- [x] Socket.io configured properly

---

## 🎯 Option 1: Separate Deployments (Recommended)

### **Backend → Render**

1. **Create account** at [render.com](https://render.com)

2. **Create Web Service**:

   - Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**:

   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Deploy** and copy the backend URL (e.g., `https://chatapp-xyz.onrender.com`)

### **Frontend → Vercel**

1. **Create account** at [vercel.com](https://vercel.com)

2. **Import project** from GitHub

3. **Configure**:

   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variable**:

   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

5. **Deploy** ✅

---

## 🎯 Option 2: Single Service Deployment

Deploy everything to Render as one service (serves frontend from backend).

### **Steps**:

1. Update `backend/index.js` to serve frontend in production (already configured ✅)

2. Create build script in root `package.json`:

   ```json
   {
     "scripts": {
       "build": "cd frontend && npm install && npm run build",
       "start": "cd backend && npm install && npm start"
     }
   }
   ```

3. Deploy to Render:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Add all environment variables

---

## 🔧 Environment Variables Reference

### Backend (.env)

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_min_32_chars
NODE_ENV=production
PORT=5001
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (.env)

```bash
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🧪 Testing Production Build Locally

### Backend:

```bash
cd backend
NODE_ENV=production npm start
```

### Frontend:

```bash
cd frontend
npm run build
npm run preview
```

---

## 🐛 Common Deployment Issues

### Issue: "Login Failed" or Cookie Not Set

**Cause**: CORS or cookie settings  
**Fix**:

- Add frontend URL to `FRONTEND_URL` env var
- Ensure `credentials: true` in CORS
- Cookie must have `secure: true` in production

### Issue: "Cannot connect to backend"

**Cause**: Wrong `VITE_API_URL`  
**Fix**: Update environment variable with correct backend URL

### Issue: Socket.io not connecting

**Cause**: Different domains for HTTP and WebSocket  
**Fix**: Use same backend URL for both API and Socket.io

---

## 📊 Monitoring

- **Backend logs**: Check Render dashboard
- **Frontend errors**: Use Vercel Analytics or Sentry
- **Database**: MongoDB Atlas monitoring

---

## 🔄 Updating After Deployment

1. **Push to GitHub**
2. **Vercel**: Auto-deploys on push
3. **Render**: Auto-deploys on push (or manual deploy)

---

## 🆘 Support

If you encounter issues:

1. Check deployment logs
2. Verify environment variables
3. Test with Postman/curl
4. Check browser console for errors

---

## 📝 Post-Deployment Tasks

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test messaging
- [ ] Test friend requests
- [ ] Test profile picture upload
- [ ] Test real-time features (Socket.io)
- [ ] Verify mobile responsiveness
- [ ] Set up monitoring/alerts
