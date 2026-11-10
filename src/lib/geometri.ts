// Rumus murni untuk lingkaran, busur, dan juring.
// Semua angka di konten aplikasi harus dihitung lewat modul ini (CLAUDE.md §6).

export type Pi = '22/7' | '3.14';

export const nilaiPi = (p: Pi): number => (p === '22/7' ? 22 / 7 : 3.14);

/** Pecahan sudut α/360°. */
export const pecahanSudut = (alpha: number): number => alpha / 360;

export const jariDariDiameter = (d: number): number => d / 2;

export const keliling = (r: number, p: Pi): number => 2 * nilaiPi(p) * r;

export const luasLingkaran = (r: number, p: Pi): number => nilaiPi(p) * r * r;

/** Panjang busur = (α/360°) × 2πr */
export const panjangBusur = (alpha: number, r: number, p: Pi): number =>
  pecahanSudut(alpha) * keliling(r, p);

/** Luas juring = (α/360°) × πr² */
export const luasJuring = (alpha: number, r: number, p: Pi): number =>
  pecahanSudut(alpha) * luasLingkaran(r, p);

/** Keliling juring = panjang busur + 2 jari-jari */
export const kelilingJuring = (alpha: number, r: number, p: Pi): number =>
  panjangBusur(alpha, r, p) + 2 * r;

// ---- Soal invers (IL04) ----

export const sudutDariBusur = (busur: number, r: number, p: Pi): number =>
  (busur / keliling(r, p)) * 360;

export const sudutDariJuring = (luas: number, r: number, p: Pi): number =>
  (luas / luasLingkaran(r, p)) * 360;

export const jariDariBusur = (busur: number, alpha: number, p: Pi): number =>
  busur / (pecahanSudut(alpha) * 2 * nilaiPi(p));

export const jariDariJuring = (luas: number, alpha: number, p: Pi): number =>
  Math.sqrt(luas / (pecahanSudut(alpha) * nilaiPi(p)));

// ---- Perbandingan (IL02): nilai₂ = nilai₁ × α₂/α₁ ----

export const perbandingan = (nilai1: number, alpha1: number, alpha2: number): number =>
  (nilai1 * alpha2) / alpha1;

// ---- Pembulatan & format Indonesia ----

export const bulatkan = (x: number, digit = 2): number => {
  const f = 10 ** digit;
  return Math.round((x + Number.EPSILON) * f) / f;
};

/** Format angka gaya Indonesia: koma desimal, titik ribuan. */
export const formatAngka = (x: number, digit = 2): string =>
  bulatkan(x, digit).toLocaleString('id-ID', { maximumFractionDigits: digit });

/** true jika x tidak berubah setelah dibulatkan (bukan hasil pembulatan). */
export const tepat = (x: number, digit = 2): boolean => Math.abs(x - bulatkan(x, digit)) < 1e-9;

/** Seperti formatAngka, tetapi diawali "≈ " jika nilainya hasil pembulatan. */
export const tampilAngka = (x: number, digit = 2): string =>
  (tepat(x, digit) ? '' : '≈ ') + formatAngka(x, digit);

const fpb = (a: number, b: number): number => (b === 0 ? a : fpb(b, a % b));

/** Pecahan sudut paling sederhana, mis. 90 → [1, 4]. */
export const pecahanSederhana = (alpha: number): [number, number] => {
  const a = Math.round(alpha);
  const g = fpb(a, 360) || 1;
  return [a / g, 360 / g];
};

/** Pecahan sudut sebagai teks, mis. 90 → "1/4", 360 → "1". */
export const teksPecahan = (alpha: number): string => {
  const [p, q] = pecahanSederhana(alpha);
  return q === 1 ? `${p}` : `${p}/${q}`;
};

export const teksPi = (p: Pi): string => (p === '22/7' ? '22/7' : '3,14');

/** Ubah input siswa ("12,56" atau "12.56") menjadi angka; NaN jika tidak valid. */
export const parseJawaban = (teks: string): number => {
  const bersih = teks.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(bersih)) return NaN;
  return Number(bersih);
};

/** Bandingkan dua angka dengan toleransi (default ±0,01). */
export const kiraSama = (a: number, b: number, toleransi = 0.01): boolean =>
  Math.abs(a - b) <= toleransi + 1e-9;
