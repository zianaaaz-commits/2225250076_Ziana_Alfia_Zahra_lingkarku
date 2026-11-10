import { useEffect, useState, type ReactNode } from 'react';
import KotakUmpanBalik from './KotakUmpanBalik';
import Tombol from './Tombol';

export interface ButirKuis {
  tanya: string;
  pilihan: string[];
  benar: number;
  alasan: string;
}

interface Props<T extends ButirKuis> {
  butir: T[];
  label?: string;
  /** Gambar di atas pertanyaan; `sudah` = siswa sudah menjawab. */
  gambar?: (b: T, sudah: boolean) => ReactNode;
  /** Isi tambahan di layar skor akhir. */
  akhir?: (skor: number) => ReactNode;
  /** Dipanggil saat semua soal selesai dijawab. */
  onSelesai?: (skor: number) => void;
}

/** Kuis pilihan ganda dengan umpan balik langsung per soal. */
export default function Kuis<T extends ButirKuis>({ butir, label = 'Soal', gambar, akhir, onSelesai }: Props<T>) {
  const [no, setNo] = useState(0);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const [skor, setSkor] = useState(0);
  const habis = no >= butir.length;

  useEffect(() => {
    if (habis) onSelesai?.(skor);
  }, [habis, skor, onSelesai]);

  if (habis) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <p className="text-xl font-bold">
          Benar {skor} dari {butir.length}
        </p>
        {akhir?.(skor)}
        <Tombol
          varian="kedua"
          onClick={() => {
            setNo(0);
            setSkor(0);
            setDipilih(null);
          }}
        >
          Ulangi
        </Tombol>
      </div>
    );
  }

  const b = butir[no];
  const sudah = dipilih !== null;

  const pilih = (i: number) => {
    if (sudah) return;
    setDipilih(i);
    if (i === b.benar) setSkor((s) => s + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600">
        {label} {no + 1} dari {butir.length}
      </p>
      {gambar?.(b, sudah)}
      <p className="text-lg font-semibold">{b.tanya}</p>

      <div className="flex flex-col gap-2">
        {b.pilihan.map((p, i) => {
          let gaya = 'border-gray-300';
          if (sudah && i === b.benar) gaya = 'border-benar bg-green-50';
          else if (sudah && i === dipilih) gaya = 'border-salah bg-red-50';
          return (
            <button
              key={p}
              type="button"
              disabled={sudah}
              onClick={() => pilih(i)}
              className={`min-h-12 rounded-xl border-2 px-4 text-left font-semibold ${gaya}`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {sudah && (
        <>
          <KotakUmpanBalik benar={dipilih === b.benar}>
            <p>{b.alasan}</p>
          </KotakUmpanBalik>
          <Tombol
            onClick={() => {
              setNo((n) => n + 1);
              setDipilih(null);
            }}
          >
            Berikutnya
          </Tombol>
        </>
      )}
    </div>
  );
}
