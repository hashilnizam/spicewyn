# 🌶️ SpiceWyn - Full-Stack E-Commerce Platform

Premium spices e-commerce platform built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** - Browse products with advanced filtering, search, and sorting
- **Shopping Cart** - Persistent cart with real-time updates
- **OTP Checkout** - Guest checkout with mobile OTP verification
- **Order Tracking** - Real-time order status updates
- **Wishlist** - Save favorite products
- **Reviews & Ratings** - Customer reviews with verified purchase badges
- **Loyalty Points** - Earn and redeem points on purchases
- **Recently Viewed** - Track browsing history
- **Coupon System** - Apply discount coupons at checkout

### 👨‍💼 Admin Panel Features
- **Dashboard** - Sales analytics, revenue charts, top products
- **Product Management** - CRUD operations, bulk import/export, image upload
- **Order Management** - View, filter, update order status, refunds
- **Customer Management** - View customers, manage loyalty points
- **Category Management** - Nested categories and subcategories
- **Coupon Management** - Create and manage discount coupons
- **Banner Management** - Manage homepage and promotional banners
- **Support Tickets** - Customer support ticket system
- **SEO Tools** - Meta tags, JSON-LD, sitemap management
- **Settings** - Store configuration, payment, shipping, tax settings
- **Automated Backups** - Scheduled database backups to Google Drive
- **Global Search** - Search across products, orders, and customers
- **Light/Dark Mode** - Theme toggle for better UX

### 🔒 Security Features
- JWT authentication with refresh tokens
- Role-based access control (Customer, Staff, Admin, Super Admin)
- Password hashing with bcrypt
- Rate limiting
- Input sanitization
- Helmet security headers
- CORS protection

### 📱 Responsive Design
- Mobile-first approach
- Fully responsive on all devices
- Modern UI with TailwindCSS
- Smooth animations with Framer Motion
- Dark mode support

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **React Helmet Async** - SEO
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **Winston** - Logging
- **Node-cron** - Scheduled tasks

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/spicewyn.git
cd spicewyn
```

2. **Backend Setup**
```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Required: MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET

# Seed database with demo data
npm run seed

# Start development server
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env

# Edit .env with API URL
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

### Demo Credentials

After running the seed script, use these credentials:

**Super Admin:**
- Email: super@spicewyn.test
- Password: Password123!

**Admin:**
- Email: admin@spicewyn.test
- Password: Password123!

**Staff:**
- Email: staff@spicewyn.test
- Password: Password123!

**Customer:**
- Email: customer@spicewyn.test
- Password: Password123!

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Access:
- Frontend: http://localhost
- Backend: http://localhost:5000

## 📁 Project Structure

```
spicewyn/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   ├── seed/            # Database seeding
│   │   └── server.js        # Entry point
│   ├── logs/                # Application logs
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── lib/             # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                  # Run all tests
npm run test:watch       # Watch mode
```

### Frontend Tests
```bash
cd frontend
npm test                  # Run all tests
npm run test:watch       # Watch mode
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview          # Preview production build
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🌟 Key Features Explained

### OTP Checkout Flow
1. Guest users add items to cart
2. At checkout, enter mobile number
3. Receive OTP via email
4. Verify OTP to create account and place order

### Automated Backups
- Super admin can enable automatic backups (hourly/daily)
- Manual backup option available
- Backups stored on Google Drive
- View backup logs in admin panel

### Loyalty Points System
- Customers earn 1 point per ₹100 spent
- Points can be redeemed at checkout (max 10% discount)
- View points history in profile

### AI Product Recommendations
- Based on browsing history
- Related products on product pages
- "You might also like" sections

## 📝 API Documentation

### Authentication
```
POST /api/auth/register      - Register new user
POST /api/auth/login         - Login user
POST /api/auth/verify-otp    - Verify OTP
POST /api/auth/logout        - Logout user
GET  /api/auth/me            - Get current user
```

### Products
```
GET    /api/products         - Get all products
GET    /api/products/:slug   - Get product by slug
POST   /api/products         - Create product (admin)
PUT    /api/products/:id     - Update product (admin)
DELETE /api/products/:id     - Delete product (admin)
```

### Orders
```
POST /api/orders             - Create order
GET  /api/orders/my-orders   - Get user orders
GET  /api/orders/:id         - Get order details
POST /api/orders/:id/cancel  - Cancel order
```

For complete API documentation, import the Postman collection (coming soon).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the SpiceWyn Team

## 📞 Support

For support, email support@spicewyn.com or join our Discord community.

---

**Happy Coding! 🚀**
