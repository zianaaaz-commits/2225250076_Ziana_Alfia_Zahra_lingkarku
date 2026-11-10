// Mengekspor semua soal berkunci ke python/data/konten.json agar dapat diperiksa
// ulang secara independen oleh python/periksa_kunci.py.
// Jalankan: npx tsx scripts/ekspor-konten.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { BANK_SOAL } from '../src/content/bankSoal';
import { CERITA } from '../src/content/cerita';
import { CONTOH } from '../src/content/contoh';
import { LITERASI, soalTerverifikasi } from '../src/content/literasi';

const butir = [
  ...BANK_SOAL.map((s) => ({ sumber: 'bank soal', id: s.id, data: s.data, ditanya: s.ditanya, kunci: s.kunci })),
  ...CONTOH.flatMap((c) => [
    { sumber: 'contoh', id: c.id, ...c.jawaban, kunci: c.jawaban.nilai },
    { sumber: 'melengkapi', id: c.id, ...c.melengkapi.jawaban, kunci: c.melengkapi.jawaban.nilai },
  ]),
  ...CERITA.map((c) => ({ sumber: 'cerita', id: c.id, data: c.soal.data, ditanya: c.soal.ditanya, kunci: c.soal.kunci })),
  ...LITERASI.flatMap((m) => soalTerverifikasi(m).map((s) => ({ sumber: 'literasi', ...s }))),
].map(({ sumber, id, data, ditanya, kunci }) => ({ sumber, id, data, ditanya, kunci }));

mkdirSync('python/data', { recursive: true });
writeFileSync('python/data/konten.json', JSON.stringify(butir, null, 2) + '\n');
console.log(`✓ python/data/konten.json — ${butir.length} soal`);
