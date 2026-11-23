import { existsSync } from 'node:fs';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Beranda from '../app/Beranda';
import { ProgresProvider } from '../app/ProgresContext';
import { BANK_SOAL } from '../content/bankSoal';
import { CERITA } from '../content/cerita';
import { CONTOH } from '../content/contoh';
import { FOTO, fotoPizza, urlFoto, type FotoId } from '../content/gambar';
import { GAME_BUSUR_JURING } from '../content/gameBusurJuring';
import { LITERASI } from '../content/literasi';
import { gelarPetualang } from '../lib/petualangan';
import { MODUL } from '../content/modul';
import { soalAcak } from '../lib/generator';
import { KUNCI_SIMPAN, progresAwal } from '../lib/progress';

beforeEach(() => localStorage.clear());

describe('gambar', () => {
  it('semua file gambar & maskot tersedia', () => {
    for (const id of Object.keys(FOTO) as FotoId[]) expect(existsSync(`public/${urlFoto(id)}`)).toBe(true);
    expect(existsSync('public/gambar/maskot.webp')).toBe(true);
  });

  const berfoto: { teks: string; foto: FotoId }[] = [
    ...BANK_SOAL.flatMap((s) => (s.foto ? [{ teks: s.teks, foto: s.foto }] : [])),
    ...CONTOH.flatMap((c) => [
      ...(c.foto ? [{ teks: c.soal, foto: c.foto }] : []),
      ...(c.melengkapi.foto ? [{ teks: c.melengkapi.soal, foto: c.melengkapi.foto }] : []),
    ]),
    ...CERITA.flatMap((c) => (c.foto ? [{ teks: c.soal.teks, foto: c.foto }] : [])),
    ...GAME_BUSUR_JURING.flatMap((g) => (g.foto ? [{ teks: g.teks, foto: g.foto }] : [])),
    ...LITERASI.flatMap((m) => (m.foto ? [{ teks: `${m.judul} ${m.cerita}`, foto: m.foto }] : [])),
  ];

  it('setiap gambar hanya dipakai pada soal yang konteksnya sama', () => {
    for (const b of berfoto) expect(b.teks.toLowerCase()).toContain(FOTO[b.foto].kata);
  });

  it('setiap gambar konteks benar-benar dipakai (konten tetap atau soal acak)', () => {
    let x = 3;
    const rng = () => ((x = (x * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    const acak = Array.from({ length: 500 }, () => soalAcak(3, rng)).flatMap((s) => (s.foto ? [s.foto] : []));
    const dipakai = new Set([...berfoto.map((b) => b.foto), ...acak]);
    for (const id of Object.keys(FOTO)) expect(dipakai.has(id as FotoId)).toBe(true);
  });

  it('semua soal cerita & misi literasi punya gambar konteks', () => {
    expect(CERITA.every((c) => c.foto)).toBe(true);
    expect(LITERASI.every((m) => m.foto)).toBe(true);
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

  it('semua soal cerita acak (level 3) bergambar sesuai konteks', () => {
    let x = 11;
    const rng = () => ((x = (x * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    for (const s of Array.from({ length: 300 }, () => soalAcak(3, rng))) {
      expect(s.foto).toBeDefined();
      expect(s.teks.toLowerCase()).toContain(FOTO[s.foto!].kata);
    }
  });
});

describe('gelar petualang', () => {
  it.each([
    [0, 'Petualang Pemula', 'Penjelajah Muda', 1],
    [1, 'Penjelajah Muda', 'Pemburu Busur', 2],
    [4, 'Pemburu Busur', 'Ksatria Juring', 1],
    [6, 'Ksatria Juring', 'Master Negeri Lingkaran', 1],
  ])('%i pos → %s', (n, sekarang, berikut, kurang) => {
    const g = gelarPetualang(n);
    expect(g.sekarang.nama).toBe(sekarang);
    expect(g.berikutnya).toEqual({ gelar: expect.objectContaining({ nama: berikut }), kurang });
  });

  it('7 pos → gelar tertinggi tanpa gelar berikutnya', () => {
    const g = gelarPetualang(7);
    expect(g.sekarang.nama).toBe('Master Negeri Lingkaran');
    expect(g.berikutnya).toBeUndefined();
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
    const pos = within(screen.getByRole('list', { name: 'Peta petualangan' })).getAllByRole('link');
    expect(pos).toHaveLength(MODUL.length);
    expect(pos[2]).toHaveTextContent('Pos 3 · Laboratorium Lingkaran');
    expect(pos[2]).toHaveTextContent('Lanjut ▶');
    expect(screen.getByRole('link', { name: /Harta Karun: Kartu Hasil/ })).toHaveAttribute('href', '/hasil');
    expect(screen.getByText(/Penjelajah Muda/)).toBeInTheDocument();
    expect(screen.getByText(/Taklukkan 5 pos lagi/)).toBeInTheDocument();
    const lencana = within(screen.getByRole('list', { name: 'Lencana' })).getAllByRole('listitem');
    expect(lencana).toHaveLength(MODUL.length);
    expect(lencana[0]).toHaveTextContent('Lencana Bekal Petualang');
    expect(lencana[2]).toHaveTextContent('belum didapat');
  });

  it('peti harta karun terbuka setelah semua pos selesai', () => {
    localStorage.setItem(
      KUNCI_SIMPAN,
      JSON.stringify({
        ...progresAwal(),
        selesai: ['prasyarat', 'konsep', 'simulasi', ...CONTOH.map((c) => `contoh:${c.id}`), ...CERITA.map((c) => `cerita:${c.id}`), ...LITERASI.map((m) => `literasi:${m.id}`)],
        skor: { '1': 1, '2': 1, '3': 1 },
      }),
    );
    tampilkan();
    expect(screen.getByText(/Peti terbuka!/)).toBeInTheDocument();
    expect(screen.getByText(/Master Negeri Lingkaran/)).toBeInTheDocument();
  });

  it('pesan ajakan saat belum ada pos selesai', () => {
    tampilkan();
    expect(screen.getByText(/Ayo mulai petualangan/)).toBeInTheDocument();
  });
});
