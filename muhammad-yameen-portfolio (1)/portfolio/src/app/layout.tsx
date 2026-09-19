import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import ScrollProgress from '@/components/layout/ScrollProgress';
import CustomCursor from '@/components/layout/CustomCursor';
import PageTransition from '@/components/layout/PageTransition';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhammadyameen.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Muhammad Yameen — AI Video Creator & Software Developer',
  description:
    'Muhammad Yameen creates AI-powered Claymation videos, cinematic visual content, and modern web applications.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Muhammad Yameen — AI Video Creator & Software Developer',
    description:
      'AI-powered Claymation videos, creative visual content and modern web applications.',
    url: siteUrl,
    siteName: 'Muhammad Yameen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Yameen — AI Video Creator & Software Developer',
    description:
      'AI-powered Claymation videos, creative visual content and modern web applications.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-ink-950 text-bone selection:bg-bronze">
        <div className="grain-overlay" aria-hidden="true" />
        <ScrollProgress />
        <CustomCursor />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
