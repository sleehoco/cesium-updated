import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from './providers';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import '@/styles/globals.css';
import { env } from '@/lib/env';

// Primary font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Display font for headings
const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
  weight: ['400', '700', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: 'CesiumCyber - Advanced Cybersecurity Solutions',
    template: '%s | CesiumCyber',
  },
  description:
    'Protect your digital assets with our comprehensive security solutions including penetration testing, vulnerability assessment, and incident response services.',
  keywords: [
    'cybersecurity',
    'penetration testing',
    'vulnerability assessment',
    'security consulting',
    'incident response',
    'cloud security',
    'data protection',
    'GDPR compliance',
    'HIPAA compliance',
  ],
  authors: [{ name: 'CesiumCyber' }],
  creator: 'CesiumCyber',
  publisher: 'CesiumCyber',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: env.NEXT_PUBLIC_APP_URL,
    siteName: 'CesiumCyber',
    title: 'CesiumCyber - Advanced Cybersecurity Solutions',
    description: 'Comprehensive security solutions for modern businesses',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CesiumCyber',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CesiumCyber - Advanced Cybersecurity Solutions',
    description: 'Comprehensive security solutions for modern businesses',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    // Add verification codes here when ready
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${orbitron.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
