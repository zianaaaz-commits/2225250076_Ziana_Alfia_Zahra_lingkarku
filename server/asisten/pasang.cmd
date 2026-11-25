@echo off
REM Pemasang server Asisten Belajar "Kak Bulat" (Cloudflare Worker).
REM Bisa diklik dua kali dari File Explorer, atau dijalankan di terminal: server\asisten\pasang.cmd
REM Memakai npx.cmd agar tidak terblokir pengaturan "running scripts is disabled" di PowerShell.
setlocal
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\node-v26.13.0-win-x64;%PATH%"

where npx.cmd >nul 2>nul
if errorlevel 1 (
  echo [GALAT] Node.js tidak ditemukan. Pasang Node.js dulu dari https://nodejs.org lalu coba lagi.
  goto selesai
)

echo.
echo ===== Langkah 1 dari 3: Login ke Cloudflare =====
echo Browser akan terbuka. Login ke akun Cloudflare, lalu klik "Allow".
echo.
call npx.cmd --yes wrangler@4 login
if errorlevel 1 goto gagal

echo.
echo ===== Langkah 2 dari 3: Mengunggah server =====
call npx.cmd --yes wrangler@4 deploy
if errorlevel 1 goto gagal

echo.
echo ===== Langkah 3 dari 3: Memasang API key OpenRouter =====
echo Tempel API key OpenRouter (klik kanan untuk menempel), lalu tekan Enter.
echo Key tidak akan terlihat di layar - itu normal.
echo.
call npx.cmd --yes wrangler@4 secret put API_KEY
if errorlevel 1 goto gagal

echo.
echo ==================================================
echo  BERHASIL! Salin alamat https://lingkarku-asisten....workers.dev
echo  yang muncul di Langkah 2, lalu kirimkan ke Claude.
echo ==================================================
goto selesai

:gagal
echo.
echo [GALAT] Ada langkah yang gagal. Salin/screenshot tulisan merah di atas dan kirimkan ke Claude.

:selesai
echo.
pause
endlocal
