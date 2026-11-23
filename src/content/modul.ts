// Urutan modul sesuai alur belajar di docs/03-desain-pembelajaran.md §3.
// Di Beranda, setiap modul tampil sebagai "pos" pada peta Petualangan Negeri Lingkaran.
export interface Modul {
  id: string;
  path: string;
  judul: string;
  ringkas: string;
  /** Nama pos di peta petualangan. */
  pos: string;
  ikon: string;
}

export const MODUL: Modul[] = [
  { id: 'prasyarat', path: '/prasyarat', judul: 'Ingat Lagi', ringkas: 'Jari-jari, diameter, sudut pusat', pos: 'Bekal Petualang', ikon: '🎒' },
  { id: 'konsep', path: '/konsep', judul: 'Busur vs Juring', ringkas: 'Panjang atau luas?', pos: 'Hutan Busur & Juring', ikon: '🍕' },
  { id: 'simulasi', path: '/simulasi', judul: 'Simulasi', ringkas: 'Geser sudut dan jari-jari', pos: 'Laboratorium Lingkaran', ikon: '🔬' },
  { id: 'contoh', path: '/contoh', judul: 'Contoh Soal', ringkas: 'Langkah demi langkah', pos: 'Perpustakaan Contoh', ikon: '📖' },
  { id: 'latihan', path: '/latihan', judul: 'Latihan', ringkas: 'Cek jawaban dan pembahasan', pos: 'Arena Latihan', ikon: '🏹' },
  { id: 'cerita', path: '/cerita', judul: 'Soal Cerita', ringkas: 'Tandai yang diketahui', pos: 'Desa Soal Cerita', ikon: '📜' },
  { id: 'literasi', path: '/literasi', judul: 'Misi Literasi', ringkas: 'Matematika di sekitar kita', pos: 'Misi Dunia Nyata', ikon: '🗺️' },
];
