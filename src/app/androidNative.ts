import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Perilaku khusus APK Android:
 * tombol "kembali" HP mundur satu halaman di dalam aplikasi (bukan langsung keluar).
 * Di beranda, tombol kembali menutup aplikasi.
 */
export function aturAndroid(): void {
  if (!Capacitor.isNativePlatform()) return;
  App.addListener('backButton', ({ canGoBack }) => {
    const diBeranda = window.location.hash === '' || window.location.hash === '#/';
    if (canGoBack && !diBeranda) window.history.back();
    else App.exitApp();
  });
}
