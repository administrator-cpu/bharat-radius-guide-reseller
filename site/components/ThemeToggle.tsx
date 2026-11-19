'use client';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { THEME_KEY as KEY } from '@/lib/boot';

type Theme = 'light' | 'dark';
const MQ = '(prefers-color-scheme: dark)';


const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};
const system = (): Theme => (window.matchMedia(MQ).matches ? 'dark' : 'light');
const effective = (): Theme => (document.documentElement.dataset.theme as Theme | undefined) ?? system();

/**
 * Follows the browser's light/dark setting by default. Clicking flips the theme; flipping back to what the
 * browser wants clears the override, so the site follows the browser again.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, effective, () => 'light' as Theme);

  useEffect(() => {
    const mq = window.matchMedia(MQ);
    mq.addEventListener('change', emit);
    return () => mq.removeEventListener('change', emit);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = effective() === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    try {
      if (next === system()) {
        delete root.dataset.theme;
        localStorage.removeItem(KEY);
      } else {
        root.dataset.theme = next;
        localStorage.setItem(KEY, next);
      }
    } catch {
      root.dataset.theme = next;
    }
    emit();
  }, []);

  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={label} title={label}>
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.6 8.6 0 1 0 11 11Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
