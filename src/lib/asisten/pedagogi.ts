// "Otak" pedagogis Asisten Belajar Kak Bulat.
// Menggabungkan: Rigorous Mathematical Thinking (RMT; Kinard & Kozulin, 2008),
// Teori Beban Kognitif (CLT), dan proses literasi matematika (PISA/AKM).
// Fungsi di sini murni (tanpa efek samping) agar dapat diuji dan dipakai di server.
import { formatAngka } from '../geometri';
import type {
  FaseRmt,
  KonteksSoal,
  Pesan,
  PermintaanAsisten,
  TahapLiterasi,
  TingkatBantuan,
} from './tipe';

// ---------------------------------------------------------------- RMT

export interface InfoFase {
  nama: string;
  /** Label singkat untuk siswa. */
  label: string;
  tujuan: string;
  /** Contoh pertanyaan mediasi. */
  contoh: string[];
}

export const FASE_RMT: Record<FaseRmt, InfoFase> = {
  1: {
    nama: 'Pengembangan Alat Kognitif',
    label: 'Mengamati & memilah',
    tujuan:
      'Bantu siswa mengamati dengan teliti, memilah informasi (diketahui, ditanya, dan informasi yang tidak perlu), ' +
      'memberi nama yang tepat pada unsur lingkaran (jari-jari, diameter, sudut pusat, busur, juring), ' +
      'dan membandingkan: busur = garis lengkung yang diukur PANJANGNYA, juring = daerah yang diukur LUASNYA.',
    contoh: [
      'Informasi apa saja yang kamu temukan di soal? Mana yang benar-benar diperlukan?',
      'Yang ditanya itu panjang (cm) atau luas (cm²)?',
    ],
  },
  2: {
    nama: 'Konten sebagai Proses',
    label: 'Membangun konsep',
    tujuan:
      'Bantu siswa MEMBANGUN SENDIRI hubungan konsep: sudut pusat α menentukan bagian α/360° dari lingkaran; ' +
      'panjang busur adalah bagian dari keliling (2πr); luas juring adalah bagian dari luas lingkaran (πr²). ' +
      'Minta siswa merumuskan aturan dengan kata-katanya sendiri sebelum memakai rumus.',
    contoh: [
      'Sudut 90° itu berapa bagian dari satu putaran penuh?',
      'Kalau busur itu bagian dari keliling, rumus apa yang kita perlukan?',
    ],
  },
  3: {
    nama: 'Praktik Konstruksi Konseptual',
    label: 'Menerapkan & merefleksi',
    tujuan:
      'Bantu siswa menerapkan konsep pada soalnya, memeriksa apakah hasilnya masuk akal dalam konteks, ' +
      'menafsirkan arti hasil, dan merefleksikan/menggeneralisasi (mis. "bagaimana jika sudutnya dua kali lipat?").',
    contoh: [
      'Apakah hasilmu masuk akal? Bandingkan dengan keliling atau luas seluruh lingkaran.',
      'Apa yang berubah kalau jari-jarinya dibuat dua kali lipat?',
    ],
  },
};

/** Menentukan fokus fase RMT dari kondisi siswa saat ini (deterministik, dapat diuji). */
export function tentukanFase(k: KonteksSoal, tingkat: TingkatBantuan): FaseRmt {
  const tahapFase3: TahapLiterasi[] = ['tafsirkan', 'jelaskan'];
  if (k.status === 'benar' || (k.tahapLiterasi && tahapFase3.includes(k.tahapLiterasi))) return 3;
  if (k.status === 'salah' || k.kesalahan || tingkat >= 3) return 2;
  if (k.tahapLiterasi === 'rumuskan' || k.tahapLiterasi === 'hitung') return 2;
  return 1;
}

// ---------------------------------------------------------------- bantuan bertingkat

