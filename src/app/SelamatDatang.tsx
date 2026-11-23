import Maskot from '../components/Maskot';
import { MASKOT } from '../content/gambar';
import FormDataDiri from './FormDataDiri';

/** Layar pertama: Si Bulat mengajak bertualang; siswa wajib mengisi nama & kelas. */
export default function SelamatDatang() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-sky-100 via-white to-emerald-50">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-5 px-4 py-8">
        <p className="text-center text-sm font-semibold tracking-wide text-aksi">🗺️ LINGKARKU</p>
        <h1 className="text-center text-2xl font-bold">Petualangan Negeri Lingkaran</h1>
        <Maskot ukuran="h-32">
          <p>
            Halo! Aku <b>{MASKOT.nama}</b>. Ayo bertualang menaklukkan 7 pos dan menemukan harta karun busur &amp;
            juring!
          </p>
          <p className="mt-1 font-semibold">Siapa namamu, petualang?</p>
        </Maskot>
        <h2 className="sr-only">Selamat datang di LingkarKu</h2>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <FormDataDiri teksTombol="Mulai petualangan ▶" />
        </div>
      </div>
    </main>
  );
}
