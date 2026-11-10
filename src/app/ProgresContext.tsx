import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CERITA } from '../content/cerita';
import { CONTOH } from '../content/contoh';
import {
  bacaProgres,
  denganSelesai,
  denganSkor,
  lulusLevel,
  progresAwal,
  simpanProgres,
  type Level,
  type Pengaturan,
  type Progres,
} from '../lib/progress';

interface NilaiProgres {
  progres: Progres;
  tandai: (id: string) => void;
  catatSkor: (level: Level, nilai: number) => void;
  aturPengaturan: (ubah: Partial<Pengaturan>) => void;
  reset: () => void;
}

// Nilai bawaan (tanpa provider) agar komponen tetap bisa dipakai/diuji sendiri.
const Ctx = createContext<NilaiProgres>({
  progres: progresAwal(),
  tandai: () => {},
  catatSkor: () => {},
  aturPengaturan: () => {},
  reset: () => {},
});

export function ProgresProvider({ children }: { children: ReactNode }) {
  const [progres, setProgres] = useState<Progres>(bacaProgres);

  useEffect(() => simpanProgres(progres), [progres]);
  useEffect(() => {
    document.documentElement.style.fontSize = progres.pengaturan.hurufBesar ? '20px' : '';
  }, [progres.pengaturan.hurufBesar]);

  const tandai = useCallback((id: string) => setProgres((p) => denganSelesai(p, id)), []);
  const catatSkor = useCallback((l: Level, n: number) => setProgres((p) => denganSkor(p, l, n)), []);
  const aturPengaturan = useCallback(
    (ubah: Partial<Pengaturan>) => setProgres((p) => ({ ...p, pengaturan: { ...p.pengaturan, ...ubah } })),
    [],
  );
  const reset = useCallback(() => setProgres((p) => ({ ...progresAwal(), pengaturan: p.pengaturan })), []);

  const nilai = useMemo(
    () => ({ progres, tandai, catatSkor, aturPengaturan, reset }),
    [progres, tandai, catatSkor, aturPengaturan, reset],
  );
  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>;
}

export const useProgres = () => useContext(Ctx);

/** Apakah satu modul di beranda sudah selesai. */
export function modulSelesai(p: Progres, id: string): boolean {
  switch (id) {
    case 'contoh':
      return CONTOH.every((c) => p.selesai.includes(`contoh:${c.id}`));
    case 'latihan':
      return (['1', '2', '3'] as const).every((l) => lulusLevel(p, l));
    case 'cerita':
      return CERITA.every((c) => p.selesai.includes(`cerita:${c.id}`));
    default:
      return p.selesai.includes(id);
  }
}