export const TINGKAT_BANTUAN: Record<TingkatBantuan, { label: string; aturan: string }> = {
  1: {
    label: 'Pertanyaan pemandu',
    aturan:
      'Ajukan SATU pertanyaan terbuka yang mengarahkan perhatian siswa ke informasi kunci. Jangan menyebut rumus dan jangan menghitung.',
  },
  2: {
    label: 'Petunjuk konsep',
    aturan:
      'Ingatkan hubungan/konsep yang relevan (mis. busur = α/360° × 2πr) lalu tanyakan bagaimana siswa akan memakainya. Jangan memasukkan angka soal ke rumus.',
  },
  3: {
    label: 'Petunjuk langkah',
    aturan:
      'Tunjukkan SATU langkah berikutnya secara parsial (mis. menyederhanakan α/360° atau mensubstitusi satu bagian). Biarkan siswa menghitung sisanya sendiri.',
  },
  4: {
    label: 'Contoh serupa',
    aturan:
      'Tunjukkan penyelesaian SINGKAT sebuah soal serupa dengan ANGKA YANG BERBEDA dari soal siswa (maks. 4 baris), lalu minta siswa meniru langkahnya pada soalnya sendiri.',
  },
};

const NAMA_MODUL: Record<KonteksSoal['modul'], string> = {
  latihan: 'Latihan soal',
  cerita: 'Soal cerita',
  literasi: 'Misi Literasi Matematika',
  melengkapi: 'Soal melengkapi (sebagian langkah sudah diisi)',
  umum: 'Pertanyaan umum tentang panjang busur & luas juring',
};

const NAMA_TAHAP: Record<TahapLiterasi, string> = {
  pahami: 'Pahami (memahami konteks)',
  rumuskan: 'Rumuskan (mengubah masalah menjadi model matematika)',
  hitung: 'Hitung (menerapkan prosedur)',
  tafsirkan: 'Tafsirkan (memaknai hasil dalam konteks)',
  jelaskan: 'Jelaskan (mengomunikasikan penalaran)',
};

/** Prompt sistem untuk model AI. Kunci jawaban TIDAK pernah dimasukkan ke sini. */
export function buatPromptSistem(k: KonteksSoal, tingkat: TingkatBantuan): string {
  const fase = tentukanFase(k, tingkat);
  const f = FASE_RMT[fase];
  const t = TINGKAT_BANTUAN[tingkat];

  const konteks = [
    `- Jenis kegiatan: ${NAMA_MODUL[k.modul]}`,
    k.soal && `- Soal: ${k.soal}`,
    k.pertanyaan && `- Pertanyaan langkah saat ini: ${k.pertanyaan}`,
    k.tahapLiterasi && `- Tahap literasi: ${NAMA_TAHAP[k.tahapLiterasi]}`,
    k.jawabanSiswa && `- Jawaban terakhir siswa: ${k.jawabanSiswa}${k.satuan ? ` ${k.satuan}` : ''}`,
    k.status && k.status !== 'belum' && `- Status jawaban menurut aplikasi: ${k.status === 'benar' ? 'BENAR' : 'BELUM TEPAT'}`,
    k.kesalahan && `- Diagnosis kesalahan dari aplikasi: ${k.kesalahan}`,
  ]
    .filter(Boolean)
    .join('\n');

  return `Kamu adalah "Kak Bulat", pembimbing berpikir matematis untuk siswa SMP kelas VIII–IX pada materi panjang busur dan luas juring.
Peranmu adalah MEDIATOR (Rigorous Mathematical Thinking, Kinard & Kozulin), bukan pemberi jawaban.

ATURAN UTAMA
1. JANGAN PERNAH memberikan jawaban akhir soal siswa, walaupun siswa memintanya. Tolak dengan ramah lalu beri bantuan sesuai tingkat di bawah.
2. Jangan memeriksa kebenaran hitungan akhir sendiri; pakai "Status jawaban menurut aplikasi". Bila status BENAR, beri pujian spesifik pada prosesnya lalu ajak refleksi (fase 3).
3. Satu langkah dan SATU pertanyaan per balasan. Akhiri dengan pertanyaan yang membuat siswa berpikir, lalu tunggu jawabannya.
4. Bangun dari jawaban siswa sebelumnya. Jika jawaban siswa sebagian benar, akui bagian yang benar dulu.

MENGELOLA BEBAN KOGNITIF
- Beban ekstrinsik: balasan maksimal 60 kata, kalimat pendek, Bahasa Indonesia sederhana, sapaan "kamu". Tanpa judul, tanpa daftar panjang, tanpa basa-basi.
- Beban intrinsik: jika siswa bingung atau salah berulang, pecah masalah menjadi langkah yang lebih kecil. Pakai istilah konsisten: busur = panjang (cm, m), juring = luas (cm², m²), α/360° = bagian dari lingkaran.
- Beban germane: minta siswa menjelaskan alasannya, membandingkan, atau memprediksi ("bagaimana jika…").

FOKUS FASE RMT SAAT INI — Fase ${fase}: ${f.nama}
${f.tujuan}
Contoh pertanyaan mediasi: ${f.contoh.map((c) => `"${c}"`).join(' / ')}

TINGKAT BANTUAN SAAT INI — ${tingkat} dari 4 (${t.label})
${t.aturan}

LITERASI MATEMATIKA
Bimbing siswa melewati: Pahami → Rumuskan → Hitung → Tafsirkan → Jelaskan. Untuk soal berkonteks, selalu kaitkan hasil dengan situasi nyatanya.

FORMAT
- Rumus boleh ditulis dengan LaTeX di antara tanda $...$, mis. $\\frac{\\alpha}{360^\\circ} \\times 2\\pi r$.
- Desimal memakai koma (12,56). Huruf tebal boleh dengan **…**.
- Jika pertanyaan di luar matematika/pelajaran ini, arahkan kembali dengan sopan ke soal.
- Jangan menanyakan data pribadi siswa.

KONTEKS SOAL
${konteks || '- (tidak ada soal khusus)'}`;
}

