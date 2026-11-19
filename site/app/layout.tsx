import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { DepthToggle, depthBootScript } from '@/components/DepthToggle';
import { Search } from '@/components/Search';
import { AUDIENCES, searchIndex } from '@/lib/content';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Bharat Radius Guide', template: '%s · Bharat Radius Guide' },
  description: 'Step-by-step help for the Bharat Radius panel, with screenshots that show exactly where to click.',
  icons: { icon: '/mark.png' },
};

export const viewport: Viewport = { themeColor: '#15245e', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const index = searchIndex();
  return (
    <html lang="en" data-depth="mid" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: depthBootScript }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="top">
          <div className="top-inner">
            <Link href="/" className="brand">
              <img src="/mark.png" alt="" width={22} height={28} />
              <span>
                Bharat Radius <em>Guide</em>
              </span>
            </Link>
            <nav className="audiences" aria-label="Who is this for">
              {AUDIENCES.map((a) =>
                a.ready ? (
                  <Link key={a.id} href={`/${a.id}/`} className="aud">
                    {a.label}
                  </Link>
                ) : (
                  <span key={a.id} className="aud aud-soon" aria-disabled="true" title="Coming soon">
                    {a.label} <small>soon</small>
                  </span>
                ),
              )}
            </nav>
            <Search index={index} />
            <DepthToggle />
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="foot">Screens shown use sample data. Your panel may show fewer menus, depending on your role.</footer>
      </body>
    </html>
  );
}
