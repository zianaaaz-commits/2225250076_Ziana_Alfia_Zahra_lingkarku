import { useEffect, useRef } from 'react';
import { RUMUS_BUSUR, RUMUS_JURING } from '../lib/latex';
import { teksPecahan } from '../lib/geometri';
import MathText from './MathText';
import Tombol from './Tombol';

const SUDUT = [30, 45, 60, 72, 90, 120, 180];

/** Ringkasan rumus yang dapat dibuka dari halaman mana pun. */
export default function KartuRumus({ tutup }: { tutup: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && tutup();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [tutup]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={tutup}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-kartu-rumus"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 outline-none sm:rounded-2xl"
      >
        <h2 id="judul-kartu-rumus" className="mb-4 text-xl font-bold">
          Kartu Rumus
        </h2>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl bg-orange-50 p-3">
            <MathText teks={RUMUS_BUSUR} className="text-lg" />
            <p className="text-sm text-gray-600">Ditanya panjang (cm, m)</p>
          </div>
          <div className="rounded-xl bg-sky-50 p-3">
            <MathText teks={RUMUS_JURING} className="text-lg" />
            <p className="text-sm text-gray-600">Ditanya luas (cm², m²)</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <MathText teks="Keliling $= 2\pi r$ · Luas $= \pi r^2$ · $d = 2r$" />
            <p className="mt-1 text-sm text-gray-600">π = 22/7 (jika r kelipatan 7) atau 3,14</p>
          </div>
          <table className="w-full text-center text-sm">
            <caption className="mb-1 text-left font-semibold">Pecahan sudut istimewa</caption>
            <tbody>
              <tr className="bg-purple-50">
                <th scope="row" className="p-1">α</th>
                {SUDUT.map((a) => <td key={a} className="p-1">{a}°</td>)}
              </tr>
              <tr>
                <th scope="row" className="p-1">α/360°</th>
                {SUDUT.map((a) => <td key={a} className="p-1 font-semibold">{teksPecahan(a)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <Tombol className="mt-4 w-full" onClick={tutup}>
          Tutup
        </Tombol>
      </div>
    </div>
  );
}
