@echo off
cd /d "%~dp0"
echo Starting Voice Kitchen for local phone use...
echo.
echo Keep this window open during service.
echo.
node server.js
echo.
pause
