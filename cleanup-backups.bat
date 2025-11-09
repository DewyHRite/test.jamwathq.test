@echo off
REM Automated Backup Cleanup Script for Windows
REM Deletes backup files older than 1 day (24 hours)
REM Run this script daily via Windows Task Scheduler
REM
REM Usage: cleanup-backups.bat
REM

echo =====================================
echo Backup Cleanup Script (Windows)
echo =====================================
echo Started at: %date% %time%
echo.

setlocal enabledelayedexpansion
set DELETED_COUNT=0

REM Navigate to script directory
cd /d "%~dp0"

echo Searching for backups older than 24 hours...
echo.

REM Find and delete backup files older than 1 day in frontend directory
if exist "frontend" (
    echo Checking frontend directory...
    forfiles /P "frontend" /M "*.backup.*.html" /D -1 /C "cmd /c echo Deleting: @path && del /f @path && set /a DELETED_COUNT+=1" 2>nul
)

REM Find and delete backup files older than 1 day in backend directory
if exist "backend" (
    echo Checking backend directory...
    forfiles /P "backend" /M "*.backup.*.js" /D -1 /C "cmd /c echo Deleting: @path && del /f @path && set /a DELETED_COUNT+=1" 2>nul
)

REM Find and delete backup files older than 1 day in root directory
echo Checking root directory...
forfiles /P "." /M "*.backup.*" /D -1 /C "cmd /c echo Deleting: @path && del /f @path && set /a DELETED_COUNT+=1" 2>nul

echo.
echo =====================================
echo Cleanup Summary
echo =====================================
echo Backup files older than 24 hours have been deleted.
echo Completed at: %date% %time%
echo.

REM Log to version history
if !DELETED_COUNT! GTR 0 (
    echo ## %date% %time% - Automatic Backup Cleanup >> VERSION_HISTORY.md
    echo. >> VERSION_HISTORY.md
    echo Deleted backup files older than 24 hours. >> VERSION_HISTORY.md
    echo. >> VERSION_HISTORY.md
    echo --- >> VERSION_HISTORY.md
    echo. >> VERSION_HISTORY.md
)

pause
