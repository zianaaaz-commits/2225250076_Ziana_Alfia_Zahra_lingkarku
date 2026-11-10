# 04 — Konten Materi, Contoh Soal, dan Bank Soal

Semua angka di dokumen ini wajib diverifikasi ulang oleh `src/lib/geometri.ts` + unit test
sebelum dimasukkan ke aplikasi, dan divalidasi oleh ahli materi.

## 1. Capaian & Tujuan

- **Fase:** D (SMP), elemen Geometri — lingkaran.
- **Tujuan pembelajaran:** lihat [02-spesifikasi-produk.md](02-spesifikasi-produk.md#tujuan-pembelajaran).

## 2. Materi Prasyarat (F1)

| Kartu | Isi singkat (maks. 2 kalimat) |
|---|---|
| Titik pusat | Titik di tengah lingkaran. Semua titik pada lingkaran berjarak sama dari titik pusat. |
| Jari-jari (r) | Garis dari titik pusat ke lingkaran. |
| Diameter (d) | Garis melewati titik pusat, dari tepi ke tepi. **d = 2r**, jadi **r = d ÷ 2**. |
| Sudut pusat (α) | Sudut yang titik sudutnya di titik pusat, diapit dua jari-jari. Satu putaran penuh = 360°. |
| Keliling & luas | Keliling = 2πr (panjang tepi). Luas = πr² (daerah di dalam). |

Soal cek cepat (contoh):
1. Diameter 20 cm, jari-jarinya? → **10 cm**
2. Jari-jari 7 cm, diameternya? → **14 cm**
3. Satu putaran penuh = …° → **360°**
4. Keliling lingkaran r = 7, π = 22/7 → **44 cm**
5. Luas lingkaran r = 10, π = 3,14 → **314 cm²**

## 3. Konsep Inti (F2)

| | **Busur** | **Juring** |
|---|---|---|
| Apa itu? | **Garis lengkung** bagian dari tepi lingkaran | **Daerah** yang dibatasi dua jari-jari dan satu busur |
| Analogi | Pinggiran roti pada sepotong pizza | Sepotong pizza |
| Bagian dari | Keliling (2πr) | Luas (πr²) |
| Satuan | cm, m (panjang) | cm², m² (luas) |
| Warna di aplikasi | Oranye (garis) | Biru muda (daerah) |
| Rumus | **(α/360°) × 2πr** | **(α/360°) × πr²** |

**Kunci pembeda:** keduanya sama-sama dikali pecahan sudut **α/360°**.
Yang membedakan hanya **"bagian dari keliling"** atau **"bagian dari luas"**.

**Hubungan sudut pusat (IL02):** panjang busur dan luas juring **sebanding** dengan sudut pusat.

  busur₁ : busur₂ = α₁ : α₂  dan  juring₁ : juring₂ = α₁ : α₂

Sudut 2× lebih besar → busur 2× lebih panjang dan juring 2× lebih luas.

**Pecahan sudut istimewa:**

| α | 30° | 45° | 60° | 72° | 90° | 120° | 180° |
|---|---|---|---|---|---|---|---|
| α/360° | 1/12 | 1/8 | 1/6 | 1/5 | 1/4 | 1/3 | 1/2 |

## 4. Contoh Soal Bertahap (F4)

### Contoh 1 — Panjang busur
r = 14 cm, α = 90°, π = 22/7. Tentukan panjang busur.
1. Diketahui: r = 14 cm, α = 90°, π = 22/7
2. Ditanya: panjang busur → **panjang** → pakai keliling
3. Rumus: (α/360°) × 2πr
4. Substitusi: (90/360) × 2 × 22/7 × 14
5. Hitung: ¼ × 88 = 22
6. Jadi panjang busur = **22 cm**

### Contoh 2 — Luas juring
r = 10 cm, α = 72°, π = 3,14. Tentukan luas juring.
1. Diketahui: r = 10 cm, α = 72°, π = 3,14
2. Ditanya: luas juring → **luas** → pakai luas lingkaran
3. Rumus: (α/360°) × πr²
4. Substitusi: (72/360) × 3,14 × 10 × 10
5. Hitung: 1/5 × 314 = 62,8
6. Jadi luas juring = **62,8 cm²**

### Contoh 3 — Mencari sudut pusat (IL04)
Panjang busur 44 cm, r = 21 cm, π = 22/7. Tentukan sudut pusat.
1. Diketahui: busur = 44 cm, r = 21 cm
2. Ditanya: α
3. Rumus: busur = (α/360°) × 2πr
4. Keliling = 2 × 22/7 × 21 = 132 cm
5. 44 = (α/360°) × 132 → α/360° = 44/132 = 1/3 → α = 120°
6. Jadi sudut pusat = **120°**

### Contoh 4 — Mencari jari-jari (IL04)
Luas juring 77 cm², α = 45°, π = 22/7. Tentukan jari-jari.
1. Diketahui: luas juring = 77 cm², α = 45°
2. Ditanya: r
3. Rumus: luas juring = (α/360°) × πr²
4. 77 = 1/8 × 22/7 × r² → 22/7 × r² = 616 → r² = 196
5. r = √196 = 14
6. Jadi jari-jari = **14 cm**

### Contoh 5 — Perbandingan (IL02)
∠AOB = 60°, panjang busur AB = 10 cm. ∠COD = 150°. Tentukan panjang busur CD.
1. Busur CD : busur AB = ∠COD : ∠AOB
2. Busur CD / 10 = 150/60
3. Busur CD = 10 × 2,5 = **25 cm**

### Contoh 6 — Soal cerita (EL05)
Sebuah pizza berdiameter 28 cm dipotong menjadi 8 bagian sama besar. Berapa luas satu potong? (π = 22/7)
1. **Diketahui:** d = 28 cm → r = 14 cm; 8 potong sama besar → α = 360° ÷ 8 = 45°
2. **Ditanya:** luas satu potong → **luas juring**
3. Rumus: (α/360°) × πr²
4. (45/360) × 22/7 × 14 × 14 = 1/8 × 616
5. = 77
6. Jadi luas satu potong pizza = **77 cm²**

## 5. Bank Soal Latihan (F5)

π = 22/7 kecuali disebut lain. Kunci wajib diuji ulang lewat kode.

### Level 1 — Hitung langsung
| No | Soal | Kunci |
|---|---|---|
| 1 | r = 7 cm, α = 90°. Panjang busur? | 11 cm |
| 2 | r = 7 cm, α = 90°. Luas juring? | 38,5 cm² |
| 3 | r = 21 cm, α = 60°. Panjang busur? | 22 cm |
| 4 | r = 21 cm, α = 60°. Luas juring? | 231 cm² |
| 5 | r = 10 cm, α = 36°, π = 3,14. Panjang busur? | 6,28 cm |
| 6 | r = 10 cm, α = 36°, π = 3,14. Luas juring? | 31,4 cm² |
| 7 | r = 20 cm, α = 90°, π = 3,14. Luas juring? | 314 cm² |
| 8 | d = 28 cm, α = 45°. Panjang busur? | 11 cm |
| 9 | r = 14 cm, α = 180°. Luas juring? | 308 cm² |

### Level 2 — Invers & perbandingan
| No | Soal | Kunci |
|---|---|---|
| 10 | Panjang busur 44 cm, r = 21 cm. Sudut pusat? | 120° |
| 11 | Luas juring 77 cm², α = 45°. Jari-jari? | 14 cm |
| 12 | Panjang busur 22 cm, α = 90°. Jari-jari? | 14 cm |
| 13 | Luas juring 231 cm², r = 21 cm. Sudut pusat? | 60° |
| 14 | ∠AOB = 60°, busur AB = 10 cm, ∠COD = 150°. Busur CD? | 25 cm |
| 15 | ∠POQ = 40°, juring POQ = 24 cm², ∠ROS = 120°. Juring ROS? | 72 cm² |

### Level 3 — Soal cerita
| No | Soal | Kunci |
|---|---|---|
| 16 | Pizza d = 28 cm dibagi 8 sama besar. Panjang pinggiran satu potong (busur)? | 11 cm |
| 17 | Jarum menit panjangnya 7 cm. Dalam 15 menit, ujung jarum menempuh lintasan sepanjang? | 11 cm (α = 90°) |
| 18 | Taman berbentuk juring, r = 14 m, α = 90°. Luas taman? | 154 m² |
| 19 | Taman no. 18 akan dipagari sekelilingnya (busur + 2 jari-jari). Panjang pagar? | 22 + 28 = 50 m |
| 20 | Alat penyiram berputar 120° dengan jangkauan 21 m. Luas daerah yang tersiram? | 462 m² |
| 21 | Bandul bertali 30 cm berayun membentuk sudut 60°. Panjang lintasan ujung bandul? (π = 3,14) | 31,4 cm |

### Template soal acak (untuk variasi, GL05)
- Pilih r dari {7, 14, 21, 28} dengan π = 22/7, atau dari {10, 20, 30} dengan π = 3,14.
- Pilih α dari {30, 45, 60, 72, 90, 120, 180, 270}.
- Hanya terima kombinasi yang menghasilkan angka bulat atau maksimal 2 angka desimal.

## 6. Kesalahan Umum & Umpan Balik

Mesin umpan balik (`src/lib/feedback.ts`) menghitung jawaban "salah yang khas" lalu mencocokkannya
dengan jawaban siswa (toleransi ±0,01). Urutan pengecekan sesuai tabel.

| Kode | Kesalahan | Cara deteksi (untuk soal busur/juring) | Pesan umpan balik |
|---|---|---|---|
| E1 | Rumus tertukar (busur ↔ juring) | Jawaban = hasil rumus lainnya | "Kamu memakai rumus **luas juring**, padahal yang ditanya **panjang busur**. Panjang → pakai keliling 2πr." (dan sebaliknya) |
| E2 | Diameter dipakai sebagai jari-jari | Soal memberi d, dan jawaban = hasil dengan r = d | "Yang diketahui **diameter**. Ubah dulu: r = d ÷ 2." |
| E3 | Lupa mengalikan pecahan sudut | Jawaban = keliling/luas lingkaran penuh | "Itu keliling/luas **seluruh** lingkaran. Busur/juring hanya bagian α/360° saja." |
| E4 | Membagi dengan 180°, bukan 360° | Jawaban = 2 × jawaban benar (soal tanpa diameter) | "Satu putaran penuh = **360°**, bukan 180°." |
| E5 | Busur memakai πr (tanpa 2) | Jawaban = ½ × busur benar | "Keliling lingkaran = **2**πr. Cek apakah angka 2 terlewat." |
| E6 | Juring memakai πd atau 2πr² | Jawaban = hasil rumus salah tsb. | "Luas lingkaran = πr² (r dikuadratkan, tanpa dikali 2)." |
| E7 | Soal cari α: lupa × 360° | Jawaban = α/360 (mis. 0,33) | "Itu baru **pecahannya**. Kalikan dengan 360° untuk mendapat sudutnya." |
| E8 | Soal cari r: lupa akar | Jawaban = r² | "Itu nilai **r²**. Tarik akar kuadratnya untuk mendapat r." |
| E9 | Nilai π berbeda | Jawaban cocok bila π lain dipakai | "Hampir benar! Soal ini memakai π = …" |
| E10 | Pembulatan | Selisih ≤ 0,1 | "Hampir tepat. Cek lagi pembulatanmu." |
| E11 | Keliling juring tanpa 2 jari-jari | Jawaban = busur, atau busur + r | "Itu baru panjang busurnya. Keliling juring = busur + 2 jari-jari." |
| E12 | Menjawab diameter, bukan jari-jari | Jawaban = 2r (soal cari r) | "Itu diameter. Yang ditanya jari-jari: r = d ÷ 2." |
| E13 | Perbandingan terbalik | Jawaban = nilai₁ × α₁/α₂ | "Perbandingannya terbalik. Sudut lebih besar → hasilnya juga lebih besar." |
| — | Tidak terdeteksi | — | "Belum tepat. Coba Petunjuk 1: yang ditanya panjang atau luas?" |

Catatan: E2 dan E4 sama-sama menghasilkan 2× jawaban busur. Jika soal memberi diameter, prioritaskan E2.
Pada soal juring, E4 dan E6 sama-sama menghasilkan 2× jawaban, sehingga digabung dalam satu pesan (E6).
Jawaban dalam toleransi ±0,01 dinilai benar; akibatnya, pada soal dengan hasil kecil, jawaban yang memakai
π lain (mis. 10,99 untuk 11) juga dinilai benar karena selisihnya hanya sebesar pembulatan.
Perkaya daftar ini dengan menganalisis hasil pengerjaan siswa (dokumentasi wawancara No. 2).
