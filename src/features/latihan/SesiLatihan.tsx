import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useProgres } from '../../app/ProgresContext';
import Tombol from '../../components/Tombol';
import { BANK_SOAL } from '../../content/bankSoal';
import { paketSoalAcak } from '../../lib/generator';
import { BATAS_LULUS } from '../../lib/progress';
import type { Soal } from '../../lib/soal';
import KartuSoal from './KartuSoal';

type Level = 1 | 2 | 3;

function Hasil({ level, skor, total, ulangAcak }: { level: Level; skor: number; total: number; ulangAcak: () => void }) {
  const lulus = skor / total >= BATAS_LULUS;
  const { catatSkor } = useProgres();
  useEffect(() => catatSkor(`${level}`, skor / total), [catatSkor, level, skor, total]);
  const tautan = 'flex min-h-12 w-full items-center justify-center rounded-xl font-semibold';
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <p className="text-2xl font-bold">
        Benar {skor} dari {total}
      </p>
      <p className="text-gray-600">
        {lulus ? 'Hebat! Kamu sudah menguasai level ini.' : 'Tidak apa-apa. Lihat contohnya lagi, lalu coba soal baru.'}
      </p>
      {lulus && level < 3 && (
        <Link to={`/latihan/${level + 1}`} className={`${tautan} bg-aksi text-white`}>
          Lanjut ke Level {level + 1} ▶
        </Link>
      )}
      {!lulus && (
        <Link to="/contoh" className={`${tautan} bg-aksi text-white`}>
          Lihat contoh soal
        </Link>
      )}
      <Tombol varian="kedua" className="w-full" onClick={ulangAcak}>
        Latihan dengan soal acak
      </Tombol>
      <Link to="/latihan" className="font-semibold text-aksi underline">
        Pilih level lain
      </Link>
    </div>
  );
}

function Sesi({ level, acak, ulangAcak }: { level: Level; acak: boolean; ulangAcak: () => void }) {
  const [daftar] = useState<Soal[]>(() =>
    acak ? paketSoalAcak(level, 5) : BANK_SOAL.filter((s) => s.level === level),
  );
  const [no, setNo] = useState(0);
  const [skor, setSkor] = useState(0);

  if (no >= daftar.length) return <Hasil level={level} skor={skor} total={daftar.length} ulangAcak={ulangAcak} />;

  return (
    <>
      <div className="mb-3 flex items-baseline justify-between">
        <h1 className="text-xl font-bold">
          Latihan Level {level}
          {acak && ' · Acak'}
        </h1>
        <span className="text-sm text-gray-600">
          Soal {no + 1} dari {daftar.length}
        </span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100" aria-hidden>
        <div className="h-full bg-aksi" style={{ width: `${(no / daftar.length) * 100}%` }} />
      </div>
      <KartuSoal
        key={`${daftar[no].id}-${no}`}
        soal={daftar[no]}
        selesai={(benar) => {
          if (benar) setSkor((s) => s + 1);
          setNo((n) => n + 1);
          window.scrollTo?.({ top: 0 });
        }}
      />
    </>
  );
}

export default function SesiLatihan() {
  const { level: teksLevel } = useParams();
  const [cari] = useSearchParams();
  const navigate = useNavigate();
  const [putaran, setPutaran] = useState(0);
  const level = Number(teksLevel);
  const acak = cari.get('acak') === '1';

  if (level !== 1 && level !== 2 && level !== 3) {
    return (
      <p className="py-10 text-center">
        Level tidak ditemukan. <Link to="/latihan" className="text-aksi underline">Pilih level</Link>
      </p>
    );
  }

  return (
    <section>
      <Sesi
        key={`${level}-${acak}-${putaran}`}
        level={level}
        acak={acak}
        ulangAcak={() => {
          navigate(`/latihan/${level}?acak=1`);
          setPutaran((p) => p + 1);
        }}
      />
    </section>
  );
}
