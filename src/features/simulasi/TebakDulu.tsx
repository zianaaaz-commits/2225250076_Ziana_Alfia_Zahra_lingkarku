import { useCallback } from 'react';
import { useProgres } from '../../app/ProgresContext';
import CircleSVG from '../../components/CircleSVG';
import Kuis from '../../components/Kuis';
import { TEBAKAN, type Tebakan } from '../../content/tebakan';
import { luasJuring, panjangBusur, tampilAngka } from '../../lib/geometri';

const PI = '22/7' as const;

function GambarTebakan({ t, sudah }: { t: Tebakan; sudah: boolean }) {
  const nilai = (k: { r: number; alpha: number }) =>
    t.besaran === 'busur'
      ? `${tampilAngka(panjangBusur(k.alpha, k.r, PI))} cm`
      : `${tampilAngka(luasJuring(k.alpha, k.r, PI))} cm²`;

  return (
    <div className={`grid gap-2 ${sudah ? 'grid-cols-2' : 'grid-cols-1'}`}>
      <figure className="text-center">
        <figcaption className="font-semibold">Sebelum</figcaption>
        <CircleSVG
          {...t.sebelum}
          pi={PI}
          tampil={t.besaran}
          nilai={!sudah}
          className={`mx-auto w-full ${sudah ? '' : 'max-w-xs'}`}
        />
        {sudah && <p>{nilai(t.sebelum)}</p>}
      </figure>
      {sudah && (
        <figure className="text-center">
          <figcaption className="font-semibold">Sesudah</figcaption>
          <CircleSVG {...t.sesudah} pi={PI} tampil={t.besaran} nilai={false} className="w-full" />
          <p className="font-bold">{nilai(t.sesudah)}</p>
        </figure>
      )}
    </div>
  );
}

// Prediksi → cek: siswa menebak dulu, baru melihat hasilnya (IL02).
export default function TebakDulu() {
  const { tandai } = useProgres();
  const selesai = useCallback(() => tandai('simulasi'), [tandai]);
  return (
    <Kuis
      butir={TEBAKAN}
      onSelesai={selesai}
      label="Tebakan"
      gambar={(t, sudah) => <GambarTebakan t={t} sudah={sudah} />}
      akhir={() => <p className="text-gray-600">Busur & juring ikut membesar saat sudut membesar.</p>}
    />
  );
}
