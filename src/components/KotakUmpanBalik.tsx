import type { ReactNode } from 'react';

export default function KotakUmpanBalik({ benar, children }: { benar: boolean; children: ReactNode }) {
  return (
    <div
      role="status"
      className={`rounded-xl border-l-4 bg-gray-50 p-4 ${benar ? 'border-benar' : 'border-salah'}`}
    >
      <p className="font-bold">{benar ? '✓ Tepat!' : 'Belum tepat.'}</p>
      {children}
    </div>
  );
}
