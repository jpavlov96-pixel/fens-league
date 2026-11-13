"""Makes the web copies of the official resources (team crests, power cards, achievements)
from the originals in assets/source/. Run it again whenever an original is added or changed.

Needs Pillow. Use a throwaway environment rather than installing it system-wide:
    python3 -m venv /tmp/fens-venv && /tmp/fens-venv/bin/pip install pillow
    /tmp/fens-venv/bin/python tools/optimize-resources.py

Every copy is resized to 3x its largest on-screen size, then re-encoded as a 256-colour
PNG with transparency and dithering (5-15x smaller, no visible difference at that size).
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")

# (source folder, web folder, [(suffix, how to size)])
# crests: largest use is the match card's 114 x 68 slot / 100px team-logo -> 360px box;
#         "-small" for 60px and smaller (team cards, match cards, history) -> 180px box
# power cards: the carousel's 193px middle card -> 600px wide; "-small" for the 50px
#         thumbnails (feature-panel, history) -> 150px wide
# achievements: the 355px-wide mission card -> 1065px wide
SETS = [
    ("source/crests", "crests", [("", ("box", 360)), ("-small", ("box", 180))]),
    ("source/trump-cards", "trump-cards", [("", ("width", 600)), ("-small", ("width", 150))]),
    ("source/achievements", "achievements", [("", ("width", 1065))]),
]

# the power-card originals keep their older "trump-card-" prefix
def web_name(source_name):
    return source_name[len("trump-card-"):] if source_name.startswith("trump-card-") else source_name


def resize(im, how):
    kind, size = how
    w, h = im.size
    scale = size / max(w, h) if kind == "box" else size / w
    if scale >= 1:
        return im
    return im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)


for src_dir, out_dir, variants in SETS:
    src_path = os.path.join(ROOT, src_dir)
    out_path = os.path.join(ROOT, out_dir)
    os.makedirs(out_path, exist_ok=True)
    for name in sorted(os.listdir(src_path)):
        if not name.lower().endswith(".png"):
            continue
        original = Image.open(os.path.join(src_path, name)).convert("RGBA")
        base = os.path.splitext(web_name(name))[0]
        for suffix, how in variants:
            im = resize(original, how)
            q = im.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG)
            out = os.path.join(out_path, base + suffix + ".png")
            q.save(out, optimize=True)
            print(f"{out_dir}/{base}{suffix}.png  {im.size[0]}x{im.size[1]}  {os.path.getsize(out) // 1024} KB")
