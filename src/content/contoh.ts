import type { Tampil } from '../components/CircleSVG';
import type { Langkah } from '../components/StepReveal';
import type { Pi } from '../lib/geometri';
import { RUMUS_BUSUR, RUMUS_JURING } from '../lib/latex';
import type { DataSoal, Ditanya } from '../lib/soal';

// F4 — Contoh soal bertahap + soal melengkapi (docs/04-konten-materi.md §4).
// Kunci jawaban diuji di src/tests/contoh.test.ts.

export interface GambarSoal {
  r: number;
  alpha: number;
  pi: Pi;
  tampil: Tampil;
  nilai?: boolean;
  label?: boolean;
  satuan?: 'cm' | 'm';
  teksSudut?: string;
  teksR?: string;
}

export interface Isian {
  label: string;
  sebelum: string;
  kunci: number;
  satuan?: string;
  petunjuk: string;
}

export interface Melengkapi {
  soal: string;
  gambar?: GambarSoal;
  langkah: (Langkah | Isian)[];
  jawaban: { data: DataSoal; ditanya: Ditanya; nilai: number };
}

export interface Contoh {
  id: string;
  judul: string;
  soal: string;
  gambar?: GambarSoal;
  langkah: Langkah[];
  jawaban: { data: DataSoal; ditanya: Ditanya; nilai: number };
  melengkapi: Melengkapi;
}

export const apakahIsian = (l: Langkah | Isian): l is Isian => 'kunci' in l;

const PI_227 = String.raw`$\pi = \frac{22}{7}$`;

