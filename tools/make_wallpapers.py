#!/usr/bin/env python3
"""Desenha as 5 paisagens offline (web/wallpapers/paisagem-1..5.jpg): montanhas em camadas, névoa, lago com reflexo,
sol ou lua. Feitas por código, então podem ser distribuídas junto com o projeto (licença MIT).

    python tools/make_wallpapers.py

Precisa de numpy e Pillow.
"""
import os

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'web', 'wallpapers')
W, H = 1920, 1080
HORIZON = 0.70   # where the lake starts, as a fraction of the height


def ridge(rng, base, rough, octaves=7):
    """A mountain skyline: one height (0 top .. 1 bottom) per column, from 1D fractal noise."""
    x = np.linspace(0, 1, W)
    y = np.zeros(W)
    amp, freq = rough, 2.0
    for _ in range(octaves):
        pts = rng.random(int(freq) + 2)
        y += amp * np.interp(x * (len(pts) - 1), np.arange(len(pts)), pts)
        amp *= 0.5
        freq *= 2.1
    return base - (y - y.mean())


def mix(a, b, t):
    t = np.asarray(t)[..., None] if np.ndim(t) else t
    return np.asarray(a, float) + (np.asarray(b, float) - np.asarray(a, float)) * t


def scene(name, seed, sky_top, sky_low, sun, sun_xy, sun_size, layers, mist, water, stars=0):
    rng = np.random.default_rng(seed)
    yy = np.linspace(0, 1, H)[:, None] * np.ones((1, W))
    xx = np.ones((H, 1)) * np.linspace(0, 1, W)[None, :]

    # Sky: a vertical gradient, warmer near the horizon, and a glow around the sun.
    t = np.clip(yy / HORIZON, 0, 1) ** 1.3
    img = mix(sky_top, sky_low, t)
    sx, sy = sun_xy
    d = np.sqrt(((xx - sx) * 16 / 9) ** 2 + (yy - sy) ** 2)
    img += np.asarray(sun, float) * (np.clip(1 - d / 0.55, 0, 1) ** 2.2)[..., None] * 0.55
    disc = np.clip((sun_size - d) / 0.004, 0, 1)
    img = mix(img, np.minimum(np.asarray(sun, float) * 1.15, 255), disc)

    if stars:
        n = stars
        px, py = rng.integers(0, W, n), rng.integers(0, int(H * HORIZON * 0.8), n)
        b = rng.random(n) ** 3 * 255
        for x, y, v in zip(px, py, b):
            img[y, x] = np.maximum(img[y, x], v)

    # Mountains, far to near: each layer darker, with mist fading its foot.
    for i, (color, base, rough) in enumerate(layers):
        top = ridge(rng, base, rough)[None, :]
        inside = yy >= top
        fog = np.clip((yy - top) / 0.18, 0, 1) * mist[i]
        layer = mix(color, sky_low, fog)
        img = np.where(inside[..., None], layer, img)

    # Lake: the scene above the horizon, mirrored, darker and rippled.
    h0 = int(H * HORIZON)
    above = img[:h0][::-1]
    depth = H - h0
    reflect = above[:depth]
    ripple = (np.sin(np.arange(depth)[:, None] * 0.9 + np.linspace(0, 40, W)[None, :]) * 2).astype(int)
    cols = np.clip(np.arange(W)[None, :] + ripple, 0, W - 1)
    reflect = reflect[np.arange(depth)[:, None], cols]
    k = np.linspace(0.55, 0.3, depth)[:, None, None]
    img[h0:] = reflect * k + np.asarray(water, float) * (1 - k)
    img[h0:h0 + 2] = img[h0:h0 + 2] * 0.85 + np.asarray(sun, float) * 0.15

    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    out = out.filter(ImageFilter.GaussianBlur(0.8))
    out.save(os.path.join(OUT, name + '.jpg'), quality=88, optimize=True, progressive=True)
    print('wallpapers/%s.jpg' % name)


def main():
    os.makedirs(OUT, exist_ok=True)
    # 1: sunset in the mountains
    scene('paisagem-1', 3, sky_top=(36, 44, 104), sky_low=(250, 140, 80), sun=(255, 196, 120), sun_xy=(0.68, 0.6),
          sun_size=0.045, water=(30, 30, 60), mist=[0.7, 0.55, 0.4, 0.2],
          layers=[((150, 92, 120), 0.50, 0.30), ((104, 62, 100), 0.58, 0.26), ((62, 40, 76), 0.64, 0.22),
                  ((30, 22, 44), 0.70, 0.12)])
    # 2: blue hour with stars
    scene('paisagem-2', 11, sky_top=(8, 12, 40), sky_low=(70, 84, 150), sun=(200, 210, 255), sun_xy=(0.22, 0.24),
          sun_size=0.022, water=(10, 14, 34), mist=[0.6, 0.45, 0.3, 0.15], stars=900,
          layers=[((58, 70, 124), 0.48, 0.32), ((38, 48, 96), 0.56, 0.28), ((22, 30, 66), 0.63, 0.2),
                  ((10, 14, 34), 0.70, 0.1)])
    # 3: misty morning
    scene('paisagem-3', 23, sky_top=(120, 170, 220), sky_low=(250, 222, 196), sun=(255, 240, 210), sun_xy=(0.3, 0.52),
          sun_size=0.04, water=(60, 90, 110), mist=[0.8, 0.65, 0.5, 0.3],
          layers=[((150, 170, 196), 0.50, 0.26), ((106, 132, 160), 0.57, 0.24), ((64, 92, 112), 0.64, 0.2),
                  ((30, 52, 60), 0.70, 0.1)])
    # 4: dusk, orange and violet
    scene('paisagem-4', 37, sky_top=(60, 30, 90), sky_low=(255, 120, 70), sun=(255, 150, 80), sun_xy=(0.5, 0.66),
          sun_size=0.06, water=(40, 20, 50), mist=[0.65, 0.5, 0.35, 0.2],
          layers=[((170, 70, 100), 0.52, 0.28), ((120, 46, 92), 0.59, 0.24), ((72, 30, 70), 0.65, 0.18),
                  ((34, 16, 40), 0.70, 0.1)])
    # 5: cool afternoon, teal lake
    scene('paisagem-5', 52, sky_top=(40, 100, 160), sky_low=(170, 210, 220), sun=(255, 250, 230), sun_xy=(0.82, 0.3),
          sun_size=0.035, water=(16, 70, 80), mist=[0.7, 0.5, 0.35, 0.2],
          layers=[((96, 140, 160), 0.48, 0.30), ((60, 104, 120), 0.56, 0.27), ((32, 72, 80), 0.63, 0.2),
                  ((14, 40, 44), 0.70, 0.1)])


if __name__ == '__main__':
    main()
