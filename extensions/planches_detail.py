#!/usr/bin/env python3
"""Glass Thought Studio — planches détaillées : N images par plan (par défaut 3 : entrée, milieu, fin), une ligne par plan.
usage : python3 planches_detail.py <dossier-projet> [format 9:16] [images_par_plan 3] [plans_par_planche 4]"""
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
P = os.path.abspath(sys.argv[1]); fmt = sys.argv[2] if len(sys.argv) > 2 else '9:16'; n = int(sys.argv[3]) if len(sys.argv) > 3 else 3
par = int(sys.argv[4]) if len(sys.argv) > 4 else 4; tag = fmt.replace(':', 'x'); S = os.path.join(P, 'studio')
s = open(os.path.join(P, f'scene-{tag}.js'), encoding='utf-8').read(); V = json.loads(s[s.index('window.VIDEO = ') + 15:s.rindex(';')])
fr = [.12, .5, .92] if n == 3 else [(i + .5) / n for i in range(n)]
t0, rows = 0, []
for k, sc in enumerate(V['scenes']):
    txt = re.sub(r'[\[\]{}~]', '', ' / '.join(c['text'] for c in sc.get('caption', [])))[:90]
    rows.append((k + 1, [round(t0 + sc['dur'] * f, 2) for f in fr], txt)); t0 += sc['dur']
out = os.path.join(P, 'storyboard', 'detail'); os.makedirs(out, exist_ok=True)
ts = sorted({t for _, tt, _ in rows for t in tt})
subprocess.run(['node', os.path.join(S, 'outils', 'rendu.cjs'), os.path.join(P, f'scene-{tag}.js'), os.path.join(out, 'x.mp4'), '--stills', ','.join(map(str, ts))], check=True, stdout=subprocess.DEVNULL)
ft = os.path.join(S, 'moteur', 'fonts', 'ttf'); fonts = [f for f in os.listdir(ft) if f.endswith('.ttf')] if os.path.isdir(ft) else []
F = lambda z: ImageFont.truetype(os.path.join(ft, sorted(fonts)[0]), z) if fonts else ImageFont.load_default()
tw = 300; th = int(tw * Image.open(os.path.join(out, f'image_{ts[0]:.2f}.png')).height / 720); pad = 18; lab = 46
for b in range(0, len(rows), par):
    chunk = rows[b:b + par]; W = pad + n * (tw + pad); H = 70 + len(chunk) * (th + lab + pad)
    im = Image.new('RGB', (W, H), (16, 16, 16)); d = ImageDraw.Draw(im)
    d.text((pad, 22), f'STORYBOARD DÉTAILLÉ · {fmt} · plans {chunk[0][0]}–{chunk[-1][0]}', fill='white', font=F(22))
    y = 70
    for k, tt, txt in chunk:
        d.text((pad, y), f'PLAN {k}  ·  « {txt} »', fill='white', font=F(17)); y += lab - 12
        for i, t in enumerate(tt):
            x = pad + i * (tw + pad); im.paste(Image.open(os.path.join(out, f'image_{t:.2f}.png')).convert('RGB').resize((tw, th)), (x, y))
            d.text((x + 8, y + 8), f'{t:.2f} s', fill='white', font=F(16))
        y += th + pad + 12
    f = os.path.join(P, f'storyboard-detail-{tag}-{b // par + 1}.jpg'); im.save(f, quality=90); print(f)
