import { useState } from 'react';
import { Link } from 'react-router-dom';
import PilihanSegmen from '../components/PilihanSegmen';
import Tombol from '../components/Tombol';
import type { Pi } from '../lib/geometri';
import { useProgres } from './ProgresContext';

export default function Pengaturan() {
  const { progres, aturPengaturan, reset } = useProgres();
  const [yakin, setYakin] = useState(false);
  const [sudahReset, setSudahReset] = useState(false);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Pengaturan</h1>

      <div className="flex flex-col gap-2">
        <p className="font-semibold">Ukuran huruf</p>
        <PilihanSegmen
          label="Ukuran huruf"
          nilai={progres.pengaturan.hurufBesar ? 'besar' : 'normal'}
          ubah={(v) => aturPengaturan({ hurufBesar: v === 'besar' })}
          pilihan={[
            { nilai: 'normal', teks: 'Normal' },
            { nilai: 'besar', teks: 'Besar' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold">Lagu latar</p>
        <PilihanSegmen
          label="Lagu latar"
          nilai={progres.pengaturan.musik ? 'nyala' : 'mati'}
          ubah={(v) => aturPengaturan({ musik: v === 'nyala' })}
          pilihan={[
            { nilai: 'nyala', teks: '🔊 Nyala' },
            { nilai: 'mati', teks: '🔇 Mati' },
          ]}
        />
        <p className="text-sm text-gray-600">Lagu hanya diputar di layar menu dan berhenti saat kamu belajar.</p>
      </div>

      <Link
        to="/pasang"
        className="flex min-h-12 items-center justify-center rounded-xl border border-gray-300 font-semibold"
      >
        📲 Pasang aplikasi di HP / laptop
      </Link>

      <div className="flex flex-col gap-2">
        <p className="font-semibold">Nilai π awal di Simulasi</p>
        <PilihanSegmen<Pi>
          label="Nilai π awal"
          nilai={progres.pengaturan.piDefault}
          ubah={(v) => aturPengaturan({ piDefault: v })}
          pilihan={[
            { nilai: '22/7', teks: 'π = 22/7' },
            { nilai: '3.14', teks: 'π = 3,14' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold">Progres belajar</p>
        <p className="text-sm text-gray-600">Progres hanya tersimpan di perangkat ini.</p>
        {sudahReset ? (
          <p role="status" className="font-semibold text-benar">
            Progres sudah dihapus.
          </p>
        ) : yakin ? (
          <div className="grid grid-cols-2 gap-3">
            <Tombol varian="kedua" onClick={() => setYakin(false)}>
              Batal
            </Tombol>
            <Tombol
              className="bg-salah hover:bg-red-700"
              onClick={() => {
                reset();
                setYakin(false);
                setSudahReset(true);
              }}
            >
              Ya, hapus
            </Tombol>
          </div>
        ) : (
          <Tombol varian="kedua" onClick={() => setYakin(true)}>
            Hapus progres
          </Tombol>
        )}
      </div>
    </section>
  );
}
