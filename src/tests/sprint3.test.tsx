import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MathText from '../components/MathText';
import { BANK_SOAL } from '../content/bankSoal';
import SesiLatihan from '../features/latihan/SesiLatihan';
import { cekJawaban } from '../lib/feedback';
import { paketSoalAcak, soalAcak } from '../lib/generator';
import { formatAngka, kiraSama, tepat } from '../lib/geometri';
import { buatBantuan } from '../lib/pembahasan';
import { hitungKunci, type DataSoal, type Ditanya } from '../lib/soal';

const s = (data: DataSoal, ditanya: Ditanya) => ({ data, ditanya });

/** RNG deterministik agar tes generator dapat diulang. */
function rngTetap(benih = 42) {
  let x = benih;
  return () => {
    x = (x * 1664525 + 1013904223) % 2 ** 32;
    return x / 2 ** 32;
  };
}

describe('cekJawaban: diagnosis kesalahan (docs/04 §6)', () => {
  const busur = s({ r: 7, alpha: 90, pi: '22/7' }, 'busur'); // benar 11
  const juring = s({ r: 7, alpha: 90, pi: '22/7' }, 'juring'); // benar 38,5

  it('jawaban benar (titik/koma setara)', () => {
    expect(cekJawaban(busur, 11).benar).toBe(true);
    expect(cekJawaban(juring, 38.5).benar).toBe(true);
  });

  it.each([
    ['E1 rumus tertukar', busur, 38.5, 'E1'],
    ['E3 keliling penuh', busur, 44, 'E3'],
    ['E4 dibagi 180', busur, 22, 'E4'],
    ['E5 tanpa angka 2', busur, 5.5, 'E5'],
    // juring r=21, α=60° (π=22/7) → 231; dengan π=3,14 → 230,79
    ['E9 π = 3,14', s({ r: 21, alpha: 60, pi: '22/7' }, 'juring'), 230.79, 'E9'],
    ['E1 juring ↔ busur', juring, 11, 'E1'],
    ['E3 luas penuh', juring, 154, 'E3'],
    ['E6 dikali 2', juring, 77, 'E6'],
    ['E10 pembulatan', juring, 38.45, 'E10'],
  ] as const)('%s', (_n, soal, jawab, kode) => {
    expect(cekJawaban(soal, jawab).kode).toBe(kode);
  });

  it('E2 diameter dipakai sebagai jari-jari (diprioritaskan di atas E4)', () => {
    const soal = s({ d: 28, alpha: 45, pi: '22/7' }, 'busur'); // benar 11, salah 22
    expect(cekJawaban(soal, 22).kode).toBe('E2');
  });

  it('E7 sudut: lupa × 360°', () => {
    const soal = s({ busur: 44, r: 21, pi: '22/7' }, 'sudutDariBusur'); // 120°
    expect(cekJawaban(soal, 0.33).kode).toBe('E7');
  });

  it('E8 jari-jari: lupa akar, E12 menjawab diameter', () => {
    const soal = s({ luas: 77, alpha: 45, pi: '22/7' }, 'jariDariJuring'); // 14
    expect(cekJawaban(soal, 196).kode).toBe('E8');
    expect(cekJawaban(soal, 28).kode).toBe('E12');
  });

  it('E11 keliling juring tanpa 2 jari-jari', () => {
    const soal = s({ r: 14, alpha: 90, pi: '22/7' }, 'kelilingJuring'); // 50
    expect(cekJawaban(soal, 22).kode).toBe('E11');
    expect(cekJawaban(soal, 36).kode).toBe('E11');
  });

  it('E13 perbandingan terbalik', () => {
    const soal = s({ nilai1: 10, alpha1: 60, alpha2: 150, pi: '22/7' }, 'perbandingan'); // 25
    expect(cekJawaban(soal, 4).kode).toBe('E13');
  });

  it('jawaban asal → pesan umum tanpa kode', () => {
    const h = cekJawaban(busur, 999);
    expect(h.benar).toBe(false);
    expect(h.kode).toBeUndefined();
    expect(h.pesan).toMatch(/Petunjuk/);
  });

  it('kunci bank soal selalu dinilai benar', () => {
    for (const soal of BANK_SOAL) expect(cekJawaban(soal, soal.kunci).benar).toBe(true);
  });
});

