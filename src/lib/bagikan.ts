import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

export type HasilBagikan = 'dibagikan' | 'disalin' | 'batal' | 'gagal';

const salin = async (teks: string): Promise<HasilBagikan> => {
  try {
    await navigator.clipboard.writeText(teks);
    return 'disalin';
  } catch {
    return 'gagal';
  }
};

/**
 * Membagikan teks lewat menu "Bagikan" HP (WhatsApp, dll.).
 * APK: plugin Capacitor Share · Browser: Web Share API · Laptop: salin ke clipboard.
 */
export async function bagikanTeks(judul: string, teks: string): Promise<HasilBagikan> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({ title: judul, text: teks, dialogTitle: judul });
      return 'dibagikan';
    }
    if (typeof navigator.share === 'function') {
      await navigator.share({ title: judul, text: teks });
      return 'dibagikan';
    }
    return await salin(teks);
  } catch (e) {
    const pesan = String((e as Error)?.message ?? e).toLowerCase();
    if ((e as Error)?.name === 'AbortError' || pesan.includes('cancel')) return 'batal';
    return salin(teks);
  }
}
