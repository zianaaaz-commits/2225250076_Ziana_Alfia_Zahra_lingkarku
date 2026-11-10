# 06 — Desain UI/UX

## 1. Prinsip Tampilan (dari DS03, EL01, EL02)

1. **Sederhana:** latar putih/terang, satu kolom, satu ide per layar.
2. **Sedikit teks:** maksimal ±40 kata penjelasan per layar; kalimat ≤ 15 kata.
3. **Gambar besar & jelas:** lingkaran SVG minimal 70% lebar layar ponsel.
4. **Label di dalam gambar**, bukan di keterangan terpisah.
5. **Navigasi tetap:** tombol "Kembali" di kiri atas, tombol aksi utama besar di bawah (jangkauan jempol).

## 2. Panduan Gaya

### Warna
| Peran | Warna | Hex |
|---|---|---|
| Busur | Oranye | `#F97316` |
| Juring | Biru muda (isi 35% transparan) | `#38BDF8` |
| Jari-jari | Hijau | `#16A34A` |
| Sudut pusat | Ungu | `#9333EA` |
| Teks utama | Abu gelap | `#1F2937` |
| Latar | Putih | `#FFFFFF` |
| Benar | Hijau | `#15803D` |
| Belum tepat | Merah lembut | `#DC2626` |
| Aksi utama | Biru | `#2563EB` |

Untuk **tulisan** berwarna dipakai versi lebih gelap agar kontras ≥ 4.5:1 di latar putih:
busur `#C2410C`, juring `#0369A1`, jari-jari `#15803D`, sudut `#7E22CE` (lihat `src/lib/warna.ts`).

Warna merah hanya untuk ikon/garis tepi umpan balik, bukan seluruh layar (agar tidak menakutkan).
Selain warna, gunakan juga **bentuk/ikon** (garis vs daerah) agar ramah buta warna.

### Tipografi
- Font: **Nunito** atau **Poppins** (ramah anak, terbaca jelas); fallback `system-ui`.
- Ukuran: isi 16–18 px, judul 22–24 px, angka di gambar 16 px tebal.
- Opsi "Huruf besar" menaikkan semua ukuran ±20%.

### Komponen
- Tombol utama: tinggi 48 px, sudut membulat 12 px, teks kata kerja ("Coba", "Langkah berikutnya").
- Kartu: latar putih, bayangan tipis, padding 16 px.
- Ikon: sederhana garis (mis. Lucide), tanpa ikon dekoratif berlebihan.

## 3. Peta Layar

```
Beranda
 ├── 1 Ingat Lagi (Unsur Lingkaran)
 ├── 2 Busur vs Juring
 ├── 3 Simulasi
 ├── 4 Contoh Soal
 ├── 5 Latihan (Level 1 · 2 · 3)
 ├── 6 Soal Cerita
 ├── Kartu Rumus (pop-up dari mana saja)
 └── Pengaturan
```

## 4. Wireframe (ponsel 360 px)

### Beranda
```
┌──────────────────────────┐
│ LingkarKu         ⚙      │
│ Busur & Juring           │
├──────────────────────────┤
│ ✓ 1 Ingat Lagi           │
│ ✓ 2 Busur vs Juring      │
│ ▶ 3 Simulasi    (lanjut) │
│ ○ 4 Contoh Soal          │
│ ○ 5 Latihan              │
│ ○ 6 Soal Cerita          │
├──────────────────────────┤
│ [  📘 Kartu Rumus  ]     │
└──────────────────────────┘
```

### Busur vs Juring
```
┌──────────────────────────┐
│ ←  Busur vs Juring       │
├────────────┬─────────────┤
│   ╭──╮     │    ◔        │
│  (oranye)  │  (biru)     │
│  BUSUR     │  JURING     │
│  = garis   │  = daerah   │
│  panjang   │  luas       │
│  cm        │  cm²        │
├────────────┴─────────────┤
│ Busur = α/360° × 2πr     │
│ Juring = α/360° × πr²    │
├──────────────────────────┤
│ [   Main: Busur/Juring? ]│
└──────────────────────────┘
```

### Simulasi
```
┌──────────────────────────┐
│ ←  Simulasi    [Bandingkan]
│                          │
│        ╭─────╮           │
│      ╱  α=90°  ╲         │
│     │  ●──r=14──┤        │
│      ╲  juring ╱         │
│        ╰─busur╯          │
│                          │
│ Sudut α  [====●-----] 90°│
│ [30][45][60][90][120][180]
│ Jari r   [===●------] 14 │
│ π: (•)22/7  ( )3,14      │
├──────────────────────────┤
│ α/360° = 90/360 = 1/4    │
│ Busur = 1/4 × 88 = 22 cm │
│ Juring= 1/4 × 616 = 154 cm²
└──────────────────────────┘
```

### Contoh Soal Bertahap
```
┌──────────────────────────┐
│ ←  Contoh 1 dari 6       │
│ [ gambar lingkaran r,α ] │  ← tetap terlihat
├──────────────────────────┤
│ ① Diketahui: r=14, α=90° │
│ ② Ditanya: panjang busur │
│    → PANJANG → keliling  │
│ ③ ...(belum muncul)      │
├──────────────────────────┤
│ [◀ Kembali] [Berikutnya ▶]
└──────────────────────────┘
```

### Latihan + Umpan Balik
```
┌──────────────────────────┐
│ ← Latihan Level 1   3/9  │
│ [ gambar soal ]          │
│ r = 7 cm, α = 90°.       │
│ Panjang busur = ?        │
│ ┌──────────┐ cm          │
│ │  38,5    │             │
│ └──────────┘             │
│ [      Periksa       ]   │
├──────────────────────────┤
│ ✗ Belum tepat            │
│ Kamu memakai rumus LUAS  │
│ JURING. Yang ditanya     │
│ PANJANG busur → 2πr.     │
│ [Petunjuk] [Contoh serupa]
│ [Lihat pembahasan]       │
└──────────────────────────┘
```

### Soal Cerita Terpandu
```
┌──────────────────────────┐
│ ← Soal Cerita            │
│ Sebuah pizza berdiameter │
│ [28 cm] dipotong menjadi │
│ [8 bagian] sama besar.   │
│ Berapa [luas] satu potong?│
│ (ketuk kata untuk tandai)│
├──────────────────────────┤
│ Diketahui: d=28 → r=14   │
│            8 bagian→α=45°│
│ Ditanya  : luas → JURING │
│ [Ubah jadi gambar]       │
│ [ Lanjut menghitung ]    │
└──────────────────────────┘
```

## 5. Interaksi & Animasi

- Animasi hanya untuk **menjelaskan** (mis. juring "tumbuh" saat sudut berubah), durasi ≤ 300 ms.
- Hormati pengaturan `prefers-reduced-motion`.
- Tanpa suara otomatis.
- Umpan balik benar: centang hijau + kalimat singkat ("Tepat! Panjang → keliling."), tanpa konfeti berlebihan.

## 6. Daftar Cek Kegunaan

- [ ] Bisa dipakai satu tangan pada ponsel 360 px.
- [ ] Tidak ada gulir horizontal.
- [ ] Setiap layar ≤ 40 kata penjelasan.
- [ ] Busur selalu oranye, juring selalu biru, di semua layar.
- [ ] Label angka berada di dekat bagian gambarnya.
- [ ] Siswa uji coba dapat menemukan "Pembahasan" tanpa bantuan.
