from pathlib import Path

from PIL import Image, ImageColor, ImageDraw, ImageFilter, ImageFont


W = 1536
H = 1024
BG = "#F6F3EE"
INK = "#161616"
MUTED = "#67655F"
LINE = "#CFC8BC"
PANEL = "#FBF9F5"
PANEL_ALT = "#F1ECE4"
ACCENT = "#9E473E"
ACCENT_SOFT = "#D9B2AB"

FONT_REG = "/Users/alexanderbeck/Library/Fonts/MWSans-Regular_3093588806.ttf"
FONT_SEMI = "/Users/alexanderbeck/Library/Fonts/MWSans-SemiBold_1128385924.ttf"
FONT_BOLD = "/Users/alexanderbeck/Library/Fonts/MWSans-Bold_4153471986.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGB", (W, H), ImageColor.getrgb(BG))
    return image, ImageDraw.Draw(image)


def add_shadow(base: Image.Image, box: tuple[int, int, int, int], radius: int = 28, offset: tuple[int, int] = (0, 10), alpha: int = 38):
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    x0, y0, x1, y1 = box
    ox, oy = offset
    sdraw.rounded_rectangle((x0 + ox, y0 + oy, x1 + ox, y1 + oy), radius=radius, fill=(0, 0, 0, alpha))
    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    base.alpha_composite(shadow)


def rounded_panel(base: Image.Image, draw: ImageDraw.ImageDraw, box, fill=PANEL, outline=None, width=1, radius=26, shadow=True):
    if base.mode != "RGBA":
        raise ValueError("Base image must be RGBA")
    if shadow:
        add_shadow(base, box, radius=radius)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def label(draw, xy, text, *, font_obj, fill=INK, anchor="la"):
    draw.text(xy, text, font=font_obj, fill=fill, anchor=anchor)


def chip(draw, box, text, fill=PANEL_ALT, text_fill=INK):
    draw.rounded_rectangle(box, radius=18, fill=fill, outline=None)
    x0, y0, x1, y1 = box
    label(draw, ((x0 + x1) / 2, (y0 + y1) / 2 + 1), text, font_obj=font(FONT_SEMI, 22), fill=text_fill, anchor="mm")


def connector(draw, points, fill=LINE, width=5):
    draw.line(points, fill=fill, width=width, joint="curve")
    x0, y0, x1, y1 = points[-2], points[-1], points[-2], points[-1]


def dot(draw, xy, r=8, fill=ACCENT):
    x, y = xy
    draw.ellipse((x - r, y - r, x + r, y + r), fill=fill)


def title_block(draw, title: str, subtitle: str):
    label(draw, (96, 92), title, font_obj=font(FONT_BOLD, 54))
    label(draw, (96, 148), subtitle, font_obj=font(FONT_REG, 26), fill=MUTED)


def draw_grid(draw):
    for x in range(96, W - 96, 72):
        draw.line((x, 0, x, H), fill="#EFE9E0", width=1)
    for y in range(84, H - 80, 72):
        draw.line((0, y, W, y), fill="#F1ECE4", width=1)


