import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProgres } from '../../app/ProgresContext';
import IsianAngka from '../../components/IsianAngka';
import KepalaSoal from '../../components/KepalaSoal';
import MathText from '../../components/MathText';
import StepReveal from '../../components/StepReveal';
import Tombol from '../../components/Tombol';
import { apakahIsian, CONTOH, type Melengkapi } from '../../content/contoh';

// F4 — Contoh bertahap (worked example) → soal melengkapi (completion problem). GL01, GL02, EL01.

function SoalMelengkapi({ id, m, berikutnya }: { id: string; m: Melengkapi; berikutnya?: string }) {
  const jumlahIsian = m.langkah.filter(apakahIsian).length;
  const [benar, setBenar] = useState(0);
  const selesai = benar >= jumlahIsian;
  const { tandai } = useProgres();

  useEffect(() => {
    if (selesai) tandai(`contoh:${id}`);
  }, [selesai, id, tandai]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Sekarang kamu coba!</h2>
      <p className="text-gray-600">Lengkapi kotak yang kosong.</p>
      <KepalaSoal soal={m.soal} gambar={m.gambar} />
      <ol className="flex flex-col gap-2">
        {m.langkah.map((l, i) => (
          <li key={i} className="rounded-xl border border-gray-200 p-3">
            {apakahIsian(l) ? (
              <IsianAngka {...l} label={`${i + 1}. ${l.label}`} onBenar={() => setBenar((b) => b + 1)} />
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-600">
                  {i + 1}. {l.label}
                </p>
                <MathText teks={l.isi} className="text-lg" />
              </>
            )}
          </li>
        ))}
      </ol>
      {selesai && (
        <div role="status" className="flex flex-col gap-3 rounded-xl border-l-4 border-benar bg-gray-50 p-4">
          <p className="font-bold">Hebat, semua kotak benar!</p>
          {berikutnya ? (
            <Link to={`/contoh/${berikutnya}`} className="flex min-h-12 items-center justify-center rounded-xl bg-aksi font-semibold text-white">
              Contoh berikutnya ▶
            </Link>
          ) : (
            <Link to="/latihan" className="flex min-h-12 items-center justify-center rounded-xl bg-aksi font-semibold text-white">
              Lanjut ke Latihan ▶
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function Isi({ id }: { id: string }) {
  const idx = CONTOH.findIndex((c) => c.id === id);
  const [fase, setFase] = useState<'contoh' | 'coba'>('contoh');

  if (idx < 0) {
    return (
      <p className="py-10 text-center">
        Contoh tidak ditemukan. <Link to="/contoh" className="text-aksi underline">Lihat daftar contoh</Link>
      </p>
    );
  }

  const c = CONTOH[idx];
  const berikutnya = CONTOH[idx + 1]?.id;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">{c.judul}</h1>
        <span className="text-sm text-gray-600">
          Contoh {idx + 1} dari {CONTOH.length}
        </span>
      </div>
      {fase === 'contoh' ? (
        <>
          <KepalaSoal soal={c.soal} gambar={c.gambar} />
          <StepReveal
            langkah={c.langkah}
            selesai={<Tombol onClick={() => setFase('coba')}>Sekarang coba ▶</Tombol>}
          />
        </>
      ) : (
        <>
          <SoalMelengkapi id={c.id} m={c.melengkapi} berikutnya={berikutnya} />
          <Tombol varian="kedua" onClick={() => setFase('contoh')}>
            ◀ Lihat contohnya lagi
          </Tombol>
        </>
      )}
    </section>
  );
}

export default function ContohDetail() {
  const { id = '' } = useParams();
  // key={id} → status direset saat pindah ke contoh lain.
  return <Isi key={id} id={id} />;
}
