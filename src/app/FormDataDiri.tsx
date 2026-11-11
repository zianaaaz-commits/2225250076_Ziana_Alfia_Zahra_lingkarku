import { useId, useState, type FormEvent } from 'react';
import Tombol from '../components/Tombol';
import { BATAS_KELAS, BATAS_NAMA, rapikanSiswa } from '../lib/progress';
import { useProgres } from './ProgresContext';

interface Props {
  teksTombol: string;
  /** Dipanggil setelah data tersimpan. */
  sesudah?: () => void;
}

/** Formulir nama & kelas siswa. Data hanya disimpan di perangkat ini. */
export default function FormDataDiri({ teksTombol, sesudah }: Props) {
  const { progres, aturSiswa } = useProgres();
  const idNama = useId();
  const idKelas = useId();
  const [nama, setNama] = useState(progres.siswa?.nama ?? '');
  const [kelas, setKelas] = useState(progres.siswa?.kelas ?? '');
  const [galat, setGalat] = useState<{ nama?: string; kelas?: string }>({});

  const kirim = (e: FormEvent) => {
    e.preventDefault();
    const h = rapikanSiswa(nama, kelas);
    if (!h.ok) return setGalat(h.galat);
    aturSiswa(h.nama, h.kelas);
    sesudah?.();
  };

  const gayaInput = (salah?: string) =>
    `h-12 w-full rounded-xl border-2 px-3 text-lg ${salah ? 'border-salah' : 'border-gray-300'}`;

  return (
    <form onSubmit={kirim} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor={idNama} className="font-semibold">
          Nama lengkap
        </label>
        <input
          id={idNama}
          value={nama}
          maxLength={BATAS_NAMA + 10}
          autoComplete="name"
          autoCapitalize="words"
          placeholder="contoh: Rani Putri"
          aria-invalid={!!galat.nama}
          onChange={(e) => {
            setNama(e.target.value);
            setGalat((g) => ({ ...g, nama: undefined }));
          }}
          className={gayaInput(galat.nama)}
        />
        {galat.nama && <p className="text-sm text-salah">{galat.nama}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={idKelas} className="font-semibold">
          Kelas
        </label>
        <input
          id={idKelas}
          value={kelas}
          maxLength={BATAS_KELAS + 5}
          autoCapitalize="characters"
          placeholder="contoh: IX-A"
          aria-invalid={!!galat.kelas}
          onChange={(e) => {
            setKelas(e.target.value);
            setGalat((g) => ({ ...g, kelas: undefined }));
          }}
          className={gayaInput(galat.kelas)}
        />
        {galat.kelas && <p className="text-sm text-salah">{galat.kelas}</p>}
      </div>

      <p className="text-sm text-gray-600">🔒 Nama dan kelasmu hanya disimpan di perangkat ini.</p>
      <Tombol type="submit">{teksTombol}</Tombol>
    </form>
  );
}
