import type { Shot as ShotData } from '@/content/types';

type Props = { shot: ShotData; labels: string[]; title: string; priority?: boolean };
type Box = { x: number; y: number; w: number; h: number };

/** Area around all marks, used as a zoomed view on small screens. */
function cropOf(shot: ShotData): Box {
  const pad = 48;
  let x0 = Math.min(...shot.marks.map((m) => m.x)) - pad;
  let y0 = Math.min(...shot.marks.map((m) => m.y)) - pad;
  let x1 = Math.max(...shot.marks.map((m) => m.x + m.w)) + pad;
  let y1 = Math.max(...shot.marks.map((m) => m.y + m.h)) + pad;
  const minW = 480, minH = 340;
  if (x1 - x0 < minW) { const c = (x0 + x1) / 2; x0 = c - minW / 2; x1 = c + minW / 2; }
  if (y1 - y0 < minH) { const c = (y0 + y1) / 2; y0 = c - minH / 2; y1 = c + minH / 2; }
  x0 = Math.max(0, x0); y0 = Math.max(0, y0);
  x1 = Math.min(shot.width, x1); y1 = Math.min(shot.height, y1);
  return { x: Math.round(x0), y: Math.round(y0), w: Math.round(x1 - x0), h: Math.round(y1 - y0) };
}

function Overlay({ shot, id, scale = 1 }: { shot: ShotData; id: string; scale?: number }) {
  const { width: W, height: H, marks } = shot;
  const r = 15 * scale;
  return (
    <>
      <defs>
        <mask id={id}>
          <rect width={W} height={H} fill="#fff" />
          {marks.map((m) => (
            <rect key={m.n} x={m.x} y={m.y} width={m.w} height={m.h} rx={8} fill="#000" />
          ))}
        </mask>
      </defs>
      <rect width={W} height={H} fill="rgba(21,36,94,0.38)" mask={`url(#${id})`} />
      {marks.map((m) => {
        const cx = Math.max(r + 2, m.x);
        const cy = Math.max(r + 2, m.y);
        return (
          <g key={m.n} className={`mk mk-${m.kind}`}>
            <rect x={m.x} y={m.y} width={m.w} height={m.h} rx={8} className="mk-ring" style={{ strokeWidth: 4 * scale }} />
            <circle cx={cx} cy={cy} r={r} className="mk-dot" />
            <text x={cx} y={cy} className="mk-num" style={{ fontSize: 17 * scale }} dominantBaseline="central" textAnchor="middle">
              {m.n}
            </text>
          </g>
        );
      })}
    </>
  );
}

/** Screenshot with dimmed background, outlined targets and numbered markers drawn as SVG on top. */
export function Shot({ shot, labels, title, priority }: Props) {
  const { width: W, height: H, marks } = shot;
  const key = shot.src.replace(/\W/g, '');
  const crop = cropOf(shot);
  const alt = `${title}: ${labels.map((l, i) => `${i + 1}. ${l}`).join(', ')}`;
  return (
    <figure className="shot">
      <a className="shot-frame shot-full" href={shot.src} target="_blank" rel="noopener" aria-label={`Open full-size screenshot: ${title}`}>
        <img src={shot.src} width={W} height={H} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />
        <svg viewBox={`0 0 ${W} ${H}`} className="shot-overlay" aria-hidden="true">
          <Overlay shot={shot} id={`f-${key}`} />
        </svg>
      </a>
      <a className="shot-frame shot-crop" href={shot.src} target="_blank" rel="noopener" aria-label={`Open full screen: ${title}`}>
        <svg viewBox={`${crop.x} ${crop.y} ${crop.w} ${crop.h}`} role="img" aria-label={alt} style={{ aspectRatio: `${crop.w} / ${crop.h}` }}>
          <image href={shot.src} width={W} height={H} />
          <Overlay shot={shot} id={`c-${key}`} scale={Math.max(1, crop.w / 700)} />
        </svg>
        <span className="crop-hint">Tap to see the whole screen</span>
      </a>
      <figcaption>
        <ol className="legend">
          {marks.map((m) => (
            <li key={m.n} className={`legend-${m.kind}`}>
              <span className="legend-num">{m.n}</span>
              <span>{labels[m.n - 1]}</span>
              <span className="legend-kind">{m.kind === 'click' ? 'click / type' : 'look here'}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
