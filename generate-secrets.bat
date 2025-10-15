@echo off
echo ========================================
echo    Generate JWT Secrets for SpiceWyn
echo ========================================
echo.

echo Generating secure random secrets...
echo.

cd backend

node -e "console.log('Copy these to your backend\\.env file:\n'); console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex')); console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'));"

echo.
echo ========================================
pause
