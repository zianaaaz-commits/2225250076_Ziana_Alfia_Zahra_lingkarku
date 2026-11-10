import type { Soal } from '../lib/soal';
import type { GambarSoal } from './contoh';

// F6 — Soal cerita terpandu (EL05). Siswa menandai informasi "diketahui" dan "ditanya".
// Token "pengecoh" adalah informasi yang tidak diperlukan untuk menjawab.

export type Peran = 'diketahui' | 'ditanya' | 'pengecoh';

export interface Token {
  teks: string;
  peran: Peran;
  /** Arti matematisnya, ditampilkan di ringkasan setelah penandaan benar. */
  makna?: string;
}

export interface Cerita {
  id: string;
  judul: string;
  segmen: (string | Token)[];
  /** Jawaban pertanyaan pemandu "panjang atau luas?" */
  jenis: 'panjang' | 'luas';
  gambar: GambarSoal;
  soal: Soal;
}

const d = (teks: string, makna: string): Token => ({ teks, peran: 'diketahui', makna });
const t = (teks: string, makna: string): Token => ({ teks, peran: 'ditanya', makna });
const x = (teks: string): Token => ({ teks, peran: 'pengecoh' });

export const CERITA: Cerita[] = [
  {
    id: 'pizza',
    judul: 'Pizza',
    segmen: [
      'Ibu membeli pizza seharga ', x('Rp80.000'), '. Pizza itu berdiameter ', d('28 cm', 'd = 28 cm → r = 14 cm'),
      ' dan dipotong menjadi ', d('8 bagian sama besar', 'α = 360° ÷ 8 = 45°'), '. Berapa ', t('luas satu potong', 'luas juring'),
      ' pizza? (π = 22/7)',
    ],
    jenis: 'luas',
    gambar: { r: 14, alpha: 45, pi: '22/7', tampil: 'juring', nilai: false },
    soal: { id: 'cerita-pizza', level: 3, teks: 'Pizza berdiameter 28 cm dipotong menjadi 8 bagian sama besar. Berapa luas satu potong?', data: { d: 28, alpha: 45, pi: '22/7' }, ditanya: 'juring', satuan: 'cm²', kunci: 77, contohTerkait: 'C6' },
  },
  {
    id: 'jam',
    judul: 'Jarum jam',
    segmen: [
      'Jam dinding di kelas berdiameter ', x('30 cm'), '. Jarum menitnya panjangnya ', d('7 cm', 'r = 7 cm'),
      '. Berapa ', t('panjang lintasan ujung jarum menit', 'panjang busur'), ' dalam ', d('15 menit', '15 × 6° = 90°'),
      '? (π = 22/7)',
    ],
    jenis: 'panjang',
    gambar: { r: 7, alpha: 90, pi: '22/7', tampil: 'busur', nilai: false },
    soal: { id: 'cerita-jam', level: 3, teks: 'Jarum menit panjangnya 7 cm. Berapa panjang lintasan ujung jarum dalam 15 menit?', data: { r: 7, alpha: 90, pi: '22/7' }, ditanya: 'busur', satuan: 'cm', kunci: 11, contohTerkait: 'C1' },
  },
  {
    id: 'taman',
    judul: 'Taman rumput',
    segmen: [
      'Pak Budi punya taman berbentuk juring dengan jari-jari ', d('14 m', 'r = 14 m'), ' dan sudut pusat ', d('90°', 'α = 90°'),
      '. Harga rumput ', x('Rp25.000 per m²'), '. Berapa ', t('luas taman', 'luas juring'), ' yang akan ditanami rumput? (π = 22/7)',
    ],
    jenis: 'luas',
    gambar: { r: 14, alpha: 90, pi: '22/7', tampil: 'juring', nilai: false, satuan: 'm' },
    soal: { id: 'cerita-taman', level: 3, teks: 'Taman berbentuk juring, jari-jari 14 m, sudut pusat 90°. Berapa luas taman?', data: { r: 14, alpha: 90, pi: '22/7' }, ditanya: 'juring', satuan: 'm²', kunci: 154, contohTerkait: 'C2' },
  },
  {
    id: 'pagar',
    judul: 'Pagar taman',
    segmen: [
      'Taman berbentuk juring dengan jari-jari ', d('14 m', 'r = 14 m'), ' dan sudut pusat ', d('90°', 'α = 90°'),
      ' akan dipagari ', t('sekelilingnya', 'keliling juring = busur + 2r'), '. Tinggi pagar ', x('1 m'),
      '. Berapa panjang pagar yang dibutuhkan? (π = 22/7)',
    ],
    jenis: 'panjang',
    gambar: { r: 14, alpha: 90, pi: '22/7', tampil: 'keduanya', nilai: false, satuan: 'm' },
    soal: { id: 'cerita-pagar', level: 3, teks: 'Taman berbentuk juring (r = 14 m, α = 90°) dipagari sekelilingnya. Berapa panjang pagar?', data: { r: 14, alpha: 90, pi: '22/7' }, ditanya: 'kelilingJuring', satuan: 'm', kunci: 50, contohTerkait: 'C1' },
  },
  {
    id: 'penyiram',
    judul: 'Alat penyiram',
    segmen: [
      'Alat penyiram di lapangan berputar ', d('120°', 'α = 120°'), ' dan menyemprot sejauh ', d('21 m', 'r = 21 m'),
      '. Penyiram menyala selama ', x('10 menit'), '. Berapa ', t('luas daerah yang tersiram', 'luas juring'), '? (π = 22/7)',
    ],
    jenis: 'luas',
    gambar: { r: 21, alpha: 120, pi: '22/7', tampil: 'juring', nilai: false, satuan: 'm' },
    soal: { id: 'cerita-penyiram', level: 3, teks: 'Alat penyiram berputar 120° dengan jangkauan 21 m. Berapa luas daerah yang tersiram?', data: { r: 21, alpha: 120, pi: '22/7' }, ditanya: 'juring', satuan: 'm²', kunci: 462, contohTerkait: 'C6' },
  },
  {
    id: 'bandul',
    judul: 'Bandul',
    segmen: [
      'Sebuah bandul bertali ', d('30 cm', 'r = 30 cm'), ' diayunkan ', x('5 kali'), '. Setiap ayunan membentuk sudut ',
      d('60°', 'α = 60°'), '. Berapa ', t('panjang lintasan ujung bandul', 'panjang busur'), ' dalam satu ayunan? (π = 3,14)',
    ],
    jenis: 'panjang',
    gambar: { r: 30, alpha: 60, pi: '3.14', tampil: 'busur', nilai: false },
    soal: { id: 'cerita-bandul', level: 3, teks: 'Bandul bertali 30 cm berayun membentuk sudut 60°. Berapa panjang lintasan ujung bandul?', data: { r: 30, alpha: 60, pi: '3.14' }, ditanya: 'busur', satuan: 'cm', kunci: 31.4, contohTerkait: 'C1' },
  },
];