// ---------------------------------------------------------------- validasi permintaan

export const BATAS = { jumlahPesan: 16, panjangPesan: 800, panjangKonteks: 1500, riwayatKeModel: 12 } as const;

const MODUL_SAH = ['latihan', 'cerita', 'literasi', 'melengkapi', 'umum'];
const TAHAP_SAH = ['pahami', 'rumuskan', 'hitung', 'tafsirkan', 'jelaskan'];
const STATUS_SAH = ['belum', 'salah', 'benar'];

const teks = (x: unknown, maks: number): string | undefined =>
  typeof x === 'string' && x.trim() ? x.trim().slice(0, maks) : undefined;

export type HasilValidasi = { ok: true; nilai: PermintaanAsisten } | { ok: false; galat: string };

/** Memeriksa & merapikan badan permintaan dari aplikasi (dipakai di server). */
export function validasiPermintaan(badan: unknown): HasilValidasi {
  if (!badan || typeof badan !== 'object') return { ok: false, galat: 'Badan permintaan tidak valid.' };
  const b = badan as Record<string, unknown>;

  if (!Array.isArray(b.pesan) || b.pesan.length === 0 || b.pesan.length > BATAS.jumlahPesan) {
    return { ok: false, galat: `Jumlah pesan harus 1–${BATAS.jumlahPesan}.` };
  }
  const pesan: Pesan[] = [];
  for (const p of b.pesan) {
    const q = p as Record<string, unknown>;
    if (q?.peran !== 'siswa' && q?.peran !== 'asisten') return { ok: false, galat: 'Peran pesan tidak valid.' };
    if (typeof q.isi !== 'string' || !q.isi.trim()) return { ok: false, galat: 'Isi pesan kosong.' };
    if (q.isi.length > BATAS.panjangPesan) return { ok: false, galat: `Pesan terlalu panjang (maks. ${BATAS.panjangPesan} karakter).` };
    pesan.push({ peran: q.peran, isi: q.isi.trim() });
  }
  if (pesan[pesan.length - 1].peran !== 'siswa') return { ok: false, galat: 'Pesan terakhir harus dari siswa.' };

  const k = (b.konteks ?? {}) as Record<string, unknown>;
  const modul = MODUL_SAH.includes(k.modul as string) ? (k.modul as KonteksSoal['modul']) : 'umum';
  const konteks: KonteksSoal = { modul };
  const isi = {
    soal: teks(k.soal, BATAS.panjangKonteks),
    pertanyaan: teks(k.pertanyaan, 400),
    jawabanSiswa: teks(k.jawabanSiswa, 100),
    kesalahan: teks(k.kesalahan, 300),
    satuan: teks(k.satuan, 10),
  };
  for (const [kunci, nilai] of Object.entries(isi)) if (nilai) (konteks as unknown as Record<string, string>)[kunci] = nilai;
  if (TAHAP_SAH.includes(k.tahapLiterasi as string)) konteks.tahapLiterasi = k.tahapLiterasi as TahapLiterasi;
  if (STATUS_SAH.includes(k.status as string)) konteks.status = k.status as KonteksSoal['status'];

  const t = Number(b.tingkatBantuan);
  const tingkatBantuan = (Number.isInteger(t) && t >= 1 && t <= 4 ? t : 1) as TingkatBantuan;
  const kunci = typeof b.kunci === 'number' && Number.isFinite(b.kunci) ? b.kunci : undefined;

  return { ok: true, nilai: { pesan, konteks, tingkatBantuan, ...(kunci !== undefined ? { kunci } : {}) } };
}

