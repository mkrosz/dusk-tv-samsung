#!/usr/bin/env python3
"""Cuts Inter down to what Dusk TV draws (Latin, Portuguese accents, a few symbols): web/Inter.woff.

    pip install fonttools
    python tools/subset_font.py path/to/InterVariable.ttf

The full variable font is ~860 KB, which the AU8000 took seconds to load; the subset keeps the weight axis and is a
small fraction of that.
"""
import os
import sys

from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Basic Latin, Latin-1 (accents), general punctuation, arrows and the few shapes the screen uses (▼ ◀ ▶ ★ ·).
UNICODES = 'U+0020-007E,U+00A0-00FF,U+0152-0153,U+2010-2027,U+2030-205E,U+2190-2199,U+25B2-25C0,U+2605,U+00B7'


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'web', 'Inter.ttf')
    out = os.path.join(ROOT, 'web', 'Inter.woff')
    subset.main([src, '--unicodes=' + UNICODES, '--layout-features=*', '--flavor=woff', '--output-file=' + out])
    print('web/Inter.woff: %d KB' % (os.path.getsize(out) // 1024))


if __name__ == '__main__':
    main()
