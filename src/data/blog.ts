export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  published_at: string;
  image?: string;
  related_products?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "b-2001",
    title: "Los 7 mejores auriculares inalámbricos para teletrabajo",
    excerpt: "Si pasas horas en llamadas, necesitas cancelación de ruido y comodidad. Descubre nuestras recomendaciones top.",
    content: `
      <p>En este artículo comparamos los mejores auriculares del mercado para trabajar desde casa. Si tu día a día incluye videoconferencias interminables y necesitas concentrarte sin distracciones, has llegado al lugar correcto.</p>
      
      <h2>¿Qué buscar en auriculares para teletrabajo?</h2>
      <p>Para teletrabajo prioriza <strong>ANC (cancelación activa de ruido)</strong> y un <strong>micrófono claro</strong>. La comodidad también es crucial si los vas a usar más de 4 horas al día.</p>
      
      <h2>Nuestras recomendaciones</h2>
      <p>Nuestra primera recomendación son los <a href="/producto/p-1001" class="text-primary hover:underline font-semibold">Auriculares Inalámbricos XSound Pro</a> por su equilibrio precio/rendimiento. Con cancelación de ruido efectiva y 20 horas de batería, son perfectos para jornadas largas.</p>
      
      <p>Si puedes invertir más, los <a href="/producto/p-1002" class="text-primary hover:underline font-semibold">OpenAir Comfort</a> ofrecen mayor comodidad y 24 horas de batería. La conectividad multipunto te permite cambiar entre ordenador y móvil sin complicaciones.</p>
      
      <h2>Comparativa rápida</h2>
      <p>Para uso casual o presupuesto ajustado, los <a href="/producto/p-1003" class="text-primary hover:underline font-semibold">Budget Sound</a> son una opción económica, aunque sin ANC.</p>
      
      <p class="text-sm text-muted-foreground mt-4">💡 <strong>Nota:</strong> Si compras a través de nuestros enlaces apoyas el sitio sin coste adicional (recibimos una comisión).</p>
    `,
    tags: ["auriculares", "teletrabajo", "audio"],
    published_at: "2025-01-12",
    image: "/placeholder.svg",
    related_products: ["p-1001", "p-1002", "p-1003"]
  },
  {
    id: "b-2002",
    title: "Cómo elegir auriculares con cancelación de ruido",
    excerpt: "La tecnología ANC puede cambiar tu experiencia de audio. Te explicamos qué buscar y qué modelos destacan.",
    content: `
      <p>La cancelación activa de ruido (ANC) no es solo un lujo — es una herramienta esencial para concentrarte en entornos ruidosos.</p>
      
      <h2>¿Cómo funciona el ANC?</h2>
      <p>La tecnología ANC usa micrófonos externos para captar ruido ambiente y genera una onda de sonido inversa que lo cancela. Los mejores modelos bloquean hasta 90% del ruido externo.</p>
      
      <p>Los <a href="/producto/p-1001" class="text-primary hover:underline font-semibold">XSound Pro</a> ofrecen excelente ANC a precio competitivo, mientras que los <a href="/producto/p-1002" class="text-primary hover:underline font-semibold">OpenAir Comfort</a> añaden modos de transparencia para cuando necesitas escuchar tu entorno.</p>
      
      <p class="text-sm text-muted-foreground mt-4">💡 <strong>Nota:</strong> Este sitio participa en programas de afiliados. Podemos recibir comisión por compras realizadas a través de nuestros enlaces.</p>
    `,
    tags: ["auriculares", "anc", "tecnología"],
    published_at: "2025-01-10",
    image: "/placeholder.svg",
    related_products: ["p-1001", "p-1002"]
  }
];
