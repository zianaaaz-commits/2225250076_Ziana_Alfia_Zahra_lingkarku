import { useCallback, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import KartuRumus from '../components/KartuRumus';
import { bolehPutar } from '../lib/musik';
import { useProgres } from './ProgresContext';
import { useMusikLatar } from './useMusikLatar';

export default function Layout() {
  const { pathname } = useLocation();
  const { progres, aturPengaturan } = useProgres();
  const [rumus, setRumus] = useState(false);
  const tutupRumus = useCallback(() => setRumus(false), []);
  const musik = progres.pengaturan.musik;

  // Lagu hanya di layar menu, berhenti saat belajar atau saat Kartu Rumus dibuka.
  useMusikLatar(musik && bolehPutar(pathname) && !rumus);

  const diBeranda = pathname === '/';
  // Tombol kembali naik satu tingkat: /contoh/C1 → /contoh, /simulasi → /
  const segmen = pathname.split('/').filter(Boolean);
  const induk = segmen.length > 1 ? `/${segmen[0]}` : '/';
  const ikon = 'flex h-11 min-w-11 items-center justify-center rounded-xl hover:bg-gray-100';

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4">
      <header className="flex h-14 items-center gap-1">
        {!diBeranda && (
          <Link to={induk} aria-label="Kembali" className={`${ikon} text-2xl`}>
            ←
          </Link>
        )}
        <Link to="/" className="flex-1 truncate text-lg font-bold">
          LingkarKu
        </Link>
        <button type="button" onClick={() => setRumus(true)} className={`${ikon} px-2 font-semibold text-aksi`}>
          <span aria-hidden>📘</span>
          {/* Di HP cukup ikon agar judul tidak terpotong; teks tetap dibaca pembaca layar. */}
          <span className="sr-only sm:not-sr-only sm:ml-1">Rumus</span>
        </button>
        <button
          type="button"
          onClick={() => aturPengaturan({ musik: !musik })}
          aria-label={musik ? 'Matikan musik' : 'Nyalakan musik'}
          aria-pressed={musik}
          className={`${ikon} text-xl`}
        >
          {musik ? '🔊' : '🔇'}
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
