import { redirect } from 'next/navigation';
import { getCategories } from '@/lib/supabase';

// Revalidar cada 5 minutos (300 segundos)
export const revalidate = 300;

export async function generateStaticParams() {
  const result = await getCategories();
  const categories = result.success ? result.data : [];
  
  // Solo generar rutas para categorías activas con productos
  const activeCategories = categories.filter(cat => cat.is_active && cat.product_count > 0);

  return activeCategories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }) {
  // Redirigir a la nueva ruta
  return {
    title: 'Redirigiendo...',
  };
}

export default async function ProductsByCategoryPage({ params }) {
  // Esta ruta está deprecada, redirigir a /categoria/[slug]
  redirect(`/categoria/${params.category}`);
}
