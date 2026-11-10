import { useId } from 'react';

interface Props {
  label: string;
  nilai: number;
  min: number;
  max: number;
  step?: number;
  ubah: (n: number) => void;
  warna: string;
  warnaTeks: string;
  satuan?: string;
}

/** Slider ramah sentuh dengan tombol − / + untuk penyesuaian halus. */
export default function SliderNilai({
  label,
  nilai,
  min,
  max,
  step = 1,
  ubah,
  warna,
  warnaTeks,
  satuan = '',
}: Props) {
  const id = useId();
  const batasi = (n: number) => Math.min(max, Math.max(min, n));
  const kecil =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-300 text-xl font-bold disabled:text-gray-300';

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <label htmlFor={id} className="font-semibold" style={{ color: warnaTeks }}>
          {label}
        </label>
        <output htmlFor={id} className="text-lg font-bold">
          {nilai}
          {satuan}
        </output>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Kurangi ${label}`}
          className={kecil}
          disabled={nilai <= min}
          onClick={() => ubah(batasi(nilai - step))}
        >
          −
        </button>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={nilai}
          onChange={(e) => ubah(Number(e.target.value))}
          className="h-11 w-full cursor-pointer"
          style={{ accentColor: warna }}
        />
        <button
          type="button"
          aria-label={`Tambah ${label}`}
          className={kecil}
          disabled={nilai >= max}
          onClick={() => ubah(batasi(nilai + step))}
        >
          +
        </button>
      </div>
    </div>
  );
}
