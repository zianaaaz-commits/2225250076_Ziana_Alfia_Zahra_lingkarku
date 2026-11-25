// @vitest-environment node
import worker, { URL_DEEPSEEK, type Env } from '../../server/asisten/index';
import { PESAN_PENJAGA } from '../lib/asisten/pedagogi';

const ASAL = 'https://zianaaaz-commits.github.io';
const env: Env = { DEEPSEEK_API_KEY: 'kunci-rahasia-uji', MODEL: 'deepseek-flash' };

const badanSah = {
  pesan: [{ peran: 'siswa', isi: 'Berapa jawabannya?' }],
  konteks: { modul: 'latihan', soal: 'Jari-jari 7 cm, sudut pusat 90°. Berapa panjang busurnya?', status: 'belum' },
  tingkatBantuan: 1,
  kunci: 11,
};

const kirim = (badan: unknown, asal: string | null = ASAL, e: Env = env) =>
  worker.fetch(
    new Request('https://asisten.contoh/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(asal ? { Origin: asal } : {}) },
      body: typeof badan === 'string' ? badan : JSON.stringify(badan),
    }),
    e,
  );

const deepseek = (isi: string, status = 200) =>
  vi.fn().mockResolvedValue(
    new Response(JSON.stringify(status === 200 ? { choices: [{ message: { content: isi } }] } : { error: {} }), { status }),
  );

afterEach(() => vi.unstubAllGlobals());

describe('server Asisten Belajar (Cloudflare Worker)', () => {
  it('preflight CORS hanya untuk asal yang diizinkan', async () => {
    const ok = await worker.fetch(new Request('https://a/chat', { method: 'OPTIONS', headers: { Origin: ASAL } }), env);
    expect(ok.status).toBe(204);
    expect(ok.headers.get('Access-Control-Allow-Origin')).toBe(ASAL);
    const tolak = await worker.fetch(new Request('https://a/chat', { method: 'OPTIONS', headers: { Origin: 'https://jahat.com' } }), env);
    expect(tolak.status).toBe(403);
  });

  it('menolak asal asing & permintaan tanpa Origin', async () => {
    expect((await kirim(badanSah, 'https://jahat.com')).status).toBe(403);
    expect((await kirim(badanSah, null)).status).toBe(403);
  });

  it('menolak permintaan tidak valid', async () => {
    expect((await kirim('{bukan json')).status).toBe(400);
    expect((await kirim({ ...badanSah, pesan: [] })).status).toBe(400);
  });

  it('memanggil DeepSeek dengan key rahasia & prompt pedagogis (tanpa kunci jawaban)', async () => {
    const f = deepseek('Yang ditanya panjang atau luas?');
    vi.stubGlobal('fetch', f);
    const r = await kirim(badanSah);
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ balasan: 'Yang ditanya panjang atau luas?', fase: 1 });

    const [url, opsi] = f.mock.calls[0];
    expect(url).toBe(URL_DEEPSEEK);
    expect(opsi.headers.Authorization).toBe('Bearer kunci-rahasia-uji');
    const badan = JSON.parse(opsi.body);
    expect(badan.model).toBe('deepseek-flash');
    expect(badan.thinking).toEqual({ type: 'disabled' });
    expect(badan.max_tokens).toBeLessThanOrEqual(400);
    expect(badan.messages[0].role).toBe('system');
    expect(badan.messages[0].content).toContain('JANGAN PERNAH memberikan jawaban akhir');
    expect(JSON.stringify(badan.messages)).not.toMatch(/\b11\b/);
  });

  it('menyembunyikan jawaban akhir bila model membocorkannya', async () => {
    vi.stubGlobal('fetch', deepseek('Jawabannya 11 cm.'));
    const j = (await (await kirim(badanSah)).json()) as { balasan: string; disensor?: boolean };
    expect(j.disensor).toBe(true);
    expect(j.balasan).not.toMatch(/\b11\b/);
    expect(j.balasan).toContain(PESAN_PENJAGA);
  });

  it('memetakan galat DeepSeek menjadi pesan ramah siswa', async () => {
    vi.stubGlobal('fetch', deepseek('', 402));
    const r = await kirim(badanSah);
    expect(r.status).toBe(503);
    expect(((await r.json()) as { galat: string }).galat).toBe('saldo-habis');

    vi.stubGlobal('fetch', deepseek('', 429));
    expect((await kirim(badanSah)).status).toBe(429);

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('jaringan')));
    expect((await kirim(badanSah)).status).toBe(502);
  });

  it('pembatas laju menolak permintaan berlebih', async () => {
    const f = deepseek('x');
    vi.stubGlobal('fetch', f);
    const r = await kirim(badanSah, ASAL, { ...env, PEMBATAS: { limit: async () => ({ success: false }) } });
    expect(r.status).toBe(429);
    expect(f).not.toHaveBeenCalled();
  });

  it('tanpa API key → galat konfigurasi', async () => {
    expect((await kirim(badanSah, ASAL, { DEEPSEEK_API_KEY: '' })).status).toBe(500);
  });
});
