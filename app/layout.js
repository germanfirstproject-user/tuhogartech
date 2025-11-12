import './globals.css';
import '../styles/variables.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'AffiliPro - Los mejores productos al mejor precio',
    template: '%s | AffiliPro',
  },
  description:
    'Reseñas honestas, comparativas detalladas y ofertas exclusivas para que tomes la mejor decisión de compra. Descubre los mejores productos de audio, informática y hogar.',
  keywords: ['auriculares', 'audio', 'productos', 'reseñas', 'comparativas', 'ofertas', 'afiliados'],
  authors: [{ name: 'AffiliPro' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://affilpro.com',
    siteName: 'AffiliPro',
    title: 'AffiliPro - Los mejores productos al mejor precio',
    description:
      'Reseñas honestas, comparativas detalladas y ofertas exclusivas para que tomes la mejor decisión de compra.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AffiliPro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AffiliPro',
    creator: '@AffiliPro',
    images: ['/og-image.png'],
  },
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
