# 05 — Arsitektur Teknis

## 1. Keputusan Utama

**Satu basis kode web (React + TypeScript) → dijalankan sebagai PWA di browser
dan dibungkus menjadi APK Android dengan Capacitor.**

| Opsi | Kelebihan | Kekurangan | Keputusan |
|---|---|---|---|
| **React + Vite + Capacitor** | Satu kode untuk web & Android, SVG mudah untuk simulasi, ekosistem besar, mudah dipelajari | Perlu Android Studio untuk build APK | **Dipilih** |
| Flutter | Performa native, satu kode | Versi web kurang ringan, belajar Dart | Alternatif |
| Android native (Kotlin) | Performa terbaik | Tidak ada versi web, dua kode terpisah | Tidak |
| HTML/JS murni | Sangat sederhana | Sulit dirawat saat fitur bertambah | Tidak |

Tidak ada server/back-end di versi 1.0: semua konten dikemas di dalam aplikasi, progres di `localStorage`.
Ini membuat aplikasi **gratis di-hosting** (GitHub Pages / Netlify / Vercel) dan **jalan offline**.

## 2. Diagram Arsitektur

```
┌──────────────────────────────────────────────┐
│                 Antarmuka (React)             │
│  Beranda · Prasyarat · Konsep · Simulasi ·    │
│  Contoh · Latihan · Soal Cerita · Pengaturan  │
└───────────────┬──────────────────────────────┘
                │ memakai
┌───────────────▼──────────────┐  ┌────────────────────────┐
│ components/ (UI umum)        │  │ content/ (JSON/TS)      │
│ CircleSVG, Slider, StepReveal│  │ materi, contoh, soal,   │
│ MathText, FeedbackBox, ...   │  │ template soal acak      │
└───────────────┬──────────────┘  └───────────┬────────────┘
                │                             │
┌───────────────▼─────────────────────────────▼────────────┐
│ lib/ (logika murni, diuji)                                │
│ geometri.ts · feedback.ts · generator.ts · progress.ts    │
└───────────────┬──────────────────────────────────────────┘
                │
     ┌──────────▼──────────┐
     │ localStorage        │  (progres, pengaturan)
     └─────────────────────┘
Distribusi:  dist/ ──► PWA (hosting statis)
             dist/ ──► Capacitor ──► APK Android
```

## 3. Modul Logika (`src/lib`)

### `geometri.ts`
```ts
export type Pi = '22/7' | '3.14';
export const nilaiPi = (p: Pi) => (p === '22/7' ? 22 / 7 : 3.14);

export const keliling = (r: number, p: Pi) => 2 * nilaiPi(p) * r;
export const luasLingkaran = (r: number, p: Pi) => nilaiPi(p) * r * r;

export const panjangBusur = (alpha: number, r: number, p: Pi) => (alpha / 360) * keliling(r, p);
export const luasJuring  = (alpha: number, r: number, p: Pi) => (alpha / 360) * luasLingkaran(r, p);

export const sudutDariBusur  = (busur: number, r: number, p: Pi) => (busur / keliling(r, p)) * 360;
export const sudutDariJuring = (luas: number, r: number, p: Pi) => (luas / luasLingkaran(r, p)) * 360;
export const jariDariBusur   = (busur: number, alpha: number, p: Pi) => busur / ((alpha / 360) * 2 * nilaiPi(p));
export const jariDariJuring  = (luas: number, alpha: number, p: Pi) => Math.sqrt(luas / ((alpha / 360) * nilaiPi(p)));

export const bulatkan = (x: number, digit = 2) => Math.round(x * 10 ** digit) / 10 ** digit;
```

