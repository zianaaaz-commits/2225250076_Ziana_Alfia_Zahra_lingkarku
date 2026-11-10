// Urutan modul sesuai alur belajar di docs/03-desain-pembelajaran.md §3.
export interface Modul {
  id: string;
  path: string;
  judul: string;
  ringkas: string;
}

export const MODUL: Modul[] = [
  { id: 'prasyarat', path: '/prasyarat', judul: 'Ingat Lagi', ringkas: 'Jari-jari, diameter, sudut pusat' },
  { id: 'konsep', path: '/konsep', judul: 'Busur vs Juring', ringkas: 'Panjang atau luas?' },
  { id: 'simulasi', path: '/simulasi', judul: 'Simulasi', ringkas: 'Geser sudut dan jari-jari' },
  { id: 'contoh', path: '/contoh', judul: 'Contoh Soal', ringkas: 'Langkah demi langkah' },
  { id: 'latihan', path: '/latihan', judul: 'Latihan', ringkas: 'Cek jawaban dan pembahasan' },
  { id: 'cerita', path: '/cerita', judul: 'Soal Cerita', ringkas: 'Tandai yang diketahui' },
  { id: 'literasi', path: '/literasi', judul: 'Misi Literasi', ringkas: 'Matematika di sekitar kita' },
];
