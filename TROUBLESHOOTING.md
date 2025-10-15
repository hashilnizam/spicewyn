# 🔧 SpiceWyn Troubleshooting Guide

## 🔐 Login Not Working

### Symptoms
- Login button does nothing
- "Invalid email or password" error
- Getting redirected back to login
- Blank screen after login

### Quick Fix

Run this automated troubleshooter:
```bash
fix-login.bat
```

This will check and fix:
- ✅ Backend server running
- ✅ Frontend server running  
- ✅ Database seeded with users
- ✅ JWT secrets configured

---

## 🎯 Common Issues & Solutions

### Issue 1: "Invalid email or password"

**Cause:** Database is not seeded - no users exist

**Solution:**
```bash
seed-database.bat
```

This creates demo users:
- Email: `admin@spicewyn.test`
- Password: `Password123!`

---

### Issue 2: Login button does nothing / No response

**Cause:** Backend server not running

**Check:**
```bash
curl http://localhost:5000/health
```

**Solution:**
```bash
start-backend.bat
```

---

### Issue 3: "Network Error" or "Cannot connect"

**Cause:** Frontend cannot reach backend API

**Check:**
1. Backend running on port 5000
2. Frontend running on port 5173
3. CORS configured correctly

**Solution:**
```bash
start-all.bat
```

---

### Issue 4: "JWT malformed" or "Token invalid"

**Cause:** JWT secrets not properly configured

**Solution:**
```bash
generate-secrets.bat
```

Then copy the generated secrets to `backend\.env`:
```env
JWT_SECRET=<paste-generated-secret>
JWT_REFRESH_SECRET=<paste-generated-secret>
```

Restart backend server after updating.

---

### Issue 5: Login successful but redirected back

**Cause:** Token not being saved or user role issue

**Solution:**

1. Open browser console (F12)
2. Check for errors
3. Clear browser storage:
   - Right-click → Inspect → Application tab
   - Clear Storage → Clear site data
4. Try logging in again

---

### Issue 6: MongoDB connection error

**Error:** `MongooseServerSelectionError`

**Cause:** MongoDB not running

**Solution:**
```bash
net start MongoDB
```

Or check if MongoDB service is installed:
```bash
mongosh
```

If not installed, download from: https://www.mongodb.com/try/download/community

---

### Issue 7: Port already in use

**Error:** `EADDRINUSE` or port 5000/5173 already in use

**Solution:**
```bash
stop-all.bat
```

Then start again:
```bash
start-all.bat
```

---

## 📋 Complete Reset (Nuclear Option)

If nothing works, do a complete reset:

### Step 1: Stop all servers
```bash
stop-all.bat
```

### Step 2: Clear node_modules (optional)
```bash
cd backend
rmdir /s /q node_modules
cd ..\frontend
rmdir /s /q node_modules
cd ..
```

### Step 3: Run first-time setup
```bash
first-time-setup.bat
```

This will:
- ✅ Install all dependencies
- ✅ Configure environment
- ✅ Generate JWT secrets
- ✅ Seed database
- ✅ Start servers

---

## 🔍 Debug Checklist

Use this checklist to debug login issues:

```
□ MongoDB is running (mongosh works)
□ Backend server is running (http://localhost:5000)
□ Frontend server is running (http://localhost:5173)
□ backend\.env file exists
□ JWT_SECRET is set in .env (not default value)
□ MONGO_URI points to correct database
□ Database is seeded (users exist)
□ No errors in backend terminal
□ No errors in frontend terminal
□ No errors in browser console (F12)
□ Browser localStorage has no stale tokens
```

---

## 🧪 Test Login Manually

### 1. Test Backend API directly

```powershell
# Test if backend is reachable
curl http://localhost:5000/health

# Test login endpoint
curl http://localhost:5000/api/auth/login -Method POST -Body '{"email":"admin@spicewyn.test","password":"Password123!"}' -ContentType "application/json"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "accessToken": "..."
  }
}
```

### 2. Check MongoDB for users

```bash
mongosh
use spicewyn
db.users.find({ email: "admin@spicewyn.test" })
```

Should return admin user object.

### 3. Check browser console

Open DevTools (F12) → Console tab
Look for:
- ❌ Network errors (404, 500, CORS)
- ❌ JavaScript errors
- ❌ Failed API calls

---

## 📞 Still Having Issues?

### Check Log Files

**Backend logs:**
- Check the backend terminal window for errors
- Look for database connection errors
- Look for JWT errors

**Frontend logs:**
- Open browser console (F12)
- Check Network tab for failed requests
- Look for 401/403/500 errors

### Verify Configuration

**Backend `.env`:**
```env
MONGO_URI=mongodb://localhost:27017/spicewyn  # ✓ Correct
JWT_SECRET=<long-random-string>                # ✓ Should be 128 chars
JWT_REFRESH_SECRET=<different-long-string>     # ✓ Should be 128 chars
```

**Frontend API connection:**
- Should proxy to `http://localhost:5000`
- Check `frontend\vite.config.js` proxy settings

---

## 🎯 Quick Reference Commands

| Issue | Command |
|-------|---------|
| Fix login automatically | `fix-login.bat` |
| Complete first-time setup | `first-time-setup.bat` |
| Seed database | `seed-database.bat` |
| Generate JWT secrets | `generate-secrets.bat` |
| Start both servers | `start-all.bat` |
| Start backend only | `start-backend.bat` |
| Start frontend only | `start-frontend.bat` |
| Stop all servers | `stop-all.bat` |

---

## 📚 Related Documentation

- `QUICK-START.md` - Getting started guide
- `ADMIN-ACCESS.md` - Admin panel access guide
- `SETUP.md` - Detailed setup instructions

---

**Last Resort:** Run `first-time-setup.bat` for a complete fresh setup! 🚀
