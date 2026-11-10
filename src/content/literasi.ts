import type { DataSoal, Ditanya } from '../lib/soal';
import type { GambarSoal } from './contoh';

// Misi Literasi Matematika (docs/09-literasi-matematika.md).
// Mengikuti proses literasi matematika PISA 2022 / AKM Numerasi:
// Pahami konteks → Rumuskan model → Hitung → Tafsirkan hasil → Jelaskan penalaran.

export type Fase = 'pahami' | 'rumuskan' | 'hitung' | 'tafsirkan' | 'jelaskan';

export const FASE: { id: Fase; label: string }[] = [
  { id: 'pahami', label: 'Pahami' },
  { id: 'rumuskan', label: 'Rumuskan' },
  { id: 'hitung', label: 'Hitung' },
  { id: 'tafsirkan', label: 'Tafsirkan' },
  { id: 'jelaskan', label: 'Jelaskan' },
];

export type LangkahMisi =
  | { jenis: 'pilihan'; fase: Fase; tanya: string; pilihan: string[]; benar: number; alasan: string }
  | {
      jenis: 'isian';
      fase: Fase;
      tanya: string;
      kunci: number;
      satuan: string;
      petunjuk: string;
      pembahasan: string[];
      /** Bila diisi, jawaban didiagnosis dengan mesin umpan balik & kunci diperiksa ulang oleh Python. */
      soal?: { data: DataSoal; ditanya: Ditanya };
      /** Izinkan titik ribuan (mis. 2.250.000) — untuk rupiah. */
      ribuan?: boolean;
    }
  | { jenis: 'pernyataan'; fase: Fase; tanya: string; pernyataan: { teks: string; benar: boolean; alasan: string }[] }
  | { jenis: 'uraian'; fase: Fase; tanya: string; contohJawaban: string; ceklis: string[] };

export interface Misi {
  id: string;
  judul: string;
  konteks: 'Personal' | 'Sosial' | 'Saintifik';
  cerita: string;
  info: { label: string; nilai: string }[];
  gambar?: GambarSoal;
  ilustrasi?: 'wiper';
  langkah: LangkahMisi[];
}

