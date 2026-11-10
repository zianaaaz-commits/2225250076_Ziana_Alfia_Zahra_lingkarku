import { useState } from 'react';
import { useProgres } from '../../app/ProgresContext';
import CircleSVG from '../../components/CircleSVG';
import PilihanSegmen from '../../components/PilihanSegmen';
import SliderNilai from '../../components/SliderNilai';
import {
  keliling,
  luasJuring,
  luasLingkaran,
  panjangBusur,
  tampilAngka,
  teksPecahan,
  teksPi,
  type Pi,
} from '../../lib/geometri';
import { WARNA, WARNA_TEKS } from '../../lib/warna';

const SUDUT_PINTAS = [30, 45, 60, 90, 120, 180];

export default function Jelajah() {
  const [alpha, setAlpha] = useState(90);
  const [r, setR] = useState(14);
  const { progres } = useProgres();
  const [pi, setPi] = useState<Pi>(progres.pengaturan.piDefault);
  const pecahan = teksPecahan(alpha);

  return (
    <div className="flex flex-col gap-4">
      <CircleSVG r={r} alpha={alpha} pi={pi} className="mx-auto w-full max-w-md" />

      <SliderNilai
        label="Sudut pusat α"
        nilai={alpha}
        min={0}
        max={360}
        ubah={setAlpha}
        warna={WARNA.sudut}
        warnaTeks={WARNA_TEKS.sudut}
        satuan="°"
      />
      <div className="flex flex-wrap gap-2" aria-label="Sudut cepat">
        {SUDUT_PINTAS.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={alpha === s}
            onClick={() => setAlpha(s)}
            className={`min-h-11 min-w-14 rounded-xl border px-3 font-semibold ${
              alpha === s ? 'border-sudut bg-purple-50 text-purple-800' : 'border-gray-300'
            }`}
          >
            {s}°
          </button>
        ))}
      </div>

      <SliderNilai
        label="Jari-jari r"
        nilai={r}
        min={1}
        max={21}
        ubah={setR}
        warna={WARNA.jari}
        warnaTeks={WARNA_TEKS.jari}
        satuan=" cm"
      />

      <PilihanSegmen
        label="Nilai π"
        nilai={pi}
        ubah={setPi}
        pilihan={[
          { nilai: '22/7', teks: 'π = 22/7' },
          { nilai: '3.14', teks: 'π = 3,14' },
        ]}
      />

      <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4" aria-live="polite">
        <p>
          <span style={{ color: WARNA_TEKS.sudut }} className="font-semibold">
            α/360°
          </span>{' '}
          = {alpha}/360 = <b>{pecahan}</b>
        </p>
        <p>
          <span style={{ color: WARNA_TEKS.busur }} className="font-semibold">
            Busur
          </span>{' '}
          = {pecahan} × 2πr = {pecahan} × {tampilAngka(keliling(r, pi))} ={' '}
          <b style={{ color: WARNA_TEKS.busur }}>{tampilAngka(panjangBusur(alpha, r, pi))} cm</b>
        </p>
        <p>
          <span style={{ color: WARNA_TEKS.juring }} className="font-semibold">
            Juring
          </span>{' '}
          = {pecahan} × πr² = {pecahan} × {tampilAngka(luasLingkaran(r, pi))} ={' '}
          <b style={{ color: WARNA_TEKS.juring }}>{tampilAngka(luasJuring(alpha, r, pi))} cm²</b>
        </p>
        <p className="text-sm text-gray-600">π = {teksPi(pi)}</p>
      </div>
    </div>
  );
}
