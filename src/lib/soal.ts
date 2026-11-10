import {
  jariDariBusur,
  jariDariDiameter,
  jariDariJuring,
  kelilingJuring,
  luasJuring,
  panjangBusur,
  perbandingan,
  sudutDariBusur,
  sudutDariJuring,
  type Pi,
} from './geometri';

export type Satuan = 'cm' | 'cm²' | 'm' | 'm²' | '°';

/** Data numerik soal. Pilih salah satu: r atau d. */
export interface DataSoal {
  pi: Pi;
  r?: number;
  d?: number;
  alpha?: number;
  busur?: number;
  luas?: number;
  /** Untuk soal perbandingan */
  nilai1?: number;
  alpha1?: number;
  alpha2?: number;
}

export type Ditanya =
  | 'busur'
  | 'juring'
  | 'kelilingJuring'
  | 'sudutDariBusur'
  | 'sudutDariJuring'
  | 'jariDariBusur'
  | 'jariDariJuring'
  | 'perbandingan';

export interface Soal {
  id: string;
  level: 1 | 2 | 3;
  teks: string;
  data: DataSoal;
  ditanya: Ditanya;
  satuan: Satuan;
  /** Kunci yang ditulis di konten; diuji terhadap hitungKunci() di tests/. */
  kunci: number;
  /** id contoh F4 yang relevan (tombol "Lihat contoh serupa") */
  contohTerkait?: string;
}

const wajib = (nilai: number | undefined, nama: string): number => {
  if (nilai === undefined) throw new Error(`Data soal kurang: ${nama}`);
  return nilai;
};

/** Jari-jari dari data (r langsung, atau d ÷ 2). */
export const jariSoal = (data: DataSoal): number =>
  data.r ?? jariDariDiameter(wajib(data.d, 'r atau d'));

/** Hitung jawaban benar dari data soal. */
export function hitungKunci(soal: Pick<Soal, 'data' | 'ditanya'>): number {
  const { data } = soal;
  const { pi } = data;
  switch (soal.ditanya) {
    case 'busur':
      return panjangBusur(wajib(data.alpha, 'alpha'), jariSoal(data), pi);
    case 'juring':
      return luasJuring(wajib(data.alpha, 'alpha'), jariSoal(data), pi);
    case 'kelilingJuring':
      return kelilingJuring(wajib(data.alpha, 'alpha'), jariSoal(data), pi);
    case 'sudutDariBusur':
      return sudutDariBusur(wajib(data.busur, 'busur'), jariSoal(data), pi);
    case 'sudutDariJuring':
      return sudutDariJuring(wajib(data.luas, 'luas'), jariSoal(data), pi);
    case 'jariDariBusur':
      return jariDariBusur(wajib(data.busur, 'busur'), wajib(data.alpha, 'alpha'), pi);
    case 'jariDariJuring':
      return jariDariJuring(wajib(data.luas, 'luas'), wajib(data.alpha, 'alpha'), pi);
    case 'perbandingan':
      return perbandingan(
        wajib(data.nilai1, 'nilai1'),
        wajib(data.alpha1, 'alpha1'),
        wajib(data.alpha2, 'alpha2'),
      );
  }
}
