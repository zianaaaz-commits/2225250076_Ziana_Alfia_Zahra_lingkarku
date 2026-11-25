// Tipe data Asisten Belajar "Kak Bulat" (dipakai bersama oleh aplikasi & server Cloudflare Worker).

export type Peran = 'siswa' | 'asisten';

export interface Pesan {
  peran: Peran;
  isi: string;
}

/** Fase Rigorous Mathematical Thinking (Kinard & Kozulin, 2008). */
export type FaseRmt = 1 | 2 | 3;

/** Tingkat bantuan: 1 pertanyaan pemandu → 4 contoh serupa (angka berbeda). */
export type TingkatBantuan = 1 | 2 | 3 | 4;

export type TahapLiterasi = 'pahami' | 'rumuskan' | 'hitung' | 'tafsirkan' | 'jelaskan';

export type ModulAsisten = 'latihan' | 'cerita' | 'literasi' | 'melengkapi' | 'umum';

/** Konteks soal yang sedang dikerjakan. TIDAK memuat nama/kelas siswa. */
export interface KonteksSoal {
  modul: ModulAsisten;
  /** Teks soal / cerita. */
  soal?: string;
  /** Pertanyaan pada langkah yang sedang dikerjakan (Misi Literasi). */
  pertanyaan?: string;
  tahapLiterasi?: TahapLiterasi;
  /** Jawaban terakhir siswa (bila ada). */
  jawabanSiswa?: string;
  /** Status jawaban menurut aplikasi (dihitung dengan lib/feedback.ts, bukan oleh AI). */
  status?: 'belum' | 'salah' | 'benar';
  /** Diagnosis kesalahan dari mesin umpan balik (mis. memakai rumus luas untuk busur). */
  kesalahan?: string;
  satuan?: string;
}

/** Badan permintaan aplikasi → server. */
export interface PermintaanAsisten {
  pesan: Pesan[];
  konteks: KonteksSoal;
  tingkatBantuan: TingkatBantuan;
  /** Kunci jawaban — HANYA untuk penjaga di server, tidak pernah dikirim ke model AI. */
  kunci?: number;
}

export interface JawabanAsisten {
  balasan: string;
  fase: FaseRmt;
  /** true bila jawaban akhir sempat muncul dan disembunyikan oleh penjaga. */
  disensor?: boolean;
}
