@echo off
echo Installing Hostel CMS dependencies...

cd backend
call npm install
cd ..

cd frontend
call npm install
cd ..

echo.
echo Setup complete!
echo.
echo To start the app, open 2 Command Prompt windows:
echo.
echo   Window 1 (Backend):  cd backend  then  npm start
echo   Window 2 (Frontend): cd frontend then  npm run dev
echo.
echo Then open: http://localhost:5173
pause
