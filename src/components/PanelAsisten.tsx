import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { MASKOT } from '../content/gambar';
import { urlAsisten } from '../content/tautan';
import { GalatAsisten, tanyaAsisten } from '../lib/asisten/klien';
import { FASE_RMT, TINGKAT_BANTUAN } from '../lib/asisten/pedagogi';
import type { FaseRmt, KonteksSoal, Pesan, TingkatBantuan } from '../lib/asisten/tipe';
import { URL_MASKOT } from './Maskot';
import MathText from './MathText';
import Tombol from './Tombol';

interface Props {
  /** Dipanggil setiap kali mengirim pesan, agar jawaban/status terbaru siswa ikut terbaca. */
  ambilKonteks: () => KonteksSoal;
  kunci?: number;
  tutup: () => void;
  /** Alamat server (bawaan: urlAsisten() dari VITE_ASISTEN_URL). */
  url?: string;
}

interface Gelembung extends Pesan {
  fase?: FaseRmt;
}

const SAPAAN =
  'Halo! Aku **Kak Bulat** 👋 Aku tidak akan langsung memberi jawaban, tapi aku akan menemanimu berpikir. Ceritakan dulu: apa yang sudah kamu ketahui dari soal ini?';

const PINTASAN = [
  { teks: '🤔 Aku bingung mulai dari mana', pesan: 'Aku bingung harus mulai dari mana.', naik: false },
  { teks: '💡 Minta petunjuk berikutnya', pesan: 'Boleh minta petunjuk berikutnya?', naik: true },
  { teks: '📘 Jelaskan konsepnya', pesan: 'Bisa jelaskan konsepnya dengan sederhana?', naik: false },
];

// Asisten Belajar "Kak Bulat": pembimbing proses berpikir (RMT + CLT), bukan pemberi jawaban.
export default function PanelAsisten({ ambilKonteks, kunci, tutup, url = urlAsisten() }: Props) {
  const idInput = useId();
  const [pesan, setPesan] = useState<Gelembung[]>([]);
  const [tingkat, setTingkat] = useState<TingkatBantuan>(1);
  const [teks, setTeks] = useState('');
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState('');
  const bawah = useRef<HTMLDivElement>(null);
  const batal = useRef<AbortController | null>(null);

  useEffect(() => {
    bawah.current?.scrollIntoView?.({ block: 'end' });
  }, [pesan, memuat]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && tutup();
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('keydown', esc);
      batal.current?.abort();
    };
  }, [tutup]);

  const kirim = async (isi: string, naikTingkat = false) => {
    const bersih = isi.trim();
    if (!bersih || memuat) return;
    const tingkatBaru = (naikTingkat ? Math.min(4, tingkat + 1) : tingkat) as TingkatBantuan;
    setTingkat(tingkatBaru);
    const riwayat: Gelembung[] = [...pesan, { peran: 'siswa', isi: bersih }];
    setPesan(riwayat);
    setTeks('');
    setGalat('');
    setMemuat(true);
    batal.current = new AbortController();
    try {
      const j = await tanyaAsisten(
        url,
        {
          pesan: riwayat.map(({ peran, isi: x }) => ({ peran, isi: x })),
          konteks: ambilKonteks(),
          tingkatBantuan: tingkatBaru,
          ...(kunci !== undefined ? { kunci } : {}),
        },
        batal.current.signal,
      );
      setPesan((p) => [...p, { peran: 'asisten', isi: j.balasan, fase: j.fase }]);
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return;
      setGalat(e instanceof GalatAsisten ? e.message : 'Kak Bulat sedang tidak bisa dihubungi. Coba lagi nanti.');
      setPesan((p) => p.slice(0, -1)); // pesan gagal dikembalikan ke kotak isian
      setTeks(bersih);
    } finally {
      setMemuat(false);
    }
  };

  const onKirim = (e: FormEvent) => {
    e.preventDefault();
    void kirim(teks);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={tutup}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-asisten"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88dvh] w-full max-w-xl flex-col rounded-t-2xl bg-white sm:rounded-2xl"
      >
        <div className="flex items-center gap-2 border-b border-gray-200 p-3">
          <img src={URL_MASKOT} alt={MASKOT.alt} className="h-10 w-auto" />
          <div className="flex-1">
            <h2 id="judul-asisten" className="font-bold">
              Kak Bulat · Asisten Belajar
            </h2>
            <p className="text-xs text-gray-600">
              Bantuan tingkat {tingkat} dari 4: {TINGKAT_BANTUAN[tingkat].label}
            </p>
          </div>
          <button type="button" onClick={tutup} aria-label="Tutup asisten" className="flex h-11 w-11 items-center justify-center rounded-xl text-xl hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3" aria-live="polite">
          <div className="flex flex-col gap-3">
            <div className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-orange-50 p-3">
              <MathText teks={SAPAAN} />
            </div>
            {pesan.map((m, i) =>
              m.peran === 'siswa' ? (
                <div key={i} className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-aksi p-3 text-white">
                  {m.isi}
                </div>
              ) : (
                <div key={i} className="max-w-[85%] self-start">
                  {m.fase && (
                    <p className="mb-1 text-xs font-semibold text-sudut">
                      Fase {m.fase} · {FASE_RMT[m.fase].label}
                    </p>
                  )}
                  <div className="rounded-2xl rounded-tl-sm bg-orange-50 p-3 whitespace-pre-line">
                    <MathText teks={m.isi} />
                  </div>
                </div>
              ),
            )}
            {memuat && <p className="self-start text-sm text-gray-600">Kak Bulat sedang berpikir…</p>}
            {galat && (
              <p role="alert" className="rounded-xl border-l-4 border-salah bg-gray-50 p-3 text-sm">
                {galat}
              </p>
            )}
            <div ref={bawah} />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-200 p-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PINTASAN.map((p) => (
              <button
                key={p.teks}
                type="button"
                disabled={memuat || (p.naik && tingkat >= 4)}
                onClick={() => void kirim(p.pesan, p.naik)}
                className="min-h-10 shrink-0 rounded-full border border-orange-300 bg-orange-50 px-3 text-sm font-semibold disabled:opacity-40"
              >
                {p.teks}
              </button>
            ))}
          </div>
          <form onSubmit={onKirim} className="flex gap-2">
            <label htmlFor={idInput} className="sr-only">
              Pesan untuk Kak Bulat
            </label>
            <input
              id={idInput}
              value={teks}
              maxLength={500}
              autoComplete="off"
              onChange={(e) => setTeks(e.target.value)}
              placeholder="Tulis cara berpikirmu…"
              className="h-12 flex-1 rounded-xl border-2 border-gray-300 px-3 text-base"
            />
            <Tombol type="submit" disabled={!teks.trim() || memuat}>
              Kirim
            </Tombol>
          </form>
          <p className="text-center text-xs text-gray-500">🌐 Butuh internet · Nama & kelasmu tidak dikirim</p>
        </div>
      </div>
    </div>
  );
}
