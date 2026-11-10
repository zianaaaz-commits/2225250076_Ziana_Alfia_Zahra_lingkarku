import { Link } from 'react-router-dom';
import { CONTOH } from '../../content/contoh';

export default function ContohDaftar() {
  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">Contoh Soal</h1>
      <p className="mb-5 text-gray-600">Lihat caranya, lalu coba sendiri.</p>
      <ol className="flex flex-col gap-3">
        {CONTOH.map((c, i) => (
          <li key={c.id}>
            <Link
              to={`/contoh/${c.id}`}
              className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-aksi"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold">
                {i + 1}
              </span>
              <span className="font-semibold">{c.judul}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
