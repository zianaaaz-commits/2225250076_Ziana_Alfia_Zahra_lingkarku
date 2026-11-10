import { useId, useState } from 'react';
import KotakUmpanBalik from '../../components/KotakUmpanBalik';
import MathText from '../../components/MathText';
import Tombol from '../../components/Tombol';
import type { LangkahMisi as Data } from '../../content/literasi';
import { cekJawaban } from '../../lib/feedback';
import { kiraSama, parseJawaban } from '../../lib/geometri';

type Props<T> = { l: T; lanjut: () => void };
type Ambil<J extends Data['jenis']> = Extract<Data, { jenis: J }>;

const TombolLanjut = ({ lanjut }: { lanjut: () => void }) => <Tombol onClick={lanjut}>Lanjut ▶</Tombol>;

function Pilihan({ l, lanjut }: Props<Ambil<'pilihan'>>) {
  const [dipilih, setDipilih] = useState<number | null>(null);
  const benar = dipilih === l.benar;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-semibold">{l.tanya}</p>
      {l.pilihan.map((p, i) => {
        let gaya = 'border-gray-300';
        if (dipilih !== null && i === dipilih) gaya = benar ? 'border-benar bg-green-50' : 'border-salah bg-red-50';
        return (
          <button
            key={p}
            type="button"
            disabled={benar}
            onClick={() => setDipilih(i)}
            className={`min-h-12 rounded-xl border-2 px-4 text-left font-semibold ${gaya}`}
          >
            {p}
          </button>
        );
      })}
      {dipilih !== null && (
        <KotakUmpanBalik benar={benar}>
          <p>{benar ? l.alasan : 'Coba pilih jawaban lain. Baca lagi ceritanya.'}</p>
        </KotakUmpanBalik>
      )}
      {benar && <TombolLanjut lanjut={lanjut} />}
    </div>
  );
}

function Isian({ l, lanjut }: Props<Ambil<'isian'>>) {
  const id = useId();
  const [teks, setTeks] = useState('');
  const [pesan, setPesan] = useState<{ benar: boolean; isi: string } | null>(null);
  const [salah, setSalah] = useState(0);
  const [bahas, setBahas] = useState(false);
  const benar = pesan?.benar === true;

  const periksa = () => {
    const n = parseJawaban(l.ribuan ? teks.replace(/\./g, '') : teks);
    if (Number.isNaN(n)) return setPesan({ benar: false, isi: 'Tulis angka saja, misalnya 12,5' });
    if (kiraSama(n, l.kunci)) return setPesan({ benar: true, isi: 'Jawabanmu benar.' });
    setSalah((s) => s + 1);
    const diagnosis = l.soal ? cekJawaban(l.soal, n) : null;
    setPesan({ benar: false, isi: diagnosis?.kode ? diagnosis.pesan : `**Petunjuk:** ${l.petunjuk}` });
  };

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-lg font-semibold">
        <MathText teks={l.tanya} />
      </label>
      {!benar && !bahas && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            value={teks}
            onChange={(e) => {
              setTeks(e.target.value);
              setPesan(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && teks.trim() && periksa()}
            className="h-12 w-40 rounded-xl border-2 border-gray-300 px-3 text-lg font-bold"
          />
          <span className="text-lg">{l.satuan}</span>
          <Tombol onClick={periksa} disabled={!teks.trim()}>
            Periksa
          </Tombol>
        </div>
      )}
      {pesan && !bahas && (
        <KotakUmpanBalik benar={pesan.benar}>
          <MathText teks={pesan.isi} />
        </KotakUmpanBalik>
      )}
      {!benar && salah >= 2 && !bahas && (
        <Tombol varian="kedua" onClick={() => setBahas(true)}>
          Lihat pembahasan
        </Tombol>
      )}
      {bahas && (
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="mb-1 font-semibold">Pembahasan</p>
          {l.pembahasan.map((p, i) => (
            <p key={i}>
              <MathText teks={p} />
            </p>
          ))}
        </div>
      )}
      {(benar || bahas) && <TombolLanjut lanjut={lanjut} />}
    </div>
  );
}

