import { KREDIT } from '../content/gambar';

export default function Kredit() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Kredit</h1>
      <p className="text-gray-600">Aplikasi LingkarKu disusun oleh Ziana Alfia Zahra (Pendidikan Matematika).</p>
      <ul className="flex flex-col gap-2">
        {KREDIT.map((k) => (
          <li key={k.nama} className="rounded-xl bg-gray-50 p-3">
            <p className="font-semibold">{k.nama}</p>
            <p className="text-sm text-gray-600">{k.sumber}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
