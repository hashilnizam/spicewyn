@echo off
echo ========================================
echo    Starting SpiceWyn Full Stack
echo ========================================
echo.

REM Check if setup is complete
if not exist "backend\.env" (
    echo [ERROR] Backend not configured!
    echo Please run setup.bat first
    pause
    exit /b 1
)

if not exist "backend\node_modules" (
    echo [ERROR] Backend dependencies not installed!
    echo Please run setup.bat first
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo [ERROR] Frontend dependencies not installed!
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Starting Backend and Frontend servers...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Close this window to stop all servers
echo.

REM Start backend in new window
start "SpiceWyn Backend" cmd /k "cd backend && npm run dev"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "SpiceWyn Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
pause
