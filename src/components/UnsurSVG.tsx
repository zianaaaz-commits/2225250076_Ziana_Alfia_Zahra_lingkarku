import { WARNA, WARNA_TEKS } from '../lib/warna';

export type Unsur = 'pusat' | 'jari' | 'diameter' | 'sudut' | 'kelilingLuas';

const C = 150;
const R = 110;

const DESKRIPSI: Record<Unsur, string> = {
  pusat: 'Lingkaran dengan titik pusat O di tengah',
  jari: 'Jari-jari r: garis dari titik pusat ke lingkaran',
  diameter: 'Diameter d: garis melewati titik pusat dari tepi ke tepi, d sama dengan 2r',
  sudut: 'Sudut pusat alfa diapit dua jari-jari',
  kelilingLuas: 'Keliling adalah garis tepi lingkaran, luas adalah daerah di dalamnya',
};

/** Gambar unsur lingkaran untuk modul prasyarat (F1). */
export default function UnsurSVG({ sorot, className = '' }: { sorot: Unsur; className?: string }) {
  const teks = { fontSize: 18, fontWeight: 700 } as const;
  const a = (60 * Math.PI) / 180;
  const ujung = { x: C + R * Math.cos(a), y: C - R * Math.sin(a) };

  return (
    <svg viewBox="0 0 300 300" role="img" aria-label={DESKRIPSI[sorot]} className={className}>
      {sorot === 'kelilingLuas' ? (
        <circle cx={C} cy={C} r={R} fill={WARNA.juring} fillOpacity={0.35} stroke={WARNA.busur} strokeWidth={6} />
      ) : (
        <circle cx={C} cy={C} r={R} fill="none" stroke={WARNA.garis} strokeWidth={2} />
      )}

      {sorot === 'jari' && (
        <>
          <line x1={C} y1={C} x2={C + R} y2={C} stroke={WARNA.jari} strokeWidth={4} />
          <text x={C + R / 2} y={C - 10} textAnchor="middle" fill={WARNA_TEKS.jari} {...teks}>r</text>
        </>
      )}

      {sorot === 'diameter' && (
        <>
          <line x1={C - R} y1={C} x2={C + R} y2={C} stroke={WARNA.jari} strokeWidth={4} />
          <text x={C} y={C - 12} textAnchor="middle" fill={WARNA_TEKS.jari} {...teks}>d = 2r</text>
          <text x={C - R / 2} y={C + 24} textAnchor="middle" fill={WARNA_TEKS.jari} fontSize={15}>r</text>
          <text x={C + R / 2} y={C + 24} textAnchor="middle" fill={WARNA_TEKS.jari} fontSize={15}>r</text>
        </>
      )}

      {sorot === 'sudut' && (
        <>
          <path d={`M ${C} ${C} L ${C + R} ${C} M ${C} ${C} L ${ujung.x} ${ujung.y}`} stroke={WARNA.jari} strokeWidth={3} />
          <path
            d={`M ${C + 30} ${C} A 30 30 0 0 0 ${C + 30 * Math.cos(a)} ${C - 30 * Math.sin(a)}`}
            fill="none"
            stroke={WARNA.sudut}
            strokeWidth={3}
          />
          <text x={C + 48} y={C - 18} fill={WARNA_TEKS.sudut} {...teks}>α</text>
        </>
      )}

      {sorot === 'kelilingLuas' && (
        <>
          <text x={C} y={C + 36} textAnchor="middle" fill={WARNA_TEKS.juring} {...teks}>luas = πr²</text>
          <text x={C} y={22} textAnchor="middle" fill={WARNA_TEKS.busur} {...teks}>keliling = 2πr</text>
        </>
      )}

      <circle cx={C} cy={C} r={sorot === 'pusat' ? 7 : 4} fill={WARNA.teks} />
      {sorot === 'pusat' && (
        <>
          <text x={C + 12} y={C - 10} fill={WARNA.teks} {...teks}>O</text>
          <text x={C} y={C + 34} textAnchor="middle" fill={WARNA.teks} {...teks}>titik pusat</text>
        </>
      )}
    </svg>
  );
}
