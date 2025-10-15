# 🚀 SpiceWyn Quick Start Guide

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** running locally OR MongoDB Atlas account
- **Git** - [Download](https://git-scm.com/)

---

## ⚡ Quick Setup (Windows)

### 1️⃣ Run Initial Setup

Double-click or run:
```bash
setup.bat
```

This will:
- ✅ Check Node.js and MongoDB
- ✅ Install all dependencies (backend & frontend)
- ✅ Create `.env` file in backend folder

### 2️⃣ Configure Environment

**Generate JWT Secrets:**
```bash
generate-secrets.bat
```
Copy the generated secrets and paste them into `backend\.env`

**Edit `backend\.env`:**
```env
# Required - Update these:
MONGO_URI=mongodb://localhost:27017/spicewyn
JWT_SECRET=<paste-generated-secret-here>
JWT_REFRESH_SECRET=<paste-generated-secret-here>

# Optional (configure when needed):
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3️⃣ Start Development Servers

**Option A: Start Both Servers (Recommended)**
```bash
start-all.bat
```
Opens 2 windows - Backend (port 5000) & Frontend (port 5173)

**Option B: Start Individually**
```bash
start-backend.bat    # Backend only
start-frontend.bat   # Frontend only
```

### 4️⃣ Stop Servers

To stop all running servers:
```bash
stop-all.bat
```

---

## 📡 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000 (shows all endpoints)
- **Health Check**: http://localhost:5000/health

---

## 📁 Batch Files Reference

| File | Purpose |
|------|---------|
| `setup.bat` | Initial setup - install dependencies |
| `start-all.bat` | Start both backend & frontend |
| `start-backend.bat` | Start backend only |
| `start-frontend.bat` | Start frontend only |
| `stop-all.bat` | Stop all servers |
| `generate-secrets.bat` | Generate JWT secrets |

---

## 🗄️ MongoDB Setup

### Local MongoDB

1. Start MongoDB service:
```bash
net start MongoDB
```

2. Verify it's running:
```bash
mongosh
```

3. Use in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/spicewyn
```

### MongoDB Atlas (Cloud)

1. Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user
3. Whitelist your IP (0.0.0.0/0 for development)
4. Get connection string
5. Update `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/spicewyn?retryWrites=true&w=majority
```

---

## 🔧 Optional Services

### Cloudinary (Image Uploads)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard
3. Add to `backend\.env`

### Stripe (Payments)
1. Sign up at [stripe.com](https://stripe.com)
2. Get test API keys from Dashboard
3. Add to `backend\.env`

### Email (OTP/Notifications)
1. Use Gmail with App Password
2. Enable 2FA on Gmail
3. Generate App Password
4. Add to `backend\.env`

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB service is running: `net start MongoDB`
- Verify connection string in `.env`

### Port Already in Use
- Run `stop-all.bat` to kill existing processes
- Or manually change ports in backend/.env and frontend/vite.config.js

### Dependencies Not Found
- Delete `node_modules` folders
- Run `setup.bat` again

### Frontend Build Errors
- Clear cache: delete `frontend\node_modules\.vite` folder
- Restart frontend server

---

## 📚 Project Structure

```
spice-wyn/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, error handling
│   │   └── utils/        # Helper functions
│   ├── .env             # Environment variables
│   └── package.json
│
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand state
│   │   ├── services/    # API calls
│   │   └── utils/       # Helper functions
│   └── package.json
│
└── *.bat               # Setup scripts
```

---

## 🎯 Next Steps

1. ✅ Run `setup.bat`
2. ✅ Configure `backend\.env`
3. ✅ Run `start-all.bat`
4. ✅ Open http://localhost:5173
5. 🎉 Start building your e-commerce store!

---

## 📞 Need Help?

- Check `SETUP.md` for detailed instructions
- Review backend logs in the backend terminal window
- Review frontend logs in the frontend terminal window
- Check browser console for frontend errors (F12)

---

**Happy Coding! 🚀**
