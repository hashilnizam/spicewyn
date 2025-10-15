@echo off
echo ========================================
echo    SpiceWyn E-Commerce Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/6] Node.js version:
node --version
echo.

REM Check if MongoDB is running
echo [2/6] Checking MongoDB connection...
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB is not running or not installed!
    echo Please start MongoDB service: net start MongoDB
    echo Or install MongoDB from https://www.mongodb.com/try/download/community
    echo.
    choice /C YN /M "Continue anyway"
    if errorlevel 2 exit /b 1
)
echo MongoDB is running!
echo.

REM Install backend dependencies
echo [3/6] Installing backend dependencies...
cd backend
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies!
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)
echo.

REM Setup backend .env file
echo [4/6] Setting up backend environment...
if not exist ".env" (
    copy .env.example .env
    echo [CREATED] backend\.env file
    echo.
    echo [IMPORTANT] Please configure backend\.env file with:
    echo   - MONGO_URI ^(if not using localhost^)
    echo   - JWT_SECRET and JWT_REFRESH_SECRET
    echo   - Cloudinary credentials ^(for image uploads^)
    echo   - Stripe keys ^(for payments^)
    echo   - Email settings ^(for OTP^)
    echo.
) else (
    echo backend\.env already exists
)
echo.

cd ..

REM Install frontend dependencies
echo [5/6] Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies!
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed
)
echo.

cd ..

echo [6/6] Setup complete!
echo.
echo ========================================
echo           Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure backend\.env with your settings
echo 2. Start the backend: start-backend.bat
echo 3. Start the frontend: start-frontend.bat
echo    ^(Or use start-all.bat to run both^)
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
pause
