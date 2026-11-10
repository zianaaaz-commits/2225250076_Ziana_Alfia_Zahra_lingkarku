// Membuat ikon PNG untuk PWA & Android dari public/icon*.svg.
// Jalankan: npm run ikon
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const keluaran = [
  { dari: 'public/icon.svg', ke: 'public/pwa-192.png', ukuran: 192 },
  { dari: 'public/icon.svg', ke: 'public/pwa-512.png', ukuran: 512 },
  { dari: 'public/icon-maskable.svg', ke: 'public/pwa-512-maskable.png', ukuran: 512 },
  { dari: 'public/icon-maskable.svg', ke: 'public/apple-touch-icon.png', ukuran: 180 },
  // Sumber untuk ikon peluncur Android (@capacitor/assets)
  { dari: 'public/icon-maskable.svg', ke: 'assets/icon-only.png', ukuran: 1024 },
];

await mkdir('assets', { recursive: true });
for (const { dari, ke, ukuran } of keluaran) {
  await sharp(dari, { density: 384 }).resize(ukuran, ukuran).png().toFile(ke);
  console.log(`✓ ${ke} (${ukuran}×${ukuran})`);
}
