import { useId, useMemo, useState } from 'react';
import KepalaSoal from '../../components/KepalaSoal';
import KotakUmpanBalik from '../../components/KotakUmpanBalik';
import MathText from '../../components/MathText';
import StepReveal from '../../components/StepReveal';
import Tombol from '../../components/Tombol';
import { CONTOH } from '../../content/contoh';
import { cekJawaban, type HasilCek } from '../../lib/feedback';
import { parseJawaban } from '../../lib/geometri';
import { buatBantuan } from '../../lib/pembahasan';
import type { Soal } from '../../lib/soal';
import { gambarSoal } from './gambarSoal';

interface Props {
  soal: Soal;
  /** Dipanggil saat siswa lanjut; `benar` = dijawab benar tanpa membuka pembahasan. */
  selesai: (benar: boolean) => void;
}

const PI_CATATAN = { '22/7': 'Gunakan π = 22/7', '3.14': 'Gunakan π = 3,14' } as const;

// Satu soal latihan: jawab → umpan balik spesifik → petunjuk bertingkat → pembahasan (DS02, IL05, GL02).
export default function KartuSoal({ soal, selesai }: Props) {
  const id = useId();
  const bantuan = useMemo(() => buatBantuan(soal), [soal]);
  const contoh = CONTOH.find((c) => c.id === soal.contohTerkait);

  const [teks, setTeks] = useState('');
  const [hasil, setHasil] = useState<HasilCek | null>(null);
  const [tidakValid, setTidakValid] = useState(false);
  const [salah, setSalah] = useState(0);
  const [petunjuk, setPetunjuk] = useState(0);
  const [lihatContoh, setLihatContoh] = useState(false);
  const [lihatPembahasan, setLihatPembahasan] = useState(false);

  const benar = hasil?.benar === true;
  const bisaJawab = !benar && !lihatPembahasan;

  const periksa = () => {
    const n = parseJawaban(teks);
    if (Number.isNaN(n)) {
      setTidakValid(true);
      return;
    }
    const h = cekJawaban(soal, n);
    setHasil(h);
    if (!h.benar) setSalah((s) => s + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <KepalaSoal
        soal={soal.teks}
        gambar={gambarSoal(soal)}
        catatan={soal.ditanya === 'perbandingan' ? undefined : PI_CATATAN[soal.data.pi]}
      />

      {bisaJawab && (
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={id} className="sr-only">
            Jawaban
          </label>
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            placeholder="Jawaban"
            value={teks}
            onChange={(e) => {
              setTeks(e.target.value);
              setTidakValid(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && teks.trim() && periksa()}
            className="h-12 w-36 rounded-xl border-2 border-gray-300 px-3 text-lg font-bold"
          />
          <span className="text-lg">{soal.satuan}</span>
          <Tombol onClick={periksa} disabled={teks.trim() === ''}>
            Periksa
          </Tombol>
        </div>
      )}

      {tidakValid && <p className="rounded-xl border-l-4 border-salah bg-gray-50 p-3">Tulis angka saja, misalnya 12,5</p>}

      {hasil && !lihatPembahasan && (
        <KotakUmpanBalik benar={hasil.benar}>
          <MathText teks={hasil.pesan} />
        </KotakUmpanBalik>
      )}

      {benar && <Tombol onClick={() => selesai(true)}>Soal berikutnya ▶</Tombol>}

      {!benar && !lihatPembahasan && (
        <div className="flex flex-wrap gap-2">
          {petunjuk < 2 && (
            <Tombol varian="kedua" onClick={() => setPetunjuk(petunjuk + 1)}>
              💡 Petunjuk {petunjuk + 1}
            </Tombol>
          )}
          {contoh && (
            <Tombol varian="kedua" onClick={() => setLihatContoh(!lihatContoh)}>
              {lihatContoh ? 'Tutup contoh' : 'Contoh serupa'}
            </Tombol>
          )}
          {(salah >= 2 || petunjuk >= 2) && (
            <Tombol varian="kedua" onClick={() => setLihatPembahasan(true)}>
              Lihat pembahasan
            </Tombol>
          )}
        </div>
      )}

      {!lihatPembahasan && petunjuk >= 1 && (
        <div className="rounded-xl bg-yellow-50 p-3">
          <p className="text-sm font-semibold text-gray-600">Petunjuk 1</p>
          <MathText teks={bantuan.petunjuk1} />
        </div>
      )}
      {!lihatPembahasan && petunjuk >= 2 && (
        <div className="rounded-xl bg-yellow-50 p-3">
          <p className="text-sm font-semibold text-gray-600">Petunjuk 2</p>
          <MathText teks={bantuan.petunjuk2} className="text-lg" />
        </div>
      )}

      {lihatContoh && contoh && !lihatPembahasan && (
        <div className="rounded-xl border border-gray-200 p-3">
          <p className="mb-2 font-semibold">Contoh: {contoh.soal}</p>
          <StepReveal
            langkah={contoh.langkah}
            selesai={
              <Tombol varian="kedua" onClick={() => setLihatContoh(false)}>
                Tutup contoh
              </Tombol>
            }
          />
        </div>
      )}

      {lihatPembahasan && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Pembahasan</h2>
          <StepReveal
            langkah={bantuan.langkah}
            selesai={<Tombol onClick={() => selesai(false)}>Soal berikutnya ▶</Tombol>}
          />
        </div>
      )}
    </div>
  );
}
