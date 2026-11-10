// Mesin umpan balik: mendiagnosis jenis kesalahan dari jawaban siswa
// (docs/04-konten-materi.md §6). Urutan kandidat = prioritas diagnosis.
import {
  jariDariBusur,
  jariDariJuring,
  keliling,
  kiraSama,
  luasJuring,
  luasLingkaran,
  panjangBusur,
  type Pi,
} from './geometri';
import { hitungKunci, jariSoal, type Ditanya, type Soal } from './soal';

export type KodeKesalahan =
  | 'E1' // rumus tertukar (busur ↔ juring)
  | 'E2' // diameter dipakai sebagai jari-jari
  | 'E3' // lupa mengalikan pecahan sudut
  | 'E4' // membagi 180°, bukan 360°
  | 'E5' // busur memakai πr (tanpa 2)
  | 'E6' // juring memakai 2πr²
  | 'E7' // cari sudut: lupa × 360°
  | 'E8' // cari r: lupa akar
  | 'E9' // nilai π berbeda
  | 'E10' // pembulatan
  | 'E11' // keliling juring: lupa menambah 2 jari-jari
  | 'E12' // menjawab diameter, bukan jari-jari
  | 'E13'; // perbandingan terbalik

export interface HasilCek {
  benar: boolean;
  kode?: KodeKesalahan;
  pesan: string;
}

interface Kandidat {
  kode: KodeKesalahan;
  nilai: number;
  pesan: string;
}

type SoalCek = Pick<Soal, 'data' | 'ditanya'>;

const piLain = (p: Pi): Pi => (p === '22/7' ? '3.14' : '22/7');
const teksPi = (p: Pi) => (p === '22/7' ? '22/7' : '3,14');

const PESAN = {
  diameter: 'Yang diketahui **diameter**. Ubah dulu: r = d ÷ 2.',
  ke360: 'Satu putaran penuh = **360°**, bukan 180°.',
  pecahanSudut: 'Itu baru **pecahannya**. Kalikan dengan 360° untuk mendapat sudutnya.',
  jawabDiameter: 'Itu **diameter**. Yang ditanya jari-jari: r = d ÷ 2.',
};

