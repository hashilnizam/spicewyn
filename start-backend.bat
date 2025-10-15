@echo off
title SpiceWyn Backend Server
echo ========================================
echo    Starting SpiceWyn Backend Server
echo ========================================
echo.

cd backend

REM Check if .env exists
if not exist ".env" (
    echo [ERROR] .env file not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [ERROR] Dependencies not installed!
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Starting backend server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

npm run dev
