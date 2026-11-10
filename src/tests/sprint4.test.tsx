import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Beranda from '../app/Beranda';
import Layout from '../app/Layout';
import { modulSelesai, ProgresProvider } from '../app/ProgresContext';
import { CERITA, type Token } from '../content/cerita';
import { CONTOH } from '../content/contoh';
import { CeritaDetail } from '../features/cerita/Cerita';
import { evaluasiTanda } from '../features/cerita/TandaiCerita';
import { formatAngka, kiraSama } from '../lib/geometri';
import {
  bacaProgres,
  denganSelesai,
  denganSkor,
  KUNCI_SIMPAN,
  progresAwal,
} from '../lib/progress';
import { hitungKunci } from '../lib/soal';

beforeEach(() => localStorage.clear());

describe('progress.ts', () => {
  it('bawaan saat kosong atau rusak', () => {
    expect(bacaProgres()).toEqual(progresAwal());
    localStorage.setItem(KUNCI_SIMPAN, '{bukan json');
    expect(bacaProgres()).toEqual(progresAwal());
  });

  it('menyimpan skor terbaik saja & tidak menggandakan id selesai', () => {
    let p = progresAwal();
    p = denganSkor(p, '1', 0.8);
    p = denganSkor(p, '1', 0.5);
    expect(p.skor['1']).toBe(0.8);
    p = denganSelesai(denganSelesai(p, 'prasyarat'), 'prasyarat');
    expect(p.selesai).toEqual(['prasyarat']);
  });

  it('modul contoh selesai jika keenam contoh selesai', () => {
    let p = progresAwal();
    for (const c of CONTOH.slice(0, -1)) p = denganSelesai(p, `contoh:${c.id}`);
    expect(modulSelesai(p, 'contoh')).toBe(false);
    p = denganSelesai(p, `contoh:${CONTOH[CONTOH.length - 1].id}`);
    expect(modulSelesai(p, 'contoh')).toBe(true);
  });

  it('modul latihan selesai jika ketiga level ≥ 70%', () => {
    let p = denganSkor(denganSkor(progresAwal(), '1', 1), '2', 0.7);
    expect(modulSelesai(p, 'latihan')).toBe(false);
    p = denganSkor(p, '3', 0.83);
    expect(modulSelesai(p, 'latihan')).toBe(true);
  });

  it('Beranda membaca progres tersimpan', () => {
    localStorage.setItem(KUNCI_SIMPAN, JSON.stringify({ ...progresAwal(), selesai: ['prasyarat'] }));
    render(
      <ProgresProvider>
        <MemoryRouter>
          <Beranda />
        </MemoryRouter>
      </ProgresProvider>,
    );
    expect(screen.getByText('1 dari 6 langkah selesai.')).toBeInTheDocument();
    expect(screen.getAllByLabelText('selesai')).toHaveLength(1);
    expect(screen.getByText('Lanjut ▶')).toBeInTheDocument();
  });
});

describe('konten soal cerita', () => {
  it.each(CERITA.map((c) => [c.id, c] as const))('%s: kunci benar & token lengkap', (_id, c) => {
    expect(kiraSama(hitungKunci(c.soal), c.soal.kunci)).toBe(true);
    const token = c.segmen.filter((s): s is Token => typeof s !== 'string');
    expect(token.some((t) => t.peran === 'diketahui')).toBe(true);
    expect(token.filter((t) => t.peran === 'ditanya')).toHaveLength(1);
    expect(token.some((t) => t.peran === 'pengecoh')).toBe(true);
    expect(c.jenis === 'luas').toBe(c.soal.satuan.includes('²'));
  });

  it('evaluasiTanda: pengecoh & kekurangan terdeteksi', () => {
    const c = CERITA[0]; // pizza: [1]=Rp80.000 (pengecoh), [3]=28 cm, [5]=8 bagian, [7]=luas satu potong
    expect(evaluasiTanda(c, { 1: 'diketahui', 3: 'diketahui', 5: 'diketahui', 7: 'ditanya' })[0]).toMatch('Rp80.000');
    expect(evaluasiTanda(c, { 3: 'diketahui', 7: 'ditanya' }).join()).toMatch('belum ditandai');
    expect(evaluasiTanda(c, { 3: 'diketahui', 5: 'diketahui', 7: 'ditanya' })).toEqual([]);
  });
});

describe('alur soal cerita', () => {
  it('tandai → panjang/luas → gambar → hitung → selesai tersimpan', () => {
    render(
      <ProgresProvider>
        <MemoryRouter initialEntries={['/cerita/pizza']}>
          <Routes>
            <Route path="/cerita/:id" element={<CeritaDetail />} />
          </Routes>
        </MemoryRouter>
      </ProgresProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: '28 cm' }));
    fireEvent.click(screen.getByRole('button', { name: '8 bagian sama besar' }));
    fireEvent.click(screen.getByRole('radio', { name: /Ditanya/ }));
    fireEvent.click(screen.getByRole('button', { name: 'luas satu potong' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cek tandaku' }));

    expect(screen.getByText('d = 28 cm → r = 14 cm')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Panjang/ }));
    expect(screen.getByText(/Baca lagi/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Luas/ }));
    fireEvent.click(screen.getByRole('button', { name: /Lanjut menghitung/ }));

    fireEvent.change(screen.getByLabelText('Jawaban'), { target: { value: formatAngka(77) } });
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
    fireEvent.click(screen.getByRole('button', { name: /Soal berikutnya/ }));

    expect(screen.getByText(/Soal cerita selesai/)).toBeInTheDocument();
    expect(bacaProgres().selesai).toContain('cerita:pizza');
  });
});

describe('Kartu Rumus', () => {
  it('dapat dibuka dari header dan ditutup dengan Escape', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>isi</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Rumus/ }));
    const dialog = screen.getByRole('dialog', { name: 'Kartu Rumus' });
    expect(within(dialog).getByText('1/4')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
