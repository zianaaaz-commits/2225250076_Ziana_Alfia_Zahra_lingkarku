# LingkarKu — Belajar Panjang Busur & Luas Juring

Aplikasi pembelajaran matematika interaktif untuk siswa SMP pada materi
**Panjang Busur dan Luas Juring**, dirancang berdasarkan **Teori Beban Kognitif**.
Dapat dijalankan di browser (web/PWA) dan di smartphone Android.

> Status: **versi 0.1 (prototipe lengkap)** — keenam fitur selesai dan teruji; siap divalidasi ahli.
> APK Android perlu dibuat dengan Android Studio (lihat bagian "Membuat APK").

## Menjalankan

```bash
npm install
npm run dev        # buka http://localhost:5173
npm run test       # 120 unit test
npm run build      # hasil web (PWA) di folder dist/
```

## Membuat APK Android

1. Pasang [Android Studio](https://developer.android.com/studio) (sudah termasuk JDK & Android SDK).
2. Jalankan `npm run android:buka` — membangun aplikasi, menyalin ke `android/`, lalu membuka Android Studio.
3. Di Android Studio: **Build ▸ Build App Bundle(s) / APK(s) ▸ Build APK(s)**.
4. APK ada di `android/app/build/outputs/apk/debug/app-debug.apk` — salin ke ponsel untuk dipasang.

Setiap kali kode diubah, jalankan lagi `npm run android` sebelum build ulang di Android Studio.

## Mengapa aplikasi ini dibuat?

Hasil wawancara dengan siswa kelas IX menunjukkan bahwa siswa:

- sulit **membedakan rumus panjang busur dan luas juring** karena bentuknya mirip,
- bingung **menghubungkan sudut pusat** dengan busur dan juring,
- kesulitan saat **angka berubah atau sudut belum diketahui**,
- terbebani oleh **teks panjang, langkah panjang, gambar tidak jelas**, dan soal cerita panjang,
- terbantu oleh **gambar lingkaran dan contoh soal**,
- menginginkan **lingkaran yang bisa diubah sudut dan jari-jarinya**, **pembahasan soal**,
  dan **tampilan sederhana**.

## Fitur Utama (rencana)

1. **Pemanasan Unsur Lingkaran** — jari-jari, diameter, sudut pusat, keliling, luas.
2. **Busur vs Juring** — pembeda visual (garis oranye vs daerah biru).
3. **Simulasi Lingkaran** — geser sudut dan jari-jari, lihat busur & juring berubah langsung.
4. **Contoh Soal Bertahap** — langkah muncul satu per satu.
5. **Latihan + Pembahasan** — umpan balik sesuai jenis kesalahan.
6. **Soal Cerita Terpandu** — tandai "diketahui" dan "ditanya".

## Dokumen Perencanaan

Mulai dari [CLAUDE.md](CLAUDE.md), lalu baca folder [docs/](docs/):

1. [Analisis Kebutuhan](docs/01-analisis-kebutuhan.md)
2. [Spesifikasi Produk](docs/02-spesifikasi-produk.md)
3. [Desain Pembelajaran](docs/03-desain-pembelajaran.md)
4. [Konten Materi & Bank Soal](docs/04-konten-materi.md)
5. [Arsitektur Teknis](docs/05-arsitektur-teknis.md)
6. [Desain UI/UX](docs/06-desain-ui-ux.md)
7. [Roadmap](docs/07-roadmap.md)
8. [Rencana Evaluasi](docs/08-rencana-evaluasi.md)

## Teknologi

React + TypeScript + Vite · Tailwind CSS · KaTeX · SVG · PWA · Capacitor (Android)

## Penyusun

Ziana Alfia Zahra — S1 Pendidikan Matematika, Kelas 3A, NIM 2225250076

## Lisensi

© 2026 Ziana Alfia Zahra. Dirilis dengan [Lisensi MIT](LICENSE): boleh digunakan, diubah,
dan dibagikan, **dengan tetap mencantumkan nama penyusun**.
