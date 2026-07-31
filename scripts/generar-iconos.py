"""Versiones en mapa de bits del icono de Tu Hogar Tech.

Reproduce las mismas formas que app/icon.svg para que el favicon .ico, el
icono de Apple y la tarjeta social sean coherentes con el SVG.
"""
from PIL import Image, ImageDraw, ImageFont

VIRIDIAN = (22, 99, 85)
VIR_DARK = (15, 76, 65)
PAPER    = (250, 249, 246)
AMBER    = (217, 161, 59)
MUTED    = (139, 135, 121)

FONTS = "/mnt/skills/examples/canvas-design/canvas-fonts/"
SS = 4  # supersampling


def draw_mark(d, x, y, size, rounded=True):
    """Dibuja el icono a escala dentro de un cuadro de lado `size` en (x, y)."""
    u = size / 100.0
    def P(*pts):
        return [(x + a * u, y + b * u) for a, b in pts]

    if rounded:
        d.rounded_rectangle([x, y, x + size, y + size], radius=22 * u, fill=VIRIDIAN)

    # Chimenea (el tejado la recorta al dibujarse después)
    d.rounded_rectangle([x + 61 * u, y + 20 * u, x + 74 * u, y + 46 * u],
                        radius=2 * u, fill=PAPER)
    # Tejado con alero volado
    d.polygon(P((50, 13.5), (88, 45.4), (86.5, 48), (13.5, 48), (12, 45.4)), fill=PAPER)
    # Cuerpo
    d.rounded_rectangle([x + 24 * u, y + 50 * u, x + 76 * u, y + 83 * u],
                        radius=5 * u, fill=PAPER)
    d.rectangle([x + 24 * u, y + 50 * u, x + 76 * u, y + 62 * u], fill=PAPER)
    # Línea de alero
    d.rectangle([x + 24 * u, y + 50 * u, x + 76 * u, y + 51.6 * u], fill=(226, 231, 228))
    # Rayo
    d.polygon(P((53.6, 52), (38.4, 71.2), (50.6, 71.2), (48.9, 82.6),
                (64.6, 64.2), (52.4, 64.2)), fill=AMBER)


def icon(size, rounded=True):
    img = Image.new("RGBA", (size * SS, size * SS), (0, 0, 0, 0))
    draw_mark(ImageDraw.Draw(img), 0, 0, size * SS, rounded)
    return img.resize((size, size), Image.LANCZOS)


def build_favicon(path):
    # Un .ico multi-tamaño: el navegador elige el que mejor le encaja
    sizes = [16, 24, 32, 48, 64, 128, 256]
    base = icon(256)
    base.save(path, format="ICO", sizes=[(s, s) for s in sizes])
    print(f"  {path} ({', '.join(str(s) for s in sizes)})")


def build_apple(path, size=180):
    # Apple no aplica esquinas redondeadas: fondo completo hasta el borde
    img = Image.new("RGB", (size * SS, size * SS), VIRIDIAN)
    draw_mark(ImageDraw.Draw(img), 0, 0, size * SS, rounded=False)
    img.resize((size, size), Image.LANCZOS).save(path, "PNG")
    print(f"  {path} ({size}x{size})")


def build_og(path, w=1200, h=630):
    img = Image.new("RGB", (w * SS, h * SS), PAPER)
    d = ImageDraw.Draw(img)

    # Franja verde inferior: ancla la composición y recoge la marca
    band_y = 474
    d.rectangle([0, band_y * SS, w * SS, h * SS], fill=VIRIDIAN)

    mark = 168
    draw_mark(d, 96 * SS, 92 * SS, mark * SS)

    title = ImageFont.truetype(FONTS + "Lora-Bold.ttf", 82 * SS)
    lead = ImageFont.truetype(FONTS + "WorkSans-Regular.ttf", 34 * SS)
    small = ImageFont.truetype(FONTS + "WorkSans-Bold.ttf", 23 * SS)

    d.text((96 * SS, 296 * SS), "Tu Hogar Tech", font=title, fill=VIR_DARK)
    d.text((96 * SS, 398 * SS),
           "Tecnología para casa, contada sin exagerar", font=lead, fill=(95, 92, 82))

    label = "ANÁLISIS  ·  COMPARATIVAS  ·  SIN CIFRAS INFLADAS"
    # Etiqueta centrada verticalmente en la franja
    lb = d.textbbox((0, 0), label, font=small)
    ly = band_y * SS + ((h - band_y) * SS - (lb[3] - lb[1])) / 2 - lb[1]
    d.text((96 * SS, ly), label, font=small, fill=PAPER)

    # Filete ámbar como acento de marca
    d.rectangle([96 * SS, 272 * SS, 200 * SS, 278 * SS], fill=AMBER)

    img.resize((w, h), Image.LANCZOS).save(path, "PNG", optimize=True)
    print(f"  {path} ({w}x{h})")


if __name__ == "__main__":
    R = "/home/user/tuhogartech/"
    print("Generando iconos:")
    build_favicon(R + "public/favicon.ico")
    build_apple(R + "app/apple-icon.png")
    build_og(R + "public/og-image.png")
    icon(512).save(R + "public/icon-512.png", "PNG")
    print("  public/icon-512.png (512x512)")
