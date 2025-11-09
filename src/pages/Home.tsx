import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/products";
import { blogPosts } from "@/data/blog";
import { ArrowRight, TrendingUp } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary to-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Encuentra los mejores productos
                <span className="text-primary block mt-2">
                  al mejor precio
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Reseñas honestas, comparativas detalladas y ofertas exclusivas
                para que tomes la mejor decisión de compra
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/categoria/audio">
                  <Button size="lg" className="border-2">
                    Explorar productos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg" className="border-2">
                    Leer guías
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Categorías populares</h2>
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categoria/${category.id}`}
                className="border-2 border-border bg-card hover:border-primary hover:shadow-lg transition-all p-6 group"
              >
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub.id}
                      className="text-xs bg-muted px-2 py-1 border border-border"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Últimas guías y análisis</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.slice(0, 2).map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="border-2 border-border bg-card hover:border-primary hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.published_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/blog">
                <Button variant="outline" size="lg" className="border-2">
                  Ver todos los artículos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
