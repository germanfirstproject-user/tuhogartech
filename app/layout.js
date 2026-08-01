import './globals.css';
import '../styles/variables.css';
import { Inter, Fraunces } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/CookieConsent';
import { AuthProvider } from '@/contexts/AuthContext';
import { getSiteSettings } from '@/lib/supabase';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

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
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: settings?.site_url || 'https://tuhogartech.com',
      siteName: settings?.site_name || 'Tu Hogar Tech',
      title: settings?.home_og_title || settings?.home_title || defaultTitle,
      description: settings?.home_og_description || settings?.home_description || defaultDescription,
      images: settings?.home_og_image ? [
        {
          url: settings.home_og_image,
          width: 1200,
          height: 630,
          alt: settings?.site_name || 'Tu Hogar Tech',
        },
      ] : [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Tu Hogar Tech',
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
        {/* Ya no se abre conexión con los servidores de imágenes de Amazon:
            la web no carga ninguna. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body className={`${inter.variable} ${fraunces.variable}`}>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
