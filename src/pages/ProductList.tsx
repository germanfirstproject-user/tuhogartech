import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { categories, products } from "@/data/products";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRODUCTS_PER_PAGE = 12;

const ProductList = () => {
  const { categoriaId, subcategoriaId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = categories.find((c) => c.id === categoriaId);
  const subcategory = category?.subcategories.find((s) => s.id === subcategoriaId);

  const filteredProducts = products.filter(
    (p) => p.category === categoriaId && p.subcategory === subcategoriaId
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Categoría o subcategoría no encontrada</p>
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
                to={`/categoria/${categoriaId}`}
                className="hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium">{subcategory.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header with filters */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{subcategory.name}</h1>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-muted-foreground">
                {filteredProducts.length} productos encontrados
              </p>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="border-2"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filtros
                </Button>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px] border-2">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevancia</SelectItem>
                    <SelectItem value="rating">Mejor valorado</SelectItem>
                    <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Comparison CTA */}
          <div className="mt-12 p-8 bg-secondary border-2 border-border text-center">
            <h3 className="text-2xl font-bold mb-4">
              ¿No sabes cuál elegir?
            </h3>
            <p className="text-muted-foreground mb-6">
              Compara los mejores productos lado a lado
            </p>
            <Link to={`/comparativa/${subcategoriaId}`}>
              <Button size="lg" className="border-2">
                Ver comparativa completa
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductList;
