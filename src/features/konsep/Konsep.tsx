import { useState, type ReactNode } from 'react';
import CircleSVG from '../../components/CircleSVG';
import Rumus from '../../components/Rumus';
import NavLangkah from '../../components/NavLangkah';
import { WARNA_TEKS } from '../../lib/warna';
import GameBusurJuring from './GameBusurJuring';

// F2 — Busur vs Juring (K03, IL01, IL05). Satu layar, satu ide (EL01).

const Busur = ({ children }: { children: ReactNode }) => (
  <b style={{ color: WARNA_TEKS.busur }}>{children}</b>
);
const Juring = ({ children }: { children: ReactNode }) => (
  <b style={{ color: WARNA_TEKS.juring }}>{children}</b>
);

const LAYAR: { judul: string; isi: ReactNode }[] = [
  {
    judul: 'Busur dan Juring',
    isi: (
      <>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <CircleSVG r={14} alpha={100} pi="22/7" tampil="busur" label={false} nilai={false} className="w-full" />
            <Busur>BUSUR</Busur>
            <p>garis lengkung</p>
            <p className="text-sm text-gray-600">diukur panjangnya (cm)</p>
          </div>
          <div>
            <CircleSVG r={14} alpha={100} pi="22/7" tampil="juring" label={false} nilai={false} className="w-full" />
            <Juring>JURING</Juring>
            <p>daerah</p>
            <p className="text-sm text-gray-600">diukur luasnya (cm²)</p>
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-gray-50 p-3 text-center">
          <Juring>Juring</Juring> = sepotong pizza. <Busur>Busur</Busur> = pinggiran rotinya.
        </p>
      </>
    ),
  },
  {
    judul: 'Rumus panjang busur',
    isi: (
      <>
        <CircleSVG r={14} alpha={90} pi="22/7" tampil="busur" className="mx-auto w-full max-w-xs" />
        <p>
          Satu putaran penuh (360°) = <Busur>keliling = 2πr</Busur>.
        </p>
        <p>
          Busur hanya bagian <b style={{ color: WARNA_TEKS.sudut }}>α/360°</b> dari keliling.
        </p>
        <div className="mt-3 rounded-xl bg-orange-50 p-3 text-center">
          <Rumus jenis="busur" />
        </div>
      </>
    ),
  },
  {
    judul: 'Rumus luas juring',
    isi: (
      <>
        <CircleSVG r={14} alpha={90} pi="22/7" tampil="juring" className="mx-auto w-full max-w-xs" />
        <p>
          Satu putaran penuh (360°) = <Juring>luas = πr²</Juring>.
        </p>
        <p>
          Juring hanya bagian <b style={{ color: WARNA_TEKS.sudut }}>α/360°</b> dari luas.
        </p>
        <div className="mt-3 rounded-xl bg-sky-50 p-3 text-center">
          <Rumus jenis="juring" />
        </div>
      </>
    ),
  },
  {
    judul: 'Cara memilih rumus',
    isi: (
      <>
        <p className="mb-3 text-center text-lg font-semibold">
          Tanya dirimu: yang ditanya <u>panjang</u> atau <u>luas</u>?
        </p>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-orange-50 p-3">
            <p className="font-bold">Panjang (cm)</p>
            <p>↓</p>
            <Busur>Busur → 2πr</Busur>
          </div>
          <div className="rounded-xl bg-sky-50 p-3">
            <p className="font-bold">Luas (cm²)</p>
            <p>↓</p>
            <Juring>Juring → πr²</Juring>
          </div>
        </div>
        <p className="mt-3 text-center">
          Keduanya dikali <b style={{ color: WARNA_TEKS.sudut }}>α/360°</b>.
        </p>
      </>
    ),
  },
];

export default function Konsep() {
  const [i, setI] = useState(0);
  const [main, setMain] = useState(false);

  if (main) {
    return (
      <section>
        <h1 className="mb-4 text-2xl font-bold">Busur atau Juring?</h1>
        <GameBusurJuring keluar={() => setMain(false)} />
      </section>
    );
  }

  const layar = LAYAR[i];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">{layar.judul}</h1>
        <span className="text-sm text-gray-600">
          {i + 1}/{LAYAR.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">{layar.isi}</div>
      <NavLangkah
        i={i}
        total={LAYAR.length}
        ubah={setI}
        teksTerakhir="Main!"
        terakhir={() => setMain(true)}
      />
    </section>
  );
}
