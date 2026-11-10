import { useId, useState } from 'react';
import { kiraSama, parseJawaban } from '../lib/geometri';
import MathText from './MathText';
import Tombol from './Tombol';

interface Props {
  label: string;
  /** Teks/rumus sebelum kotak isian, mis. "$\frac{1}{6} \times 132 =$" */
  sebelum: string;
  kunci: number;
  satuan?: string;
  petunjuk: string;
  onBenar?: () => void;
}

type Status = 'awal' | 'benar' | 'salah' | 'tidakValid';

/** Kotak isian angka; menerima koma atau titik desimal. */
export default function IsianAngka({ label, sebelum, kunci, satuan, petunjuk, onBenar }: Props) {
  const id = useId();
  const [teks, setTeks] = useState('');
  const [status, setStatus] = useState<Status>('awal');

  const periksa = () => {
    const n = parseJawaban(teks);
    if (Number.isNaN(n)) return setStatus('tidakValid');
    if (kiraSama(n, kunci)) {
      setStatus('benar');
      onBenar?.();
    } else setStatus('salah');
  };

  const benar = status === 'benar';

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-gray-600">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-2 text-lg">
        <MathText teks={sebelum} />
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={teks}
          readOnly={benar}
          onChange={(e) => {
            setTeks(e.target.value);
            if (status !== 'awal') setStatus('awal');
          }}
          onKeyDown={(e) => e.key === 'Enter' && !benar && periksa()}
          className={`h-12 w-28 rounded-xl border-2 px-3 text-lg font-bold ${
            benar ? 'border-benar bg-green-50' : status === 'salah' ? 'border-salah' : 'border-gray-300'
          }`}
        />
        {satuan && <span>{satuan}</span>}
        {benar ? (
          <span className="font-bold text-benar" aria-label="benar">
            ✓
          </span>
        ) : (
          <Tombol onClick={periksa} disabled={teks.trim() === ''} className="min-h-12">
            Periksa
          </Tombol>
        )}
      </div>
      {status === 'salah' && (
        <p role="status" className="rounded-xl border-l-4 border-salah bg-gray-50 p-3">
          Belum tepat. <b>Petunjuk:</b> {petunjuk}
        </p>
      )}
      {status === 'tidakValid' && (
        <p role="status" className="rounded-xl border-l-4 border-salah bg-gray-50 p-3">
          Tulis angka saja, misalnya 12,5
        </p>
      )}
    </div>
  );
}
