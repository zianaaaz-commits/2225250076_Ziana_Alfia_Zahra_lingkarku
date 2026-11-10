import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CircleSVG from '../../components/CircleSVG';
import KotakUmpanBalik from '../../components/KotakUmpanBalik';
import Tombol from '../../components/Tombol';
import { useProgres } from '../../app/ProgresContext';
import { CERITA, type Cerita as DataCerita, type Token } from '../../content/cerita';
import KartuSoal from '../latihan/KartuSoal';
import TandaiCerita from './TandaiCerita';

// F6 — Soal Cerita Terpandu: tandai → "panjang atau luas?" → gambar → hitung (EL05, K03).

const tautanUtama = 'flex min-h-12 items-center justify-center rounded-xl bg-aksi font-semibold text-white';

export function CeritaDaftar() {
  const { progres } = useProgres();
  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">Soal Cerita</h1>
      <p className="mb-5 text-gray-600">Tandai dulu yang diketahui dan ditanya.</p>
      <ol className="flex flex-col gap-3">
        {CERITA.map((c, i) => (
          <li key={c.id}>
            <Link
              to={`/cerita/${c.id}`}
              className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-aksi"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold">{i + 1}</span>
              <span className="flex-1 font-semibold">{c.judul}</span>
              {progres.selesai.includes(`cerita:${c.id}`) && <span className="font-bold text-benar" aria-label="selesai">✓</span>}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Ringkasan({ cerita }: { cerita: DataCerita }) {
  const token = cerita.segmen.filter((s): s is Token => typeof s !== 'string');
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="rounded-xl bg-indigo-50 p-3">
        <p className="mb-1 font-bold text-indigo-900">Diketahui</p>
        {token.filter((t) => t.peran === 'diketahui').map((t) => <p key={t.teks}>{t.makna}</p>)}
      </div>
      <div className="rounded-xl bg-yellow-50 p-3">
        <p className="mb-1 font-bold text-yellow-900">Ditanya</p>
        {token.filter((t) => t.peran === 'ditanya').map((t) => <p key={t.teks}>{t.makna}</p>)}
      </div>
    </div>
  );
}

function Isi({ cerita }: { cerita: DataCerita }) {
  const { tandai } = useProgres();
  const [fase, setFase] = useState<'tandai' | 'pemandu' | 'gambar' | 'hitung' | 'selesai'>('tandai');
  const [pilihJenis, setPilihJenis] = useState<'panjang' | 'luas' | null>(null);
  const idx = CERITA.indexOf(cerita);
  const berikutnya = CERITA[idx + 1];

  useEffect(() => {
    if (fase === 'selesai') tandai(`cerita:${cerita.id}`);
  }, [fase, cerita.id, tandai]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">{cerita.judul}</h1>
        <span className="text-sm text-gray-600">
          {idx + 1} dari {CERITA.length}
        </span>
      </div>

      {fase === 'tandai' && <TandaiCerita cerita={cerita} benar={() => setFase('pemandu')} />}

      {fase !== 'tandai' && fase !== 'hitung' && fase !== 'selesai' && (
        <>
          <KotakUmpanBalik benar>
            <p>Semua informasi sudah ditandai dengan benar.</p>
          </KotakUmpanBalik>
          <Ringkasan cerita={cerita} />
          <p className="text-lg font-semibold">Yang ditanya panjang atau luas?</p>
          <div className="grid grid-cols-2 gap-3">
            {(['panjang', 'luas'] as const).map((j) => (
              <Tombol
                key={j}
                varian={pilihJenis === j ? 'utama' : 'kedua'}
                disabled={fase === 'gambar'}
                onClick={() => {
                  setPilihJenis(j);
                  if (j === cerita.jenis) setFase('gambar');
                }}
              >
                {j === 'panjang' ? 'Panjang (cm/m)' : 'Luas (cm²/m²)'}
              </Tombol>
            ))}
          </div>
          {pilihJenis && pilihJenis !== cerita.jenis && fase === 'pemandu' && (
            <KotakUmpanBalik benar={false}>
              <p>Baca lagi bagian yang kamu tandai “Ditanya”.</p>
            </KotakUmpanBalik>
          )}
        </>
      )}

      {fase === 'gambar' && (
        <>
          <p className="font-semibold">
            Tepat! {cerita.jenis === 'panjang' ? 'Panjang → busur (2πr).' : 'Luas → juring (πr²).'} Ini gambarnya:
          </p>
          <CircleSVG {...cerita.gambar} maxR={cerita.gambar.r} className="mx-auto w-full max-w-sm" />
          <Tombol onClick={() => setFase('hitung')}>Lanjut menghitung ▶</Tombol>
        </>
      )}

      {fase === 'hitung' && <KartuSoal soal={cerita.soal} selesai={() => setFase('selesai')} />}

      {fase === 'selesai' && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-xl font-bold">Soal cerita selesai! 🎉</p>
          {berikutnya ? (
            <Link to={`/cerita/${berikutnya.id}`} className={`${tautanUtama} w-full`}>
              Soal cerita berikutnya ▶
            </Link>
          ) : (
            <Link to="/" className={`${tautanUtama} w-full`}>
              Kembali ke beranda
            </Link>
          )}
          <Link to="/cerita" className="font-semibold text-aksi underline">
            Daftar soal cerita
          </Link>
        </div>
      )}
    </section>
  );
}

export function CeritaDetail() {
  const { id } = useParams();
  const cerita = CERITA.find((c) => c.id === id);
  if (!cerita) {
    return (
      <p className="py-10 text-center">
        Soal tidak ditemukan. <Link to="/cerita" className="text-aksi underline">Daftar soal cerita</Link>
      </p>
    );
  }
  return <Isi key={cerita.id} cerita={cerita} />;
}
