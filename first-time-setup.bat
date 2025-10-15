@echo off
title SpiceWyn First Time Setup
echo ========================================
echo    SpiceWyn Complete Setup Wizard
echo ========================================
echo.

echo This will set up your SpiceWyn store completely.
echo.
echo Steps:
echo 1. Install dependencies
echo 2. Configure environment
echo 3. Generate JWT secrets
echo 4. Seed database with demo data
echo 5. Start servers
echo.

choice /C YN /M "Continue with setup"
if errorlevel 2 exit /b 0

echo.
echo ========================================
echo Step 1: Installing Dependencies
echo ========================================
echo.

echo Installing backend dependencies...
cd backend
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo Failed to install backend dependencies!
        pause
        exit /b 1
    )
)
echo ✓ Backend dependencies installed
echo.

echo Installing frontend dependencies...
cd ..\frontend
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo Failed to install frontend dependencies!
        pause
        exit /b 1
    )
)
echo ✓ Frontend dependencies installed
echo.

cd ..

echo ========================================
echo Step 2: Configuring Environment
echo ========================================
echo.

cd backend
if not exist ".env" (
    copy .env.example .env
    echo ✓ Created backend\.env file
) else (
    echo ✓ backend\.env already exists
)
echo.

echo ========================================
echo Step 3: Generating JWT Secrets
echo ========================================
echo.

echo Generating secure JWT secrets...
node -e "const crypto = require('crypto'); const jwt = crypto.randomBytes(64).toString('hex'); const refresh = crypto.randomBytes(64).toString('hex'); const fs = require('fs'); let env = fs.readFileSync('.env', 'utf8'); env = env.replace(/JWT_SECRET=.*/g, 'JWT_SECRET=' + jwt); env = env.replace(/JWT_REFRESH_SECRET=.*/g, 'JWT_REFRESH_SECRET=' + refresh); env = env.replace(/MONGO_URI=.*/g, 'MONGO_URI=mongodb://localhost:27017/spicewyn'); fs.writeFileSync('.env', env); console.log('✓ JWT secrets generated and saved');"

if %errorlevel% equ 0 (
    echo ✓ JWT secrets configured successfully
) else (
    echo ✗ Failed to generate JWT secrets
    pause
    exit /b 1
)
echo.

echo ========================================
echo Step 4: Seeding Database
echo ========================================
echo.

echo Creating demo users and sample data...
call npm run seed

if %errorlevel% neq 0 (
    echo.
    echo ✗ Database seeding failed!
    echo Make sure MongoDB is running: net start MongoDB
    echo.
    pause
    exit /b 1
)

echo.
cd ..

echo ========================================
echo        Setup Complete! 🎉
echo ========================================
echo.
echo ✓ Dependencies installed
echo ✓ Environment configured
echo ✓ JWT secrets generated
echo ✓ Database seeded with demo data
echo.
echo ========================================
echo       Demo Login Credentials
echo ========================================
echo.
echo ADMIN LOGIN:
echo Email: admin@spicewyn.test
echo Password: Password123!
echo.
echo CUSTOMER LOGIN:
echo Email: customer@spicewyn.test
echo Password: Password123!
echo.
echo ========================================
echo        Next Steps
echo ========================================
echo.
echo 1. Start both servers:
echo    start-all.bat
echo.
echo 2. Open frontend:
echo    http://localhost:5173
echo.
echo 3. Login with admin credentials
echo.
echo 4. Access admin panel:
echo    http://localhost:5173/admin
echo.

choice /C YN /M "Do you want to start the servers now"
if errorlevel 2 goto :done

echo.
echo Starting servers...
start "SpiceWyn Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "SpiceWyn Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting in separate windows...
echo.

:done
echo.
echo Setup complete! Check the documentation:
echo - QUICK-START.md
echo - ADMIN-ACCESS.md
echo.
pause