export const LITERASI: Misi[] = [
  {
    id: 'kue',
    judul: 'Kue Ulang Tahun',
    konteks: 'Personal',
    cerita:
      'Rani merayakan ulang tahun. Kuenya berbentuk lingkaran dan dipotong sama besar. Adik Rani ingin potongan yang luasnya **paling sedikit 70 cm²**.',
    info: [
      { label: 'Diameter kue', nilai: '28 cm' },
      { label: 'Jumlah potongan', nilai: '8 sama besar' },
      { label: 'Keinginan adik', nilai: '≥ 70 cm² per potong' },
    ],
    gambar: { r: 14, alpha: 45, pi: '22/7', tampil: 'juring', nilai: false, label: false },
    langkah: [
      {
        jenis: 'pilihan', fase: 'pahami',
        tanya: 'Informasi mana yang TIDAK diperlukan untuk menghitung luas satu potong?',
        pilihan: ['Diameter kue 28 cm', 'Dipotong 8 sama besar', 'Rani sedang berulang tahun'],
        benar: 2, alasan: 'Ulang tahun hanyalah latar cerita; tidak dipakai dalam perhitungan.',
      },
      {
        jenis: 'pilihan', fase: 'rumuskan',
        tanya: 'Satu potong kue berbentuk apa, dan apa yang dihitung?',
        pilihan: ['Busur → panjangnya', 'Juring → luasnya', 'Lingkaran penuh → luasnya'],
        benar: 1, alasan: 'Sepotong kue adalah daerah (juring), yang ditanya luasnya.',
      },
      {
        jenis: 'pilihan', fase: 'rumuskan',
        tanya: 'Berapa sudut pusat satu potong kue?',
        pilihan: ['8°', '45°', '90°'],
        benar: 1, alasan: '8 potong sama besar: 360° ÷ 8 = 45°.',
      },
      {
        jenis: 'isian', fase: 'hitung',
        tanya: 'Hitung luas satu potong kue. (π = 22/7)',
        kunci: 77, satuan: 'cm²',
        petunjuk: 'r = 28 ÷ 2 = 14 cm. Luas juring = 45/360 × 22/7 × 14 × 14.',
        pembahasan: ['$r = 28 \\div 2 = 14$ cm', '$\\frac{45}{360} \\times \\frac{22}{7} \\times 14 \\times 14 = \\frac{1}{8} \\times 616 = 77$', 'Luas satu potong = **77 cm²**'],
        soal: { data: { d: 28, alpha: 45, pi: '22/7' }, ditanya: 'juring' },
      },
      {
        jenis: 'pernyataan', fase: 'tafsirkan',
        tanya: 'Tandai setiap pernyataan: Benar atau Salah?',
        pernyataan: [
          { teks: 'Satu potong (77 cm²) memenuhi keinginan adik.', benar: true, alasan: '77 cm² ≥ 70 cm².' },
          { teks: 'Jika kue dipotong 10 sama besar, setiap potong tetap ≥ 70 cm².', benar: false, alasan: 'Luas kue 616 cm². 616 ÷ 10 = 61,6 cm², kurang dari 70.' },
          { teks: 'Semakin banyak potongan, semakin kecil luas tiap potong.', benar: true, alasan: 'Sudut pusat tiap potong makin kecil, jadi luas juringnya makin kecil.' },
        ],
      },
      {
        jenis: 'isian', fase: 'tafsirkan',
        tanya: 'Paling banyak berapa potong agar setiap potong tetap ≥ 70 cm²?',
        kunci: 8, satuan: 'potong',
        petunjuk: 'Luas seluruh kue 616 cm². Bagi dengan 70, lalu bulatkan ke bawah.',
        pembahasan: ['Luas kue $= \\frac{22}{7} \\times 14 \\times 14 = 616$ cm²', '$616 \\div 70 = 8{,}8$', 'Tidak mungkin 8,8 potong, dan 9 potong terlalu kecil ($616 \\div 9 \\approx 68{,}4$). Jadi paling banyak **8 potong**.'],
      },
      {
        jenis: 'uraian', fase: 'jelaskan',
        tanya: 'Jelaskan kepada adik Rani mengapa kuenya tidak boleh dipotong 9 bagian.',
        contohJawaban: 'Kalau dipotong 9, setiap potong luasnya 616 ÷ 9 ≈ 68,4 cm². Itu kurang dari 70 cm² yang adik inginkan. Kalau dipotong 8, setiap potong 77 cm², jadi masih cukup.',
        ceklis: ['Menyebut luas tiap potong jika dipotong 9 (≈ 68,4 cm²)', 'Membandingkannya dengan 70 cm²', 'Menarik kesimpulan yang sesuai konteks'],
      },
    ],
  },
  {
    id: 'pagar',
    judul: 'Pagar Taman Sekolah',
    konteks: 'Sosial',
    cerita: 'OSIS ingin memagari **sekeliling** taman sekolah yang berbentuk juring. Pagar dijual per meter, dan dana OSIS terbatas.',
    info: [
      { label: 'Jari-jari taman', nilai: '14 m' },
      { label: 'Sudut pusat', nilai: '90°' },
      { label: 'Harga pagar', nilai: 'Rp45.000 per meter' },
      { label: 'Dana OSIS', nilai: 'Rp2.000.000' },
    ],
    gambar: { r: 14, alpha: 90, pi: '22/7', tampil: 'keduanya', nilai: false, satuan: 'm' },
    langkah: [
      {
        jenis: 'pilihan', fase: 'rumuskan',
        tanya: 'Bagian taman mana yang harus dipagari?',
        pilihan: ['Hanya busurnya', 'Busur dan dua jari-jari', 'Seluruh luas taman'],
        benar: 1, alasan: '“Sekeliling” juring = busur + 2 jari-jari.',
      },
      {
        jenis: 'isian', fase: 'hitung',
        tanya: 'Berapa panjang busur taman? (π = 22/7)',
        kunci: 22, satuan: 'm',
        petunjuk: 'Panjang busur = 90/360 × 2 × 22/7 × 14.',
        pembahasan: ['$\\frac{90}{360} \\times 2 \\times \\frac{22}{7} \\times 14 = \\frac{1}{4} \\times 88 = 22$', 'Panjang busur = **22 m**'],
        soal: { data: { r: 14, alpha: 90, pi: '22/7' }, ditanya: 'busur' },
      },
      {
        jenis: 'isian', fase: 'hitung',
        tanya: 'Berapa panjang pagar yang dibutuhkan?',
        kunci: 50, satuan: 'm',
        petunjuk: 'Pagar = busur + 2 jari-jari.',
        pembahasan: ['$22 + 2 \\times 14 = 50$', 'Panjang pagar = **50 m**'],
        soal: { data: { r: 14, alpha: 90, pi: '22/7' }, ditanya: 'kelilingJuring' },
      },
      {
        jenis: 'isian', fase: 'hitung',
        tanya: 'Berapa rupiah biaya pagar seluruhnya?',
        kunci: 2250000, satuan: 'rupiah', ribuan: true,
        petunjuk: 'Kalikan panjang pagar dengan harga per meter: 50 × 45.000.',
        pembahasan: ['$50 \\times 45.000 = 2.250.000$', 'Biaya pagar = **Rp2.250.000**'],
      },
      {
        jenis: 'pernyataan', fase: 'tafsirkan',
        tanya: 'Tandai setiap pernyataan: Benar atau Salah?',
        pernyataan: [
          { teks: 'Dana OSIS cukup untuk membeli seluruh pagar.', benar: false, alasan: 'Biaya Rp2.250.000 lebih besar dari dana Rp2.000.000.' },
          { teks: 'OSIS kekurangan dana Rp250.000.', benar: true, alasan: '2.250.000 − 2.000.000 = 250.000.' },
          { teks: 'Jika sudut taman hanya 60°, pagar yang dibutuhkan lebih pendek.', benar: true, alasan: 'Busurnya lebih pendek (≈ 14,67 m), jadi pagar ≈ 42,67 m.' },
        ],
      },
      {
        jenis: 'uraian', fase: 'jelaskan',
        tanya: 'Berikan satu saran agar dana OSIS cukup. Sertakan perhitunganmu.',
        contohJawaban: 'Dana cukup untuk 2.000.000 ÷ 45.000 ≈ 44,4 m pagar. Misalnya, sisi yang menempel tembok tidak dipagari: busur + satu jari-jari = 22 + 14 = 36 m → 36 × 45.000 = Rp1.620.000. Dana cukup.',
        ceklis: ['Saran masuk akal untuk konteks taman sekolah', 'Ada perhitungan panjang pagar atau biaya', 'Menunjukkan bahwa biaya ≤ Rp2.000.000'],
      },
    ],
  },
  {
    id: 'wiper',
    judul: 'Wiper Mobil',
    konteks: 'Saintifik',
    cerita:
      'Wiper mobil berputar pada sebuah poros. Karet wiper **tidak** menempel sampai ke poros, jadi kaca di dekat poros tidak ikut bersih.',
    info: [
      { label: 'Panjang lengan wiper', nilai: '42 cm' },
      { label: 'Karet menempel dari', nilai: '21 cm s.d. 42 cm dari poros' },
      { label: 'Sudut sapuan', nilai: '120°' },
    ],
    ilustrasi: 'wiper',
    langkah: [
      {
        jenis: 'pilihan', fase: 'rumuskan',
        tanya: 'Daerah kaca yang dibersihkan berbentuk…',
        pilihan: ['Juring besar (jari-jari 42 cm)', 'Juring besar dikurangi juring kecil', 'Juring kecil (jari-jari 21 cm)'],
        benar: 1, alasan: 'Bagian dekat poros (juring kecil) tidak tersapu karet.',
      },
      {
        jenis: 'isian', fase: 'hitung',
        tanya: 'Luas juring besar (r = 42 cm, α = 120°)? (π = 22/7)',
        kunci: 1848, satuan: 'cm²',
        petunjuk: '120/360 = 1/3. Luas = 1/3 × 22/7 × 42 × 42.',
        pembahasan: ['$\\frac{1}{3} \\times \\frac{22}{7} \\times 42 \\times 42 = \\frac{1}{3} \\times 5544 = 1848$'],
        soal: { data: { r: 42, alpha: 120, pi: '22/7' }, ditanya: 'juring' },
      },
      {
        jenis: 'isian', fase: 'hitung',
        tanya: 'Luas juring kecil (r = 21 cm, α = 120°)?',
        kunci: 462, satuan: 'cm²',
        petunjuk: 'Luas = 1/3 × 22/7 × 21 × 21.',
        pembahasan: ['$\\frac{1}{3} \\times \\frac{22}{7} \\times 21 \\times 21 = \\frac{1}{3} \\times 1386 = 462$'],
        soal: { data: { r: 21, alpha: 120, pi: '22/7' }, ditanya: 'juring' },
      },
      {
        jenis: 'isian', fase: 'hitung',
        tanya: 'Berapa luas kaca yang dibersihkan wiper?',
        kunci: 1386, satuan: 'cm²',
        petunjuk: 'Juring besar dikurangi juring kecil.',
        pembahasan: ['$1848 - 462 = 1386$', 'Luas kaca yang dibersihkan = **1.386 cm²**'],
      },
      {
        jenis: 'pernyataan', fase: 'tafsirkan',
        tanya: 'Tandai setiap pernyataan: Benar atau Salah?',
        pernyataan: [
          { teks: 'Luas yang dibersihkan sama dengan ¾ luas juring besar.', benar: true, alasan: '1386 ÷ 1848 = 0,75 = ¾.' },
          { teks: 'Jika karet menempel mulai dari poros, luas yang dibersihkan menjadi 1.848 cm².', benar: true, alasan: 'Tidak ada lagi juring kecil yang dikurangkan.' },
          { teks: 'Dalam satu sapuan, ujung wiper menempuh lintasan 44 cm.', benar: false, alasan: 'Lintasan ujung = busur r = 42 cm: 1/3 × 2 × 22/7 × 42 = 88 cm.' },
        ],
      },
      {
        jenis: 'uraian', fase: 'jelaskan',
        tanya: 'Mengapa produsen mobil tidak membuat karet wiper menempel sampai ke poros? Hubungkan dengan luas yang dibersihkan.',
        contohJawaban: 'Bagian dekat poros hanya juring kecil (462 cm²), yaitu ¼ dari juring besar. Bagian itu biasanya di tepi kaca yang jarang dipakai untuk melihat, jadi tidak terlalu penting dibersihkan. Karet yang lebih pendek juga lebih ringan.',
        ceklis: ['Menyebut bahwa bagian dekat poros luasnya kecil (¼ juring besar)', 'Mengaitkan dengan fungsi kaca untuk melihat', 'Alasan logis dan runtut'],
      },
    ],
  },
  {
    id: 'bianglala',
    judul: 'Bianglala Pasar Malam',
    konteks: 'Sosial',
    cerita: 'Bianglala di pasar malam berputar dengan kecepatan tetap. Kabin-kabinnya terpasang di tepi roda dengan jarak yang sama.',
    info: [
      { label: 'Diameter roda', nilai: '42 m' },
      { label: 'Jumlah kabin', nilai: '12' },
      { label: 'Satu putaran penuh', nilai: '6 menit' },
    ],
    gambar: { r: 21, alpha: 30, pi: '22/7', tampil: 'busur', nilai: false, label: false, satuan: 'm' },
    langkah: [
      {
        jenis: 'pilihan', fase: 'rumuskan',
        tanya: 'Berapa sudut pusat antara dua kabin yang berdekatan?',
        pilihan: ['12°', '30°', '36°'],
        benar: 1, alasan: '12 kabin berjarak sama: 360° ÷ 12 = 30°.',
      },
      {
        jenis: 'isian', fase: 'hitung',
        tanya: 'Berapa panjang lintasan (busur) antara dua kabin berdekatan? (π = 22/7)',
        kunci: 11, satuan: 'm',
        petunjuk: 'r = 21 m. Busur = 30/360 × 2 × 22/7 × 21.',
        pembahasan: ['Keliling $= 2 \\times \\frac{22}{7} \\times 21 = 132$', '$\\frac{1}{12} \\times 132 = 11$', 'Panjang busur = **11 m**'],
        soal: { data: { d: 42, alpha: 30, pi: '22/7' }, ditanya: 'busur' },
      },
      {
        jenis: 'isian', fase: 'hitung',
        tanya: 'Berapa meter lintasan sebuah kabin dalam 1 menit?',
        kunci: 22, satuan: 'm',
        petunjuk: '1 menit = 1/6 putaran = 60°. Atau: keliling ÷ 6.',
        pembahasan: ['1 menit $= \\frac{1}{6}$ putaran $= 60^\\circ$', '$\\frac{1}{6} \\times 132 = 22$', 'Lintasan dalam 1 menit = **22 m**'],
        soal: { data: { r: 21, alpha: 60, pi: '22/7' }, ditanya: 'busur' },
      },
      {
        jenis: 'pernyataan', fase: 'tafsirkan',
        tanya: 'Tandai setiap pernyataan: Benar atau Salah?',
        pernyataan: [
          { teks: 'Dalam 3 menit, kabin menempuh setengah putaran (66 m).', benar: true, alasan: '3 menit = ½ putaran; ½ × 132 = 66 m.' },
          { teks: 'Jarak lurus (garis lurus) antara dua kabin berdekatan adalah 11 m.', benar: false, alasan: '11 m adalah panjang busur (melengkung). Jarak garis lurusnya lebih pendek.' },
          { teks: 'Jika diameter roda dua kali lipat dan waktu satu putaran tetap 6 menit, kabin bergerak dua kali lebih jauh tiap menit.', benar: true, alasan: 'Keliling ikut dua kali lipat, jadi lintasan per menit juga dua kali lipat.' },
        ],
      },
      {
        jenis: 'uraian', fase: 'jelaskan',
        tanya: 'Rina naik dari kabin paling bawah. Setelah 2 menit, sudah berapa derajat ia berputar dan berapa meter lintasannya? Jelaskan caramu.',
        contohJawaban: '2 menit = 2/6 = 1/3 putaran. Sudutnya 1/3 × 360° = 120°. Lintasannya 1/3 × 132 m = 44 m.',
        ceklis: ['Mengubah 2 menit menjadi bagian putaran (1/3)', 'Sudut = 120°', 'Lintasan = 44 m'],
      },
    ],
  },
];

/** Langkah isian yang punya data soal standar → untuk diperiksa ulang oleh Python. */
export function soalTerverifikasi(m: Misi) {
  return m.langkah.flatMap((l, i) =>
    l.jenis === 'isian' && l.soal ? [{ id: `${m.id}-${i + 1}`, data: l.soal.data, ditanya: l.soal.ditanya, kunci: l.kunci }] : [],
  );
}
