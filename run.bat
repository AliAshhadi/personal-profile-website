@echo off
REM Start the app. Run install.bat once before using this.
setlocal

cd /d "%~dp0"

if not exist "venv\Scripts\activate.bat" (
    echo.
    echo Virtual environment not found.
    echo Please run install.bat first.
    pause
    exit /b 1
)

call venv\Scripts\activate.bat

echo Starting app at http://127.0.0.1:5000
echo Press Ctrl+C to stop.
python -m app.app

pause
