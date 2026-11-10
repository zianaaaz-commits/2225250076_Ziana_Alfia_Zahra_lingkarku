import { useState } from 'react';
import KotakUmpanBalik from '../../components/KotakUmpanBalik';
import MathText from '../../components/MathText';
import PilihanSegmen from '../../components/PilihanSegmen';
import Tombol from '../../components/Tombol';
import type { Cerita, Token } from '../../content/cerita';

type Tanda = 'diketahui' | 'ditanya';

const GAYA: Record<Tanda | 'kosong', string> = {
  kosong: 'border-gray-400 border-dashed bg-gray-50',
  diketahui: 'border-indigo-600 bg-indigo-100 text-indigo-900',
  ditanya: 'border-yellow-600 bg-yellow-100 text-yellow-900',
};

/** Evaluasi penandaan → daftar pesan kesalahan (kosong = benar semua). */
export function evaluasiTanda(cerita: Cerita, tanda: Record<number, Tanda>): string[] {
  const pesan: string[] = [];
  let kurangDiketahui = false;
  let ditanyaSalah = false;
  cerita.segmen.forEach((s, i) => {
    if (typeof s === 'string') return;
    const t = tanda[i];
    if (s.peran === 'pengecoh' && t) pesan.push(`“${s.teks}” tidak diperlukan untuk menjawab pertanyaan.`);
    if (s.peran === 'diketahui' && t !== 'diketahui') kurangDiketahui = true;
    if (s.peran === 'ditanya' && t !== 'ditanya') ditanyaSalah = true;
    if (s.peran === 'diketahui' && t === 'ditanya') ditanyaSalah = true;
  });
  if (kurangDiketahui) pesan.push('Masih ada informasi penting yang belum ditandai **Diketahui**.');
  if (ditanyaSalah) pesan.push('Cek lagi bagian **Ditanya**: apa yang diminta oleh kalimat “Berapa …?”');
  return pesan;
}

// Siswa mengetuk kata/angka untuk menandai Diketahui / Ditanya (EL05).
export default function TandaiCerita({ cerita, benar }: { cerita: Cerita; benar: () => void }) {
  const [mode, setMode] = useState<Tanda>('diketahui');
  const [tanda, setTanda] = useState<Record<number, Tanda>>({});
  const [pesan, setPesan] = useState<string[] | null>(null);

  const ketuk = (i: number) => {
    setPesan(null);
    setTanda((t) => {
      const baru = { ...t };
      if (baru[i] === mode) delete baru[i];
      else baru[i] = mode;
      return baru;
    });
  };

  const daftar = (jenis: Tanda) =>
    cerita.segmen.flatMap((s, i) => (typeof s !== 'string' && tanda[i] === jenis ? [(s as Token).teks] : []));

  return (
    <div className="flex flex-col gap-4">
      <PilihanSegmen
        label="Tandai sebagai"
        nilai={mode}
        ubah={setMode}
        pilihan={[
          { nilai: 'diketahui', teks: '✏️ Diketahui' },
          { nilai: 'ditanya', teks: '❓ Ditanya' },
        ]}
      />
      <p className="text-sm text-gray-600">Ketuk bagian bergaris untuk menandainya.</p>

      <p className="text-lg leading-loose">
        {cerita.segmen.map((s, i) =>
          typeof s === 'string' ? (
            <span key={i}>{s}</span>
          ) : (
            <button
              key={i}
              type="button"
              aria-pressed={!!tanda[i]}
              aria-label={`${s.teks}${tanda[i] ? `, ditandai ${tanda[i]}` : ''}`}
              onClick={() => ketuk(i)}
              className={`mx-0.5 rounded border-b-2 px-1 py-0.5 font-semibold ${GAYA[tanda[i] ?? 'kosong']}`}
            >
              {s.teks}
            </button>
          ),
        )}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-indigo-50 p-3">
          <p className="mb-1 font-bold text-indigo-900">Diketahui</p>
          {daftar('diketahui').map((t) => <p key={t}>• {t}</p>)}
        </div>
        <div className="rounded-xl bg-yellow-50 p-3">
          <p className="mb-1 font-bold text-yellow-900">Ditanya</p>
          {daftar('ditanya').map((t) => <p key={t}>• {t}</p>)}
        </div>
      </div>

      {pesan && pesan.length > 0 && (
        <KotakUmpanBalik benar={false}>
          <ul className="list-disc pl-5">
            {pesan.map((p) => (
              <li key={p}>
                <MathText teks={p} />
              </li>
            ))}
          </ul>
        </KotakUmpanBalik>
      )}

      <Tombol
        disabled={Object.keys(tanda).length === 0}
        onClick={() => {
          const p = evaluasiTanda(cerita, tanda);
          setPesan(p);
          if (p.length === 0) benar();
        }}
      >
        Cek tandaku
      </Tombol>
    </div>
  );
}
