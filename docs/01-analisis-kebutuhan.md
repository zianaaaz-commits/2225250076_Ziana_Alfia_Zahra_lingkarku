# 01 — Analisis Kebutuhan

Dokumen ini mengolah hasil wawancara menjadi kebutuhan aplikasi.

## 1. Identitas Wawancara

| Keterangan | Isi |
|---|---|
| Kode siswa | S01 |
| Kelas | IX |
| Tanggal | 6 November 2026 |
| Pewawancara | Ziana Alfia Zahra |
| Materi | Panjang Busur dan Luas Juring (dipelajari di kelas VIII) |
| Bukti belajar | LKS dari sekolah |
| Durasi | 30 menit, direkam dengan persetujuan siswa |
| Artefak pemicu | LKS dan contoh soal |

## 2. Kategori Kode

| Kode | Makna | Fokus |
|---|---|---|
| **K** | Konteks / pengalaman belajar sebelumnya | Bagaimana siswa dulu belajar materi |
| **IL** | *Intrinsic Load* (beban intrinsik) | Kesulitan yang berasal dari kerumitan materi itu sendiri |
| **EL** | *Extraneous Load* (beban ekstrinsik) | Kesulitan akibat cara penyajian materi |
| **GL** | *Germane Load* (beban germane) | Upaya/strategi yang membantu membangun pemahaman |
| **DS** | Desain / saran aplikasi | Harapan siswa terhadap aplikasi |

## 3. Ringkasan Temuan per Kategori

### K — Konteks belajar
- Materi dipelajari di kelas VIII melalui **penjelasan rumus di papan tulis lalu latihan dari buku** (K01, K02).
- Siswa sudah bisa **mengenali jari-jari dan sudut pusat** dalam soal, tetapi **ragu memilih rumus** busur atau juring (K03).

### IL — Beban intrinsik (kerumitan materi)
- Rumus busur dan juring **bentuknya mirip** → sulit dibedakan (IL01).
- **Hubungan sudut pusat** dengan busur/juring belum dipahami; saat sudut berubah, sering salah hitung (IL02).
- Siswa menyadari perlu **paham jari-jari, diameter, dan sudut dulu** (IL03) → kebutuhan materi prasyarat.
- Bingung bila **angka berbeda** dan **sudut belum diketahui** (soal invers) (IL04).
- Sering **salah memilih rumus dan salah menghitung** (IL05).

### EL — Beban ekstrinsik (penyajian)
- **Teks terlalu banyak dan langkah panjang** → bingung mulai dari mana (EL01).
- **Gambar di buku kurang jelas** (EL02).
- **Soal cerita panjang** sulit dipahami maksudnya (EL05).

### GL — Beban germane (strategi yang membantu)
- Lebih paham bila **ada gambar lingkaran** dan **contoh soal lebih dulu** (GL01).
- Memperbaiki kesalahan dengan **melihat contoh lagi dan menghitung ulang** (GL02).
- Mampu **mentransfer** pola dari soal sebelumnya ke soal baru (GL05).

### DS — Harapan terhadap aplikasi
- **Lingkaran yang bisa diubah sudut dan jari-jarinya** (DS01).
- **Simulasi dan pembahasan soal** agar bisa belajar mandiri dan tahu letak kesalahan (DS02).
- **Sedikit tulisan, tampilan sederhana** (DS03).

## 4. Matriks Temuan → Kebutuhan → Fitur

| Kode | Masalah / Harapan | Kebutuhan | Fitur Aplikasi |
|---|---|---|---|
| K03, IL01, IL05 | Ragu memilih rumus busur atau juring | Pembeda konsep yang sangat jelas | **F2 Busur vs Juring** + pertanyaan pemandu "panjang atau luas?" |
| IL02 | Hubungan sudut pusat belum dipahami | Melihat perubahan secara langsung | **F3 Simulasi Lingkaran** + mode perbandingan dua sudut |
| IL03 | Butuh paham unsur lingkaran dulu | Materi prasyarat | **F1 Pemanasan Unsur Lingkaran** |
| IL04 | Bingung jika sudut/jari-jari belum diketahui | Latihan soal invers bertahap | **F5 Latihan** tipe "cari sudut" & "cari jari-jari" |
| IL05, DS02, GL02 | Salah hitung, ingin tahu bagian yang salah | Umpan balik spesifik | **F5 Latihan** + mesin umpan balik kesalahan umum |
| EL01, DS03 | Teks & langkah terlalu panjang | Penyajian bertahap, ringkas | Aturan "satu layar satu ide" + **F4 Contoh Bertahap** |
| EL02 | Gambar kurang jelas | Gambar tajam, label menyatu | Semua gambar SVG, label di dalam gambar, kode warna |
| EL05 | Soal cerita panjang | Bantuan mengekstrak informasi | **F6 Soal Cerita Terpandu** (tandai diketahui/ditanya) |
| GL01 | Terbantu gambar & contoh | Contoh soal sebelum latihan | **F4 Contoh Bertahap** sebelum **F5** |
| GL02 | Melihat contoh lagi untuk memperbaiki | Akses cepat ke contoh terkait | Tombol "Lihat contoh serupa" di layar latihan |
| GL05 | Mentransfer pola ke soal baru | Variasi konteks soal | Bank soal bervariasi (angka, konteks, tipe) |
| DS01 | Ingin lingkaran yang bisa diubah | Simulasi interaktif | **F3 Simulasi Lingkaran** |

## 5. Persona Pengguna

**Nama:** Siswa SMP kelas VIII–IX (representasi S01)
- Belajar dengan LKS; terbiasa dengan pola "rumus → latihan".
- Mengenali unsur soal, tetapi kurang yakin memilih rumus.
- Mudah kewalahan oleh teks panjang.
- Menggunakan ponsel Android; kuota/internet bisa terbatas.
- Ingin belajar mandiri dan tahu letak kesalahannya.

## 6. Catatan Metodologis

- Data berasal dari **satu siswa (S01)**. Disarankan menambah 2–4 responden (kemampuan tinggi/sedang/rendah)
  dan/atau wawancara guru untuk **triangulasi** sebelum desain final.
- Penomoran kode tidak berurutan (EL03, EL04, GL03, GL04 tidak ada). Jika ada pertanyaan yang tidak dijawab
  atau dihapus, catat alasannya di lampiran agar penelusuran data tetap jelas.
- Rekomendasi tambahan: kumpulkan **hasil pengerjaan soal siswa** (sudah ada di dokumentasi) dan analisis
  jenis kesalahannya untuk memperkaya daftar kesalahan umum di [04-konten-materi.md](04-konten-materi.md).
