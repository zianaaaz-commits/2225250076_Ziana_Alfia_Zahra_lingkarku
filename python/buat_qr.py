"""Membuat kode QR menuju alamat web LingkarKu (untuk dicetak/ditayangkan di kelas).

Jalankan:  pip install -r python/requirements.txt
           python python/buat_qr.py
Hasil:     public/qr-lingkarku.svg  (ditampilkan di halaman "Pasang Aplikasi")
"""

from pathlib import Path

import qrcode
import qrcode.image.svg

URL_WEB = "https://zianaaaz-commits.github.io/lingkarku/"
KELUARAN = Path(__file__).resolve().parent.parent / "public" / "qr-lingkarku.svg"


def main() -> None:
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=2)
    qr.add_data(URL_WEB)
    qr.make(fit=True)
    gambar = qr.make_image(image_factory=qrcode.image.svg.SvgPathFillImage)
    KELUARAN.parent.mkdir(parents=True, exist_ok=True)
    gambar.save(str(KELUARAN))
    print(f"✓ {KELUARAN.name} → {URL_WEB}")


if __name__ == "__main__":
    main()
