import type { ReactNode } from 'react';
import { MASKOT } from '../content/gambar';

export const URL_MASKOT = `${import.meta.env.BASE_URL}gambar/maskot.webp`;

interface Props {
  /** Isi balon ucapan; tanpa ini hanya gambar maskot. */
  children?: ReactNode;
  /** Tinggi gambar maskot (kelas Tailwind). */
  ukuran?: string;
  className?: string;
}

/**
 * Si Bulat — maskot statis (tidak bergerak). Hanya dipakai di layar sambutan,
 * peta petualangan, dan layar perayaan; tidak di tengah langkah pengerjaan soal.
 */
export default function Maskot({ children, ukuran = 'h-24', className = '' }: Props) {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <img src={URL_MASKOT} alt={MASKOT.alt} className={`${ukuran} w-auto shrink-0 select-none`} draggable={false} />
      {children && (
        <div className="relative mb-4 flex-1 rounded-2xl border border-orange-200 bg-white p-3 shadow-sm">
          {/* ekor balon ucapan */}
          <span
            aria-hidden
            className="absolute -left-2 bottom-3 h-4 w-4 rotate-45 border-b border-l border-orange-200 bg-white"
          />
          <div className="relative">{children}</div>
        </div>
      )}
    </div>
  );
}