export const CONTOH: Contoh[] = [
  {
    id: 'C1',
    judul: 'Panjang busur',
    soal: 'Jari-jari lingkaran 14 cm dan sudut pusatnya 90°. Berapa panjang busurnya? (π = 22/7)',
    gambar: { r: 14, alpha: 90, pi: '22/7', tampil: 'busur', nilai: false },
    langkah: [
      { label: 'Diketahui', isi: String.raw`$r = 14$ cm, $\alpha = 90^\circ$, ${PI_227}` },
      { label: 'Ditanya', isi: 'Panjang busur. Yang ditanya **panjang** → pakai keliling $2\\pi r$.' },
      { label: 'Rumus', isi: RUMUS_BUSUR },
      { label: 'Substitusi', isi: String.raw`$= \frac{90}{360} \times 2 \times \frac{22}{7} \times 14$` },
      { label: 'Hitung', isi: String.raw`$= \frac{1}{4} \times 88 = 22$` },
      { label: 'Jawaban', isi: 'Panjang busur = **22 cm**' },
    ],
    jawaban: { data: { r: 14, alpha: 90, pi: '22/7' }, ditanya: 'busur', nilai: 22 },
    melengkapi: {
      soal: 'Jari-jari 21 cm dan sudut pusat 60°. Berapa panjang busurnya? (π = 22/7)',
      gambar: { r: 21, alpha: 60, pi: '22/7', tampil: 'busur', nilai: false },
      langkah: [
        { label: 'Diketahui', isi: String.raw`$r = 21$ cm, $\alpha = 60^\circ$, ${PI_227}` },
        { label: 'Rumus', isi: RUMUS_BUSUR },
        { label: 'Keliling', sebelum: String.raw`$2 \times \frac{22}{7} \times 21 =$`, kunci: 132, petunjuk: 'Bagi 21 dengan 7 dulu: 2 × 22 × 3.' },
        { label: 'Pecahan sudut', isi: String.raw`$\frac{60}{360} = \frac{1}{6}$` },
        { label: 'Panjang busur', sebelum: String.raw`$\frac{1}{6} \times 132 =$`, kunci: 22, satuan: 'cm', petunjuk: 'Hitung 132 ÷ 6.' },
      ],
      jawaban: { data: { r: 21, alpha: 60, pi: '22/7' }, ditanya: 'busur', nilai: 22 },
    },
  },
  {
    id: 'C2',
    judul: 'Luas juring',
    soal: 'Jari-jari lingkaran 10 cm dan sudut pusatnya 72°. Berapa luas juringnya? (π = 3,14)',
    gambar: { r: 10, alpha: 72, pi: '3.14', tampil: 'juring', nilai: false },
    langkah: [
      { label: 'Diketahui', isi: String.raw`$r = 10$ cm, $\alpha = 72^\circ$, $\pi = 3{,}14$` },
      { label: 'Ditanya', isi: 'Luas juring. Yang ditanya **luas** → pakai $\\pi r^2$.' },
      { label: 'Rumus', isi: RUMUS_JURING },
      { label: 'Substitusi', isi: String.raw`$= \frac{72}{360} \times 3{,}14 \times 10 \times 10$` },
      { label: 'Hitung', isi: String.raw`$= \frac{1}{5} \times 314 = 62{,}8$` },
      { label: 'Jawaban', isi: 'Luas juring = **62,8 cm²**' },
    ],
    jawaban: { data: { r: 10, alpha: 72, pi: '3.14' }, ditanya: 'juring', nilai: 62.8 },
    melengkapi: {
      soal: 'Jari-jari 20 cm dan sudut pusat 36°. Berapa luas juringnya? (π = 3,14)',
      gambar: { r: 20, alpha: 36, pi: '3.14', tampil: 'juring', nilai: false },
      langkah: [
        { label: 'Diketahui', isi: String.raw`$r = 20$ cm, $\alpha = 36^\circ$, $\pi = 3{,}14$` },
        { label: 'Rumus', isi: RUMUS_JURING },
        { label: 'Luas lingkaran', sebelum: String.raw`$3{,}14 \times 20 \times 20 =$`, kunci: 1256, petunjuk: '20 × 20 = 400, lalu kalikan 3,14.' },
        { label: 'Pecahan sudut', isi: String.raw`$\frac{36}{360} = \frac{1}{10}$` },
        { label: 'Luas juring', sebelum: String.raw`$\frac{1}{10} \times 1256 =$`, kunci: 125.6, satuan: 'cm²', petunjuk: 'Bagi 1256 dengan 10.' },
      ],
      jawaban: { data: { r: 20, alpha: 36, pi: '3.14' }, ditanya: 'juring', nilai: 125.6 },
    },
  },
  {
    id: 'C3',
    judul: 'Mencari sudut pusat',
    soal: 'Panjang busur 44 cm dan jari-jari 21 cm. Berapa sudut pusatnya? (π = 22/7)',
    gambar: { r: 21, alpha: 120, pi: '22/7', tampil: 'busur', nilai: true, teksSudut: '?' },
    langkah: [
      { label: 'Diketahui', isi: String.raw`Panjang busur $= 44$ cm, $r = 21$ cm, ${PI_227}` },
      { label: 'Ditanya', isi: String.raw`Sudut pusat $\alpha$` },
      { label: 'Rumus', isi: RUMUS_BUSUR },
      { label: 'Hitung keliling', isi: String.raw`$2 \times \frac{22}{7} \times 21 = 132$` },
      { label: 'Substitusi', isi: String.raw`$44 = \frac{\alpha}{360^\circ} \times 132$` },
      { label: 'Cari pecahan sudut', isi: String.raw`$\frac{\alpha}{360^\circ} = \frac{44}{132} = \frac{1}{3}$` },
      { label: 'Hitung sudut', isi: String.raw`$\alpha = \frac{1}{3} \times 360^\circ = 120^\circ$` },
      { label: 'Jawaban', isi: 'Sudut pusat = **120°**' },
    ],
    jawaban: { data: { busur: 44, r: 21, pi: '22/7' }, ditanya: 'sudutDariBusur', nilai: 120 },
    melengkapi: {
      soal: 'Panjang busur 22 cm dan jari-jari 14 cm. Berapa sudut pusatnya? (π = 22/7)',
      gambar: { r: 14, alpha: 90, pi: '22/7', tampil: 'busur', nilai: true, teksSudut: '?' },
      langkah: [
        { label: 'Diketahui', isi: String.raw`Panjang busur $= 22$ cm, $r = 14$ cm, ${PI_227}` },
        { label: 'Rumus', isi: RUMUS_BUSUR },
        { label: 'Keliling', sebelum: String.raw`$2 \times \frac{22}{7} \times 14 =$`, kunci: 88, petunjuk: 'Bagi 14 dengan 7 dulu: 2 × 22 × 2.' },
        { label: 'Pecahan sudut', isi: String.raw`$\frac{\alpha}{360^\circ} = \frac{22}{88} = \frac{1}{4}$` },
        { label: 'Sudut pusat', sebelum: String.raw`$\alpha = \frac{1}{4} \times 360^\circ =$`, kunci: 90, satuan: '°', petunjuk: 'Hitung 360 ÷ 4.' },
      ],
      jawaban: { data: { busur: 22, r: 14, pi: '22/7' }, ditanya: 'sudutDariBusur', nilai: 90 },
    },
  },
  {
    id: 'C4',
    judul: 'Mencari jari-jari',
    soal: 'Luas juring 77 cm² dan sudut pusatnya 45°. Berapa jari-jarinya? (π = 22/7)',
    gambar: { r: 14, alpha: 45, pi: '22/7', tampil: 'juring', nilai: false, teksR: '?' },
    langkah: [
      { label: 'Diketahui', isi: String.raw`Luas juring $= 77$ cm², $\alpha = 45^\circ$, ${PI_227}` },
      { label: 'Ditanya', isi: 'Jari-jari $r$' },
      { label: 'Rumus', isi: RUMUS_JURING },
      { label: 'Substitusi', isi: String.raw`$77 = \frac{45}{360} \times \frac{22}{7} \times r^2 = \frac{1}{8} \times \frac{22}{7} \times r^2$` },
      { label: 'Kalikan 8', isi: String.raw`$\frac{22}{7} \times r^2 = 77 \times 8 = 616$` },
      { label: 'Cari r²', isi: String.raw`$r^2 = 616 \times \frac{7}{22} = 196$` },
      { label: 'Tarik akar', isi: String.raw`$r = \sqrt{196} = 14$` },
      { label: 'Jawaban', isi: 'Jari-jari = **14 cm**' },
    ],
    jawaban: { data: { luas: 77, alpha: 45, pi: '22/7' }, ditanya: 'jariDariJuring', nilai: 14 },
    melengkapi: {
      soal: 'Luas juring 38,5 cm² dan sudut pusatnya 90°. Berapa jari-jarinya? (π = 22/7)',
      gambar: { r: 7, alpha: 90, pi: '22/7', tampil: 'juring', nilai: false, teksR: '?' },
      langkah: [
        { label: 'Substitusi', isi: String.raw`$38{,}5 = \frac{1}{4} \times \frac{22}{7} \times r^2$` },
        { label: 'Kalikan 4', isi: String.raw`$\frac{22}{7} \times r^2 = 38{,}5 \times 4 = 154$` },
        { label: 'Cari r²', sebelum: String.raw`$r^2 = 154 \times \frac{7}{22} =$`, kunci: 49, petunjuk: '154 ÷ 22 = 7, lalu kalikan 7.' },
        { label: 'Tarik akar', sebelum: String.raw`$r = \sqrt{49} =$`, kunci: 7, satuan: 'cm', petunjuk: 'Bilangan berapa jika dikuadratkan hasilnya 49?' },
      ],
      jawaban: { data: { luas: 38.5, alpha: 90, pi: '22/7' }, ditanya: 'jariDariJuring', nilai: 7 },
    },
  },
  {
    id: 'C5',
    judul: 'Perbandingan sudut',
    soal: '∠AOB = 60° dan panjang busur AB = 10 cm. Jika ∠COD = 150° (lingkaran yang sama), berapa panjang busur CD?',
    langkah: [
      { label: 'Diketahui', isi: String.raw`$\angle AOB = 60^\circ$, busur AB $= 10$ cm, $\angle COD = 150^\circ$` },
      { label: 'Ditanya', isi: 'Panjang busur CD' },
      { label: 'Konsep', isi: 'Busur **sebanding** dengan sudut pusat: $\\frac{\\text{busur CD}}{\\text{busur AB}} = \\frac{\\angle COD}{\\angle AOB}$' },
      { label: 'Substitusi', isi: String.raw`$\frac{\text{busur CD}}{10} = \frac{150}{60} = 2{,}5$` },
      { label: 'Hitung', isi: String.raw`busur CD $= 2{,}5 \times 10 = 25$` },
      { label: 'Jawaban', isi: 'Panjang busur CD = **25 cm**' },
    ],
    jawaban: { data: { nilai1: 10, alpha1: 60, alpha2: 150, pi: '22/7' }, ditanya: 'perbandingan', nilai: 25 },
    melengkapi: {
      soal: '∠AOB = 45° dan panjang busur AB = 12 cm. Jika ∠COD = 135°, berapa panjang busur CD?',
      langkah: [
        { label: 'Konsep', isi: String.raw`$\frac{\text{busur CD}}{\text{busur AB}} = \frac{\angle COD}{\angle AOB}$` },
        { label: 'Kelipatan sudut', sebelum: String.raw`$\frac{135}{45} =$`, kunci: 3, petunjuk: 'Berapa kali 45 sama dengan 135?' },
        { label: 'Busur CD', sebelum: String.raw`$3 \times 12 =$`, kunci: 36, satuan: 'cm', petunjuk: 'Kalikan kelipatan sudut dengan busur AB.' },
      ],
      jawaban: { data: { nilai1: 12, alpha1: 45, alpha2: 135, pi: '22/7' }, ditanya: 'perbandingan', nilai: 36 },
    },
  },
  {
    id: 'C6',
    judul: 'Soal cerita: pizza',
    soal: 'Sebuah pizza berdiameter 28 cm dipotong menjadi 8 bagian sama besar. Berapa luas satu potong? (π = 22/7)',
    gambar: { r: 14, alpha: 45, pi: '22/7', tampil: 'juring', nilai: false },
    langkah: [
      { label: 'Diketahui', isi: String.raw`$d = 28$ cm → $r = 28 \div 2 = 14$ cm` },
      { label: 'Diketahui', isi: String.raw`8 potong sama besar → $\alpha = 360^\circ \div 8 = 45^\circ$` },
      { label: 'Ditanya', isi: 'Luas satu potong. Yang ditanya **luas** → juring.' },
      { label: 'Rumus', isi: RUMUS_JURING },
      { label: 'Substitusi', isi: String.raw`$= \frac{45}{360} \times \frac{22}{7} \times 14 \times 14$` },
      { label: 'Hitung', isi: String.raw`$= \frac{1}{8} \times 616 = 77$` },
      { label: 'Jawaban', isi: 'Luas satu potong pizza = **77 cm²**' },
    ],
    jawaban: { data: { d: 28, alpha: 45, pi: '22/7' }, ditanya: 'juring', nilai: 77 },
    melengkapi: {
      soal: 'Pizza berdiameter 42 cm dipotong menjadi 6 bagian sama besar. Berapa luas satu potong? (π = 22/7)',
      gambar: { r: 21, alpha: 60, pi: '22/7', tampil: 'juring', nilai: false, teksSudut: '?' },
      langkah: [
        { label: 'Jari-jari', isi: String.raw`$r = 42 \div 2 = 21$ cm` },
        { label: 'Sudut pusat', sebelum: String.raw`$\alpha = 360^\circ \div 6 =$`, kunci: 60, satuan: '°', petunjuk: '6 potong sama besar: bagi 360° dengan 6.' },
        { label: 'Luas lingkaran', isi: String.raw`$\frac{22}{7} \times 21 \times 21 = 1386$` },
        { label: 'Luas satu potong', sebelum: String.raw`$\frac{1}{6} \times 1386 =$`, kunci: 231, satuan: 'cm²', petunjuk: 'Bagi 1386 dengan 6.' },
      ],
      jawaban: { data: { d: 42, alpha: 60, pi: '22/7' }, ditanya: 'juring', nilai: 231 },
    },
  },
];
