import { FOTO, type FotoId } from '../content/gambar';

/** Foto dunia nyata untuk soal berkonteks (mis. pizza). Ditampilkan kecil agar tidak mengalihkan perhatian. */
export default function FotoKonteks({ id, className = '' }: { id: FotoId; className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}gambar/${id}.webp`}
      alt={FOTO[id].alt}
      loading="lazy"
      className={`mx-auto max-h-40 w-auto rounded-2xl object-contain ${className}`}
    />
  );
}
