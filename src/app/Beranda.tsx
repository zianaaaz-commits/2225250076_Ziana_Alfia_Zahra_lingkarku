import { Link } from 'react-router-dom';
import Maskot, { URL_MASKOT } from '../components/Maskot';
import { MODUL } from '../content/modul';
import { sudahTerpasang } from '../lib/pasang';
import { gelarPetualang } from '../lib/petualangan';
import { modulSelesai, useProgres } from './ProgresContext';

const TINGGI_POS = 112; // px per pos pada peta
const posisiX = (i: number) => (i % 2 === 0 ? 25 : 75); // % lebar: zig-zag kiri–kanan

/** Warna pulau tiap pos yang belum selesai. */
const WARNA_POS = ['bg-amber-100', 'bg-orange-100', 'bg-violet-100', 'bg-sky-100', 'bg-rose-100', 'bg-yellow-100', 'bg-teal-100'];
/** Hiasan pemandangan di sela pos (di tepi peta, tidak menghalangi tulisan). */
const HIASAN = ['🌳', '🌼', '⛰️', '🍄', '🌲', '🏕️'];

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
  if (selesai === total) return 'Semua pos sudah kamu taklukkan! Peti harta karun sudah terbuka 🎁';
  return `Hebat, ${selesai} pos sudah kamu taklukkan! Berikutnya: ${berikutnya}.`;
}

// Beranda = peta Petualangan Negeri Lingkaran. Semua pos tetap dapat dibuka (tidak dikunci).
export default function Beranda() {
  const { progres } = useProgres();
  const status = MODUL.map((m) => modulSelesai(progres, m.id));
  const lanjut = status.indexOf(false); // pos pertama yang belum selesai
  const jumlahSelesai = status.filter(Boolean).length;
  const semuaSelesai = jumlahSelesai === MODUL.length;
  const gelar = gelarPetualang(jumlahSelesai);
  const jalur = jalurPeta(MODUL.length);

  return (
    <section className="-mx-4 bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100 px-4 pb-6">
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

      {/* Gelar & lencana */}
      <div className="mt-2 rounded-2xl bg-white/80 p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold">
            <span aria-hidden>{gelar.sekarang.ikon}</span> {gelar.sekarang.nama}
          </p>
          <p className="shrink-0 text-sm text-gray-600">
            {jumlahSelesai} dari {MODUL.length} pos selesai
          </p>
        </div>
        <div className="my-2 h-3 overflow-hidden rounded-full bg-gray-100" aria-hidden>
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-benar" style={{ width: `${(jumlahSelesai / MODUL.length) * 100}%` }} />
        </div>
        {gelar.berikutnya && (
          <p className="text-xs text-gray-600">
            {gelar.berikutnya.kurang} pos lagi menjadi {gelar.berikutnya.gelar.ikon} <b>{gelar.berikutnya.gelar.nama}</b> · Busur &amp; Juring
          </p>
        )}
        <ul className="mt-2 flex justify-between" aria-label="Lencana">
          {MODUL.map((m, i) => (
            <li
              key={m.id}
              title={status[i] ? `Lencana ${m.pos}` : 'Belum didapat'}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-lg ${
                status[i] ? 'bg-amber-300 shadow ring-2 ring-amber-500' : 'bg-gray-200 opacity-50 grayscale'
              }`}
            >
              <span aria-hidden>{status[i] ? m.ikon : '?'}</span>
              <span className="sr-only">{status[i] ? `Lencana ${m.pos}` : `Lencana ${m.pos} belum didapat`}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Peta */}
      <div className="relative mt-4 pt-8">
        <span aria-hidden className="absolute top-0 left-[4%] text-2xl opacity-80">☁️</span>
        <span aria-hidden className="absolute top-2 right-[8%] text-xl opacity-70">☁️</span>
        <span className="absolute top-1 left-1/4 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-xs font-bold shadow">
          🚩 Mulai
        </span>

        <div className="relative" style={{ height: MODUL.length * TINGGI_POS }}>
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 100 ${MODUL.length * TINGGI_POS}`}
            preserveAspectRatio="none"
          >
            <path d={jalur} fill="none" stroke="#D97706" strokeWidth={26} strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={0.25} />
            <path d={jalur} fill="none" stroke="#FDE68A" strokeWidth={20} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={jalur} fill="none" stroke="#F59E0B" strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          {HIASAN.slice(0, MODUL.length - 1).map((h, i) => (
            <span
              key={i}
              aria-hidden
              // Sisi berlawanan dengan pos berikutnya agar tidak menabrak maskot di pos itu.
              className={`absolute text-xl ${i % 2 === 0 ? 'left-[2%]' : 'right-[2%]'}`}
              style={{ top: (i + 1) * TINGGI_POS - 14 }}
            >
              {h}
            </span>
          ))}

          <ol className="absolute inset-0" aria-label="Peta petualangan">
            {MODUL.map((m, i) => {
              const selesai = status[i];
              const disarankan = i === lanjut;
              const kiri = i % 2 === 0;
              const bulatan = selesai
                ? 'border-green-700 bg-green-100'
                : disarankan
                  ? `border-aksi ring-4 ring-blue-200 ${WARNA_POS[i]}`
                  : `border-white ${WARNA_POS[i]}`;
              return (
                <li key={m.id} className="absolute inset-x-0" style={{ top: i * TINGGI_POS, height: TINGGI_POS }}>
                  <Link to={m.path} className="grid h-full grid-cols-2 items-center">
                    <span className={`flex justify-center ${kiri ? 'order-1' : 'order-2'}`}>
                      <span className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 text-3xl shadow-md ${bulatan}`}>
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
      </div>

      {/* Harta karun di ujung jalan */}
      <Link
        to="/hasil"
        className={`mt-3 flex min-h-20 items-center gap-3 rounded-2xl border-2 px-4 py-3 shadow-md ${
          semuaSelesai ? 'border-amber-500 bg-gradient-to-r from-amber-200 to-yellow-100' : 'border-amber-300 bg-amber-50'
        }`}
      >
        <span className="text-5xl" aria-hidden>
          {semuaSelesai ? '🎁' : '🔒'}
        </span>
        <span>
          <span className="block font-bold">Harta Karun: Kartu Hasil</span>
          <span className="block text-sm text-gray-700">
            {semuaSelesai
              ? 'Peti terbuka! Lihat hasilmu & kirim ke guru 🏆'
              : `Taklukkan ${MODUL.length - jumlahSelesai} pos lagi untuk membuka peti. Kartu Hasil tetap bisa dilihat.`}
          </span>
        </span>
      </Link>

      <Link
        to="/asisten"
        className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-orange-300 bg-orange-50 font-semibold text-orange-900"
      >
        💬 Tanya Kak Bulat (Asisten Belajar)
      </Link>

      {!sudahTerpasang() && (
        <Link
          to="/pasang"
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-dashed border-aksi bg-white/60 font-semibold text-aksi"
        >
          📲 Pasang LingkarKu di HP
        </Link>
      )}
    </section>
  );
}
