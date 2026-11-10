// Penanda sementara untuk modul yang belum dibuat (Sprint 1–4).
export default function SegeraHadir({ judul }: { judul: string }) {
  return (
    <section className="py-10 text-center">
      <h1 className="mb-2 text-2xl font-bold">{judul}</h1>
      <p className="text-gray-600">Bagian ini sedang dibuat.</p>
    </section>
  );
}
