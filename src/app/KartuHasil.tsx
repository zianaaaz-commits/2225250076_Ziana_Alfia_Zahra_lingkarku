import { useMemo, useState } from 'react';
import Tombol from '../components/Tombol';
import { MODUL } from '../content/modul';
import { bagikanTeks } from '../lib/bagikan';
import { formatTanggal, persen, teksKartuHasil } from '../lib/kartuHasil';
import { lulusLevel } from '../lib/progress';
import { modulSelesai, useProgres } from './ProgresContext';

const PESAN = {
  dibagikan: 'Terkirim! 👍',
  disalin: 'Teks Kartu Hasil disalin. Tempelkan di WhatsApp untuk gurumu.',
  batal: '',
  gagal: 'Gagal membagikan. Ambil screenshot layar ini saja, ya.',
};

// Kartu Hasil: bukti belajar yang dapat di-screenshot atau dibagikan ke guru.
export default function KartuHasil() {
  const { progres } = useProgres();
  const [pesan, setPesan] = useState('');
  const tanggal = useMemo(() => new Date(), []);
  const modul = MODUL.map((m) => ({ judul: m.judul, selesai: modulSelesai(progres, m.id) }));
  const siswa = progres.siswa;
  if (!siswa) return null;

  const teks = teksKartuHasil({ nama: siswa.nama, kelas: siswa.kelas, tanggal, modul, skor: progres.skor });

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Kartu Hasil</h1>

      <article aria-label="Kartu Hasil Belajar" className="flex flex-col gap-3 rounded-2xl border-2 border-aksi p-4">
        <p className="text-sm font-semibold text-aksi">📘 LingkarKu · Panjang Busur & Luas Juring</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt className="text-gray-600">Nama</dt>
          <dd className="font-bold">{siswa.nama}</dd>
          <dt className="text-gray-600">Kelas</dt>
          <dd className="font-bold">{siswa.kelas}</dd>
          <dt className="text-gray-600">Tanggal</dt>
          <dd>{formatTanggal(tanggal)}</dd>
        </dl>

        <div>
          <p className="mb-1 font-semibold">
            Langkah selesai: {modul.filter((m) => m.selesai).length} dari {modul.length}
          </p>
          <ul className="grid grid-cols-1 gap-1 text-sm">
            {modul.map((m) => (
              <li key={m.judul} className={m.selesai ? '' : 'text-gray-500'}>
                {m.selesai ? '✅' : '⬜'} {m.judul}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-1 font-semibold">Skor terbaik latihan</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {(['1', '2', '3'] as const).map((l) => (
              <div key={l} className={`rounded-lg p-2 ${lulusLevel(progres, l) ? 'bg-green-50' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-600">Level {l}</p>
                <p className="text-lg font-bold">{persen(progres.skor[l])}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <Tombol
        onClick={async () => {
          const h = await bagikanTeks('Kartu Hasil LingkarKu', teks);
          setPesan(PESAN[h]);
        }}
      >
        📤 Bagikan ke guru
      </Tombol>
      {pesan && (
        <p role="status" className="text-center">
          {pesan}
        </p>
      )}
      <p className="text-center text-sm text-gray-600">Atau ambil screenshot layar ini.</p>
    </section>
  );
}