### `feedback.ts`
- Input: data soal + jawaban siswa.
- Proses: hitung kandidat jawaban salah (E1–E10, lihat [04-konten-materi.md](04-konten-materi.md#6-kesalahan-umum--umpan-balik)), cocokkan dengan toleransi.
- Output: `{ benar: boolean, kodeKesalahan?: string, pesan: string }`.

### `generator.ts`
- Membuat soal acak dari template, hanya menerima hasil "ramah hitung".

### `progress.ts`
- Simpan/baca `{ modulSelesai: string[], skorLatihan: Record<level, {benar, total}>, pengaturan }`.
- Semua akses `localStorage` dibungkus `try/catch`; aplikasi tetap jalan jika penyimpanan gagal.

## 4. Model Data Konten

```ts
type JenisSoal = 'busur' | 'juring' | 'cariSudut' | 'cariJari' | 'perbandingan' | 'cerita';

interface Soal {
  id: string;              // "L1-01"
  level: 1 | 2 | 3;
  jenis: JenisSoal;
  teks: string;            // kalimat soal
  data: { r?: number; d?: number; alpha?: number; busur?: number; luas?: number; pi: Pi };
  ditanya: 'busur' | 'juring' | 'sudut' | 'jari' | 'keliling';
  satuan: 'cm' | 'cm²' | 'm' | 'm²' | '°';
  kunci: number;           // dihitung & diuji, bukan ditulis bebas
  langkah: string[];       // pembahasan bertahap (boleh berisi LaTeX)
  contohTerkait?: string;  // id contoh F4
}
```

## 5. Komponen Kunci

| Komponen | Fungsi |
|---|---|
| `CircleSVG` | Menggambar lingkaran, jari-jari, busur (path arc), juring (path sector), label nilai di posisi gambar |
| `AngleSlider`, `RadiusSlider` | Slider ramah sentuh + tombol pintas sudut |
| `StepReveal` | Menampilkan langkah satu per satu (maju/mundur) |
| `MathText` | Render rumus KaTeX dengan warna konsisten |
| `NumberAnswer` | Input angka, menerima koma/titik, keyboard numerik di ponsel (`inputMode="decimal"`) |
| `FeedbackBox` | Menampilkan verifikasi, diagnosis, petunjuk bertingkat |
| `TapToTag` | Menandai kata di soal cerita sebagai Diketahui/Ditanya |

Rumus path SVG juring (pusat (cx, cy), sudut mulai dari arah jam 3 berlawanan jarum jam):
```
x2 = cx + r·cos(α), y2 = cy − r·sin(α)
large-arc = α > 180 ? 1 : 0
d = `M cx cy L cx+r cy A r r 0 large-arc 0 x2 y2 Z`
```

## 6. Build & Rilis

### Web (PWA)
1. `npm run build` → folder `dist/`.
2. Unggah ke GitHub Pages / Netlify / Vercel (gratis).
3. `vite-plugin-pwa` menghasilkan *service worker* & *manifest* → bisa "Tambahkan ke layar utama" dan jalan offline.

### Android (APK)
1. Pasang **Android Studio** + JDK 17.
2. `npm install @capacitor/core @capacitor/cli @capacitor/android`
3. `npx cap init LingkarKu id.ac.<kampus>.lingkarku --web-dir=dist`
4. `npx cap add android`
5. Setiap ada perubahan: `npm run build && npx cap sync android`
6. `npx cap open android` → Build ▸ Build APK(s) untuk uji coba, atau *Generate Signed Bundle* untuk Play Store.

> Versi paket Capacitor/Android Studio mengikuti yang terbaru saat pengembangan dimulai; cek dokumentasi resmi Capacitor.

## 7. Pengujian

| Jenis | Alat | Cakupan minimal |
|---|---|---|
| Unit | Vitest | Semua fungsi `geometri.ts`, `feedback.ts`, `generator.ts`; **setiap kunci di bank soal** |
| Komponen | React Testing Library | `StepReveal`, `NumberAnswer`, `FeedbackBox` |
| Manual | Ponsel Android nyata (layar kecil) + Chrome desktop | Daftar cek di [07-roadmap.md](07-roadmap.md) |

## 8. Keamanan & Privasi

- Tanpa login, tanpa pengumpulan data pribadi (pengguna adalah anak di bawah umur).
- Tanpa SDK iklan/analitik pihak ketiga.
- Jika kelak butuh data uji coba, gunakan angket terpisah dengan persetujuan orang tua/sekolah.
