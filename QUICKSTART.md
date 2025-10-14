# ⚡ SpiceWyn - Quick Start Guide

Get up and running in 5 minutes!

## 🎯 Prerequisites

- Node.js 18+ installed
- MongoDB running (local or Atlas)

## 🚀 Quick Setup

### 1️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2️⃣ Configure Environment

**Backend** (`backend/.env`):
```env
MONGO_URI=mongodb://localhost:27017/spicewyn
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3️⃣ Seed Database

```bash
cd backend
npm run seed
```

### 4️⃣ Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## ✅ Access the App

- **Storefront**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **Backend API**: http://localhost:5000

## 🔑 Demo Credentials

**Super Admin:**
- Email: `super@spicewyn.test`
- Password: `Password123!`

**Customer:**
- Email: `customer@spicewyn.test`
- Password: `Password123!`

## 🎉 You're Ready!

Start exploring:
1. Browse products on the storefront
2. Add items to cart and checkout
3. Login to admin panel
4. Create new products
5. Manage orders

## 📚 Next Steps

- Read [SETUP.md](./SETUP.md) for detailed setup
- Check [FEATURES.md](./FEATURES.md) for complete features list
- See [README.md](./README.md) for full documentation

---

**Need Help?** Check the documentation or create an issue on GitHub.
