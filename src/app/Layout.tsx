import { useCallback, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import KartuRumus from '../components/KartuRumus';

export default function Layout() {
  const { pathname } = useLocation();
  const [rumus, setRumus] = useState(false);
  const tutupRumus = useCallback(() => setRumus(false), []);
  const diBeranda = pathname === '/';
  // Tombol kembali naik satu tingkat: /contoh/C1 → /contoh, /simulasi → /
  const segmen = pathname.split('/').filter(Boolean);
  const induk = segmen.length > 1 ? `/${segmen[0]}` : '/';
  const ikon = 'flex h-11 min-w-11 items-center justify-center rounded-xl hover:bg-gray-100';

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4">
      <header className="flex h-14 items-center gap-2">
        {!diBeranda && (
          <Link to={induk} aria-label="Kembali" className={`${ikon} text-2xl`}>
            ←
          </Link>
        )}
        <Link to="/" className="flex-1 text-lg font-bold">
          LingkarKu
        </Link>
        <button type="button" onClick={() => setRumus(true)} className={`${ikon} px-3 font-semibold text-aksi`}>
          📘 Rumus
        </button>
        {pathname !== '/pengaturan' && (
          <Link to="/pengaturan" aria-label="Pengaturan" className={`${ikon} text-xl`}>
            ⚙
          </Link>
        )}
      </header>
      <main className="flex-1 pb-6">
        <Outlet />
      </main>
      {rumus && <KartuRumus tutup={tutupRumus} />}
    </div>
  );
}
