"""Portadas editoriales para el carrusel de TuHogarTech.

Sin texto: los titulares viven en el HTML (mejor SEO, responsive y accesibilidad).
Estilo: campos de color planos de la paleta de marca, motivo geométrico
asimétrico, filetes finos y grano sutil para evitar el aspecto vectorial plano.
"""
import math, random
from PIL import Image, ImageDraw, ImageFilter

W, H = 1200, 800
SS = 2                      # supersampling para bordes limpios
PAPER      = (250, 249, 246)
PAPER_WARM = (243, 241, 234)
VIRIDIAN   = (22, 99, 85)
VIR_DARK   = (15, 76, 65)
VIR_LIGHT  = (61, 133, 119)
VIR_PALE   = (230, 239, 236)
INK        = (29, 28, 24)
AMBER      = (217, 161, 59)
BORDER     = (207, 202, 186)


def canvas(bg):
    return Image.new("RGB", (W * SS, H * SS), bg)


def finish(img, name, grain=7):
    img = img.resize((W, H), Image.LANCZOS)
    # Grano: ruido monocromo muy leve. Es lo que separa una pieza "impresa"
    # de un vector plano de banco de imágenes.
    rnd = random.Random(hash(name) & 0xFFFF)
    noise = Image.new("L", (W, H))
    noise.putdata([128 + int(rnd.gauss(0, grain)) for _ in range(W * H)])
    noise = noise.filter(ImageFilter.GaussianBlur(0.4))
    img = Image.blend(img, Image.merge("RGB", (noise, noise, noise)), 0.045)
    img.save(f"{name}.webp", "WEBP", quality=92, method=6)
    print(f"  {name}.webp")


def s(v):
    return int(v * SS)


# ── 1. Baterías y energía: arcos concéntricos de carga ────────────────────
def energia():
    img = canvas(VIRIDIAN)
    d = ImageDraw.Draw(img)
    # Ondas concéntricas ancladas en la esquina inferior izquierda: energía
    # que se propaga, sin caer en el arcoíris de arcos centrados.
    cx, cy = s(W * 0.06), s(H * 1.02)
    for r, col, wid in [(1.35, VIR_LIGHT, 3), (1.10, VIR_LIGHT, 3),
                        (0.88, VIR_LIGHT, 3), (0.68, VIR_LIGHT, 3)]:
        rr = s(H * r)
        d.arc([cx - rr, cy - rr, cx + rr, cy + rr], 265, 355, fill=col, width=s(wid))
    # Gráfico de barras: nivel de carga creciente, con el pico en ámbar
    bx, base = s(W * 0.14), s(H * 0.80)
    for i, hgt in enumerate([0.14, 0.23, 0.31, 0.42, 0.52, 0.30, 0.19]):
        x = bx + i * s(86)
        col = AMBER if i == 4 else (PAPER_WARM if i > 4 else VIR_PALE)
        d.rounded_rectangle([x, base - s(H * hgt), x + s(52), base],
                            radius=s(26), fill=col)
    d.line([(s(W * 0.14), base + s(34)), (s(W * 0.86), base + s(34))],
           fill=VIR_LIGHT, width=s(2))
    # Rayo: único elemento figurativo, recortado en la esquina superior
    lx, ly, k = s(W * 0.845), s(H * 0.14), s(1)
    d.polygon([(lx, ly), (lx - 74 * k, ly + 132 * k), (lx - 14 * k, ly + 132 * k),
               (lx - 52 * k, ly + 250 * k), (lx + 78 * k, ly + 96 * k),
               (lx + 10 * k, ly + 96 * k), (lx + 54 * k, ly)], fill=AMBER)
    finish(img, "hub-energia")


# ── 2. Smart Home: malla de nodos conectados ──────────────────────────────
def smarthome():
    img = canvas(VIR_DARK)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, s(W), s(H * 0.16)], fill=VIRIDIAN)
    cols, rows = 5, 4
    ox, oy, gx, gy = s(W * 0.16), s(H * 0.30), s(180), s(140)
    pts = [(ox + c * gx, oy + r * gy) for r in range(rows) for c in range(cols)]
    for r in range(rows):
        for c in range(cols):
            i = r * cols + c
            if c < cols - 1 and (r + c) % 3 != 2:
                d.line([pts[i], pts[i + 1]], fill=VIR_LIGHT, width=s(2))
            if r < rows - 1 and (r + c) % 4 != 3:
                d.line([pts[i], pts[i + cols]], fill=VIR_LIGHT, width=s(2))
    hero = {7, 12}
    for i, (x, y) in enumerate(pts):
        rr = s(20) if i in hero else s(11)
        col = AMBER if i in hero else PAPER_WARM
        d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=col)
        if i in hero:
            d.ellipse([x - s(34), y - s(34), x + s(34), y + s(34)], outline=AMBER, width=s(2))
    finish(img, "hub-smart-home")


