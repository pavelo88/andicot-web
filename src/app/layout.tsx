import type {Metadata} from 'next';
import './globals.css';
import { defaultSiteContent } from '@/lib/defaults';

export const metadata: Metadata = {
  title: defaultSiteContent.seo.title,
  description: defaultSiteContent.seo.description,
  keywords: defaultSiteContent.seo.keywords,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                // Forzamos dark por defecto si no hay nada guardado o si es 'dark'
                if (!theme || theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `,
        }} />
      </head>
      <body className="font-body antialiased bg-background text-foreground transition-colors duration-500">
        {children}
      </body>
    </html>
  );
}
