import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { varian?: 'utama' | 'kedua' };

export default function Tombol({ varian = 'utama', className = '', type = 'button', ...rest }: Props) {
  const gaya =
    varian === 'utama'
      ? 'bg-aksi text-white hover:bg-blue-700 disabled:bg-gray-300'
      : 'border border-gray-300 bg-white hover:bg-gray-50 disabled:text-gray-400';
  return (
    <button
      type={type}
      className={`min-h-12 rounded-xl px-4 font-semibold ${gaya} ${className}`}
      {...rest}
    />
  );
}
