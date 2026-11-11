# 08 — Rencana Evaluasi

Evaluasi menilai tiga kualitas produk: **valid**, **praktis**, dan **efektif**,
ditambah pengukuran **beban kognitif** sebagai fokus penelitian.

## 1. Validasi Ahli

### Ahli Materi (dosen/guru matematika)
Aspek yang dinilai (skala 1–5):
| Aspek | Contoh indikator |
|---|---|
| Kesesuaian kurikulum | Materi sesuai CP/TP Fase D |
| Kebenaran konsep | Definisi busur, juring, sudut pusat tepat; rumus benar |
| Kebenaran perhitungan | Contoh & kunci jawaban benar |
| Penyajian bertahap | Urutan dari prasyarat → konsep → contoh → latihan → soal cerita |
| Kualitas soal | Variasi tingkat kesulitan, konteks soal cerita relevan |
| Umpan balik | Pesan kesalahan tepat dan membantu |

### Ahli Media
| Aspek | Contoh indikator |
|---|---|
| Tampilan | Sederhana, konsisten, kontras jelas |
| Keterbacaan | Ukuran huruf, jumlah teks per layar |
| Gambar & simulasi | Jelas, responsif, label terbaca |
| Navigasi | Mudah dipahami, tombol mudah dijangkau |
| Teknis | Berjalan di web & Android, offline, tanpa galat |

### Analisis
Skor rata-rata = Σ skor / (jumlah butir × skor maksimum) × 100%

| Persentase | Kategori |
|---|---|
| 81–100% | Sangat valid |
| 61–80% | Valid |
| 41–60% | Cukup valid |
| ≤ 40% | Kurang valid (revisi besar) |

> Sesuaikan interval kategori dengan rujukan yang dipakai dosen pembimbing.

## 2. Kepraktisan (Angket Respons Siswa)

Skala Likert 1–5, contoh butir:
1. Tampilan aplikasi sederhana dan tidak membingungkan.
2. Tulisan di setiap layar tidak terlalu banyak.
3. Gambar lingkaran terlihat jelas.
4. Simulasi membantu saya melihat hubungan sudut dengan busur dan juring.
5. Saya bisa membedakan rumus panjang busur dan luas juring.
6. Contoh soal bertahap membantu saya tahu harus mulai dari mana.
7. Pembahasan membantu saya tahu bagian yang salah.
8. Saya bisa belajar sendiri menggunakan aplikasi ini.
9. Aplikasi mudah digunakan di ponsel.
10. Saya ingin menggunakan aplikasi ini lagi.

Butir 1–3 ↔ EL01, EL02, DS03 · butir 4 ↔ IL02, DS01 · butir 5 ↔ IL01 · butir 6 ↔ EL01, GL01 · butir 7–8 ↔ DS02.

## 3. Pengukuran Beban Kognitif

### Instrumen
1. **Skala beban kognitif Leppink dkk. (2013)** — 10 butir, skala 0–10, mengukur IL (3 butir), EL (3 butir), GL (4 butir).
   Terjemahkan dan adaptasi ke Bahasa Indonesia yang mudah dipahami siswa SMP; minta validasi bahasa.
2. **Skala usaha mental Paas (1992)** — 1 butir, skala 1–9 ("Seberapa besar usaha yang kamu keluarkan?"),
   diberikan setelah setiap level latihan.

### Desain
- Opsi sederhana: siswa belajar dengan aplikasi → isi skala beban kognitif → bandingkan dengan skor
  saat belajar dengan LKS (sesi sebelumnya).
- Harapan: **EL turun**, **GL naik**, IL relatif setara (materi sama).

## 4. Keefektifan (Hasil Belajar)

- **Pretest & posttest** 10 soal (paralel), mencakup: busur, juring, cari sudut, cari jari-jari, perbandingan, soal cerita.
- Analisis **N-gain**: g = (posttest − pretest) / (100 − pretest)
  - g ≥ 0,7 tinggi · 0,3 ≤ g < 0,7 sedang · g < 0,3 rendah.
- Analisis jenis kesalahan sebelum dan sesudah (memakai kode E1–E10).

## 5. Wawancara Pasca-Uji Coba

Ulangi pertanyaan wawancara awal (kode K, IL, EL, GL, DS) kepada siswa yang sama (S01 dkk.) untuk melihat
perubahan. Contoh pertanyaan:
- "Sekarang, bagaimana cara kamu menentukan rumus busur atau juring?" (IL01)
- "Apa yang terjadi pada busur jika sudutnya dibuat dua kali lipat?" (IL02)
- "Bagian mana dari aplikasi yang paling membantu? Mana yang membingungkan?" (EL, GL)

## 6. Etika

- Izin sekolah dan persetujuan siswa/orang tua sebelum uji coba.
- Gunakan kode responden (S01, S02, …), bukan nama, dalam laporan.
- Aplikasi meminta **nama & kelas** di awal, hanya disimpan di HP siswa. Siswa mengirim **Kartu Hasil**
  (nama, kelas, modul selesai, skor latihan) kepada guru/peneliti secara sukarela (screenshot/WhatsApp).
  Saat mengolah data, ganti nama menjadi kode responden dan simpan daftar pasangan nama–kode secara terpisah.
- Foto/rekaman hanya dengan izin; samarkan wajah jika dipublikasikan.
