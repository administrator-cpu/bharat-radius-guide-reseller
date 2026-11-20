'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useRef, useState, type FormEvent } from 'react';
import type { Shot } from '@/content/types';
import { SUPPORT } from '@/lib/ask/config';
import { ask, buildIndex, type Answer, type AskDoc, type Index } from '@/lib/ask/engine';
import { lexicon } from '@/lib/ask/lexicon';
import { askStore, useAsk } from '@/lib/ask/store';
import { cropOf, Overlay } from './Shot';

type Data = { audiences: { id: string; label: string }[]; docs: AskDoc[]; shots: Record<string, Shot> };
type Msg = { id: number; role: 'user'; text: string } | { id: number; role: 'bot'; answer: Answer; audience: string };

const SUGGESTIONS: Record<string, string[]> = {
  reseller: ['How do I recharge a customer?', 'Naya customer kaise jode?', 'Wallet top-up kaise mange?', 'Customer ka net nahi chal raha'],
  customer: ['Recharge kaise kare?', 'Net nahi chal raha', 'Plan kab tak hai?', 'Bill download'],
};
const FALLBACK: Record<string, string> = {
  reseller: 'Still stuck? Contact your ISP or the reseller above you.',
  customer: 'Still stuck? Call your internet provider. Their number is at the top of your account page and on your bills.',
};

let cache: Promise<{ data: Data; index: Index }> | null = null;
const loadIndex = () =>
  (cache ??= fetch('/ask-index.json')
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<Data>;
    })
    .then((data) => ({ data, index: buildIndex(data.docs, lexicon) }))
    .catch((e) => {
      cache = null;
      throw e;
    }));

const depth = () => (typeof document !== 'undefined' && document.documentElement.dataset.depth === 'short' ? 'short' : 'mid');

const MiniShot = memo(function MiniShot({ shot, id }: { shot: Shot; id: string }) {
  const phone = shot.width < 600;
  const c = phone ? { x: 0, y: 0, w: shot.width, h: shot.height } : cropOf(shot);
  return (
    <svg className={phone ? 'ask-shot ask-shot-phone' : 'ask-shot'} viewBox={`${c.x} ${c.y} ${c.w} ${c.h}`} aria-hidden="true">
      <image href={shot.src} width={shot.width} height={shot.height} />
      <Overlay shot={shot} id={`ask-${id}`} scale={Math.max(1, c.w / 520)} />
    </svg>
  );
});

function BotAnswer({ m, data, onNavigate }: { m: Extract<Msg, { role: 'bot' }>; data: Data; onNavigate: () => void }) {
  const { matches, elsewhere } = m.answer;
  const label = (a: string) => data.audiences.find((x) => x.id === a)?.label ?? a;
  if (!matches.length) {
    return (
      <div className="ask-bot">
        <p>I couldn’t find that in the guide. Try other words, like “recharge”, “wallet” or “complaint”.</p>
        {elsewhere ? <Elsewhere doc={elsewhere.doc} label={label(elsewhere.doc.a)} onNavigate={onNavigate} /> : null}
        <p className="ask-muted">{FALLBACK[m.audience]}</p>
        <Support />
      </div>
    );
  }
  const [top, ...rest] = matches;
  const doc = top!.doc;
  const shot = data.shots[doc.id];
  return (
    <div className="ask-bot">
      <p className="ask-kicker">{doc.section}</p>
      <p className="ask-title">{doc.title}</p>
      <p>{depth() === 'short' ? doc.short : doc.mid}</p>
      {shot ? (
        <Link href={`/${doc.a}/${doc.id}/`} className="ask-shot-link" onClick={onNavigate} aria-label={`Open ${doc.title}`}>
          <MiniShot shot={shot} id={`${m.id}`} />
        </Link>
      ) : null}
      {shot ? (
        <ol className="ask-marks">
          {shot.marks.map((k) => (
            <li key={k.n} className={`marks-${k.kind}`}>
              <span className="marks-num">{k.n}</span>
              {doc.marks[k.n - 1]}
            </li>
          ))}
        </ol>
      ) : null}
      <Link href={`/${doc.a}/${doc.id}/`} className="ask-open" onClick={onNavigate}>
        Open the full guide →
      </Link>
      {rest.length ? (
        <div className="ask-also">
          <span>Also see</span>
          {rest.map((r) => (
            <Link key={r.doc.id} href={`/${r.doc.a}/${r.doc.id}/`} onClick={onNavigate}>
              {r.doc.title}
            </Link>
          ))}
        </div>
      ) : null}
      {elsewhere ? <Elsewhere doc={elsewhere.doc} label={label(elsewhere.doc.a)} onNavigate={onNavigate} /> : null}
    </div>
  );
}

