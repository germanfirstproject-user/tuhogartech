import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

// ADMIN_EMAIL: Cambia este valor al email que quieras autorizar
const ADMIN_EMAIL = "admin@affilpro.com";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        // Guardar sesión en localStorage
        localStorage.setItem("admin_session", JSON.stringify({
          email: email.trim().toLowerCase(),
          token: `token_${Date.now()}`,
          timestamp: Date.now()
        }));

        toast({
          title: "Acceso autorizado",
          description: "Bienvenido al panel de administración",
        });

        navigate("/admin");
      } else {
        toast({
          title: "Acceso denegado",
          description: "Correo no autorizado. Solo administradores pueden acceder.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="border-2 border-border bg-card p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-primary/10 border-2 border-primary/20">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-center mb-2">
                Acceso Administrador
              </h1>
              <p className="text-center text-muted-foreground mb-8">
                Solo correos autorizados pueden acceder
              </p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-2"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full border-2"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Verificando..." : "Iniciar sesión"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-muted border-2 border-border text-sm">
                <p className="text-muted-foreground">
                  <strong>Nota de seguridad:</strong> El email autorizado se
                  define en el código. Para cambiar el administrador, actualiza
                  la variable ADMIN_EMAIL en el archivo AdminLogin.tsx
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
