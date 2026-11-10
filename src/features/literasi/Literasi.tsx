import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProgres } from '../../app/ProgresContext';
import CircleSVG from '../../components/CircleSVG';
import MathText from '../../components/MathText';
import { FASE, LITERASI, type Misi } from '../../content/literasi';
import LangkahMisi from './LangkahMisi';
import WiperSVG from './WiperSVG';

// Misi Literasi Matematika: Pahami → Rumuskan → Hitung → Tafsirkan → Jelaskan.

const WARNA_KONTEKS: Record<Misi['konteks'], string> = {
  Personal: 'bg-pink-100 text-pink-900',
  Sosial: 'bg-emerald-100 text-emerald-900',
  Saintifik: 'bg-violet-100 text-violet-900',
};

function Chip({ konteks }: { konteks: Misi['konteks'] }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${WARNA_KONTEKS[konteks]}`}>{konteks}</span>;
}

export function LiterasiDaftar() {
  const { progres } = useProgres();
  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">Misi Literasi</h1>
      <p className="mb-5 text-gray-600">Pakai busur & juring untuk memecahkan masalah sehari-hari.</p>
      <ol className="flex flex-col gap-3">
        {LITERASI.map((m, i) => (
          <li key={m.id}>
            <Link
              to={`/literasi/${m.id}`}
              className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-aksi"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold">{i + 1}</span>
              <span className="flex-1">
                <span className="block font-semibold">{m.judul}</span>
                <Chip konteks={m.konteks} />
              </span>
              {progres.selesai.includes(`literasi:${m.id}`) && (
                <span className="font-bold text-benar" aria-label="selesai">✓</span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PenandaFase({ aktif }: { aktif: number }) {
  return (
    <ol className="grid grid-cols-5 gap-1 text-center text-xs" aria-label="Tahap literasi">
      {FASE.map((f, i) => (
        <li key={f.id} aria-current={i === aktif ? 'step' : undefined}>
          <span
            className={`mx-auto mb-1 block h-2 rounded-full ${i < aktif ? 'bg-benar' : i === aktif ? 'bg-aksi' : 'bg-gray-200'}`}
          />
          <span className={i === aktif ? 'font-bold text-aksi' : 'text-gray-600'}>{f.label}</span>
        </li>
      ))}
    </ol>
  );
}

function KartuCerita({ misi }: { misi: Misi }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3">
      <MathText teks={misi.cerita} />
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg bg-gray-50 p-2 text-sm">
        {misi.info.map((x) => (
          <div key={x.label} className="contents">
            <dt className="text-gray-600">{x.label}</dt>
            <dd className="font-semibold">{x.nilai}</dd>
          </div>
        ))}
      </dl>
      {misi.gambar && <CircleSVG {...misi.gambar} maxR={misi.gambar.r} className="mx-auto w-full max-w-60" />}
      {misi.ilustrasi === 'wiper' && <WiperSVG className="mx-auto w-full max-w-72" />}
    </div>
  );
}

function Isi({ misi }: { misi: Misi }) {
  const { tandai } = useProgres();
  const [no, setNo] = useState(0);
  const [ceritaTerbuka, setCeritaTerbuka] = useState(true);
  const selesai = no >= misi.langkah.length;
  const idx = LITERASI.indexOf(misi);
  const berikutnya = LITERASI[idx + 1];

  useEffect(() => {
    if (selesai) tandai(`literasi:${misi.id}`);
  }, [selesai, misi.id, tandai]);

  const langkah = misi.langkah[no];
  const faseAktif = selesai ? FASE.length : FASE.findIndex((f) => f.id === langkah.fase);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{misi.judul}</h1>
        <Chip konteks={misi.konteks} />
      </div>
      <PenandaFase aktif={faseAktif} />

      {!selesai && (
        <>
          <button
            type="button"
            onClick={() => setCeritaTerbuka(!ceritaTerbuka)}
            aria-expanded={ceritaTerbuka}
            className="flex min-h-11 items-center justify-between rounded-xl bg-gray-100 px-3 font-semibold"
          >
            <span>📖 Cerita & data</span>
            <span aria-hidden>{ceritaTerbuka ? '▲' : '▼'}</span>
          </button>
          {ceritaTerbuka && <KartuCerita misi={misi} />}
          <p className="text-sm text-gray-600">
            Langkah {no + 1} dari {misi.langkah.length}
          </p>
          <LangkahMisi
            key={no}
            l={langkah}
            lanjut={() => {
              setNo((n) => n + 1);
              // Setelah tahap "pahami/rumuskan", sembunyikan cerita agar layar tidak padat (EL01).
              if (no >= 1) setCeritaTerbuka(false);
            }}
          />
        </>
      )}

      {selesai && (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <p className="text-xl font-bold">Misi selesai! 🎉</p>
          <p className="text-gray-600">
            Kamu sudah memahami masalah, merumuskannya, menghitung, menafsirkan hasil, dan menjelaskan alasanmu.
          </p>
          {berikutnya ? (
            <Link to={`/literasi/${berikutnya.id}`} className="flex min-h-12 w-full items-center justify-center rounded-xl bg-aksi font-semibold text-white">
              Misi berikutnya ▶
            </Link>
          ) : (
            <Link to="/" className="flex min-h-12 w-full items-center justify-center rounded-xl bg-aksi font-semibold text-white">
              Kembali ke beranda
            </Link>
          )}
          <Link to="/literasi" className="font-semibold text-aksi underline">
            Daftar misi
          </Link>
        </div>
      )}
    </section>
  );
}

export function LiterasiDetail() {
  const { id } = useParams();
  const misi = LITERASI.find((m) => m.id === id);
  if (!misi) {
    return (
      <p className="py-10 text-center">
        Misi tidak ditemukan. <Link to="/literasi" className="text-aksi underline">Daftar misi</Link>
      </p>
    );
  }
  return <Isi key={misi.id} misi={misi} />;
}
