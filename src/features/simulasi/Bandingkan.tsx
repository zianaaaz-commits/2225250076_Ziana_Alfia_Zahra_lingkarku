import { useState } from 'react';
import CircleSVG from '../../components/CircleSVG';
import SliderNilai from '../../components/SliderNilai';
import { formatAngka, luasJuring, panjangBusur, tampilAngka } from '../../lib/geometri';
import { WARNA, WARNA_TEKS } from '../../lib/warna';

const PI = '22/7' as const;

function Kolom({ nama, r, alpha }: { nama: string; r: number; alpha: number }) {
  return (
    <div className="text-center">
      <p className="font-bold">{nama}</p>
      <CircleSVG r={r} alpha={alpha} pi={PI} label={false} nilai={false} className="w-full" />
      <p style={{ color: WARNA_TEKS.sudut }}>α = {alpha}°</p>
      <p style={{ color: WARNA_TEKS.busur }}>{tampilAngka(panjangBusur(alpha, r, PI))} cm</p>
      <p style={{ color: WARNA_TEKS.juring }}>{tampilAngka(luasJuring(alpha, r, PI))} cm²</p>
    </div>
  );
}

// Menunjukkan bahwa busur & juring sebanding dengan sudut pusat (IL02).
export default function Bandingkan() {
  const [r, setR] = useState(14);
  const [a1, setA1] = useState(60);
  const [a2, setA2] = useState(120);
  const kali = formatAngka(a2 / a1);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <Kolom nama="Juring A" r={r} alpha={a1} />
        <Kolom nama="Juring B" r={r} alpha={a2} />
      </div>

      <div className="rounded-xl bg-gray-50 p-4 text-center" aria-live="polite">
        <p>
          Sudut B = <b>{kali} ×</b> sudut A
        </p>
        <p className="mt-1 font-semibold">
          Maka <span style={{ color: WARNA_TEKS.busur }}>busur B = {kali} × busur A</span> dan{' '}
          <span style={{ color: WARNA_TEKS.juring }}>juring B = {kali} × juring A</span>
        </p>
      </div>

      <SliderNilai label="Sudut A" nilai={a1} min={10} max={360} ubah={setA1} warna={WARNA.sudut} warnaTeks={WARNA_TEKS.sudut} satuan="°" />
      <SliderNilai label="Sudut B" nilai={a2} min={10} max={360} ubah={setA2} warna={WARNA.sudut} warnaTeks={WARNA_TEKS.sudut} satuan="°" />
      <SliderNilai label="Jari-jari (sama)" nilai={r} min={1} max={21} ubah={setR} warna={WARNA.jari} warnaTeks={WARNA_TEKS.jari} satuan=" cm" />
      <p className="text-sm text-gray-600">π = 22/7</p>
    </div>
  );
}
