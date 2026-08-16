@echo off
setlocal

echo [1/2] Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 exit /b 1

cd /d "%~dp0backend"
if not exist .venv python -m venv .venv
call .venv\Scripts\activate.bat
python -m pip install -r requirements.txt
if errorlevel 1 exit /b 1

if not exist .env copy .env.example .env >nul
cd /d "%~dp0frontend"
if not exist .env copy .env.example .env >nul

echo.
echo Ready. Start backend: cd backend ^&^& .venv\Scripts\activate ^&^& uvicorn app.main:app --reload --port 8000
echo Start frontend in another terminal: cd frontend ^&^& npm run dev
