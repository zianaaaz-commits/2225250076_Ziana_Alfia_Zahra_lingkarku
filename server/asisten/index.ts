// Server perantara Asisten Belajar "Kak Bulat" (Cloudflare Worker).
// - Menyimpan API key DeepSeek sebagai secret (tidak pernah sampai ke aplikasi/HP siswa).
// - Memeriksa permintaan, membatasi pemakaian, menyusun prompt pedagogis (RMT + CLT),
//   memanggil DeepSeek, lalu menyembunyikan jawaban akhir bila sempat bocor.
// Panduan pemasangan: server/asisten/README.md
import { jagaJawaban, susunPesanModel, tentukanFase, validasiPermintaan } from '../../src/lib/asisten/pedagogi';
import type { JawabanAsisten } from '../../src/lib/asisten/tipe';

export interface Env {
  DEEPSEEK_API_KEY: string;
  /** Nama model DeepSeek (bawaan: deepseek-flash). */
  MODEL?: string;
  /** Daftar asal (origin) tambahan yang diizinkan, dipisah koma. */
  ASAL_DIIZINKAN?: string;
  /** Pembatas laju Cloudflare (opsional). */
  PEMBATAS?: { limit: (o: { key: string }) => Promise<{ success: boolean }> };
}

export const URL_DEEPSEEK = 'https://api.deepseek.com/chat/completions';

const ASAL_BAWAAN = [
  'https://zianaaaz-commits.github.io', // GitHub Pages
  'https://localhost', // APK Android (Capacitor)
  'capacitor://localhost',
  'http://localhost:5173', // npm run dev
  'http://localhost:4173', // npm run preview
];

function asalDiizinkan(asal: string | null, env: Env): boolean {
  if (!asal) return false;
  const tambahan = (env.ASAL_DIIZINKAN ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return [...ASAL_BAWAAN, ...tambahan].includes(asal);
}

function json(data: unknown, status: number, asal: string | null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(asal ? { 'Access-Control-Allow-Origin': asal, Vary: 'Origin' } : {}),
    },
  });
}

const galat = (kode: string, pesan: string, status: number, asal: string | null) =>
  json({ galat: kode, pesan }, status, asal);

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const asalMentah = req.headers.get('Origin');
    const asal = asalDiizinkan(asalMentah, env) ? asalMentah : null;

    if (req.method === 'OPTIONS') {
      if (!asal) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': asal,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          Vary: 'Origin',
        },
      });
    }

    if (url.pathname === '/' && req.method === 'GET') {
      return json({ layanan: 'Asisten Belajar LingkarKu', status: 'aktif' }, 200, asal);
    }
    if (url.pathname !== '/chat' || req.method !== 'POST') return galat('tidak-ditemukan', 'Alamat tidak dikenal.', 404, asal);
    if (!asal) return galat('asal-ditolak', 'Permintaan hanya boleh dari aplikasi LingkarKu.', 403, null);
    if (!env.DEEPSEEK_API_KEY) return galat('belum-diatur', 'API key belum dipasang di server.', 500, asal);

    if (env.PEMBATAS) {
      const ip = req.headers.get('CF-Connecting-IP') ?? 'tanpa-ip';
      const { success } = await env.PEMBATAS.limit({ key: ip });
      if (!success) return galat('terlalu-sering', 'Pelan-pelan, ya. Tunggu sebentar lalu coba lagi.', 429, asal);
    }

    let badan: unknown;
    try {
      badan = await req.json();
    } catch {
      return galat('tidak-valid', 'Format permintaan salah.', 400, asal);
    }
    const v = validasiPermintaan(badan);
    if (!v.ok) return galat('tidak-valid', v.galat, 400, asal);
    const p = v.nilai;

    let respons: Response;
    try {
      respons = await fetch(URL_DEEPSEEK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: env.MODEL || 'deepseek-flash',
          messages: susunPesanModel(p),
          thinking: { type: 'disabled' }, // jawaban cepat & hemat; suhu berlaku
          temperature: 0.5,
          max_tokens: 400,
          stream: false,
        }),
      });
    } catch {
      return galat('ai-gagal', 'Kak Bulat sedang tidak bisa dihubungi. Coba lagi nanti.', 502, asal);
    }

    if (!respons.ok) {
      if (respons.status === 402) return galat('saldo-habis', 'Kuota Asisten Belajar habis. Beri tahu gurumu, ya.', 503, asal);
      if (respons.status === 429) return galat('terlalu-sering', 'Kak Bulat sedang ramai. Tunggu sebentar lalu coba lagi.', 429, asal);
      if (respons.status === 401) return galat('belum-diatur', 'API key server tidak valid.', 500, asal);
      return galat('ai-gagal', 'Kak Bulat sedang tidak bisa dihubungi. Coba lagi nanti.', 502, asal);
    }

    const data = (await respons.json().catch(() => null)) as { choices?: { message?: { content?: string | null } }[] } | null;
    const isi = data?.choices?.[0]?.message?.content?.trim();
    if (!isi) return galat('ai-gagal', 'Kak Bulat belum bisa menjawab. Coba tanyakan dengan kalimat lain.', 502, asal);

    const jaga = jagaJawaban(isi, p.kunci, p.konteks);
    const hasil: JawabanAsisten = {
      balasan: jaga.teks,
      fase: tentukanFase(p.konteks, p.tingkatBantuan),
      ...(jaga.disensor ? { disensor: true } : {}),
    };
    return json(hasil, 200, asal);
  },
};
