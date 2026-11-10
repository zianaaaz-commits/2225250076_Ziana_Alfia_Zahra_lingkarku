// Lagu latar hanya di layar menu (keputusan desain: lihat docs/06-desain-ui-ux.md §5).
// Saat siswa belajar/mengerjakan soal, lagu berhenti agar tidak menambah beban ekstrinsik.

/** Halaman "menu" tempat lagu boleh diputar. */
export const HALAMAN_MENU = ['/', '/contoh', '/latihan', '/cerita', '/literasi', '/pengaturan', '/pasang'];

export const bolehPutar = (pathname: string): boolean => HALAMAN_MENU.includes(pathname);

// File lagu sudah direkam pelan (puncak 0,4); di iPhone volume tidak bisa diatur aplikasi.
export const VOLUME = 0.6;
export const URL_LAGU = `${import.meta.env.BASE_URL}audio/lagu-latar.wav`;
