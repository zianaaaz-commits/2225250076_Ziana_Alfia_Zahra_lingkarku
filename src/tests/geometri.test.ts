import {
  bulatkan,
  formatAngka,
  jariDariBusur,
  jariDariJuring,
  keliling,
  kelilingJuring,
  kiraSama,
  luasJuring,
  luasLingkaran,
  panjangBusur,
  parseJawaban,
  perbandingan,
  sudutDariBusur,
  sudutDariJuring,
} from '../lib/geometri';

describe('lingkaran penuh', () => {
  it('keliling r=7, π=22/7 → 44', () => expect(bulatkan(keliling(7, '22/7'))).toBe(44));
  it('luas r=10, π=3,14 → 314', () => expect(bulatkan(luasLingkaran(10, '3.14'))).toBe(314));
});

describe('contoh soal docs/04 §4', () => {
  it('C1: busur r=14, α=90° → 22 cm', () => expect(bulatkan(panjangBusur(90, 14, '22/7'))).toBe(22));
  it('C2: juring r=10, α=72°, π=3,14 → 62,8 cm²', () =>
    expect(bulatkan(luasJuring(72, 10, '3.14'))).toBe(62.8));
  it('C3: busur 44, r=21 → α=120°', () => expect(bulatkan(sudutDariBusur(44, 21, '22/7'))).toBe(120));
  it('C4: juring 77, α=45° → r=14', () => expect(bulatkan(jariDariJuring(77, 45, '22/7'))).toBe(14));
  it('C5: perbandingan 10 cm × 150/60 → 25 cm', () => expect(perbandingan(10, 60, 150)).toBe(25));
  it('C6: pizza d=28 dibagi 8 → 77 cm²', () => expect(bulatkan(luasJuring(45, 14, '22/7'))).toBe(77));
});

describe('sifat rumus', () => {
  it('sudut 360° → busur = keliling, juring = luas', () => {
    expect(panjangBusur(360, 7, '22/7')).toBeCloseTo(keliling(7, '22/7'));
    expect(luasJuring(360, 7, '22/7')).toBeCloseTo(luasLingkaran(7, '22/7'));
  });

  it('sudut 2× → busur dan juring 2× (IL02)', () => {
    expect(panjangBusur(120, 21, '22/7')).toBeCloseTo(2 * panjangBusur(60, 21, '22/7'));
    expect(luasJuring(120, 21, '22/7')).toBeCloseTo(2 * luasJuring(60, 21, '22/7'));
  });

  it('fungsi invers mengembalikan nilai awal', () => {
    for (const p of ['22/7', '3.14'] as const) {
      for (const [alpha, r] of [[30, 7], [72, 10], [135, 21], [270, 14]]) {
        expect(sudutDariBusur(panjangBusur(alpha, r, p), r, p)).toBeCloseTo(alpha);
        expect(sudutDariJuring(luasJuring(alpha, r, p), r, p)).toBeCloseTo(alpha);
        expect(jariDariBusur(panjangBusur(alpha, r, p), alpha, p)).toBeCloseTo(r);
        expect(jariDariJuring(luasJuring(alpha, r, p), alpha, p)).toBeCloseTo(r);
      }
    }
  });

  it('keliling juring = busur + 2r', () => expect(bulatkan(kelilingJuring(90, 14, '22/7'))).toBe(50));
});

describe('format & input', () => {
  it('format Indonesia memakai koma desimal', () => {
    expect(formatAngka(12.56)).toBe('12,56');
    expect(formatAngka(1386)).toBe('1.386');
  });

  it('parseJawaban menerima koma atau titik', () => {
    expect(parseJawaban('12,56')).toBe(12.56);
    expect(parseJawaban(' 12.56 ')).toBe(12.56);
    expect(parseJawaban('22')).toBe(22);
  });

  it('parseJawaban menolak input tidak valid', () => {
    expect(parseJawaban('')).toBeNaN();
    expect(parseJawaban('abc')).toBeNaN();
    expect(parseJawaban('12,5,6')).toBeNaN();
  });

  it('kiraSama memakai toleransi ±0,01', () => {
    expect(kiraSama(14.67, 44 / 3)).toBe(true);
    expect(kiraSama(14.6, 44 / 3)).toBe(false);
  });
});
