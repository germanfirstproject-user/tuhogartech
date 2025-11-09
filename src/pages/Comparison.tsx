import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronRight } from "lucide-react";

const Comparison = () => {
  const { subcategoriaId } = useParams();

  const filteredProducts = products.filter(
    (p) => p.subcategory === subcategoriaId
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>No hay productos para comparar en esta subcategoría</p>
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
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium">
                Comparativa {subcategoriaId}
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">
            Comparativa de {subcategoriaId}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comparamos los mejores productos para ayudarte a elegir rápido.
            Analizamos precio, batería, características y relación calidad-precio.
          </p>

          {/* Comparison Table */}
          <div className="border-2 border-border overflow-x-auto mb-8">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left border-r-2 border-border sticky left-0 bg-muted z-10">
                    Característica
                  </th>
                  {filteredProducts.map((product) => (
                    <th
                      key={product.id}
                      className="p-4 text-left border-r-2 border-border last:border-r-0 min-w-[200px]"
                    >
                      {product.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t-2 border-border">
                  <td className="p-4 font-semibold border-r-2 border-border sticky left-0 bg-background z-10">
                    Imagen
                  </td>
                  {filteredProducts.map((product) => (
                    <td key={product.id} className="p-4 border-r-2 border-border last:border-r-0">
                      <Link to={`/producto/${product.id}`}>
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-32 h-32 object-cover border-2 border-border hover:border-primary transition-colors"
                        />
                      </Link>
                    </td>
                  ))}
                </tr>

                <tr className="border-t-2 border-border bg-muted/50">
                  <td className="p-4 font-semibold border-r-2 border-border sticky left-0 bg-muted/50 z-10">
                    Precio
                  </td>
                  {filteredProducts.map((product) => (
                    <td key={product.id} className="p-4 border-r-2 border-border last:border-r-0">
                      <span className="text-2xl font-bold">${product.price}</span>
                    </td>
                  ))}
                </tr>

                <tr className="border-t-2 border-border">
                  <td className="p-4 font-semibold border-r-2 border-border sticky left-0 bg-background z-10">
                    Valoración
                  </td>
                  {filteredProducts.map((product) => (
                    <td key={product.id} className="p-4 border-r-2 border-border last:border-r-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold">{product.rating}</span>
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews_count})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-t-2 border-border bg-muted/50">
                  <td className="p-4 font-semibold border-r-2 border-border sticky left-0 bg-muted/50 z-10">
                    Batería
                  </td>
                  {filteredProducts.map((product) => (
                    <td key={product.id} className="p-4 border-r-2 border-border last:border-r-0">
                      {product.specs["Duración batería"]}
                    </td>
                  ))}
                </tr>

                <tr className="border-t-2 border-border">
                  <td className="p-4 font-semibold border-r-2 border-border sticky left-0 bg-background z-10">
                    ANC
                  </td>
                  {filteredProducts.map((product) => (
                    <td key={product.id} className="p-4 border-r-2 border-border last:border-r-0">
                      {product.specs["Cancelación de ruido"]}
                    </td>
                  ))}
                </tr>

                <tr className="border-t-2 border-border bg-muted/50">
                  <td className="p-4 font-semibold border-r-2 border-border sticky left-0 bg-muted/50 z-10">
                    Recomendado para
                  </td>
                  {filteredProducts.map((product) => (
                    <td key={product.id} className="p-4 border-r-2 border-border last:border-r-0">
                      {product.id === "p-1001" && "Teletrabajo / Presupuesto"}
                      {product.id === "p-1002" && "Audiófilos / Larga duración"}
                      {product.id === "p-1003" && "Uso casual"}
                    </td>
                  ))}
                </tr>

                <tr className="border-t-2 border-border">
                  <td className="p-4 border-r-2 border-border sticky left-0 bg-background z-10"></td>
                  {filteredProducts.map((product) => (
                    <td key={product.id} className="p-4 border-r-2 border-border last:border-r-0">
                      <a
                        href={product.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="block mb-2"
                      >
                        <Button className="w-full">
                          Ver oferta
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                      <Link to={`/producto/${product.id}`}>
                        <Button variant="outline" className="w-full border-2">
                          Ver detalles
                        </Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-secondary border-2 border-border p-8">
            <h2 className="text-2xl font-bold mb-4">Conclusión</h2>
            <p className="text-lg mb-4">
              Si buscas la <strong>mejor relación calidad/precio</strong>, los{" "}
              <Link to="/producto/p-1001" className="text-primary hover:underline font-semibold">
                XSound Pro
              </Link>{" "}
              ofrecen ANC efectivo a menor precio.
            </p>
            <p className="text-lg">
              Si priorizas <strong>duración y comodidad</strong>, los{" "}
              <Link to="/producto/p-1002" className="text-primary hover:underline font-semibold">
                OpenAir Comfort
              </Link>{" "}
              son mejores aunque más caros.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Comparison;
