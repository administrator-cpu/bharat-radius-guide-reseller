'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SearchEntry } from '@/lib/content';

const norm = (s: string) => s.toLowerCase().normalize('NFKD');

export function Search({ index }: { index: SearchEntry[] }) {
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const prepared = useMemo(() => index.map((e) => ({ e, title: norm(e.title), body: norm(e.text) })), [index]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 120);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        ev.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const words = norm(debounced).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return prepared
      .map(({ e, title, body }) => {
        let score = 0;
        for (const w of words) {
          if (title.includes(w)) score += 3;
          else if (body.includes(w)) score += 1;
          else return null;
        }
        return { e, score };
      })
      .filter((x): x is { e: SearchEntry; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [debounced, prepared]);

  return (
    <div className="search" onBlur={(ev) => !ev.currentTarget.contains(ev.relatedTarget) && setOpen(false)}>
      <input
        ref={input}
        type="search"
        placeholder="Search the guide  ( / )"
        aria-label="Search the guide"
        value={q}
        onChange={(ev) => {
          setQ(ev.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && debounced ? (
        <ul className="search-results" role="listbox">
          {results.length ? (
            results.map(({ e }) => (
              <li key={e.a + e.id}>
                <Link href={`/${e.a}/${e.id}/`} onClick={() => setOpen(false)}>
                  <span className="sr-title">{e.title}</span>
                  <span className="sr-section">
                    {e.audience} · {e.section}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="sr-empty">Nothing found. Try another word, like “recharge” or “wallet”.</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
