@echo off
REM Auto-delete backups older than 1 day (Windows)
REM Run this script periodically via Task Scheduler
REM
REM Usage: scripts\cleanup-old-backups.bat

setlocal enabledelayedexpansion

REM Navigate to project root
cd /d "%~dp0.."
set "BACKUP_DIR=%CD%\backups"

echo ================================================
echo JamWatHQ - Backup Cleanup Script (Windows)
echo ================================================
echo Date: %date% %time%
echo Backup Directory: %BACKUP_DIR%
echo.

REM Check if backup directory exists
if not exist "%BACKUP_DIR%" (
    echo X Backup directory not found: %BACKUP_DIR%
    exit /b 1
)

REM Count total backups
set TOTAL_BACKUPS=0
for /d %%D in ("%BACKUP_DIR%\*") do (
    set /a TOTAL_BACKUPS+=1
)

echo Total backups found: %TOTAL_BACKUPS%

if %TOTAL_BACKUPS%==0 (
    echo No backups to clean up
    exit /b 0
)

echo.
echo Searching for backups older than 1 day...

REM Find and delete backups older than 1 day
set DELETED_COUNT=0
forfiles /P "%BACKUP_DIR%" /D -1 /C "cmd /c if @isdir==TRUE (echo Deleting: @path && rd /s /q @path && set /a DELETED_COUNT+=1)" 2>nul

if %DELETED_COUNT%==0 (
    echo No old backups found (all backups are less than 1 day old)
) else (
    echo.
    echo ================================================
    echo Cleanup completed
    echo Backups deleted: %DELETED_COUNT%
    set /a REMAINING=%TOTAL_BACKUPS%-%DELETED_COUNT%
    echo Backups remaining: !REMAINING!
    echo ================================================
)

REM Log to file
if not exist "%CD%\logs" mkdir "%CD%\logs"
echo [%date% %time%] Deleted %DELETED_COUNT% old backup(s) >> "%CD%\logs\backup-cleanup.log"

endlocal
exit /b 0
