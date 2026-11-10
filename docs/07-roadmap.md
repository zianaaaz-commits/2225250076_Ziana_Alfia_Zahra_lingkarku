# 07 — Roadmap & Daftar Tugas

Model pengembangan: **ADDIE** (Analysis – Design – Development – Implementation – Evaluation).
Durasi di bawah adalah perkiraan; sesuaikan dengan jadwal kuliah.

## Tahap A — Analysis (✓ sebagian selesai)
- [x] Wawancara siswa S01 tentang beban kognitif
- [x] Pemetaan temuan ke kebutuhan ([01-analisis-kebutuhan.md](01-analisis-kebutuhan.md))
- [ ] Wawancara tambahan 2–4 siswa dan/atau guru (triangulasi)
- [ ] Analisis kesalahan pada hasil pengerjaan soal siswa
- [ ] Analisis kurikulum (CP/TP Fase D) bersama dosen

## Tahap D1 — Design (± 2 minggu)
- [ ] Finalisasi tujuan pembelajaran & alur ([03-desain-pembelajaran.md](03-desain-pembelajaran.md))
- [ ] Finalisasi konten & bank soal ([04-konten-materi.md](04-konten-materi.md))
- [ ] Wireframe/prototipe di Figma berdasarkan [06-desain-ui-ux.md](06-desain-ui-ux.md)
- [ ] Uji prototipe kertas/Figma ke 1–2 siswa (5–10 menit)
- [ ] Susun instrumen validasi & angket ([08-rencana-evaluasi.md](08-rencana-evaluasi.md))

## Tahap D2 — Development (± 4–6 minggu)

### Sprint 0 — Fondasi ✓ (10 November 2026)
- [x] Inisialisasi proyek Vite + React + TypeScript + Tailwind
- [x] ESLint, Prettier, Vitest
- [x] Routing + layout dasar + Beranda
- [x] `lib/geometri.ts` + unit test
- [x] Bank soal 21 butir (`content/bankSoal.ts`) + uji otomatis seluruh kunci

### Sprint 1 — Simulasi & Konsep ✓ (10 November 2026)
- [x] Komponen `CircleSVG` (busur, juring, label)
- [x] F3 Simulasi (slider, tombol pintas, pilihan π, panel nilai)
- [x] F3 mode "Bandingkan" dan "Tebak dulu"
- [x] F2 Busur vs Juring + mini-game

### Sprint 2 — Prasyarat & Contoh ✓ (10 November 2026)
- [x] F1 Pemanasan unsur lingkaran + kuis cek cepat
- [x] Komponen `StepReveal` + `MathText`
- [x] F4 Contoh bertahap (6 contoh) + soal melengkapi

### Sprint 3 — Latihan & Umpan Balik ✓ (10 November 2026)
- [x] `lib/feedback.ts` (E1–E13) + unit test
- [x] `lib/generator.ts` soal acak + unit test
- [x] `lib/pembahasan.ts` petunjuk & pembahasan otomatis dari data soal
- [x] F5 Latihan 3 level, petunjuk bertingkat, pembahasan
- [x] Uji otomatis seluruh kunci bank soal
- [ ] Penanda level "lulus" disimpan antar-sesi → bersama `progress.ts` di Sprint 4

### Sprint 4 — Soal Cerita & Penyelesaian (10 November 2026)
- [x] F6 Soal cerita terpandu (6 cerita, tandai Diketahui/Ditanya, informasi pengecoh)
- [x] Kartu Rumus, Pengaturan, simpan progres (`lib/progress.ts`, tanda ✓ di Beranda & Latihan)
- [x] PWA (manifest, ikon, offline — 35 berkas di-*precache*)
- [x] Capacitor Android: proyek `android/` + ikon peluncur
- [ ] Build APK debug — perlu Android Studio + JDK 21 (belum terpasang di laptop ini)
- [ ] Uji di minimal 1 ponsel Android nyata

### Sprint 5 — Literasi, Python, Distribusi (10 November 2026)
- [x] Modul **Misi Literasi** (4 misi, 5 tahap PISA/AKM) — [09-literasi-matematika.md](09-literasi-matematika.md)
- [x] Alat Python: lagu latar, pemeriksa kunci, analisis penelitian, QR, kunci APK + unit test
- [x] Lagu latar hanya di layar menu (tombol 🔊/🔇, berhenti saat aplikasi diminimalkan)
- [x] Ponsel: tombol *back* Android, safe-area, tanpa geser samping, header ringkas di 360 px
- [x] Halaman **Pasang Aplikasi** (PWA 1-ketuk, panduan iPhone/laptop, unduh APK, QR)
- [x] GitHub Actions: uji + GitHub Pages (`web.yml`), APK ke Releases (`apk.yml`)
- [ ] Simpan kunci APK ke GitHub Secrets (oleh pemilik repo)
- [ ] Uji APK di HP Android nyata

## Tahap I — Implementation (± 2 minggu)
- [ ] Validasi ahli materi & ahli media → revisi
- [ ] Uji coba perorangan (1–3 siswa) → revisi
- [ ] Uji coba kelompok kecil (6–10 siswa) → revisi
- [ ] (Opsional) Uji coba lapangan satu kelas

## Tahap E — Evaluation
- [ ] Analisis data validitas, praktikalitas, beban kognitif, hasil belajar
- [ ] Revisi akhir & rilis versi 1.0 (web + APK)
- [ ] Penulisan laporan

## Definisi "Selesai" untuk Setiap Fitur
- Memenuhi kriteria penerimaan di [02-spesifikasi-produk.md](02-spesifikasi-produk.md).
- Memenuhi 10 aturan desain di [CLAUDE.md](../CLAUDE.md#5-aturan-desain-wajib-berbasis-clt--wawancara).
- Lulus unit test; tampil benar di layar 360 px dan desktop.
- Semua angka diverifikasi oleh fungsi `lib/geometri.ts`.

## Ide Versi Berikutnya (di luar v1.0)
- Narasi audio singkat (prinsip modalitas) yang bisa dinyalakan/dimatikan.
- Mode guru: kode kelas & rekap hasil (butuh back-end dan izin data).
- Materi lingkaran lain: sudut keliling, garis singgung.
- Rilis ke Google Play Store.
