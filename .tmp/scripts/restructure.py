# Moves rom-manager into helpers / components / lib / views and rewrites every import.
import os, re, subprocess, glob
os.chdir('/home/user/rom-manager')
S='src/'
moves={}
for f in glob.glob('src/core/*.ts'): moves[f]='src/helpers/'+os.path.basename(f)
moves['src/ui/format.ts']='src/helpers/format.ts'
moves['src/ui/icons.ts']='src/helpers/file-icons.ts'
moves['src/ui/drop.ts']='src/helpers/drop.ts'
moves['src/ui/tree/types.ts']='src/helpers/tree-types.ts'
moves['src/ui/tree/utils.ts']='src/helpers/tree.ts'
for f in glob.glob('src/services/*.ts'): moves[f]='src/lib/'+os.path.basename(f)
moves['src/ui/state.ts']='src/lib/ui-state.ts'
for f in glob.glob('src/messages/*'): moves[f]='src/lib/messages/'+os.path.basename(f)
for n in ['BrandLogo','ConfirmModal','Icon','PromptModal','SystemFolderIcon','SystemLogo','Tabs','WelcomeIllustration']:
    moves[f'src/ui/components/{n}.html']=f'src/components/{n}.html'
moves['src/ui/components/FileTree/FileTreeHeader.html']='src/components/FileTreeHeader.html'
moves['src/ui/components/FileTree.html']='src/views/FileTree.html'
for f in glob.glob('src/ui/views/*.html'): moves[f]='src/views/'+os.path.basename(f)
moves['src/ui/App.html']='src/views/App.html'
moves['src/ui/main.ts']='src/main.ts'
missing=[k for k in moves if not os.path.exists(k)]
assert not missing, missing
EXTS=['','.ts','.html','.yaml']
def resolve(spec, frm):
    if spec.startswith('@/'): base='src/'+spec[2:]
    elif spec.startswith('.'): base=os.path.normpath(os.path.join(os.path.dirname(frm), spec))
    else: return None
    for e in EXTS:
        if os.path.isfile(base+e): return base+e, e
    if os.path.isfile(base+'/index.ts'): return base+'/index.ts','/index.ts'
    return None
files=[f for f in subprocess.check_output(['git','ls-files','src']).decode().split() if f.endswith(('.ts','.html'))]
spec_re=re.compile(r"""((?:from|import)\s*\(?\s*|['"]?\s*)(['"])((?:\.\.?/|@/)[^'"]+)\2""")
plan={}
for f in files:
    src=open(f).read()
    new_f=moves.get(f,f)
    def sub(m):
        spec=m.group(3)
        r=resolve(spec, f)
        if not r: return m.group(0)
        target, ext=r
        nt=moves.get(target,target)
        if ext and nt.endswith(ext) and not spec.endswith(ext): nt_noext=nt[:-len(ext)] if ext!='/index.ts' else nt[:-len('/index.ts')]
        else: nt_noext=nt
        rel=os.path.relpath(nt_noext, os.path.dirname(new_f))
        if not rel.startswith('.'): rel='./'+rel
        return m.group(1)+m.group(2)+rel+m.group(2)
    out=spec_re.sub(sub, src)
    plan[f]=(new_f,out)
for f,(nf,out) in plan.items():
    if nf!=f:
        os.makedirs(os.path.dirname(nf), exist_ok=True)
        subprocess.check_call(['git','mv',f,nf])
    open(nf,'w').write(out)
# non-code moves (yaml)
for f,nf in moves.items():
    if os.path.exists(f):
        os.makedirs(os.path.dirname(nf), exist_ok=True); subprocess.check_call(['git','mv',f,nf])
print('moved', sum(1 for f in plan if plan[f][0]!=f))
