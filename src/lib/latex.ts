// Helper penulisan rumus KaTeX dengan kode warna konsisten (CLAUDE.md §5).
import { formatAngka, pecahanSederhana, type Pi } from './geometri';
import { WARNA_TEKS } from './warna';

export const warnai = (warna: string, s: string) => String.raw`\textcolor{${warna}}{${s}}`;

export const SUDUT_TEX = warnai(WARNA_TEKS.sudut, String.raw`\frac{\alpha}{360^\circ}`);

export const RUMUS_BUSUR = String.raw`$\text{Panjang busur} = ${SUDUT_TEX} \times ${warnai(WARNA_TEKS.busur, String.raw`2\pi r`)}$`;

export const RUMUS_JURING = String.raw`$\text{Luas juring} = ${SUDUT_TEX} \times ${warnai(WARNA_TEKS.juring, String.raw`\pi r^2`)}$`;

export const piTex = (p: Pi): string => (p === '22/7' ? String.raw`\frac{22}{7}` : '3{,}14');

/** Angka gaya Indonesia untuk KaTeX: 62,8 → "62{,}8" (agar koma tidak diberi spasi). */
export const angkaTex = (x: number): string => formatAngka(x).replace(',', '{,}');

/** Pecahan sudut paling sederhana dalam KaTeX: 90 → \frac{1}{4}, 360 → 1. */
export const pecahanTex = (alpha: number): string => {
  const [p, q] = pecahanSederhana(alpha);
  return q === 1 ? `${p}` : String.raw`\frac{${p}}{${q}}`;
};
