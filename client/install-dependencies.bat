@echo off
echo Installing required dependencies...
cd /d %~dp0
npm install react-markdown react-syntax-highlighter

echo Done!
pause
