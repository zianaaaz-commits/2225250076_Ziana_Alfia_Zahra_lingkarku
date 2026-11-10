# LingkarKu — Belajar Panjang Busur & Luas Juring

Aplikasi pembelajaran matematika interaktif untuk siswa SMP pada materi
**Panjang Busur dan Luas Juring**, dirancang berdasarkan **Teori Beban Kognitif**
dan untuk menumbuhkembangkan **literasi matematika**.

## 🚀 Coba & pasang (tanpa Play Store / App Store)

| Cara | Langkah |
|---|---|
| **Buka di browser** | **https://zianaaaz-commits.github.io/lingkarku/** (HP, tablet, atau laptop) |
| **Pasang di Android / laptop** | Buka alamat di atas di Chrome → menu ⋮ → **Instal aplikasi** (atau tombol 📲 di aplikasi) |
| **Pasang di iPhone / iPad** | Buka di Safari → **Bagikan** → **Tambahkan ke Layar Utama** |
| **File APK Android** | [Unduh LingkarKu.apk](https://github.com/zianaaaz-commits/lingkarku/releases/latest/download/LingkarKu.apk) → buka di HP → izinkan *Instal aplikasi tidak dikenal* |

Setelah dipasang, aplikasi **tetap berjalan tanpa internet**.

## Mengapa aplikasi ini dibuat?

Hasil wawancara dengan siswa kelas IX menunjukkan bahwa siswa:

- sulit **membedakan rumus panjang busur dan luas juring** karena bentuknya mirip,
- bingung **menghubungkan sudut pusat** dengan busur dan juring,
- kesulitan saat **angka berubah atau sudut belum diketahui**,
- terbebani oleh **teks panjang, langkah panjang, gambar tidak jelas**, dan soal cerita panjang,
- terbantu oleh **gambar lingkaran dan contoh soal**,
- menginginkan **lingkaran yang bisa diubah sudut dan jari-jarinya**, **pembahasan soal**,
  dan **tampilan sederhana**.

## Fitur

1. **Ingat Lagi**: jari-jari, diameter, sudut pusat, keliling, luas + kuis cek cepat.
2. **Busur vs Juring**: pembeda visual (garis oranye vs daerah biru) + permainan.
3. **Simulasi**: geser sudut & jari-jari; mode *Bandingkan* dan *Tebak Dulu*.
4. **Contoh Soal**: 6 contoh langkah demi langkah + soal melengkapi.
5. **Latihan**: 3 level, umpan balik sesuai jenis kesalahan, petunjuk, pembahasan, soal acak.
6. **Soal Cerita**: tandai *Diketahui/Ditanya*, abaikan informasi pengecoh.
7. **Misi Literasi**: 4 masalah kontekstual: Pahami → Rumuskan → Hitung → Tafsirkan → Jelaskan.

Plus: Kartu Rumus, progres tersimpan, lagu latar orisinal (hanya di menu), mode offline.

## Teknologi & bahasa

| Bagian | Bahasa / alat |
|---|---|
| Aplikasi (berjalan di browser & APK) | **JavaScript** (ditulis dalam TypeScript = JavaScript + pengecekan tipe), React, Tailwind CSS, KaTeX, SVG |
| Web terpasang (PWA) & APK | vite-plugin-pwa, Capacitor (Android) |
| Alat bantu & analisis data | **Python 3.13**: lihat tabel di bawah |
| Otomatisasi | GitHub Actions → GitHub Pages (web) & GitHub Releases (APK) |

### Alat Python (`python/`)

| Skrip | Fungsi |
|---|---|
| `buat_lagu.py` | Menyusun lagu latar orisinal (sintesis suara, tanpa hak cipta pihak lain) |
| `periksa_kunci.py` | Memeriksa ulang **semua** kunci jawaban dengan pecahan eksak |
| `analisis_penelitian.py` | Analisis data penelitian: validasi ahli, N-gain, beban kognitif |
| `buat_qr.py` | Kode QR alamat web untuk dibagikan di kelas |
| `buat_kunci_android.py` | Membuat kunci tanda tangan APK (disimpan di luar repo) |

Contoh analisis (data contoh fiktif di `python/data/contoh/`):

```bash
python python/analisis_penelitian.py ngain python/data/contoh/pretest_posttest.csv
python python/analisis_penelitian.py validasi data_validasi.csv --keluaran hasil.csv
```

## Pengembangan

```bash
npm install
npm run dev              # http://localhost:5173
npm test                 # unit test JavaScript
npm run test:python      # unit test Python
npm run periksa:python   # Python memeriksa ulang semua kunci jawaban
npm run build            # hasil web (PWA) di dist/
```

**Rilis APK baru:** buat tag, lalu GitHub Actions membuat APK dan melampirkannya ke Releases.

```bash
git tag v0.2.1 && git push origin v0.2.1
```

## Dokumen Perencanaan

Mulai dari [CLAUDE.md](CLAUDE.md), lalu folder [docs/](docs/):
[Analisis Kebutuhan](docs/01-analisis-kebutuhan.md) ·
[Spesifikasi](docs/02-spesifikasi-produk.md) ·
[Desain Pembelajaran](docs/03-desain-pembelajaran.md) ·
[Konten & Bank Soal](docs/04-konten-materi.md) ·
[Arsitektur](docs/05-arsitektur-teknis.md) ·
[UI/UX](docs/06-desain-ui-ux.md) ·
[Roadmap](docs/07-roadmap.md) ·
[Evaluasi](docs/08-rencana-evaluasi.md) ·
[Literasi Matematika](docs/09-literasi-matematika.md)

## Penyusun

Ziana Alfia Zahra — S1 Pendidikan Matematika, Kelas 3A, NIM 2225250076

## Lisensi

© 2026 Ziana Alfia Zahra. Dirilis dengan [Lisensi MIT](LICENSE): boleh digunakan, diubah,
dan dibagikan, **dengan tetap mencantumkan nama penyusun**.
