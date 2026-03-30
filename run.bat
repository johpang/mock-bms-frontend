@echo off
echo ============================================================
echo   BMS - Broker Management System (Demo)
echo ============================================================
echo.

REM ============================================================
REM  FRONTEND DEPENDENCIES
REM ============================================================
if not exist "node_modules\react\package.json" (
    echo Installing frontend dependencies...
    if exist "node_modules\" rmdir /s /q node_modules
    call npm install
    if errorlevel 1 (
        echo npm install failed.
        pause
        exit /b 1
    )
    echo.
)

REM ============================================================
REM  MOCK API SERVER
REM  To disable the mock server, add REM to the beginning of
REM  each line in the block below (up to the next section).
REM ============================================================
if not exist "server\node_modules\express\package.json" (
    echo Installing server dependencies...
    pushd server
    call npm install
    popd
    echo.
)
echo Starting mock API server on port 4000...
start "BMS API" /min cmd /c "cd server && node index.js"
echo Waiting for API server...
ping 127.0.0.1 -n 3 >NUL 2>NUL
REM ============================================================
REM  END MOCK API SERVER
REM ============================================================

REM ============================================================
REM  REACT DEV SERVER
REM ============================================================
echo Starting React dev server on port 3000...
set BROWSER=default
set PORT=3000
call npx react-scripts start
