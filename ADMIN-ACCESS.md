# 🔐 SpiceWyn Admin Panel Access Guide

## 📋 Quick Access

### Admin Panel URL
```
http://localhost:5173/admin
```

---

## 👤 Demo Admin Accounts

After seeding the database, you can login with these accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Super Admin** | super@spicewyn.test | Password123! | Full access to all features |
| **Admin** | admin@spicewyn.test | Password123! | Full admin access |
| **Staff** | staff@spicewyn.test | Password123! | Limited admin access |
| **Customer** | customer@spicewyn.test | Password123! | No admin access |

---

## 🚀 How to Access Admin Panel

### Step 1: Seed the Database (First Time Only)

Run this to create demo users and sample data:

```bash
seed-database.bat
```

**Or manually:**
```bash
cd backend
npm run seed
```

This will create:
- ✅ 4 demo users (including admin accounts)
- ✅ 5 product categories
- ✅ 12 sample products
- ✅ 2 promotional banners
- ✅ 3 discount coupons
- ✅ Site settings

### Step 2: Start Both Servers

```bash
start-all.bat
```

### Step 3: Open Frontend

Visit: **http://localhost:5173**

### Step 4: Login with Admin Account

1. Click **"Login"** in the top navigation
2. Enter admin credentials:
   - **Email:** `admin@spicewyn.test`
   - **Password:** `Password123!`
3. Click **"Login"**

### Step 5: Access Admin Panel

After login, you can access admin panel in two ways:

**Option A:** Navigate directly to:
```
http://localhost:5173/admin
```

**Option B:** Look for "Admin" link in the user dropdown menu (after logging in as admin)

---

## 📊 Admin Panel Features

Once logged in, you'll have access to:

### 🏠 **Dashboard** (`/admin`)
- Sales overview and analytics
- Recent orders
- Low stock alerts
- Customer statistics

### 🛍️ **Products** (`/admin/products`)
- View all products
- Add/Edit/Delete products
- Manage stock levels
- Set featured/bestseller products

### 📦 **Orders** (`/admin/orders`)
- View all orders
- Update order status
- Track shipments
- Manage refunds

### 👥 **Customers** (`/admin/customers`)
- View all customers
- Manage user accounts
- Block/Unblock users
- View order history

### 📂 **Categories** (`/admin/categories`)
- Create/Edit/Delete categories
- Manage category images
- Set category order
- SEO settings

### 🎟️ **Coupons** (`/admin/coupons`)
- Create discount coupons
- Set expiry dates
- Usage limits
- User segment targeting

### 🎨 **Banners** (`/admin/banners`)
- Create promotional banners
- Upload images
- Set display order
- Manage placements

### 🎫 **Support Tickets** (`/admin/tickets`)
- View customer tickets
- Reply to inquiries
- Change ticket status
- Assign to staff

### ⚙️ **Settings** (`/admin/settings`)
- Site configuration
- Payment settings
- Shipping settings
- Email templates

### 💾 **Backup** (`/admin/backup`)
- Database backup
- Export data
- Import data
- Scheduled backups

---

## 🔒 Access Control

### Role Permissions

| Feature | Super Admin | Admin | Staff | Customer |
|---------|-------------|-------|-------|----------|
| Dashboard | ✅ | ✅ | ✅ | ❌ |
| Products | ✅ | ✅ | ✅ | ❌ |
| Orders | ✅ | ✅ | ✅ | ❌ |
| Customers | ✅ | ✅ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ |
| Backup | ✅ | ❌ | ❌ | ❌ |

### Authentication Flow

1. User must be logged in
2. User role must be `admin`, `super_admin`, or `staff`
3. If not authenticated → Redirected to `/login`
4. If not admin → Redirected to `/` (home page)

---

## 🎯 Creating New Admin Users

### Method 1: Register & Manually Update Database

1. Register a new user through the frontend
2. Open MongoDB Compass
3. Find the user in the `users` collection
4. Change `role` field from `customer` to `admin` or `staff`
5. Save changes
6. User can now access admin panel

### Method 2: Using MongoDB Shell

```javascript
// Connect to MongoDB
mongosh

// Switch to database
use spicewyn

// Update user role
db.users.updateOne(
  { email: "newemail@example.com" },
  { $set: { role: "admin", isVerified: true, isActive: true } }
)
```

### Method 3: Create Admin via Backend API (Recommended for Production)

You should create an admin registration endpoint with proper security checks.

---

## 🐛 Troubleshooting

### "Access Denied" or Redirected to Login

**Problem:** Not logged in or not an admin user

**Solution:**
1. Make sure you're logged in
2. Verify you're using an admin account (not customer account)
3. Check browser console for errors (F12)

### "Cannot Access Admin Panel"

**Problem:** User role is not set correctly

**Solution:**
1. Run `seed-database.bat` to create demo admin users
2. Or manually update user role in MongoDB

### Database Not Seeded

**Problem:** No demo users exist

**Solution:**
```bash
seed-database.bat
```

### Login Not Working

**Problem:** JWT secrets not configured

**Solution:**
1. Run `generate-secrets.bat`
2. Update `backend\.env` with generated secrets
3. Restart backend server

---

## 🔐 Security Best Practices

### For Production:

1. **Change Default Passwords**
   - Never use demo passwords in production
   - Use strong, unique passwords (16+ characters)

2. **Remove Seed Data**
   - Delete demo accounts before going live
   - Create real admin accounts with secure credentials

3. **Protect Admin Routes**
   - Add IP whitelisting for admin panel
   - Enable 2FA for admin accounts
   - Use HTTPS only

4. **Monitor Access**
   - Log all admin actions
   - Set up alerts for suspicious activity
   - Regular security audits

---

## 📞 Need Help?

- Check backend logs for API errors
- Check frontend console (F12) for client errors
- Verify MongoDB connection
- Ensure both servers are running

---

## 🎉 Quick Start Checklist

- [ ] Run `seed-database.bat`
- [ ] Run `start-all.bat`
- [ ] Open http://localhost:5173
- [ ] Login with `admin@spicewyn.test` / `Password123!`
- [ ] Navigate to http://localhost:5173/admin
- [ ] Start managing your store!

---

**Happy Managing! 🚀**
