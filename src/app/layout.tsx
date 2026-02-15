import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
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
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: 'CesiumCyber - Cybersecurity & Compliance for Maryland Businesses',
    template: '%s | CesiumCyber',
  },
  description:
    'Expert cybersecurity and compliance services for Maryland businesses. HIPAA, CMMC, PCI-DSS compliance, penetration testing, and managed security from Columbia, MD.',
  keywords: [
    'cybersecurity',
    'penetration testing',
    'vulnerability assessment',
    'security consulting',
    'incident response',
    'cloud security',
    'data protection',
    'HIPAA compliance',
    'CMMC compliance',
    'PCI-DSS',
    'Maryland cybersecurity',
    'cybersecurity consulting Maryland',
    'Columbia MD cybersecurity',
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
    title: 'CesiumCyber - Cybersecurity & Compliance for Maryland Businesses',
    description: 'Expert cybersecurity and compliance services for Maryland businesses. HIPAA, CMMC, PCI-DSS compliance, penetration testing, and managed security from Columbia, MD.',
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
    title: 'CesiumCyber - Cybersecurity & Compliance for Maryland Businesses',
    description: 'Expert cybersecurity and compliance services for Maryland businesses. HIPAA, CMMC, PCI-DSS compliance, penetration testing, and managed security from Columbia, MD.',
    images: ['/og-image.png'],
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
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
