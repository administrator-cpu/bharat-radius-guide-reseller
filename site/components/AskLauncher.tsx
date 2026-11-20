'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const load = () => import('./AskPanel');
const AskPanel = dynamic(load, { ssr: false, loading: () => <div className="ask-panel ask-skeleton" aria-hidden="true" /> });

/** Floating "Ask" button. The chat panel's code and data are only downloaded the first time it opens. */
export function AskLauncher() {
  const [opened, setOpened] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '?' && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? '')) {
        e.preventDefault();
        setOpened(true);
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {opened ? <AskPanel open={open} onClose={close} /> : null}
      <button
        type="button"
        className="ask-fab"
        aria-expanded={open}
        aria-label={open ? 'Close help chat' : 'Ask a question'}
        onPointerEnter={() => void load()}
        onFocus={() => void load()}
        onClick={() => {
          setOpened(true);
          setOpen((o) => !o);
        }}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9.5 8.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.7-.9 1.3M12 13.6v.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>Ask</span>
          </>
        )}
      </button>
    </>
  );
}
