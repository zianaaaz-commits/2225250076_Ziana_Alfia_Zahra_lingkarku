import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProgresProvider } from '../app/ProgresContext';
import { FASE, LITERASI, soalTerverifikasi } from '../content/literasi';
import { LiterasiDetail } from '../features/literasi/Literasi';
import { keliling, kiraSama, luasJuring, luasLingkaran, panjangBusur } from '../lib/geometri';
import { bolehPutar } from '../lib/musik';
import { jenisPerangkat } from '../lib/pasang';
import { bacaProgres } from '../lib/progress';
import { hitungKunci } from '../lib/soal';

beforeEach(() => localStorage.clear());

const isian = (misi: string, ke: number) => {
  const l = LITERASI.find((m) => m.id === misi)!.langkah.filter((x) => x.jenis === 'isian')[ke];
  if (l.jenis !== 'isian') throw new Error();
  return l.kunci;
};

describe('konten Misi Literasi', () => {
  it('setiap misi melewati kelima tahap literasi secara berurutan', () => {
    for (const m of LITERASI) {
      const urutan = m.langkah.map((l) => FASE.findIndex((f) => f.id === l.fase));
      expect([...urutan].sort((a, b) => a - b)).toEqual(urutan); // tidak mundur
      expect(m.langkah.some((l) => l.fase === 'tafsirkan')).toBe(true);
      expect(m.langkah.some((l) => l.fase === 'jelaskan' && l.jenis === 'uraian')).toBe(true);
    }
  });

  it('kunci isian yang memakai data soal sesuai rumus', () => {
    for (const m of LITERASI) for (const s of soalTerverifikasi(m)) expect(kiraSama(hitungKunci(s), s.kunci)).toBe(true);
  });

  it('kunci isian lain (tanpa data soal) benar', () => {
    expect(isian('kue', 1)).toBe(Math.floor(luasLingkaran(14, '22/7') / 70)); // 8 potong
    expect(isian('pagar', 2)).toBe(50 * 45000);
    expect(isian('wiper', 2)).toBeCloseTo(luasJuring(120, 42, '22/7') - luasJuring(120, 21, '22/7'));
  });

  it('pernyataan tafsiran konsisten dengan perhitungan', () => {
    expect(luasLingkaran(14, '22/7') / 10).toBeLessThan(70); // kue 10 potong < 70
    expect(panjangBusur(120, 42, '22/7')).toBeCloseTo(88); // ujung wiper 88 cm, bukan 44
    expect(luasJuring(120, 21, '22/7') / luasJuring(120, 42, '22/7')).toBeCloseTo(0.25);
    expect(keliling(21, '22/7') / 2).toBeCloseTo(66); // bianglala 3 menit
  });
});

describe('alur Misi Literasi', () => {
  it('misi kue dapat diselesaikan dan tersimpan', () => {
    render(
      <ProgresProvider>
        <MemoryRouter initialEntries={['/literasi/kue']}>
          <Routes>
            <Route path="/literasi/:id" element={<LiterasiDetail />} />
          </Routes>
        </MemoryRouter>
      </ProgresProvider>,
    );
    const lanjut = () => fireEvent.click(screen.getByRole('button', { name: /Lanjut/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Rani sedang berulang tahun' }));
    lanjut();
    fireEvent.click(screen.getByRole('button', { name: 'Juring → luasnya' }));
    lanjut();
    fireEvent.click(screen.getByRole('button', { name: '45°' }));
    lanjut();

    // Hitung: jawaban 11 (= rumus panjang busur) → diagnosis E1, lalu 77 benar
    const input = () => screen.getByRole('textbox', { name: /luas satu potong/ });
    fireEvent.change(input(), { target: { value: '11' } });
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
    expect(screen.getByRole('status')).toHaveTextContent('panjang busur');
    fireEvent.change(input(), { target: { value: '77' } });
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
    lanjut();

    // Tafsirkan: benar / salah / benar
    const grup = screen.getAllByRole('radiogroup');
    fireEvent.click(within(grup[0], 'Benar'));
    fireEvent.click(within(grup[1], 'Salah'));
    fireEvent.click(within(grup[2], 'Benar'));
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
    lanjut();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
    lanjut();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Kalau 9 potong, tiap potong kurang dari 70 cm².' } });
    fireEvent.click(screen.getByRole('button', { name: /Bandingkan/ }));
    expect(screen.getByText(/Contoh jawaban/)).toBeInTheDocument();
    lanjut();

    expect(screen.getByText(/Misi selesai/)).toBeInTheDocument();
    expect(bacaProgres().selesai).toContain('literasi:kue');
  });
});

function within(el: HTMLElement, nama: string) {
  return Array.from(el.querySelectorAll('button')).find((b) => b.textContent === nama)!;
}

describe('musik & pemasangan', () => {
  it('lagu hanya di layar menu', () => {
    expect(bolehPutar('/')).toBe(true);
    expect(bolehPutar('/latihan')).toBe(true);
    expect(bolehPutar('/latihan/1')).toBe(false);
    expect(bolehPutar('/contoh/C1')).toBe(false);
    expect(bolehPutar('/simulasi')).toBe(false);
  });

  it('mengenali jenis perangkat', () => {
    expect(jenisPerangkat('Mozilla/5.0 (Linux; Android 14; SM-A145F)')).toBe('android');
    expect(jenisPerangkat('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe('ios');
    expect(jenisPerangkat('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('desktop');
  });
});