def make_source_of_truth(path: Path):
    img = Image.new("RGBA", (W, H), ImageColor.getrgb(BG) + (255,))
    draw = ImageDraw.Draw(img)
    draw_grid(draw)
    title_block(draw, "Single Source Of Truth", "Design documentation feeding backlog, code, and review")

    rounded_panel(img, draw, (390, 250, 1146, 610), fill=PANEL, outline=LINE, width=2, radius=34)
    label(draw, (448, 302), "Figma", font_obj=font(FONT_BOLD, 30))
    label(draw, (448, 344), "Documented sections, variants, annotations, token intent", font_obj=font(FONT_REG, 24), fill=MUTED)

    rounded_panel(img, draw, (450, 390, 690, 540), fill=PANEL_ALT, radius=24, shadow=False)
    label(draw, (482, 428), "Component section", font_obj=font(FONT_SEMI, 24))
    chip(draw, (484, 460, 622, 498), "Ready for dev", fill="#EEE5D9")
    chip(draw, (484, 510, 604, 548), "Variants", fill="#F3E4E0", text_fill=ACCENT)

    rounded_panel(img, draw, (728, 390, 1086, 540), fill=PANEL_ALT, radius=24, shadow=False)
    label(draw, (760, 428), "Native documentation", font_obj=font(FONT_SEMI, 24))
    label(draw, (760, 468), "Development", font_obj=font(FONT_REG, 22), fill=MUTED)
    label(draw, (760, 500), "Interaction", font_obj=font(FONT_REG, 22), fill=MUTED)
    label(draw, (760, 532), "Accessibility", font_obj=font(FONT_REG, 22), fill=MUTED)

    boxes = [
        ((124, 720, 440, 918), "Backlog draft", "AC seed, dependencies, open questions"),
        ((610, 720, 926, 918), "Implementation", "Components, tokens, preview builds"),
        ((1096, 720, 1412, 918), "Parity review", "Design, content, and release checks"),
    ]
    for box, heading, sub in boxes:
        rounded_panel(img, draw, box, fill=PANEL, outline=LINE, width=2, radius=28)
        label(draw, (box[0] + 36, box[1] + 48), heading, font_obj=font(FONT_SEMI, 28))
        label(draw, (box[0] + 36, box[1] + 96), sub, font_obj=font(FONT_REG, 22), fill=MUTED)

    # connectors
    for cx in (282, 768, 1254):
        draw.line((768, 610, 768, 665), fill=LINE, width=4)
        draw.line((768, 665, cx, 665), fill=LINE, width=4)
        draw.line((cx, 665, cx, 720), fill=LINE, width=4)
        dot(draw, (cx, 665), r=7)
    dot(draw, (768, 610), r=9)

    label(draw, (96, 968), "One upstream design contract. Multiple downstream delivery outputs.", font_obj=font(FONT_REG, 22), fill=MUTED)
    img.convert("RGB").save(path, "PNG")


def make_documented_component(path: Path):
    img = Image.new("RGBA", (W, H), ImageColor.getrgb(BG) + (255,))
    draw = ImageDraw.Draw(img)
    draw_grid(draw)
    title_block(draw, "Documented Component", "The smallest useful handoff unit contains design, states, and rules")

    rounded_panel(img, draw, (140, 240, 860, 900), fill=PANEL, outline=LINE, width=2, radius=34)
    label(draw, (196, 296), "Hero / Promo Module", font_obj=font(FONT_BOLD, 30))
    chip(draw, (196, 338, 334, 378), "Ready for dev", fill="#EEE5D9")
    chip(draw, (352, 338, 486, 378), "CMS-backed", fill="#F2E8DA")
    chip(draw, (504, 338, 628, 378), "Responsive", fill="#F3E4E0", text_fill=ACCENT)

    # main component card
    rounded_panel(img, draw, (204, 430, 796, 770), fill=PANEL_ALT, radius=24, shadow=False)
    draw.rounded_rectangle((246, 474, 532, 670), radius=18, fill="#E7DED1")
    draw.rectangle((564, 474, 744, 504), fill="#D8CCBC")
    draw.rectangle((564, 522, 714, 544), fill="#DED5C9")
    draw.rectangle((564, 562, 696, 584), fill="#DED5C9")
    draw.rounded_rectangle((564, 626, 684, 670), radius=16, fill=ACCENT)
    label(draw, (246, 706), "Base variant", font_obj=font(FONT_REG, 22), fill=MUTED)
    label(draw, (564, 706), "Content + CTA + media", font_obj=font(FONT_REG, 22), fill=MUTED)

    # side panels
    panels = [
        ((930, 260, 1388, 448), "States", ["Default", "Hover", "Loading", "Error"]),
        ((930, 484, 1388, 672), "Annotations", ["Development", "Interaction", "Accessibility", "Content"]),
        ((930, 708, 1388, 896), "System notes", ["Token usage", "Data rules", "Fallbacks", "Open questions"]),
    ]
    for box, head, rows in panels:
        rounded_panel(img, draw, box, fill=PANEL, outline=LINE, width=2, radius=28)
        label(draw, (box[0] + 34, box[1] + 40), head, font_obj=font(FONT_SEMI, 28))
        y = box[1] + 92
        for row in rows:
            draw.line((box[0] + 34, y + 32, box[2] - 34, y + 32), fill="#E8E0D5", width=2)
            label(draw, (box[0] + 34, y), row, font_obj=font(FONT_REG, 22), fill=MUTED)
            y += 40

    # lines from component to panels
    anchors = [(860, 354), (860, 578), (860, 802)]
    targets = [(930, 354), (930, 578), (930, 802)]
    for a, b in zip(anchors, targets):
        draw.line((a[0], a[1], b[0], b[1]), fill=LINE, width=4)
        dot(draw, a, r=6)
        dot(draw, b, r=6)

    label(draw, (96, 968), "Select the documented section, then read annotations, variants, descriptions, and status in that order.", font_obj=font(FONT_REG, 22), fill=MUTED)
    img.convert("RGB").save(path, "PNG")


