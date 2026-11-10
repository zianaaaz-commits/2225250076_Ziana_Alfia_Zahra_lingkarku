// Pembuat soal acak dari template (GL05: variasi soal). Hanya menerima soal
// yang semua angkanya "ramah hitung" (bulat atau maks. 2 angka desimal).
import { formatAngka, tepat, type Pi } from './geometri';
import { hitungKunci, type DataSoal, type Ditanya, type Satuan, type Soal } from './soal';

export type Rng = () => number;

const pilih = <T>(arr: readonly T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)];

const R_PER_PI: Record<Pi, number[]> = { '22/7': [7, 14, 21, 28], '3.14': [10, 20, 30] };
const SUDUT = [30, 45, 60, 72, 90, 120, 180, 270];
const f = (x: number) => formatAngka(x);
const piCatatan = (p: Pi) => (p === '3.14' ? ', π = 3,14' : '');

interface Draf {
  teks: string;
  data: DataSoal;
  ditanya: Ditanya;
  satuan: Satuan;
  contohTerkait: string;
  /** Angka yang tampil di teks soal; semuanya harus "ramah hitung". */
  angkaTampil?: number[];
}

let urutan = 0;

/** Ulangi template sampai menghasilkan soal dengan angka ramah hitung. */
function buat(level: 1 | 2 | 3, template: () => Draf): Soal {
  for (let i = 0; i < 200; i++) {
    const d = template();
    const kunci = hitungKunci(d);
    if (!tepat(kunci) || !(d.angkaTampil ?? []).every((x) => tepat(x))) continue;
    urutan += 1;
    return {
      id: `acak-${level}-${urutan}`,
      level,
      teks: d.teks,
      data: d.data,
      ditanya: d.ditanya,
      satuan: d.satuan,
      kunci: Math.round(kunci * 100) / 100,
      contohTerkait: d.contohTerkait,
    };
  }
  throw new Error('Gagal membuat soal acak');
}

// ---- Level 1: hitung langsung ----
function level1(rng: Rng): Draf {
  const p: Pi = rng() < 0.7 ? '22/7' : '3.14';
  const r = pilih(R_PER_PI[p], rng);
  const alpha = pilih(SUDUT, rng);
  const pakaiD = rng() < 0.25;
  const juring = rng() < 0.5;
  const ukuran = pakaiD ? `Diameter ${2 * r} cm` : `Jari-jari ${r} cm`;
  return {
    teks: `${ukuran}, sudut pusat ${alpha}°${piCatatan(p)}. Berapa ${juring ? 'luas juringnya' : 'panjang busurnya'}?`,
    data: { ...(pakaiD ? { d: 2 * r } : { r }), alpha, pi: p },
    ditanya: juring ? 'juring' : 'busur',
    satuan: juring ? 'cm²' : 'cm',
    contohTerkait: juring ? 'C2' : 'C1',
  };
}

// ---- Level 2: invers & perbandingan ----
function level2(rng: Rng): Draf {
  const jenis = pilih(['sudutDariBusur', 'sudutDariJuring', 'jariDariBusur', 'jariDariJuring', 'perbandingan'] as const, rng);
  const p: Pi = rng() < 0.75 ? '22/7' : '3.14';
  const r = pilih(R_PER_PI[p], rng);
  const alpha = pilih(SUDUT, rng);
  const busur = hitungKunci({ data: { r, alpha, pi: p }, ditanya: 'busur' });
  const luas = hitungKunci({ data: { r, alpha, pi: p }, ditanya: 'juring' });

  switch (jenis) {
    case 'sudutDariBusur':
      return { teks: `Panjang busur ${f(busur)} cm dan jari-jari ${r} cm${piCatatan(p)}. Berapa sudut pusatnya?`, data: { busur, r, pi: p }, ditanya: jenis, satuan: '°', contohTerkait: 'C3', angkaTampil: [busur] };
    case 'sudutDariJuring':
      return { teks: `Luas juring ${f(luas)} cm² dan jari-jari ${r} cm${piCatatan(p)}. Berapa sudut pusatnya?`, data: { luas, r, pi: p }, ditanya: jenis, satuan: '°', contohTerkait: 'C3', angkaTampil: [luas] };
    case 'jariDariBusur':
      return { teks: `Panjang busur ${f(busur)} cm dan sudut pusat ${alpha}°${piCatatan(p)}. Berapa jari-jarinya?`, data: { busur, alpha, pi: p }, ditanya: jenis, satuan: 'cm', contohTerkait: 'C4', angkaTampil: [busur] };
    case 'jariDariJuring':
      return { teks: `Luas juring ${f(luas)} cm² dan sudut pusat ${alpha}°${piCatatan(p)}. Berapa jari-jarinya?`, data: { luas, alpha, pi: p }, ditanya: jenis, satuan: 'cm', contohTerkait: 'C4', angkaTampil: [luas] };
    case 'perbandingan': {
      const nilai1 = pilih([6, 8, 9, 10, 12, 15, 16, 18, 20, 24], rng);
      const alpha1 = pilih([20, 30, 40, 45, 60, 72, 90], rng);
      const alpha2 = alpha1 * pilih([1.5, 2, 2.5, 3, 4], rng);
      const luasan = rng() < 0.5;
      const teks = luasan
        ? `∠POQ = ${alpha1}° dan luas juring POQ = ${nilai1} cm². Jika ∠ROS = ${f(alpha2)}° (lingkaran yang sama), berapa luas juring ROS?`
        : `∠AOB = ${alpha1}° dan panjang busur AB = ${nilai1} cm. Jika ∠COD = ${f(alpha2)}° (lingkaran yang sama), berapa panjang busur CD?`;
      return { teks, data: { nilai1, alpha1, alpha2, pi: '22/7' }, ditanya: 'perbandingan', satuan: luasan ? 'cm²' : 'cm', contohTerkait: 'C5', angkaTampil: alpha2 <= 360 ? [alpha2] : [NaN] };
    }
  }
}

