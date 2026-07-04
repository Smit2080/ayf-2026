import type { Metadata } from 'next';
import './globals.css';
import ScrollReveal from '@/components/ScrollReveal';
import LayoutHooks from '@/components/LayoutHooks';

export const metadata: Metadata = {
  title: 'AYF 2026 - Amravati Youth Festival',
  description: 'Frontend experience for Amravati Youth Festival 2026.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ScrollReveal />
        <LayoutHooks />
      </body>
    </html>
  );
}
