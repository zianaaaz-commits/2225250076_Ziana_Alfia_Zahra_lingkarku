# CLAUDE.md

Panduan untuk Claude Code (dan pengembang lain) saat bekerja di repositori ini.
Baca file ini sebelum menulis kode. Detail lengkap ada di folder [docs/](docs/).

## 1. Ringkasan Proyek

**LingkarKu** (nama kerja, boleh diganti) adalah aplikasi pembelajaran matematika untuk
siswa SMP (kelas VIII–IX) pada materi **Panjang Busur dan Luas Juring**.
Aplikasi berjalan di **web (PWA)** dan **Android (APK via Capacitor)** dari satu basis kode.

Aplikasi dirancang berdasarkan **Teori Beban Kognitif (Cognitive Load Theory / CLT)**:

- menurunkan **beban ekstrinsik** (tampilan sederhana, sedikit teks, gambar jelas),
- mengelola **beban intrinsik** (materi dipecah bertahap, prasyarat diajarkan dulu),
- meningkatkan **beban germane** (simulasi, contoh soal bertahap, umpan balik pembahasan).

Dasar kebutuhan: wawancara siswa S01 (6 November 2026), lihat
[docs/01-analisis-kebutuhan.md](docs/01-analisis-kebutuhan.md).

Pengembang: Ziana Alfia Zahra (S1 Pendidikan Matematika, NIM 2225250076).

## 2. Teknologi

| Lapisan | Pilihan |
|---|---|
| Bahasa | TypeScript (strict) |
| Framework UI | React 18 + Vite |
| Styling | Tailwind CSS |
| Rumus matematika | KaTeX (`react-katex` atau render manual) |
| Simulasi lingkaran | SVG murni (tanpa library grafik berat) |
| Routing | React Router (HashRouter agar aman di Capacitor) |
| State & progres | React state + `localStorage` (tanpa server, tanpa login) |
| Web/offline | `vite-plugin-pwa` |
| Android | Capacitor (`@capacitor/android`) |
| Uji | Vitest + React Testing Library |
| Python 3.13 | Alat bantu & analisis: `python/` (lagu, QR, pemeriksa kunci, analisis data penelitian, kunci APK) |
| CI/CD | GitHub Actions: `web.yml` (uji + GitHub Pages), `apk.yml` (APK ke GitHub Releases) |

Bahasa pemrograman: **TypeScript** (JavaScript + pengecekan tipe; saat build diubah menjadi JavaScript
biasa yang dijalankan browser) dan **Python** (alat bantu & analisis data, tidak berjalan di aplikasi).

Alasan dan alternatif: [docs/05-arsitektur-teknis.md](docs/05-arsitektur-teknis.md).

## 3. Perintah

Node.js v26 terpasang *portable* (tanpa admin) di `%LOCALAPPDATA%\Programs\node-v26.13.0-win-x64`
dan sudah ditambahkan ke PATH pengguna (buka ulang terminal/VS Code agar terbaca).

```bash
npm install            # pasang dependensi
npm run dev            # server pengembangan (http://localhost:5173)
npm run build          # build produksi ke dist/
npm run preview        # pratinjau hasil build
npm run test           # jalankan unit test (Vitest)
npm run lint           # ESLint
npm run ikon           # buat ulang ikon PNG dari public/icon*.svg
npm run periksa:python # ekspor konten → Python memeriksa ulang semua kunci (pecahan eksak)
npm run test:python    # unit test alat Python
npm run lagu           # buat ulang lagu latar (public/audio/lagu-latar.wav)
npm run qr             # buat ulang kode QR alamat web (perlu: pip install -r python/requirements.txt)
npm run android        # build + salin dist/ ke proyek android/
npm run android:buka   # seperti di atas, lalu buka Android Studio untuk build APK
```

Build APK memerlukan Android Studio (JDK + Android SDK) — belum terpasang di laptop pengembang.
App ID Android: `id.lingkarku.app` (di `capacitor.config.ts`).

## 4. Struktur Folder (target)

```
src/
  app/            # routing, layout, provider
  features/
    prasyarat/    # modul unsur lingkaran (pretraining)
    konsep/       # busur vs juring, hubungan sudut pusat
    simulasi/     # lingkaran interaktif (slider sudut & jari-jari)
    contoh/       # contoh soal bertahap (worked example + fading)
    latihan/      # latihan + umpan balik + pembahasan
    cerita/       # soal cerita dengan penanda "diketahui/ditanya"
  components/     # komponen UI umum (Button, Card, StepReveal, MathText, ...)
  lib/
    geometri.ts   # rumus murni: panjangBusur, luasJuring, invers, perbandingan
    soal.ts       # tipe Soal + hitungKunci (sumber kebenaran kunci jawaban)
    feedback.ts   # deteksi kesalahan umum (E1–E13) -> pesan umpan balik
    pembahasan.ts # petunjuk bertingkat & pembahasan otomatis dari data soal
    generator.ts  # soal acak "ramah hitung"
    latex.ts      # rumus KaTeX berwarna
    progress.ts   # simpan/baca progres di localStorage
  content/        # data materi & soal dalam JSON/TS (BUKAN di dalam komponen)
  tests/
docs/             # dokumen perencanaan
android/          # dihasilkan Capacitor
```

## 5. Aturan Desain Wajib (berbasis CLT & wawancara)

Setiap fitur/halaman HARUS memenuhi aturan ini. Kode di kurung adalah bukti wawancara.

