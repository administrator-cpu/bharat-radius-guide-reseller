import { Fragment, type ReactNode } from 'react';

/** Renders the plain-text "detailed" copy: blank-line paragraphs, "1." / "-" lists, indented continuation lines, "Tip:" callouts. */
export function Prose({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split('\n');
        const ordered = /^\d+\.\s/.test(lines[0]!);
        const bullet = /^-\s/.test(lines[0]!);
        if (ordered || bullet) {
          const items: string[][] = [];
          for (const l of lines) {
            if (/^(\d+\.|-)\s/.test(l)) items.push([l.replace(/^(\d+\.|-)\s/, '')]);
            else items[items.length - 1]?.push(l.trim());
          }
          const Tag = ordered ? 'ol' : 'ul';
          return (
            <Tag key={i}>
              {items.map(([first, ...rest], j) => (
                <li key={j}>
                  {inline(first!)}
                  {rest.map((r, k) => (
                    <Fragment key={k}>
                      <br />
                      {inline(r)}
                    </Fragment>
                  ))}
                </li>
              ))}
            </Tag>
          );
        }
        if (/^Tip:/.test(b)) return <p key={i} className="tip">{inline(b)}</p>;
        return (
          <p key={i}>
            {lines.map((l, k) => (
              <Fragment key={k}>
                {k ? <br /> : null}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

/** Bolds a leading "Label:" so step names stand out. */
function inline(s: string): ReactNode {
  const m = /^([A-Z][^:.]{1,40}):\s(.*)$/.exec(s);
  if (!m) return s;
  return (
    <>
      <strong>{m[1]}:</strong> {m[2]}
    </>
  );
}
