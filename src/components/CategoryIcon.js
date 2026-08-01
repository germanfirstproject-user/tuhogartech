/**
 * Iconos de categoría, en trazo y sobre una rejilla de 24×24.
 *
 * Se pintan con `currentColor`, así que el color lo decide quien los use.
 * Mismo grosor de línea en todos para que el catálogo se lea como un sistema
 * y no como una colección de dibujos sueltos.
 */

const TRAZOS = {
  energia: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,

  casa: (
    <>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M12 20v-5" />
      <circle cx="12" cy="12.5" r="1.5" />
    </>
  ),

  streaming: (
    <>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8" />
      <path d="M10.5 8.5 15 10.75l-4.5 2.25z" />
    </>
  ),

  disco: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),

  etiquetas: (
    <>
      <rect x="3" y="6" width="18" height="9" rx="1.5" />
      <path d="M7 15v3.5h10V15" />
      <path d="M7 9.5h6" />
    </>
  ),

  proyector: (
    <>
      <rect x="2" y="7" width="15" height="10" rx="2" />
      <circle cx="8.5" cy="12" r="3" />
      <path d="M17 10.5 22 8v8l-5-2.5" />
    </>
  ),

  planta: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.3-2.7-6-6-6 0 3.3 2.7 6 6 6z" />
      <path d="M12 13c0-3.9 3.1-7 7-7 0 3.9-3.1 7-7 7z" />
      <path d="M7 21h10" />
    </>
  ),

  escudo: (
    <>
      <path d="M12 3 5 6v6c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),

  escaner: (
    <>
      <rect x="3" y="9" width="18" height="7" rx="1.5" />
      <path d="M6 9V5.5h12V9" />
      <path d="M7 19h10" />
      <path d="M3 12.5h18" />
    </>
  ),

  papel: (
    <>
      <path d="M7 3h7l4 4v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 16.5h4" />
    </>
  ),

  conector: (
    <>
      <rect x="3" y="10" width="18" height="8" rx="2" />
      <path d="M7 10V6M12 10V4M17 10V6" />
      <path d="M8 14h8" />
    </>
  ),

  vr: (
    <>
      <rect x="2" y="8" width="20" height="9" rx="3" />
      <path d="M12 17c-.8-1.6-1.6-2.4-2.6-2.4S7.5 15.4 6.7 17" />
      <path d="M12 17c.8-1.6 1.6-2.4 2.6-2.4s1.9.8 2.7 2.4" />
      <path d="M6 8V6.5h12V8" />
    </>
  ),

  portatil: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 19h20" />
      <path d="M10 19h4" />
    </>
  ),

  camara: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <circle cx="12" cy="12.5" r="3.6" />
      <path d="M7.5 6V4.5h5V6" />
      <circle cx="17.5" cy="9.5" r=".9" />
    </>
  ),

  impresora: (
    <>
      <rect x="4" y="9" width="16" height="7" rx="1.5" />
      <path d="M7 9V4h10v5" />
      <path d="M7 16v4h10v-4" />
      <path d="M17.5 11.5h.01" />
    </>
  ),

  plotter: (
    <>
      <rect x="2" y="7" width="20" height="6" rx="1.5" />
      <path d="M5 13v7M19 13v7" />
      <path d="M6 17h12" />
      <path d="M9 10h6" />
    </>
  ),

  comedero: (
    <>
      <path d="M4 12h16l-1.5 6a2 2 0 0 1-2 1.5h-9A2 2 0 0 1 5.5 18z" />
      <path d="M9 12V6a3 3 0 0 1 6 0v6" />
      <path d="M12 3.5v2" />
    </>
  ),

  bateria: (
    <>
      <rect x="2" y="7" width="17" height="10" rx="2" />
      <path d="M21.5 10.5v3" />
      <path d="M11 9.5 8.5 13H12l-1 2.5" />
    </>
  ),

  altavoz: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="15" r="3.2" />
      <circle cx="12" cy="7.5" r="1.4" />
    </>
  ),

  caja: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" />
    </>
  ),
};

export default function CategoryIcon({ nombre, className, size }) {
  const trazo = TRAZOS[nombre] || TRAZOS.caja;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {trazo}
    </svg>
  );
}
