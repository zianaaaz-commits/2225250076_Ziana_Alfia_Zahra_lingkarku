import { useState, type ReactNode } from 'react';
import MathText from './MathText';
import Tombol from './Tombol';

export interface Langkah {
  label: string;
  isi: string;
}

interface Props {
  langkah: Langkah[];
  /** Ditampilkan menggantikan tombol "Langkah berikutnya" setelah semua langkah muncul. */
  selesai: ReactNode;
}

/** Menampilkan penyelesaian satu langkah per ketukan (EL01, GL01). */
export default function StepReveal({ langkah, selesai }: Props) {
  const [n, setN] = useState(1);
  const habis = n >= langkah.length;

  return (
    <div className="flex flex-col gap-3">
      <ol className="flex flex-col gap-2" aria-live="polite">
        {langkah.slice(0, n).map((l, i) => (
          <li
            key={i}
            ref={i === n - 1 && n > 1 ? (el) => el?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }) : undefined}
            className={`rounded-xl border p-3 ${i === n - 1 ? 'border-aksi bg-blue-50' : 'border-gray-200'}`}
          >
            <p className="text-sm font-semibold text-gray-600">
              {i + 1}. {l.label}
            </p>
            <MathText teks={l.isi} className="text-lg" />
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-2 gap-3">
        <Tombol varian="kedua" disabled={n <= 1} onClick={() => setN(n - 1)}>
          ◀ Mundur
        </Tombol>
        {habis ? selesai : <Tombol onClick={() => setN(n + 1)}>Langkah berikutnya ▶</Tombol>}
      </div>
      <p className="text-center text-sm text-gray-600">
        Langkah {n} dari {langkah.length}
      </p>
    </div>
  );
}