function daftarKandidat(soal: SoalCek): Kandidat[] {
  const { data } = soal;
  const p = data.pi;
  const benar = hitungKunci(soal);
  const e9: Kandidat = {
    kode: 'E9',
    nilai: hitungKunci({ ...soal, data: { ...data, pi: piLain(p) } }),
    pesan: `Hampir benar! Soal ini memakai π = ${teksPi(p)}.`,
  };
  const out: Kandidat[] = [];

  switch (soal.ditanya) {
    case 'busur': {
      const a = data.alpha!;
      const r = jariSoal(data);
      if (data.d !== undefined) out.push({ kode: 'E2', nilai: panjangBusur(a, data.d, p), pesan: PESAN.diameter });
      out.push(
        { kode: 'E1', nilai: luasJuring(a, r, p), pesan: 'Kamu memakai rumus **luas juring**, padahal yang ditanya **panjang busur**. Panjang → pakai keliling 2πr.' },
        { kode: 'E3', nilai: keliling(r, p), pesan: 'Itu keliling **seluruh** lingkaran. Busur hanya bagian α/360° saja.' },
        { kode: 'E4', nilai: 2 * benar, pesan: PESAN.ke360 },
        { kode: 'E5', nilai: benar / 2, pesan: 'Keliling lingkaran = **2**πr. Cek apakah angka 2 terlewat.' },
        e9,
      );
      break;
    }
    case 'juring': {
      const a = data.alpha!;
      const r = jariSoal(data);
      if (data.d !== undefined) out.push({ kode: 'E2', nilai: luasJuring(a, data.d, p), pesan: PESAN.diameter });
      out.push(
        { kode: 'E1', nilai: panjangBusur(a, r, p), pesan: 'Kamu memakai rumus **panjang busur**, padahal yang ditanya **luas juring**. Luas → pakai πr².' },
        { kode: 'E3', nilai: luasLingkaran(r, p), pesan: 'Itu luas **seluruh** lingkaran. Juring hanya bagian α/360° saja.' },
        { kode: 'E6', nilai: 2 * benar, pesan: 'Cek lagi: luas lingkaran = πr² (tanpa dikali 2), dan satu putaran = 360°.' },
        e9,
      );
      break;
    }
    case 'kelilingJuring': {
      const a = data.alpha!;
      const r = jariSoal(data);
      const busur = panjangBusur(a, r, p);
      out.push(
        { kode: 'E11', nilai: busur, pesan: 'Itu baru panjang busurnya. Keliling juring = busur **+ 2 jari-jari**.' },
        { kode: 'E11', nilai: busur + r, pesan: 'Jari-jarinya ada **dua**: busur + r + r.' },
        e9,
      );
      break;
    }
    case 'sudutDariBusur': {
      const r = jariSoal(data);
      out.push(
        { kode: 'E7', nilai: benar / 360, pesan: PESAN.pecahanSudut },
        { kode: 'E1', nilai: (data.busur! / luasLingkaran(r, p)) * 360, pesan: 'Panjang busur dibandingkan dengan **keliling** (2πr), bukan luas.' },
        e9,
      );
      break;
    }
    case 'sudutDariJuring': {
      const r = jariSoal(data);
      out.push(
        { kode: 'E7', nilai: benar / 360, pesan: PESAN.pecahanSudut },
        { kode: 'E1', nilai: (data.luas! / keliling(r, p)) * 360, pesan: 'Luas juring dibandingkan dengan **luas lingkaran** (πr²), bukan keliling.' },
        e9,
      );
      break;
    }
    case 'jariDariBusur':
      out.push(
        { kode: 'E12', nilai: 2 * benar, pesan: PESAN.jawabDiameter },
        { kode: 'E1', nilai: jariDariJuring(data.busur!, data.alpha!, p), pesan: 'Panjang busur memakai rumus 2πr, bukan πr².' },
        e9,
      );
      break;
    case 'jariDariJuring':
      out.push(
        { kode: 'E8', nilai: benar * benar, pesan: 'Itu nilai **r²**. Tarik akar kuadratnya untuk mendapat r.' },
        { kode: 'E12', nilai: 2 * benar, pesan: PESAN.jawabDiameter },
        { kode: 'E1', nilai: jariDariBusur(data.luas!, data.alpha!, p), pesan: 'Luas juring memakai rumus πr², bukan 2πr.' },
        e9,
      );
      break;
    case 'perbandingan':
      out.push({
        kode: 'E13',
        nilai: (data.nilai1! * data.alpha1!) / data.alpha2!,
        pesan: 'Perbandingannya terbalik. Sudut lebih **besar** → hasilnya juga lebih **besar**.',
      });
      break;
  }
  return out;
}

const PESAN_UMUM: Record<Ditanya, string> = {
  busur: 'Coba buka Petunjuk 1: yang ditanya panjang atau luas?',
  juring: 'Coba buka Petunjuk 1: yang ditanya panjang atau luas?',
  kelilingJuring: 'Keliling juring = panjang busur + 2 jari-jari. Coba buka Petunjuk 1.',
  sudutDariBusur: 'Coba buka Petunjuk 1 untuk melihat langkah awalnya.',
  sudutDariJuring: 'Coba buka Petunjuk 1 untuk melihat langkah awalnya.',
  jariDariBusur: 'Coba buka Petunjuk 1 untuk melihat langkah awalnya.',
  jariDariJuring: 'Coba buka Petunjuk 1 untuk melihat langkah awalnya.',
  perbandingan: 'Ingat: busur dan juring sebanding dengan sudut pusat. Coba buka Petunjuk 1.',
};

/** Periksa jawaban siswa dan beri umpan balik spesifik jenis kesalahan. */
export function cekJawaban(soal: SoalCek, jawaban: number): HasilCek {
  const benar = hitungKunci(soal);
  if (kiraSama(jawaban, benar)) return { benar: true, pesan: 'Jawabanmu benar.' };

  for (const k of daftarKandidat(soal)) {
    if (!Number.isFinite(k.nilai) || kiraSama(k.nilai, benar)) continue;
    if (kiraSama(jawaban, k.nilai)) return { benar: false, kode: k.kode, pesan: k.pesan };
  }
  if (Math.abs(jawaban - benar) <= 0.1) {
    return { benar: false, kode: 'E10', pesan: 'Hampir tepat. Cek lagi pembulatanmu.' };
  }
  return { benar: false, pesan: PESAN_UMUM[soal.ditanya] };
}
