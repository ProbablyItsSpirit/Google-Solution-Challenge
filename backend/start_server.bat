@echo off
title Backend Server Starter

echo Checking for processes using port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    set PID=%%a
    goto :found
)
goto :notfound

:found
echo Process with PID %PID% is using port 8000
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
echo No process found using port 8000.
goto :startserver

:usealtport
set PORT=8080
echo Using alternative port %PORT%...
uvicorn main:app --host 0.0.0.0 --port %PORT%
goto :end

:startserver
echo Starting server on port 8000...
uvicorn main:app --host 0.0.0.0 --port 8000

:end
