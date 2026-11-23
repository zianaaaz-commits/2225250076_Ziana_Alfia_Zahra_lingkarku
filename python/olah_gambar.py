"""Mengolah gambar sumber (assets/sumber/) menjadi gambar siap pakai di aplikasi (public/gambar/).

- pizza-tiga.jpg  → dipotong menjadi 3: pizza utuh, pizza bergaris potong ¼, dan seperempat pizza
- pizza-8-potong.jpg → diperkecil
- maskot.jpg      → latar krem dihapus (transparan), dipotong rapat

Semua disimpan sebagai WebP agar ringan di HP.
Jalankan:  pip install pillow
           python python/olah_gambar.py
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

AKAR = Path(__file__).resolve().parent.parent
SUMBER = AKAR / "assets" / "sumber"
KELUARAN = AKAR / "public" / "gambar"
BATAS_PUTIH = 235  # piksel lebih terang dari ini dianggap latar putih


def kotak_isi(im: Image.Image, y0: int, y1: int) -> tuple[int, int, int, int]:
    """Kotak pembatas bagian tidak-putih pada pita vertikal y0..y1."""
    abu = im.convert("L")
    xs, ys = [], []
    for y in range(y0, y1):
        for x in range(0, im.width, 2):
            if abu.getpixel((x, y)) < BATAS_PUTIH:
                xs.append(x)
                ys.append(y)
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def segmen_vertikal(im: Image.Image, min_tinggi: int = 40) -> list[tuple[int, int]]:
    """Pita-pita gambar yang dipisahkan oleh baris putih."""
    abu = im.convert("L")
    kosong = [all(abu.getpixel((x, y)) >= BATAS_PUTIH for x in range(0, im.width, 4)) for y in range(im.height)]
    hasil, mulai = [], None
    for y, k in enumerate(kosong + [True]):
        if not k and mulai is None:
            mulai = y
        elif k and mulai is not None:
            if y - mulai >= min_tinggi:
                hasil.append((mulai, y))
            mulai = None
    return hasil


def simpan(im: Image.Image, nama: str, lebar: int) -> None:
    if im.width > lebar:
        im = im.resize((lebar, round(im.height * lebar / im.width)), Image.LANCZOS)
    jalur = KELUARAN / f"{nama}.webp"
    im.save(jalur, "WEBP", quality=82, method=6)
    print(f"✓ {jalur.relative_to(AKAR)}  {im.width}×{im.height}  {jalur.stat().st_size // 1024} KB")


def hapus_latar(im: Image.Image, beda_maks: int = 7) -> Image.Image:
    """Region growing dari tepi: piksel latar krem yang bersambung dibuat transparan.

    Piksel ikut terhapus bila mirip tetangganya (gradasi halus) dan tidak terlalu jenuh (bukan oranye/biru maskot).
    """
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    latar = bytearray(w * h)
    antre: deque[tuple[int, int]] = deque()
    for x in range(w):
        antre.extend([(x, 0), (x, h - 1)])
    for y in range(h):
        antre.extend([(0, y), (w - 1, y)])
    for x, y in antre:
        latar[y * w + x] = 1

    def jenuh(c: tuple[int, int, int]) -> int:
        return max(c) - min(c)

    while antre:
        x, y = antre.popleft()
        c = px[x, y]
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not latar[ny * w + nx]:
                n = px[nx, ny]
                if sum(abs(a - b) for a, b in zip(c, n)) <= beda_maks and jenuh(n) < 70 and sum(n) > 450:
                    latar[ny * w + nx] = 1
                    antre.append((nx, ny))

    def krem(c: tuple[int, int, int]) -> bool:
        """Warna latar: terang, hangat (merah > biru sedikit), tidak jenuh.
        Putih mata/gigi (merah ≈ biru) dan oranye maskot (sangat jenuh) tidak termasuk."""
        r, g, b = c
        return sum(c) > 540 and 12 < r - b < 70 and jenuh(c) < 70 and r >= g >= b - 5

    topeng = Image.new("L", (w, h), 255)
    tp = topeng.load()
    for y in range(h):
        for x in range(w):
            # Langkah 2: sisa latar yang terkurung (sela kaki, antara topi & tangan) juga dihapus.
            if latar[y * w + x] or krem(px[x, y]):
                tp[x, y] = 0
    topeng = topeng.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
    hasil = rgb.convert("RGBA")
    hasil.putalpha(topeng)
    return hasil.crop(hasil.getbbox())


def main() -> None:
    KELUARAN.mkdir(parents=True, exist_ok=True)

    tiga = Image.open(SUMBER / "pizza-tiga.jpg").convert("RGB")
    nama = ["pizza-utuh", "pizza-garis-seperempat", "pizza-seperempat"]
    pita = segmen_vertikal(tiga)
    # Pita kedua diperluas ke atas agar garis potong putih di atas pizza ikut (tidak terpotong).
    for n, (y0, y1) in zip(nama, pita):
        x0, yy0, x1, yy1 = kotak_isi(tiga, y0, y1)
        simpan(tiga.crop((x0, yy0, x1, yy1)), n, 480)

    simpan(Image.open(SUMBER / "pizza-8-potong.jpg").convert("RGB"), "pizza-8-potong", 600)
    simpan(hapus_latar(Image.open(SUMBER / "maskot.jpg")), "maskot", 360)


if __name__ == "__main__":
    main()
