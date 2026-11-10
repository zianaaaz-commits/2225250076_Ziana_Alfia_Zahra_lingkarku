import Tombol from './Tombol';

interface Props {
  i: number;
  total: number;
  ubah: (i: number) => void;
  /** Teks & aksi tombol pada layar terakhir. */
  teksTerakhir: string;
  terakhir: () => void;
}

/** Tombol ◀ Kembali / Berikutnya ▶ untuk materi yang dipecah per layar (EL01). */
export default function NavLangkah({ i, total, ubah, teksTerakhir, terakhir }: Props) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-3">
      <Tombol varian="kedua" disabled={i === 0} onClick={() => ubah(i - 1)}>
        ◀ Kembali
      </Tombol>
      {i === total - 1 ? (
        <Tombol onClick={terakhir}>{teksTerakhir}</Tombol>
      ) : (
        <Tombol onClick={() => ubah(i + 1)}>Berikutnya ▶</Tombol>
      )}
    </div>
  );
}
