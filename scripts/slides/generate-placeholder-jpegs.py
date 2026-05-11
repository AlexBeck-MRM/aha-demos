from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path('reference/slides/media-jpeg')
OUT.mkdir(parents=True, exist_ok=True)


def font(size):
    candidates = [
        '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
        '/System/Library/Fonts/Supplemental/Helvetica.ttc',
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            pass
    return ImageFont.load_default()

F_BIG = font(58)
F_MID = font(36)
F_SM = font(24)


def save(img, name):
    img.save(OUT / name, 'JPEG', quality=94, optimize=True)


# Diagram
img = Image.new('RGB', (1600, 900), '#E9EDF4')
d = ImageDraw.Draw(img)
for p in [(220,220),(560,260),(890,430),(1240,350),(500,640),(980,650)]:
    d.ellipse((p[0]-26,p[1]-26,p[0]+26,p[1]+26), fill='#8A97AF')
for a,b in [((220,220),(560,260)),((560,260),(890,430)),((890,430),(1240,350)),((560,260),(500,640)),((500,640),(980,650)),((890,430),(980,650))]:
    d.line((a,b), fill='#AFB8C9', width=8)
d.text((72,56), 'DIAGRAM PLACEHOLDER', fill='#2B3444', font=F_BIG)
d.text((72,132), 'Node and relationship structure', fill='#4D596E', font=F_SM)
save(img, 'diagram-placeholder.jpg')

# Photo
img = Image.new('RGB', (1600, 900), '#D6DEEA')
d = ImageDraw.Draw(img)
d.rectangle((0,520,1600,900), fill='#ABB8CC')
d.polygon([(0,700),(260,520),(520,680),(780,500),(1090,710),(1340,560),(1600,760),(1600,900),(0,900)], fill='#8EA0B9')
d.polygon([(0,770),(220,640),(500,790),(820,620),(1120,830),(1380,680),(1600,820),(1600,900),(0,900)], fill='#768AA8')
d.ellipse((1180,80,1360,260), fill='#EEF2F8')
d.text((72,56), 'PHOTO PLACEHOLDER', fill='#2B3444', font=F_BIG)
d.text((72,132), 'Contextual hero imagery area', fill='#4D596E', font=F_SM)
save(img, 'photo-placeholder.jpg')

# Annotated
img = Image.new('RGB', (1600, 900), '#E8EDF5')
d = ImageDraw.Draw(img)
d.rounded_rectangle((150,170,1450,760), radius=24, fill='#CFD8E6')
d.ellipse((430,280,730,580), outline='#8E9CB3', width=8)
d.line((580,580,420,700), fill='#8E9CB3', width=8)
d.line((740,340,1030,340), fill='#8E9CB3', width=8)
d.line((740,380,980,380), fill='#8E9CB3', width=8)
d.line((1040,520,1290,520), fill='#8E9CB3', width=8)
d.line((1040,560,1230,560), fill='#8E9CB3', width=8)
for p in [(420,700),(1030,340),(1290,520)]:
    d.ellipse((p[0]-12,p[1]-12,p[0]+12,p[1]+12), fill='#6E7E9A')
d.text((72,56), 'ANNOTATED VISUAL PLACEHOLDER', fill='#2B3444', font=F_BIG)
d.text((72,132), 'Primary asset with callouts', fill='#4D596E', font=F_SM)
save(img, 'annotated-placeholder.jpg')

# Chart
img = Image.new('RGB', (1600, 900), '#EAF0F8')
d = ImageDraw.Draw(img)
for y in [760,620,480,340,200]:
    d.line((120,y,1480,y), fill='#C1C9D7', width=3)
d.line((120,140,120,760), fill='#A8B3C7', width=5)
d.line((120,760,1480,760), fill='#A8B3C7', width=5)
vals=[560,470,380,430,300,350]
x0=220
for i,v in enumerate(vals):
    x=x0+i*190
    d.rounded_rectangle((x,v,x+120,760), radius=10, fill='#8F9DB5')
line=[(220,510),(410,420),(600,360),(790,390),(980,250),(1170,290)]
d.line(line, fill='#D3031F', width=10)
for x,y in line:
    d.ellipse((x-9,y-9,x+9,y+9), fill='#D3031F')
d.text((72,56), 'CHART PLACEHOLDER', fill='#2B3444', font=F_BIG)
d.text((72,132), 'Trend and performance readout', fill='#4D596E', font=F_SM)
save(img, 'chart-placeholder.jpg')

# Flow
img = Image.new('RGB', (1400, 320), '#E8EDF5')
d = ImageDraw.Draw(img)
boxes=[(70,90,250,230),(320,90,500,230),(570,90,750,230),(820,90,1000,230),(1070,90,1250,230)]
for b,c in zip(boxes,['#CDD6E4','#C3CEDF','#BAC7DA','#B2C0D4','#AAB9CF']):
    d.rounded_rectangle(b, radius=14, fill=c)
for a,b in zip(boxes, boxes[1:]):
    y=(a[1]+a[3])//2
    d.line((a[2]+10,y,b[0]-18,y), fill='#9CAAC0', width=7)
    d.polygon([(b[0]-18,y-8),(b[0]-2,y),(b[0]-18,y+8)], fill='#9CAAC0')
d.text((40,18), 'FLOW PLACEHOLDER', fill='#2B3444', font=F_MID)
save(img, 'flow-placeholder.jpg')

# Hero A
img = Image.new('RGB', (1600, 900), '#CED8E6')
d = ImageDraw.Draw(img)
d.polygon([(0,610),(220,430),(470,570),(760,370),(1050,560),(1340,390),(1600,620),(1600,900),(0,900)], fill='#92A4BF')
d.polygon([(0,700),(210,560),(460,710),(740,560),(1080,760),(1340,600),(1600,760),(1600,900),(0,900)], fill='#788DAA')
d.ellipse((1180,90,1370,280), fill='#EEF2F9')
d.text((72,56), 'HERO IMAGE A', fill='#2B3444', font=F_BIG)
d.text((72,132), 'Single-image story frame', fill='#4D596E', font=F_SM)
save(img, 'hero-placeholder-a.jpg')

# Hero B
img = Image.new('RGB', (1600, 900), '#D9DFEA')
d = ImageDraw.Draw(img)
d.rounded_rectangle((140,130,1460,770), radius=24, fill='#BEC8D9')
d.rounded_rectangle((220,220,580,680), radius=18, fill='#A8B7CD')
d.rounded_rectangle((620,220,1380,400), radius=18, fill='#9CADC6')
d.rounded_rectangle((620,440,1380,680), radius=18, fill='#8D9FBC')
d.text((72,56), 'HERO IMAGE B', fill='#2B3444', font=F_BIG)
d.text((72,132), 'Comparison/alternative frame', fill='#4D596E', font=F_SM)
save(img, 'hero-placeholder-b.jpg')

print('JPEG placeholders generated in', OUT)
