import { WARNA, WARNA_TEKS } from '../../lib/warna';

// Ilustrasi wiper: juring besar (r = 42) dikurangi juring kecil (r = 21), sudut 120°.
const C = { x: 150, y: 200 };
const R_BESAR = 140;
const R_KECIL = 70;
const MULAI = 30; // derajat, agar sapuan simetris di atas poros
const AKHIR = 150;

const titik = (r: number, d: number) => {
  const t = (d * Math.PI) / 180;
  return { x: C.x + r * Math.cos(t), y: C.y - r * Math.sin(t) };
};

export default function WiperSVG({ className = '' }: { className?: string }) {
  const b1 = titik(R_BESAR, MULAI);
  const b2 = titik(R_BESAR, AKHIR);
  const k1 = titik(R_KECIL, MULAI);
  const k2 = titik(R_KECIL, AKHIR);
  const cincin = `M ${k1.x} ${k1.y} L ${b1.x} ${b1.y} A ${R_BESAR} ${R_BESAR} 0 0 0 ${b2.x} ${b2.y} L ${k2.x} ${k2.y} A ${R_KECIL} ${R_KECIL} 0 0 1 ${k1.x} ${k1.y} Z`;
  const kecil = `M ${C.x} ${C.y} L ${k1.x} ${k1.y} A ${R_KECIL} ${R_KECIL} 0 0 0 ${k2.x} ${k2.y} Z`;
  const teks = { fontSize: 15, fontWeight: 700 } as const;

  return (
    <svg
      viewBox="0 30 300 200"
      role="img"
      aria-label="Wiper: daerah yang dibersihkan adalah juring jari-jari 42 cm dikurangi juring jari-jari 21 cm, sudut 120 derajat"
      className={className}
    >
      <path d={cincin} fill={WARNA.juring} fillOpacity={0.45} stroke={WARNA.juring} />
      <path d={kecil} fill="#F3F4F6" stroke={WARNA.garis} strokeDasharray="4 3" />
      <line x1={C.x} y1={C.y} x2={b1.x} y2={b1.y} stroke={WARNA.jari} strokeWidth={3} />
      <line x1={C.x} y1={C.y} x2={b2.x} y2={b2.y} stroke={WARNA.garis} strokeWidth={2} />
      <line x1={k1.x} y1={k1.y} x2={b1.x} y2={b1.y} stroke={WARNA.teks} strokeWidth={6} strokeLinecap="round" />
      <circle cx={C.x} cy={C.y} r={5} fill={WARNA.teks} />
      <text x={C.x} y={C.y - 22} textAnchor="middle" fill={WARNA_TEKS.sudut} {...teks}>120°</text>
      <text x={(C.x + k1.x) / 2 + 12} y={(C.y + k1.y) / 2 + 14} fill={WARNA_TEKS.jari} {...teks}>21</text>
      <text x={b1.x - 6} y={b1.y - 8} textAnchor="end" fill={WARNA_TEKS.jari} {...teks}>42 cm</text>
      <text x={C.x} y={C.y - 100} textAnchor="middle" fill={WARNA_TEKS.juring} {...teks}>dibersihkan</text>
    </svg>
  );
}
