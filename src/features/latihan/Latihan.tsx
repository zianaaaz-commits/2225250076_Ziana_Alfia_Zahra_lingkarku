import { Link } from 'react-router-dom';
import { useProgres } from '../../app/ProgresContext';
import { BANK_SOAL } from '../../content/bankSoal';
import { lulusLevel } from '../../lib/progress';

const LEVEL = [
  { level: 1, judul: 'Level 1', ringkas: 'Hitung busur & juring' },
  { level: 2, judul: 'Level 2', ringkas: 'Cari sudut, jari-jari, perbandingan' },
  { level: 3, judul: 'Level 3', ringkas: 'Soal cerita' },
] as const;

// F5 — Pilih level latihan. Semua level terbuka; disarankan berurutan.
export default function Latihan() {
  const { progres } = useProgres();
  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">Latihan</h1>
      <p className="mb-5 text-gray-600">Mulai dari Level 1, ya.</p>
      <ol className="flex flex-col gap-3">
        {LEVEL.map((l) => (
          <li key={l.level} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-bold">{l.judul}</p>
              {progres.skor[`${l.level}`] !== undefined && (
                <span className={`text-sm font-semibold ${lulusLevel(progres, `${l.level}`) ? 'text-benar' : 'text-gray-600'}`}>
                  Terbaik {Math.round(progres.skor[`${l.level}`]! * 100)}%{lulusLevel(progres, `${l.level}`) && ' ✓'}
                </span>
              )}
            </div>
            <p className="mb-3 text-gray-600">
              {l.ringkas} · {BANK_SOAL.filter((s) => s.level === l.level).length} soal
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to={`/latihan/${l.level}`}
                className="flex min-h-12 items-center justify-center rounded-xl bg-aksi font-semibold text-white"
              >
                Mulai
              </Link>
              <Link
                to={`/latihan/${l.level}?acak=1`}
                className="flex min-h-12 items-center justify-center rounded-xl border border-gray-300 font-semibold"
              >
                Soal acak
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
