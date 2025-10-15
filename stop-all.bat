@echo off
echo ========================================
echo    Stopping SpiceWyn Servers
echo ========================================
echo.

REM Kill Node.js processes running on ports 5000 and 5173
echo Stopping backend server (port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Stopping frontend server (port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All servers stopped!
echo.
pause
