import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { categories } from "@/data/products";
import { ChevronRight } from "lucide-react";

const Category = () => {
  const { categoriaId } = useParams();
  const category = categories.find((c) => c.id === categoriaId);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Categoría no encontrada</p>
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
              <span className="font-medium">{category.name}</span>
            </div>
          </div>
        </div>

        {/* Category Header */}
        <section className="py-12 bg-gradient-to-b from-secondary to-background">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {category.description}
            </p>
          </div>
        </section>

        {/* Subcategories */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Explora por subcategoría</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/categoria/${categoriaId}/${subcategory.id}`}
                className="border-2 border-border bg-card hover:border-primary hover:shadow-lg transition-all p-8 group"
              >
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {subcategory.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ver todos los productos de {subcategory.name.toLowerCase()}
                </p>
                <div className="flex items-center text-primary font-medium">
                  Explorar
                  <ChevronRight className="ml-2 h-5 w-5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Category;
