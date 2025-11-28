import './globals.css';
import '../styles/variables.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { AuthProvider } from '@/contexts/AuthContext';
import { getSiteSettings } from '@/lib/supabase';

const inter = Inter({ subsets: ['latin'] });

// Generar metadata dinámica desde la base de datos
export async function generateMetadata() {
  const result = await getSiteSettings();
  const settings = result.success && result.data ? result.data : null;

  // Valores por defecto si no hay configuración
  const defaultTitle = 'TuHogarTech - Los mejores productos al mejor precio';
  const defaultDescription = 'Reseñas honestas, comparativas detalladas y ofertas exclusivas para que tomes la mejor decisión de compra.';
  
  return {
    title: {
      default: settings?.home_title || defaultTitle,
      template: `%s | ${settings?.site_name || 'TuHogarTech'}`,
    },
    description: settings?.home_description || defaultDescription,
    keywords: settings?.home_keywords?.split(',').map(k => k.trim()) || ['productos', 'reseñas', 'comparativas', 'ofertas', 'tecnología', 'hogar'],
    authors: [{ name: settings?.site_name || 'TuHogarTech' }],
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icon.png', type: 'image/png', sizes: '256x256' },
      ],
      apple: '/icon.png',
    },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: settings?.site_url || 'https://affilpro.com',
      siteName: settings?.site_name || 'AffiliPro',
      title: settings?.home_og_title || settings?.home_title || defaultTitle,
      description: settings?.home_og_description || settings?.home_description || defaultDescription,
      images: settings?.home_og_image ? [
        {
          url: settings.home_og_image,
          width: 1200,
          height: 630,
          alt: settings?.site_name || 'AffiliPro',
        },
      ] : [
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
      title: settings?.home_twitter_title || settings?.home_title || defaultTitle,
      description: settings?.home_twitter_description || settings?.home_description || defaultDescription,
      images: settings?.home_twitter_image ? [settings.home_twitter_image] : ['/og-image.png'],
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect para recursos externos críticos */}
        <link rel="preconnect" href="https://m.media-amazon.com" />
        <link rel="preconnect" href="https://images-na.ssl-images-amazon.com" />
        <link rel="dns-prefetch" href="https://m.media-amazon.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
