# 03 — Desain Pembelajaran (Berbasis Teori Beban Kognitif)

## 1. Landasan Teori Singkat

Teori Beban Kognitif (Sweller) menyatakan memori kerja terbatas. Beban belajar terdiri atas:

| Jenis | Definisi | Strategi di aplikasi |
|---|---|---|
| **Intrinsik (IL)** | Kerumitan bawaan materi (jumlah unsur yang harus diolah bersamaan) | **Kelola**: pecah materi, ajarkan prasyarat dulu, naikkan kesulitan bertahap |
| **Ekstrinsik (EL)** | Beban dari penyajian yang kurang baik | **Kurangi**: teks ringkas, gambar jelas, label menyatu, tanpa dekorasi |
| **Germane (GL)** | Upaya membangun skema/pemahaman | **Dorong**: simulasi, contoh bertahap, prediksi, refleksi kesalahan |

Rujukan utama:
- Sweller, J., van Merriënboer, J. J. G., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. *Educational Psychology Review, 31*, 261–292.
- Mayer, R. E. (2021). *Multimedia Learning* (3rd ed.). Cambridge University Press.
- Leppink, J., dkk. (2013). Development of an instrument for measuring different types of cognitive load. *Behavior Research Methods, 45*, 1058–1072.

> Verifikasi kembali detail rujukan (tahun, halaman) di sumber aslinya sebelum dikutip di laporan.

## 2. Prinsip Desain → Penerapan

| Prinsip | Penerapan di aplikasi | Bukti wawancara |
|---|---|---|
| *Pre-training* | Modul F1 unsur lingkaran sebelum rumus | IL03 |
| *Segmenting* | Satu ide per layar; langkah muncul satu per satu | EL01 |
| *Signaling* | Kode warna busur/juring/jari-jari/sudut; pertanyaan "panjang atau luas?" | IL01, K03 |
| *Spatial contiguity* (hindari *split-attention*) | Label nilai diletakkan langsung pada gambar | EL02 |
| *Coherence* | Tanpa ilustrasi/animasi dekoratif | DS03 |
| *Redundancy* | Tidak mengulang teks yang sama dalam narasi dan tulisan | EL01 |
| *Worked example effect* | Contoh soal lengkap sebelum latihan | GL01 |
| *Completion problem & fading* | Contoh → soal melengkapi → soal mandiri | GL02 |
| *Variability of practice* | Variasi angka, konteks, dan tipe soal | GL05, IL04 |
| *Interactivity / prediksi* | Simulasi slider + mode "Tebak dulu" | DS01, IL02 |
| *Feedback elaboratif* | Umpan balik sesuai jenis kesalahan + pembahasan | DS02, IL05 |
| *Expertise reversal* | Siswa yang sudah mahir boleh melewati contoh (tombol "Langsung latihan") | — |

## 3. Alur Belajar

```
[Beranda]
   │
   ▼
1. Pemanasan Unsur Lingkaran (F1)  ── kuis cek cepat
   │
   ▼
2. Busur vs Juring (F2)            ── mini-game "Busur atau Juring?"
   │
   ▼
3. Simulasi Lingkaran (F3)         ── eksplorasi + "Tebak dulu" + "Bandingkan"
   │
   ▼
4. Contoh Soal Bertahap (F4)       ── contoh lengkap → soal melengkapi
   │
   ▼
5. Latihan Level 1 → 2 → 3 (F5)    ── umpan balik + pembahasan
   │
   ▼
6. Soal Cerita Terpandu (F6)
   │
   ▼
[Ringkasan & Refleksi]  "Apa bedanya busur dan juring menurutmu?"
```

Setiap tahap dapat dibuka langsung (tidak terkunci keras) untuk menghormati kemampuan awal siswa,
tetapi beranda menyarankan urutan di atas.

## 4. Urutan Kesulitan (Mengelola Beban Intrinsik)

| Tahap | Unsur yang diolah bersamaan | Contoh |
|---|---|---|
| 1 | Sudut "istimewa" (90°, 180°) → pecahan mudah (¼, ½) | Busur r = 14, α = 90° |
| 2 | Sudut umum (60°, 72°, 120°) | Juring r = 10, α = 72°, π = 3,14 |
| 3 | Diketahui diameter (harus diubah ke r dulu) | d = 28 cm, α = 45° |
| 4 | Soal invers: cari α | Busur 44 cm, r = 21 → α? |
| 5 | Soal invers: cari r | Luas juring 77 cm², α = 45° → r? |
| 6 | Perbandingan dua sudut | α₁ = 60°, busur 10 cm; α₂ = 150° → busur? |
| 7 | Soal cerita (pizza, jam, taman) | Pizza d = 28 cm dibagi 8 |

## 5. Struktur Baku Penyelesaian Soal (dipakai di F4, F5, F6)

1. **Diketahui:** r = …, α = …, π = …
2. **Ditanya:** panjang busur? / luas juring? → *panjang (cm)* atau *luas (cm²)*?
3. **Rumus:** pilih rumus yang sesuai (berwarna).
4. **Substitusi:** masukkan angka.
5. **Hitung:** sederhanakan pecahan sudut dulu (mis. 90/360 = ¼).
6. **Kesimpulan:** tulis jawaban + satuan.

Struktur yang sama di semua soal membentuk **skema** yang dapat ditransfer (GL05).

## 6. Desain Umpan Balik

Tingkatan umpan balik pada setiap soal latihan:

1. **Verifikasi:** "Belum tepat."
2. **Diagnosis kesalahan:** "Sepertinya kamu memakai rumus *luas juring*, padahal yang ditanya *panjang busur*."
3. **Petunjuk:** "Ingat: panjang → pakai keliling (2πr)."
4. **Pembahasan lengkap** (langkah bertahap seperti F4) — hanya jika siswa memintanya atau sudah 2× salah.

Daftar kesalahan umum dan pesannya ada di [04-konten-materi.md](04-konten-materi.md#6-kesalahan-umum--umpan-balik).
