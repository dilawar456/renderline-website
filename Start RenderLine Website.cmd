@echo off
setlocal
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required.
  pause
  exit /b 1
)
node "%~dp0next-app\scripts\start-renderline.cjs"
if errorlevel 1 pause
exit /b %errorlevel%
