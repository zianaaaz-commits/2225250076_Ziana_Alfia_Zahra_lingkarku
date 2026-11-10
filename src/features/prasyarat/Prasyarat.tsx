import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgres } from '../../app/ProgresContext';
import Kuis from '../../components/Kuis';
import MathText from '../../components/MathText';
import NavLangkah from '../../components/NavLangkah';
import Tombol from '../../components/Tombol';
import UnsurSVG from '../../components/UnsurSVG';
import { KARTU_PRASYARAT, KUIS_PRASYARAT } from '../../content/prasyarat';

// F1 — Ingat Lagi: unsur lingkaran sebelum rumus (pre-training, IL03).
export default function Prasyarat() {
  const [fase, setFase] = useState<'kartu' | 'kuis'>('kartu');
  const [i, setI] = useState(0);
  const { tandai } = useProgres();
  const selesaiKuis = useCallback(() => tandai('prasyarat'), [tandai]);

  if (fase === 'kuis') {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Cek Cepat</h1>
        <Kuis
          butir={KUIS_PRASYARAT}
          onSelesai={selesaiKuis}
          akhir={(skor) => (
            <>
              <p className="text-gray-600">
                {skor >= 4 ? 'Hebat! Kamu siap lanjut.' : 'Coba baca kartunya sekali lagi, ya.'}
              </p>
              <Link
                to="/konsep"
                className="flex min-h-12 items-center rounded-xl bg-aksi px-4 font-semibold text-white"
              >
                Lanjut: Busur vs Juring ▶
              </Link>
              <Tombol
                varian="kedua"
                onClick={() => {
                  setFase('kartu');
                  setI(0);
                }}
              >
                Baca kartu lagi
              </Tombol>
            </>
          )}
        />
      </section>
    );
  }

  const k = KARTU_PRASYARAT[i];
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">{k.judul}</h1>
        <span className="text-sm text-gray-600">
          {i + 1}/{KARTU_PRASYARAT.length}
        </span>
      </div>
      <UnsurSVG sorot={k.sorot} className="mx-auto w-full max-w-xs" />
      <MathText teks={k.teks} className="text-center text-lg" />
      <NavLangkah
        i={i}
        total={KARTU_PRASYARAT.length}
        ubah={setI}
        teksTerakhir="Cek cepat ▶"
        terakhir={() => setFase('kuis')}
      />
    </section>
  );
}
