# 10 — Asisten Belajar "Kak Bulat": AI sebagai Mediator Berpikir Matematis

Dokumen ini menjelaskan desain pedagogis chatbot AI (API DeepSeek) di LingkarKu. Tujuannya bukan
menjawab soal siswa, melainkan **meningkatkan literasi matematika melalui pengelolaan beban kognitif
dengan menerapkan model Rigorous Mathematical Thinking (RMT)**.

> Catatan: tahapan RMT di bawah mengikuti Kinard & Kozulin (2008). Bila ringkasan dari dosen berbeda,
> cukup ubah `FASE_RMT` dan `tentukanFase` di `src/lib/asisten/pedagogi.ts`.

## 1. Peran AI: mediator, bukan pemberi jawaban

Dalam RMT (berakar pada teori Vygotsky & *Mediated Learning Experience* Feuerstein), guru/mediator
membantu siswa membangun **alat kognitif** dan **konsep** melalui pertanyaan, bukan dengan memberi hasil.
Kak Bulat dirancang dengan aturan yang **ditegakkan oleh kode**, bukan sekadar diminta ke AI:

| Aturan | Cara ditegakkan |
|---|---|
| Tidak memberi jawaban akhir | (1) Prompt sistem melarang; (2) kunci jawaban **tidak pernah dikirim ke AI**; (3) **penjaga** di server menyembunyikan angka jawaban akhir bila AI sempat menuliskannya (`jagaJawaban`). |
| Kebenaran jawaban tidak ditebak AI | Status benar/salah & diagnosis kesalahan dihitung aplikasi (`lib/feedback.ts`, kode E1–E13), lalu diberikan ke AI sebagai konteks. |
| Bantuan sesuai kesulitan | 4 tingkat bantuan yang dinaikkan siswa sendiri (tombol "Minta petunjuk berikutnya"). |
| Fokus fase RMT | Ditentukan deterministik dari kondisi siswa (`tentukanFase`) dan ditampilkan di setiap balasan. |

## 2. Tiga fase RMT

| Fase | Nama | Tujuan mediasi | Kapan aktif |
|---|---|---|---|
| 1 | **Pengembangan Alat Kognitif** — *Mengamati & memilah* | Mengamati teliti, memilah diketahui/ditanya/informasi tak perlu, menamai unsur dengan tepat, membandingkan busur (panjang) vs juring (luas) | Awal soal; tahap literasi *Pahami* |
| 2 | **Konten sebagai Proses** — *Membangun konsep* | Siswa membangun sendiri hubungan α/360° sebagai bagian lingkaran; busur ⊂ keliling, juring ⊂ luas; merumuskan aturan dengan kata sendiri | Jawaban salah / ada diagnosis kesalahan, bantuan tingkat ≥ 3, tahap *Rumuskan*/*Hitung* |
| 3 | **Praktik Konstruksi Konseptual** — *Menerapkan & merefleksi* | Menerapkan konsep, memeriksa kewajaran hasil dalam konteks, menafsirkan, menggeneralisasi ("bagaimana jika sudutnya 2×?") | Jawaban sudah benar; tahap *Tafsirkan*/*Jelaskan* |

## 3. Bantuan bertingkat (sesuai kesulitan siswa)

| Tingkat | Bentuk | Contoh perilaku AI |
|---|---|---|
| 1 | Pertanyaan pemandu | "Informasi apa yang kamu temukan? Yang ditanya panjang atau luas?" — tanpa rumus |
| 2 | Petunjuk konsep | Mengingatkan $\frac{\alpha}{360^\circ} \times 2\pi r$, bertanya cara memakainya — tanpa angka soal |
| 3 | Petunjuk langkah | Menunjukkan satu langkah parsial (mis. $\frac{90}{360} = \frac14$), siswa melanjutkan |
| 4 | Contoh serupa | Penyelesaian singkat soal serupa **dengan angka berbeda**, siswa meniru (*worked example effect*) |

## 4. Pengelolaan beban kognitif dalam percakapan

| Jenis beban | Strategi di prompt & antarmuka |
|---|---|
| **Ekstrinsik** ↓ | Balasan ≤ 60 kata, satu langkah & satu pertanyaan per balasan, tanpa judul/daftar panjang; rumus dirender rapi (KaTeX); panel bisa ditutup kapan saja |
| **Intrinsik** (dikelola) | Jika siswa bingung/salah berulang → masalah dipecah lebih kecil; istilah konsisten (busur = panjang, juring = luas); fase disesuaikan |
| **Germane** ↑ | AI meminta siswa menjelaskan alasan, membandingkan, memprediksi; membangun dari jawaban siswa sebelumnya; refleksi di fase 3 |

## 5. Integrasi dengan literasi matematika

Kak Bulat tersedia di setiap kegiatan dan menerima konteksnya otomatis:

| Tempat | Konteks yang dikirim | Tahap literasi |
|---|---|---|
| Latihan (3 level) | soal, π, jawaban, status, diagnosis E1–E13 | Hitung |
| Soal Cerita | cerita utuh (termasuk informasi pengecoh) | Pahami → Rumuskan → Hitung |
| Misi Literasi | cerita + data + pertanyaan langkah | Pahami / Rumuskan / Hitung / Tafsirkan / Jelaskan |
| Soal melengkapi | soal | Hitung |
| Halaman Asisten | — (pertanyaan umum) | — |

## 6. Keamanan & privasi

- Penyedia AI dapat dipilih tanpa mengubah aplikasi: **DeepSeek** (bawaan, berbayar sangat murah),
  **OpenRouter** (model DeepSeek `:free`, gratis dengan kuota harian), atau **Gemini** (gratis, bukan DeepSeek).
  Desain pedagogis (prompt, fase, penjaga) sama untuk semua penyedia.
- API key hanya di server Cloudflare Worker (`server/asisten/`), tidak di aplikasi publik.
- Hanya aplikasi LingkarKu yang boleh memakai server; 20 pesan/menit per IP; maks. 800 karakter per pesan.
- **Nama & kelas siswa tidak dikirim.** Server tidak menyimpan percakapan.
- Asisten butuh internet; seluruh fitur lain tetap berjalan offline.

## 7. Usulan pengumpulan data penelitian

- Amati/rekam layar beberapa sesi: berapa tingkat bantuan yang dipakai sebelum siswa benar.
- Wawancara pasca-pakai: "Apakah Kak Bulat membantumu berpikir, atau kamu ingin langsung jawaban?"
- Bandingkan skor beban kognitif (Leppink) kelompok yang memakai vs tidak memakai asisten.

## Rujukan

- Kinard, J. T., & Kozulin, A. (2008). *Rigorous Mathematical Thinking: Conceptual Formation in the Mathematics Classroom*. Cambridge University Press.
- Sweller, J., van Merriënboer, J. J. G., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. *Educational Psychology Review, 31*, 261–292.
- OECD (2023). *PISA 2022 Assessment and Analytical Framework*.

> Verifikasi detail rujukan pada sumber aslinya sebelum dikutip.
