# 02 — Spesifikasi Produk (PRD)

## 1. Tujuan Produk

Membantu siswa SMP memahami dan menyelesaikan soal **panjang busur dan luas juring**
secara mandiri dengan beban kognitif yang terkelola.

### Tujuan Pembelajaran
Setelah menggunakan aplikasi, siswa mampu:
1. Menyebutkan unsur lingkaran: jari-jari, diameter, sudut pusat, busur, juring.
2. Membedakan busur (panjang) dan juring (luas).
3. Menjelaskan hubungan sudut pusat dengan panjang busur dan luas juring (sebanding).
4. Menghitung panjang busur dan luas juring.
5. Menentukan sudut pusat atau jari-jari jika panjang busur/luas juring diketahui.
6. Menyelesaikan soal cerita yang berkaitan dengan busur dan juring.

## 2. Ruang Lingkup

**Termasuk (versi 1.0):** 6 fitur di bawah, berjalan offline, web + Android, Bahasa Indonesia.

**Tidak termasuk (versi 1.0):** login/akun, dasbor guru, sinkronisasi cloud, papan peringkat,
materi lingkaran lain (garis singgung, sudut keliling) — dapat dipertimbangkan untuk versi berikutnya.

## 3. Fitur & User Story

### F1 — Pemanasan Unsur Lingkaran *(IL03)*
> Sebagai siswa, saya ingin mengingat kembali jari-jari, diameter, dan sudut pusat agar siap memakai rumus.

Kriteria penerimaan:
- [ ] 5 kartu singkat: titik pusat, jari-jari, diameter (= 2r), sudut pusat, keliling & luas lingkaran.
- [ ] Setiap kartu: 1 gambar SVG + maks. 2 kalimat.
- [ ] 5 soal cek cepat (pilihan ganda) dengan umpan balik langsung.
- [ ] Dapat dibuka kembali dari menu mana pun (tombol "Ingat lagi").

### F2 — Busur vs Juring *(K03, IL01, IL05)*
> Sebagai siswa, saya ingin tahu bedanya busur dan juring agar tidak salah memilih rumus.

Kriteria penerimaan:
- [ ] Tampilan berdampingan: busur = **garis lengkung oranye**, juring = **daerah biru**.
- [ ] Rumus ditulis dengan warna yang sama dengan gambarnya.
- [ ] Penjelasan analogi: busur = "pinggiran potongan pizza", juring = "potongan pizza".
- [ ] Kedua rumus diturunkan dari keliling/luas lingkaran × (α/360°), ditunjukkan bertahap.
- [ ] Mini-game "Busur atau Juring?" (10 pernyataan/gambar, siswa memilih).

### F3 — Simulasi Lingkaran *(DS01, IL02, GL01)*
> Sebagai siswa, saya ingin mengubah sudut dan jari-jari lingkaran agar melihat perubahan busur dan juring.

Kriteria penerimaan:
- [ ] Slider sudut pusat 0°–360° (langkah 1°, tombol pintas 30°, 45°, 60°, 90°, 120°, 180°).
- [ ] Slider jari-jari 1–21 (langkah 1).
- [ ] Pilihan π: 22/7 atau 3,14.
- [ ] Gambar busur & juring diperbarui seketika (< 50 ms).
- [ ] Panel nilai: pecahan α/360°, panjang busur, luas juring, dengan substitusi angka yang tampil.
- [ ] Mode **"Bandingkan"**: dua juring berdampingan untuk menunjukkan "sudut 2× → busur 2×, luas 2×".
- [ ] Mode **"Tebak dulu"**: siswa menebak nilai sebelum ditampilkan (prediksi → cek).

### F4 — Contoh Soal Bertahap *(GL01, GL02, EL01)*
> Sebagai siswa, saya ingin melihat contoh penyelesaian langkah demi langkah agar tahu harus mulai dari mana.

