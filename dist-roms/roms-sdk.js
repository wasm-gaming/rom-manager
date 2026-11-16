import{y as h,z as O,L as g,A,B as j,C as x,E as P,F as S,P as I,G as z,H as R,I as B,J as C,K as L,N as F,f as T,h as E,s as q}from"./assets/PlayGermadeMigration-B5eQM3JI.js";const D=t=>t.slice(0,Math.max(0,t.indexOf("/")));async function N(t){try{const e=P(new Uint8Array(await t.arrayBuffer()));return e.valid?{format:e.format,...e.sourceCrc===null?{}:{sourceCrc:S(e.sourceCrc)}}:{format:e.format,error:"damaged"}}catch(e){return{error:e instanceof I&&e.code==="not-a-patch"?"not-a-patch":"damaged"}}}class k{static async preview(e,a,o){const s=a.filter(n=>!h(n.name)),i=new Map;for(const n of a)h(n.name)&&i.set(n,await N(n));return{items:s.length>0?await O.identify(e,[...s],o):[],patches:i}}static indexes(e){return g.readAll(e)}static async apply(e,a,o,s={}){const i=a.filter(l=>h(l.name)),r=a.filter(l=>!h(l.name)),n={added:[],already:[],refused:[],mods:{added:[],duplicates:[],rejected:[]},systems:[]},c=new Set;if(r.length>0){const l=r.flatMap(d=>A(d,o)),f=await O.apply(e,l);n.added.push(...f);for(const d of f)c.add(D(d));for(const d of r){const y=A(d,l);if(y.some(j))continue;if(y.some(w=>w.match&&w.taken)){n.already.push(d.name);continue}if(y.length>0&&y.every(w=>w.refused)){n.refused.push({name:d.name,reason:"archive"});continue}const p=typeof s.system=="function"?s.system(d.name):s.system;if(!p){n.refused.push({name:d.name,reason:"unknown"});continue}const b=`${p}/${d.name}`;if(await e.exists(b)){n.already.push(d.name);continue}try{await e.createDirectory(p)}catch{}await e.writeFile(b,new Uint8Array(await d.arrayBuffer())),n.added.push(b),c.add(p)}await g.refreshMany(e,c)}if(i.length>0){const l=typeof s.system=="string"?s.system:void 0;n.mods=await x.import(e,i,{system:l,gameId:s.gameId});for(const f of n.mods.added)c.add(f.system)}return n.systems=[...c].filter(Boolean).sort(),n}}const U=Object.freeze(Object.defineProperty({__proto__:null,AddService:k,systemOfPath:D},Symbol.toStringTag,{value:"Module"})),G=1;let v;function m(){return v??=(async()=>{const t=R.createNodeInstance();return await t.initializeLibrary(),t})(),v.catch(()=>v=void 0),v}async function H(t){return g.read(await m(),t)}async function V(){return g.readAll(await m())}async function J(t){return(await m()).readFile(t)}async function K(t,e){const a=await m(),o=await a.readFile(t),s=e?B(o,await a.readFile(e)):o;return{rom:s,crc:S(C(s))}}async function W(t,e={}){const a=await m(),o=await k.preview(a,t);return k.apply(a,t,o.items,e)}async function Q(t){const e=await m();await e.remove(t),await new L(e).remove(t).catch(()=>{}),await g.refresh(e,D(t))}async function X(t,e){await x.remove(await m(),t,e)}async function Y(t,e,a){await x.update(await m(),t,e,a)}async function Z(){return z.done(await m())}async function ee(t){return z.run(await m(),void 0,t)}const te=Object.freeze(Object.defineProperty({__proto__:null,API_VERSION:G,PatchError:I,addFiles:W,migrateFromPlayGermade:ee,migrated:Z,openLibrary:m,readFile:J,readIndex:H,readIndexes:V,readRomWithMod:K,removeMod:X,removeVersion:Q,updateMod:Y},Symbol.toStringTag,{value:"Module"})),ae=(t,e)=>typeof t.system=="function"?t.system(e):t.system;function $(t,e){const a=t.items??[],o=a.filter(r=>r.match),s=o.filter(r=>r.path&&!r.taken&&!r.refused);if(s.length>0){const{title:r,variant:n,system:c}=s[0].match;return{name:t.name,kind:"rom",state:"recognized",title:r,variant:n,system:c,adds:!0,...s.length>1?{more:s.length-1}:{}}}if(o.some(r=>r.taken)){const{title:r,variant:n,system:c}=o.find(l=>l.taken).match;return{name:t.name,kind:"rom",state:"already",title:r,variant:n,system:c,adds:!1}}if(a.length>0&&a.every(r=>r.refused))return{name:t.name,kind:"rom",state:"refused",reason:a[0].refused,adds:!1};const i=ae(e,t.name);return{name:t.name,kind:"rom",state:"unknown",...i?{system:i}:{},adds:!!i}}function re(t,e,a){for(const[o,s]of e.entries()){const i=t[o];if(!i||i.kind!=="rom"||i.state!=="recognized"&&i.state!=="already")continue;const r=s.items?.find(n=>n.match&&n.crc32?.toUpperCase()===a);if(r)return{system:r.match.system,title:r.match.title}}}const _=(t,e,a)=>t.find(o=>o.system===e)?.games[a]?.title;function oe(t,e){const a=t.map(o=>o.patch?void 0:$(o,e));for(const[o,s]of t.entries()){const i=s.patch;if(!i)continue;const r={name:s.name,kind:"mod"};if(i.error){a[o]={...r,state:"mod-refused",reason:i.error,adds:!1};continue}const n=i.sourceCrc?.toUpperCase(),c=n?F(e.indexes,n):void 0;if(c){a[o]={...r,state:"mod",system:c.system,title:_(e.indexes,c.system,c.gameId),fits:!0,adds:!0};continue}const l=n?re(a,t,n):void 0;if(l){a[o]={...r,state:"mod",system:l.system,title:l.title,fits:!0,adds:!0};continue}const f=typeof e.system=="string"?e.system:void 0;if(!f){a[o]={...r,state:"mod-refused",reason:"no-system",adds:!1};continue}const d=e.gameId?_(e.indexes,f,e.gameId)??e.gameId:void 0;a[o]={...r,state:"mod",system:f,...d?{title:d,fits:!1}:{},adds:!0}}return a}const ne=t=>t.some(e=>e.adds),se=Object.freeze(Object.defineProperty({__proto__:null,addRowsOf:oe,anyAdds:ne,romRowOf:$},Symbol.toStringTag,{value:"Module"})),ie=`<!--
  The add dialog \`roms-sdk.js\` opens for its host (\`openAddDialog\`), in a shadow root of its
  own: drop or pick ROMs, zips and mods, see what each one is before anything is written, take
  rows off, and "Añadir". Opens as it mounts. Event: done (the AddResult, or undefined when
  closed without adding).
-->
<script :setup="{ system = void 0, gameId = void 0, locale = void 0 }">const [{ addRowsOf, anyAdds }, { AddService }, { translatorOf }, { openLibrary }, { itemsOf }] = await $importAll([
  "../helpers/add-rows",
  "../lib/AddService",
  "../lib/I18nService",
  "../lib/roms-sdk",
  "../lib/RomIntakeService"
]);
const t = translatorOf(locale);
let entries = [];
let indexes = [];
let busy = void 0;
let error = void 0;
let result = void 0;
let dragging = false;
const raw = () => $toRaw(entries);
$: rows = addRowsOf(
  entries.map((entry) => ({ name: entry.file.name, items: entry.items, patch: entry.patch })),
  { system, gameId, indexes }
);
$: adding = rows.filter((row) => row.adds).length;
const dialog = () => $self("dialog");
const input = () => $self("input[type=file]");
const reasonOf = (err) => err instanceof Error ? err.message : String(err);
const lineOf = (row) => {
  switch (row.state) {
    case "recognized":
      return t("addDialog.recognized", { title: row.title, variant: row.variant || "\\u2014", system: row.system }) + (row.more ? \` \${t("addDialog.more", { count: row.more })}\` : "");
    case "already":
      return \`\${t("addDialog.already")} \\xB7 \${row.title}\`;
    case "unknown":
      return row.system ? t("addDialog.unknownTo", { system: row.system }) : t("addDialog.unknownNowhere");
    case "refused":
      return t(\`addDialog.refused.\${row.reason}\`);
    case "mod":
      if (row.fits) return t("addDialog.mod.fits", { title: row.title });
      if (row.title) return t("addDialog.mod.assigned", { title: row.title });
      return t("addDialog.mod.unassigned", { system: row.system });
    default:
      return t(\`addDialog.mod.\${row.reason}\`);
  }
};
const markOf = (row) => row.adds ? "\\u2713" : row.state === "already" ? "=" : "!";
const take = async (files) => {
  if (files.length === 0 || busy) return;
  error = void 0;
  result = void 0;
  try {
    busy = t("addDialog.reading", { file: files[0].name });
    const node = await openLibrary();
    const preview = await AddService.preview(node, files, (progress) => {
      busy = t("addDialog.reading", { file: progress.file });
    });
    const added = files.map((file) => ({ file, items: itemsOf(file, preview.items), patch: preview.patches.get(file) }));
    entries = [...raw(), ...added];
  } catch (err) {
    error = t("addDialog.failed", { reason: reasonOf(err) });
  } finally {
    busy = void 0;
  }
};
const removeAt = (at) => {
  entries = raw().filter((_, i) => i !== at);
};
const apply = async () => {
  if (busy || !anyAdds(rows)) return;
  error = void 0;
  try {
    busy = t("addDialog.adding");
    const node = await openLibrary();
    const list = raw();
    result = await AddService.apply(node, list.map((entry) => entry.file), list.flatMap((entry) => entry.items), { system, gameId });
    entries = [];
    indexes = await AddService.indexes(node);
  } catch (err) {
    error = t("addDialog.failed", { reason: reasonOf(err) });
  } finally {
    busy = void 0;
  }
};
const close = () => dialog()?.close();
const onClose = () => $emit("done", $toRaw(result));
const onCancel = (event) => {
  if (busy) event.preventDefault();
};
const onBackdrop = (event) => {
  if (event.target === dialog() && !busy) close();
};
const onPick = (event) => {
  const target = event.currentTarget;
  const files = Array.from(target.files ?? []);
  target.value = "";
  void take(files);
};
const onDragOver = (event) => {
  event.preventDefault();
  dragging = true;
};
const onDragLeave = (event) => {
  if (event.target === event.currentTarget) dragging = false;
};
const onDrop = (event) => {
  event.preventDefault();
  dragging = false;
  void take(Array.from(event.dataTransfer?.files ?? []));
};
await $mounted();
if (!dialog()?.open) dialog()?.showModal();
try {
  indexes = await AddService.indexes(await openLibrary());
} catch {
}
<\/script>

<dialog
  class="add"
  :aria-label="t('addDialog.title')"
  @close="onClose"
  @cancel="onCancel"
  @click="onBackdrop"
  @dragover="onDragOver"
  @drop="onDrop"
>
  <header>
    <h2>{{ t('addDialog.title') }}</h2>
    <button class="icon" :aria-label="t('addDialog.close')" :title="t('addDialog.close')" @click="close" :disabled="Boolean(busy)">×</button>
  </header>

  <label :class="\`zone \${dragging ? 'over' : ''}\`" @dragleave="onDragLeave">
    <span>{{ t('addDialog.drop') }}</span>
    <span class="pick">{{ t('addDialog.pick') }}</span>
    <input type="file" multiple @change="onPick" :disabled="Boolean(busy)" />
  </label>

  <ul :if="rows.length > 0" class="rows">
    <li :each="row, at in rows" :key="\`\${at}:\${row.name}\`" :class="\`row \${row.state} \${row.adds ? 'adds' : 'skips'}\`">
      <span class="mark" aria-hidden="true">{{ markOf(row) }}</span>
      <span class="text">
        <span class="name" :title="row.name">{{ row.name }}</span>
        <span class="what">{{ lineOf(row) }}</span>
      </span>
      <button class="icon" :aria-label="t('addDialog.remove', { name: row.name })" :title="t('addDialog.remove', { name: row.name })" @click="removeAt(at)" :disabled="Boolean(busy)">×</button>
    </li>
  </ul>

  <p :if="busy" class="status" role="status">{{ busy }}</p>
  <p :if="error" class="error" role="alert">{{ error }}</p>
  <p :if="result && !busy" class="summary" role="status">
    {{ t('addDialog.summary', { added: result.added.length, already: result.already.length, mods: result.mods.added.length }) }}
  </p>

  <footer>
    <button :if="!result" class="secondary" @click="close" :disabled="Boolean(busy)">{{ t('addDialog.cancel') }}</button>
    <button :if="!result || rows.length > 0" class="primary" @click="apply" :disabled="Boolean(busy) || adding === 0">
      {{ adding > 1 ? t('addDialog.addMany', { count: adding }) : t('addDialog.add') }}
    </button>
    <button :if="result && rows.length === 0" class="primary" @click="close" :disabled="Boolean(busy)">{{ t('addDialog.done') }}</button>
  </footer>
</dialog>

<style>
  /* The app's palette (src/styles/index.css), the few tokens this dialog uses: the host's CSS
     cannot reach a shadow root, and the app's stylesheet stays out of the host's page. */
  :host {
    --surface: #fff;
    --surface-2: #f5f5f5;
    --border: #e0e0e0;
    --text: #212121;
    --text-muted: #616161;
    --accent: #1976d2;
    --accent-hover: #1565c0;
    --accent-on: #fff;
    --accent-soft: #e3f2fd;
    --danger-ink: #c62828;
    --ok-ink: #2e7d32;
    --warn-ink: #b26a00;
    --focus-ring: rgba(25, 118, 210, 0.25);
    color-scheme: light;
  }
  :host([data-theme='dark']) {
    --surface: #1a1f26;
    --surface-2: #222831;
    --border: #333b47;
    --text: #e8ecf2;
    --text-muted: #aab3c0;
    --accent: #64b5f6;
    --accent-hover: #90caf9;
    --accent-on: #0f151c;
    --accent-soft: rgba(100, 181, 246, 0.16);
    --danger-ink: #ff9d95;
    --ok-ink: #a5d6a7;
    --warn-ink: #ffbe5c;
    --focus-ring: rgba(100, 181, 246, 0.35);
    color-scheme: dark;
  }

  .add {
    box-sizing: border-box;
    width: min(36rem, calc(100vw - 2rem));
    max-height: calc(100dvh - 2rem);
    padding: 1.25rem;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    background: var(--surface);
    color: var(--text);
    font: 0.9375rem/1.4 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 1.25rem 3rem rgba(0, 0, 0, 0.35);
  }
  .add[open] {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }
  .add::backdrop {
    background: rgba(0, 0, 0, 0.55);
  }
  * {
    box-sizing: border-box;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  h2 {
    margin: 0;
    font-size: 1.125rem;
  }

  button {
    font: inherit;
    cursor: pointer;
    border-radius: 0.5rem;
  }
  button:disabled {
    cursor: default;
    opacity: 0.5;
  }
  button:focus-visible,
  .zone:focus-within {
    outline: none;
    box-shadow: 0 0 0 0.1875rem var(--focus-ring);
  }
  .icon {
    flex: none;
    width: 2rem;
    height: 2rem;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    font-size: 1.25rem;
    line-height: 1;
  }
  .icon:hover:not(:disabled) {
    background: var(--surface-2);
    color: var(--text);
  }

  .zone {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.625rem;
    padding: 1.5rem 1rem;
    border: 2px dashed var(--border);
    border-radius: 0.75rem;
    color: var(--text-muted);
    text-align: center;
    cursor: pointer;
  }
  .zone.over {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  .zone input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
  .pick {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: var(--accent);
    color: var(--accent-on);
    font-weight: 600;
  }
  .zone:hover .pick {
    background: var(--accent-hover);
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    list-style: none;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.25rem 0.5rem 0.75rem;
    border-radius: 0.5rem;
    background: var(--surface-2);
  }
  .mark {
    flex: none;
    width: 1.25rem;
    font-weight: 700;
    text-align: center;
  }
  .adds .mark {
    color: var(--ok-ink);
  }
  .skips .mark {
    color: var(--warn-ink);
  }
  .refused .mark,
  .mod-refused .mark {
    color: var(--danger-ink);
  }
  .text {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }
  .name {
    overflow: hidden;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .what {
    color: var(--text-muted);
    font-size: 0.8125rem;
  }

  .status,
  .summary,
  .error {
    margin: 0;
    font-size: 0.875rem;
  }
  .status {
    color: var(--text-muted);
  }
  .summary {
    color: var(--ok-ink);
  }
  .error {
    color: var(--danger-ink);
  }

  footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  footer button {
    padding: 0.5rem 1.125rem;
    border: 1px solid var(--border);
  }
  .secondary {
    background: transparent;
    color: var(--text);
  }
  .primary {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--accent-on);
    font-weight: 600;
  }
  .primary:hover:not(:disabled) {
    background: var(--accent-hover);
  }

  /* One column under 460px, as the app: the buttons take the width. */
  @media (max-width: 460px) {
    .add {
      width: calc(100vw - 1rem);
      padding: 1rem;
    }
    footer button {
      flex: 1;
    }
  }
</style>
`,de={"../helpers/add-rows":se,"../lib/AddService":U,"../lib/I18nService":q,"../lib/roms-sdk":te,"../lib/RomIntakeService":E},ce="views/AddDialog.html";let M;M=new T(ie,{modules:de,filename:ce});const le=M;let u;function fe(t={}){return u||(u=new Promise(e=>{const a=document.createElement("div");a.setAttribute("data-rom-manager","add-dialog"),a.setAttribute("data-theme",t.theme==="dark"?"dark":"light"),document.body.append(a);const o=(i,r)=>{s.off("done",o),s.destroy(),a.remove(),u=void 0,e(r)},s=le.mountShadow(a,{system:t.system,gameId:t.gameId,locale:t.locale});s.on("done",o)}),u)}export{G as API_VERSION,I as PatchError,W as addFiles,ee as migrateFromPlayGermade,Z as migrated,fe as openAddDialog,m as openLibrary,J as readFile,H as readIndex,V as readIndexes,K as readRomWithMod,X as removeMod,Q as removeVersion,Y as updateMod};
