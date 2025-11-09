@echo off
echo ========================================
echo   BITS Goa Campus Food - Windows Setup
echo ========================================
echo.

REM Check if .env exists
if exist .env (
    echo [OK] .env file found
) else (
    echo [!] .env file NOT FOUND
    echo.
    if exist .env.example (
        echo Creating .env from .env.example...
        copy .env.example .env
        echo.
        echo [OK] .env file created!
        echo.
        echo IMPORTANT: Edit the .env file and add your credentials:
        echo   - DATABASE_URL
        echo   - GOOGLE_CLIENT_ID
        echo   - GOOGLE_CLIENT_SECRET
        echo   - SESSION_SECRET
        echo.
        pause
        exit /b 1
    ) else (
        echo ERROR: .env.example not found!
        echo Please create a .env file manually with all required secrets.
        pause
        exit /b 1
    )
)

REM Always run npm install to ensure dependencies are up to date
echo.
echo Installing/updating dependencies...
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo [OK] Dependencies installed

echo.
echo Verifying environment variables...
call node verify-env.cjs

if errorlevel 1 (
    echo.
    echo Setup incomplete! Please fix the issues above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Setup Complete! Ready to run.
echo ========================================
echo.
echo To start the development server, run:
echo   .\dev-windows.bat
echo.
echo Or use: npx cross-env NODE_ENV=development tsx server/index.ts
echo.
pause
