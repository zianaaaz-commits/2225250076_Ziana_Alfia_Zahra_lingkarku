import { useState } from 'react';
import PilihanSegmen from '../../components/PilihanSegmen';
import Jelajah from './Jelajah';
import Bandingkan from './Bandingkan';
import TebakDulu from './TebakDulu';

type Mode = 'jelajah' | 'bandingkan' | 'tebak';

// F3 — Simulasi Lingkaran (DS01, IL02, GL01)
export default function Simulasi() {
  const [mode, setMode] = useState<Mode>('jelajah');

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Simulasi</h1>
      <PilihanSegmen
        label="Mode simulasi"
        nilai={mode}
        ubah={setMode}
        pilihan={[
          { nilai: 'jelajah', teks: 'Jelajah' },
          { nilai: 'bandingkan', teks: 'Bandingkan' },
          { nilai: 'tebak', teks: 'Tebak Dulu' },
        ]}
      />
      {mode === 'jelajah' && <Jelajah />}
      {mode === 'bandingkan' && <Bandingkan />}
      {mode === 'tebak' && <TebakDulu />}
    </section>
  );
}
