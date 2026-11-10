// Mini-game "Busur atau Juring?" (F2). 10 butir, docs/02-spesifikasi-produk.md F2.

export interface ButirGame {
  teks: string;
  /** Jika diisi, tampilkan gambar yang hanya menyorot bagian ini. */
  gambar?: 'busur' | 'juring';
  jawaban: 'busur' | 'juring';
  alasan: string;
}

export const GAME_BUSUR_JURING: ButirGame[] = [
  { teks: 'Bagian berwarna pada gambar ini adalah…', gambar: 'busur', jawaban: 'busur', alasan: 'Yang berwarna hanya garis lengkungnya.' },
  { teks: 'Bagian berwarna pada gambar ini adalah…', gambar: 'juring', jawaban: 'juring', alasan: 'Yang berwarna adalah daerahnya.' },
  { teks: 'Satuannya cm².', jawaban: 'juring', alasan: 'cm² adalah satuan luas.' },
  { teks: 'Bagian dari keliling lingkaran.', jawaban: 'busur', alasan: 'Busur adalah potongan keliling.' },
  { teks: 'Sepotong pizza.', jawaban: 'juring', alasan: 'Sepotong pizza adalah daerah.' },
  { teks: 'Pinggiran roti pada sepotong pizza.', jawaban: 'busur', alasan: 'Pinggiran adalah garis lengkung.' },
  { teks: 'Lintasan ujung jarum jam.', jawaban: 'busur', alasan: 'Lintasan diukur panjangnya.' },
  { teks: 'Daerah yang tersiram alat penyiram yang berputar.', jawaban: 'juring', alasan: 'Daerah diukur luasnya.' },
  { teks: 'Rumusnya memakai πr².', jawaban: 'juring', alasan: 'πr² adalah luas lingkaran.' },
  { teks: 'Pagar melengkung di tepi taman bundar.', jawaban: 'busur', alasan: 'Pagar diukur panjangnya.' },
];
