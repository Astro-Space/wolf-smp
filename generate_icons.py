#!/usr/bin/env python3
"""Generate simple Wolf SMP icons."""

import struct, zlib, os

os.makedirs('icons', exist_ok=True)

def make_png(size, filename):
    """Create a dark gold wolf icon as PNG."""
    import array

    # Colors
    bg = (10, 10, 10)         # near black
    gold = (201, 168, 76)     # gold
    gold2 = (232, 201, 122)   # light gold

    pixels = []
    cx, cy = size // 2, size // 2
    r = size // 2

    for y in range(size):
        row = []
        for x in range(size):
            dx, dy = x - cx, y - cy
            dist = (dx*dx + dy*dy) ** 0.5

            # Outer ring
            if r - 3 < dist <= r:
                row.extend(gold)
            # Inner ring
            elif r * 0.6 - 2 < dist <= r * 0.6:
                row.extend(gold2)
            # Center wolf emoji area (filled gold circle)
            elif dist < r * 0.55:
                # Simple gold gradient
                t = dist / (r * 0.55)
                c = tuple(int(gold[i] + (bg[i] - gold[i]) * t * 0.3) for i in range(3))
                row.extend(c)
            else:
                row.extend(bg)
        pixels.append(row)

    # Encode PNG
    def encode_png(w, h, pixels):
        def chunk(name, data):
            c = struct.pack('>I', len(data)) + name + data
            return c + struct.pack('>I', zlib.crc32(c[4:]) & 0xffffffff)

        header = b'\x89PNG\r\n\x1a\n'
        ihdr_data = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
        ihdr = chunk(b'IHDR', ihdr_data)

        raw = b''
        for row in pixels:
            raw += b'\x00' + bytes(row)
        compressed = zlib.compress(raw, 9)
        idat = chunk(b'IDAT', compressed)
        iend = chunk(b'IEND', b'')
        return header + ihdr + idat + iend

    data = encode_png(size, size, pixels)
    with open(f'icons/{filename}', 'wb') as f:
        f.write(data)
    print(f'Created icons/{filename} ({size}x{size})')

make_png(192, 'wolf-icon-192.png')
make_png(512, 'wolf-icon-512.png')
make_png(180, 'wolf-icon.png')  # Apple touch icon
print('Icons generated!')
