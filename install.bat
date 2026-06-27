@echo off
REM First-time setup: create a virtual environment and install dependencies.
setlocal

cd /d "%~dp0"

echo Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo.
    echo ERROR: Could not create the virtual environment.
    echo Make sure Python 3 is installed and available on your PATH.
    pause
    exit /b 1
)

echo Installing dependencies...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: Could not install dependencies.
    pause
    exit /b 1
)

echo.
echo Setup complete. Run run.bat to start the app.
pause
