import { useSyncExternalStore } from 'react';

// Shared state between the search box and the chat column. Kept outside React so both can read it
// without a provider, and so only the components that use a slice re-render.

type State = { opened: boolean; open: boolean; askMode: boolean; pending: { id: number; text: string } | null };

const KEY = 'guide-ask-mode';
let state: State = { opened: false, open: false, askMode: true, pending: null };
let seq = 0;
const listeners = new Set<() => void>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  if (typeof document !== 'undefined') {
    if (state.open) document.documentElement.dataset.ask = 'open';
    else delete document.documentElement.dataset.ask;
  }
  listeners.forEach((fn) => fn());
}

if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem(KEY) === 'off') state = { ...state, askMode: false };
  } catch {}
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};

export function useAsk<T>(pick: (s: State) => T, server: T): T {
  return useSyncExternalStore(subscribe, () => pick(state), () => server);
}

export const askStore = {
  openPanel: () => set({ opened: true, open: true }),
  close: () => set({ open: false }),
  toggle: () => set({ opened: true, open: !state.open }),
  ask: (text: string) => set({ opened: true, open: true, pending: { id: ++seq, text } }),
  takePending: () => {
    const p = state.pending;
    if (p) state = { ...state, pending: null };
    return p;
  },
  setAskMode: (on: boolean) => {
    try {
      localStorage.setItem(KEY, on ? 'on' : 'off');
    } catch {}
    set({ askMode: on });
  },
};
