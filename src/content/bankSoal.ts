import type { Soal } from '../lib/soal';

// Bank soal latihan (docs/04-konten-materi.md §5).
// Setiap `kunci` diuji otomatis di src/tests/bankSoal.test.ts.

export const BANK_SOAL: Soal[] = [
  // ---- Level 1: hitung langsung ----
  { id: 'L1-01', level: 1, teks: 'Jari-jari 7 cm, sudut pusat 90°. Berapa panjang busurnya?', data: { r: 7, alpha: 90, pi: '22/7' }, ditanya: 'busur', satuan: 'cm', kunci: 11, contohTerkait: 'C1' },
  { id: 'L1-02', level: 1, teks: 'Jari-jari 7 cm, sudut pusat 90°. Berapa luas juringnya?', data: { r: 7, alpha: 90, pi: '22/7' }, ditanya: 'juring', satuan: 'cm²', kunci: 38.5, contohTerkait: 'C2' },
  { id: 'L1-03', level: 1, teks: 'Jari-jari 21 cm, sudut pusat 60°. Berapa panjang busurnya?', data: { r: 21, alpha: 60, pi: '22/7' }, ditanya: 'busur', satuan: 'cm', kunci: 22, contohTerkait: 'C1' },
  { id: 'L1-04', level: 1, teks: 'Jari-jari 21 cm, sudut pusat 60°. Berapa luas juringnya?', data: { r: 21, alpha: 60, pi: '22/7' }, ditanya: 'juring', satuan: 'cm²', kunci: 231, contohTerkait: 'C2' },
  { id: 'L1-05', level: 1, teks: 'Jari-jari 10 cm, sudut pusat 36°, π = 3,14. Berapa panjang busurnya?', data: { r: 10, alpha: 36, pi: '3.14' }, ditanya: 'busur', satuan: 'cm', kunci: 6.28, contohTerkait: 'C1' },
  { id: 'L1-06', level: 1, teks: 'Jari-jari 10 cm, sudut pusat 36°, π = 3,14. Berapa luas juringnya?', data: { r: 10, alpha: 36, pi: '3.14' }, ditanya: 'juring', satuan: 'cm²', kunci: 31.4, contohTerkait: 'C2' },
  { id: 'L1-07', level: 1, teks: 'Jari-jari 20 cm, sudut pusat 90°, π = 3,14. Berapa luas juringnya?', data: { r: 20, alpha: 90, pi: '3.14' }, ditanya: 'juring', satuan: 'cm²', kunci: 314, contohTerkait: 'C2' },
  { id: 'L1-08', level: 1, teks: 'Diameter 28 cm, sudut pusat 45°. Berapa panjang busurnya?', data: { d: 28, alpha: 45, pi: '22/7' }, ditanya: 'busur', satuan: 'cm', kunci: 11, contohTerkait: 'C1' },
  { id: 'L1-09', level: 1, teks: 'Jari-jari 14 cm, sudut pusat 180°. Berapa luas juringnya?', data: { r: 14, alpha: 180, pi: '22/7' }, ditanya: 'juring', satuan: 'cm²', kunci: 308, contohTerkait: 'C2' },

  // ---- Level 2: invers & perbandingan ----
  { id: 'L2-01', level: 2, teks: 'Panjang busur 44 cm dan jari-jari 21 cm. Berapa sudut pusatnya?', data: { busur: 44, r: 21, pi: '22/7' }, ditanya: 'sudutDariBusur', satuan: '°', kunci: 120, contohTerkait: 'C3' },
  { id: 'L2-02', level: 2, teks: 'Luas juring 77 cm² dan sudut pusat 45°. Berapa jari-jarinya?', data: { luas: 77, alpha: 45, pi: '22/7' }, ditanya: 'jariDariJuring', satuan: 'cm', kunci: 14, contohTerkait: 'C4' },
  { id: 'L2-03', level: 2, teks: 'Panjang busur 22 cm dan sudut pusat 90°. Berapa jari-jarinya?', data: { busur: 22, alpha: 90, pi: '22/7' }, ditanya: 'jariDariBusur', satuan: 'cm', kunci: 14, contohTerkait: 'C4' },
  { id: 'L2-04', level: 2, teks: 'Luas juring 231 cm² dan jari-jari 21 cm. Berapa sudut pusatnya?', data: { luas: 231, r: 21, pi: '22/7' }, ditanya: 'sudutDariJuring', satuan: '°', kunci: 60, contohTerkait: 'C3' },
  { id: 'L2-05', level: 2, teks: '∠AOB = 60° dan panjang busur AB = 10 cm. Jika ∠COD = 150°, berapa panjang busur CD?', data: { nilai1: 10, alpha1: 60, alpha2: 150, pi: '22/7' }, ditanya: 'perbandingan', satuan: 'cm', kunci: 25, contohTerkait: 'C5' },
  { id: 'L2-06', level: 2, teks: '∠POQ = 40° dan luas juring POQ = 24 cm². Jika ∠ROS = 120°, berapa luas juring ROS?', data: { nilai1: 24, alpha1: 40, alpha2: 120, pi: '22/7' }, ditanya: 'perbandingan', satuan: 'cm²', kunci: 72, contohTerkait: 'C5' },

  // ---- Level 3: soal cerita ----
  { id: 'L3-01', level: 3, teks: 'Pizza berdiameter 28 cm dipotong menjadi 8 bagian sama besar. Berapa panjang pinggiran satu potong?', data: { d: 28, alpha: 45, pi: '22/7' }, ditanya: 'busur', satuan: 'cm', kunci: 11, contohTerkait: 'C6' },
  { id: 'L3-02', level: 3, teks: 'Jarum menit sebuah jam panjangnya 7 cm. Berapa panjang lintasan ujung jarum dalam 15 menit?', data: { r: 7, alpha: 90, pi: '22/7' }, ditanya: 'busur', satuan: 'cm', kunci: 11, contohTerkait: 'C6' },
  { id: 'L3-03', level: 3, teks: 'Sebuah taman berbentuk juring dengan jari-jari 14 m dan sudut pusat 90°. Berapa luas taman?', data: { r: 14, alpha: 90, pi: '22/7' }, ditanya: 'juring', satuan: 'm²', kunci: 154, contohTerkait: 'C6' },
  { id: 'L3-04', level: 3, teks: 'Taman berbentuk juring (jari-jari 14 m, sudut 90°) akan dipagari sekelilingnya. Berapa panjang pagar?', data: { r: 14, alpha: 90, pi: '22/7' }, ditanya: 'kelilingJuring', satuan: 'm', kunci: 50, contohTerkait: 'C6' },
  { id: 'L3-05', level: 3, teks: 'Alat penyiram berputar 120° dengan jangkauan 21 m. Berapa luas daerah yang tersiram?', data: { r: 21, alpha: 120, pi: '22/7' }, ditanya: 'juring', satuan: 'm²', kunci: 462, contohTerkait: 'C6' },
  { id: 'L3-06', level: 3, teks: 'Bandul bertali 30 cm berayun membentuk sudut 60°. Berapa panjang lintasan ujung bandul? (π = 3,14)', data: { r: 30, alpha: 60, pi: '3.14' }, ditanya: 'busur', satuan: 'cm', kunci: 31.4, contohTerkait: 'C6' },
];
