// Progres & pengaturan disimpan di localStorage perangkat (tanpa server, tanpa data pribadi).
// Semua akses dibungkus try/catch: aplikasi tetap jalan bila penyimpanan diblokir.
import type { Pi } from './geometri';

export type Level = '1' | '2' | '3';

export interface Pengaturan {
  hurufBesar: boolean;
  piDefault: Pi;
}

export interface Progres {
  versi: 1;
  /** id yang sudah selesai, mis. "prasyarat", "contoh:C1", "cerita:pizza" */
  selesai: string[];
  /** skor terbaik per level latihan (0–1) */
  skor: Partial<Record<Level, number>>;
  pengaturan: Pengaturan;
}

export const KUNCI_SIMPAN = 'lingkarku:progres';
export const BATAS_LULUS = 0.7;

export const progresAwal = (): Progres => ({
  versi: 1,
  selesai: [],
  skor: {},
  pengaturan: { hurufBesar: false, piDefault: '22/7' },
});

export function bacaProgres(): Progres {
  const awal = progresAwal();
  try {
    const teks = localStorage.getItem(KUNCI_SIMPAN);
    if (!teks) return awal;
    const p = JSON.parse(teks) as Partial<Progres>;
    return {
      versi: 1,
      selesai: Array.isArray(p.selesai) ? p.selesai.filter((x) => typeof x === 'string') : [],
      skor: typeof p.skor === 'object' && p.skor ? p.skor : {},
      pengaturan: { ...awal.pengaturan, ...(p.pengaturan ?? {}) },
    };
  } catch {
    return awal;
  }
}

export function simpanProgres(p: Progres): void {
  try {
    localStorage.setItem(KUNCI_SIMPAN, JSON.stringify(p));
  } catch {
    // penyimpanan penuh/diblokir: abaikan, progres hanya berlaku di sesi ini
  }
}

export const denganSelesai = (p: Progres, id: string): Progres =>
  p.selesai.includes(id) ? p : { ...p, selesai: [...p.selesai, id] };

export const denganSkor = (p: Progres, level: Level, nilai: number): Progres =>
  (p.skor[level] ?? -1) >= nilai ? p : { ...p, skor: { ...p.skor, [level]: nilai } };

export const lulusLevel = (p: Progres, level: Level): boolean => (p.skor[level] ?? 0) >= BATAS_LULUS;