function Pernyataan({ l, lanjut }: Props<Ambil<'pernyataan'>>) {
  const [jawab, setJawab] = useState<(boolean | null)[]>(() => l.pernyataan.map(() => null));
  const [dicek, setDicek] = useState(false);
  const [percobaan, setPercobaan] = useState(0);
  const lengkap = jawab.every((j) => j !== null);
  const semuaBenar = jawab.every((j, i) => j === l.pernyataan[i].benar);
  // Setelah 2× memeriksa, semua alasan ditampilkan dan siswa boleh lanjut.
  const bukaSemua = dicek && percobaan >= 2;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-semibold">{l.tanya}</p>
      {l.pernyataan.map((p, i) => {
        const tepat = jawab[i] === p.benar;
        return (
          <div key={p.teks} className={`rounded-xl border-2 p-3 ${dicek ? (tepat ? 'border-benar' : 'border-salah') : 'border-gray-200'}`}>
            <p className="mb-2">{p.teks}</p>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={p.teks}>
              {[true, false].map((nilai) => (
                <button
                  key={String(nilai)}
                  type="button"
                  role="radio"
                  aria-checked={jawab[i] === nilai}
                  onClick={() => {
                    setDicek(false);
                    setJawab((j) => j.map((x, k) => (k === i ? nilai : x)));
                  }}
                  className={`min-h-11 rounded-lg border font-semibold ${
                    jawab[i] === nilai ? 'border-aksi bg-blue-50 text-aksi' : 'border-gray-300'
                  }`}
                >
                  {nilai ? 'Benar' : 'Salah'}
                </button>
              ))}
            </div>
            {dicek && (
              <p className="mt-2 text-sm">
                <b>{tepat ? '✓ Tepat.' : '✗ Belum tepat.'}</b>{' '}
                {tepat || bukaSemua ? `${bukaSemua && !tepat ? `Jawaban: ${p.benar ? 'Benar' : 'Salah'}. ` : ''}${p.alasan}` : 'Coba hitung atau baca lagi.'}
              </p>
            )}
          </div>
        );
      })}
      {dicek && (semuaBenar || bukaSemua) ? (
        <TombolLanjut lanjut={lanjut} />
      ) : (
        <Tombol
          disabled={!lengkap}
          onClick={() => {
            setDicek(true);
            setPercobaan((n) => n + 1);
          }}
        >
          Periksa
        </Tombol>
      )}
    </div>
  );
}

function Uraian({ l, lanjut }: Props<Ambil<'uraian'>>) {
  const id = useId();
  const [teks, setTeks] = useState('');
  const [lihat, setLihat] = useState(false);
  const [cek, setCek] = useState<boolean[]>(() => l.ceklis.map(() => false));
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-lg font-semibold">
        {l.tanya}
      </label>
      <textarea
        id={id}
        rows={4}
        value={teks}
        readOnly={lihat}
        onChange={(e) => setTeks(e.target.value)}
        placeholder="Tulis penjelasanmu dengan kalimatmu sendiri…"
        className="rounded-xl border-2 border-gray-300 p-3 text-base"
      />
      {!lihat ? (
        <Tombol disabled={teks.trim().length < 10} onClick={() => setLihat(true)}>
          Bandingkan dengan contoh jawaban
        </Tombol>
      ) : (
        <>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="mb-1 font-semibold">Contoh jawaban</p>
            <p>{l.contohJawaban}</p>
          </div>
          <fieldset className="rounded-xl border border-gray-200 p-3">
            <legend className="px-1 font-semibold">Cek jawabanmu sendiri</legend>
            {l.ceklis.map((c, i) => (
              <label key={c} className="flex min-h-11 items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={cek[i]}
                  onChange={() => setCek((x) => x.map((v, k) => (k === i ? !v : v)))}
                />
                {c}
              </label>
            ))}
          </fieldset>
          <TombolLanjut lanjut={lanjut} />
        </>
      )}
    </div>
  );
}

export default function LangkahMisi({ l, lanjut }: Props<Data>) {
  switch (l.jenis) {
    case 'pilihan':
      return <Pilihan l={l} lanjut={lanjut} />;
    case 'isian':
      return <Isian l={l} lanjut={lanjut} />;
    case 'pernyataan':
      return <Pernyataan l={l} lanjut={lanjut} />;
    case 'uraian':
      return <Uraian l={l} lanjut={lanjut} />;
  }
}
