import { formatAngka, luasJuring, panjangBusur, tampilAngka, type Pi } from '../lib/geometri';
import { WARNA, WARNA_TEKS } from '../lib/warna';

export type Tampil = 'keduanya' | 'busur' | 'juring';

interface Props {
  r: number;
  alpha: number;
  pi: Pi;
  /** Jari-jari terbesar yang mungkin; menentukan skala gambar agar ukuran sebanding. */
  maxR?: number;
  tampil?: Tampil;
  /** Tampilkan label r dan sudut di dalam gambar. */
  label?: boolean;
  /** Tampilkan nilai panjang busur / luas juring di dalam gambar. */
  nilai?: boolean;
  satuan?: 'cm' | 'm';
  /** Ganti label sudut/jari-jari, mis. "?" untuk soal yang mencari nilainya. */
  teksSudut?: string;
  teksR?: string;
  /** Ukuran huruf label (satuan viewBox). Perbesar untuk gambar kecil. */
  huruf?: number;
  className?: string;
}

const C = 150;
const R_MAKS = 120;

const titik = (R: number, derajat: number) => {
  const t = (derajat * Math.PI) / 180;
  return { x: C + R * Math.cos(t), y: C - R * Math.sin(t) };
};

const jangkar = (derajat: number): 'start' | 'end' | 'middle' => {
  const c = Math.cos((derajat * Math.PI) / 180);
  return c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
};

/*
 * Lingkaran dengan busur (oranye) dan juring (biru). Sudut diukur dari arah jam 3,
 * berlawanan arah jarum jam. Label diletakkan langsung pada bagian gambarnya (EL02).
 */
export default function CircleSVG({
  r,
  alpha,
  pi,
  maxR = 21,
  tampil = 'keduanya',
  label = true,
  nilai = true,
  satuan = 'cm',
  teksSudut,
  teksR,
  huruf = 15,
  className = '',
}: Props) {
  const a = Math.min(360, Math.max(0, alpha));
  const R = Math.max(4, (Math.min(r, maxR) / maxR) * R_MAKS);
  const penuh = a >= 360;
  const besar = a > 180 ? 1 : 0;
  const awal = { x: C + R, y: C };
  const ujung = titik(R, a);
  const arc = `A ${R} ${R} 0 ${besar} 0 ${ujung.x} ${ujung.y}`;
  const tengah = a / 2;
  const cukupBesar = R >= 50;

  const busur = panjangBusur(a, r, pi);
  const juring = luasJuring(a, r, pi);
  const pBusur = titik(R + 14, tengah);
  const pSudut = titik(Math.min(16, R * 0.4) + huruf, tengah);
  const pJuring = titik(Math.max(R * 0.58, 56), tengah);
  const rSudut = Math.min(16, R * 0.4);
  const ujungSudut = titik(rSudut, a);

  const labelR = teksR ?? `${formatAngka(r)} ${satuan}`;
  const labelSudut = teksSudut ?? `${a}°`;
  const tampilBusur = tampil !== 'juring';
  const tampilJuring = tampil !== 'busur';

  const deskripsi =
    `Lingkaran jari-jari ${labelR}, sudut pusat ${labelSudut}.` +
    (tampilBusur ? ` Panjang busur ${tampilAngka(busur)} ${satuan}.` : '') +
    (tampilJuring ? ` Luas juring ${tampilAngka(juring)} ${satuan} persegi.` : '');

  return (
    <svg viewBox="-80 0 460 300" role="img" aria-label={deskripsi} className={className}>
      <circle cx={C} cy={C} r={R} fill="none" stroke={WARNA.garis} strokeWidth={2} />

      {tampilJuring &&
        a > 0 &&
        (penuh ? (
          <circle cx={C} cy={C} r={R} fill={WARNA.juring} fillOpacity={0.35} />
        ) : (
          <path
            d={`M ${C} ${C} L ${awal.x} ${awal.y} ${arc} Z`}
            fill={WARNA.juring}
            fillOpacity={0.35}
          />
        ))}

      <line x1={C} y1={C} x2={awal.x} y2={awal.y} stroke={WARNA.jari} strokeWidth={3} />
      {a > 0 && !penuh && (
        <line x1={C} y1={C} x2={ujung.x} y2={ujung.y} stroke={WARNA.jari} strokeWidth={3} />
      )}

      {tampilBusur &&
        a > 0 &&
        (penuh ? (
          <circle cx={C} cy={C} r={R} fill="none" stroke={WARNA.busur} strokeWidth={6} />
        ) : (
          <path
            d={`M ${awal.x} ${awal.y} ${arc}`}
            fill="none"
            stroke={WARNA.busur}
            strokeWidth={6}
            strokeLinecap="round"
          />
        ))}

      {a > 0 && !penuh && (
        <path
          d={`M ${C + rSudut} ${C} A ${rSudut} ${rSudut} 0 ${besar} 0 ${ujungSudut.x} ${ujungSudut.y}`}
          fill="none"
          stroke={WARNA.sudut}
          strokeWidth={2}
        />
      )}
      <circle cx={C} cy={C} r={3.5} fill={WARNA.teks} />

      {label && (
        <>
          <text
            x={C + R / 2}
            y={C + huruf + 5}
            textAnchor="middle"
            fill={WARNA_TEKS.jari}
            fontSize={huruf}
            fontWeight={700}
          >
            r = {labelR}
          </text>
          {cukupBesar && a > 0 && (
            <text
              x={pSudut.x}
              y={pSudut.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={WARNA_TEKS.sudut}
              fontSize={huruf}
              fontWeight={700}
            >
              {labelSudut}
            </text>
          )}
        </>
      )}

      {nilai && a > 0 && (
        <>
          {tampilBusur && (
            <text
              x={pBusur.x}
              y={pBusur.y}
              textAnchor={jangkar(tengah)}
              dominantBaseline="middle"
              fill={WARNA_TEKS.busur}
              fontSize={huruf}
              fontWeight={700}
            >
              {tampilAngka(busur)} {satuan}
            </text>
          )}
          {tampilJuring && cukupBesar && a >= 60 && (
            <text
              x={pJuring.x}
              y={pJuring.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={WARNA_TEKS.juring}
              fontSize={huruf}
              fontWeight={700}
            >
              {tampilAngka(juring)} {satuan}²
            </text>
          )}
        </>
      )}
    </svg>
  );
}
