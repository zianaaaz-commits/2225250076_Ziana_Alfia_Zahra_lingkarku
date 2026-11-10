import type { GambarSoal } from '../../content/contoh';
import { hitungKunci, jariSoal, type Soal } from '../../lib/soal';

/** Gambar pendamping soal latihan; nilai yang ditanya ditandai "?" agar tidak bocor. */
export function gambarSoal(soal: Soal): GambarSoal | undefined {
  const { data, ditanya } = soal;
  const p = data.pi;
  const satuan = soal.satuan.startsWith('m') ? 'm' : 'cm';
  // Soal cerita: hanya bentuk, tanpa label (siswa sendiri yang menerjemahkan cerita ke gambar).
  const label = soal.level !== 3;

  switch (ditanya) {
    case 'busur':
    case 'juring':
    case 'kelilingJuring':
      return {
        r: jariSoal(data),
        alpha: data.alpha!,
        pi: p,
        tampil: ditanya === 'busur' ? 'busur' : ditanya === 'juring' ? 'juring' : 'keduanya',
        nilai: false,
        label,
        satuan,
        teksR: data.d !== undefined ? '?' : undefined,
      };
    case 'sudutDariBusur':
    case 'sudutDariJuring':
      return {
        r: jariSoal(data),
        alpha: hitungKunci(soal),
        pi: p,
        tampil: ditanya === 'sudutDariBusur' ? 'busur' : 'juring',
        nilai: true,
        satuan,
        teksSudut: '?',
      };
    case 'jariDariBusur':
    case 'jariDariJuring':
      return {
        r: hitungKunci(soal),
        alpha: data.alpha!,
        pi: p,
        tampil: ditanya === 'jariDariBusur' ? 'busur' : 'juring',
        nilai: true,
        satuan,
        teksR: '?',
      };
    case 'perbandingan':
      return undefined;
  }
}
