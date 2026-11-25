// Mengirim percakapan ke server Asisten Belajar (Cloudflare Worker).
import type { JawabanAsisten, PermintaanAsisten } from './tipe';

export type KodeGalat = 'belum-aktif' | 'offline' | 'terlalu-sering' | 'saldo-habis' | 'server';

export class GalatAsisten extends Error {
  constructor(
    public kode: KodeGalat,
    pesan?: string,
  ) {
    super(pesan ?? PESAN_GALAT[kode]);
  }
}

export const PESAN_GALAT: Record<KodeGalat, string> = {
  'belum-aktif': 'Asisten Belajar belum diaktifkan oleh guru. Sementara itu, pakai tombol Petunjuk, ya.',
  offline: 'Kak Bulat butuh internet. Sambungkan HP-mu ke internet, lalu coba lagi.',
  'terlalu-sering': 'Pelan-pelan, ya. Tunggu sebentar lalu coba lagi.',
  'saldo-habis': 'Kuota Asisten Belajar habis. Beri tahu gurumu, ya.',
  server: 'Kak Bulat sedang tidak bisa dihubungi. Coba lagi nanti.',
};

export async function tanyaAsisten(url: string, isi: PermintaanAsisten, signal?: AbortSignal): Promise<JawabanAsisten> {
  if (!url) throw new GalatAsisten('belum-aktif');
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new GalatAsisten('offline');

  let r: Response;
  try {
    r = await fetch(`${url}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isi),
      signal,
    });
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') throw e;
    throw new GalatAsisten(navigator.onLine === false ? 'offline' : 'server');
  }

  if (!r.ok) {
    const j = (await r.json().catch(() => ({}))) as { galat?: string; pesan?: string };
    const kode: KodeGalat = j.galat === 'terlalu-sering' || j.galat === 'saldo-habis' ? j.galat : 'server';
    throw new GalatAsisten(kode, j.pesan);
  }
  return (await r.json()) as JawabanAsisten;
}
