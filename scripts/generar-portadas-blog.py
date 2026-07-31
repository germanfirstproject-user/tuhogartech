"""Portadas para los artículos del blog, en el mismo lenguaje que las del carrusel."""
import math, random
from PIL import Image, ImageDraw, ImageFilter

W, H, SS = 1200, 800, 2
PAPER      = (250, 249, 246)
PAPER_WARM = (243, 241, 234)
VIRIDIAN   = (22, 99, 85)
VIR_DARK   = (15, 76, 65)
VIR_LIGHT  = (61, 133, 119)
VIR_PALE   = (230, 239, 236)
INK        = (29, 28, 24)
AMBER      = (217, 161, 59)
BORDER     = (207, 202, 186)


def s(v):
    return int(v * SS)


def finish(img, name, grain=7):
    img = img.resize((W, H), Image.LANCZOS)
    rnd = random.Random(hash(name) & 0xFFFF)
    noise = Image.new("L", (W, H))
    noise.putdata([128 + int(rnd.gauss(0, grain)) for _ in range(W * H)])
    noise = noise.filter(ImageFilter.GaussianBlur(0.4))
    img = Image.blend(img, Image.merge("RGB", (noise, noise, noise)), 0.045)
    img.save(f"/home/user/tuhogartech/public/blog/{name}.webp", "WEBP", quality=92, method=6)
    print(f"  public/blog/{name}.webp")


def comparativa():
    """Tres unidades de la misma altura: misma capacidad, distinto carácter."""
    img = Image.new("RGB", (s(W), s(H)), PAPER_WARM)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, s(W), s(H * 0.30)], fill=VIRIDIAN)

    cols = [(VIR_DARK, AMBER), (VIRIDIAN, PAPER), (VIR_LIGHT, AMBER)]
    bw, gap = s(232), s(58)
    total = 3 * bw + 2 * gap
    x0 = (s(W) - total) // 2
    base = s(H * 0.80)
    top = s(H * 0.34)

    for i, (body, accent) in enumerate(cols):
        x = x0 + i * (bw + gap)
        # Cuerpo de la estación: misma altura en las tres = misma capacidad
        d.rounded_rectangle([x, top, x + bw, base], radius=s(14), fill=body)
        # Asa
        d.rounded_rectangle([x + s(58), top - s(30), x + bw - s(58), top + s(14)],
                            radius=s(12), outline=body, width=s(11))
        # Panel frontal con "nivel de carga" distinto en cada una
        d.rounded_rectangle([x + s(34), top + s(48), x + bw - s(34), top + s(118)],
                            radius=s(8), fill=PAPER_WARM if body != VIRIDIAN else VIR_PALE)
        fill_w = [0.45, 0.72, 0.92][i]
        d.rounded_rectangle([x + s(34), top + s(150),
                             x + s(34) + int((bw - s(68)) * fill_w), top + s(174)],
                            radius=s(12), fill=accent)
        # Tomas de corriente
        for j in range(2):
            cx = x + bw // 2 + (j * 2 - 1) * s(46)
            d.ellipse([cx - s(21), base - s(78), cx + s(21), base - s(36)],
                      outline=PAPER_WARM, width=s(6))

    d.line([(x0, base + s(26)), (x0 + total, base + s(26))], fill=BORDER, width=s(3))
    finish(img, "estaciones-1kwh")


def robot():
    """Plano de una vivienda con la ruta de limpieza trazada."""
    img = Image.new("RGB", (s(W), s(H)), VIR_DARK)
    d = ImageDraw.Draw(img)

    # Plano
    px0, py0, px1, py1 = s(120), s(110), s(1080), s(690)
    d.rounded_rectangle([px0, py0, px1, py1], radius=s(10), fill=PAPER)
    # Tabiques
    d.rectangle([s(560), py0 + s(30), s(576), s(430)], fill=VIR_PALE)
    d.rectangle([s(576), s(414), s(1050), s(430)], fill=VIR_PALE)
    d.rectangle([s(150), s(470), s(560), s(486)], fill=VIR_PALE)

    # Recorrido en líneas paralelas: así limpia un robot con LiDAR
    y = py0 + s(70)
    left, right = px0 + s(46), s(530)
    while y < s(400):
        d.line([(left, y), (right, y)], fill=VIR_LIGHT, width=s(7))
        nxt = y + s(58)
        if nxt < s(400):
            side = right if (y // s(58)) % 2 == 0 else left
            d.arc([side - s(29), y, side + s(29), nxt], -90 if side == right else 90,
                  90 if side == right else 270, fill=VIR_LIGHT, width=s(7))
        y = nxt

    # Zona prohibida: el rayado se recorta con una máscara para no salirse
    zx0, zy0, zx1, zy1 = s(650), s(150), s(1020), s(380)
    hatch = Image.new("RGB", (s(W), s(H)), PAPER)
    hd = ImageDraw.Draw(hatch)
    for k in range(-4, 14):
        o = k * s(52)
        hd.line([(zx0 + o, zy1), (zx0 + o + s(60), zy0)], fill=(240, 220, 175), width=s(4))
    mask = Image.new("L", (s(W), s(H)), 0)
    ImageDraw.Draw(mask).rounded_rectangle([zx0, zy0, zx1, zy1], radius=s(8), fill=255)
    img.paste(hatch, (0, 0), mask)
    d.rounded_rectangle([zx0, zy0, zx1, zy1], radius=s(8), outline=AMBER, width=s(7))

    # Base de carga y robot
    d.rounded_rectangle([s(160), s(520), s(300), s(650)], radius=s(10), fill=VIRIDIAN)
    d.rounded_rectangle([s(186), s(546), s(274), s(600)], radius=s(6), fill=VIR_PALE)
    d.ellipse([s(760), s(500), s(920), s(660)], fill=INK)
    d.ellipse([s(788), s(528), s(892), s(632)], fill=VIR_LIGHT)
    d.ellipse([s(824), s(482), s(856), s(514)], fill=AMBER)

    finish(img, "robot-aspirador")


if __name__ == "__main__":
    import os
    os.makedirs("/home/user/tuhogartech/public/blog", exist_ok=True)
    print("Portadas de blog:")
    comparativa()
    robot()
