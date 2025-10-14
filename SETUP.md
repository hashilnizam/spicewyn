# 🚀 SpiceWyn Setup Guide

Complete step-by-step guide to set up and run the SpiceWyn e-commerce platform.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** (comes with Node.js)

## 🛠️ Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/spicewyn.git
cd spicewyn
```

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```env
# Required Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB (Required)
MONGO_URI=mongodb://localhost:27017/spicewyn
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/spicewyn

# JWT Secrets (Required - Change these!)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Required for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=SpiceWyn <noreply@spicewyn.com>

# Optional: Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional: Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-key

# Optional: Google Drive (for backups)
GOOGLE_DRIVE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-client-secret
GOOGLE_DRIVE_REFRESH_TOKEN=your-refresh-token
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
```

5. Seed the database with demo data:
```bash
npm run seed
```

This will create:
- Demo users (super admin, admin, staff, customer)
- 12 sample products
- Categories
- Banners
- Coupons
- Settings

6. Start the backend server:
```bash
npm run dev
```

Backend should now be running on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SpiceWyn
```

5. Start the frontend development server:
```bash
npm run dev
```

Frontend should now be running on `http://localhost:5173`

## 🎉 Access the Application

### Storefront (Customer Side)
Open your browser and go to: `http://localhost:5173`

### Admin Panel
Login with any admin credentials and navigate to: `http://localhost:5173/admin`

### Demo Accounts

Use these credentials to test different roles:

**Super Admin:**
- Email: `super@spicewyn.test`
- Password: `Password123!`
- Access: Full admin panel + backup management

**Admin:**
- Email: `admin@spicewyn.test`
- Password: `Password123!`
- Access: Full admin panel (except backup)

**Staff:**
- Email: `staff@spicewyn.test`
- Password: `Password123!`
- Access: Limited admin panel

**Customer:**
- Email: `customer@spicewyn.test`
- Password: `Password123!`
- Access: Storefront only

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**
- Ensure MongoDB is running locally: `mongod`
- OR use MongoDB Atlas cloud database
- Check `MONGO_URI` in `.env` file

### Issue: Port Already in Use

**Solution:**
```bash
# Change PORT in backend/.env to a different port (e.g., 5001)
PORT=5001

# Update VITE_API_URL in frontend/.env accordingly
VITE_API_URL=http://localhost:5001/api
```

### Issue: Email/OTP Not Working

**Solution:**
- For Gmail, enable "Less secure app access" or use App Password
- Check EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD in `.env`
- For testing, check server console for OTP code

### Issue: Images Not Uploading

**Solution:**
- Sign up for free Cloudinary account
- Add credentials to `.env` file
- OR use local file storage (requires code modification)

## 🐳 Docker Setup (Alternative)

If you prefer Docker:

```bash
# Make sure Docker is installed and running

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access:
- Frontend: `http://localhost`
- Backend: `http://localhost:5000`

## 📦 Production Deployment

### Backend Deployment (e.g., Render, Heroku)

1. Set environment variables on hosting platform
2. Ensure `NODE_ENV=production`
3. Deploy from GitHub repository

### Frontend Deployment (e.g., Vercel, Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy `dist` folder
3. Set environment variable `VITE_API_URL` to your backend URL

### Database (MongoDB Atlas)

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGO_URI` in backend `.env`

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📚 Next Steps

1. **Customize Branding**: Update colors in `frontend/tailwind.config.js`
2. **Add Products**: Use admin panel or bulk import CSV
3. **Configure Payments**: Add Stripe keys for live payments
4. **Set Up Email**: Configure production email service
5. **Enable Backups**: Set up Google Drive API for automated backups
6. **SEO Optimization**: Update meta tags in admin settings

## 🆘 Getting Help

- **Documentation**: Check README.md
- **Issues**: Create an issue on GitHub
- **Email**: support@spicewyn.com

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can login with demo credentials
- [ ] Products display on homepage
- [ ] Can add items to cart
- [ ] Admin panel accessible
- [ ] Database seeded with demo data

---

**You're all set! 🎊 Start building your e-commerce empire!**
