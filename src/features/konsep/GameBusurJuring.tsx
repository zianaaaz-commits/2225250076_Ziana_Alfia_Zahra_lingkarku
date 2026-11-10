import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgres } from '../../app/ProgresContext';
import CircleSVG from '../../components/CircleSVG';
import Tombol from '../../components/Tombol';
import { GAME_BUSUR_JURING } from '../../content/gameBusurJuring';
import { WARNA } from '../../lib/warna';

type Jawab = 'busur' | 'juring';

export default function GameBusurJuring({ keluar }: { keluar: () => void }) {
  const [no, setNo] = useState(0);
  const [dipilih, setDipilih] = useState<Jawab | null>(null);
  const [skor, setSkor] = useState(0);
  const { tandai } = useProgres();
  const habis = no >= GAME_BUSUR_JURING.length;

  useEffect(() => {
    if (habis) tandai('konsep');
  }, [habis, tandai]);

  if (habis) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <h2 className="text-2xl font-bold">
          Benar {skor} dari {GAME_BUSUR_JURING.length}
        </h2>
        <p className="text-gray-600">Ingat: panjang → busur, luas → juring.</p>
        <Tombol
          onClick={() => {
            setNo(0);
            setSkor(0);
            setDipilih(null);
          }}
        >
          Main lagi
        </Tombol>
        <Link to="/simulasi" className="font-semibold text-aksi underline">
          Lanjut ke Simulasi
        </Link>
        <Tombol varian="kedua" onClick={keluar}>
          Kembali ke materi
        </Tombol>
      </div>
    );
  }

  const b = GAME_BUSUR_JURING[no];
  const sudah = dipilih !== null;
  const benar = dipilih === b.jawaban;

  const pilih = (j: Jawab) => {
    if (sudah) return;
    setDipilih(j);
    if (j === b.jawaban) setSkor((s) => s + 1);
  };

  const gayaTombol = (j: Jawab) => {
    if (!sudah) return 'border-gray-300';
    if (j === b.jawaban) return 'border-benar bg-green-50';
    if (j === dipilih) return 'border-salah bg-red-50';
    return 'border-gray-200 opacity-60';
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600">
        Soal {no + 1} dari {GAME_BUSUR_JURING.length}
      </p>
      {b.gambar && (
        <CircleSVG
          r={14}
          alpha={100}
          pi="22/7"
          tampil={b.gambar}
          label={false}
          nilai={false}
          className="mx-auto w-full max-w-60"
        />
      )}
      <p className="text-xl font-semibold">{b.teks}</p>

      <div className="grid grid-cols-2 gap-3">
        {(['busur', 'juring'] as const).map((j) => (
          <button
            key={j}
            type="button"
            disabled={sudah}
            onClick={() => pilih(j)}
            className={`flex min-h-16 items-center justify-center gap-2 rounded-xl border-2 text-lg font-bold ${gayaTombol(j)}`}
          >
            <span
              aria-hidden
              className="inline-block h-4 w-6 rounded"
              style={
                j === 'busur'
                  ? { borderTop: `5px solid ${WARNA.busur}`, borderRadius: '50% 50% 0 0' }
                  : { background: WARNA.juring, opacity: 0.6 }
              }
            />
            {j === 'busur' ? 'Busur' : 'Juring'}
          </button>
        ))}
      </div>

      {sudah && (
        <div
          role="status"
          className={`rounded-xl border-l-4 bg-gray-50 p-4 ${benar ? 'border-benar' : 'border-salah'}`}
        >
          <p className="font-bold">{benar ? 'Tepat!' : 'Belum tepat.'}</p>
          <p>{b.alasan}</p>
        </div>
      )}
      {sudah && (
        <Tombol
          onClick={() => {
            setNo((n) => n + 1);
            setDipilih(null);
          }}
        >
          Berikutnya
        </Tombol>
      )}
    </div>
  );
}
