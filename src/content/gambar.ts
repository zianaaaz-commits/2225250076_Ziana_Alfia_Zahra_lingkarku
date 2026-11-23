// Foto/ilustrasi konteks & maskot (file di public/gambar/).
// Gambar hanya dipakai pada soal yang konteksnya SAMA dengan gambarnya, sebagai pelengkap
// diagram berlabel — bukan pengganti (CLAUDE.md §5 aturan 3 & 10).

export type FotoId =
  | 'pizza-utuh'
  | 'pizza-garis-seperempat'
  | 'pizza-seperempat'
  | 'pizza-8-potong'
  | 'jam'
  | 'taman'
  | 'pagar'
  | 'penyiram'
  | 'bandul'
  | 'kue'
  | 'wiper'
  | 'bianglala';

interface InfoFoto {
  alt: string;
  /** webp = foto/ilustrasi stok (olah_gambar.py), svg = ilustrasi buatan sendiri */
  ext: 'webp' | 'svg';
  /** Kata kunci yang harus muncul di teks soal pemakai gambar ini (dicek oleh tes). */
  kata: string;
}

export const FOTO: Record<FotoId, InfoFoto> = {
  'pizza-utuh': { alt: 'Sebuah pizza utuh berbentuk lingkaran', ext: 'webp', kata: 'pizza' },
  'pizza-garis-seperempat': { alt: 'Pizza dengan garis potong membentuk seperempat lingkaran (sudut 90°)', ext: 'webp', kata: 'pizza' },
  'pizza-seperempat': { alt: 'Seperempat potong pizza: daerahnya juring, pinggiran rotinya busur', ext: 'webp', kata: 'pizza' },
  'pizza-8-potong': { alt: 'Pizza yang dipotong menjadi 8 bagian sama besar', ext: 'webp', kata: 'pizza' },
  jam: { alt: 'Jam dinding: ujung jarum menit bergerak dari angka 12 ke angka 3 selama 15 menit, membentuk busur', ext: 'svg', kata: 'jarum' },
  taman: { alt: 'Taman rumput berbentuk juring dengan sudut 90°, dilihat dari atas', ext: 'svg', kata: 'taman' },
  pagar: { alt: 'Pagar mengelilingi taman berbentuk juring: sepanjang busur dan dua jari-jari', ext: 'svg', kata: 'pagar' },
  penyiram: { alt: 'Alat penyiram berputar 120°; daerah yang tersiram berbentuk juring', ext: 'svg', kata: 'penyiram' },
  bandul: { alt: 'Bandul berayun membentuk sudut 60°; lintasan ujung bandul berbentuk busur', ext: 'svg', kata: 'bandul' },
  kue: { alt: 'Kue ulang tahun dilihat dari atas, dipotong menjadi 8 bagian sama besar', ext: 'svg', kata: 'kue' },
  wiper: { alt: 'Kaca mobil saat hujan; wiper membersihkan daerah juring besar dikurangi juring kecil', ext: 'svg', kata: 'wiper' },
  bianglala: { alt: 'Bianglala pasar malam dengan 12 kabin; jarak dua kabin berdekatan adalah busur 30°', ext: 'svg', kata: 'bianglala' },
};

export const urlFoto = (id: FotoId, base = ''): string => `${base}gambar/${id}.${FOTO[id].ext}`;

export const MASKOT = {
  nama: 'Si Bulat',
  alt: 'Si Bulat, maskot LingkarKu: lingkaran oranye bertopi wisuda yang melambaikan tangan',
};

/** Pizza dipotong n bagian → foto yang paling sesuai. */
export const fotoPizza = (n: number): FotoId =>
  n === 8 ? 'pizza-8-potong' : n === 4 ? 'pizza-garis-seperempat' : 'pizza-utuh';

/** Daftar sumber gambar untuk halaman Kredit (lengkapi sesuai lisensi asli). */
export const KREDIT = [
  { nama: 'Ilustrasi pizza (utuh, seperempat, 8 potong)', sumber: 'Ilustrasi stok — lengkapi nama pembuat & situs sumber' },
  { nama: 'Maskot Si Bulat', sumber: 'Ilustrasi 3D stok — lengkapi nama pembuat & situs sumber' },
  { nama: 'Ilustrasi jam, taman, pagar, penyiram, bandul, kue, wiper, bianglala', sumber: 'Dibuat sendiri (SVG) untuk LingkarKu' },
  { nama: 'Lagu latar', sumber: 'Komposisi orisinal, disintesis dengan python/buat_lagu.py' },
  { nama: 'Ikon, diagram lingkaran & peta petualangan', sumber: 'Dibuat sendiri (SVG)' },
];
