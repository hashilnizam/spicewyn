@echo off
title SpiceWyn Frontend Server
echo ========================================
echo    Starting SpiceWyn Frontend Server
echo ========================================
echo.

cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo [ERROR] Dependencies not installed!
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Starting frontend server on http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

npm run dev
