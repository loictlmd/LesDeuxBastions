@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Installez Node.js LTS depuis https://nodejs.org puis relancez ce fichier.
  pause
  exit /b 1
)
node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 20 ? 0 : 1)"
if errorlevel 1 (
  echo Node.js 20 ou plus recent est necessaire.
  pause
  exit /b 1
)
if not exist node_modules\qrcode (
  call npm ci
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
node scripts\launch.mjs
pause
