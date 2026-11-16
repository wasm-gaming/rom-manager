# Convert px lengths to rem (1rem = 16px) in a stylesheet, except hairlines (<= 1px),
# the 999px pill radius, and media-query conditions (they are read against the
# browser's default font size, never the root's).
import re, sys
path = sys.argv[1]
src = open(path).read()
out, converted = [], 0
def rem(m):
    global converted
    n = float(m.group(1))
    if abs(n) <= 1 or n == 999:
        return m.group(0)
    converted += 1
    v = f"{n / 16:.4f}".rstrip('0').rstrip('.')
    return f"{v}rem"
for line in src.splitlines(keepends=True):
    if line.lstrip().startswith('@media'):
        out.append(line)
    else:
        out.append(re.sub(r'(?<![\w.#-])(-?\d*\.?\d+)px\b', rem, line))
open(path, 'w').write(''.join(out))
print(f'{converted} px values → rem')
