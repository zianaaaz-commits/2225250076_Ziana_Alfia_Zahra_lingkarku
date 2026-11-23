// Mini-game "Busur atau Juring?" (F2). 10 butir, docs/02-spesifikasi-produk.md F2.
import type { FotoId } from './gambar';

export interface ButirGame {
  teks: string;
  /** Jika diisi, tampilkan gambar yang hanya menyorot bagian ini. */
  gambar?: 'busur' | 'juring';
  /** Foto konteks dunia nyata. */
  foto?: FotoId;
  jawaban: 'busur' | 'juring';
  alasan: string;
}

export const GAME_BUSUR_JURING: ButirGame[] = [
  { teks: 'Bagian berwarna pada gambar ini adalah…', gambar: 'busur', jawaban: 'busur', alasan: 'Yang berwarna hanya garis lengkungnya.' },
  { teks: 'Bagian berwarna pada gambar ini adalah…', gambar: 'juring', jawaban: 'juring', alasan: 'Yang berwarna adalah daerahnya.' },
  { teks: 'Satuannya cm².', jawaban: 'juring', alasan: 'cm² adalah satuan luas.' },
  { teks: 'Bagian dari keliling lingkaran.', jawaban: 'busur', alasan: 'Busur adalah potongan keliling.' },
  { teks: 'Sepotong pizza.', foto: 'pizza-seperempat', jawaban: 'juring', alasan: 'Sepotong pizza adalah daerah.' },
  { teks: 'Pinggiran roti pada sepotong pizza.', foto: 'pizza-seperempat', jawaban: 'busur', alasan: 'Pinggiran adalah garis lengkung.' },
  { teks: 'Lintasan ujung jarum jam.', jawaban: 'busur', alasan: 'Lintasan diukur panjangnya.' },
  { teks: 'Daerah yang tersiram alat penyiram yang berputar.', jawaban: 'juring', alasan: 'Daerah diukur luasnya.' },
  { teks: 'Rumusnya memakai πr².', jawaban: 'juring', alasan: 'πr² adalah luas lingkaran.' },
  { teks: 'Pagar melengkung di tepi taman bundar.', jawaban: 'busur', alasan: 'Pagar diukur panjangnya.' },
];
