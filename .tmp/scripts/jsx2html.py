"""Helpers to turn the drawing TSX (SVG returned per case) into jq79 markup."""
import re

def jsx_to_html(src: str) -> str:
    s = src
    s = re.sub(r'\{/\*(.*?)\*/\}', lambda m: '<!--' + m.group(1) + '-->', s, flags=re.S)
    s = s.replace('<>', '').replace('</>', '')
    s = s.replace('viewBox={BOX}', 'viewBox="0 0 24 24"')
    s = s.replace('class={className}', ':class="className"')
    # remaining {expr} attribute values -> :attr="expr"
    s = re.sub(r'(\s)([\w-]+)=\{([^{}]*)\}', lambda m: f'{m.group(1)}:{m.group(2)}="{m.group(3).replace(chr(34), chr(39))}"', s)
    return s

def dedent(block: str, by: int) -> str:
    out = []
    for line in block.splitlines():
        out.append(line[by:] if line[:by].strip() == '' else line.lstrip())
    return '\n'.join(out)
