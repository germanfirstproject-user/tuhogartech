import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";
import { Star, ExternalLink, Check, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { productoId } = useParams();
  const product = products.find((p) => p.id === productoId);

  const relatedProducts = product
    ? products.filter(
        (p) =>
          p.subcategory === product.subcategory &&
          p.id !== product.id
      ).slice(0, 3)
    : [];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Producto no encontrado</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="border-b-2 border-border bg-secondary">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Link to="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                to={`/categoria/${product.category}`}
                className="hover:text-primary transition-colors"
              >
                {product.category}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium truncate">{product.title}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Product Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image */}
            <div className="aspect-square bg-muted border-2 border-border overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating} ({product.reviews_count} reseñas)
                </span>
              </div>

              <p className="text-lg text-muted-foreground mb-6">
                {product.description}
              </p>

              <div className="bg-primary/5 border-2 border-primary/20 p-6 mb-6">
                <div className="mb-4">
                  <span className="text-4xl font-bold">${product.price}</span>
                  <span className="text-muted-foreground ml-2">{product.currency}</span>
                </div>

                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <Button size="lg" className="w-full border-2 text-lg py-6">
                    Ver oferta en Amazon
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Precio y disponibilidad en el vendedor • Enlace de afiliado
                </p>
              </div>

              <div className="border-2 border-border p-4">
                <h3 className="font-semibold mb-3">Características destacadas</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pros & Cons */}
          {(product.pros || product.cons) && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Ventajas y desventajas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.pros && (
                  <div className="border-2 border-border p-6 bg-green-50 dark:bg-green-950/20">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                      <Check className="h-6 w-6 text-green-600" />
                      Pros
                    </h3>
                    <ul className="space-y-2">
                      {product.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.cons && (
                  <div className="border-2 border-border p-6 bg-red-50 dark:bg-red-950/20">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                      <X className="h-6 w-6 text-red-600" />
                      Contras
                    </h3>
                    <ul className="space-y-2">
                      {product.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">✗</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Specs Table */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Especificaciones técnicas</h2>
            <div className="border-2 border-border overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? "bg-muted/50" : "bg-background"}
                    >
                      <td className="font-semibold p-4 border-r-2 border-border w-1/3">
                        {key}
                      </td>
                      <td className="p-4">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Comparison */}
          {relatedProducts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">
                Comparar con productos similares
              </h2>
              <div className="border-2 border-border overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-4 text-left border-r-2 border-border">
                        Característica
                      </th>
                      <th className="p-4 text-left border-r-2 border-border bg-primary/10">
                        {product.title}
                      </th>
                      {relatedProducts.map((p) => (
                        <th
                          key={p.id}
                          className="p-4 text-left border-r-2 border-border last:border-r-0"
                        >
                          {p.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t-2 border-border">
                      <td className="p-4 font-semibold border-r-2 border-border">
                        Precio
                      </td>
                      <td className="p-4 border-r-2 border-border bg-primary/5">
                        ${product.price}
                      </td>
                      {relatedProducts.map((p) => (
                        <td
                          key={p.id}
                          className="p-4 border-r-2 border-border last:border-r-0"
                        >
                          ${p.price}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t-2 border-border">
                      <td className="p-4 font-semibold border-r-2 border-border">
                        Valoración
                      </td>
                      <td className="p-4 border-r-2 border-border bg-primary/5">
                        {product.rating} ⭐
                      </td>
                      {relatedProducts.map((p) => (
                        <td
                          key={p.id}
                          className="p-4 border-r-2 border-border last:border-r-0"
                        >
                          {p.rating} ⭐
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t-2 border-border">
                      <td className="p-4 font-semibold border-r-2 border-border">
                        Batería
                      </td>
                      <td className="p-4 border-r-2 border-border bg-primary/5">
                        {product.specs["Duración batería"]}
                      </td>
                      {relatedProducts.map((p) => (
                        <td
                          key={p.id}
                          className="p-4 border-r-2 border-border last:border-r-0"
                        >
                          {p.specs["Duración batería"]}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t-2 border-border">
                      <td className="p-4 border-r-2 border-border"></td>
                      <td className="p-4 border-r-2 border-border bg-primary/5">
                        <a
                          href={product.affiliate_link}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                        >
                          <Button size="sm" className="w-full">Ver oferta</Button>
                        </a>
                      </td>
                      {relatedProducts.map((p) => (
                        <td
                          key={p.id}
                          className="p-4 border-r-2 border-border last:border-r-0"
                        >
                          <a
                            href={p.affiliate_link}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                          >
                            <Button variant="outline" size="sm" className="w-full">
                              Ver oferta
                            </Button>
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-center mt-6">
                <Link to={`/comparativa/${product.subcategory}`}>
                  <Button variant="outline" size="lg" className="border-2">
                    Ver comparativa completa
                  </Button>
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
