import { WARNA_TEKS } from '../lib/warna';

/** Rumus berwarna: bagian α/360° ungu, bagian keliling oranye / luas biru (IL01). */
export default function Rumus({ jenis }: { jenis: 'busur' | 'juring' }) {
  const busur = jenis === 'busur';
  return (
    <p className="text-lg font-bold">
      <span style={{ color: busur ? WARNA_TEKS.busur : WARNA_TEKS.juring }}>
        {busur ? 'Panjang busur' : 'Luas juring'}
      </span>{' '}
      = <span style={{ color: WARNA_TEKS.sudut }}>α/360°</span> ×{' '}
      <span style={{ color: busur ? WARNA_TEKS.busur : WARNA_TEKS.juring }}>
        {busur ? '2πr' : 'πr²'}
      </span>
    </p>
  );
}
