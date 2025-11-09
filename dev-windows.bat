@echo off
echo ========================================
echo   BITS Goa Campus Food - Dev Server
echo ========================================
echo.
if exist .env (
    echo [OK] Environment configured
) else (
    echo [ERROR] .env file NOT found!
    echo Please run setup-windows.bat first
    pause
    exit /b 1
)
echo.
call npx cross-env NODE_ENV=development tsx server/index.ts