function Elsewhere({ doc, label, onNavigate }: { doc: AskDoc; label: string; onNavigate: () => void }) {
  return (
    <p className="ask-muted">
      In the {label} guide:{' '}
      <Link href={`/${doc.a}/${doc.id}/`} onClick={onNavigate}>
        {doc.title}
      </Link>
    </p>
  );
}

function Support() {
  if (!SUPPORT.phone && !SUPPORT.whatsapp && !SUPPORT.email) return null;
  return (
    <div className="ask-support">
      {SUPPORT.phone ? <a href={`tel:${SUPPORT.phone.replace(/\s/g, '')}`}>Call {SUPPORT.phone}</a> : null}
      {SUPPORT.whatsapp ? <a href={`https://wa.me/${SUPPORT.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a> : null}
      {SUPPORT.email ? <a href={`mailto:${SUPPORT.email}`}>Email</a> : null}
    </div>
  );
}

export default function AskPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  const fromPath = path.startsWith('/customer') ? 'customer' : 'reseller';
  const [audience, setAudience] = useState(fromPath);
  const [state, setState] = useState<{ data: Data; index: Index } | null>(null);
  const [error, setError] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const seq = useRef(0);
  const pendingId = useAsk((s) => s.pending?.id ?? 0, 0);

  useEffect(() => setAudience(fromPath), [fromPath]);

  useEffect(() => {
    loadIndex().then(setState, () => setError(true));
  }, []);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    const el = list.current;
    const q = el?.lastElementChild?.previousElementSibling as HTMLElement | null | undefined;
    if (el && q) el.scrollTo({ top: q.offsetTop - el.offsetTop - 8, behavior: 'smooth' });
  }, [msgs]);

  const send = (text: string) => {
    const t = text.trim().slice(0, 200);
    if (!t || !state) return;
    const answer = ask(state.index, t, audience);
    setMsgs((m) => [...m.slice(-18), { id: ++seq.current, role: 'user', text: t }, { id: ++seq.current, role: 'bot', answer, audience }]);
    setQ('');
  };
  useEffect(() => {
    if (!state || !pendingId) return;
    const p = askStore.takePending();
    if (p) send(p.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, pendingId]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(q);
  };
  const closeOnMobile = () => window.matchMedia('(max-width: 640px)').matches && onClose();

  return (
    <section className="ask-panel" role="dialog" aria-label="Ask the guide" hidden={!open}>
      <header className="ask-head">
        <div>
          <p className="ask-name">Ask the guide</p>
          <p className="ask-sub">Type in English or Hindi. Answers come from this guide.</p>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>
      <div className="ask-aud" role="radiogroup" aria-label="I am a">
        <span>I am a</span>
        {(state?.data.audiences ?? [{ id: 'reseller', label: 'Reseller' }, { id: 'customer', label: 'Customer' }]).map((a) => (
          <button key={a.id} type="button" role="radio" aria-checked={audience === a.id} onClick={() => setAudience(a.id)}>
            {a.label}
          </button>
        ))}
      </div>
      <div className="ask-list" ref={list} aria-live="polite">
        {msgs.length === 0 ? (
          <div className="ask-empty">
            <p>Ask anything about the {audience === 'customer' ? 'customer account' : 'reseller panel'}. For example:</p>
            <div className="ask-chips">
              {(SUGGESTIONS[audience] ?? []).map((s) => (
                <button key={s} type="button" onClick={() => send(s)} disabled={!state}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          msgs.map((m) =>
            m.role === 'user' ? (
              <p key={m.id} className="ask-user">
                {m.text}
              </p>
            ) : state ? (
              <BotAnswer key={m.id} m={m} data={state.data} onNavigate={closeOnMobile} />
            ) : null,
          )
        )}
        {error ? <p className="ask-muted">Couldn’t load the guide. Check your connection and reopen this box.</p> : null}
      </div>
      <form className="ask-form" onSubmit={onSubmit}>
        <input
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={state ? 'Type your question…' : 'Loading…'}
          aria-label="Your question"
          maxLength={200}
          enterKeyHint="send"
          disabled={!state}
        />
        <button type="submit" className="ask-send" disabled={!state || !q.trim()} aria-label="Send">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </form>
    </section>
  );
}
