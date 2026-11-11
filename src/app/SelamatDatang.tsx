import FormDataDiri from './FormDataDiri';

/** Layar pertama: siswa wajib mengisi nama & kelas sebelum memakai aplikasi. */
export default function SelamatDatang() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-4 py-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="h-20 w-20" />
        <h1 className="text-2xl font-bold">Selamat datang di LingkarKu</h1>
        <p className="text-gray-600">Belajar panjang busur & luas juring. Isi dulu data dirimu, ya.</p>
      </div>
      <FormDataDiri teksTombol="Mulai belajar ▶" />
    </main>
  );
}
