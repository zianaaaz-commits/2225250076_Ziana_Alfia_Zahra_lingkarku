"""Unit test alat Python. Jalankan: python -m unittest discover python/tests"""

import sys
import unittest
import wave
from fractions import Fraction as F
from pathlib import Path

AKAR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(AKAR))

import analisis_penelitian as ap  # noqa: E402
import buat_lagu  # noqa: E402
import periksa_kunci as pk  # noqa: E402

CONTOH = AKAR / "data" / "contoh"


class TestPeriksaKunci(unittest.TestCase):
    def test_rumus_dasar_eksak(self):
        self.assertEqual(pk.hitung({"r": 14, "alpha": 90, "pi": "22/7"}, "busur"), 22)
        self.assertEqual(pk.hitung({"r": 10, "alpha": 72, "pi": "3.14"}, "juring"), F("62.8"))
        self.assertEqual(pk.hitung({"d": 28, "alpha": 45, "pi": "22/7"}, "juring"), 77)

    def test_soal_invers_dan_perbandingan(self):
        self.assertEqual(pk.hitung({"busur": 44, "r": 21, "pi": "22/7"}, "sudutDariBusur"), 120)
        self.assertEqual(pk.hitung({"luas": 77, "alpha": 45, "pi": "22/7"}, "jariDariJuring"), 14)
        self.assertEqual(pk.hitung({"nilai1": 10, "alpha1": 60, "alpha2": 150, "pi": "22/7"}, "perbandingan"), 25)
        self.assertEqual(pk.hitung({"r": 14, "alpha": 90, "pi": "22/7"}, "kelilingJuring"), 50)

    def test_kunci_salah_terdeteksi(self):
        butir = [{"sumber": "uji", "id": "X", "data": {"r": 7, "alpha": 90, "pi": "22/7"}, "ditanya": "busur", "kunci": 12}]
        self.assertEqual(len(pk.periksa(butir)), 1)

    def test_konten_aplikasi(self):
        """Memeriksa konten nyata bila sudah diekspor (npm run periksa:python)."""
        if not pk.DATA.exists():
            self.skipTest("konten.json belum diekspor")
        import json

        self.assertEqual(pk.periksa(json.loads(pk.DATA.read_text(encoding="utf-8"))), [])


class TestAnalisis(unittest.TestCase):
    def test_ngain(self):
        self.assertAlmostEqual(ap.n_gain(40, 80), 40 / 60)
        self.assertIsNone(ap.n_gain(100, 100))
        self.assertEqual(ap.kategori_ngain(0.7), "Tinggi")
        self.assertEqual(ap.kategori_ngain(0.5), "Sedang")
        self.assertEqual(ap.kategori_ngain(0.1), "Rendah")

    def test_validasi_contoh(self):
        h = ap.analisis_validasi(ap.baca_csv(CONTOH / "validasi_ahli_materi.csv"))
        self.assertEqual(h["total"], 84.0)  # 42 / 50
        self.assertEqual(h["kategori"], "Sangat valid")

    def test_beban_contoh(self):
        h = {r["kondisi"]: r for r in ap.analisis_beban(ap.baca_csv(CONTOH / "beban_kognitif.csv"))["per_kondisi"]}
        self.assertLess(h["Aplikasi"]["rata_EL"], h["LKS"]["rata_EL"])
        self.assertGreater(h["Aplikasi"]["rata_GL"], h["LKS"]["rata_GL"])

    def test_cli(self):
        self.assertEqual(ap.main(["ngain", str(CONTOH / "pretest_posttest.csv")]), 0)


class TestLagu(unittest.TestCase):
    def test_frekuensi(self):
        self.assertAlmostEqual(buat_lagu.frekuensi("A4"), 440.0)
        self.assertAlmostEqual(buat_lagu.frekuensi("C5"), 523.2511, places=3)

    def test_berkas_lagu(self):
        if not buat_lagu.KELUARAN.exists():
            self.skipTest("lagu belum dibuat")
        with wave.open(str(buat_lagu.KELUARAN)) as w:
            self.assertEqual(w.getframerate(), buat_lagu.LAJU_SAMPEL)
            self.assertEqual(w.getnchannels(), 1)
            self.assertEqual(w.getnframes(), buat_lagu.jumlah_sampel())


if __name__ == "__main__":
    unittest.main()
