import type { Metadata } from 'next';
import './globals.css';
import ScrollReveal from '@/components/ScrollReveal';
import LayoutHooks from '@/components/LayoutHooks';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'AYF 2026 - Amravati Youth Festival',
  description: 'Frontend experience for Amravati Youth Festival 2026.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
        <ScrollReveal />
        <LayoutHooks />
      </body>
    </html>
  );
}
