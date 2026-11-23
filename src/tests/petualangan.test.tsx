import { existsSync } from 'node:fs';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Beranda from '../app/Beranda';
import { ProgresProvider } from '../app/ProgresContext';
import { BANK_SOAL } from '../content/bankSoal';
import { CERITA } from '../content/cerita';
import { CONTOH } from '../content/contoh';
import { FOTO, fotoPizza, type FotoId } from '../content/gambar';
import { GAME_BUSUR_JURING } from '../content/gameBusurJuring';
import { MODUL } from '../content/modul';
import { soalAcak } from '../lib/generator';
import { KUNCI_SIMPAN, progresAwal } from '../lib/progress';

beforeEach(() => localStorage.clear());

describe('gambar', () => {
  it('semua file foto & maskot tersedia', () => {
    for (const id of Object.keys(FOTO)) expect(existsSync(`public/gambar/${id}.webp`)).toBe(true);
    expect(existsSync('public/gambar/maskot.webp')).toBe(true);
  });

  it('foto hanya dipakai pada soal berkonteks pizza', () => {
    const berfoto: { teks: string; foto: FotoId }[] = [
      ...BANK_SOAL.flatMap((s) => (s.foto ? [{ teks: s.teks, foto: s.foto }] : [])),
      ...CONTOH.flatMap((c) => [
        ...(c.foto ? [{ teks: c.soal, foto: c.foto }] : []),
        ...(c.melengkapi.foto ? [{ teks: c.melengkapi.soal, foto: c.melengkapi.foto }] : []),
      ]),
      ...CERITA.flatMap((c) => (c.foto ? [{ teks: c.soal.teks, foto: c.foto }] : [])),
      ...GAME_BUSUR_JURING.flatMap((g) => (g.foto ? [{ teks: g.teks, foto: g.foto }] : [])),
    ];
    expect(berfoto.length).toBeGreaterThanOrEqual(6);
    for (const b of berfoto) expect(b.teks.toLowerCase()).toContain('pizza');
  });

  it('foto pizza 8 potong hanya untuk pizza yang dipotong 8', () => {
    expect(fotoPizza(8)).toBe('pizza-8-potong');
    expect(fotoPizza(4)).toBe('pizza-garis-seperempat');
    expect(fotoPizza(6)).toBe('pizza-utuh');
    let x = 7;
    const rng = () => ((x = (x * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    const pizza = Array.from({ length: 300 }, () => soalAcak(3, rng)).filter((s) => s.teks.startsWith('Pizza'));
    expect(pizza.length).toBeGreaterThan(0);
    for (const s of pizza) {
      const n = Number(s.teks.match(/menjadi (\d+) bagian/)![1]);
      expect(s.foto).toBe(fotoPizza(n));
    }
  });
});

describe('peta petualangan (Beranda)', () => {
  const tampilkan = () =>
    render(
      <ProgresProvider>
        <MemoryRouter>
          <Beranda />
        </MemoryRouter>
      </ProgresProvider>,
    );

  it('menampilkan maskot, semua pos, dan harta karun', () => {
    localStorage.setItem(
      KUNCI_SIMPAN,
      JSON.stringify({ ...progresAwal(), selesai: ['prasyarat', 'konsep'], siswa: { nama: 'Rani Putri', kelas: 'IX-A', sejak: '' } }),
    );
    tampilkan();
    expect(screen.getByAltText(/Si Bulat/)).toBeInTheDocument();
    expect(screen.getByText(/2 pos sudah kamu taklukkan! Berikutnya: Simulasi/)).toBeInTheDocument();
    const pos = within(screen.getByRole('list')).getAllByRole('link');
    expect(pos).toHaveLength(MODUL.length);
    expect(pos[2]).toHaveTextContent('Pos 3 · Laboratorium Lingkaran');
    expect(pos[2]).toHaveTextContent('Lanjut ▶');
    expect(screen.getByRole('link', { name: /Harta Karun: Kartu Hasil/ })).toHaveAttribute('href', '/hasil');
  });

  it('pesan ajakan saat belum ada pos selesai', () => {
    tampilkan();
    expect(screen.getByText(/Ayo mulai petualangan/)).toBeInTheDocument();
  });
});
