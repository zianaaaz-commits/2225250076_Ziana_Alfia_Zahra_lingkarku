"""Membuat kunci tanda tangan APK (PKCS#12) untuk rilis LingkarKu.

Kunci ini TIDAK boleh masuk ke repositori. Simpan baik-baik: jika hilang,
APK versi berikutnya tidak bisa memperbarui aplikasi yang sudah terpasang.

Jalankan:  pip install cryptography
           python python/buat_kunci_android.py
Hasil:     %USERPROFILE%/.lingkarku/lingkarku-rilis.p12  (+ kata sandi di file .txt)
"""

from __future__ import annotations

import datetime as dt
import secrets
from pathlib import Path

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID

ALIAS = "lingkarku"
FOLDER = Path.home() / ".lingkarku"
KUNCI = FOLDER / "lingkarku-rilis.p12"
SANDI = FOLDER / "kata-sandi-kunci.txt"


def main() -> None:
    if KUNCI.exists():
        print(f"Kunci sudah ada: {KUNCI} (tidak ditimpa)")
        return
    FOLDER.mkdir(parents=True, exist_ok=True)
    sandi = secrets.token_urlsafe(24)
    kunci = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    nama = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, "LingkarKu"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "Ziana Alfia Zahra"),
        x509.NameAttribute(NameOID.COUNTRY_NAME, "ID"),
    ])
    sekarang = dt.datetime.now(dt.timezone.utc)
    sertifikat = (
        x509.CertificateBuilder()
        .subject_name(nama)
        .issuer_name(nama)
        .public_key(kunci.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(sekarang - dt.timedelta(days=1))
        .not_valid_after(sekarang + dt.timedelta(days=365 * 30))
        .sign(kunci, hashes.SHA256())
    )
    data = pkcs12.serialize_key_and_certificates(
        ALIAS.encode(), kunci, sertifikat, None, serialization.BestAvailableEncryption(sandi.encode())
    )
    KUNCI.write_bytes(data)
    SANDI.write_text(f"alias: {ALIAS}\nkata sandi: {sandi}\n", encoding="utf-8")
    print(f"✓ Kunci dibuat: {KUNCI}")
    print(f"✓ Kata sandi disimpan: {SANDI}")
    print("  SIMPAN CADANGAN kedua file ini di tempat aman (mis. flashdisk/Google Drive pribadi).")


if __name__ == "__main__":
    main()
