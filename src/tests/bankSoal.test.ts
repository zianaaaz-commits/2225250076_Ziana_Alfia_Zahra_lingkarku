import { BANK_SOAL } from '../content/bankSoal';
import { kiraSama } from '../lib/geometri';
import { hitungKunci } from '../lib/soal';

describe('bank soal', () => {
  it.each(BANK_SOAL.map((s) => [s.id, s] as const))('%s: kunci sesuai perhitungan', (_id, soal) => {
    expect(kiraSama(hitungKunci(soal), soal.kunci)).toBe(true);
  });

  it('id soal unik', () => {
    const ids = BANK_SOAL.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('setiap level punya soal', () => {
    for (const level of [1, 2, 3]) {
      expect(BANK_SOAL.some((s) => s.level === level)).toBe(true);
    }
  });
});
