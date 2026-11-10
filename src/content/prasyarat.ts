import type { ButirKuis } from '../components/Kuis';
import type { Unsur } from '../components/UnsurSVG';

// F1 — Pemanasan unsur lingkaran (IL03). Maks. 2 kalimat per kartu.

export interface Kartu {
  judul: string;
  sorot: Unsur;
  teks: string;
}

export const KARTU_PRASYARAT: Kartu[] = [
  {
    judul: 'Titik pusat',
    sorot: 'pusat',
    teks: 'Titik di tengah lingkaran. Semua titik pada lingkaran berjarak **sama** dari titik pusat.',
  },
  {
    judul: 'Jari-jari (r)',
    sorot: 'jari',
    teks: 'Garis dari titik pusat ke lingkaran.',
  },
  {
    judul: 'Diameter (d)',
    sorot: 'diameter',
    teks: 'Garis melewati titik pusat, dari tepi ke tepi. **d = 2r**, jadi **r = d ÷ 2**.',
  },
  {
    judul: 'Sudut pusat (α)',
    sorot: 'sudut',
    teks: 'Sudut di titik pusat, diapit dua jari-jari. Satu putaran penuh = **360°**.',
  },
  {
    judul: 'Keliling dan luas',
    sorot: 'kelilingLuas',
    teks: 'Keliling = $2\\pi r$ (panjang garis tepi). Luas = $\\pi r^2$ (daerah di dalam).',
  },
];

export const KUIS_PRASYARAT: ButirKuis[] = [
  {
    tanya: 'Diameter lingkaran 20 cm. Berapa jari-jarinya?',
    pilihan: ['10 cm', '20 cm', '40 cm'],
    benar: 0,
    alasan: 'r = d ÷ 2 = 20 ÷ 2 = 10 cm.',
  },
  {
    tanya: 'Jari-jari lingkaran 7 cm. Berapa diameternya?',
    pilihan: ['3,5 cm', '14 cm', '49 cm'],
    benar: 1,
    alasan: 'd = 2r = 2 × 7 = 14 cm.',
  },
  {
    tanya: 'Satu putaran penuh besarnya…',
    pilihan: ['90°', '180°', '360°'],
    benar: 2,
    alasan: 'Satu putaran penuh = 360°.',
  },
  {
    tanya: 'Keliling lingkaran dengan r = 7 cm (π = 22/7) adalah…',
    pilihan: ['22 cm', '44 cm', '154 cm'],
    benar: 1,
    alasan: 'Keliling = 2πr = 2 × 22/7 × 7 = 44 cm. (154 adalah luasnya.)',
  },
  {
    tanya: 'Luas lingkaran dengan r = 10 cm (π = 3,14) adalah…',
    pilihan: ['31,4 cm²', '62,8 cm²', '314 cm²'],
    benar: 2,
    alasan: 'Luas = πr² = 3,14 × 10 × 10 = 314 cm². (62,8 adalah kelilingnya.)',
  },
];
