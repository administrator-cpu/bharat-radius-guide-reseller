import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { AskLauncher } from '@/components/AskLauncher';
import { AudienceNav } from '@/components/AudienceNav';
import { Search } from '@/components/Search';
import { ThemeToggle } from '@/components/ThemeToggle';
import { bootScript } from '@/lib/boot';
import { AUDIENCES, DEFAULT_AUDIENCE, searchIndex } from '@/lib/content';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Bharat Radius Guide', template: '%s · Bharat Radius Guide' },
  description: 'Step-by-step help for the Bharat Radius panel, with screenshots that show exactly where to click.',
  icons: { icon: '/mark.png' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f11' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const index = searchIndex();
  return (
    <html lang="en" data-depth="mid" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="logo">
              <img src="/mark.png" alt="" width={18} height={23} />
              <span>Bharat Radius Guide</span>
            </Link>
            <Search index={index} />
            <AudienceNav items={AUDIENCES.map(({ id, label, ready }) => ({ id, label, ready }))} fallback={DEFAULT_AUDIENCE} />
            <div className="top-actions">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="foot">Screens use sample data. Your panel may show fewer menus, depending on your role.</footer>
        <AskLauncher />
      </body>
    </html>
  );
}