describe('generator soal acak', () => {
  const rng = rngTetap();
  const banyak = ([1, 2, 3] as const).flatMap((lv) => Array.from({ length: 200 }, () => soalAcak(lv, rng)));

  it('600 soal: kunci konsisten & ramah hitung', () => {
    for (const soal of banyak) {
      expect(tepat(soal.kunci)).toBe(true);
      expect(kiraSama(hitungKunci(soal), soal.kunci)).toBe(true);
      expect(cekJawaban(soal, soal.kunci).benar).toBe(true);
    }
  });

  it('angka di teks soal tidak lebih dari 2 desimal', () => {
    for (const soal of banyak) {
      const angka = soal.teks.match(/\d+,\d+/g) ?? [];
      for (const a of angka) expect(a.split(',')[1].length).toBeLessThanOrEqual(2);
    }
  });

  it('sudut perbandingan tidak melebihi 360°', () => {
    for (const soal of banyak.filter((x) => x.ditanya === 'perbandingan')) {
      expect(soal.data.alpha2!).toBeLessThanOrEqual(360);
    }
  });

  it('setiap level menghasilkan variasi jenis soal', () => {
    for (const lv of [1, 2, 3]) {
      const jenis = new Set(banyak.filter((x) => x.level === lv).map((x) => x.ditanya));
      expect(jenis.size).toBeGreaterThanOrEqual(2);
    }
  });

  it('paket soal tidak berisi soal kembar', () => {
    const paket = paketSoalAcak(1, 5, rngTetap(7));
    expect(new Set(paket.map((p) => p.teks)).size).toBe(paket.length);
  });
});

describe('pembahasan otomatis', () => {
  const semua = [...BANK_SOAL, ...([1, 2, 3] as const).flatMap((lv) => paketSoalAcak(lv, 15, rngTetap(lv)))];

  it('langkah terakhir memuat jawaban + satuan', () => {
    for (const soal of semua) {
      const { langkah } = buatBantuan(soal);
      expect(langkah[langkah.length - 1].isi).toContain(`${formatAngka(soal.kunci)} ${soal.satuan}`);
    }
  });

  it('semua rumus pembahasan & petunjuk dirender tanpa galat KaTeX', () => {
    const teks = semua.flatMap((soal) => {
      const b = buatBantuan(soal);
      return [b.petunjuk1, b.petunjuk2, ...b.langkah.map((l) => l.isi)];
    });
    const { container } = render(
      <div>
        {teks.map((t, i) => (
          <MathText key={i} teks={t} />
        ))}
      </div>,
    );
    expect(container.querySelector('.katex-error')).toBeNull();
  });
});

describe('halaman latihan', () => {
  const tampilkan = (url = '/latihan/1') =>
    render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/latihan/:level" element={<SesiLatihan />} />
        </Routes>
      </MemoryRouter>,
    );
  const jawab = (nilai: string) => {
    fireEvent.change(screen.getByLabelText('Jawaban'), { target: { value: nilai } });
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
  };

  it('jawaban salah → diagnosis; benar → lanjut', () => {
    tampilkan();
    expect(screen.getByText('Soal 1 dari 9')).toBeInTheDocument();
    jawab('38,5'); // L1-01: busur r=7, α=90 → 11; 38,5 = rumus juring
    expect(screen.getByRole('status')).toHaveTextContent('luas juring');
    jawab('11');
    expect(screen.getByRole('status')).toHaveTextContent('Tepat!');
    fireEvent.click(screen.getByRole('button', { name: /Soal berikutnya/ }));
    expect(screen.getByText('Soal 2 dari 9')).toBeInTheDocument();
  });

  it('petunjuk bertingkat, lalu pembahasan muncul', () => {
    tampilkan();
    expect(screen.queryByRole('button', { name: 'Lihat pembahasan' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Petunjuk 1/ }));
    expect(screen.getByText('Petunjuk 1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Petunjuk 2/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Lihat pembahasan' }));
    expect(screen.getByText('Pembahasan')).toBeInTheDocument();
    expect(screen.queryByLabelText('Jawaban')).toBeNull();
  });

  it('contoh serupa dapat dibuka di tempat', () => {
    tampilkan();
    fireEvent.click(screen.getByRole('button', { name: 'Contoh serupa' }));
    expect(screen.getByText(/Contoh: Jari-jari lingkaran 14 cm/)).toBeInTheDocument();
  });

  it('mode acak berisi 5 soal', () => {
    tampilkan('/latihan/2?acak=1');
    expect(screen.getByText('Soal 1 dari 5')).toBeInTheDocument();
  });

  it('skor akhir dan saran lanjut level', () => {
    tampilkan('/latihan/3');
    for (const soal of BANK_SOAL.filter((x) => x.level === 3)) {
      jawab(formatAngka(soal.kunci));
      fireEvent.click(screen.getByRole('button', { name: /Soal berikutnya/ }));
    }
    expect(screen.getByText('Benar 6 dari 6')).toBeInTheDocument();
  });
});
