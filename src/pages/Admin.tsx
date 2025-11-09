import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Package, LogOut } from "lucide-react";
import { blogPosts } from "@/data/blog";
import { products } from "@/data/products";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) {
      toast({
        title: "Acceso no autorizado",
        description: "Debes iniciar sesión como administrador",
        variant: "destructive",
      });
      navigate("/login-admin");
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="border-b-2 border-border bg-secondary">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Panel de Administración</h1>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="blog" className="w-full">
            <TabsList className="border-2">
              <TabsTrigger value="blog" className="gap-2">
                <FileText className="h-4 w-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                Productos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blog" className="mt-6">
              <div className="border-2 border-border bg-card">
                <div className="p-6 border-b-2 border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Artículos del blog</h2>
                    <Button className="border-2">Crear nuevo artículo</Button>
                  </div>
                </div>

                <div className="divide-y-2 divide-border">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                          <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                          <div className="flex gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 border border-primary/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-2">
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm" className="border-2">
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              <div className="border-2 border-border bg-card">
                <div className="p-6 border-b-2 border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Productos</h2>
                    <Button className="border-2">Añadir producto</Button>
                  </div>
                </div>

                <div className="divide-y-2 divide-border">
                  {products.map((product) => (
                    <div key={product.id} className="p-6 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-20 h-20 object-cover border-2 border-border"
                          />
                          <div>
                            <h3 className="text-lg font-bold">{product.title}</h3>
                            <p className="text-muted-foreground">
                              ${product.price} • {product.category} • {product.subcategory}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm">⭐ {product.rating}</span>
                              <span className="text-sm text-muted-foreground">
                                ({product.reviews_count} reseñas)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-2">
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm" className="border-2">
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-6 bg-muted border-2 border-border">
            <h3 className="font-bold mb-2">⚙️ Configuración actual</h3>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Email autorizado:</strong> El definido en ADMIN_EMAIL (AdminLogin.tsx)
            </p>
            <p className="text-sm text-muted-foreground">
              Para cambiar el email autorizado, edita la constante ADMIN_EMAIL en
              src/pages/AdminLogin.tsx
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
