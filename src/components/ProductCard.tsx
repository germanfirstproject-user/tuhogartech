import { Link } from "react-router-dom";
import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="border-2 border-border bg-card hover:shadow-lg transition-shadow">
      <Link to={`/producto/${product.id}`}>
        <div className="aspect-square bg-muted overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviews_count})
          </span>
        </div>

        <div className="mb-3">
          <span className="text-2xl font-bold text-foreground">
            ${product.price}
          </span>
          <span className="text-sm text-muted-foreground ml-1">{product.currency}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {product.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="text-xs bg-muted px-2 py-1 border border-border"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block"
          >
            <Button className="w-full border-2" size="lg">
              Ver oferta
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <p className="text-xs text-center text-muted-foreground">
            Enlace de afiliado — sin coste adicional
          </p>
        </div>
      </div>
    </div>
  );
};
