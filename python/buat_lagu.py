"""Membuat lagu latar orisinal untuk LingkarKu (tanpa hak cipta pihak lain).

Lagu disintesis dari nol: progresi akor I–vi–IV–V (C–Am–F–G), arpeggio
lembut bernuansa kalimba, bass pelan, dan melodi pentatonik sederhana.
Panjang 8 birama dan dapat diputar berulang (loop) tanpa jeda.

Hanya memakai pustaka standar Python.
Jalankan:  python python/buat_lagu.py
Hasil:     public/audio/lagu-latar.wav
"""

from __future__ import annotations

import math
import struct
import wave
from pathlib import Path

LAJU_SAMPEL = 22050  # Hz, mono — cukup jernih untuk musik latar, ukuran kecil
TEMPO = 84  # ketukan per menit (santai)
KETUKAN = 60 / TEMPO
JUMLAH_KETUKAN = 32  # 8 birama × 4 ketukan
PUNCAK = 0.4  # sengaja pelan: musik latar, dan iPhone tidak mengizinkan aplikasi mengatur volume

KELUARAN = Path(__file__).resolve().parent.parent / "public" / "audio" / "lagu-latar.wav"

NADA = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def frekuensi(nama: str) -> float:
    """'A4' → 440.0 Hz, 'C5' → 523.25 Hz."""
    midi = 12 * (int(nama[1:]) + 1) + NADA[nama[0]]
    return 440.0 * 2 ** ((midi - 69) / 12)


def jumlah_sampel() -> int:
    return round(LAJU_SAMPEL * KETUKAN * JUMLAH_KETUKAN)


def tambah_nada(
    buf: list[float],
    nama: str,
    mulai: float,
    durasi: float,
    amp: float,
    redam: float = 3.0,
    serang: float = 0.01,
    harmonik: float = 0.3,
) -> None:
    """Menambahkan satu nada ke buffer. Indeks dibungkus (modulo) agar loop mulus."""
    f = frekuensi(nama)
    n_total = len(buf)
    awal = round(mulai * KETUKAN * LAJU_SAMPEL)
    n = round(durasi * KETUKAN * LAJU_SAMPEL)
    lepas = max(1, round(0.05 * LAJU_SAMPEL))  # 50 ms pelepasan di akhir nada
    w = 2 * math.pi * f / LAJU_SAMPEL
    for i in range(n):
        t = i / LAJU_SAMPEL
        selubung = (1 - math.exp(-t / serang)) * math.exp(-t * redam) * min(1.0, (n - i) / lepas)
        nilai = math.sin(w * i) + harmonik * math.sin(2 * w * i)
        buf[(awal + i) % n_total] += amp * selubung * nilai


AKOR = [  # (bass, nada-nada akor) per birama
    ("C3", ["C4", "E4", "G4"]),
    ("A2", ["A3", "C4", "E4"]),
    ("F2", ["F3", "A3", "C4"]),
    ("G2", ["G3", "B3", "D4"]),
] * 2

POLA_ARPEGGIO = [0, 1, 2, 1, 3, 2, 1, 2]  # indeks nada; 3 = oktaf dari nada dasar

MELODI = [  # (nada, ketukan mulai, durasi ketukan)
    ("E5", 0, 1), ("G5", 1, 1), ("A5", 2, 1), ("G5", 3, 1),
    ("E5", 4, 2), ("C5", 6, 2),
    ("D5", 8, 1), ("E5", 9, 1), ("G5", 10, 1), ("E5", 11, 1),
    ("D5", 12, 3),
    ("E5", 16, 1), ("G5", 17, 1), ("C6", 18, 1), ("A5", 19, 1),
    ("G5", 20, 2), ("E5", 22, 2),
    ("D5", 24, 1), ("C5", 25, 1), ("D5", 26, 1), ("E5", 27, 1),
    ("D5", 28, 1), ("E5", 29, 1), ("D5", 30, 2),
]


def oktaf_naik(nama: str) -> str:
    return nama[0] + str(int(nama[1:]) + 1)


def susun_lagu() -> list[float]:
    buf = [0.0] * jumlah_sampel()
    for birama, (bass, akor) in enumerate(AKOR):
        b0 = birama * 4
        tambah_nada(buf, bass, b0, 4, amp=0.30, redam=0.6, serang=0.08, harmonik=0.1)
        nada_arp = akor + [oktaf_naik(akor[0])]
        for k, idx in enumerate(POLA_ARPEGGIO):
            tambah_nada(buf, nada_arp[idx], b0 + k * 0.5, 0.9, amp=0.16, redam=3.5)
    for nama, mulai, durasi in MELODI:
        tambah_nada(buf, nama, mulai, durasi, amp=0.28, redam=1.6, harmonik=0.4)
    return buf


def normalisasi(buf: list[float], puncak: float = PUNCAK) -> list[float]:
    maks = max(abs(x) for x in buf) or 1.0
    return [x * puncak / maks for x in buf]


def simpan_wav(buf: list[float], jalur: Path) -> None:
    jalur.parent.mkdir(parents=True, exist_ok=True)
    data = b"".join(struct.pack("<h", round(x * 32767)) for x in buf)
    with wave.open(str(jalur), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(LAJU_SAMPEL)
        w.writeframes(data)


def main() -> None:
    buf = normalisasi(susun_lagu())
    simpan_wav(buf, KELUARAN)
    detik = len(buf) / LAJU_SAMPEL
    ukuran = KELUARAN.stat().st_size / 1024
    print(f"✓ {KELUARAN.relative_to(KELUARAN.parents[2])} — {detik:.1f} detik, {ukuran:.0f} KB")


if __name__ == "__main__":
    main()
