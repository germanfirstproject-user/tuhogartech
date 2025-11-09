import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t-2 border-border bg-secondary mt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Affiliate Disclosure */}
        <div className="bg-muted border-2 border-border p-4 mb-6">
          <p className="text-sm text-muted-foreground">
            <strong>⚠️ Aviso de afiliados:</strong> Este sitio participa en programas de afiliados (Amazon Associates y otros). 
            Podemos recibir una comisión por compras realizadas a través de nuestros enlaces, sin coste adicional para ti. 
            Esto nos ayuda a mantener el sitio y seguir ofreciendo contenido de calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">AffiliPro</h3>
            <p className="text-sm text-muted-foreground">
              Tu fuente confiable de reseñas y comparativas de productos para tomar la mejor decisión de compra.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categoria/audio" className="text-muted-foreground hover:text-primary transition-colors">
                  Audio
                </Link>
              </li>
              <li>
                <Link to="/categoria/informatica" className="text-muted-foreground hover:text-primary transition-colors">
                  Informática
                </Link>
              </li>
              <li>
                <Link to="/categoria/hogar" className="text-muted-foreground hover:text-primary transition-colors">
                  Hogar
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/comparativas" className="text-muted-foreground hover:text-primary transition-colors">
                  Comparativas
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Términos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AffiliPro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
