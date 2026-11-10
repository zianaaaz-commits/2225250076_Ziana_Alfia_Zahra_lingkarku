import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Teks campuran: bagian di antara $...$ dirender dengan KaTeX,
 * bagian di antara **...** ditebalkan. Contoh: "Jadi **r = 14 cm**, karena $r^2 = 196$".
 */
export default function MathText({ teks, className = '' }: { teks: string; className?: string }) {
  const bagian = teks.split(/(\$[^$]+\$)/g);
  return (
    <span className={className}>
      {bagian.map((b, i) =>
        b.length > 1 && b.startsWith('$') && b.endsWith('$') ? (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(b.slice(1, -1), { throwOnError: false }),
            }}
          />
        ) : (
          <Tebal key={i} teks={b} />
        ),
      )}
    </span>
  );
}

function Tebal({ teks }: { teks: string }) {
  return (
    <>
      {teks
        .split(/(\*\*[^*]+\*\*)/g)
        .map((t, i) => (t.startsWith('**') && t.endsWith('**') ? <b key={i}>{t.slice(2, -2)}</b> : t))}
    </>
  );
}