1. **Satu layar, satu ide.** Maksimal ±40 kata teks penjelasan per layar. Lebih dari itu → pecah menjadi langkah. (EL01, DS03)
2. **Langkah muncul bertahap.** Penyelesaian soal ditampilkan satu langkah per ketukan tombol "Langkah berikutnya", bukan sekaligus. (EL01)
3. **Label menyatu dengan gambar.** Nilai r, α, panjang busur ditulis langsung di dekat bagian gambarnya, bukan di keterangan terpisah (hindari *split-attention*). (EL02)
4. **Kode warna konsisten di seluruh aplikasi:**
   - Busur (garis lengkung) = **oranye** `#F97316`
   - Juring (daerah) = **biru muda** `#38BDF8` (transparan)
   - Jari-jari = **hijau** `#16A34A`
   - Sudut pusat = **ungu** `#9333EA`
   Warna yang sama dipakai di gambar DAN di rumus. (IL01, IL02)
5. **Selalu bedakan busur vs juring** dengan pertanyaan pemandu: "Yang ditanya *panjang* (cm) atau *luas* (cm²)?" (K03, IL01, IL05)
6. **Prasyarat sebelum inti.** Modul unsur lingkaran (jari-jari, diameter, sudut pusat, keliling, luas) dibuka lebih dulu dan dapat diakses kembali kapan saja. (IL03)
7. **Contoh dulu, baru latihan** (worked example → completion problem → soal mandiri). (GL01, GL02)
8. **Umpan balik spesifik kesalahan**, bukan hanya "Benar/Salah". Gunakan `lib/feedback.ts`. (DS02, IL05, GL02)
9. **Soal cerita** selalu menyediakan alat bantu "tandai yang diketahui & ditanya". (EL05)
10. **Tanpa elemen dekoratif yang tidak mengajar**: tanpa animasi latar, maskot bergerak, atau iklan. Lagu latar **hanya di layar menu** (`lib/musik.ts` → `HALAMAN_MENU`); jangan memutarnya di layar belajar. (DS03, prinsip koherensi)
11. **Literasi matematika**: masalah kontekstual mengikuti 5 tahap Pahami → Rumuskan → Hitung → Tafsirkan → Jelaskan (lihat [docs/09-literasi-matematika.md](docs/09-literasi-matematika.md)).

## 6. Aturan Konten Matematika

- Bahasa: **Bahasa Indonesia** baku, kalimat pendek, sapaan "kamu".
- Rumus baku:
  - Panjang busur = (α / 360°) × 2πr
  - Luas juring = (α / 360°) × πr²
- π: gunakan **22/7** bila r kelipatan 7; gunakan **3,14** untuk lainnya. Sebutkan nilai π di setiap soal.
- Desimal ditulis dengan **koma** (12,56), ribuan dengan titik.
- Satuan wajib: panjang → cm/m, luas → cm²/m².
- Semua angka di contoh dan kunci jawaban HARUS dihitung lewat `lib/geometri.ts` dan diuji di `tests/`. Jangan menulis jawaban kunci secara manual tanpa uji.
- Materi selaras Kurikulum Merdeka Fase D (lingkaran).

## 7. Konvensi Kode

- Komponen: PascalCase, satu komponen per file, file `.tsx`.
- Fungsi matematika di `lib/` harus **murni** (tanpa efek samping) dan punya unit test.
- Konten (teks, soal, pembahasan) disimpan di `src/content/`, bukan di-hardcode dalam JSX.
- Target layar utama: **ponsel Android 360×640** (mobile-first). Tombol minimal 44×44 px.
- Aksesibilitas: kontras warna minimal 4.5:1, slider dapat digeser dengan jari dan keyboard, semua gambar SVG punya `aria-label`.
- Data pribadi: siswa **wajib mengisi nama & kelas** di layar awal (`SelamatDatang`), tetapi data itu
  **hanya disimpan di perangkat** (`localStorage`) dan tidak pernah dikirim otomatis ke server mana pun.
  Guru menerimanya hanya bila siswa sendiri membagikan **Kartu Hasil** (`/hasil`). Tidak ada login,
  tidak ada analitik pihak ketiga. Jangan menambah pengiriman data tanpa persetujuan pemilik proyek.
- Komentar kode boleh Bahasa Indonesia atau Inggris, konsisten per file.

## 8. Yang JANGAN Dilakukan

- Jangan menampilkan rumus busur dan juring berdampingan tanpa pembeda visual (warna + ikon garis/daerah).
- Jangan menampilkan seluruh langkah pembahasan sekaligus.
- Jangan menambah library besar (mis. Three.js, Chart.js) untuk simulasi — cukup SVG.
- Jangan membuat fitur yang butuh internet setelah aplikasi terpasang (harus jalan offline).

## 9. Dokumen Terkait

| Dokumen | Isi |
|---|---|
| [docs/01-analisis-kebutuhan.md](docs/01-analisis-kebutuhan.md) | Analisis hasil wawancara & pemetaan ke fitur |
| [docs/02-spesifikasi-produk.md](docs/02-spesifikasi-produk.md) | Fitur, user story, kriteria penerimaan |
| [docs/03-desain-pembelajaran.md](docs/03-desain-pembelajaran.md) | Prinsip CLT & alur belajar |
| [docs/04-konten-materi.md](docs/04-konten-materi.md) | Materi, contoh soal, bank soal, umpan balik |
| [docs/05-arsitektur-teknis.md](docs/05-arsitektur-teknis.md) | Arsitektur, model data, build Android |
| [docs/06-desain-ui-ux.md](docs/06-desain-ui-ux.md) | Wireframe, panduan gaya |
| [docs/07-roadmap.md](docs/07-roadmap.md) | Tahapan & daftar tugas |
| [docs/08-rencana-evaluasi.md](docs/08-rencana-evaluasi.md) | Validasi ahli, uji coba, instrumen beban kognitif |
| [docs/09-literasi-matematika.md](docs/09-literasi-matematika.md) | Kerangka & fitur literasi matematika (PISA/AKM) |
