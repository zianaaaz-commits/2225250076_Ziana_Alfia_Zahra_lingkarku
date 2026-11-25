# Server Asisten Belajar "Kak Bulat" (Cloudflare Worker)

Server kecil ini menjadi perantara antara aplikasi LingkarKu dan API DeepSeek.
**API key disimpan di server sebagai *secret*, tidak pernah masuk ke aplikasi/HP siswa atau ke GitHub.**

Yang dilakukan server (`index.ts`):
1. Hanya menerima permintaan dari aplikasi LingkarKu (GitHub Pages, APK, localhost).
2. Membatasi 20 pesan/menit per alamat IP dan panjang pesan (maks. 800 karakter) agar saldo hemat.
3. Menyusun prompt pedagogis (RMT + Teori Beban Kognitif + literasi) — `src/lib/asisten/pedagogi.ts`.
4. Memanggil DeepSeek (`deepseek-flash`, mode *thinking* dimatikan, maks. 400 token).
5. Menyembunyikan jawaban akhir bila model sempat menuliskannya.

## Pilih penyedia AI

| `PENYEDIA` di `wrangler.toml` | Biaya | Ambil API key di | Catatan |
|---|---|---|---|
| `deepseek` (bawaan) | berbayar, sangat murah (±$0,15–0,30 per 1 juta token masukan) | https://platform.deepseek.com → API Keys (isi saldo) | Sesuai instruksi "API DeepSeek"; paling stabil untuk satu kelas |
| `openrouter` | **gratis** untuk model berakhiran `:free` | https://openrouter.ai → Keys | Batas gratis 50 pesan/hari per akun (1.000/hari setelah pernah membeli kredit ≥ $10). Cek id model DeepSeek gratis yang tersedia di https://openrouter.ai/models?max_price=0, lalu isi `MODEL` |
| `gemini` | **gratis** (kuota harian) | https://aistudio.google.com → Get API key | Bukan DeepSeek; data versi gratis dipakai Google untuk meningkatkan produknya |

## Pemasangan (sekali saja, ±10 menit)

Yang diperlukan: akun **Cloudflare** (gratis) dan API key dari penyedia yang dipilih.

1. Atur `PENYEDIA` (dan bila perlu `MODEL`) di `wrangler.toml`.
2. Buka terminal VS Code di folder proyek, lalu:

```bash
cd server/asisten
npx wrangler login              # buka browser → izinkan akses Cloudflare
npx wrangler secret put API_KEY # tempel API key, tekan Enter (tidak terlihat di layar)
npx wrangler deploy             # unggah server
```

Perintah terakhir menampilkan alamat seperti `https://lingkarku-asisten.<nama-akun>.workers.dev`.
Uji di browser: membuka alamat itu harus menampilkan `{"layanan":"Asisten Belajar LingkarKu","status":"aktif"}`.

## Menghubungkan aplikasi

Buat file `.env.production` di folder utama proyek (alamat ini tidak rahasia):

```
VITE_ASISTEN_URL=https://lingkarku-asisten.<nama-akun>.workers.dev
```

Untuk mencoba di laptop (`npm run dev`), buat juga `.env.local` dengan isi yang sama.
Lalu commit & push — GitHub Actions membangun ulang web, dan APK berikutnya ikut memakai alamat ini.

## Perawatan

| Kebutuhan | Perintah / tempat |
|---|---|
| Ganti API key | `npx wrangler secret put API_KEY` |
| Ganti penyedia/model | ubah `PENYEDIA`/`MODEL` di `wrangler.toml`, pasang API key penyedia itu, lalu `npx wrangler deploy` |
| Lihat log langsung | `npx wrangler tail` |
| Cek saldo/pemakaian | https://platform.deepseek.com |
| Matikan sementara | Cloudflare Dashboard → Workers → lingkarku-asisten → Disable |

## Privasi

Yang dikirim ke DeepSeek: isi percakapan, teks soal, jawaban & status jawaban, diagnosis kesalahan.
**Tidak dikirim:** nama, kelas, atau data pribadi lain. Server tidak menyimpan percakapan.
