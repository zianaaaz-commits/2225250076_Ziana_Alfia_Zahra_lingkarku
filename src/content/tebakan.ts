// Soal prediksi untuk mode "Tebak Dulu" di Simulasi (IL02).
// Siswa menebak lebih dulu, lalu melihat gambar "sesudah".

export interface Tebakan {
  tanya: string;
  besaran: 'busur' | 'juring';
  sebelum: { r: number; alpha: number };
  sesudah: { r: number; alpha: number };
  pilihan: string[];
  benar: number;
  alasan: string;
}

export const TEBAKAN: Tebakan[] = [
  {
    tanya: 'Sudut pusat dibuat 2 kali lipat (60° → 120°). Panjang busur menjadi…',
    besaran: 'busur',
    sebelum: { r: 14, alpha: 60 },
    sesudah: { r: 14, alpha: 120 },
    pilihan: ['Tetap', '2 kali lipat', '4 kali lipat'],
    benar: 1,
    alasan: 'Panjang busur sebanding dengan sudut pusat.',
  },
  {
    tanya: 'Sudut pusat dibuat 2 kali lipat (45° → 90°). Luas juring menjadi…',
    besaran: 'juring',
    sebelum: { r: 14, alpha: 45 },
    sesudah: { r: 14, alpha: 90 },
    pilihan: ['Tetap', '2 kali lipat', '4 kali lipat'],
    benar: 1,
    alasan: 'Luas juring juga sebanding dengan sudut pusat.',
  },
  {
    tanya: 'Jari-jari dibuat 2 kali lipat (7 → 14 cm), sudut tetap 90°. Panjang busur menjadi…',
    besaran: 'busur',
    sebelum: { r: 7, alpha: 90 },
    sesudah: { r: 14, alpha: 90 },
    pilihan: ['Tetap', '2 kali lipat', '4 kali lipat'],
    benar: 1,
    alasan: 'Rumus busur memakai 2πr. Jika r dikali 2, busur juga dikali 2.',
  },
  {
    tanya: 'Jari-jari dibuat 2 kali lipat (7 → 14 cm), sudut tetap 90°. Luas juring menjadi…',
    besaran: 'juring',
    sebelum: { r: 7, alpha: 90 },
    sesudah: { r: 14, alpha: 90 },
    pilihan: ['Tetap', '2 kali lipat', '4 kali lipat'],
    benar: 2,
    alasan: 'Rumus juring memakai πr². Jika r dikali 2, maka r² dikali 4.',
  },
  {
    tanya: 'Sudut pusat dibuat 360°. Panjang busur sama dengan…',
    besaran: 'busur',
    sebelum: { r: 14, alpha: 90 },
    sesudah: { r: 14, alpha: 360 },
    pilihan: ['Diameter', 'Keliling lingkaran', 'Luas lingkaran'],
    benar: 1,
    alasan: '360° = satu putaran penuh, jadi busurnya adalah seluruh keliling.',
  },
];