def make_governance_loop(path: Path):
    img = Image.new("RGBA", (W, H), ImageColor.getrgb(BG) + (255,))
    draw = ImageDraw.Draw(img)
    draw_grid(draw)
    title_block(draw, "Governance And Parity", "A light operational loop keeps design, content, and implementation aligned")

    center = (768, 570)
    radius = 250
    stations = [
        ("Design", (768, 250)),
        ("Preview", (1090, 570)),
        ("Release", (768, 890)),
        ("Content", (446, 570)),
    ]

    # ring
    draw.ellipse((center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius), outline="#DDD2C4", width=4)
    draw.ellipse((center[0] - radius + 42, center[1] - radius + 42, center[0] + radius - 42, center[1] + radius - 42), outline="#E9E1D6", width=2)

    rounded_panel(img, draw, (598, 474, 938, 666), fill=PANEL, outline=LINE, width=2, radius=30)
    label(draw, (646, 530), "Review loop", font_obj=font(FONT_BOLD, 30))
    label(draw, (646, 578), "Status, parity, and change control", font_obj=font(FONT_REG, 23), fill=MUTED)
    chip(draw, (646, 612, 800, 652), "Ready for dev", fill="#EEE5D9")

    for idx, (name, (x, y)) in enumerate(stations):
        rounded_panel(img, draw, (x - 118, y - 66, x + 118, y + 66), fill=PANEL_ALT if idx % 2 == 0 else PANEL, outline=LINE, width=2, radius=26)
        label(draw, (x, y - 8), name, font_obj=font(FONT_SEMI, 28), anchor="mm")
        sub = {
            "Design": "Figma",
            "Preview": "Storybook",
            "Release": "Adoption",
            "Content": "Authoring",
        }[name]
        label(draw, (x, y + 26), sub, font_obj=font(FONT_REG, 20), fill=MUTED, anchor="mm")
        dot(draw, (x, y - 92), r=7)

    # directional accents
    accent_paths = [
        ((768, 320), (1000, 480)),
        ((1036, 570), (920, 806)),
        ((768, 820), (536, 660)),
        ((500, 570), (616, 334)),
    ]
    for a, b in accent_paths:
        draw.line((a[0], a[1], b[0], b[1]), fill=ACCENT_SOFT, width=6)

    side_notes = [
        ((126, 286, 330, 392), "Design approved"),
        ((1206, 286, 1410, 392), "Tech reviewed"),
        ((1206, 748, 1410, 854), "Released"),
        ((126, 748, 330, 854), "Needs change"),
    ]
    for box, text in side_notes:
        chip(draw, box, text, fill="#F0E8DD")

    label(draw, (96, 968), "The loop is small by design: document, preview, review, release, repeat.", font_obj=font(FONT_REG, 22), fill=MUTED)
    img.convert("RGB").save(path, "PNG")


def main():
    out = Path("output/imagegen")
    out.mkdir(parents=True, exist_ok=True)
    make_source_of_truth(out / "aha-source-of-truth.png")
    make_documented_component(out / "aha-documented-component.png")
    make_governance_loop(out / "aha-governance-loop.png")
    print(out)


if __name__ == "__main__":
    main()
