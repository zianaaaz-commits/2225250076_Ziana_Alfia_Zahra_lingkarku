@echo off
REM Memasang / mengganti API key server Asisten Belajar (tanpa login & unggah ulang).
setlocal
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\node-v26.13.0-win-x64;%PATH%"
echo.
echo Tempel API key (klik kanan untuk menempel), lalu tekan Enter.
echo Key tidak akan terlihat di layar - itu normal.
echo.
call npx.cmd --yes wrangler@4 secret put API_KEY
if errorlevel 1 (
  echo.
  echo [GALAT] Gagal. Screenshot tulisan di atas dan kirimkan ke Claude.
) else (
  echo.
  echo BERHASIL! API key sudah terpasang. Kabari Claude, ya.
)
echo.
pause
endlocal