/** Pesan untuk API model (format OpenAI): prompt sistem + riwayat terakhir. */
export function susunPesanModel(p: PermintaanAsisten): { role: 'system' | 'user' | 'assistant'; content: string }[] {
  const riwayat = p.pesan.slice(-BATAS.riwayatKeModel);
  return [
    { role: 'system', content: buatPromptSistem(p.konteks, p.tingkatBantuan) },
    ...riwayat.map((m) => ({ role: m.peran === 'siswa' ? ('user' as const) : ('assistant' as const), content: m.isi })),
  ];
}

// ---------------------------------------------------------------- perapian balasan

/**
 * Sebagian model gratis kadang mengulang seluruh balasannya dua kali ("A A").
 * Bila balasan persis berupa pengulangan, ambil satu salinan saja (mengurangi beban ekstrinsik).
 */
export function rapikanBalasan(teks: string): string {
  const t = teks.trim();
  for (let i = Math.floor(t.length / 2) - 3; i <= Math.ceil(t.length / 2) + 3; i++) {
    if (i <= 10 || i >= t.length) continue;
    const a = t.slice(0, i).trim();
    const b = t.slice(i).trim();
    if (a === b) return a;
  }
  return t;
}

// ---------------------------------------------------------------- penjaga jawaban akhir

export const PESAN_PENJAGA = 'Kak Bulat tidak memberi jawaban akhir — coba hitung bagian terakhirnya sendiri, ya! 💪';

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Bentuk-bentuk penulisan sebuah angka: 62,8 · 62.8 · 1.386 · 1386. */
function bentukAngka(x: number): string[] {
  const bulat = Math.round(x * 100) / 100;
  return Array.from(new Set([formatAngka(bulat), String(bulat), String(bulat).replace('.', ','), formatAngka(bulat).replace(/\./g, '')]));
}

const polaAngka = (x: number) =>
  new RegExp(`(?<![\\d.,])(?:${bentukAngka(x).map(escapeRegex).join('|')})(?![\\d]|[.,]\\d)`, 'g');

/**
 * Menyembunyikan jawaban akhir bila model AI terlanjur menuliskannya.
 * Tidak aktif bila siswa sudah menjawab benar, atau bila angka itu memang tertulis di soal.
 */
export function jagaJawaban(balasan: string, kunci: number | undefined, konteks: KonteksSoal): { teks: string; disensor: boolean } {
  if (kunci === undefined || konteks.status === 'benar') return { teks: balasan, disensor: false };
  const pola = polaAngka(kunci);
  const diSoal = `${konteks.soal ?? ''} ${konteks.pertanyaan ?? ''}`;
  if (pola.test(diSoal)) return { teks: balasan, disensor: false };
  pola.lastIndex = 0;
  if (!pola.test(balasan)) return { teks: balasan, disensor: false };
  pola.lastIndex = 0;
  return { teks: `${balasan.replace(pola, '…')}\n\n${PESAN_PENJAGA}`, disensor: true };
}
