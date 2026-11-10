import type { GambarSoal } from '../content/contoh';
import CircleSVG from './CircleSVG';

/** Soal + gambar kecil yang tetap terlihat di atas saat halaman digulir. */
export default function KepalaSoal({
  soal,
  gambar,
  catatan,
}: {
  soal: string;
  gambar?: GambarSoal;
  catatan?: string;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-4 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-2">
      {/* Gambar kecil → huruf label diperbesar agar tetap terbaca (EL02). */}
      {gambar && <CircleSVG {...gambar} maxR={gambar.r} huruf={34} className="w-40 shrink-0" />}
      <div>
        <p className="font-semibold">{soal}</p>
        {catatan && <p className="mt-1 text-sm text-gray-600">{catatan}</p>}
      </div>
    </div>
  );
}
