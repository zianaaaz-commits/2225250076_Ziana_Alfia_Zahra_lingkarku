import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MathText from '../components/MathText';
import { apakahIsian, CONTOH, type Isian } from '../content/contoh';
import { KARTU_PRASYARAT, KUIS_PRASYARAT } from '../content/prasyarat';
import ContohDetail from '../features/contoh/ContohDetail';
import Prasyarat from '../features/prasyarat/Prasyarat';
import { bulatkan, keliling, kiraSama, luasLingkaran } from '../lib/geometri';
import { hitungKunci } from '../lib/soal';

const isianDari = (id: string): Isian[] =>
  CONTOH.find((c) => c.id === id)!.melengkapi.langkah.filter(apakahIsian);

describe('kunci contoh & soal melengkapi', () => {
  it.each(CONTOH.map((c) => [c.id, c] as const))('%s: jawaban contoh benar', (_id, c) => {
    expect(kiraSama(hitungKunci(c.jawaban), c.jawaban.nilai)).toBe(true);
    expect(kiraSama(hitungKunci(c.melengkapi.jawaban), c.melengkapi.jawaban.nilai)).toBe(true);
  });

  it.each(CONTOH.map((c) => [c.id, c] as const))('%s: isian terakhir = jawaban akhir', (_id, c) => {
    const isian = c.melengkapi.langkah.filter(apakahIsian);
    expect(isian.length).toBeGreaterThan(0);
    expect(isian[isian.length - 1].kunci).toBe(c.melengkapi.jawaban.nilai);
  });

  it('isian langkah antara benar', () => {
    expect(bulatkan(keliling(21, '22/7'))).toBe(isianDari('C1')[0].kunci); // 132
    expect(bulatkan(luasLingkaran(20, '3.14'))).toBe(isianDari('C2')[0].kunci); // 1256
    expect(bulatkan(keliling(14, '22/7'))).toBe(isianDari('C3')[0].kunci); // 88
    expect(7 * 7).toBe(isianDari('C4')[0].kunci); // r² = 49
    expect(135 / 45).toBe(isianDari('C5')[0].kunci); // 3
    expect(360 / 6).toBe(isianDari('C6')[0].kunci); // 60
  });

  it('semua rumus KaTeX dapat dirender tanpa galat', () => {
    const semua = [
      ...KARTU_PRASYARAT.map((k) => k.teks),
      ...CONTOH.flatMap((c) => [
        ...c.langkah.map((l) => l.isi),
        ...c.melengkapi.langkah.map((l) => (apakahIsian(l) ? l.sebelum : l.isi)),
      ]),
    ];
    const { container } = render(
      <div>
        {semua.map((t, i) => (
          <MathText key={i} teks={t} />
        ))}
      </div>,
    );
    expect(container.querySelectorAll('.katex').length).toBeGreaterThan(30);
    expect(container.querySelector('.katex-error')).toBeNull();
  });
});

describe('kuis prasyarat', () => {
  it('kunci keliling & luas sesuai rumus', () => {
    expect(KUIS_PRASYARAT[3].pilihan[KUIS_PRASYARAT[3].benar]).toBe(`${bulatkan(keliling(7, '22/7'))} cm`);
    expect(KUIS_PRASYARAT[4].pilihan[KUIS_PRASYARAT[4].benar]).toBe(`${bulatkan(luasLingkaran(10, '3.14'))} cm²`);
  });

  it('kartu → kuis berjalan', () => {
    render(
      <MemoryRouter>
        <Prasyarat />
      </MemoryRouter>,
    );
    for (let i = 0; i < KARTU_PRASYARAT.length - 1; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Berikutnya/ }));
    }
    fireEvent.click(screen.getByRole('button', { name: /Cek cepat/ }));
    fireEvent.click(screen.getByRole('button', { name: '10 cm' }));
    expect(screen.getByRole('status')).toHaveTextContent('Tepat!');
  });
});

describe('alur contoh C1', () => {
  const tampilkan = () =>
    render(
      <MemoryRouter initialEntries={['/contoh/C1']}>
        <Routes>
          <Route path="/contoh/:id" element={<ContohDetail />} />
        </Routes>
      </MemoryRouter>,
    );

  it('langkah muncul satu per satu, lalu soal melengkapi', () => {
    tampilkan();
    expect(screen.getByText('Langkah 1 dari 6')).toBeInTheDocument();
    expect(screen.queryByText(/Rumus/)).toBeNull();
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: /Langkah berikutnya/ }));
    expect(screen.getByText('Langkah 6 dari 6')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Sekarang coba/ }));
    expect(screen.getByText('Sekarang kamu coba!')).toBeInTheDocument();
  });

  it('isian salah memberi petunjuk, isian benar menyelesaikan', () => {
    tampilkan();
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: /Langkah berikutnya/ }));
    fireEvent.click(screen.getByRole('button', { name: /Sekarang coba/ }));

    const keliling = screen.getByLabelText('3. Keliling');
    fireEvent.change(keliling, { target: { value: '154' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Periksa' })[0]);
    expect(screen.getByRole('status')).toHaveTextContent('Petunjuk');

    fireEvent.change(keliling, { target: { value: '132' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Periksa' })[0]);
    fireEvent.change(screen.getByLabelText('5. Panjang busur'), { target: { value: '22' } });
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
    expect(screen.getByText('Hebat, semua kotak benar!')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contoh berikutnya/ })).toHaveAttribute('href', '/contoh/C2');
  });

  it('menerima koma desimal (C2: 125,6)', () => {
    render(
      <MemoryRouter initialEntries={['/contoh/C2']}>
        <Routes>
          <Route path="/contoh/:id" element={<ContohDetail />} />
        </Routes>
      </MemoryRouter>,
    );
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: /Langkah berikutnya/ }));
    fireEvent.click(screen.getByRole('button', { name: /Sekarang coba/ }));
    const input = screen.getByLabelText('5. Luas juring');
    fireEvent.change(input, { target: { value: '125,6' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Periksa' })[1]);
    expect(screen.getByLabelText('benar')).toBeInTheDocument();
  });
});
