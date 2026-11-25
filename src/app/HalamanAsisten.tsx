import { useCallback } from 'react';
import Maskot from '../components/Maskot';
import TombolAsisten from '../components/TombolAsisten';
import { FASE_RMT } from '../lib/asisten/pedagogi';
import type { FaseRmt, KonteksSoal } from '../lib/asisten/tipe';

// Halaman Asisten Belajar untuk pertanyaan umum (tanpa soal tertentu).
export default function HalamanAsisten() {
  const ambilKonteks = useCallback((): KonteksSoal => ({ modul: 'umum' }), []);
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Asisten Belajar</h1>
      <Maskot ukuran="h-24">
        <p>
          Aku <b>Kak Bulat</b>. Aku tidak memberi jawaban langsung — aku membantumu <b>berpikir</b> langkah demi langkah.
        </p>
      </Maskot>
      <ol className="flex flex-col gap-2">
        {([1, 2, 3] as FaseRmt[]).map((f) => (
          <li key={f} className="rounded-xl bg-purple-50 p-3">
            <p className="text-sm font-bold text-sudut">
              Fase {f} · {FASE_RMT[f].label}
            </p>
            <p className="text-sm text-gray-700">“{FASE_RMT[f].contoh[0]}”</p>
          </li>
        ))}
      </ol>
      <TombolAsisten ambilKonteks={ambilKonteks} teks="💬 Mulai ngobrol dengan Kak Bulat" />
      <p className="text-sm text-gray-600">
        Tips: saat mengerjakan soal, tekan <b>💬 Tanya Kak Bulat</b> di bawah soal agar Kak Bulat tahu soal dan jawabanmu.
      </p>
    </section>
  );
}
