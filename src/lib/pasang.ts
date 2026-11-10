// Menangkap event "beforeinstallprompt" (Chrome/Edge Android & desktop) agar aplikasi
// dapat dipasang dengan satu tombol, tanpa Play Store. Dipanggil sedini mungkin di main.tsx.

interface PromptPasang extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let tertunda: PromptPasang | null = null;
const pendengar = new Set<() => void>();
const kabari = () => pendengar.forEach((f) => f());

export function mulaiPantauPasang(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    tertunda = e as PromptPasang;
    kabari();
  });
  window.addEventListener('appinstalled', () => {
    tertunda = null;
    kabari();
  });
}

export const bisaPasangLangsung = () => tertunda !== null;

export function pantau(f: () => void): () => void {
  pendengar.add(f);
  return () => pendengar.delete(f);
}

export async function pasangSekarang(): Promise<boolean> {
  if (!tertunda) return false;
  await tertunda.prompt();
  const { outcome } = await tertunda.userChoice;
  tertunda = null;
  kabari();
  return outcome === 'accepted';
}

/** Sudah berjalan sebagai aplikasi terpasang (PWA standalone atau APK Capacitor)? */
export function sudahTerpasang(): boolean {
  const capacitor = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  if (capacitor?.isNativePlatform?.()) return true;
  return window.matchMedia?.('(display-mode: standalone)').matches ?? false;
}

export type Perangkat = 'android' | 'ios' | 'desktop';

export function jenisPerangkat(ua = navigator.userAgent): Perangkat {
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  return 'desktop';
}
