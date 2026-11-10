import { useEffect, useRef, useState } from 'react';
import { URL_LAGU, VOLUME } from '../lib/musik';

/**
 * Memutar lagu latar secara berulang dengan efek fade.
 * - Baru mulai setelah sentuhan pertama (aturan autoplay browser & WebView Android).
 * - Berhenti saat aplikasi diminimalkan / layar HP dikunci.
 */
export function useMusikLatar(aktif: boolean) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [disentuh, setDisentuh] = useState(false);
  const [terlihat, setTerlihat] = useState(() => typeof document === 'undefined' || document.visibilityState !== 'hidden');

  useEffect(() => {
    const sentuh = () => setDisentuh(true);
    const lihat = () => setTerlihat(document.visibilityState !== 'hidden');
    window.addEventListener('pointerdown', sentuh, { once: true });
    window.addEventListener('keydown', sentuh, { once: true });
    document.addEventListener('visibilitychange', lihat);
    return () => {
      window.removeEventListener('pointerdown', sentuh);
      window.removeEventListener('keydown', sentuh);
      document.removeEventListener('visibilitychange', lihat);
    };
  }, []);

  const putar = aktif && disentuh && terlihat;

  useEffect(() => {
    if (!putar && !audio.current) return;
    if (!audio.current) {
      const a = new Audio(URL_LAGU);
      a.loop = true;
      a.volume = 0;
      a.preload = 'auto';
      audio.current = a;
    }
    const a = audio.current;
    if (putar) {
      try {
        const janji = a.play();
        janji?.catch?.(() => {}); // diblokir browser: abaikan
      } catch {
        // lingkungan tanpa audio (mis. pengujian)
      }
    }
    // Fade dengan jumlah langkah tetap (iOS Safari mengabaikan `volume`, jadi jangan
    // menunggu volume mencapai target — cukup hentikan setelah langkah terakhir).
    const awal = a.volume;
    const target = putar ? VOLUME : 0;
    const LANGKAH = 15;
    let k = 0;
    const id = window.setInterval(() => {
      k += 1;
      try {
        a.volume = awal + ((target - awal) * k) / LANGKAH;
      } catch {
        // volume tidak dapat diubah di perangkat ini
      }
      if (k >= LANGKAH) {
        window.clearInterval(id);
        if (!putar) a.pause();
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [putar]);

  useEffect(() => () => audio.current?.pause(), []);
}
