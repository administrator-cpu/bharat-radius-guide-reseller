'use client';
import { useCallback, useSyncExternalStore } from 'react';
import { DEPTH_KEY as KEY } from '@/lib/boot';

export const DEPTHS = [
  { id: 'short', label: 'Short' },
  { id: 'mid', label: 'Mid' },
  { id: 'detailed', label: 'Detailed' },
] as const;
type Depth = (typeof DEPTHS)[number]['id'];


const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};
const read = (): Depth => (document.documentElement.dataset.depth as Depth) || 'mid';

export function DepthToggle() {
  const depth = useSyncExternalStore(subscribe, read, () => 'mid' as Depth);
  const set = useCallback((d: Depth) => {
    document.documentElement.dataset.depth = d;
    try {
      localStorage.setItem(KEY, d);
    } catch {}
    listeners.forEach((fn) => fn());
  }, []);
  return (
    <div className="depth" role="radiogroup" aria-label="How much detail">
      {DEPTHS.map((d) => (
        <button key={d.id} type="button" role="radio" aria-checked={depth === d.id} onClick={() => set(d.id)}>
          {d.label}
        </button>
      ))}
    </div>
  );
}
