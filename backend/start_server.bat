@echo off
title Backend Server Starter

REM Set default port and environment
set DEFAULT_PORT=8000
set PORT=%DEFAULT_PORT%
set ENVIRONMENT=development

REM Check for Python virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)

echo Checking for processes using port %PORT%...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT%') do (
    set PID=%%a
    goto :found
)
goto :notfound

:found
echo Process with PID %PID% is using port %PORT%
choice /C YN /M "Do you want to kill this process"
if errorlevel 2 goto :usealtport
if errorlevel 1 goto :killprocess

:killprocess
echo Stopping process with PID %PID%...
taskkill /F /PID %PID%
if %errorlevel% equ 0 (
    echo Process successfully terminated
    timeout /t 2 >nul
) else (
    echo Failed to terminate process. Try running as administrator.
    goto :usealtport
)
goto :startserver

:notfound
echo No process found using port %PORT%.
goto :startserver

:usealtport
set PORT=8080
echo Using alternative port %PORT%...
uvicorn main:app --host 0.0.0.0 --port %PORT% --reload
goto :end

:startserver
echo Starting server on port %PORT%...
uvicorn main:app --host 0.0.0.0 --port %PORT% --reload

:end