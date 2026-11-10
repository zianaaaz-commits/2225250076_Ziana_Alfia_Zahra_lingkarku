import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CircleSVG from '../components/CircleSVG';
import Simulasi from '../features/simulasi/Simulasi';
import Konsep from '../features/konsep/Konsep';
import { GAME_BUSUR_JURING } from '../content/gameBusurJuring';
import { TEBAKAN } from '../content/tebakan';
import { pecahanSederhana, tampilAngka, teksPecahan } from '../lib/geometri';

describe('pecahan sudut', () => {
  it.each([
    [90, '1/4'],
    [72, '1/5'],
    [120, '1/3'],
    [360, '1'],
    [0, '0'],
    [100, '5/18'],
  ])('%i° → %s', (a, hasil) => expect(teksPecahan(a)).toBe(hasil));

  it('pecahanSederhana(45) = [1, 8]', () => expect(pecahanSederhana(45)).toEqual([1, 8]));
  it('tampilAngka memberi ≈ hanya jika dibulatkan', () => {
    expect(tampilAngka(22)).toBe('22');
    expect(tampilAngka(44 / 3)).toBe('≈ 14,67');
  });
});

describe('CircleSVG', () => {
  it('menyebut nilai busur & juring di aria-label', () => {
    render(<CircleSVG r={14} alpha={90} pi="22/7" />);
    const svg = screen.getByRole('img');
    expect(svg).toHaveAccessibleName(/busur 22 cm/);
    expect(svg).toHaveAccessibleName(/juring 154 cm persegi/);
  });

  it('tampil="busur" tidak menyebut juring', () => {
    render(<CircleSVG r={14} alpha={90} pi="22/7" tampil="busur" />);
    expect(screen.getByRole('img')).not.toHaveAccessibleName(/juring/);
  });

  it('sudut 360° tidak error dan busur = keliling', () => {
    render(<CircleSVG r={7} alpha={360} pi="22/7" />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/busur 44 cm/);
  });
});

describe('Simulasi', () => {
  const tampilkan = () =>
    render(
      <MemoryRouter>
        <Simulasi />
      </MemoryRouter>,
    );

  it('awal: α=90°, r=14 → busur 22 cm, juring 154 cm²', () => {
    tampilkan();
    expect(screen.getAllByText('22 cm').length).toBeGreaterThan(0);
    expect(screen.getAllByText('154 cm²').length).toBeGreaterThan(0);
  });

  it('tombol sudut cepat 180° memperbarui hasil', () => {
    tampilkan();
    fireEvent.click(screen.getByRole('button', { name: '180°' }));
    expect(screen.getAllByText('44 cm').length).toBeGreaterThan(0);
    expect(screen.getAllByText('308 cm²').length).toBeGreaterThan(0);
  });

  it('slider jari-jari memperbarui hasil', () => {
    tampilkan();
    fireEvent.change(screen.getByLabelText('Jari-jari r'), { target: { value: '7' } });
    expect(screen.getAllByText('11 cm').length).toBeGreaterThan(0);
  });

  it('mode Bandingkan menunjukkan kelipatan', () => {
    tampilkan();
    fireEvent.click(screen.getByRole('radio', { name: 'Bandingkan' }));
    expect(screen.getByText(/busur B = 2 × busur A/)).toBeInTheDocument();
  });

  it('mode Tebak Dulu memberi umpan balik', () => {
    tampilkan();
    fireEvent.click(screen.getByRole('radio', { name: 'Tebak Dulu' }));
    fireEvent.click(screen.getByRole('button', { name: TEBAKAN[0].pilihan[TEBAKAN[0].benar] }));
    expect(screen.getByRole('status')).toHaveTextContent('Tepat!');
  });
});

describe('Konsep & game', () => {
  it('jawaban kunci game seimbang (tidak semua sama)', () => {
    const busur = GAME_BUSUR_JURING.filter((b) => b.jawaban === 'busur').length;
    expect(busur).toBeGreaterThan(2);
    expect(GAME_BUSUR_JURING.length - busur).toBeGreaterThan(2);
  });

  it('dapat menelusuri layar materi sampai ke game', () => {
    render(
      <MemoryRouter>
        <Konsep />
      </MemoryRouter>,
    );
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole('button', { name: /Berikutnya/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Main!' }));
    expect(screen.getByText(/Soal 1 dari 10/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Busur' }));
    expect(screen.getByRole('status')).toHaveTextContent('Tepat!');
  });
});
