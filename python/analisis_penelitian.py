"""Analisis data penelitian LingkarKu (docs/08-rencana-evaluasi.md).

Tiga analisis, masing-masing membaca file CSV:

  python python/analisis_penelitian.py validasi  data.csv   # validasi ahli (skala 1–5)
  python python/analisis_penelitian.py ngain     data.csv   # pretest–posttest (N-gain)
  python python/analisis_penelitian.py beban     data.csv   # beban kognitif (Leppink dkk., 2013)

Tambahkan  --keluaran hasil.csv  untuk menyimpan tabel hasil.
Contoh format CSV ada di python/data/contoh/ (data fiktif, hanya untuk mencoba).
Hanya memakai pustaka standar Python.
"""

from __future__ import annotations

import argparse
import csv
import statistics as st
import sys
from pathlib import Path

# ---------------------------------------------------------------- validasi ahli


def kategori_validitas(persen: float) -> str:
    """Interval kategori sesuai docs/08 §1 (sesuaikan dengan rujukan dosen)."""
    if persen > 80:
        return "Sangat valid"
    if persen > 60:
        return "Valid"
    if persen > 40:
        return "Cukup valid"
    return "Kurang valid"


def analisis_validasi(baris: list[dict], skor_maks: int = 5) -> dict:
    """CSV: aspek, butir, skor  (satu baris per butir; boleh beberapa validator)."""
    per_aspek: dict[str, list[float]] = {}
    for b in baris:
        per_aspek.setdefault(b["aspek"], []).append(float(b["skor"]))
    hasil = []
    for aspek, skor in per_aspek.items():
        persen = sum(skor) / (len(skor) * skor_maks) * 100
        hasil.append({"aspek": aspek, "jumlah_butir": len(skor), "persen": round(persen, 2),
                      "kategori": kategori_validitas(persen)})
    semua = [float(b["skor"]) for b in baris]
    total = sum(semua) / (len(semua) * skor_maks) * 100
    return {"per_aspek": hasil, "total": round(total, 2), "kategori": kategori_validitas(total)}


# ---------------------------------------------------------------- N-gain


def n_gain(pre: float, post: float, maks: float = 100) -> float | None:
    """g = (post − pre) / (maks − pre). None bila pre sudah maksimal."""
    if pre >= maks:
        return None
    return (post - pre) / (maks - pre)


def kategori_ngain(g: float) -> str:
    if g >= 0.7:
        return "Tinggi"
    if g >= 0.3:
        return "Sedang"
    return "Rendah"


def analisis_ngain(baris: list[dict]) -> dict:
    """CSV: kode_siswa, pretest, posttest  (skor 0–100)."""
    hasil = []
    for b in baris:
        g = n_gain(float(b["pretest"]), float(b["posttest"]))
        hasil.append({"kode_siswa": b["kode_siswa"], "pretest": float(b["pretest"]),
                      "posttest": float(b["posttest"]),
                      "n_gain": None if g is None else round(g, 3),
                      "kategori": "-" if g is None else kategori_ngain(g)})
    nilai_g = [h["n_gain"] for h in hasil if h["n_gain"] is not None]
    rata = st.mean(nilai_g) if nilai_g else 0.0
    return {
        "per_siswa": hasil,
        "rata_pretest": round(st.mean(h["pretest"] for h in hasil), 2),
        "rata_posttest": round(st.mean(h["posttest"] for h in hasil), 2),
        "rata_n_gain": round(rata, 3),
        "kategori": kategori_ngain(rata),
    }


# ---------------------------------------------------------------- beban kognitif

# Leppink dkk. (2013): 10 butir skala 0–10 → IL (3), EL (3), GL (4)
BUTIR = {"IL": ["IL1", "IL2", "IL3"], "EL": ["EL1", "EL2", "EL3"], "GL": ["GL1", "GL2", "GL3", "GL4"]}


def analisis_beban(baris: list[dict]) -> dict:
    """CSV: kode_siswa, kondisi (mis. LKS / Aplikasi), IL1..IL3, EL1..EL3, GL1..GL4."""
    per_kondisi: dict[str, dict[str, list[float]]] = {}
    for b in baris:
        k = per_kondisi.setdefault(b["kondisi"], {"IL": [], "EL": [], "GL": []})
        for jenis, kolom in BUTIR.items():
            k[jenis].append(st.mean(float(b[c]) for c in kolom))
    hasil = []
    for kondisi, skor in per_kondisi.items():
        baris_hasil = {"kondisi": kondisi, "n": len(skor["IL"])}
        for jenis in BUTIR:
            baris_hasil[f"rata_{jenis}"] = round(st.mean(skor[jenis]), 2)
            baris_hasil[f"sd_{jenis}"] = round(st.stdev(skor[jenis]), 2) if len(skor[jenis]) > 1 else 0.0
        hasil.append(baris_hasil)
    return {"per_kondisi": hasil}


# ---------------------------------------------------------------- CLI


def baca_csv(jalur: Path) -> list[dict]:
    with jalur.open(encoding="utf-8-sig", newline="") as f:
        return [{k.strip(): (v or "").strip() for k, v in r.items()} for r in csv.DictReader(f)]


def tulis_csv(jalur: Path, baris: list[dict]) -> None:
    with jalur.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(baris[0].keys()))
        w.writeheader()
        w.writerows(baris)


def cetak_tabel(baris: list[dict]) -> None:
    kolom = list(baris[0].keys())
    lebar = {k: max(len(k), *(len(str(b[k])) for b in baris)) for k in kolom}
    print("  ".join(k.ljust(lebar[k]) for k in kolom))
    print("  ".join("-" * lebar[k] for k in kolom))
    for b in baris:
        print("  ".join(str(b[k]).ljust(lebar[k]) for k in kolom))


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("analisis", choices=["validasi", "ngain", "beban"])
    ap.add_argument("csv", type=Path)
    ap.add_argument("--keluaran", type=Path, help="simpan tabel hasil ke CSV")
    arg = ap.parse_args(argv)

    baris = baca_csv(arg.csv)
    if arg.analisis == "validasi":
        h = analisis_validasi(baris)
        tabel = h["per_aspek"]
        cetak_tabel(tabel)
        print(f"\nTotal: {h['total']}% → {h['kategori']}")
    elif arg.analisis == "ngain":
        h = analisis_ngain(baris)
        tabel = h["per_siswa"]
        cetak_tabel(tabel)
        print(f"\nRata-rata pretest {h['rata_pretest']}, posttest {h['rata_posttest']}, "
              f"N-gain {h['rata_n_gain']} → {h['kategori']}")
    else:
        h = analisis_beban(baris)
        tabel = h["per_kondisi"]
        cetak_tabel(tabel)
        print("\nHarapan: EL turun dan GL naik pada kondisi Aplikasi dibanding LKS.")

    if arg.keluaran:
        tulis_csv(arg.keluaran, tabel)
        print(f"Tersimpan: {arg.keluaran}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
