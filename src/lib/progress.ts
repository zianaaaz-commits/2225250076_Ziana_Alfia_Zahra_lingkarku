// Progres & pengaturan disimpan di localStorage perangkat (tanpa server, tanpa data pribadi).
// Semua akses dibungkus try/catch: aplikasi tetap jalan bila penyimpanan diblokir.
import type { Pi } from './geometri';

export type Level = '1' | '2' | '3';

export interface Pengaturan {
  hurufBesar: boolean;
  piDefault: Pi;
  /** Lagu latar di layar menu (berhenti otomatis saat belajar). */
  musik: boolean;
}

/** Data diri siswa — hanya tersimpan di perangkat ini, tidak dikirim ke mana pun. */
export interface DataSiswa {
  nama: string;
  kelas: string;
  /** Tanggal pertama kali mengisi (ISO). */
  sejak: string;
}

export interface Progres {
  versi: 1;
  siswa?: DataSiswa;
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
  pengaturan: { hurufBesar: false, piDefault: '22/7', musik: true },
});

export function bacaProgres(): Progres {
  const awal = progresAwal();
  try {
    const teks = localStorage.getItem(KUNCI_SIMPAN);
    if (!teks) return awal;
    const p = JSON.parse(teks) as Partial<Progres>;
    const s = p.siswa;
    const siswaSah =
      s && typeof s.nama === 'string' && typeof s.kelas === 'string' && rapikanSiswa(s.nama, s.kelas).ok;
    return {
      versi: 1,
      ...(siswaSah ? { siswa: { nama: s.nama, kelas: s.kelas, sejak: String(s.sejak ?? '') } } : {}),
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

export const BATAS_NAMA = 40;
export const BATAS_KELAS = 12;

export type HasilRapikan =
  | { ok: true; nama: string; kelas: string }
  | { ok: false; galat: { nama?: string; kelas?: string } };

/** Merapikan & memeriksa isian nama dan kelas (spasi berlebih dibuang). */
export function rapikanSiswa(namaMentah: string, kelasMentah: string): HasilRapikan {
  const nama = namaMentah.replace(/\s+/g, ' ').trim();
  const kelas = kelasMentah.replace(/\s+/g, ' ').trim();
  const galat: { nama?: string; kelas?: string } = {};
  if (nama.length < 2 || !/\p{L}/u.test(nama)) galat.nama = 'Tulis namamu (minimal 2 huruf).';
  else if (nama.length > BATAS_NAMA) galat.nama = `Nama terlalu panjang (maks. ${BATAS_NAMA} karakter).`;
  if (kelas.length < 1) galat.kelas = 'Tulis kelasmu, misalnya IX-A.';
  else if (kelas.length > BATAS_KELAS) galat.kelas = `Kelas terlalu panjang (maks. ${BATAS_KELAS} karakter).`;
  return galat.nama || galat.kelas ? { ok: false, galat } : { ok: true, nama, kelas };
}

export const denganSiswa = (p: Progres, nama: string, kelas: string, sekarang = new Date()): Progres => ({
  ...p,
  siswa: { nama, kelas, sejak: p.siswa?.sejak || sekarang.toISOString() },
});

export const lulusLevel =(p: Progres, level: Level): boolean => (p.skor[level] ?? 0) >= BATAS_LULUS;
