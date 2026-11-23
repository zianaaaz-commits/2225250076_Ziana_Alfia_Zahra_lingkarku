// Foto konteks & maskot (file di public/gambar/, diolah oleh python/olah_gambar.py).
// Foto hanya dipakai pada soal yang konteksnya sesuai (pizza), sebagai pelengkap
// diagram berlabel — bukan pengganti (CLAUDE.md §5 aturan 3 & 10).

export type FotoId = 'pizza-utuh' | 'pizza-garis-seperempat' | 'pizza-seperempat' | 'pizza-8-potong';

export const FOTO: Record<FotoId, { alt: string }> = {
  'pizza-utuh': { alt: 'Sebuah pizza utuh berbentuk lingkaran' },
  'pizza-garis-seperempat': { alt: 'Pizza dengan garis potong membentuk seperempat lingkaran (sudut 90°)' },
  'pizza-seperempat': { alt: 'Seperempat potong pizza: daerahnya juring, pinggiran rotinya busur' },
  'pizza-8-potong': { alt: 'Pizza yang dipotong menjadi 8 bagian sama besar' },
};

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
  { nama: 'Lagu latar', sumber: 'Komposisi orisinal, disintesis dengan python/buat_lagu.py' },
  { nama: 'Ikon, diagram lingkaran & ilustrasi wiper', sumber: 'Dibuat sendiri (SVG)' },
];
