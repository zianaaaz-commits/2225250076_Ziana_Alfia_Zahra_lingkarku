"""Memeriksa ulang SEMUA kunci jawaban aplikasi secara independen.

Kunci jawaban di aplikasi dihitung dengan JavaScript (angka desimal biasa).
Skrip ini menghitung ulang dengan pecahan eksak (fractions.Fraction), sehingga
kesalahan ketik atau pembulatan pada konten akan ketahuan.

Langkah:
  1. npx tsx scripts/ekspor-konten.ts   → membuat python/data/konten.json
  2. python python/periksa_kunci.py     → memeriksa
(atau cukup: npm run periksa:python)
"""

from __future__ import annotations

import json
import sys
from fractions import Fraction as F
from pathlib import Path

DATA = Path(__file__).resolve().parent / "data" / "konten.json"
TOLERANSI = F(1, 100)  # ±0,01 — sama dengan aplikasi

PI = {"22/7": F(22, 7), "3.14": F(314, 100)}


def pecahan(x) -> F:
    """Angka JSON → pecahan eksak (lewat teks agar 62.8 tetap 628/10)."""
    return F(str(x))


def akar(x: F) -> F:
    """Akar kuadrat; eksak bila x kuadrat sempurna, selain itu pendekatan rapat."""
    import math

    if x.numerator >= 0:
        pa, qa = math.isqrt(x.numerator), math.isqrt(x.denominator)
        if pa * pa == x.numerator and qa * qa == x.denominator:
            return F(pa, qa)
    return F(math.sqrt(x)).limit_denominator(10**9)


def jari(data: dict) -> F:
    if "r" in data:
        return pecahan(data["r"])
    return pecahan(data["d"]) / 2


def hitung(data: dict, ditanya: str) -> F:
    p = PI[data["pi"]]
    a = pecahan(data["alpha"]) / 360 if "alpha" in data else None
    if ditanya == "busur":
        return a * 2 * p * jari(data)
    if ditanya == "juring":
        return a * p * jari(data) ** 2
    if ditanya == "kelilingJuring":
        r = jari(data)
        return a * 2 * p * r + 2 * r
    if ditanya == "sudutDariBusur":
        return pecahan(data["busur"]) / (2 * p * jari(data)) * 360
    if ditanya == "sudutDariJuring":
        return pecahan(data["luas"]) / (p * jari(data) ** 2) * 360
    if ditanya == "jariDariBusur":
        return pecahan(data["busur"]) / (a * 2 * p)
    if ditanya == "jariDariJuring":
        return akar(pecahan(data["luas"]) / (a * p))
    if ditanya == "perbandingan":
        return pecahan(data["nilai1"]) * pecahan(data["alpha2"]) / pecahan(data["alpha1"])
    raise ValueError(f"jenis soal tidak dikenal: {ditanya}")


def periksa(butir: list[dict]) -> list[str]:
    """Kembalikan daftar pesan kesalahan (kosong = semua benar)."""
    galat = []
    for b in butir:
        hasil = hitung(b["data"], b["ditanya"])
        if abs(hasil - pecahan(b["kunci"])) > TOLERANSI:
            galat.append(
                f"{b['sumber']} {b['id']}: kunci {b['kunci']}, seharusnya {float(hasil):.4f}"
            )
    return galat


def main() -> int:
    if not DATA.exists():
        print("python/data/konten.json belum ada. Jalankan dulu: npx tsx scripts/ekspor-konten.ts")
        return 2
    butir = json.loads(DATA.read_text(encoding="utf-8"))
    galat = periksa(butir)
    per_sumber: dict[str, int] = {}
    for b in butir:
        per_sumber[b["sumber"]] = per_sumber.get(b["sumber"], 0) + 1
    print("Diperiksa:", ", ".join(f"{k} {v}" for k, v in per_sumber.items()))
    if galat:
        print(f"✗ {len(galat)} kunci salah:")
        for g in galat:
            print("  -", g)
        return 1
    print(f"✓ Semua {len(butir)} kunci jawaban benar (dihitung ulang dengan pecahan eksak).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
