import { FOTO, urlFoto, type FotoId } from '../content/gambar';

/** Foto/ilustrasi dunia nyata untuk soal berkonteks. Ditampilkan kecil agar tidak mengalihkan perhatian. */
export default function FotoKonteks({ id, className = '' }: { id: FotoId; className?: string }) {
  return (
    <img
      src={urlFoto(id, import.meta.env.BASE_URL)}
      alt={FOTO[id].alt}
      loading="lazy"
      className={`mx-auto max-h-40 w-auto rounded-2xl object-contain ${className}`}
    />
  );
}
