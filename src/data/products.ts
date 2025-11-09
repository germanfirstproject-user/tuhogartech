export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  currency: string;
  rating: number;
  reviews_count: number;
  images: string[];
  features: string[];
  specs: Record<string, string>;
  affiliate_link: string;
  category: string;
  subcategory: string;
  stock: "in_stock" | "out_of_stock" | "limited";
  description?: string;
  pros?: string[];
  cons?: string[];
}

export const products: Product[] = [
  {
    id: "p-1001",
    title: "Auriculares Inalámbricos XSound Pro",
    brand: "XSound",
    price: 79.99,
    currency: "USD",
    rating: 4.6,
    reviews_count: 1245,
    images: ["/placeholder.svg"],
    features: ["ANC", "20h batería", "Carga rápida"],
    specs: {
      peso: "250g",
      bluetooth: "5.2",
      "Tipo de conectividad": "Inalámbrico",
      "Duración batería": "20 horas",
      "Cancelación de ruido": "Sí (ANC)"
    },
    affiliate_link: "https://www.amazon.com/dp/XYZ?tag=TU-AFF_ID",
    category: "audio",
    subcategory: "auriculares",
    stock: "in_stock",
    description: "Cancelación activa de ruido, batería 20h, almohadillas ergonómicas — ideales para llamadas y música.",
    pros: [
      "Excelente cancelación de ruido activa",
      "Batería de larga duración (20h)",
      "Precio competitivo",
      "Carga rápida en 15 minutos"
    ],
    cons: [
      "Almohadillas pueden ser incómodas después de 3+ horas",
      "Sin estuche premium incluido"
    ]
  },
  {
    id: "p-1002",
    title: "Auriculares OpenAir Comfort",
    brand: "OpenAir",
    price: 129.0,
    currency: "USD",
    rating: 4.7,
    reviews_count: 3012,
    images: ["/placeholder.svg"],
    features: ["Sonido Hi-Fi", "24h batería", "Conectividad multipunto"],
    specs: {
      peso: "220g",
      bluetooth: "5.3",
      "Tipo de conectividad": "Inalámbrico",
      "Duración batería": "24 horas",
      "Cancelación de ruido": "Sí (ANC)"
    },
    affiliate_link: "https://www.amazon.com/dp/ABC?tag=TU-AFF_ID",
    category: "audio",
    subcategory: "auriculares",
    stock: "in_stock",
    description: "Sonido equilibrado, perfil ligero, conectividad multipunto.",
    pros: [
      "Sonido de alta calidad para audiófilos",
      "Batería excepcional (24h)",
      "Muy cómodos para uso prolongado",
      "Conectividad multipunto (2 dispositivos)"
    ],
    cons: [
      "Precio más elevado",
      "App móvil poco intuitiva"
    ]
  },
  {
    id: "p-1003",
    title: "Auriculares Budget Sound",
    brand: "Budget",
    price: 59.0,
    currency: "USD",
    rating: 4.2,
    reviews_count: 892,
    images: ["/placeholder.svg"],
    features: ["Bluetooth 5.0", "15h batería", "Diseño plegable"],
    specs: {
      peso: "280g",
      bluetooth: "5.0",
      "Tipo de conectividad": "Inalámbrico",
      "Duración batería": "15 horas",
      "Cancelación de ruido": "No"
    },
    affiliate_link: "https://www.amazon.com/dp/DEF?tag=TU-AFF_ID",
    category: "audio",
    subcategory: "auriculares",
    stock: "in_stock",
    description: "Auriculares económicos para uso casual.",
    pros: [
      "Precio muy accesible",
      "Diseño plegable para transporte",
      "Buen sonido para el precio"
    ],
    cons: [
      "Sin cancelación de ruido",
      "Batería limitada",
      "Construcción plástica"
    ]
  }
];

export const categories = [
  {
    id: "audio",
    name: "Audio",
    description: "Auriculares, altavoces y accesorios de audio",
    subcategories: [
      { id: "auriculares", name: "Auriculares" },
      { id: "altavoces", name: "Altavoces" },
      { id: "microfonos", name: "Micrófonos" }
    ]
  },
  {
    id: "informatica",
    name: "Informática",
    description: "Ordenadores, periféricos y accesorios",
    subcategories: [
      { id: "portatiles", name: "Portátiles" },
      { id: "teclados", name: "Teclados" },
      { id: "ratones", name: "Ratones" }
    ]
  },
  {
    id: "hogar",
    name: "Hogar",
    description: "Electrodomésticos y productos para el hogar",
    subcategories: [
      { id: "aspiradoras", name: "Aspiradoras" },
      { id: "cafeteras", name: "Cafeteras" },
      { id: "purificadores", name: "Purificadores" }
    ]
  }
];