// ---- Level 3: soal cerita ----
function level3(rng: Rng): Draf {
  const cerita = pilih(['pizzaLuas', 'pizzaPinggir', 'jam', 'taman', 'pagar', 'penyiram', 'bandul'] as const, rng);
  switch (cerita) {
    case 'pizzaLuas':
    case 'pizzaPinggir': {
      const d = pilih([14, 28, 42], rng);
      const n = pilih([4, 6, 8, 12], rng);
      const luas = cerita === 'pizzaLuas';
      return {
        teks: `Pizza berdiameter ${d} cm dipotong menjadi ${n} bagian sama besar. Berapa ${luas ? 'luas satu potong' : 'panjang pinggiran (busur) satu potong'}?`,
        data: { d, alpha: 360 / n, pi: '22/7' },
        ditanya: luas ? 'juring' : 'busur',
        satuan: luas ? 'cm²' : 'cm',
        contohTerkait: 'C6',
      };
    }
    case 'jam': {
      const r = pilih([7, 14, 21], rng);
      const menit = pilih([5, 10, 15, 20, 30, 45], rng);
      return {
        teks: `Jarum menit sebuah jam panjangnya ${r} cm. Berapa panjang lintasan ujung jarum dalam ${menit} menit?`,
        data: { r, alpha: menit * 6, pi: '22/7' },
        ditanya: 'busur',
        satuan: 'cm',
        contohTerkait: 'C6',
      };
    }
    case 'taman':
    case 'pagar': {
      const r = pilih([7, 14, 21], rng);
      const alpha = pilih([60, 90, 120], rng);
      const pagar = cerita === 'pagar';
      return {
        teks: pagar
          ? `Taman berbentuk juring dengan jari-jari ${r} m dan sudut pusat ${alpha}° akan dipagari sekelilingnya. Berapa panjang pagar?`
          : `Sebuah taman berbentuk juring dengan jari-jari ${r} m dan sudut pusat ${alpha}°. Berapa luas taman?`,
        data: { r, alpha, pi: '22/7' },
        ditanya: pagar ? 'kelilingJuring' : 'juring',
        satuan: pagar ? 'm' : 'm²',
        contohTerkait: 'C6',
      };
    }
    case 'penyiram': {
      const r = pilih([7, 14, 21, 28], rng);
      const alpha = pilih([45, 60, 90, 120, 180], rng);
      return {
        teks: `Alat penyiram berputar ${alpha}° dengan jangkauan ${r} m. Berapa luas daerah yang tersiram?`,
        data: { r, alpha, pi: '22/7' },
        ditanya: 'juring',
        satuan: 'm²',
        contohTerkait: 'C6',
      };
    }
    case 'bandul': {
      const r = pilih([10, 20, 30, 40, 50], rng);
      const alpha = pilih([30, 36, 45, 60, 72, 90], rng);
      return {
        teks: `Bandul bertali ${r} cm berayun membentuk sudut ${alpha}°. Berapa panjang lintasan ujung bandul? (π = 3,14)`,
        data: { r, alpha, pi: '3.14' },
        ditanya: 'busur',
        satuan: 'cm',
        contohTerkait: 'C6',
      };
    }
  }
}

export function soalAcak(level: 1 | 2 | 3, rng: Rng = Math.random): Soal {
  const t = level === 1 ? level1 : level === 2 ? level2 : level3;
  return buat(level, () => t(rng));
}

export function paketSoalAcak(level: 1 | 2 | 3, jumlah = 5, rng: Rng = Math.random): Soal[] {
  const hasil: Soal[] = [];
  const teksDipakai = new Set<string>();
  for (let i = 0; hasil.length < jumlah && i < jumlah * 20; i++) {
    const s = soalAcak(level, rng);
    if (teksDipakai.has(s.teks)) continue; // hindari soal kembar dalam satu paket
    teksDipakai.add(s.teks);
    hasil.push(s);
  }
  return hasil;
}
