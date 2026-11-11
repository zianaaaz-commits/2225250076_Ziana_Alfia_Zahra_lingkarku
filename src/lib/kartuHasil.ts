// Ringkasan "Kartu Hasil" dalam bentuk teks, untuk dibagikan siswa ke guru (mis. lewat WhatsApp).
import type { Level } from './progress';

export interface DataKartu {
  nama: string;
  kelas: string;
  tanggal: Date;
  modul: { judul: string; selesai: boolean }[];
  skor: Partial<Record<Level, number>>;
}

export const formatTanggal = (d: Date): string =>
  d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export const persen = (x: number | undefined): string => (x === undefined ? 'belum' : `${Math.round(x * 100)}%`);

export function teksKartuHasil(k: DataKartu): string {
  const selesai = k.modul.filter((m) => m.selesai).length;
  return [
    '📘 Kartu Hasil Belajar — LingkarKu',
    'Materi: Panjang Busur & Luas Juring',
    '',
    `Nama  : ${k.nama}`,
    `Kelas : ${k.kelas}`,
    `Tanggal: ${formatTanggal(k.tanggal)}`,
    '',
    `Langkah selesai: ${selesai} dari ${k.modul.length}`,
    ...k.modul.map((m) => `${m.selesai ? '✅' : '⬜'} ${m.judul}`),
    '',
    'Skor terbaik latihan:',
    ...(['1', '2', '3'] as const).map((l) => `• Level ${l}: ${persen(k.skor[l])}`),
  ].join('\n');
}
