interface Props<T extends string> {
  label: string;
  pilihan: { nilai: T; teks: string }[];
  nilai: T;
  ubah: (nilai: T) => void;
}

export default function PilihanSegmen<T extends string>({ label, pilihan, nilai, ubah }: Props<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-xl bg-gray-100 p-1">
      {pilihan.map((p) => {
        const aktif = p.nilai === nilai;
        return (
          <button
            key={p.nilai}
            type="button"
            role="radio"
            aria-checked={aktif}
            onClick={() => ubah(p.nilai)}
            className={`min-h-11 flex-1 rounded-lg px-2 text-sm font-semibold ${
              aktif ? 'bg-white text-aksi shadow' : 'text-gray-600'
            }`}
          >
            {p.teks}
          </button>
        );
      })}
    </div>
  );
}
