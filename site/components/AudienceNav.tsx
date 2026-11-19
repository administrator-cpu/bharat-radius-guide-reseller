'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { id: string; label: string; ready: boolean };

/** Top-bar audience links; marks the audience whose pages are open. */
export function AudienceNav({ items, fallback }: { items: Item[]; fallback: string }) {
  const path = usePathname();
  const current = items.find((a) => path.startsWith(`/${a.id}/`) || path === `/${a.id}`)?.id ?? (path === '/' ? fallback : undefined);
  return (
    <nav className="topnav" aria-label="Who is this for">
      {items.map((a) =>
        a.ready ? (
          <Link key={a.id} href={`/${a.id}/`} aria-current={a.id === current ? 'page' : undefined}>
            {a.label}
          </Link>
        ) : (
          <span key={a.id} className="soon" aria-disabled="true" title="Coming soon">
            {a.label}
            <small>Soon</small>
          </span>
        ),
      )}
    </nav>
  );
}