# ── 3. Streaming: pantallas superpuestas y onda ───────────────────────────
def streaming():
    img = canvas(PAPER_WARM)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([s(W * 0.10), s(H * 0.14), s(W * 0.62), s(H * 0.62)],
                        radius=s(18), fill=VIR_PALE, outline=BORDER, width=s(2))
    d.rounded_rectangle([s(W * 0.24), s(H * 0.26), s(W * 0.76), s(H * 0.74)],
                        radius=s(18), fill=VIRIDIAN)
    d.rounded_rectangle([s(W * 0.38), s(H * 0.38), s(W * 0.90), s(H * 0.86)],
                        radius=s(18), fill=VIR_DARK)
    # Triángulo de reproducción, recortado por el marco superior
    tx, ty, sz = s(W * 0.60), s(H * 0.62), s(52)
    d.polygon([(tx - sz * 0.45, ty - sz), (tx - sz * 0.45, ty + sz), (tx + sz * 0.85, ty)], fill=AMBER)
    # Onda de audio bajo las pantallas
    base, amp = s(H * 0.94), s(26)
    for i in range(34):
        x = s(W * 0.10) + i * s(24)
        a = amp * (0.25 + 0.75 * abs(math.sin(i * 0.55)))
        d.line([(x, base - a), (x, base + a)], fill=VIR_LIGHT, width=s(5))
    finish(img, "hub-streaming")


# ── 4. Almacenamiento: bahías apiladas ────────────────────────────────────
def almacenamiento():
    img = canvas(INK)
    d = ImageDraw.Draw(img)
    d.rectangle([s(W * 0.66), 0, s(W), s(H)], fill=VIR_DARK)
    x0, x1 = s(W * 0.09), s(W * 0.58)
    for i in range(4):
        y = s(H * 0.16) + i * s(H * 0.185)
        h = s(H * 0.135)
        d.rounded_rectangle([x0, y, x1, y + h], radius=s(8),
                            fill=PAPER_WARM if i != 1 else VIR_PALE)
        d.rounded_rectangle([x0 + s(22), y + h * 0.3, x0 + s(150), y + h * 0.7],
                            radius=s(6), fill=BORDER)          # asa de la bahía
        led = AMBER if i == 1 else VIR_LIGHT
        d.ellipse([x1 - s(52), y + h / 2 - s(9), x1 - s(34), y + h / 2 + s(9)], fill=led)
    # Indicador de actividad en el panel derecho
    for i in range(7):
        y = s(H * 0.30) + i * s(52)
        w = s(70) + (i % 3) * s(46)
        d.rounded_rectangle([s(W * 0.74), y, s(W * 0.74) + w, y + s(14)],
                            radius=s(7), fill=VIR_LIGHT if i % 3 else AMBER)
    finish(img, "hub-almacenamiento")


# ── 5. Guías y análisis: columnas de texto en capas ───────────────────────
def guias():
    img = canvas(PAPER)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, s(W * 0.38), s(H)], fill=VIRIDIAN)
    d.rectangle([s(W * 0.38), 0, s(W * 0.415), s(H)], fill=AMBER)
    # Hoja en primer plano con renglones: la idea de "artículo"
    px0, py0, px1, py1 = s(W * 0.30), s(H * 0.16), s(W * 0.88), s(H * 0.90)
    d.rectangle([px0 + s(14), py0 + s(16), px1 + s(14), py1 + s(16)], fill=(226, 223, 212))
    d.rectangle([px0, py0, px1, py1], fill=PAPER, outline=BORDER, width=s(2))
    d.rectangle([px0 + s(46), py0 + s(52), px0 + s(190), py0 + s(66)], fill=AMBER)
    for i in range(9):
        y = py0 + s(110) + i * s(58)
        w = [0.86, 0.94, 0.72, 0.90, 0.60, 0.88, 0.80, 0.45, 0.70][i]
        col = INK if i in (0, 1) else BORDER
        hgt = s(18) if i in (0, 1) else s(11)
        d.rounded_rectangle([px0 + s(46), y, px0 + s(46) + (px1 - px0 - s(92)) * w, y + hgt],
                            radius=s(5), fill=col)
    finish(img, "hub-guias")


if __name__ == "__main__":
    print("Generando portadas:")
    energia(); smarthome(); streaming(); almacenamiento(); guias()
