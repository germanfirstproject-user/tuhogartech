import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { blogPosts } from "@/data/blog";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { ChevronRight, Clock, Calendar } from "lucide-react";

const BlogPost = () => {
  const { postId } = useParams();
  const post = blogPosts.find((p) => p.id === postId);

  const relatedProducts = post?.related_products
    ? products.filter((p) => post.related_products?.includes(p.id))
    : [];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Post no encontrado</p>
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
              <Link to="/blog" className="hover:text-primary transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium truncate">{post.title}</span>
            </div>
          </div>
        </div>

        <article className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm bg-primary/10 text-primary px-3 py-1 border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(post.published_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>5 min de lectura</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="max-w-5xl mx-auto mb-12">
              <div className="aspect-video bg-muted border-2 border-border overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div
            className="max-w-3xl mx-auto prose prose-lg prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="max-w-7xl mx-auto mt-16">
              <div className="bg-secondary border-2 border-border p-8">
                <h2 className="text-3xl font-bold mb-6">
                  Productos mencionados en este artículo
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-12 p-8 bg-primary/5 border-2 border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-4">¿Te ha resultado útil?</h3>
            <p className="text-muted-foreground mb-6">
              Explora más artículos y comparativas en nuestro blog
            </p>
            <Link to="/blog">
              <button className="px-6 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors border-2 border-primary">
                Ver más artículos
              </button>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
