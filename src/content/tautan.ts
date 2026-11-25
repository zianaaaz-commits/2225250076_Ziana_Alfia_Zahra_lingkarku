// Alamat publik aplikasi (GitHub Pages) dan unduhan APK (GitHub Releases).
export const URL_WEB = 'https://zianaaaz-commits.github.io/2225250076_Ziana_Alfia_Zahra_lingkarku/';
export const URL_APK = 'https://github.com/zianaaaz-commits/2225250076_Ziana_Alfia_Zahra_lingkarku/releases/latest/download/LingkarKu.apk';
/**
 * Alamat server Asisten Belajar (Cloudflare Worker), tanpa garis miring di akhir.
 * Diisi setelah server dipasang (server/asisten/README.md). Kosong = asisten belum aktif.
 * Dapat juga diatur saat build lewat variabel lingkungan VITE_ASISTEN_URL.
 */
export const urlAsisten = (): string =>
  ((import.meta.env?.VITE_ASISTEN_URL as string | undefined) ?? '').replace(/\/+$/, '');
export const URL_KODE ='https://github.com/zianaaaz-commits/2225250076_Ziana_Alfia_Zahra_lingkarku';