Kriteria penerimaan:
- [ ] Langkah baku: **Diketahui → Ditanya → Pilih rumus → Substitusi → Hitung → Kesimpulan + satuan**.
- [ ] Satu langkah tampil per ketukan "Langkah berikutnya"; bisa mundur.
- [ ] Gambar soal tetap terlihat di atas saat langkah bergulir.
- [ ] Setiap contoh diikuti 1 **soal melengkapi** (beberapa langkah sudah diisi, siswa melengkapi sisanya).
- [ ] Minimal 6 contoh: busur, juring, cari sudut, cari jari-jari, perbandingan, soal cerita.

### F5 — Latihan + Pembahasan *(DS02, IL04, IL05, GL02, GL05)*
> Sebagai siswa, saya ingin berlatih dan langsung tahu bagian mana yang salah.

Kriteria penerimaan:
- [ ] 3 level: **Level 1** (hitung langsung), **Level 2** (cari sudut/jari-jari, perbandingan), **Level 3** (soal cerita & campuran).
- [ ] Format jawaban: isian angka (menerima koma atau titik desimal, toleransi ±0,01) dan pilihan ganda.
- [ ] Umpan balik spesifik jenis kesalahan (lihat daftar di [04-konten-materi.md](04-konten-materi.md#6-kesalahan-umum--umpan-balik)).
- [ ] Bantuan bertingkat: Petunjuk 1 (pilih rumus) → Petunjuk 2 (substitusi) → Pembahasan lengkap.
- [ ] Tombol "Lihat contoh serupa" membuka contoh F4 yang relevan.
- [ ] Angka soal dapat diacak dari template agar latihan bisa diulang dengan variasi.
- [ ] Level berikutnya terbuka setelah benar ≥ 70% (tetap bisa dibuka manual).

### F6 — Soal Cerita Terpandu *(EL05)*
> Sebagai siswa, saya ingin dibantu menemukan informasi penting dari soal cerita panjang.

Kriteria penerimaan:
- [ ] Siswa dapat mengetuk kata/angka untuk menandainya sebagai **Diketahui** atau **Ditanya**.
- [ ] Informasi yang ditandai masuk ke tabel ringkas di bawah soal.
- [ ] Tombol "Ubah jadi gambar" menampilkan sketsa lingkaran dari informasi soal.
- [ ] Pertanyaan pemandu: "Yang ditanya panjang atau luas?"

### Fitur Pendukung
- **Beranda:** peta belajar 6 langkah dengan tanda selesai.
- **Progres:** disimpan di perangkat (localStorage); tombol "Reset progres".
- **Ringkasan Rumus:** satu kartu rumus berwarna yang dapat dibuka kapan saja.
- **Pengaturan:** ukuran huruf (normal/besar), pilihan π default.

## 4. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| Platform | Chrome/Edge/Firefox terbaru; Android 8.0+ |
| Ukuran APK | < 15 MB |
| Waktu muat pertama (web, 4G) | < 3 detik |
| Offline | Seluruh fitur jalan tanpa internet setelah dipasang/dibuka sekali |
| Tampilan | Mobile-first, mendukung 360 px hingga desktop |
| Aksesibilitas | Kontras ≥ 4.5:1, tombol ≥ 44 px, ukuran huruf bisa diperbesar |
| Privasi | Tanpa data pribadi, tanpa login, tanpa pelacak pihak ketiga |
| Bahasa | Bahasa Indonesia |

## 5. Indikator Keberhasilan

- Validasi ahli materi & ahli media: kategori **valid** (lihat [08-rencana-evaluasi.md](08-rencana-evaluasi.md)).
- Angket respons siswa: kategori **praktis**.
- Skor beban ekstrinsik siswa lebih rendah dan beban germane lebih tinggi dibanding belajar dengan LKS.
- Siswa mampu menyelesaikan soal invers dan soal cerita (≥ 70% benar pada uji coba).
