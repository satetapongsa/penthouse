import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://penthouse-walkthrough.vercel.app'),
  title: 'THE SKYLINE PENTHOUSE | 3D Luxury Architectural Walkthrough',
  description:
    'An immersive first-person 3D architectural walkthrough of an ultra-luxury ~280 m² skyline penthouse with 3.4m ceiling height, bright ivory travertine, and panoramic floor-to-ceiling glass.',
  keywords: [
    '3D Penthouse',
    'Architectural Walkthrough',
    'WebGL',
    'Three.js',
    'React Three Fiber',
    'Next.js',
    'Luxury Real Estate',
  ],
  authors: [{ name: 'Skyline Penthouse Architecture' }],
  openGraph: {
    title: 'THE SKYLINE PENTHOUSE | 3D Luxury Architectural Walkthrough',
    description:
      'An immersive first-person 3D architectural walkthrough of an ultra-luxury ~280 m² skyline penthouse with 3.4m ceiling height, bright ivory travertine, and panoramic floor-to-ceiling glass.',
    images: [
      {
        url: '/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'THE SKYLINE PENTHOUSE',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THE SKYLINE PENTHOUSE | 3D Luxury Architectural Walkthrough',
    description:
      'An immersive first-person 3D architectural walkthrough of an ultra-luxury ~280 m² skyline penthouse with 3.4m ceiling height, bright ivory travertine, and panoramic floor-to-ceiling glass.',
    images: ['/og-banner.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FAF8F3',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#FAF8F3] text-neutral-900 select-none overflow-hidden touch-none">
        {children}
      </body>
    </html>
  );
}
