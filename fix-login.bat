@echo off
title Fix SpiceWyn Login Issues
echo ========================================
echo    SpiceWyn Login Troubleshooting
echo ========================================
echo.

echo Checking common login issues...
echo.

REM Check 1: Backend server running
echo [1/4] Checking if backend is running...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend server is running on port 5000
) else (
    echo ✗ Backend server is NOT running!
    echo.
    echo SOLUTION: Run start-backend.bat in a new terminal
    echo.
    pause
    exit /b 1
)
echo.

REM Check 2: Frontend server running
echo [2/4] Checking if frontend is running...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Frontend server is running on port 5173
) else (
    echo ✗ Frontend server is NOT running!
    echo.
    echo SOLUTION: Run start-frontend.bat in a new terminal
    echo.
    pause
    exit /b 1
)
echo.

REM Check 3: Test login with demo credentials
echo [3/4] Testing login with demo credentials...
curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@spicewyn.test\",\"password\":\"Password123!\"}" > temp_response.txt 2>&1

findstr /C:"success" temp_response.txt >nul
if %errorlevel% equ 0 (
    findstr /C:"\"success\":true" temp_response.txt >nul
    if %errorlevel% equ 0 (
        echo ✓ Login API is working correctly
        del temp_response.txt
    ) else (
        echo ✗ Login failed - Database not seeded!
        del temp_response.txt
        echo.
        echo SOLUTION: You need to seed the database first
        echo.
        choice /C YN /M "Do you want to seed the database now"
        if errorlevel 2 goto :end
        
        echo.
        echo Seeding database...
        cd backend
        call npm run seed
        cd ..
        echo.
        echo ✓ Database seeded successfully!
        echo.
    )
) else (
    echo ✗ Cannot connect to backend API
    del temp_response.txt
)
echo.

REM Check 4: JWT secrets configured
echo [4/4] Checking JWT configuration...
cd backend
findstr /C:"JWT_SECRET=your-super-secret" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo ✗ JWT secrets not configured properly!
    echo.
    echo SOLUTION: Run generate-secrets.bat and update .env file
    echo.
    cd ..
    pause
    exit /b 1
) else (
    echo ✓ JWT secrets appear to be configured
)
cd ..
echo.

echo ========================================
echo       All Checks Complete!
echo ========================================
echo.
echo ✓ Backend: http://localhost:5000
echo ✓ Frontend: http://localhost:5173
echo ✓ Database: Seeded with demo users
echo.
echo Login Credentials:
echo ------------------
echo Email: admin@spicewyn.test
echo Password: Password123!
echo.
echo Try logging in at: http://localhost:5173/login
echo.
pause

:end
