// Membuat petunjuk bertingkat dan pembahasan langkah demi langkah secara otomatis
// dari data soal, sehingga bank soal & soal acak selalu punya pembahasan yang konsisten.
import type { Langkah } from '../components/StepReveal';
import { formatAngka, keliling, luasLingkaran, nilaiPi, panjangBusur, pecahanSudut } from './geometri';
import { angkaTex as t, pecahanTex, piTex, RUMUS_BUSUR, RUMUS_JURING } from './latex';
import { hitungKunci, jariSoal, type Soal } from './soal';

export interface Bantuan {
  petunjuk1: string;
  petunjuk2: string;
  langkah: Langkah[];
}

type SoalBahas = Pick<Soal, 'data' | 'ditanya' | 'satuan'>;

/** Satuan panjang dasar soal (cm atau m). */
const satuanDasar = (s: SoalBahas): string => (s.satuan === '°' ? 'cm' : s.satuan.replace('²', ''));

export function buatBantuan(soal: SoalBahas): Bantuan {
  const { data } = soal;
  const p = data.pi;
  const pi = piTex(p);
  const u = satuanDasar(soal);
  const hasil = hitungKunci(soal);
  const jawab = (nama: string) => ({ label: 'Jawaban', isi: `${nama} = **${formatAngka(hasil)} ${soal.satuan}**` });

  switch (soal.ditanya) {
    case 'busur':
    case 'juring':
    case 'kelilingJuring': {
      const a = data.alpha!;
      const r = jariSoal(data);
      const fr = pecahanTex(a);
      const dariD = data.d !== undefined;
      const diketahui = {
        label: 'Diketahui',
        isi:
          (dariD ? String.raw`$d = ${t(data.d!)}$ ${u} → $r = ${t(data.d!)} \div 2 = ${t(r)}$ ${u}` : String.raw`$r = ${t(r)}$ ${u}`) +
          String.raw`, $\alpha = ${a}^\circ$, $\pi = ${pi}$`,
      };
      const ingatD = dariD ? ' Ingat: r = d ÷ 2.' : '';

      if (soal.ditanya === 'juring') {
        const L = luasLingkaran(r, p);
        return {
          petunjuk1: `Yang ditanya **luas** → juring. Pakai ${RUMUS_JURING}.${ingatD}`,
          petunjuk2: String.raw`$\frac{${a}}{360} \times ${pi} \times ${t(r)} \times ${t(r)}$. Sederhanakan dulu: $\frac{${a}}{360} = ${fr}$`,
          langkah: [
            diketahui,
            { label: 'Ditanya', isi: 'Luas juring. Yang ditanya **luas** → pakai $\\pi r^2$.' },
            { label: 'Rumus', isi: RUMUS_JURING },
            { label: 'Substitusi', isi: String.raw`$= \frac{${a}}{360} \times ${pi} \times ${t(r)} \times ${t(r)}$` },
            { label: 'Hitung', isi: String.raw`$= ${fr} \times ${t(L)} = ${t(hasil)}$` },
            jawab('Luas juring'),
          ],
        };
      }

      const K = keliling(r, p);
      const busur = panjangBusur(a, r, p);
      const dasar = [
        diketahui,
        soal.ditanya === 'busur'
          ? { label: 'Ditanya', isi: 'Panjang busur. Yang ditanya **panjang** → pakai keliling $2\\pi r$.' }
          : { label: 'Ditanya', isi: 'Keliling juring = panjang busur **+ 2 jari-jari**.' },
        { label: 'Rumus', isi: RUMUS_BUSUR },
        { label: 'Substitusi', isi: String.raw`$= \frac{${a}}{360} \times 2 \times ${pi} \times ${t(r)}$` },
        { label: 'Hitung busur', isi: String.raw`$= ${fr} \times ${t(K)} = ${t(busur)}$` },
      ];
      if (soal.ditanya === 'busur') {
        return {
          petunjuk1: `Yang ditanya **panjang** → busur. Pakai ${RUMUS_BUSUR}.${ingatD}`,
          petunjuk2: String.raw`$\frac{${a}}{360} \times 2 \times ${pi} \times ${t(r)}$. Sederhanakan dulu: $\frac{${a}}{360} = ${fr}$`,
          langkah: [...dasar, jawab('Panjang busur')],
        };
      }
      return {
        petunjuk1: 'Hitung panjang busurnya dulu, lalu tambahkan **dua** jari-jari.',
        petunjuk2: String.raw`Busur $= ${fr} \times ${t(K)} = ${t(busur)}$, lalu $${t(busur)} + 2 \times ${t(r)}$`,
        langkah: [
          ...dasar,
          { label: 'Tambah 2 jari-jari', isi: String.raw`$${t(busur)} + 2 \times ${t(r)} = ${t(hasil)}$` },
          jawab('Keliling juring'),
        ],
      };
    }

    case 'sudutDariBusur':
    case 'sudutDariJuring': {
      const r = jariSoal(data);
      const dariBusur = soal.ditanya === 'sudutDariBusur';
      const diberi = dariBusur ? data.busur! : data.luas!;
      const penuh = dariBusur ? keliling(r, p) : luasLingkaran(r, p);
      const nama = dariBusur ? 'Panjang busur' : 'Luas juring';
      const satuanDiberi = dariBusur ? u : `${u}²`;
      const fr = pecahanTex(hasil);
      const hitungPenuh = dariBusur
        ? String.raw`$2 \times ${pi} \times ${t(r)} = ${t(penuh)}$`
        : String.raw`$${pi} \times ${t(r)} \times ${t(r)} = ${t(penuh)}$`;
      return {
        petunjuk1: dariBusur
          ? 'Hitung dulu **keliling** lingkaran $2\\pi r$, lalu bandingkan dengan panjang busur.'
          : 'Hitung dulu **luas** lingkaran $\\pi r^2$, lalu bandingkan dengan luas juring.',
        petunjuk2: String.raw`${hitungPenuh}, lalu $\frac{\alpha}{360^\circ} = \frac{${t(diberi)}}{${t(penuh)}}$`,
        langkah: [
          { label: 'Diketahui', isi: String.raw`${nama} $= ${t(diberi)}$ ${satuanDiberi}, $r = ${t(r)}$ ${u}, $\pi = ${pi}$` },
          { label: 'Ditanya', isi: String.raw`Sudut pusat $\alpha$` },
          { label: 'Rumus', isi: dariBusur ? RUMUS_BUSUR : RUMUS_JURING },
          { label: dariBusur ? 'Hitung keliling' : 'Hitung luas lingkaran', isi: hitungPenuh },
          { label: 'Cari pecahan sudut', isi: String.raw`$\frac{\alpha}{360^\circ} = \frac{${t(diberi)}}{${t(penuh)}} = ${fr}$` },
          { label: 'Hitung sudut', isi: String.raw`$\alpha = ${fr} \times 360^\circ = ${t(hasil)}^\circ$` },
          jawab('Sudut pusat'),
        ],
      };
    }

    case 'jariDariBusur': {
      const a = data.alpha!;
      const fr = pecahanTex(a);
      const x = data.busur! / pecahanSudut(a); // = 2πr
      return {
        petunjuk1: 'Masukkan angka ke rumus busur, lalu cari $2\\pi r$ lebih dulu.',
        petunjuk2: String.raw`$${t(data.busur!)} = ${fr} \times 2 \times ${pi} \times r$, jadi $2 \times ${pi} \times r = ${t(data.busur!)} \div ${fr}$`,
        langkah: [
          { label: 'Diketahui', isi: String.raw`Panjang busur $= ${t(data.busur!)}$ ${u}, $\alpha = ${a}^\circ$, $\pi = ${pi}$` },
          { label: 'Ditanya', isi: 'Jari-jari $r$' },
          { label: 'Rumus', isi: RUMUS_BUSUR },
          { label: 'Substitusi', isi: String.raw`$${t(data.busur!)} = ${fr} \times 2 \times ${pi} \times r$` },
          { label: 'Cari 2πr', isi: String.raw`$2 \times ${pi} \times r = ${t(data.busur!)} \div ${fr} = ${t(x)}$` },
          { label: 'Cari r', isi: String.raw`$r = ${t(x)} \div (2 \times ${pi}) = ${t(hasil)}$` },
          jawab('Jari-jari'),
        ],
      };
    }

    case 'jariDariJuring': {
      const a = data.alpha!;
      const fr = pecahanTex(a);
      const x = data.luas! / pecahanSudut(a); // = πr²
      const r2 = x / nilaiPi(p);
      return {
        petunjuk1: 'Masukkan angka ke rumus juring, cari $r^2$, lalu tarik akarnya.',
        petunjuk2: String.raw`$${t(data.luas!)} = ${fr} \times ${pi} \times r^2$, jadi $${pi} \times r^2 = ${t(data.luas!)} \div ${fr}$`,
        langkah: [
          { label: 'Diketahui', isi: String.raw`Luas juring $= ${t(data.luas!)}$ ${u}², $\alpha = ${a}^\circ$, $\pi = ${pi}$` },
          { label: 'Ditanya', isi: 'Jari-jari $r$' },
          { label: 'Rumus', isi: RUMUS_JURING },
          { label: 'Substitusi', isi: String.raw`$${t(data.luas!)} = ${fr} \times ${pi} \times r^2$` },
          { label: 'Cari πr²', isi: String.raw`$${pi} \times r^2 = ${t(data.luas!)} \div ${fr} = ${t(x)}$` },
          { label: 'Cari r²', isi: String.raw`$r^2 = ${t(x)} \div ${pi} = ${t(r2)}$` },
          { label: 'Tarik akar', isi: String.raw`$r = \sqrt{${t(r2)}} = ${t(hasil)}$` },
          jawab('Jari-jari'),
        ],
      };
    }

    case 'perbandingan': {
      const { nilai1, alpha1, alpha2 } = data as Required<typeof data>;
      const k = alpha2 / alpha1;
      const jenis = soal.satuan.includes('²') ? 'juring' : 'busur';
      return {
        petunjuk1: `Panjang busur dan luas juring **sebanding** dengan sudut pusat.`,
        petunjuk2: String.raw`Sudut kedua $= \frac{${alpha2}}{${alpha1}} = ${t(k)}$ kali sudut pertama.`,
        langkah: [
          { label: 'Diketahui', isi: String.raw`$\alpha_1 = ${alpha1}^\circ$, ${jenis} pertama $= ${t(nilai1)}$ ${soal.satuan}, $\alpha_2 = ${alpha2}^\circ$` },
          { label: 'Ditanya', isi: `${jenis === 'busur' ? 'Panjang busur' : 'Luas juring'} kedua` },
          { label: 'Konsep', isi: String.raw`$\frac{\text{${jenis} kedua}}{\text{${jenis} pertama}} = \frac{\alpha_2}{\alpha_1}$` },
          { label: 'Kelipatan sudut', isi: String.raw`$\frac{${alpha2}}{${alpha1}} = ${t(k)}$` },
          { label: 'Hitung', isi: String.raw`$${t(k)} \times ${t(nilai1)} = ${t(hasil)}$` },
          jawab(jenis === 'busur' ? 'Panjang busur' : 'Luas juring'),
        ],
      };
    }
  }
}
