import { useEffect, useState } from 'react';
import PilihanSegmen from '../components/PilihanSegmen';
import Tombol from '../components/Tombol';
import { URL_APK, URL_WEB } from '../content/tautan';
import { bisaPasangLangsung, jenisPerangkat, pantau, pasangSekarang, sudahTerpasang, type Perangkat } from '../lib/pasang';

const LANGKAH: Record<Perangkat, string[]> = {
  android: [
    'Buka alamat aplikasi di **Chrome**.',
    'Ketuk menu **⋮** (pojok kanan atas).',
    'Pilih **Instal aplikasi** atau **Tambahkan ke layar utama**.',
    'Ikon LingkarKu muncul di layar HP dan bisa dibuka tanpa internet.',
  ],
  ios: [
    'Buka alamat aplikasi di **Safari**.',
    'Ketuk tombol **Bagikan** (kotak dengan panah ke atas).',
    'Pilih **Tambahkan ke Layar Utama**, lalu **Tambah**.',
    'Ikon LingkarKu muncul di layar iPhone/iPad.',
  ],
  desktop: [
    'Buka alamat aplikasi di **Chrome** atau **Edge**.',
    'Klik ikon **Instal** (layar dengan panah) di ujung kanan kolom alamat.',
    'Klik **Instal**. LingkarKu terbuka di jendelanya sendiri.',
  ],
};

const tebal = (s: string) =>
  s.split(/(\*\*[^*]+\*\*)/g).map((t, i) => (t.startsWith('**') ? <b key={i}>{t.slice(2, -2)}</b> : t));

export default function Pasang() {
  const [, segarkan] = useState(0);
  const [perangkat, setPerangkat] = useState<Perangkat>(() => jenisPerangkat());
  const [pesan, setPesan] = useState('');
  const terpasang = sudahTerpasang();

  useEffect(() => pantau(() => segarkan((n) => n + 1)), []);

  return (
    <section className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Pasang LingkarKu</h1>

      {terpasang ? (
        <p role="status" className="rounded-xl border-l-4 border-benar bg-gray-50 p-4 font-semibold">
          ✓ LingkarKu sudah terpasang di perangkat ini.
        </p>
      ) : (
        <>
          <p className="text-gray-600">Gratis, tanpa Play Store/App Store, dan tetap bisa dipakai tanpa internet.</p>
          {bisaPasangLangsung() && (
            <Tombol
              onClick={async () => {
                const ok = await pasangSekarang();
                setPesan(ok ? 'Berhasil! Cari ikon LingkarKu di layar utama.' : 'Pemasangan dibatalkan.');
              }}
            >
              📲 Pasang sekarang
            </Tombol>
          )}
          {pesan && <p role="status">{pesan}</p>}

          <div className="flex flex-col gap-3">
            <PilihanSegmen
              label="Perangkat"
              nilai={perangkat}
              ubah={setPerangkat}
              pilihan={[
                { nilai: 'android', teks: 'Android' },
                { nilai: 'ios', teks: 'iPhone' },
                { nilai: 'desktop', teks: 'Laptop' },
              ]}
            />
            <ol className="flex list-decimal flex-col gap-2 rounded-xl bg-gray-50 p-4 pl-8">
              {LANGKAH[perangkat].map((l) => (
                <li key={l}>{tebal(l)}</li>
              ))}
            </ol>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4">
        <p className="font-semibold">Bagikan ke teman</p>
        <img
          src={`${import.meta.env.BASE_URL}qr-lingkarku.svg`}
          alt={`Kode QR menuju ${URL_WEB}`}
          className="mx-auto h-44 w-44"
        />
        <p className="break-all text-center text-sm">
          <a href={URL_WEB} className="font-semibold text-aksi underline">
            {URL_WEB}
          </a>
        </p>
      </div>

      {perangkat === 'android' && !terpasang && (
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4">
          <p className="font-semibold">Atau pasang file APK</p>
          <a href={URL_APK} className="flex min-h-12 items-center justify-center rounded-xl border border-gray-300 font-semibold">
            ⬇ Unduh LingkarKu.apk
          </a>
          <p className="text-sm text-gray-600">
            Saat memasang, Android akan meminta izin <b>“Instal aplikasi tidak dikenal”</b> untuk browser/File Manager.
            Izinkan, lalu ketuk <b>Instal</b>.
          </p>
        </div>
      )}
    </section>
  );
}
