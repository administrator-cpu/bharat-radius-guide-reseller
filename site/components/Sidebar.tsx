import Link from 'next/link';
import type { Audience } from '@/lib/content';

function Groups({ a, current }: { a: Audience; current?: string }) {
  return a.sections.map((s) => (
    <div key={s.id} className="nav-group">
      <p className="nav-label">{s.title}</p>
      <ul>
        {s.topics.map((t) => (
          <li key={t.id}>
            <Link href={`/${a.id}/${t.id}/`} aria-current={t.id === current ? 'page' : undefined}>
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ));
}

/** Left navigation: a fixed column on desktop, a collapsible "Menu" on phones. */
export function Sidebar({ a, current, currentSection }: { a: Audience; current?: string; currentSection?: string }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-desk" aria-label="Guide topics">
        <p className="nav-label">Overview</p>
        <ul className="nav-overview">
          <li>
            <Link href={`/${a.id}/`} aria-current={!current ? 'page' : undefined}>
              All {a.label.toLowerCase()} topics
            </Link>
          </li>
        </ul>
        <Groups a={a} current={current} />
      </nav>
      <details className="sidebar-mob">
        <summary>
          Menu{currentSection ? <span> · {currentSection}</span> : null}
        </summary>
        <Groups a={a} current={current} />
      </details>
    </aside>
  );
}
