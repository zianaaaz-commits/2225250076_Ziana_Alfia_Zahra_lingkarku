import { useCallback, useState } from 'react';
import type { KonteksSoal } from '../lib/asisten/tipe';
import PanelAsisten from './PanelAsisten';

interface Props {
  ambilKonteks: () => KonteksSoal;
  kunci?: number;
  teks?: string;
  className?: string;
}

/** Tombol pembuka Asisten Belajar. Percakapan direset setiap kali panel dibuka. */
export default function TombolAsisten({ ambilKonteks, kunci, teks = '💬 Tanya Kak Bulat', className = '' }: Props) {
  const [buka, setBuka] = useState(false);
  const tutup = useCallback(() => setBuka(false), []);
  return (
    <>
      <button
        type="button"
        onClick={() => setBuka(true)}
        className={`min-h-12 rounded-xl border-2 border-orange-300 bg-orange-50 px-4 font-semibold text-orange-900 hover:bg-orange-100 ${className}`}
      >
        {teks}
      </button>
      {buka && <PanelAsisten ambilKonteks={ambilKonteks} kunci={kunci} tutup={tutup} />}
    </>
  );
}
