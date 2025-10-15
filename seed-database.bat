@echo off
title Seed SpiceWyn Database
echo ========================================
echo    Seeding SpiceWyn Database
echo ========================================
echo.

echo This will:
echo - Delete ALL existing data
echo - Create demo users (admin, customers)
echo - Create categories and products
echo - Create banners and coupons
echo.

choice /C YN /M "Are you sure you want to continue"
if errorlevel 2 goto :cancel

cd backend

echo.
echo Running seed script...
echo.

npm run seed

echo.
echo ========================================
echo.
pause
goto :end

:cancel
echo.
echo Seed operation cancelled.
echo.
pause

:end
