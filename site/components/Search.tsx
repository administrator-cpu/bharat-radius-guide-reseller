'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { askStore, useAsk } from '@/lib/ask/store';
import type { SearchEntry } from '@/lib/content';

const norm = (s: string) => s.toLowerCase().normalize('NFKD');
const warmChat = () => void import('./AskPanel');

export function Search({ index }: { index: SearchEntry[] }) {
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);
  const askMode = useAsk((s) => s.askMode, true);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const prepared = useMemo(() => index.map((e) => ({ e, title: norm(e.title), body: norm(e.text) })), [index]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 120);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? '')) {
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
      .slice(0, askMode ? 6 : 8);
  }, [debounced, prepared, askMode]);

  const sendToChat = (text: string) => {
    askStore.ask(text.trim());
    setOpen(false);
    setQ('');
    input.current?.blur();
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const text = q.trim();
    if (!text) return;
    if (askMode) return sendToChat(text);
    const first = results[0];
    if (first) {
      setOpen(false);
      router.push(`/${first.e.a}/${first.e.id}/`);
    }
  };

  return (
    <form
      className={askMode ? 'search search-ask' : 'search'}
      role="search"
      onSubmit={onSubmit}
      onBlur={(ev) => !ev.currentTarget.contains(ev.relatedTarget) && setOpen(false)}
    >
      <input
        ref={input}
        type="search"
        placeholder={askMode ? 'Search or ask a question  ( / )' : 'Search the guide  ( / )'}
        aria-label={askMode ? 'Search the guide or ask a question' : 'Search the guide'}
        value={q}
        enterKeyHint={askMode ? 'send' : 'search'}
        onChange={(ev) => {
          setQ(ev.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          if (askMode) warmChat();
        }}
      />
      <button
        type="button"
        className="ask-toggle"
        aria-pressed={askMode}
        title={askMode ? 'Ask is on: Enter opens the answer in the chat' : 'Ask is off: Enter opens the first result'}
        onClick={() => {
          askStore.setAskMode(!askMode);
          input.current?.focus();
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="M12 3l1.8 4.9L18.7 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5.3 9.7l4.9-1.8Z M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" fill="currentColor" />
        </svg>
        Ask
      </button>
      {open && debounced ? (
        <ul className="search-results" role="listbox">
          {askMode ? (
            <li className="sr-ask">
              <button type="submit">
                <span className="sr-ask-icon" aria-hidden="true">↵</span>
                <span>
                  <span className="sr-title">Ask: “{q.trim()}”</span>
                  <span className="sr-section">Get the answer with the marked screenshot in the chat</span>
                </span>
              </button>
            </li>
          ) : null}
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
          ) : askMode ? null : (
            <li className="sr-empty">Nothing found. Try another word, like “recharge” or “wallet”.</li>
          )}
        </ul>
      ) : null}
    </form>
  );
}
