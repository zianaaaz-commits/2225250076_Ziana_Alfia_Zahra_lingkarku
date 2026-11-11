import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Halaman } from '../app/App';
import KartuHasil from '../app/KartuHasil';
import { ProgresProvider } from '../app/ProgresContext';
import { teksKartuHasil } from '../lib/kartuHasil';
import { bacaProgres, denganSiswa, KUNCI_SIMPAN, progresAwal, rapikanSiswa } from '../lib/progress';

beforeEach(() => localStorage.clear());

const simpan = (isi: object) => localStorage.setItem(KUNCI_SIMPAN, JSON.stringify({ ...progresAwal(), ...isi }));

describe('rapikanSiswa', () => {
  it('merapikan spasi', () => {
    expect(rapikanSiswa('  Rani   Putri ', ' IX  A ')).toEqual({ ok: true, nama: 'Rani Putri', kelas: 'IX A' });
  });

  it('menolak isian kosong, angka saja, atau terlalu panjang', () => {
    const kosong = rapikanSiswa('', '');
    expect(kosong.ok).toBe(false);
    if (!kosong.ok) expect(Object.keys(kosong.galat)).toEqual(['nama', 'kelas']);
    expect(rapikanSiswa('12345', 'IX').ok).toBe(false);
    expect(rapikanSiswa('A'.repeat(41), 'IX').ok).toBe(false);
    expect(rapikanSiswa('Rani', 'X'.repeat(13)).ok).toBe(false);
  });

  it('menerima nama dengan huruf non-Latin/aksen', () => {
    expect(rapikanSiswa('Siti Nur’aini', 'VIII-B').ok).toBe(true);
  });
});

describe('penyimpanan data siswa', () => {
  it('data siswa yang rusak diabaikan saat dibaca', () => {
    simpan({ siswa: { nama: '', kelas: 5 } });
    expect(bacaProgres().siswa).toBeUndefined();
  });

  it('tanggal "sejak" tidak berubah saat data diubah', () => {
    const awal = denganSiswa(progresAwal(), 'Rani', 'IX-A', new Date('2026-11-01T00:00:00Z'));
    const ubah = denganSiswa(awal, 'Rani Putri', 'IX-B', new Date('2026-12-01T00:00:00Z'));
    expect(ubah.siswa).toEqual({ nama: 'Rani Putri', kelas: 'IX-B', sejak: '2026-11-01T00:00:00.000Z' });
  });
});

describe('layar awal (wajib isi nama & kelas)', () => {
  const tampilkan = () =>
    render(
      <ProgresProvider>
        <MemoryRouter>
          <Halaman />
        </MemoryRouter>
      </ProgresProvider>,
    );

  it('aplikasi terkunci sampai nama & kelas diisi', () => {
    tampilkan();
    expect(screen.getByText('Selamat datang di LingkarKu')).toBeInTheDocument();
    expect(screen.queryByText('Busur & Juring')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Mulai belajar/ }));
    expect(screen.getByText(/minimal 2 huruf/)).toBeInTheDocument();
    expect(screen.queryByText('Busur & Juring')).toBeNull();

    fireEvent.change(screen.getByLabelText('Nama lengkap'), { target: { value: 'Rani Putri' } });
    fireEvent.change(screen.getByLabelText('Kelas'), { target: { value: 'IX-A' } });
    fireEvent.click(screen.getByRole('button', { name: /Mulai belajar/ }));

    expect(screen.getByText(/Halo, Rani!/)).toBeInTheDocument();
    expect(bacaProgres().siswa).toMatchObject({ nama: 'Rani Putri', kelas: 'IX-A' });
  });

  it('siswa yang sudah mengisi langsung masuk beranda', () => {
    simpan({ siswa: { nama: 'Budi', kelas: 'VIII-C', sejak: '' } });
    tampilkan();
    expect(screen.getByText(/Halo, Budi!/)).toBeInTheDocument();
    expect(screen.getByText('Kelas VIII-C')).toBeInTheDocument();
  });
});

describe('Kartu Hasil', () => {
  it('teks ringkasan memuat nama, kelas, modul, dan skor', () => {
    const t = teksKartuHasil({
      nama: 'Rani Putri',
      kelas: 'IX-A',
      tanggal: new Date(2026, 10, 11),
      modul: [
        { judul: 'Ingat Lagi', selesai: true },
        { judul: 'Latihan', selesai: false },
      ],
      skor: { '1': 0.89 },
    });
    expect(t).toContain('Nama  : Rani Putri');
    expect(t).toContain('Kelas : IX-A');
    expect(t).toContain('11 November 2026');
    expect(t).toContain('Langkah selesai: 1 dari 2');
    expect(t).toContain('✅ Ingat Lagi');
    expect(t).toContain('⬜ Latihan');
    expect(t).toContain('Level 1: 89%');
    expect(t).toContain('Level 2: belum');
  });

  it('tombol bagikan menyalin teks bila menu bagikan tidak tersedia', async () => {
    simpan({ siswa: { nama: 'Rani Putri', kelas: 'IX-A', sejak: '' }, skor: { '1': 1 } });
    const salin = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: salin }, configurable: true });
    render(
      <ProgresProvider>
        <MemoryRouter>
          <KartuHasil />
        </MemoryRouter>
      </ProgresProvider>,
    );
    expect(screen.getByText('Rani Putri')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Bagikan ke guru/ }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('disalin'));
    expect(salin.mock.calls[0][0]).toContain('Rani Putri');
  });
});
