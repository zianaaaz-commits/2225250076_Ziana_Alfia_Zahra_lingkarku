import { Link } from 'react-router-dom';
import Maskot, { URL_MASKOT } from '../components/Maskot';
import { MODUL } from '../content/modul';
import { sudahTerpasang } from '../lib/pasang';
import { modulSelesai, useProgres } from './ProgresContext';

const TINGGI_POS = 112; // px per pos pada peta
const posisiX = (i: number) => (i % 2 === 0 ? 25 : 75); // % lebar: zig-zag kiri–kanan

/** Jalur berkelok yang menghubungkan pusat setiap pos (koordinat: x dalam %, y dalam px). */
function jalurPeta(n: number): string {
  const titik = Array.from({ length: n }, (_, i) => ({ x: posisiX(i), y: i * TINGGI_POS + TINGGI_POS / 2 }));
  return titik
    .map((t, i) => {
      if (i === 0) return `M ${t.x} ${t.y}`;
      const s = titik[i - 1];
      return `C ${s.x} ${s.y + TINGGI_POS / 2}, ${t.x} ${t.y - TINGGI_POS / 2}, ${t.x} ${t.y}`;
    })
    .join(' ');
}

function pesanMaskot(selesai: number, total: number, berikutnya?: string): string {
  if (selesai === 0) return `Ayo mulai petualangan di Negeri Lingkaran! Pos pertama: ${berikutnya}.`;
  if (selesai === total) return 'Semua pos sudah kamu taklukkan! Ambil harta karunmu di ujung jalan 🏆';
  return `Hebat, ${selesai} pos sudah kamu taklukkan! Berikutnya: ${berikutnya}.`;
}

// Beranda = peta Petualangan Negeri Lingkaran. Semua pos tetap dapat dibuka (tidak dikunci).
export default function Beranda() {
  const { progres } = useProgres();
  const status = MODUL.map((m) => modulSelesai(progres, m.id));
  const lanjut = status.indexOf(false); // pos pertama yang belum selesai
  const jumlahSelesai = status.filter(Boolean).length;
  const jalur = jalurPeta(MODUL.length);

  return (
    <section className="-mx-4 bg-gradient-to-b from-sky-50 via-white to-emerald-50 px-4 pb-6">
      <Maskot ukuran="h-24" className="pt-2">
        {progres.siswa && (
          <p className="font-semibold text-aksi">
            Halo, {progres.siswa.nama.split(' ')[0]}! 👋{' '}
            <span className="font-normal text-gray-600">Kelas {progres.siswa.kelas}</span>
          </p>
        )}
        <p className="text-sm">{pesanMaskot(jumlahSelesai, MODUL.length, MODUL[lanjut]?.judul)}</p>
      </Maskot>

      <h1 className="mt-2 text-2xl font-bold">Petualangan Negeri Lingkaran</h1>
      <p className="mb-2 text-gray-600">
        {jumlahSelesai} dari {MODUL.length} pos selesai · Busur &amp; Juring
      </p>
      <div className="mb-4 h-3 overflow-hidden rounded-full bg-white shadow-inner" aria-hidden>
        <div className="h-full rounded-full bg-benar" style={{ width: `${(jumlahSelesai / MODUL.length) * 100}%` }} />
      </div>

      <div className="relative" style={{ height: MODUL.length * TINGGI_POS }}>
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 100 ${MODUL.length * TINGGI_POS}`}
          preserveAspectRatio="none"
        >
          <path d={jalur} fill="none" stroke="#FDE68A" strokeWidth={22} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d={jalur} fill="none" stroke="#F59E0B" strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>

        <ol className="absolute inset-0">
          {MODUL.map((m, i) => {
            const selesai = status[i];
            const disarankan = i === lanjut;
            const kiri = i % 2 === 0;
            const bulatan = selesai
              ? 'border-green-700 bg-green-100'
              : disarankan
                ? 'border-aksi bg-white ring-4 ring-blue-200'
                : 'border-gray-300 bg-white';
            return (
              <li key={m.id} className="absolute inset-x-0" style={{ top: i * TINGGI_POS, height: TINGGI_POS }}>
                <Link to={m.path} className="grid h-full grid-cols-2 items-center">
                  <span className={`flex justify-center ${kiri ? 'order-1' : 'order-2'}`}>
                    <span className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 text-3xl shadow ${bulatan}`}>
                      <span aria-hidden>{m.ikon}</span>
                      {selesai && (
                        <span
                          aria-label="selesai"
                          className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-benar text-sm font-bold text-white"
                        >
                          ✓
                        </span>
                      )}
                      {disarankan && (
                        <img src={URL_MASKOT} alt="" className="absolute -top-7 -right-6 h-11 w-auto" draggable={false} />
                      )}
                    </span>
                  </span>
                  <span className={`rounded-xl bg-white/90 p-2 shadow-sm ${kiri ? 'order-2 mr-1' : 'order-1 ml-1'}`}>
                    <span className="block text-xs text-gray-600">
                      Pos {i + 1} · {m.pos}
                    </span>
                    <span className="block font-semibold leading-tight">{m.judul}</span>
                    {disarankan && <span className="mt-0.5 block text-sm font-semibold text-aksi">Lanjut ▶</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <Link
        to="/hasil"
        className="mt-2 flex min-h-16 items-center gap-3 rounded-2xl border-2 border-amber-400 bg-amber-50 px-4 py-3 shadow-sm"
      >
        <span className="text-4xl" aria-hidden>
          🏆
        </span>
        <span>
          <span className="block font-bold">Harta Karun: Kartu Hasil</span>
          <span className="block text-sm text-gray-600">Lihat hasilmu & kirim ke guru</span>
        </span>
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
