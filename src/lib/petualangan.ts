// Gelar petualang di peta "Petualangan Negeri Lingkaran", naik sesuai jumlah pos yang selesai.

export interface Gelar {
  min: number;
  nama: string;
  ikon: string;
}

export const GELAR: Gelar[] = [
  { min: 0, nama: 'Petualang Pemula', ikon: '🌱' },
  { min: 1, nama: 'Penjelajah Muda', ikon: '🧭' },
  { min: 3, nama: 'Pemburu Busur', ikon: '🏹' },
  { min: 5, nama: 'Ksatria Juring', ikon: '🛡️' },
  { min: 7, nama: 'Master Negeri Lingkaran', ikon: '👑' },
];

export interface StatusGelar {
  sekarang: Gelar;
  /** Gelar berikutnya & berapa pos lagi untuk meraihnya (tidak ada bila sudah tertinggi). */
  berikutnya?: { gelar: Gelar; kurang: number };
}

export function gelarPetualang(posSelesai: number): StatusGelar {
  const i = GELAR.reduce((acc, g, k) => (posSelesai >= g.min ? k : acc), 0);
  const lanjut = GELAR[i + 1];
  return {
    sekarang: GELAR[i],
    ...(lanjut ? { berikutnya: { gelar: lanjut, kurang: lanjut.min - posSelesai } } : {}),
  };
}
