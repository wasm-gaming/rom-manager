# Replace `const { a, b } = ns` (ns bound by a `$importAll` array pattern in the
# same <script>) with `{ a, b }` in the pattern itself: a module namespace must
# never become a store variable (its read-only properties break the proxy).
import re, sys
for path in sys.argv[1:]:
    src = open(path).read()
    def fix_script(m):
        body = m.group(0)
        for dm in list(re.finditer(r'\n(\s*)const \{ ([^}]*) \} = (\w+)\n', body)):
            names, ns = dm.group(2), dm.group(3)
            pattern = re.search(r'const \[([\s\S]*?)\] = await \$importAll', body)
            if not pattern or not re.search(rf'(?<![\w.]){ns}(?![\w])', pattern.group(1)):
                continue
            new_pattern = re.sub(rf'(?<![\w.{{]){ns}(?=\s*[,\]]|\s*$)', '{ ' + names + ' }', pattern.group(1), count=1)
            body = body.replace(pattern.group(1), new_pattern, 1)
            body = body.replace(dm.group(0), '\n', 1)
        return body
    out = re.sub(r'<script[\s\S]*?</script>', fix_script, src)
    if out != src:
        open(path, 'w').write(out)
        print('fixed', path)
