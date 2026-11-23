import type { ReactNode } from 'react';
import Maskot from './Maskot';

/** Layar akhir (skor/misi selesai): Si Bulat memberi ucapan. */
export default function Perayaan({ judul, children }: { judul: string; children?: ReactNode }) {
  return (
    <Maskot ukuran="h-28" className="w-full text-left">
      <p className="text-lg font-bold">{judul}</p>
      {children && <div className="text-gray-700">{children}</div>}
    </Maskot>
  );
}
