import { Link } from 'react-router-dom';
import { MODUL } from '../content/modul';
import { sudahTerpasang } from '../lib/pasang';
import { modulSelesai, useProgres } from './ProgresContext';

export default function Beranda() {
  const { progres } = useProgres();
  const status = MODUL.map((m) => modulSelesai(progres, m.id));
  const lanjut = status.indexOf(false); // modul pertama yang belum selesai
  const jumlahSelesai = status.filter(Boolean).length;

  return (
    <section>
      {progres.siswa && (
        <p className="mb-1 font-semibold text-aksi">
          Halo, {progres.siswa.nama.split(' ')[0]}! 👋{' '}
          <span className="font-normal text-gray-600">Kelas {progres.siswa.kelas}</span>
        </p>
      )}
      <h1 className="mb-1 text-2xl font-bold">Busur &amp; Juring</h1>
      <p className="mb-5 text-gray-600">
        {jumlahSelesai === 0
          ? 'Ikuti langkahnya dari atas ke bawah.'
          : jumlahSelesai === MODUL.length
            ? 'Semua langkah selesai. Hebat! 🎉'
            : `${jumlahSelesai} dari ${MODUL.length} langkah selesai.`}
      </p>

      <ol className="flex flex-col gap-3">
        {MODUL.map((m, i) => {
          const selesai = status[i];
          const disarankan = i === lanjut;
          return (
            <li key={m.id}>
              <Link
                to={m.path}
                className={`flex min-h-14 items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm hover:border-aksi ${
                  disarankan ? 'border-aksi ring-2 ring-blue-100' : 'border-gray-200'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-white ${
                    selesai ? 'bg-benar' : 'bg-aksi'
                  }`}
                  aria-label={selesai ? 'selesai' : undefined}
                >
                  {selesai ? '✓' : i + 1}
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{m.judul}</span>
                  <span className="block text-sm text-gray-600">{m.ringkas}</span>
                </span>
                {disarankan && <span className="text-sm font-semibold text-aksi">Lanjut ▶</span>}
              </Link>
            </li>
          );
        })}
      </ol>

      <Link
        to="/hasil"
        className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-aksi font-semibold text-white"
      >
        📋 Kartu Hasil (kirim ke guru)
      </Link>

      {!sudahTerpasang() && (
        <Link
          to="/pasang"
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-dashed border-aksi font-semibold text-aksi"
        >
          📲 Pasang LingkarKu di HP
        </Link>
      )}
    </section>
  );
}
