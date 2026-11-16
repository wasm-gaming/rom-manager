import{f as m,D as ce,M as b,r as ut,p as de,v as me,Q as oe,i as re,t as vt,_ as fe,R as he,a as q,b as pe,c as ge,d as V,n as yt,e as H,g as wt,h as W,j as bt,k as kt,l as xt,m as St,o as Ot,q as _t,s as ue,u as Mt,w as Ct,x as $t}from"./PlayGermadeMigration-B5eQM3JI.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const Rt=`<!--
  The app's own mark: three loose cartridges, lying as they lie in a drawer.
  
  Three real ones, at their real proportions. Behind on the left the **NES**
  brick, wider than it is tall, its paper label boxed in black. Behind on the
  right a **PC Engine** HuCard — barely a card at all, the gold contacts along
  its top edge and the insertion arrow printed above the art. In front the
  **Mega Drive** shell, upright and black, with the thumb notch bitten out of
  its top lip.
  
  Three machines that never agreed on the shape of a game, which is the whole
  job: a collection is a pile of dumps from all of them.
  
  Every shape is laid out to sit inside the box *after* its tilt, corners
  included, so the mark is never cropped — favicon, header and hero all show the
  same thing.
  
  Drawn in the slate tones \`SystemLogos.tsx\` uses for console hardware rather
  than in the palette: these are objects, and an object that changed colour with
  the theme would stop being the object. The tones were picked to hold on both
  backgrounds; the labels are what carry the colour.
-->
<script :setup="{ className = &quot;&quot; }"><\/script>

<svg
  :class="className || 'brand-logo'"
  viewBox="0 0 64 64"
  role="img"
  aria-label="ROM Manager"
>
  <!-- NES: 136 × 120 mm, so landscape, and grey all over. -->
  <g transform="rotate(-14 21 24)">
    <rect
      x="7.5"
      y="12"
      width="27"
      height="24"
      rx="2"
      fill="#cbd5e1"
      stroke="#475569"
      stroke-width="2.2"
      stroke-linejoin="round"
    />
    <!-- The label: black-boxed, with the title band across its top. -->
    <rect
      x="10.5"
      y="15"
      width="21"
      height="12.5"
      rx="0.8"
      fill="#f1f5f9"
      stroke="#475569"
      stroke-width="1.3"
    />
    <rect x="11.7" y="16.2" width="18.6" height="3.4" fill="#1976d2" />
    <!-- The lip along the front, and the ridges under it. -->
    <path d="M9.5 31h23" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" />
    <path d="M11.5 33.5h7M23.5 33.5h7" stroke="#94a3b8" stroke-width="1.3" stroke-linecap="round" />
  </g>

  <!-- PC Engine: a HuCard, 54 × 86 mm and 2 mm thick — a printed card. -->
  <g transform="rotate(14 47 26)">
    <rect
      x="39.5"
      y="14"
      width="15"
      height="24"
      rx="1.5"
      fill="#f1f5f9"
      stroke="#475569"
      stroke-width="1.8"
      stroke-linejoin="round"
    />
    <!-- The contacts along the top edge, which is the edge it goes in by. -->
    <path
      d="M41.5 16v2.6M44 16v2.6M46.5 16v2.6M49 16v2.6M51.5 16v2.6"
      stroke="#d69e2e"
      stroke-width="1.4"
      stroke-linecap="round"
    />
    <!-- The arrow printed above the art, saying which way up it goes. -->
    <path d="M47 20.5l1.8 2.4h-3.6z" fill="#64748b" />
    <rect x="41.5" y="25" width="11" height="8" rx="0.8" fill="#1976d2" />
    <path d="M41.5 35h11" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" />
  </g>

  <!-- Mega Drive: upright, black, and the round notch cut into its top lip. -->
  <g transform="rotate(-5 32 41)">
    <path
      d="M22.5 26h5a4.5 4.5 0 0 0 9 0h5a2.5 2.5 0 0 1 2.5 2.5v25a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 20 53.5v-25A2.5 2.5 0 0 1 22.5 26z"
      fill="#252d38"
      stroke="#94a3b8"
      stroke-width="2.3"
      stroke-linejoin="round"
    />
    <!-- The grip, ridged either side of the notch. -->
    <path
      d="M23 31h4M37 31h4"
      stroke="#94a3b8"
      stroke-width="1.4"
      stroke-linecap="round"
    />
    <!-- The label: title band over the art, as they came. -->
    <rect x="23" y="35" width="18" height="14" rx="1" fill="#f1f5f9" />
    <rect x="23" y="35" width="18" height="4" rx="1" fill="#f59e0b" />
  </g>
</svg>
`,It={},Et="components/BrandLogo.html";let ve;ve=new m(Rt,{modules:It,filename:Et});const ye=ve,At=`<!--
  The icons, drawn rather than typed: <Icon name="close" />.

  Two families, because two jobs. What a row *is* — a folder, a game, a disc, a
  page — keeps the colours of the emoji it replaced, from the palette, so each
  theme gets a tone that reads on its own background (which of them a file gets:
  \`iconNameOf\` in ui/icons.ts). What a control *does* is drawn in one stroke of
  \`currentColor\` and sized in \`em\` (the \`icon\` class), so it takes the colour and
  the size of the text it stands among.
-->
<script :setup="{ name = &quot;file&quot;, systemId = &quot;&quot;, open = false, status = &quot;missing&quot;, className = &quot;&quot; }">const uid = Math.random().toString(36).slice(2, 10);
const cut = \`bundle-cut-\${uid}\`;
const frame = \`photo-\${uid}\`;
<\/script>

<svg :if="name === 'folder'" viewBox="0 0 24 24">
  <!-- Back and front, so the tab reads as a fold rather than a bump. -->
  <path d="M2.4 6.6a1.6 1.6 0 0 1 1.6-1.6h4.5c.44 0 .86.18 1.16.5l1.5 1.6H20a1.6 1.6 0 0 1 1.6 1.6v9.1a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z" fill="var(--icon-folder-back)" />
  <path d="M2.4 9.6h19.2v8.2a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z" fill="var(--icon-folder)" />
</svg>
<svg :elseif="name === 'game'" viewBox="0 0 24 24">
  <Pad :system-id="systemId" />
</svg>
<svg :elseif="name === 'bundle'" viewBox="0 0 24 24">
  <!--
    A game whose files are more than one: the gamepad with a parcel in the corner.
    The pad is drawn exactly where the plain game icon draws it, and cut back
    around the parcel by a mask on a wrapper of its own (a mask on a transformed
    element would be resolved in the transformed space).
  -->
  <mask :id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
    <rect width="24" height="24" fill="#fff" />
    <!-- Black hides; stroked too, so the parcel gets a hair of clearance. -->
    <rect x="15.1" y="14.9" width="7.8" height="7" rx="1.1" fill="#000" stroke="#000" stroke-width="1.6" />
  </mask>
  <g :mask="\`url(#\${cut})\`">
    <Pad :system-id="systemId" />
  </g>
  <Parcel :x="15.1" :y="14.9" :width="7.8" :height="7" :rx="1.1" />
</svg>
<svg :elseif="name === 'archive'" viewBox="0 0 24 24">
  <!-- A zip, a 7z, a rar: the bundle's parcel with nothing else in the frame. -->
  <Parcel :x="3.6" :y="5.3" :width="16.8" :height="14.2" :rx="1.7" />
</svg>
<svg :elseif="name === 'disc'" viewBox="0 0 24 24">
  <!-- A disc image. The hole and the shine are what keep it from being a dot. -->
  <circle cx="12" cy="12" r="9.2" fill="var(--icon-disc)" />
  <path d="M6.2 8.3a7 7 0 0 1 4.6-3.4" fill="none" stroke="var(--icon-disc-mark)" stroke-width="1.5" stroke-linecap="round" />
  <circle cx="12" cy="12" r="3.3" fill="var(--icon-disc-mark)" />
  <circle cx="12" cy="12" r="1.25" fill="var(--icon-disc)" />
</svg>
<svg :elseif="name === 'image'" viewBox="0 0 24 24">
  <!-- A picture: two hills, clipped to the frame so the corners stay round. -->
  <clipPath :id="frame">
    <rect x="2.8" y="4.6" width="18.4" height="14.8" rx="2" />
  </clipPath>
  <g :clip-path="\`url(#\${frame})\`">
    <rect x="2.8" y="4.6" width="18.4" height="14.8" fill="var(--icon-photo)" />
    <circle cx="8.3" cy="9.4" r="2" fill="#f9ab00" />
    <path d="M2.8 19.4 9.6 12l4 4.4 2.6-2.4 5 5.4z" fill="var(--icon-photo-hill)" />
  </g>
</svg>
<svg :elseif="name === 'memory-card'" viewBox="0 0 24 24">
  <!-- Saved games: a memory card (the floppy is the editor's save button). -->
  <path d="M6.6 2.8h6.9c.4 0 .78.16 1.06.44l2.9 2.9c.28.28.44.66.44 1.06V19.8a1.4 1.4 0 0 1-1.4 1.4H6.6a1.4 1.4 0 0 1-1.4-1.4V4.2a1.4 1.4 0 0 1 1.4-1.4z" fill="var(--icon-card)" />
  <rect x="7.6" y="5.6" width="1.5" height="3.4" rx=".6" fill="var(--icon-card-mark)" />
  <rect x="10.3" y="5.6" width="1.5" height="3.4" rx=".6" fill="var(--icon-card-mark)" />
  <rect x="13" y="5.6" width="1.5" height="3.4" rx=".6" fill="var(--icon-card-mark)" />
  <rect x="7.4" y="12.6" width="7.4" height="5.6" rx=".9" fill="var(--icon-card-mark)" />
</svg>
<svg :elseif="name === 'document'" viewBox="0 0 24 24">
  <!-- Something written: a readme, a .dat, a .json. -->
  <Sheet />
  <rect x="7.4" y="11.8" width="8.4" height="1.4" rx=".7" fill="var(--icon-paper-mark)" />
  <rect x="7.4" y="14.6" width="8.4" height="1.4" rx=".7" fill="var(--icon-paper-mark)" />
  <rect x="7.4" y="17.4" width="5.4" height="1.4" rx=".7" fill="var(--icon-paper-mark)" />
</svg>
<svg :elseif="name === 'chevron'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- Points right when shut and down when open, as a disclosure has always. -->
  <path d="M9.5 5.5 16 12l-6.5 6.5" :transform="open ? 'rotate(90 12 12)' : undefined" />
</svg>
<svg :elseif="name === 'plus'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M12 5v14M5 12h14" />
</svg>
<svg :elseif="name === 'close'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="m6 6 12 12M18 6 6 18" />
</svg>
<svg :elseif="name === 'check'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="m5 12.5 4.8 4.8L19 7.5" />
</svg>
<svg :elseif="name === 'double-check'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M2 12.5l4.5 4.5L15 7.5" />
  <path d="M8 12.5l4.5 4.5L21 7.5" />
</svg>
<svg :elseif="name === 'cross'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M18 6L6 18M6 6l12 12" />
</svg>
<svg :elseif="name === 'arrow-left'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M19.5 12H5M11 6l-6 6 6 6" />
</svg>
<svg :elseif="name === 'play'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M7 5v14l12-7z" />
</svg>
<svg :elseif="name === 'arrow-right'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M4.5 12H19M13 6l6 6-6 6" />
</svg>
<svg :elseif="name === 'folder-plus'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M3 6.6a1.6 1.6 0 0 1 1.6-1.6h4.3c.44 0 .86.18 1.16.5L11.5 7h7.9A1.6 1.6 0 0 1 21 8.6v8.8A1.6 1.6 0 0 1 19.4 19H4.6A1.6 1.6 0 0 1 3 17.4z" />
  <path d="M12 10.4v6M9 13.4h6" />
</svg>
<svg :elseif="name === 'trash'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M4.5 6.5h15M9.6 6.5V4.9a1.4 1.4 0 0 1 1.4-1.4h2a1.4 1.4 0 0 1 1.4 1.4v1.6" />
  <path d="M6.6 6.5l.85 12.1a1.7 1.7 0 0 0 1.7 1.6h5.7a1.7 1.7 0 0 0 1.7-1.6l.85-12.1" />
</svg>
<svg :elseif="name === 'group'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="4" y="4" width="16" height="16" rx="2.2" />
  <path d="M12 4v16M4 12h16" />
</svg>
<svg :elseif="name === 'organize'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M4 9h13M14 6l3 3-3 3M20 15H7M10 12l-3 3 3 3" />
</svg>
<svg :elseif="name === 'pencil'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M4.5 19.5h3.3L19.1 8.2a1.7 1.7 0 0 0 0-2.4l-.9-.9a1.7 1.7 0 0 0-2.4 0L4.5 16.2z" />
  <path d="m14.7 6.7 2.6 2.6" />
</svg>
<svg :elseif="name === 'save'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M5.4 4.5h10.2L19.5 8.4v10.1a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 18.5V5.9a1.4 1.4 0 0 1 1.4-1.4z" />
  <path d="M8 4.5v5h7.2v-5M7.6 20v-5.4h8.8V20" />
</svg>
<svg :elseif="name === 'search'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="11" cy="11" r="6.2" />
  <path d="m15.6 15.6 4 4" />
</svg>
<svg :elseif="name === 'hourglass'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M6.4 3.6h11.2M6.4 20.4h11.2" />
  <path d="M8 3.6v2.9c0 1.1.5 2.1 1.3 2.8L12 11.6l-2.7 2.3c-.8.7-1.3 1.7-1.3 2.8v2.9M16 3.6v2.9c0 1.1-.5 2.1-1.3 2.8L12 11.6l2.7 2.3c.8.7 1.3 1.7 1.3 2.8v2.9" />
  <path d="M10.1 17.6h3.8" stroke-width="2.6" />
</svg>
<svg :elseif="name === 'gear'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M21.7 9.7L21.7 14.3L18.6 14.2L17.9 15.8L19.9 18.2L16.3 21L14.4 18.6L12.7 19L12.1 22L7.6 21L8.4 18L7 16.9L4.2 18.3L2.2 14.1L5.1 12.9L5.1 11.1L2.2 9.9L4.2 5.7L7 7.1L8.4 6L7.6 3L12.1 2L12.7 5L14.4 5.4L16.3 3L19.9 5.8L17.9 8.2L18.6 9.8Z" />
  <circle cx="12" cy="12" r="3.1" />
</svg>
<svg :elseif="name === 'status'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- How much of a game is on disk: a full disc, a half one, an empty ring. -->
  <circle cx="12" cy="12" r="6.4" :fill="status === 'complete' ? 'currentColor' : 'none'" />
  <path :if="status === 'partial'" d="M12 5.6a6.4 6.4 0 0 1 0 12.8z" fill="currentColor" />
</svg>
<svg :elseif="name === 'dot'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
</svg>
<svg :elseif="name === 'lock'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="5" y="11" width="14" height="10" rx="2" />
  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
</svg>
<svg :elseif="name === 'refresh'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
  <path d="M21 3v5h-5" />
</svg>
<svg :elseif="name === 'github'" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" :class="className || undefined">
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
</svg>
<svg :elseif="name === 'upload'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
  <path d="M4 14v4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V14" />
</svg>
<svg :elseif="name === 'sync'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
  <path d="M4 4v4h4" />
  <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
  <path d="M20 20v-4h-4" />
</svg>
<svg :elseif="name === 'library'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M5 4h3v16H5zM10 4h3v16h-3z" />
  <path d="m15.5 5.2 2.9-.8 3.3 15.4-2.9.8z" />
</svg>
<svg :else viewBox="0 0 24 24">
  <!-- A file nothing is known about, .DS_Store included: a page, left blank. -->
  <Sheet />
</svg>

<!-- The gamepad: one shape per family of systems, the SNES-style pad otherwise. -->
<template name="Pad">
  <script :setup="{ systemId = &quot;&quot; }">$: id = String(systemId ?? "").toUpperCase();
<\/script>
  <svg viewBox="0 0 24 24" width="24" height="24">
    <g :if="['MEGADRIVE', 'GENESIS', 'MEGACD', 'S32X'].includes(id)">
      <!-- Mega Drive Crescent / Kidney Shape Controller Body -->
      <path
        d="M2.5 12.8c0-3.8 4-7.3 9.5-7.3s9.5 3.5 9.5 7.3c0 2.2-1.3 4.2-3.2 4.2-1.6 0-2.6-1.1-3.5-2.2l-.6-.8c-.5-.6-1.2-.9-1.9-.9s-1.4.3-1.9.9l-.6.8c-.9 1.1-1.9 2.2-3.5 2.2-1.9 0-3.3-2-3.3-4.2z"
        fill="var(--icon-pad)"
      />
      <!-- Direction Pad Base Circle & Cross -->
      <circle cx="7.2" cy="12" r="3.2" fill="#0f172a" opacity="0.4" />
      <rect x="6.2" y="9.8" width="2" height="4.4" rx=".5" fill="var(--icon-pad-mark)" />
      <rect x="5" y="11" width="4.4" height="2" rx=".5" fill="var(--icon-pad-mark)" />
      <!-- Red START Button -->
      <rect x="11" y="8.2" width="1.8" height="2.8" rx=".5" fill="#ef4444" transform="rotate(-15 11.9 9.6)" />
      <!-- A, B, C Buttons in Arc -->
      <circle cx="14.8" cy="13.2" r="1.25" fill="#cbd5e1" />
      <circle cx="17.2" cy="12.1" r="1.25" fill="#cbd5e1" />
      <circle cx="19.5" cy="11.0" r="1.25" fill="#cbd5e1" />
      <!-- X, Y, Z Buttons above -->
      <circle cx="14.4" cy="10.2" r="0.8" fill="#94a3b8" />
      <circle cx="16.5" cy="9.3" r="0.8" fill="#94a3b8" />
      <circle cx="18.6" cy="8.4" r="0.8" fill="#94a3b8" />
    </g>
    <g :elseif="id === 'NES'">
      <rect x="2" y="7" width="20" height="10" rx="1.5" fill="#334155" />
      <rect x="4" y="8" width="16" height="4" fill="#0f172a" />
      <!-- Red D-Pad -->
      <rect x="4.5" y="10" width="1.8" height="4" rx=".3" fill="#e60012" />
      <rect x="3.4" y="11.1" width="4" height="1.8" rx=".3" fill="#e60012" />
      <!-- Red A/B Buttons -->
      <circle cx="15.5" cy="12" r="1.3" fill="#e60012" />
      <circle cx="18.5" cy="12" r="1.3" fill="#e60012" />
      <!-- Select / Start -->
      <rect x="9.2" y="11.6" width="1.8" height="0.8" rx=".3" fill="#94a3b8" />
      <rect x="11.8" y="11.6" width="1.8" height="0.8" rx=".3" fill="#94a3b8" />
    </g>
    <g :elseif="id === 'N64'">
      <!-- N64 Trident Controller -->
      <path
        d="M4 8.5c0-1.5 1-3 2.5-3h11c1.5 0 2.5 1.5 2.5 3v2c0 2-1 4-2 6.5L16 20h-2.5l-1.5-6h-0.2l-1.5 6H8L6 16.5C5 14 4 11.5 4 10.5v-2z"
        fill="var(--icon-pad)"
      />
      <!-- Center Analog Stick Base -->
      <circle cx="12" cy="10.5" r="2" fill="#94a3b8" />
      <!-- D-Pad on Left -->
      <rect x="6.2" y="8.8" width="1.6" height="3.6" rx=".4" fill="var(--icon-pad-mark)" />
      <rect x="5.2" y="9.8" width="3.6" height="1.6" rx=".4" fill="var(--icon-pad-mark)" />
      <!-- Red A & Blue B Buttons -->
      <circle cx="15.5" cy="13.2" r="1.2" fill="#e60012" />
      <circle cx="14.2" cy="11.4" r="1.1" fill="#3b82f6" />
      <!-- Yellow C Buttons -->
      <circle cx="18.2" cy="10.5" r="0.9" fill="#eab308" />
      <circle cx="16.8" cy="8.8" r="0.9" fill="#eab308" />
    </g>
    <g :elseif="id === 'PSX'">
      <path
        d="M4.5 7.5h15c2.5 0 4.5 2 4.5 4.5v3c0 2.5-1.5 4.5-3.2 4.5-1.4 0-2.3-.9-3.2-1.9l-.6-.7c-.4-.5-1-.8-1.7-.8s-1.3.3-1.7.8l-.6.7c-.9 1-1.8 1.9-3.2 1.9-1.7 0-3.2-2-3.2-4.5v-3c0-2.5 2-4.5 4.5-4.5z"
        fill="var(--icon-pad)"
      />
      <!-- D-Pad -->
      <rect x="5.8" y="9.8" width="2.2" height="5.2" rx=".5" fill="var(--icon-pad-mark)" />
      <rect x="4.3" y="11.3" width="5.2" height="2.2" rx=".5" fill="var(--icon-pad-mark)" />
      <!-- PS Action Symbols: Triangle, Circle, Cross, Square -->
      <polygon points="17.2,8.8 18.2,10.4 16.2,10.4" fill="#22c55e" />
      <circle cx="19.4" cy="12.4" r="1" fill="#ef4444" />
      <path d="M16.4 13.8l1.6 1.6m-1.6 0l1.6-1.6" stroke="#3b82f6" stroke-width="0.8" />
      <rect x="14.2" y="11.4" width="1.8" height="1.8" rx="0.2" fill="#ec4899" />
    </g>
    <g :elseif="id === 'SATURN'">
      <ellipse cx="12" cy="12" rx="10" ry="6.5" fill="var(--icon-pad)" />
      <circle cx="7" cy="12" r="2.8" fill="#0f172a" opacity="0.4" />
      <rect x="6.2" y="10" width="1.6" height="4" rx=".4" fill="var(--icon-pad-mark)" />
      <rect x="5" y="11.2" width="4" height="1.6" rx=".4" fill="var(--icon-pad-mark)" />
      <!-- A, B, C buttons -->
      <circle cx="14.8" cy="13" r="1.1" fill="#6366f1" />
      <circle cx="17" cy="12.2" r="1.1" fill="#6366f1" />
      <circle cx="19.2" cy="11.4" r="1.1" fill="#6366f1" />
    </g>
    <g :elseif="id === 'SMS'">
      <rect x="3" y="7" width="18" height="10" rx="1.5" fill="#0284c7" />
      <rect x="5" y="9" width="6" height="6" fill="#0f172a" />
      <line x1="5" y1="12" x2="11" y2="12" stroke="#ef4444" stroke-width="1.2" />
      <line x1="8" y1="9" x2="8" y2="15" stroke="#ef4444" stroke-width="1.2" />
      <circle cx="15.5" cy="12" r="1.3" fill="#cbd5e1" />
      <circle cx="18.5" cy="12" r="1.3" fill="#cbd5e1" />
    </g>
    <g :elseif="['TGFX16', 'TGFX16-CD'].includes(id)">
      <rect x="3" y="7" width="18" height="10" rx="2" fill="#d97706" />
      <rect x="5" y="9" width="6" height="6" rx="1" fill="#78350f" />
      <rect x="7" y="9.8" width="2" height="4.4" rx=".4" fill="#fef3c7" />
      <rect x="5.8" y="11" width="4.4" height="2" rx=".4" fill="#fef3c7" />
      <circle cx="15" cy="12" r="1.3" fill="#ef4444" />
      <circle cx="18" cy="12" r="1.3" fill="#ef4444" />
    </g>
    <g :elseif="['NEOGEO', 'NEOGEO-CD'].includes(id)">
      <!-- Dark Charcoal Console Chassis -->
      <rect x="2" y="6" width="20" height="13" rx="1.5" fill="#26272b" stroke="#141518" stroke-width="0.8" />
      <!-- Top Vent Strip & SNK marker -->
      <rect x="2" y="6" width="20" height="3" fill="#1d1e22" />
      <rect x="3" y="7" width="2.5" height="1" fill="#ffffff" />
      <!-- Cartridge Slot Recess -->
      <rect x="5" y="10" width="14" height="3.5" rx="0.8" fill="#141518" />
      <rect x="6" y="11" width="12" height="1.5" rx="0.4" fill="#0d0e10" />
      <!-- Gold Neo-Geo Accent -->
      <rect x="9" y="15" width="6" height="1.8" rx="0.4" fill="#eab308" />
      <!-- Reset button indicator -->
      <circle cx="5" cy="16" r="0.8" fill="#64748b" />
    </g>
    <g :elseif="['ATARI2600', 'ATARI5200', 'ATARI7800', 'ATARILYNX'].includes(id)">
      <rect x="7" y="11" width="10" height="7" rx="1.5" fill="#ea580c" />
      <rect x="11" y="5" width="2" height="7" rx="0.5" fill="#78350f" />
      <circle cx="12" cy="5" r="1" fill="#ef4444" />
      <circle cx="9" cy="13" r="1.2" fill="#ef4444" />
    </g>
    <g :elseif="id === 'GBA'">
      <!-- Top L / R Shoulder Bumpers -->
      <path d="M4 6.5C4 5.5 6.5 5 12 5s8 1 8 1.5v3H4v-3z" fill="#cbd5e1" />
      <!-- Indigo GBA Horizontal Shell Body -->
      <path
        d="M7 6h10c2.5 0 4.5.8 5.5 2.2 1 1.5 1 3.8 1 3.8s0 2.3-1 3.8C21.5 17.2 19.5 18 17 18H7c-2.5 0-4.5-.8-5.5-2.2C.5 14.3.5 12 .5 12s0-2.3 1-3.8C2.5 6.8 4.5 6 7 6z"
        fill="#544697"
      />
      <!-- Screen Frame Bezel -->
      <rect x="7" y="7" width="10" height="9.5" rx="1.5" fill="#232328" />
      <rect x="8" y="8" width="8" height="6" rx="0.8" fill="#121316" />
      <!-- Silver D-Pad -->
      <rect x="3.2" y="10.8" width="2.6" height="1.1" rx=".3" fill="#e2e8f0" />
      <rect x="3.95" y="10.05" width="1.1" height="2.6" rx=".3" fill="#e2e8f0" />
      <!-- Silver A / B Buttons -->
      <circle cx="17.4" cy="12.2" r="1.0" fill="#e2e8f0" />
      <circle cx="19.2" cy="10.6" r="1.0" fill="#e2e8f0" />
      <!-- Start / Select Pills -->
      <rect x="3.8" y="13" width="1.8" height="0.7" rx=".3" fill="#362f63" transform="rotate(20 4.7 13.35)" />
      <rect x="3.8" y="14.2" width="1.8" height="0.7" rx=".3" fill="#362f63" transform="rotate(20 4.7 14.55)" />
    </g>
    <g :elseif="['GAMEBOY', 'GBC', 'GAMEGEAR', 'WONDERSWAN', 'WONDERSWANCOLOR', 'POKEMONMINI'].includes(id)">
      <rect x="3" y="7" width="18" height="10" rx="2.5" fill="#3b82f6" />
      <rect x="7" y="8.5" width="10" height="7" rx="1" fill="#0f172a" />
      <circle cx="17.8" cy="12" r="1.1" fill="#cbd5e1" />
      <rect x="4.2" y="10.8" width="1.6" height="3" rx=".4" fill="#cbd5e1" />
      <rect x="3.5" y="11.5" width="3" height="1.6" rx=".4" fill="#cbd5e1" />
    </g>
    <g :else>
      <!-- SNES / Retro Gamepad Body Shell (Well-proportioned horizontal contour) -->
      <path
        d="M5.5 6.2h13c3.5 0 5.5 2.4 5.5 5.5s-2 5.5-5.5 5.5h-1.6c-1.1 0-2.1-.5-2.6-1.4l-.4-.8c-.4-.6-1.1-.9-1.9-.9s-1.5.3-1.9.9l-.4.8c-.5.9-1.5 1.4-2.6 1.4H5.5C2 17.2 0 14.8 0 11.7S2 6.2 5.5 6.2z"
        fill="var(--icon-pad)"
      />
      <!-- Inner Faceplate Contour -->
      <path
        d="M5.5 7.2h13c2.8 0 4.5 1.9 4.5 4.5s-1.7 4.5-4.5 4.5h-1.6c-.8 0-1.6-.4-2-1.1l-.4-.8c-.6-1-1.7-1.6-2.9-1.6s-2.3.6-2.9 1.6l-.4.8c-.4.7-1.2 1.1-2 1.1H5.5C2.7 16.2 1 14.3 1 11.7S2.7 7.2 5.5 7.2z"
        fill="var(--icon-pad-face)"
        opacity="0.15"
      />
      <!-- D-Pad -->
      <rect x="5.2" y="9.2" width="2.4" height="6.4" rx=".7" fill="var(--icon-pad-mark)" />
      <rect x="3.2" y="11.2" width="6.4" height="2.4" rx=".7" fill="var(--icon-pad-mark)" />
      <!-- Four Colored Action Buttons (SNES Palette - Spacious Spacing) -->
      <circle cx="17.2" cy="9.1" r="1.3" fill="#f9ab00" />
      <circle cx="19.6" cy="11.7" r="1.3" fill="#e94235" />
      <circle cx="17.2" cy="14.3" r="1.3" fill="#34a853" />
      <circle cx="14.8" cy="11.7" r="1.3" fill="#4285f4" />
      <!-- Select & Start Pill Buttons -->
      <rect x="9.6" y="12.3" width="1.9" height="0.85" rx=".4" fill="var(--icon-pad-mark)" transform="rotate(-20 10.5 12.7)" />
      <rect x="11.9" y="12.3" width="1.9" height="0.85" rx=".4" fill="var(--icon-pad-mark)" transform="rotate(-20 12.8 12.7)" />
    </g>
  </svg>
</template>

<!--
  A parcel: a box and the tape across it. The tape is a share of the box, so one
  drawing holds at the 7.8 units of a corner mark and the 16.8 of a whole icon.
-->
<template name="Parcel">
  <script :setup="{ x, y, width, height, rx }">$: band = height * 0.3;
<\/script>
  <svg viewBox="0 0 24 24" width="24" height="24">
    <rect :x="x" :y="y" :width="width" :height="height" :rx="rx" fill="var(--icon-box)" />
    <rect :x="x" :y="y + band" :width="width" :height="height * 0.229" fill="var(--icon-box-tape)" />
    <rect :x="x + width * 0.385" :y="y" :width="width * 0.205" :height="band" fill="var(--icon-box-tape)" />
  </svg>
</template>

<!-- The page both file marks are drawn on, with its top corner turned over. -->
<template name="Sheet">
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path d="M6.2 2.4h7.1L19.2 8.3v11.9a1.5 1.5 0 0 1-1.5 1.5H6.2a1.5 1.5 0 0 1-1.5-1.5V3.9a1.5 1.5 0 0 1 1.5-1.5z" fill="var(--icon-paper)" />
    <path d="M13.3 2.4 19.2 8.3h-4.4a1.5 1.5 0 0 1-1.5-1.5z" fill="var(--icon-paper-fold)" />
  </svg>
</template>
`,Lt={},Nt="components/Icon.html";let C;C=new m(At,{modules:Lt,filename:Nt});const f=C;C.Pad;C.Parcel;C.Sheet;const Pt=`<!--
  The open origins as tabs: the library (never closed) and any folders. Emits
  \`select\` and \`close\` with the origin's id.
-->
<script :setup="{ origins = [], activeOriginId = void 0, labels = {} }">const Icon = await import("./Icon.html");
$: reconnectTitle = labels.reconnect ?? "Reconnect folder";
$: closeTitle = labels.close ?? "Close tab";
const close = (event, id) => {
  event.stopPropagation();
  $emit("close", id);
};
<\/script>

<div class="tabs">
  <div
    :each="origin in origins"
    :key="origin.id"
    :class="\`tab \${activeOriginId === origin.id ? 'active' : ''} \${origin.locked ? 'locked' : ''}\`"
    @click="$emit('select', origin.id)"
    :title="origin.locked ? reconnectTitle : undefined"
  >
    <span :if="origin.locked" class="tab-lock"><Icon name="refresh" /></span>
    <span :if="origin.kind === 'library'" class="tab-lock"><Icon name="library" /></span>
    <span class="tab-name">{{ origin.name }}</span>
    <!-- The library is the app's own storage: there is nothing to close. -->
    <button :if="origin.kind !== 'library'" class="tab-close" @click="close($event, origin.id)" :title="closeTitle">
      <Icon name="close" />
    </button>
  </div>
</div>
`,zt={"./Icon.html":f},Dt="components/Tabs.html";let we;we=new m(Pt,{modules:zt,filename:Dt});const Bt=we,be=1,G=`${b}/wizard.json`;function O(){return{folders:{},regionOrder:ce}}function Tt(t,e,n){const a=e.folders[t];return typeof a=="boolean"?a:n.has(t)}function Ft(t){return t.length>0&&!t.startsWith("/")&&!t.includes("\\")&&!t.split("/").includes("..")}function Gt(t){if(!t||typeof t!="object")return O();const e=t;if(e.version!==be||!e.folders||typeof e.folders!="object")return O();const n={};for(const[a,i]of Object.entries(e.folders))typeof i=="boolean"&&Ft(a)&&(n[a]=i);return{folders:n,regionOrder:de(e.regionOrder)}}class jt{static async read(e){try{const n=await e.readFile(G);return Gt(JSON.parse(new TextDecoder().decode(n)))}catch{return O()}}static async write(e,n){const a={version:be,folders:n.folders,regionOrder:ut(n.regionOrder)};await e.createDirectory(b),await e.writeFile(G,new TextEncoder().encode(`${JSON.stringify(a,null,2)}
`))}static async setWizard(e,n,a,i){const o=await this.read(e),r={...o.folders};a===i.has(n)?delete r[n]:r[n]=a;const s={...o,folders:r};return await this.write(e,s),s}static async setRegionOrder(e,n){const i={...await this.read(e),regionOrder:de(n)};return await this.write(e,i),i}}const Ut=Object.freeze(Object.defineProperty({__proto__:null,WIZARD_CONFIG_PATH:G,WizardConfigService:jt,emptySettings:O,isWizardFolder:Tt},Symbol.toStringTag,{value:"Module"})),l=me({origins:[],activeOriginId:void 0,loading:!1,error:void 0,wizardSettings:O(),knownSystems:[]}),se="rom-manager:active-origin-id";function T(t){try{t?localStorage.setItem(se,t):localStorage.removeItem(se)}catch{}}class x{static instance;constructor(){}static getInstance(){return x.instance||(x.instance=new x),x.instance}addOrigin(e){const n=l.origins.findIndex(a=>a.id===e.id);l.origins=n===-1?[...l.origins,e]:l.origins.map((a,i)=>i===n?e:a),l.activeOriginId||(l.activeOriginId=e.id,T(e.id))}getOrigin(e){return l.origins.find(n=>n.id===e)}getOrigins(){return[...l.origins]}removeOrigin(e){if(l.origins=l.origins.filter(n=>n.id!==e),l.activeOriginId===e){const n=l.origins[0]?.id;l.activeOriginId=n,T(n)}}setActiveOrigin(e){this.getOrigin(e)&&(l.activeOriginId=e,T(e))}getActiveOrigin(){const e=l.activeOriginId;return e?this.getOrigin(e):void 0}setSelection(e){const n=l.activeOriginId;n&&(l.origins=l.origins.map(a=>a.id===n?{...a,selection:e}:a))}getSelection(){return this.getActiveOrigin()?.selection||[]}setLoading(e){l.loading=e}isLoading(){return l.loading}setError(e){l.error=e}getError(){return l.error}setWizardSettings(e){l.wizardSettings=e}getWizardSettings(){return oe(l).wizardSettings}setKnownSystems(e){l.knownSystems=Array.from(e)}getKnownSystems(){return new Set(oe(l).knownSystems)}clear(){l.origins=[],l.activeOriginId=void 0,l.loading=!1,l.error=void 0,l.wizardSettings=O()}}const qt=x.getInstance(),Vt=Object.freeze(Object.defineProperty({__proto__:null,StoreService:x,appState:l,storeService:qt},Symbol.toStringTag,{value:"Module"})),ke=["auto","light","dark"],L="auto";function xe(t){return ke.find(e=>e===t)??L}function Se(t,e){return t==="auto"?e?"dark":"light":t}const Ht=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_THEME_MODE:L,THEME_MODES:ke,parseThemeMode:xe,resolveTheme:Se},Symbol.toStringTag,{value:"Module"})),Oe="rom-manager.theme",Wt="(prefers-color-scheme: dark)",_=me({mode:L});function Kt(){try{return xe(localStorage.getItem(Oe))}catch{return L}}function Yt(t){try{localStorage.setItem(Oe,t)}catch{}}function _e(){return typeof matchMedia=="function"?matchMedia(Wt):void 0}function j(t){typeof document>"u"||(document.documentElement.dataset.theme=Se(t,_e()?.matches??!1))}function Xt(t){_.mode=t,Yt(t),j(t)}function Zt(){const t=Kt();_.mode=t,j(t);const e=_e();if(!e)return()=>{};const n=()=>j(_.mode);return e.addEventListener("change",n),()=>e.removeEventListener("change",n)}const Me=Object.freeze(Object.defineProperty({__proto__:null,initTheme:Zt,setThemeMode:Xt,themeState:_},Symbol.toStringTag,{value:"Module"}));class Jt{get locale(){return re.locale}get localePreference(){return re.preference}get themeMode(){return _.mode}get origins(){return l.origins}get activeOriginId(){return l.activeOriginId}get loading(){return l.loading}get error(){return l.error}get knownSystems(){return l.knownSystems}get wizardSettings(){return l.wizardSettings}}const Qt=new Jt,h=Object.freeze(Object.defineProperty({__proto__:null,t:vt,ui:Qt},Symbol.toStringTag,{value:"Module"})),en=`<!--
  The explorer's header: the mark (back to the start), the open tabs, add ROMs,
  sync, the preferred region and the preferences.

  Events: go-home, open-folder, add-roms, sync, select-origin (id),
  close-origin (id), region-order-change (order), open-preferences.
  \`canOpenFolder\` / \`canAddRoms\` / \`canSync\` say which buttons exist; \`launcherUrl\`, when
  rom-manager is a launcher's \`/roms/\`, is the way back to it.
-->
<script
  :setup="{ origins = [], activeOriginId = void 0, showLanding = false, regionOrder = [], hasNode = false, canOpenFolder = false, canAddRoms = false, canSync = false, launcherUrl = void 0 }">const [BrandLogo, Icon, Tabs, { REGIONS, preferRegion }, { t }] = await $importAll([
  "../components/BrandLogo.html",
  "../components/Icon.html",
  "../components/Tabs.html",
  "../helpers/rom-regions",
  "../lib/ui-state"
]);
<\/script>

<header class="explorer-header">
  <div class="header-left">
    <h1 class="explorer-title clickable" @click="$emit('go-home')" :title="t('app.name')">
      <BrandLogo class-name="explorer-mark" />
      {{ t('app.name') }}
    </h1>
    <a :if="launcherUrl" class="header-launcher icon-label" :href="launcherUrl" :title="t('host.launcherTitle')">
      <Icon name="arrow-left" /> {{ t('host.launcher') }}
    </a>
    <button :if="canOpenFolder" class="tab-add" @click="$emit('open-folder')" :title="t('tabs.add')">
      <Icon name="plus" />
    </button>
  </div>

  <div class="header-right">
    <Tabs
      :origins="origins"
      :active-origin-id="showLanding ? undefined : activeOriginId"
      :labels="{ reconnect: t('tabs.reconnect'), close: t('tabs.close') }"
      @select="$emit('select-origin', $event.detail)"
      @close="$emit('close-origin', $event.detail)"
    />
    <div class="header-right-actions">
      <button :if="canAddRoms" class="header-prefs" @click="$emit('add-roms')" :title="t('library.add')">
        <Icon name="upload" />
      </button>
      <button :if="canSync" class="header-prefs" @click="$emit('sync')" :title="t('library.sync.action')">
        <Icon name="sync" />
      </button>
      <div class="header-regions" role="group" :aria-label="t('header.regions.label')">
        <button
          :each="region in REGIONS"
          :key="region"
          :class="\`header-region \${regionOrder[0] === region ? 'on' : ''}\`"
          :disabled="!hasNode || showLanding"
          :aria-pressed="regionOrder[0] === region ? 'true' : 'false'"
          :title="regionOrder[0] === region ? t('header.regions.preferred', { region }) : t('header.regions.prefer', { region })"
          @click="$emit('region-order-change', preferRegion(regionOrder, region))"
        >
          {{ region }}
        </button>
      </div>

      <button class="header-prefs" @click="$emit('open-preferences')" :title="t('header.preferences')">
        <Icon name="gear" />
      </button>
    </div>
  </div>
</header>
`,tn={"../components/BrandLogo.html":ye,"../components/Icon.html":f,"../components/Tabs.html":Bt,"../helpers/rom-regions":fe,"../lib/ui-state":h},nn="views/Header.html";let Ce;Ce=new m(en,{modules:tn,filename:nn});const an=Ce,on=`<!--
  A console, drawn: the badge of a system folder and the mark of a system's page.
  One branch per system the catalogue knows; anything else gets the generic one.
-->
<script :setup="{ systemId = &quot;&quot;, className = &quot;system-logo-svg&quot; }">$: id = String(systemId).toUpperCase();
<\/script>

<svg :if="id === 'NES'" viewBox="0 0 128 128" :class="className" aria-label="NES Console">
  <!-- NES Console Main Body -->
  <rect x="8" y="32" width="112" height="68" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="3" />
  <!-- Black top band -->
  <rect x="8" y="32" width="112" height="20" fill="#1e293b" />
  <!-- Cartridge Door Slot -->
  <rect x="18" y="36" width="60" height="12" fill="#0f172a" rx="1" />
  <rect x="20" y="38" width="56" height="3" fill="#334155" />
  <!-- Red Power / Reset Buttons -->
  <rect x="18" y="72" width="16" height="18" rx="2" fill="#94a3b8" />
  <rect x="22" y="76" width="8" height="10" rx="1" fill="#e60012" />
  <rect x="38" y="72" width="16" height="18" rx="2" fill="#94a3b8" />
  <rect x="42" y="76" width="8" height="10" rx="1" fill="#e60012" />
  <!-- Controller Ports -->
  <rect x="68" y="74" width="20" height="12" rx="2" fill="#0f172a" />
  <rect x="92" y="74" width="20" height="12" rx="2" fill="#0f172a" />
  <!-- Ventilation Grill Lines -->
  <line x1="84" y1="36" x2="114" y2="36" stroke="#475569" stroke-width="2" />
  <line x1="84" y1="40" x2="114" y2="40" stroke="#475569" stroke-width="2" />
  <line x1="84" y1="44" x2="114" y2="44" stroke="#475569" stroke-width="2" />
</svg>
<svg :elseif="id === 'SNES'" viewBox="0 0 128 128" :class="className" aria-label="SNES Console">
  <!-- SNES Main Body -->
  <rect x="12" y="24" width="104" height="80" rx="12" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
  <!-- Darker Center Section -->
  <rect x="24" y="24" width="80" height="56" rx="6" fill="#94a3b8" />
  <!-- Cartridge Slot & Flap -->
  <rect x="32" y="32" width="64" height="14" rx="3" fill="#475569" />
  <rect x="36" y="35" width="56" height="4" rx="1" fill="#1e293b" />
  <!-- Purple Power / Eject / Reset Switches -->
  <rect x="28" y="54" width="14" height="20" rx="2" fill="#8b5cf6" />
  <rect x="48" y="56" width="32" height="14" rx="2" fill="#64748b" />
  <rect x="86" y="54" width="14" height="20" rx="2" fill="#8b5cf6" />
  <!-- Controller Ports Front Panel -->
  <rect x="24" y="84" width="80" height="16" rx="4" fill="#94a3b8" />
  <rect x="32" y="87" width="28" height="10" rx="3" fill="#334155" />
  <rect x="68" y="87" width="28" height="10" rx="3" fill="#334155" />
</svg>
<svg :elseif="id === 'GAMEBOY'" viewBox="0 0 128 128" :class="className" aria-label="Game Boy Console">
  <!-- Handheld Shell -->
  <path d="M32 10h64a10 10 0 0 1 10 10v78a10 10 0 0 1-10 10H50L32 94V20a10 10 0 0 1 10-10z" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
  <!-- Screen Frame -->
  <rect x="40" y="20" width="48" height="38" rx="4" fill="#94a3b8" />
  <rect x="46" y="24" width="36" height="28" rx="2" fill="#8bac0f" />
  <rect x="48" y="26" width="32" height="24" fill="#9bbc0f" />
  <!-- D-Pad -->
  <rect x="40" y="68" width="16" height="5" rx="1.5" fill="#334155" />
  <rect x="45.5" y="62.5" width="5" height="16" rx="1.5" fill="#334155" />
  <!-- Buttons A / B -->
  <circle cx="76" cy="74" r="5" fill="#9333ea" />
  <circle cx="88" cy="67" r="5" fill="#9333ea" />
  <!-- Select / Start -->
  <rect x="52" y="94" width="10" height="3" rx="1" fill="#64748b" transform="rotate(-25 57 95.5)" />
  <rect x="66" y="94" width="10" height="3" rx="1" fill="#64748b" transform="rotate(-25 71 95.5)" />
</svg>
<svg :elseif="id === 'GBC'" viewBox="0 0 128 128" :class="className" aria-label="Game Boy Color Console">
  <path d="M32 10h64a10 10 0 0 1 10 10v78a10 10 0 0 1-10 10H50L32 94V20a10 10 0 0 1 10-10z" fill="#7e22ce" stroke="#581c87" stroke-width="3" />
  <rect x="38" y="18" width="52" height="40" rx="4" fill="#1e293b" />
  <rect x="44" y="22" width="40" height="30" rx="2" fill="#0284c7" />
  <circle cx="76" cy="74" r="5" fill="#ef4444" />
  <circle cx="88" cy="67" r="5" fill="#eab308" />
  <rect x="40" y="68" width="16" height="5" rx="1.5" fill="#0f172a" />
  <rect x="45.5" y="62.5" width="5" height="16" rx="1.5" fill="#0f172a" />
</svg>
<svg :elseif="id === 'GBA'" viewBox="0 0 128 128" :class="className" aria-label="Game Boy Advance Console">
  <!-- Top L / R Shoulder Bumpers Backing -->
  <path
    d="M24 30C24 24 36 22 50 22h28c14 0 26 2 26 8 2 8 8 16 8 34 0 18-6 26-8 34H24c-2-8-8-16-8-34 0-18 6-26 8-34z"
    fill="#d1d5db"
    stroke="#9ca3af"
    stroke-width="2"
  />
  <!-- Authentic Indigo Body (Wide horizontal curve layout) -->
  <path
    d="M44 26h40c10 0 18 2 25 7 9 6 13 18 13 31 0 14-4 25-13 31-7 5-15 7-25 7H44c-10 0-18-2-25-7-9-6-13-17-13-31 0-13 4-25 13-31 7-5 15-7 25-7z"
    fill="#544697"
    stroke="#382e6e"
    stroke-width="2.5"
  />
  <!-- Center Screen Bezel -->
  <path
    d="M38 34h52c6 0 10 4 10 10v38c0 10-6 14-12 14H40c-6 0-12-4-12-14V44c0-6 4-10 10-10z"
    fill="#232328"
    stroke="#17171a"
    stroke-width="1.5"
  />
  <!-- Screen Display Inset -->
  <rect x="42" y="39" width="44" height="33" rx="3" fill="#121316" />
  <rect x="44" y="41" width="40" height="29" rx="1.5" fill="#1c1e24" />
  <!-- D-Pad (Light Silver Cross on Left Wing) -->
  <rect x="20" y="54" width="14" height="6" rx="1.5" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.8" />
  <rect x="24" y="50" width="6" height="14" rx="1.5" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.8" />
  <circle cx="27" cy="57" r="1.5" fill="#cbd5e1" />
  <!-- SELECT & START Angled Pills below D-Pad -->
  <rect x="20" y="70" width="14" height="4.5" rx="2.25" fill="#362f63" transform="rotate(25 27 72.25)" />
  <circle cx="31" cy="74" r="1.5" fill="#e2e8f0" />
  <rect x="20" y="78" width="14" height="4.5" rx="2.25" fill="#362f63" transform="rotate(25 27 80.25)" />
  <circle cx="31" cy="82" r="1.5" fill="#e2e8f0" />
  <!-- A & B Action Buttons (Light Silver angled buttons on Right Wing) -->
  <circle cx="88" cy="62" r="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
  <circle cx="99" cy="54" r="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
  <!-- Speaker Ventilation Grille Lines (Bottom Right) -->
  <line x1="88" y1="76" x2="99" y2="73" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
  <line x1="88" y1="80" x2="99" y2="77" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
  <line x1="88" y1="84" x2="99" y2="81" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
  <line x1="88" y1="88" x2="99" y2="85" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
  <line x1="88" y1="92" x2="99" y2="89" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
</svg>
<svg :elseif="id === 'N64'" viewBox="0 0 128 128" :class="className" aria-label="Nintendo 64 Console">
  <!-- N64 Curved Console Body -->
  <path d="M16 40L28 20h72l12 20v56H16V40z" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
  <path d="M28 20h72v24H28V20z" fill="#334155" />
  <!-- Cartridge Slot -->
  <rect x="36" y="24" width="56" height="12" rx="3" fill="#0f172a" />
  <!-- N64 Jewel Logo -->
  <circle cx="64" cy="50" r="8" fill="#10b981" />
  <path d="M64 44l6 4-6 4-6-4z" fill="#ef4444" />
  <!-- Controller Ports on Front -->
  <rect x="24" y="70" width="16" height="12" rx="3" fill="#0f172a" />
  <rect x="44" y="70" width="16" height="12" rx="3" fill="#0f172a" />
  <rect x="68" y="70" width="16" height="12" rx="3" fill="#0f172a" />
  <rect x="88" y="70" width="16" height="12" rx="3" fill="#0f172a" />
  <!-- Feet -->
  <rect x="20" y="96" width="16" height="8" rx="2" fill="#0f172a" />
  <rect x="92" y="96" width="16" height="8" rx="2" fill="#0f172a" />
</svg>
<svg :elseif="['MEGADRIVE', 'GENESIS'].includes(id)" viewBox="0 0 128 128" :class="className" aria-label="Mega Drive Console">
  <!-- Mega Drive Main Matte Black Body -->
  <rect x="12" y="24" width="104" height="80" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
  <!-- Circular Elevated Section -->
  <circle cx="64" cy="56" r="28" fill="#0f172a" stroke="#334155" stroke-width="2" />
  <circle cx="64" cy="56" r="20" fill="#1e293b" />
  <!-- Cartridge Slot -->
  <rect x="36" y="30" width="56" height="12" rx="3" fill="#0f172a" />
  <!-- Metallic 16-BIT Badge -->
  <text x="64" y="60" font-size="10" font-weight="bold" fill="#38bdf8" text-anchor="middle" letter-spacing="1">
    16-BIT
  </text>
  <!-- Red Reset Button -->
  <circle cx="28" cy="80" r="5" fill="#ef4444" />
</svg>
<svg :elseif="id === 'MEGACD'" viewBox="0 0 128 128" :class="className" aria-label="Mega-CD Console">
  <!-- Top Console -->
  <rect x="24" y="16" width="80" height="48" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
  <circle cx="64" cy="36" r="14" fill="#0f172a" />
  <!-- Bottom CD Unit -->
  <rect x="12" y="60" width="104" height="48" rx="6" fill="#334155" stroke="#0f172a" stroke-width="3" />
  <rect x="24" y="76" width="80" height="16" rx="3" fill="#0f172a" />
  <circle cx="94" cy="84" r="3" fill="#22c55e" />
</svg>
<svg :elseif="id === 'S32X'" viewBox="0 0 128 128" :class="className" aria-label="32X Console">
  <path d="M24 32h80l-12 56H36L24 32z" fill="#ef4444" stroke="#7f1d1d" stroke-width="3" />
  <rect x="38" y="44" width="52" height="16" rx="3" fill="#7f1d1d" />
  <text x="64" y="56" font-size="12" font-weight="bold" fill="#fca5a5" text-anchor="middle">
    32X
  </text>
</svg>
<svg :elseif="id === 'SATURN'" viewBox="0 0 128 128" :class="className" aria-label="Sega Saturn Console">
  <rect x="12" y="24" width="104" height="80" rx="10" fill="#334155" stroke="#1e293b" stroke-width="3" />
  <!-- Round CD Lid -->
  <circle cx="64" cy="58" r="26" fill="#1e293b" stroke="#475569" stroke-width="2" />
  <circle cx="64" cy="58" r="10" fill="#6366f1" />
  <!-- Power / Open Buttons -->
  <circle cx="28" cy="40" r="6" fill="#64748b" />
  <circle cx="100" cy="40" r="6" fill="#64748b" />
</svg>
<svg :elseif="id === 'PSX'" viewBox="0 0 128 128" :class="className" aria-label="PlayStation Console">
  <!-- PS1 Classic Gray Body -->
  <rect x="12" y="24" width="104" height="80" rx="10" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
  <!-- Circular CD Lid in Center -->
  <circle cx="64" cy="56" r="26" fill="#94a3b8" stroke="#475569" stroke-width="2" />
  <circle cx="64" cy="56" r="12" fill="#64748b" />
  <!-- Power / Open / Reset Buttons -->
  <circle cx="28" cy="42" r="7" fill="#64748b" />
  <circle cx="100" cy="42" r="7" fill="#64748b" />
  <circle cx="100" cy="74" r="5" fill="#64748b" />
  <!-- Front Dual Memory Card & Controller Slots -->
  <rect x="24" y="88" width="36" height="10" rx="2" fill="#475569" />
  <rect x="68" y="88" width="36" height="10" rx="2" fill="#475569" />
</svg>
<svg :elseif="id === 'SMS'" viewBox="0 0 128 128" :class="className" aria-label="Master System Console">
  <path d="M12 28L28 16h72l16 12v68H12V28z" fill="#0284c7" stroke="#0369a1" stroke-width="3" />
  <rect x="24" y="32" width="80" height="24" fill="#0f172a" />
  <line x1="24" y1="64" x2="104" y2="64" stroke="#ef4444" stroke-width="4" />
</svg>
<svg :elseif="id === 'GAMEGEAR'" viewBox="0 0 128 128" :class="className" aria-label="Game Gear Console">
  <rect x="10" y="28" width="108" height="72" rx="16" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
  <rect x="42" y="36" width="44" height="34" rx="4" fill="#2563eb" />
  <rect x="46" y="40" width="36" height="26" fill="#0f172a" />
  <circle cx="26" cy="64" r="7" fill="#ef4444" />
  <circle cx="98" cy="58" r="4" fill="#eab308" />
  <circle cx="98" cy="70" r="4" fill="#22c55e" />
</svg>
<svg :elseif="['TGFX16', 'TGFX16-CD'].includes(id)" viewBox="0 0 128 128" :class="className" aria-label="TurboGrafx Console">
  <rect x="16" y="24" width="96" height="80" rx="8" fill="#d97706" stroke="#78350f" stroke-width="3" />
  <rect x="28" y="32" width="72" height="32" rx="4" fill="#78350f" />
  <text x="64" y="52" font-size="14" font-weight="bold" fill="#fef3c7" text-anchor="middle">
    TURBO
  </text>
</svg>
<svg :elseif="['NEOGEO', 'NEOGEO-CD'].includes(id)" viewBox="0 0 128 128" :class="className" aria-label="Neo Geo Console">
  <!-- Main Charcoal Console Chassis -->
  <rect x="10" y="20" width="108" height="88" rx="6" fill="#26272b" stroke="#141518" stroke-width="3" />

  <!-- Top Ventilation Ridge & Inset -->
  <path d="M10 20h108v16H10z" fill="#1d1e22" />
  <path d="M22 20v16M26 20v16M30 20v16M98 20v16M102 20v16M106 20v16" stroke="#141518" stroke-width="1.5" />
  <!-- Horizontal Vent Lines -->
  <line x1="38" y1="25" x2="90" y2="25" stroke="#141518" stroke-width="1.5" />
  <line x1="38" y1="28" x2="90" y2="28" stroke="#141518" stroke-width="1.5" />
  <line x1="38" y1="31" x2="90" y2="31" stroke="#141518" stroke-width="1.5" />

  <!-- Top-Left SNK Logo -->
  <text x="14" y="32" font-size="7" font-weight="900" fill="#ffffff" letter-spacing="0.5">
    SNK
  </text>

  <!-- Central Cartridge Slot Recess -->
  <rect x="22" y="42" width="84" height="24" rx="4" fill="#18191c" stroke="#101113" stroke-width="1.5" />
  <rect x="28" y="48" width="72" height="12" rx="2" fill="#0d0e10" />
  <line x1="28" y1="54" x2="100" y2="54" stroke="#26272b" stroke-width="1" />

  <!-- Bottom Left Joystick Recess & Buttons -->
  <ellipse cx="26" cy="80" rx="10" ry="12" fill="#1c1d20" stroke="#141518" stroke-width="1" />
  <circle cx="26" cy="78" r="4.5" fill="#121315" stroke="#333438" stroke-width="1" />
  <text x="26" y="96" font-size="3" font-weight="700" fill="#94a3b8" text-anchor="middle">
    RESET
  </text>

  <!-- Center Gold Typography Badge -->
  <text x="64" y="77" font-size="9" font-weight="900" fill="#eab308" text-anchor="middle" letter-spacing="0.5">
    NEO·GEO
  </text>
  <text x="64" y="83" font-size="3.5" font-weight="800" fill="#ca8a04" text-anchor="middle" letter-spacing="0.4">
    MAX 330 MEGA
  </text>
  <text x="64" y="88" font-size="3" font-weight="700" fill="#ca8a04" text-anchor="middle" letter-spacing="0.3">
    PRO-GEAR SPEC
  </text>
  <text x="64" y="93" font-size="2.6" font-weight="600" fill="#a16207" text-anchor="middle" letter-spacing="0.2">
    ADVANCED ENTERTAINMENT SYSTEM
  </text>

  <!-- Bottom Right Memory Card In Slot Indicator -->
  <polygon points="98,90 102,90 100,93" fill="#cbd5e1" />
  <text x="100" y="88" font-size="2.6" font-weight="700" fill="#94a3b8" text-anchor="middle">
    CARD IN
  </text>
</svg>
<svg :elseif="['ATARI2600', 'ATARI5200', 'ATARI7800', 'ATARILYNX'].includes(id)" viewBox="0 0 128 128" :class="className" aria-label="Atari Console">
  <rect x="12" y="28" width="104" height="72" rx="8" fill="#ea580c" stroke="#9a3412" stroke-width="3" />
  <rect x="12" y="60" width="104" height="16" fill="#78350f" />
  <path d="M64 36v32M48 68c0-16 8-24 16-24s16 8 16 24" fill="none" stroke="#fff" stroke-width="5" />
</svg>
<svg :elseif="['WONDERSWAN', 'WONDERSWANCOLOR'].includes(id)" viewBox="0 0 128 128" :class="className" aria-label="WonderSwan Console">
  <rect x="20" y="24" width="88" height="80" rx="14" fill="#06b6d4" stroke="#155e75" stroke-width="3" />
  <rect x="34" y="32" width="60" height="36" rx="4" fill="#155e75" />
  <circle cx="34" cy="82" r="4" fill="#fff" />
  <circle cx="46" cy="82" r="4" fill="#fff" />
  <circle cx="82" cy="82" r="4" fill="#fff" />
</svg>
<svg :else viewBox="0 0 128 128" :class="className" aria-label="Retro Console">
  <rect x="16" y="28" width="96" height="72" rx="10" fill="var(--surface-3)" stroke="var(--border)" stroke-width="3" />
  <circle cx="44" cy="64" r="10" fill="var(--icon-pad-mark)" />
  <circle cx="80" cy="58" r="6" fill="#ef4444" />
  <circle cx="88" cy="70" r="6" fill="#3b82f6" />
</svg>
`,rn={},sn="components/SystemLogo.html";let $e;$e=new m(on,{modules:rn,filename:sn});const N=$e,ln=`<!-- The welcome panel's four capability drawings, by \`kind\`: hash, grouping, covers, consolidate. -->
<script :setup="{ kind = &quot;hash&quot;, className = &quot;&quot; }"><\/script>

<svg :if="kind === 'hash'"
  :class="className || 'card-illustration'"
  viewBox="0 0 240 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Hash Identification"
>
  <!-- Chip pins -->
  <path d="M33 34h12M33 46h12M33 58h12M33 70h12M33 82h12" stroke="var(--text-faint)" stroke-width="2.5" stroke-linecap="round" />
  <path d="M130 34h12M130 46h12M130 58h12M130 70h12M130 82h12" stroke="var(--text-faint)" stroke-width="2.5" stroke-linecap="round" />

  <!-- Main Chip body -->
  <rect x="45" y="20" width="85" height="76" rx="8" fill="#1e293b" stroke="var(--border-strong)" stroke-width="2" />
  
  <!-- Chip center circuit symbol -->
  <rect x="61" y="38" width="53" height="40" rx="4" fill="#0f172a" stroke="var(--accent)" stroke-width="1.8" />
  <text x="87" y="63" fill="var(--accent)" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">
    SHA1
  </text>

  <!-- Binary datastream / hash lines on right -->
  <rect x="148" y="32" width="70" height="8" rx="4" fill="var(--accent)" opacity="0.85" />
  <rect x="148" y="48" width="52" height="7" rx="3.5" fill="var(--text-dim)" opacity="0.6" />
  <rect x="148" y="62" width="62" height="7" rx="3.5" fill="var(--text-dim)" opacity="0.6" />
  <rect x="148" y="76" width="40" height="7" rx="3.5" fill="var(--text-dim)" opacity="0.4" />

  <!-- Verification checkmark badge -->
  <circle cx="205" cy="80" r="18" fill="var(--ok)" stroke="var(--surface)" stroke-width="3" />
  <path d="M196 80l6 6 12-12" stroke="var(--ok-on)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
</svg>
<svg :elseif="kind === 'grouping'"
  :class="className || 'card-illustration'"
  viewBox="0 0 240 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="ROM Grouping"
>
  <!-- Main Parent Game Card -->
  <rect x="18" y="20" width="85" height="76" rx="8" fill="var(--surface)" stroke="var(--accent)" stroke-width="2.2" />
  <!-- Game title placeholder lines -->
  <rect x="28" y="32" width="65" height="8" rx="4" fill="var(--text)" />
  <rect x="28" y="46" width="45" height="6" rx="3" fill="var(--text-dim)" />
  
  <!-- Grouping tag pill inside parent -->
  <rect x="28" y="64" width="52" height="18" rx="9" fill="var(--accent-soft)" />
  <text x="54" y="76" fill="var(--accent-ink)" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">
    GAME
  </text>

  <!-- Connecting tree curves -->
  <path d="M103 58 C 128 58, 125 28, 146 28" stroke="var(--accent)" stroke-width="2.2" fill="none" stroke-dasharray="4 4" />
  <path d="M103 58 L 146 58" stroke="var(--accent)" stroke-width="2.2" fill="none" />
  <path d="M103 58 C 128 58, 125 88, 146 88" stroke="var(--accent)" stroke-width="2.2" fill="none" stroke-dasharray="4 4" />

  <!-- Variant Pills (EU, US, JP) -->
  <!-- EU Variant -->
  <g transform="translate(146, 16)">
    <rect x="0" y="0" width="76" height="24" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.5" />
    <rect x="8" y="5" width="24" height="14" rx="7" fill="#3b82f6" />
    <text x="20" y="15" fill="#ffffff" font-family="sans-serif" font-size="8.5" font-weight="bold" text-anchor="middle">EU</text>
    <rect x="38" y="10" width="28" height="4" rx="2" fill="var(--text-dim)" />
  </g>

  <!-- US Variant -->
  <g transform="translate(146, 46)">
    <rect x="0" y="0" width="76" height="24" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.5" />
    <rect x="8" y="5" width="24" height="14" rx="7" fill="#ef4444" />
    <text x="20" y="15" fill="#ffffff" font-family="sans-serif" font-size="8.5" font-weight="bold" text-anchor="middle">US</text>
    <rect x="38" y="10" width="28" height="4" rx="2" fill="var(--text-dim)" />
  </g>

  <!-- JP Variant -->
  <g transform="translate(146, 76)">
    <rect x="0" y="0" width="76" height="24" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.5" />
    <rect x="8" y="5" width="24" height="14" rx="7" fill="#10b981" />
    <text x="20" y="15" fill="#ffffff" font-family="sans-serif" font-size="8.5" font-weight="bold" text-anchor="middle">JP</text>
    <rect x="38" y="10" width="28" height="4" rx="2" fill="var(--text-dim)" />
  </g>
</svg>
<svg :elseif="kind === 'covers'"
  :class="className || 'card-illustration'"
  viewBox="0 0 240 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Cover Art"
>
  <!-- Secondary background cover (stacked behind) -->
  <g transform="translate(45, 20) rotate(-10)">
    <rect x="0" y="0" width="58" height="82" rx="5" fill="#334155" stroke="var(--border-strong)" stroke-width="1.8" />
    <path d="M0 35 L58 20 L58 82 L0 82 Z" fill="#475569" opacity="0.4" />
  </g>

  <!-- Main Front Cover Card -->
  <g transform="translate(86, 12)">
    <rect x="0" y="0" width="68" height="94" rx="6" fill="#1e293b" stroke="var(--accent)" stroke-width="2.4" />
    <!-- Cover Art Artwork Header -->
    <path d="M0 5 C0 2.2 2.2 0 5 0 L63 0 C65.8 0 68 2.2 68 5 L68 56 L0 56 Z" fill="url(#cover-art-grad-large)" />

    <defs>
      <linearGradient id="cover-art-grad-large" x1="0" y1="0" x2="68" y2="56" gradientUnits="userSpaceOnUse">
        <stop stop-color="#6366f1" />
        <stop offset="1" stop-color="#ec4899" />
      </linearGradient>
    </defs>

    <!-- Sun & mountains graphic inside cover art -->
    <circle cx="50" cy="20" r="7" fill="#fbbf24" opacity="0.9" />
    <path d="M8 52 L24 28 L38 42 L52 30 L68 52 Z" fill="#0f172a" opacity="0.65" />

    <!-- Cover Title Box -->
    <rect x="8" y="64" width="52" height="7" rx="3.5" fill="#ffffff" opacity="0.9" />
    <rect x="8" y="77" width="32" height="5" rx="2.5" fill="var(--text-dim)" opacity="0.6" />

    <!-- Region badge overlay on cover -->
    <rect x="44" y="75" width="18" height="11" rx="3" fill="var(--accent)" />
    <text x="53" y="83.5" fill="var(--accent-on)" font-family="sans-serif" font-size="7" font-weight="bold" text-anchor="middle">
      EU
    </text>
  </g>

  <!-- Libretro thumbnail sync badge -->
  <g transform="translate(170, 34)">
    <circle cx="22" cy="22" r="22" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="2" />
    <!-- Photo Image Icon -->
    <rect x="10" y="12" width="24" height="19" rx="3" stroke="var(--accent)" stroke-width="2" fill="none" />
    <circle cx="16" cy="18" r="2" fill="var(--accent)" />
    <path d="M10 27 L17 20 L22 25 L27 21 L34 27" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>
<svg :elseif="kind === 'consolidate'"
  :class="className || 'card-illustration'"
  viewBox="0 0 240 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Canonical Organization"
>
  <!-- Raw files stack (left side) -->
  <g transform="translate(16, 20)">
    <rect x="0" y="0" width="64" height="18" rx="4" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.2" />
    <text x="7" y="12" fill="var(--text-faint)" font-family="monospace" font-size="7.5">game_v1.zip</text>

    <rect x="0" y="26" width="64" height="18" rx="4" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.2" />
    <text x="7" y="38" fill="var(--text-faint)" font-family="monospace" font-size="7.5">game_us.bin</text>

    <rect x="0" y="52" width="64" height="18" rx="4" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.2" />
    <text x="7" y="64" fill="var(--text-faint)" font-family="monospace" font-size="7.5">game_jp.rom</text>
  </g>

  <!-- Organization Arrow in Center -->
  <g transform="translate(92, 42)">
    <circle cx="16" cy="12" r="18" fill="var(--accent-soft)" />
    <path d="M7 12 H25 M20 7 L25 12 L20 17" stroke="var(--accent-ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Clean Organized Folder (right side) -->
  <g transform="translate(144, 15)">
    <!-- Main Folder tab -->
    <path d="M0 5 C0 2.2 2.2 0 5 0 L26 0 C28.5 0 30.5 1.5 31.8 3.5 L35 8 L63 8 C65.8 8 68 10.2 68 13 L68 75 C68 77.8 65.8 80 63 80 L5 80 C2.2 80 0 77.8 0 75 Z" fill="#fbbf24" opacity="0.9" />

    <!-- Organized items inside folder -->
    <rect x="8" y="18" width="52" height="14" rx="3" fill="var(--surface)" />
    <rect x="14" y="23" width="30" height="4" rx="2" fill="var(--text)" />
    <rect x="48" y="22" width="9" height="6" rx="2.5" fill="#3b82f6" />

    <rect x="8" y="37" width="52" height="14" rx="3" fill="var(--surface)" />
    <rect x="14" y="42" width="30" height="4" rx="2" fill="var(--text)" />
    <rect x="48" y="41" width="9" height="6" rx="2.5" fill="#ef4444" />

    <rect x="8" y="56" width="52" height="14" rx="3" fill="var(--surface)" />
    <rect x="14" y="61" width="30" height="4" rx="2" fill="var(--text)" />
    <rect x="48" y="60" width="9" height="6" rx="2.5" fill="#10b981" />
  </g>
</svg>
`,cn={},dn="components/WelcomeIllustration.html";let Re;Re=new m(ln,{modules:cn,filename:dn});const mn=Re,U={NES:{id:"NES",name:"NES / Famicom",fullName:"Nintendo Entertainment System",manufacturer:"Nintendo",releaseYear:1983,media:"cartridge",description:"The 8-bit third-generation home console that revitalized the video game industry with legendary titles like Super Mario Bros., The Legend of Zelda, and Metroid.",commonExtensions:["nes","fds","unf","unif"],accentColor:"#e60012"},SNES:{id:"SNES",name:"Super Nintendo",fullName:"Super Nintendo Entertainment System",manufacturer:"Nintendo",releaseYear:1990,media:"cartridge",description:"Nintendo’s iconic 16-bit console celebrated for Mode 7 graphics, custom sound chips, and classic franchises like Super Mario World, Chrono Trigger, and Super Metroid.",commonExtensions:["sfc","smc","fig","swc"],accentColor:"#8b5cf6"},GAMEBOY:{id:"GAMEBOY",name:"Game Boy",fullName:"Nintendo Game Boy",manufacturer:"Nintendo",releaseYear:1989,media:"cartridge",description:"The groundbreaking monochrome handheld system that dominated portable gaming with exceptional battery life and games like Tetris and Pokémon Red/Blue.",commonExtensions:["gb"],accentColor:"#8bac0f"},GBC:{id:"GBC",name:"Game Boy Color",fullName:"Nintendo Game Boy Color",manufacturer:"Nintendo",releaseYear:1998,media:"cartridge",description:"The color evolution of the Game Boy featuring a color LCD screen, backwards compatibility, and titles like Pokémon Gold/Silver and Legend of Zelda: Oracle of Ages.",commonExtensions:["gbc"],accentColor:"#9333ea"},GBA:{id:"GBA",name:"Game Boy Advance",fullName:"Nintendo Game Boy Advance",manufacturer:"Nintendo",releaseYear:2001,media:"cartridge",description:"A powerful 32-bit handheld console delivering 2D arcade-quality graphics, home to games like Pokémon Ruby/Sapphire, Castlevania: Aria of Sorrow, and Golden Sun.",commonExtensions:["gba"],accentColor:"#3b82f6"},N64:{id:"N64",name:"Nintendo 64",fullName:"Nintendo 64",manufacturer:"Nintendo",releaseYear:1996,media:"cartridge",description:"Pioneered 3D gaming and analogue control with games like Super Mario 64, The Legend of Zelda: Ocarina of Time, GoldenEye 007, and Super Smash Bros.",commonExtensions:["z64","n64","v64"],accentColor:"#10b981"},PokemonMini:{id:"PokemonMini",name:"Pokémon Mini",fullName:"Nintendo Pokémon Mini",manufacturer:"Nintendo",releaseYear:2001,media:"cartridge",description:"The smallest cartridge-based handheld console ever produced by Nintendo, dedicated entirely to Pokémon themed mini-games.",commonExtensions:["min"],accentColor:"#f59e0b"},SMS:{id:"SMS",name:"Master System",fullName:"Sega Master System",manufacturer:"Sega",releaseYear:1985,media:"cartridge",description:"Sega’s 8-bit console that rivaled the NES with superior graphics hardware, popular for Alex Kidd, Phantasy Star, and Sonic the Hedgehog.",commonExtensions:["sms"],accentColor:"#0284c7"},GameGear:{id:"GameGear",name:"Game Gear",fullName:"Sega Game Gear",manufacturer:"Sega",releaseYear:1990,media:"cartridge",description:"Sega’s full-color backlit handheld console based on Master System architecture, featuring portable versions of Sonic, Shinobi, and Columns.",commonExtensions:["gg"],accentColor:"#2563eb"},MegaDrive:{id:"MegaDrive",name:"Mega Drive / Genesis",fullName:"Sega Mega Drive / Genesis",manufacturer:"Sega",releaseYear:1988,media:"cartridge",description:'Sega’s legendary 16-bit console defined by "Blast Processing", arcade ports, and classic games like Sonic the Hedgehog, Streets of Rage, and Gunstar Heroes.',commonExtensions:["md","gen","smd","bin"],accentColor:"#1e293b"},MegaCD:{id:"MegaCD",name:"Mega-CD / Sega CD",fullName:"Sega Mega-CD / Sega CD",manufacturer:"Sega",releaseYear:1991,media:"disc",description:"CD-ROM add-on for the Mega Drive introducing CD audio, full-motion video, and enhanced scaling graphics with games like Sonic CD and Snatcher.",commonExtensions:["cue","bin","iso","chd"],accentColor:"#475569"},S32X:{id:"S32X",name:"32X",fullName:"Sega 32X",manufacturer:"Sega",releaseYear:1994,media:"cartridge",description:"32-bit hardware expansion unit for the Mega Drive featuring twin RISC processors for 3D games like Virtua Fighter, Star Wars Arcade, and Knuckles’ Chaotix.",commonExtensions:["32x","bin"],accentColor:"#ef4444"},Saturn:{id:"Saturn",name:"Sega Saturn",fullName:"Sega Saturn",manufacturer:"Sega",releaseYear:1994,media:"disc",description:"Sega’s 32-bit dual-CPU console celebrated for unbeatable 2D arcade ports, innovative 3D titles, and classics like Panzer Dragoon, Nights into Dreams, and Virtua Fighter 2.",commonExtensions:["cue","bin","iso","chd"],accentColor:"#6366f1"},PSX:{id:"PSX",name:"PlayStation",fullName:"Sony PlayStation",manufacturer:"Sony",releaseYear:1994,media:"disc",description:"The landmark 32-bit console that revolutionized gaming with CD-ROM media, 3D graphics, and blockbusters like Final Fantasy VII, Metal Gear Solid, and Resident Evil.",commonExtensions:["cue","bin","iso","chd","pbp","m3u"],accentColor:"#00439c"},TGFX16:{id:"TGFX16",name:"TurboGrafx-16 / PC Engine",fullName:"NEC TurboGrafx-16 / PC Engine",manufacturer:"NEC",releaseYear:1987,media:"cartridge",description:"NEC and Hudson Soft’s sleek 16-bit graphics system using ultra-compact HuCard media, famous for shoot-’em-ups and games like Bonk’s Adventure and Splatterhouse.",commonExtensions:["pce","sgx"],accentColor:"#d97706"},"TGFX16-CD":{id:"TGFX16-CD",name:"TurboGrafx-CD / PC Engine CD",fullName:"NEC TurboGrafx-CD / PC Engine CD-ROM²",manufacturer:"NEC",releaseYear:1988,media:"disc",description:"The world’s first CD-ROM console add-on, legendary for redbook audio soundtracks, animated cutscenes, and masterpieces like Castlevania: Rondo of Blood.",commonExtensions:["cue","bin","iso","chd","toc"],accentColor:"#b45309"},NEOGEO:{id:"NEOGEO",name:"Neo Geo AES / MVS",fullName:"SNK Neo Geo Advanced Entertainment System",manufacturer:"SNK",releaseYear:1990,media:"cartridge",description:"The ultimate arcade hardware in the home, featuring massive gigabit cartridges and iconic fighting and action games like Metal Slug, King of Fighters, and Samurai Shodown.",commonExtensions:["neo","zip","7z"],accentColor:"#dc2626"},"NeoGeo-CD":{id:"NeoGeo-CD",name:"Neo Geo CD",fullName:"SNK Neo Geo CD",manufacturer:"SNK",releaseYear:1994,media:"disc",description:"CD-based home version of the Neo Geo arcade hardware offering arcade-perfect gameplay with orchestrated soundtracks.",commonExtensions:["cue","bin","iso","chd"],accentColor:"#991b1b"},Atari2600:{id:"Atari2600",name:"Atari 2600",fullName:"Atari 2600 Video Computer System",manufacturer:"Atari",releaseYear:1977,media:"cartridge",description:"The pioneer of microprocessor-based home consoles with interchangeable cartridges, home to classics like Pitfall!, Space Invaders, and Asteroids.",commonExtensions:["a26","bin"],accentColor:"#ea580c"},ATARI5200:{id:"ATARI5200",name:"Atari 5200",fullName:"Atari 5200 SuperSystem",manufacturer:"Atari",releaseYear:1982,media:"cartridge",description:"Atari’s second-generation console based on Atari 8-bit computer architecture, featuring arcade ports like Centipede, Pac-Man, and Defender.",commonExtensions:["a52","bin"],accentColor:"#c2410c"},ATARI7800:{id:"ATARI7800",name:"Atari 7800",fullName:"Atari 7800 ProSystem",manufacturer:"Atari",releaseYear:1986,media:"cartridge",description:"Designed with near-perfect arcade capability and full backwards compatibility with Atari 2600 cartridges.",commonExtensions:["a78","bin"],accentColor:"#9a3412"},AtariLynx:{id:"AtariLynx",name:"Atari Lynx",fullName:"Atari Lynx",manufacturer:"Atari",releaseYear:1989,media:"cartridge",description:"The world’s first handheld console with a color LCD screen, featuring hardware sprite scaling and ambidextrous flip control.",commonExtensions:["lnx","lyx"],accentColor:"#fb923c"},WonderSwan:{id:"WonderSwan",name:"WonderSwan",fullName:"Bandai WonderSwan",manufacturer:"Bandai",releaseYear:1999,media:"cartridge",description:"Gunpei Yokoi’s compact handheld console featuring portrait or landscape orientation, long battery life, and Japanese RPG classics.",commonExtensions:["ws"],accentColor:"#06b6d4"},WonderSwanColor:{id:"WonderSwanColor",name:"WonderSwan Color",fullName:"Bandai WonderSwan Color",manufacturer:"Bandai",releaseYear:2e3,media:"cartridge",description:"Color upgrade to the WonderSwan featuring a FSTN color screen and exclusive titles like Final Fantasy remakes and Klonoa.",commonExtensions:["wsc","ws"],accentColor:"#0891b2"}};function Ie(t){if(!t)return;const e=t.indexOf("/")===-1?t:t.split("/")[0],n=Object.keys(U).find(a=>a.toLowerCase()===e.toLowerCase());return n?U[n]:void 0}function fn(){return Object.values(U)}const K=Object.freeze(Object.defineProperty({__proto__:null,getAllSystemsInfo:fn,getSystemInfo:Ie},Symbol.toStringTag,{value:"Module"})),hn=`<!--
  The first screen, when no folder has ever been opened: what the app is, how it
  is used, the systems it knows, and the way in.

  Events: open-library, add-roms, open-folder. \`canOpenLibrary\` / \`canAddRoms\` /
  \`canOpenFolder\` say which ways in exist here (no folders on phones).
-->
<script :setup="{ canOpenLibrary = false, canAddRoms = false, canOpenFolder = false, loading = false }">const [BrandLogo, Icon, SystemLogo, WelcomeIllustration, { getAllSystemsInfo }, { t }] = await $importAll([
  "../components/BrandLogo.html",
  "../components/Icon.html",
  "../components/SystemLogo.html",
  "../components/WelcomeIllustration.html",
  "../helpers/system-info",
  "../lib/ui-state"
]);
const CAPABILITIES = ["hash", "grouping", "covers", "consolidate"];
const STEPS = ["step1", "step2", "step3"];
const TOP_ROW_IDS = ["GAMEBOY", "GBC", "GameGear", "SMS", "TGFX16", "Atari2600", "WonderSwan", "PokemonMini"];
const MIDDLE_ROW_IDS = ["NES", "SNES", "N64", "GBA", "MegaDrive", "PSX", "Saturn", "NEOGEO"];
const BOTTOM_ROW_IDS = ["MegaCD", "S32X", "TGFX16-CD", "NeoGeo-CD", "ATARI5200", "ATARI7800", "AtariLynx", "WonderSwanColor"];
const systems = getAllSystemsInfo();
const byId = new Map(systems.map((system) => [system.id, system]));
const pick = (ids) => ids.map((id) => byId.get(id)).filter(Boolean);
const assigned = /* @__PURE__ */ new Set([...TOP_ROW_IDS, ...MIDDLE_ROW_IDS, ...BOTTOM_ROW_IDS]);
const top = [...pick(TOP_ROW_IDS), ...systems.filter((system) => !assigned.has(system.id))];
const middle = pick(MIDDLE_ROW_IDS);
const bottom = pick(BOTTOM_ROW_IDS);
const rows = [
  { name: "top", track: [...top, ...top, ...top, ...top] },
  { name: "middle", track: [...middle, ...middle, ...middle, ...middle] },
  { name: "bottom", track: [...bottom, ...bottom, ...bottom, ...bottom] }
];
<\/script>

<div class="welcome">
  <section class="welcome-hero">
    <BrandLogo class-name="welcome-mark" />

    <div class="welcome-heading">
      <h2>{{ t('app.name') }}</h2>
      <p class="welcome-tagline">{{ t('welcome.tagline') }}</p>
    </div>

    <p class="welcome-pitch">{{ t('welcome.pitch') }}</p>

    <div :if="canOpenLibrary" class="welcome-actions">
      <button class="welcome-cta icon-label" @click="$emit('open-library')" :disabled="loading">
        <Icon name="library" />
        {{ t('welcome.library') }}
      </button>
      <button :if="canAddRoms" class="welcome-secondary icon-label" @click="$emit('add-roms')" :disabled="loading">
        <Icon name="upload" />
        {{ t('library.add') }}
      </button>
    </div>

    <button
      :if="canOpenFolder"
      :class="\`\${canOpenLibrary ? 'welcome-secondary' : 'welcome-cta'} icon-label\`"
      @click="$emit('open-folder')"
      :disabled="loading"
    >
      <Icon name="folder-plus" />
      {{ loading ? t('welcome.opening') : canOpenLibrary ? t('welcome.openFolder') : t('welcome.open') }}
    </button>

    <p class="welcome-hint">{{ canOpenLibrary ? t('welcome.libraryHint') : t('welcome.hint') }}</p>
  </section>

  <section class="welcome-section">
    <h3>{{ t('welcome.what.title') }}</h3>
    <ul class="welcome-cards">
      <li :each="capability in CAPABILITIES" :key="capability" class="welcome-card">
        <div class="welcome-card-illustration">
          <WelcomeIllustration :kind="capability" />
        </div>
        <h4>{{ t(\`welcome.what.\${capability}.title\`) }}</h4>
        <p>{{ t(\`welcome.what.\${capability}.body\`) }}</p>
      </li>
    </ul>
  </section>

  <section class="welcome-section">
    <h3>{{ t('welcome.how.title') }}</h3>
    <ol class="welcome-steps">
      <li :each="step, at in STEPS" :key="step" class="welcome-step">
        <span class="welcome-step-number" aria-hidden="true">{{ at + 1 }}</span>
        <div>
          <h4>{{ t(\`welcome.how.\${step}.title\`) }}</h4>
          <p>{{ t(\`welcome.how.\${step}.body\`) }}</p>
        </div>
      </li>
    </ol>
  </section>

  <section class="welcome-section welcome-systems-section">
    <h3>{{ t('welcome.systems.title') }}</h3>
    <p class="welcome-hint">{{ t('welcome.systems.hint', { count: systems.length }) }}</p>
    <div class="welcome-systems">
      <div :each="row in rows" :key="row.name" :class="\`welcome-systems-row welcome-systems-row--\${row.name}\`">
        <ul class="welcome-systems-track">
          <li :each="system, idx in row.track" :key="\`\${row.name}-\${system.id}-\${idx}\`" class="welcome-system" :title="system.fullName">
            <span class="welcome-system-logo">
              <SystemLogo :system-id="system.id" />
            </span>
            <span class="welcome-system-name">{{ system.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <section class="welcome-note">
    <h3>{{ t('welcome.privacy.title') }}</h3>
    <p>{{ t('welcome.privacy.body') }}</p>
  </section>

  <footer class="welcome-footer">
    <p class="welcome-footer-legal">{{ t('welcome.footer.legal') }}</p>
    <a class="welcome-footer-github" href="https://github.com/wasm-gaming/rom-manager" target="_blank" rel="noopener noreferrer">
      <Icon name="github" />
      <span>{{ t('welcome.footer.github') }}</span>
    </a>
  </footer>
</div>
`,pn={"../components/BrandLogo.html":ye,"../components/Icon.html":f,"../components/SystemLogo.html":N,"../components/WelcomeIllustration.html":mn,"../helpers/system-info":K,"../lib/ui-state":h},gn="views/WelcomePanel.html";let Ee;Ee=new m(hn,{modules:pn,filename:gn});const un=Ee,vn=`<!-- A folder with the console it holds as a badge: the mark of a system folder browsed as games. -->
<script :setup="{ systemId = &quot;&quot; }">const SystemLogo = await import("./SystemLogo.html");
<\/script>

<div class="system-folder-icon">
  <svg viewBox="0 0 24 24">
    <path d="M2.4 6.6a1.6 1.6 0 0 1 1.6-1.6h4.5c.44 0 .86.18 1.16.5l1.5 1.6H20a1.6 1.6 0 0 1 1.6 1.6v9.1a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z" fill="var(--icon-folder-back)" />
    <path d="M2.4 9.6h19.2v8.2a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z" fill="var(--icon-folder)" />
  </svg>
  <span class="system-folder-badge">
    <SystemLogo :system-id="systemId" />
  </span>
</div>
`,yn={"./SystemLogo.html":N},wn="components/SystemFolderIcon.html";let Ae;Ae=new m(vn,{modules:yn,filename:wn});const bn=Ae,kn=`<!-- The tree's title and its toolbar. Emits \`create-folder\`, \`add-files\` and \`delete-selected\`. -->
<script :setup="{ busy = false, hasSelection = false, title = &quot;Library&quot;, labels = {} }">const Icon = await import("./Icon.html");
<\/script>

<div class="file-tree-header">
  <h3>{{ title }}</h3>
  <div class="file-tree-actions">
    <button @click="$emit('create-folder')" :disabled="busy" :title="labels.newFolder ?? 'New folder'">
      <Icon name="folder-plus" />
    </button>
    <button @click="$emit('add-files')" :disabled="busy" :title="labels.addFiles ?? 'Add files'">
      <Icon name="plus" />
    </button>
    <button @click="$emit('delete-selected')" :disabled="busy || !hasSelection" :title="labels.delete ?? 'Delete'">
      <Icon name="trash" />
    </button>
  </div>
</div>
`,xn={"./Icon.html":f},Sn="components/FileTreeHeader.html";let Le;Le=new m(kn,{modules:xn,filename:Sn});const On=Le,_n=`<!--
  Every text comes from the parent (a component depends on helpers only); the
  defaults are English.
  A yes / no question in a modal dialog. Emits \`confirm\` and \`close\` (the dialog
  closed by any means: the ×, Cancel, Escape, a click on the backdrop).
-->
<script :setup="{ open = false, title = &quot;&quot;, message = &quot;&quot;, confirmLabel = &quot;Delete&quot;, cancelLabel = &quot;Cancel&quot;, closeLabel = &quot;Close&quot;, danger = true, busy = false }">const Icon = await import("./Icon.html");
const dialog = () => $self("dialog");
const sync = (isOpen) => {
  const element = dialog();
  if (!element) return;
  if (isOpen && !element.open) element.showModal();
  else if (!isOpen && element.open) element.close();
};
const dismiss = () => dialog()?.close();
const onBackdrop = (event) => {
  if (event.target === dialog() && !busy) dismiss();
};
$: sync(open);
await $mounted();
sync(open);
<\/script>

<dialog class="modal-dialog confirm-dialog" :aria-label="title" @close="$emit('close')" @click="onBackdrop">
  <header class="modal-header">
    <h3>{{ title }}</h3>
    <button type="button" class="modal-close" @click="dismiss" :disabled="busy" :title="closeLabel">
      <Icon name="close" />
    </button>
  </header>

  <div class="modal-content">
    <p class="modal-message">{{ message }}</p>
  </div>

  <div class="modal-actions">
    <button type="button" class="btn-cancel" @click="dismiss" :disabled="busy">
      {{ cancelLabel }}
    </button>
    <button type="button" :class="danger ? 'btn-danger' : 'btn-apply'" @click="$emit('confirm')" :disabled="busy">
      {{ confirmLabel }}
    </button>
  </div>
</dialog>
`,Mn={"./Icon.html":f},Cn="components/ConfirmModal.html";let Ne;Ne=new m(_n,{modules:Mn,filename:Cn});const P=Ne,$n=`<!--
  Every text comes from the parent (a component depends on helpers only); the
  defaults are English.
  Asks for one line of text in a modal dialog. Emits \`submit\` with the trimmed
  value, and \`close\` when the dialog closes by any means.
-->
<script :setup="{ open = false, title = &quot;&quot;, message = &quot;&quot;, defaultValue = &quot;&quot;, placeholder = &quot;&quot;, submitLabel = &quot;Confirm&quot;, cancelLabel = &quot;Cancel&quot;, closeLabel = &quot;Close&quot;, busy = false }">const Icon = await import("./Icon.html");
let value = defaultValue;
const dialog = () => $self("dialog");
const sync = (isOpen) => {
  const element = dialog();
  if (!element) return;
  if (isOpen && !element.open) {
    value = defaultValue;
    element.showModal();
    setTimeout(() => {
      const input = $self(".prompt-input");
      input?.focus();
      input?.select();
    }, 50);
  } else if (!isOpen && element.open) {
    element.close();
  }
};
const dismiss = () => dialog()?.close();
const onBackdrop = (event) => {
  if (event.target === dialog() && !busy) dismiss();
};
const submit = () => {
  if (!value.trim() || busy) return;
  $emit("submit", value.trim());
};
$: if (open) value = defaultValue;
$: sync(open);
await $mounted();
sync(open);
<\/script>

<dialog class="modal-dialog prompt-dialog" :aria-label="title" @close="$emit('close')" @click="onBackdrop">
  <header class="modal-header">
    <h3>{{ title }}</h3>
    <button type="button" class="modal-close" @click="dismiss" :disabled="busy" :title="closeLabel">
      <Icon name="close" />
    </button>
  </header>

  <form class="modal-form" @submit.prevent="submit">
    <div class="modal-content">
      <p :if="message" class="modal-message">{{ message }}</p>
      <input
        type="text"
        class="prompt-input"
        :value="value"
        :placeholder="placeholder"
        @input="value = $event.target.value"
        :disabled="busy"
      />
    </div>

    <div class="modal-actions">
      <button type="button" class="btn-cancel" @click="dismiss" :disabled="busy">
        {{ cancelLabel }}
      </button>
      <button type="submit" class="btn-apply" :disabled="!value.trim() || busy">
        {{ submitLabel }}
      </button>
    </div>
  </form>
</dialog>
`,Rn={"./Icon.html":f},In="components/PromptModal.html";let Pe;Pe=new m($n,{modules:Rn,filename:In});const ze=Pe,De="",En="application/x-rom-manager-paths";function An(t){const e=t.lastIndexOf("/");return e===-1?De:t.slice(0,e)}function Ln(t){return t.slice(t.lastIndexOf("/")+1)}function Nn(t,e){return t?`${t}/${e}`:e}function Pn(t,e){return e===t||e.startsWith(`${t}/`)}function zn(t){const e=JSON.parse(t);if(!Array.isArray(e)||e.some(n=>typeof n!="string"))throw new Error("Invalid drag payload");return e}function Dn(t){return t.startsWith(".")}function Bn(t){const e=t.indexOf("/");return e===-1?t||void 0:t.slice(0,e)}const Be=Object.freeze(Object.defineProperty({__proto__:null,DRAG_MIME:En,ROOT:De,contains:Pn,isHiddenName:Dn,join:Nn,nameOf:Ln,parentOf:An,parseDraggedPaths:zn,systemOfPath:Bn},Symbol.toStringTag,{value:"Module"})),Tn=new Set(["iso","cue","chd","gdi","nrg","mdf","ccd","pbp"]),Fn=new Set(["sav","srm","state","st0","st1","st2","st3","st4","st5","mcr","mc"]),Gn=new Set(["zip","7z","rar","gz","tar"]),jn=new Set(["png","jpg","jpeg","gif","webp","bmp","svg"]),Un=new Set(["txt","json","xml","md","nfo","pdf","doc","dat"]);function qn(t){const e=t.split(".").pop()?.toLowerCase()||"";return Tn.has(e)?"disc":Fn.has(e)?"memory-card":Gn.has(e)?"archive":jn.has(e)?"image":Un.has(e)?"document":"file"}const Vn=Object.freeze(Object.defineProperty({__proto__:null,iconNameOf:qn},Symbol.toStringTag,{value:"Module"})),Hn=`<!--
  The tree of an origin: folders and files, or — in a folder browsed grouped —
  one row per game, its files folded into it. Selection (click, shift, ctrl/cmd,
  the arrow keys), new folders, adding files, deleting, and moving by drag.

  Events:
    selection-change (paths)   game-change (game | undefined)
    folder-change (path | undefined)   visible-change (paths)
    removed (paths)   changed (paths written or moved, both ends)
    grouping-needed (path)   toggle-grouping (path)   organize (path)

  \`isInitialized\`, \`canGroup\` and \`isGrouped\` are questions the parent answers;
  \`groupedRows\` (a Map, folder → rows) is what grouping has produced so far.

  Thousands of rows: each row's marks (\`selected\`, \`active\`, \`drop\`) are in
  \`rowMarks\`, by the row's position, beside \`rows\` rather than in it — so a
  change of selection flips only the rows it changes, and what reads the list as
  a whole (the loop, \`visible-change\`) is not woken by it. What is marked lives
  in \`marks\` (a class instance: the store leaves it alone).
-->
<script
  :setup="{ node, selectedFiles = [], isInitialized = void 0, canGroup = void 0, isGrouped = void 0, groupedRows = void 0, canOrganize = false, notice = void 0, refreshToken = 0, labels = {} }">const [
  Icon,
  SystemFolderIcon,
  FileTreeHeader,
  ConfirmModal,
  PromptModal,
  { contains, DRAG_MIME, isHiddenName, join, nameOf, parentOf, parseDraggedPaths, ROOT, systemOfPath },
  { iconNameOf },
  { t }
] = await $importAll([
  "../components/Icon.html",
  "../components/SystemFolderIcon.html",
  "../components/FileTreeHeader.html",
  "../components/ConfirmModal.html",
  "../components/PromptModal.html",
  "../helpers/tree",
  "../helpers/file-icons",
  "../lib/ui-state"
]);
class Marks {
  selection = /* @__PURE__ */ new Set();
  game = void 0;
  active = /* @__PURE__ */ new Set();
  drop = void 0;
  anchor = void 0;
  /** The last game reported to the parent, so it hears each change once. */
  reported = void 0;
}
const marks = new Marks();
let children = /* @__PURE__ */ new Map();
let expanded = /* @__PURE__ */ new Set();
let rowMarks = [];
let selectionCount = 0;
let rootDrop = false;
let error = void 0;
let busy = false;
let createFolder = null;
let deleteConfirm = null;
const flagsOf = (row) => ({
  selected: row.path ? marks.selection.has(row.path) : marks.game === row.key,
  active: Boolean(row.path && marks.active.has(row.path)),
  drop: row.path !== void 0 && marks.drop === row.path
});
const rawRows = () => $toRaw(rows);
const remark = () => $batch(() => {
  const list = rawRows();
  const current = $toRaw(rowMarks);
  if (current.length !== list.length) {
    rowMarks = list.map(flagsOf);
  } else {
    list.forEach((row, index) => {
      const flags = flagsOf(row);
      const mark = current[index];
      if (mark.selected !== flags.selected) rowMarks[index].selected = flags.selected;
      if (mark.active !== flags.active) rowMarks[index].active = flags.active;
      if (mark.drop !== flags.drop) rowMarks[index].drop = flags.drop;
    });
  }
  selectionCount = marks.selection.size;
  rootDrop = marks.drop === ROOT;
});
const loadDirectory = async (path) => {
  const entries = await node.list(path);
  children = new Map(children).set(path, entries);
};
const refresh = async () => {
  const paths = Array.from(children.keys());
  const listings = await Promise.all(paths.map(async (path) => [path, await node.list(path)]));
  children = new Map(listings);
};
const run = async (operation) => {
  try {
    busy = true;
    error = void 0;
    await operation();
  } catch (err) {
    error = err instanceof Error ? err.message : "Operation failed";
  } finally {
    busy = false;
  }
};
$: entriesByPath = (() => {
  const map = /* @__PURE__ */ new Map();
  for (const entries of children.values()) for (const entry of entries) map.set(entry.path, entry);
  return map;
})();
$: rows = (() => {
  const result = [];
  const reading = labels.reading ?? "Reading games\\u2026";
  const push = (row) => result.push({ ...row, open: expanded.has(row.key) });
  const pushEntry = (entry, depth) => {
    push({
      key: entry.path,
      depth,
      label: entry.name,
      kind: entry.kind,
      path: entry.path,
      paths: [entry.path],
      entry,
      expandable: entry.kind === "directory"
    });
    if (entry.kind === "directory" && expanded.has(entry.path)) walk(entry.path, depth + 1);
  };
  const walk = (path, depth) => {
    const grouped = groupedRows?.get(path);
    if (!grouped) {
      if (isGrouped?.(path)) {
        push({ key: \`\${path}/\\u2026\`, depth, label: reading, kind: "pending", paths: [], expandable: false });
        return;
      }
      for (const entry of children.get(path) || []) pushEntry(entry, depth);
      return;
    }
    for (const wizard of grouped) {
      if (wizard.kind === "entry") {
        pushEntry(wizard.entry, depth);
      } else {
        const game = wizard.kind === "game" ? wizard.game : wizard;
        if (game) {
          push({
            key: \`\${path}:\${game.id || game.key}\`,
            depth,
            label: game.title,
            kind: "group",
            paths: game.paths,
            status: game.status,
            game,
            expandable: false
          });
        }
      }
    }
  };
  walk(ROOT, 0);
  return result;
})();
$: if (groupedRows) {
  for (const row of rows) {
    if (row.kind === "pending" && row.key.endsWith("/\\u2026")) $emit("grouping-needed", row.key.slice(0, -2));
  }
}
$: $emit("visible-change", rows.flatMap((row) => row.paths));
const markGameOfSelection = () => {
  if (marks.selection.size === 0) return;
  const row = rawRows().find((candidate) => candidate.kind === "group" && candidate.paths.some((p) => marks.selection.has(p)));
  if (row && row.game) {
    marks.game = row.key;
    if (row.game !== marks.reported) {
      marks.reported = row.game;
      $emit("game-change", row.game);
    }
  }
};
$: {
  void rows;
  queueMicrotask(() => {
    markGameOfSelection();
    rowMarks = rawRows().map(flagsOf);
    selectionCount = marks.selection.size;
  });
}
const selectPaths = (paths, game) => $batch(() => {
  marks.selection = paths;
  $emit("selection-change", Array.from(paths));
  if (game !== marks.reported) {
    marks.reported = game;
    $emit("game-change", game);
  }
  const folder = paths.size === 1 ? Array.from(paths)[0] : void 0;
  const directory = folder && entriesByPath.get(folder)?.kind === "directory" ? folder : void 0;
  $emit("folder-change", directory);
  markGameOfSelection();
  remark();
});
const revealDirectory = async (path) => {
  const parts = path.split("/");
  let current = "";
  for (const part of parts) {
    current = current ? \`\${current}/\${part}\` : part;
    if (!children.has(current)) await loadDirectory(current);
    if (!expanded.has(current)) expanded = new Set(expanded).add(current);
  }
};
const followSelectedFiles = (files) => {
  marks.active = new Set(files);
  const current = Array.from(marks.selection);
  const same = current.length === files.length && current.every((path, i) => path === files[i]);
  if (files.length > 0 && !same) {
    marks.selection = new Set(files);
    markGameOfSelection();
    for (const path of files) {
      const parent = parentOf(path);
      if (parent && parent !== ROOT) void revealDirectory(parent);
    }
  }
  remark();
};
$: {
  const files = selectedFiles ? Array.from(selectedFiles) : [];
  queueMicrotask(() => followSelectedFiles(files));
}
const toggleDirectory = async (path) => {
  if (expanded.has(path)) {
    const next = new Set(expanded);
    next.delete(path);
    expanded = next;
    return;
  }
  if (!children.has(path)) await loadDirectory(path);
  expanded = new Set(expanded).add(path);
};
const isSelected = (row) => row.path ? marks.selection.has(row.path) : marks.game === row.key;
const selectRow = (row) => {
  $batch(() => {
    marks.game = row.kind === "group" ? row.key : void 0;
    if (row.kind === "group") {
      marks.anchor = row.paths[0];
      selectPaths(new Set(row.paths), row.game);
    } else if (row.path) {
      marks.anchor = row.path;
      selectPaths(/* @__PURE__ */ new Set([row.path]));
    }
  });
  requestAnimationFrame(() => $self(".tree-item.selected")?.scrollIntoView({ block: "nearest" }));
};
const onKeyDown = (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const active = document.activeElement;
  if (active) {
    const tag = active.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || active.isContentEditable) return;
  }
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const list = rawRows();
  if (list.length === 0) return;
  const index = list.findIndex(isSelected);
  event.preventDefault();
  if (index === -1) {
    selectRow(list[0]);
    return;
  }
  const row = list[index];
  if (event.key === "ArrowUp") {
    if (index > 0) selectRow(list[index - 1]);
  } else if (event.key === "ArrowDown") {
    if (index < list.length - 1) selectRow(list[index + 1]);
  } else if (event.key === "ArrowLeft") {
    if (row.kind === "directory" && row.path) {
      if (expanded.has(row.path)) void toggleDirectory(row.path);
    } else {
      for (let i = index - 1; i >= 0; i--) {
        if (list[i].kind === "directory" && list[i].depth < row.depth) {
          selectRow(list[i]);
          break;
        }
      }
    }
  } else if (event.key === "ArrowRight") {
    if (row.kind === "directory" && row.path && !expanded.has(row.path)) void revealDirectory(row.path);
  }
};
window.addEventListener("keydown", onKeyDown);
$destroyed(() => window.removeEventListener("keydown", onKeyDown));
const targetDirectory = () => {
  const [path] = Array.from(marks.selection);
  if (!path) return ROOT;
  return entriesByPath.get(path)?.kind === "directory" ? path : parentOf(path);
};
const onRowClick = (event, row) => $batch(() => {
  marks.game = row.kind === "group" ? row.key : void 0;
  if (row.kind === "group") {
    marks.anchor = row.paths[0];
    selectPaths(new Set(row.paths), row.game);
    return;
  }
  if (!row.path) return;
  const paths = rawRows().flatMap((candidate) => candidate.path ? [candidate.path] : []);
  const anchor = marks.anchor;
  if (event.shiftKey && anchor && paths.includes(anchor) && paths.includes(row.path)) {
    const from = paths.indexOf(anchor);
    const to = paths.indexOf(row.path);
    selectPaths(new Set(paths.slice(Math.min(from, to), Math.max(from, to) + 1)));
    return;
  }
  if (event.metaKey || event.ctrlKey) {
    const next = new Set(marks.selection);
    if (next.has(row.path)) next.delete(row.path);
    else next.add(row.path);
    marks.anchor = row.path;
    selectPaths(next);
    return;
  }
  marks.anchor = row.path;
  selectPaths(/* @__PURE__ */ new Set([row.path]));
});
const onCaretClick = (row) => {
  if (row.expandable && row.path) void toggleDirectory(row.path);
};
const onCreateFolder = () => {
  if (!node.createDirectory) return;
  createFolder = { suggested: join(targetDirectory(), "new-folder") };
};
const confirmCreateFolder = (name) => {
  createFolder = null;
  void run(async () => {
    await node.createDirectory?.(name);
    await revealDirectory(name);
    await refresh();
    selectPaths(/* @__PURE__ */ new Set([name]));
  });
};
const addFiles = async (files, destination) => {
  if (!node.writeFile && !node.write) return;
  await run(async () => {
    const written = [];
    for (const file of Array.from(files)) {
      const path = join(destination, file.name);
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (node.writeFile) await node.writeFile(path, bytes);
      else if (node.write) await node.write(path, bytes.buffer);
      written.push(path);
    }
    await revealDirectory(destination);
    await refresh();
    if (written.length > 0) selectPaths(new Set(written));
    $emit("changed", written);
  });
};
const onFilesPicked = (event) => {
  const input = event.currentTarget;
  if (input.files && input.files.length > 0) void addFiles(input.files, targetDirectory());
  input.value = "";
};
const onDeleteSelected = () => {
  if (marks.selection.size === 0 || !node.remove && !node.delete) return;
  deleteConfirm = { paths: Array.from(marks.selection) };
};
const confirmDelete = () => {
  if (!deleteConfirm) return;
  const paths = deleteConfirm.paths;
  deleteConfirm = null;
  void run(async () => {
    for (const path of paths) {
      if (node.remove) await node.remove(path);
      else if (node.delete) await node.delete(path);
    }
    $emit("removed", paths);
    selectPaths(/* @__PURE__ */ new Set());
    await refresh();
  });
};
const moveInto = async (directory, paths) => {
  if (!node.move) return;
  const valid = paths.filter((path) => !contains(path, directory));
  if (valid.length === 0) return;
  await run(async () => {
    const moved = [];
    for (const path of valid) {
      const destination = join(directory, nameOf(path));
      await node.move?.(path, destination);
      moved.push(destination);
    }
    $emit("changed", [...valid, ...moved]);
    await revealDirectory(directory);
    await refresh();
    selectPaths(new Set(moved));
  });
};
const onDragStart = (event, row) => {
  if (!event.dataTransfer) return;
  const held = row.paths.every((path) => marks.selection.has(path));
  const dragged = held ? Array.from(marks.selection) : row.paths;
  if (!held) selectPaths(new Set(row.paths), row.game);
  event.dataTransfer.setData(DRAG_MIME, JSON.stringify(dragged));
  event.dataTransfer.effectAllowed = "move";
};
const setDropTarget = (directory) => {
  if (marks.drop === directory) return;
  marks.drop = directory;
  remark();
};
const onDragOver = (event, directory) => {
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  setDropTarget(directory);
};
const onDrop = (event, directory) => {
  event.preventDefault();
  event.stopPropagation();
  setDropTarget(void 0);
  const dropped = event.dataTransfer?.files;
  if (dropped && dropped.length > 0) {
    void addFiles(dropped, directory);
    return;
  }
  const payload = event.dataTransfer?.getData(DRAG_MIME);
  if (!payload) return;
  try {
    void moveInto(directory, parseDraggedPaths(payload));
  } catch {
    error = "Invalid drag operation";
  }
};
$: statusLabels = {
  complete: labels.statusComplete ?? "Complete",
  partial: labels.statusPartial ?? "Partial",
  missing: labels.statusMissing ?? "Missing"
};
const rowIcon = (row) => {
  if (row.kind === "directory") {
    const systemId2 = row.path && isGrouped?.(row.path) ? systemOfPath(row.path || row.label) : void 0;
    return systemId2 ? { name: "system-folder", systemId: systemId2 } : { name: "folder", systemId: "" };
  }
  const systemId = row.paths[0] ? systemOfPath(row.paths[0]) : row.path ? systemOfPath(row.path) : void 0;
  if (row.kind === "group") return { name: "bundle", systemId };
  return { name: iconNameOf(row.label), systemId };
};
const rowClass = (row, index) => [
  "tree-item",
  row.kind,
  isHiddenName(row.label) ? "hidden-file" : "",
  row.status ? \`status-\${row.status}\` : "",
  rowMarks[index]?.selected ? "selected" : "",
  rowMarks[index]?.active ? "active" : "",
  rowMarks[index]?.drop ? "drop-target" : ""
].filter(Boolean).join(" ");
await $mounted();
loadDirectory(ROOT).catch((err) => {
  error = err instanceof Error ? err.message : "Failed to read directory";
});
$: if (refreshToken) queueMicrotask(() => refresh().catch(() => void 0));
<\/script>

<div class="file-tree">
  <FileTreeHeader
    :busy="busy"
    :has-selection="selectionCount > 0"
    :labels="{ newFolder: labels.collapseAll, addFiles: labels.expandAll, delete: labels.delete }"
    @create-folder="onCreateFolder()"
    @add-files="$self('.file-tree-input')?.click()"
    @delete-selected="onDeleteSelected()"
  />

  <input type="file" multiple class="file-tree-input" @change="onFilesPicked" />

  <div :if="error" class="file-tree-error">{{ error }}</div>
  <div :if="notice" class="file-tree-notice">{{ notice }}</div>

  <ul
    :class="\`file-tree-body \${rootDrop ? 'drop-target' : ''}\`"
    @dragover="onDragOver($event, ROOT)"
    @dragleave="setDropTarget(undefined)"
    @drop="onDrop($event, ROOT)"
  >
    <li
      :each="row in rows"
      :key="row.key"
      :class="rowClass(row, $index)"
      :style="\`padding-left: \${0.5 + row.depth * 0.6}rem\`"
      :draggable="row.paths.length > 0 ? 'true' : 'false'"
      @click="onRowClick($event, row)"
      @dragstart="onDragStart($event, row)"
      @dragover="row.kind === 'directory' ? onDragOver($event, row.path) : undefined"
      @drop="row.kind === 'directory' ? onDrop($event, row.path) : undefined"
    >
      <div class="tree-item-left" @click="onCaretClick(row)">
        <span :if="row.expandable" class="tree-caret" :title="row.open ? 'Collapse' : 'Expand'">
          <Icon name="chevron" :open="row.open" />
        </span>
        <span :else class="tree-caret"></span>

        <span class="tree-icon">
          <span :if="row.kind === 'pending'" class="tree-spinner"></span>
          <SystemFolderIcon :elseif="rowIcon(row).name === 'system-folder'" :system-id="rowIcon(row).systemId" />
          <Icon :else :name="rowIcon(row).name" :system-id="rowIcon(row).systemId" />
        </span>
        <span class="tree-name">{{ row.label }}</span>
      </div>

      <div class="tree-item-actions">
        <span :if="row.status && row.status !== 'complete'" class="tree-status" :title="statusLabels[row.status] ?? row.status">
          <Icon name="status" :status="row.status" />
        </span>

        <span :if="row.kind !== 'directory' && row.paths.some((path) => isInitialized?.(path))" class="tree-badge" title="Has library record">
          <Icon name="dot" />
        </span>

        <button
          :if="row.kind === 'directory' && canGroup?.(row.path)"
          :class="\`tree-group-toggle \${isGrouped?.(row.path) ? 'on' : ''}\`"
          @click.stop="$emit('toggle-grouping', row.path)"
          :title="isGrouped?.(row.path) ? 'Browsing grouped by game' : 'Browse grouped by game'"
        >
          <Icon name="group" />
        </button>

        <button
          :if="row.kind === 'directory' && canOrganize && canGroup?.(row.path)"
          class="tree-organize"
          @click.stop="$emit('organize', row.path)"
          title="Consolidate folder"
        >
          <Icon name="organize" />
        </button>
      </div>
    </li>

    <li :if="rows.length === 0 && children.has(ROOT)" class="tree-empty">Empty directory</li>
  </ul>

  <PromptModal
    :close-label="t('prefs.close')"
    :cancel-label="t('drop.cancel')"
    :submit-label="t('modal.confirm')"
    :if="createFolder"
    :open="true"
    :title="t('modal.createFolderTitle')"
    :message="t('tree.prompt.folderName')"
    :default-value="createFolder.suggested"
    @submit="confirmCreateFolder($event.detail)"
    @close="createFolder = null"
  />

  <ConfirmModal
    :close-label="t('prefs.close')"
    :cancel-label="t('drop.cancel')"
    :confirm-label="t('modal.delete')"
    :if="deleteConfirm"
    :open="true"
    :title="t('modal.deleteTitle')"
    :message="t('tree.confirm.delete', { count: deleteConfirm.paths.length })"
    :danger="true"
    @confirm="confirmDelete()"
    @close="deleteConfirm = null"
  />
</div>
`,Wn={"../components/Icon.html":f,"../components/SystemFolderIcon.html":bn,"../components/FileTreeHeader.html":On,"../components/ConfirmModal.html":P,"../components/PromptModal.html":ze,"../helpers/tree":Be,"../helpers/file-icons":Vn,"../lib/ui-state":h},Kn="views/FileTree.html";let Te;Te=new m(Hn,{modules:Wn,filename:Kn});const Yn=Te,Xn=`<!-- A folder picked in the tree: its system (when the folder is one), or a plain collection. -->
<script :setup="{ folder = &quot;&quot;, wizard = false }">const [SystemLogo, { getSystemInfo }, { t }] = await $importAll([
  "../components/SystemLogo.html",
  "../helpers/system-info",
  "../lib/ui-state"
]);
$: info = wizard ? getSystemInfo(folder) : void 0;
<\/script>

<div :if="!info" class="system-details generic">
  <div class="system-hero centered">
    <div class="system-logo-wrapper large">
      <SystemLogo system-id="generic" />
    </div>
    <div class="system-heading centered">
      <h2>{{ folder.slice(folder.lastIndexOf('/') + 1) || t('system.folder') }}</h2>
      <p class="metadata-subtitle">{{ t('system.collection') }}</p>
    </div>
  </div>
  <div class="facts">
    <div class="fact">
      <span class="fact-label">{{ t('system.path') }}</span>
      <span class="fact-value"><code>{{ folder }}</code></span>
    </div>
  </div>
</div>
<div :else class="system-details">
  <div class="system-hero centered">
    <div class="system-logo-wrapper large" :style="\`border-color: \${info.accentColor}\`">
      <SystemLogo :system-id="info.id" />
    </div>

    <div class="system-heading centered">
      <h2>{{ info.name }}</h2>
      <p class="system-fullname">{{ info.fullName }}</p>

      <div class="system-meta-tags centered">
        <span
          class="tag manufacturer"
          :style="\`background-color: \${info.accentColor}22; color: \${info.accentColor}; border-color: \${info.accentColor}55\`"
        >{{ info.manufacturer }}</span>
        <span class="tag year">{{ info.releaseYear }}</span>
        <span class="tag media">{{ info.media === 'disc' ? t('system.medium.disc') : t('system.medium.cartridge') }}</span>
      </div>
    </div>
  </div>

  <div class="system-description-box">
    <h4>{{ t('system.about') }}</h4>
    <p class="system-description">{{ info.description }}</p>
  </div>

  <div class="system-extensions-box">
    <h4>{{ t('system.extensions') }}</h4>
    <div class="system-extensions-list">
      <span :each="ext in info.commonExtensions" :key="ext" class="extension-pill"><code>.{{ ext }}</code></span>
    </div>
  </div>

  <div class="facts">
    <div class="fact">
      <span class="fact-label">{{ t('system.key') }}</span>
      <span class="fact-value"><code>{{ info.id }}</code></span>
    </div>
    <div class="fact">
      <span class="fact-label">{{ t('system.structure.label') }}</span>
      <span class="fact-value">{{ info.media === 'disc' ? t('system.structure.disc') : t('system.structure.cartridge') }}</span>
    </div>
    <div class="fact">
      <span class="fact-label">{{ t('system.folder') }}</span>
      <span class="fact-value"><code>{{ folder }}</code></span>
    </div>
  </div>
</div>
`,Zn={"../components/SystemLogo.html":N,"../helpers/system-info":K,"../lib/ui-state":h},Jn="views/SystemDetails.html";let Fe;Fe=new m(Xn,{modules:Zn,filename:Jn});const Qn=Fe,ea=["Asia","Australia","Austria","Belgium","Brazil","Canada","China","Croatia","Denmark","Europe","Finland","France","Germany","Greece","Hong Kong","India","Ireland","Israel","Italy","Japan","Korea","Mexico","Netherlands","Norway","Peru","Poland","Portugal","Russia","South Africa","Spain","Sweden","Switzerland","Taiwan","Turkey","United Kingdom","USA"],ta=["NTSC","PAL","PAL, NTSC","SECAM"];class S{static instance;metadataCache=new Map;constructor(){}static getInstance(){return S.instance||(S.instance=new S),S.instance}getROMFormat(e){const n=e.split(".").pop()?.toLowerCase()||"";return{nes:"NES",smc:"SNES",sfc:"SNES",gen:"Genesis",md:"Genesis",bin:"Genesis",gb:"Game Boy",gba:"Game Boy Advance",z64:"Nintendo 64",n64:"Nintendo 64",gbc:"Game Boy Color"}[n]||n.toUpperCase()}parseMetadata(e,n){return{filename:e,path:"",format:this.getROMFormat(e),fileSize:n,lastModified:new Date}}getMetadata(e){return this.metadataCache.get(e)}setMetadata(e,n){this.metadataCache.set(e,n)}updateMetadata(e,n){const i={...this.metadataCache.get(e)||{filename:e,path:e,format:"",fileSize:0},...n};return this.metadataCache.set(e,i),i}clearCache(){this.metadataCache.clear()}}const na=S.getInstance(),Ge=Object.freeze(Object.defineProperty({__proto__:null,ROMMetadataService:S,ROM_REGIONS:ea,VIDEO_STANDARDS:ta,romMetadataService:na},Symbol.toStringTag,{value:"Module"})),je=["case","background","title","snap","logo"],z="case";function Ue(t){return je.includes(t)}const Y="global",aa=[...he,Y];function ia(t){return t===Y?void 0:t}const X=["png","jpg","jpeg","webp","gif","avif"];function Z(t){const e=(t??"").split(/[?#]/)[0].split("/").pop()??"",n=e.lastIndexOf("."),a=n===-1?"":e.slice(n+1).toLowerCase();return X.includes(a)?a:void 0}function oa(t){return Z(t)!==void 0}function D(t,e){const n=e.region?`.${e.region}`:"";return`${t}${n}.${e.kind}.${e.extension??"png"}`}function qe(t){const e=t.split(".");if(e.length<3)return;const n=e.pop().toLowerCase();if(!X.includes(n))return;const a=e.pop();if(!Ue(a))return;const i=e.length>1&&q(e[e.length-1])?e.pop():void 0,o=e.join(".");return o.length>0?{gameId:o,kind:a,region:i,extension:n}:void 0}const J=Object.freeze(Object.defineProperty({__proto__:null,COVER_KIND:z,GLOBAL_SCOPE:Y,IMAGE_EXTENSIONS:X,MEDIA_KINDS:je,MEDIA_SCOPES:aa,imageExtensionOf:Z,isImageName:oa,isMediaKind:Ue,mediaFileNameOf:D,parseMediaName:qe,regionOfScope:ia},Symbol.toStringTag,{value:"Module"})),ra=`<!--
  One file's record, edited: the cover (dropped, picked or removed), the text
  fields, and a lookup in the catalogue by checksum (CRC32, then MD5, then SHA-1)
  whose results are offered field by field.

  \`onSave(record, coverFile?, coverRemoved?)\` is awaited (it may fail with a
  message to show); \`loadContent()\` reads the ROM, only when a checksum needs it.
  Events: cancel.
-->
<script :setup="{ romPath = &quot;&quot;, record, coverUrl = void 0, loadContent, canChecksum = true, onSave }">const [Icon, { ROM_REGIONS, VIDEO_STANDARDS }, { gameNameOf, systemOf }, { ROMDatasetService }, { calculateCRC32, calculateMD5, calculateSHA1 }, { isImageName }, { t }] = await $importAll([
  "../components/Icon.html",
  "../lib/ROMMetadataService",
  "../lib/RomLibraryService",
  "../lib/ROMDatasetService",
  "../lib/ChecksumService",
  "../helpers/rom-media",
  "../lib/ui-state"
]);
const LOOKUP_FIELDS = ["title", "description", "region", "videoStandard", "cover"];
let draft = { ...record };
let saving = false;
let busy = false;
let lookupPhase = "idle";
let lookupResult = null;
let selectedFields = /* @__PURE__ */ new Set();
let error = null;
let pendingCoverFile = void 0;
let pendingCoverUrl = void 0;
let coverRemoved = false;
let isCoverDragging = false;
$destroyed(() => {
  if (pendingCoverUrl) URL.revokeObjectURL(pendingCoverUrl);
});
$: activeCoverUrl = coverRemoved ? void 0 : pendingCoverUrl || (draft.cover?.startsWith("https://") ? draft.cover : coverUrl);
const update = (field, value) => {
  draft = { ...draft, [field]: value };
};
const onCoverFile = (file) => {
  if (!file.type.startsWith("image/") && !isImageName(file.name)) return;
  if (pendingCoverUrl) URL.revokeObjectURL(pendingCoverUrl);
  pendingCoverFile = file;
  pendingCoverUrl = URL.createObjectURL(file);
  coverRemoved = false;
};
const removeCover = () => {
  if (pendingCoverUrl) URL.revokeObjectURL(pendingCoverUrl);
  pendingCoverFile = void 0;
  pendingCoverUrl = void 0;
  coverRemoved = true;
  draft = { ...draft, cover: void 0 };
};
const onCoverDragOver = (event) => {
  event.preventDefault();
  event.stopPropagation();
  isCoverDragging = true;
};
const onCoverDragLeave = (event) => {
  event.preventDefault();
  event.stopPropagation();
  isCoverDragging = false;
};
const onCoverDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  isCoverDragging = false;
  const files = Array.from(event.dataTransfer?.files ?? []);
  const image = files.find((f) => f.type.startsWith("image/") || isImageName(f.name));
  if (image) onCoverFile(image);
};
const onFilePicked = (event) => {
  const files = event.currentTarget.files;
  if (files && files.length > 0) onCoverFile(files[0]);
};
const pickCover = () => $self(".cover-file-input")?.click();
const computeChecksum = async () => {
  try {
    busy = true;
    error = null;
    if (!draft.crc32) update("crc32", await calculateCRC32(await loadContent()));
  } catch (err) {
    error = err instanceof Error ? err.message : t("editor.error.checksum");
  } finally {
    busy = false;
  }
};
const showLookupResult = (result) => {
  lookupResult = result;
  const fields = /* @__PURE__ */ new Set();
  if (result.name) fields.add("title");
  if (result.description) fields.add("description");
  if (result.region) fields.add("region");
  if (result.videoStandard) fields.add("videoStandard");
  if (result.cover) fields.add("cover");
  selectedFields = fields;
  lookupPhase = "complete";
};
const lookup = async () => {
  try {
    busy = true;
    error = null;
    lookupResult = null;
    selectedFields = /* @__PURE__ */ new Set();
    lookupPhase = "crc32";
    const content = await loadContent();
    const crc32 = draft.crc32 || await calculateCRC32(content);
    if (!draft.crc32) update("crc32", crc32);
    const system = systemOf(romPath);
    try {
      await ROMDatasetService.ensureSystem(system);
    } catch {
      error = \`No dataset available for \${system}\`;
      lookupPhase = "complete";
      return;
    }
    let result = await ROMDatasetService.lookupByCrc(crc32);
    if (result) return showLookupResult(result);
    lookupPhase = "md5";
    result = await ROMDatasetService.lookupByMd5(await calculateMD5(content));
    if (result) return showLookupResult(result);
    lookupPhase = "sha1";
    result = await ROMDatasetService.lookupBySha1(await calculateSHA1(content));
    if (result) return showLookupResult(result);
    error = t("editor.lookup.notFound");
    lookupPhase = "complete";
  } catch (err) {
    error = err instanceof Error ? err.message : t("editor.lookup.failed");
    lookupPhase = "complete";
  } finally {
    busy = false;
  }
};
const toggleField = (field) => {
  const next = new Set(selectedFields);
  if (next.has(field)) next.delete(field);
  else next.add(field);
  selectedFields = next;
};
const applySelected = () => {
  const result = lookupResult;
  if (!result) return;
  const take = (field, incoming, current) => selectedFields.has(field) && incoming ? incoming : current;
  draft = {
    ...draft,
    title: take("title", result.name, draft.title),
    description: take("description", result.description, draft.description),
    region: take("region", result.region, draft.region),
    videoStandard: take("videoStandard", result.videoStandard, draft.videoStandard),
    cover: take("cover", result.cover, draft.cover)
  };
  lookupResult = null;
  selectedFields = /* @__PURE__ */ new Set();
};
const save = async () => {
  try {
    saving = true;
    error = null;
    await onSave(draft, pendingCoverFile, coverRemoved);
  } catch (err) {
    error = err instanceof Error ? err.message : t("editor.error.save");
    saving = false;
  }
};
const syncLookupDialog = (result) => {
  requestAnimationFrame(() => {
    const element = $self(".lookup-dialog");
    if (!element) return;
    if (result && !element.open) element.showModal();
    else if (!result && element.open) element.close();
  });
};
$: syncLookupDialog(lookupResult);
$: lookupIcon = busy && (lookupPhase === "md5" || lookupPhase === "sha1") ? "hourglass" : "search";
$: lookupText = busy && lookupPhase === "crc32" ? t("editor.lookup.crc32") : busy && lookupPhase === "md5" ? t("editor.lookup.md5") : busy && lookupPhase === "sha1" ? t("editor.lookup.sha1") : t("editor.lookup.idle");
const incomingOf = (field) => field === "title" ? lookupResult?.name : lookupResult?.[field];
const currentOf = (field) => draft[field] || t("editor.lookup.empty");
<\/script>

<div class="metadata-editor">
  <div class="metadata-header">
    <div>
      <h3>{{ draft.title || gameNameOf(romPath) }}</h3>
      <p class="metadata-subtitle">{{ romPath }}</p>
    </div>
    <button
      @click="lookup"
      :disabled="busy || saving || !canChecksum"
      class="btn-lookup icon-label"
      :title="canChecksum ? t('editor.lookup.hint') : t('editor.lookup.tooLarge')"
    ><Icon :name="lookupIcon" /> {{ lookupText }}</button>
  </div>

  <div :if="error" class="lookup-error">{{ error }}</div>

  <dialog
    :if="lookupResult"
    class="modal-dialog lookup-dialog"
    :aria-label="t('editor.lookup.title')"
    @close="lookupResult = null"
    @click.self="lookupResult = null"
  >
    <header class="modal-header">
      <h3>{{ t('editor.lookup.title') }}</h3>
      <button class="modal-close" @click="lookupResult = null"><Icon name="close" /></button>
    </header>

    <div class="modal-content">
      <p class="match-name"><strong>{{ t('editor.lookup.match') }}</strong> {{ lookupResult.name }}</p>

      <div class="update-fields">
        <h4>{{ t('editor.lookup.select') }}</h4>
        <div :each="field in LOOKUP_FIELDS.filter((name) => incomingOf(name))" :key="field" class="field-option">
          <label class="checkbox-label">
            <input type="checkbox" :checked="selectedFields.has(field)" @change="toggleField(field)" />
            <span class="checkbox-text">
              <strong>{{ t(\`editor.fields.\${field}\`) }}</strong>
              <img
                :if="field === 'cover'"
                class="cover-preview"
                :src="incomingOf(field)"
                :alt="t('details.cover.alt', { title: lookupResult.name })"
                loading="lazy"
              />
              <span :else class="field-preview">
                <span class="current">{{ t('editor.lookup.current') }} <span class="value">{{ currentOf(field) }}</span></span>
                <span class="new">{{ t('editor.lookup.incoming') }} <span class="value">{{ incomingOf(field) }}</span></span>
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>

    <div class="modal-actions">
      <button @click="lookupResult = null" class="btn-cancel icon-label"><Icon name="close" /> {{ t('editor.cancel') }}</button>
      <button @click="applySelected" class="btn-apply icon-label" :disabled="selectedFields.size === 0">
        <Icon name="check" /> {{ t('editor.lookup.apply') }}
      </button>
    </div>
  </dialog>

  <div
    :class="\`form-group cover-editor-group \${isCoverDragging ? 'dragging' : ''}\`"
    @dragover="onCoverDragOver"
    @dragleave="onCoverDragLeave"
    @drop="onCoverDrop"
  >
    <label>{{ t('editor.fields.cover') }}</label>
    <div :if="activeCoverUrl" class="cover-preview-wrapper">
      <img class="cover-image" :src="activeCoverUrl" :alt="t('details.cover.alt', { title: draft.title || gameNameOf(romPath) })" loading="lazy" />
      <div class="cover-actions">
        <button type="button" class="btn-inline" @click="pickCover">{{ t('editor.changeCover') }}</button>
        <button type="button" class="btn-inline btn-danger" @click="removeCover">{{ t('editor.removeCover') }}</button>
      </div>
    </div>
    <div :else class="cover-drop-zone" @click="pickCover">
      <span class="cover-drop-prompt">{{ t('editor.dropCoverOrClick') }}</span>
    </div>
    <input type="file" accept="image/*" style="display: none" class="cover-file-input" @change="onFilePicked" />
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.title') }}</label>
    <input type="text" :value="draft.title || ''" @input="update('title', $event.target.value)" />
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.description') }}</label>
    <textarea rows="4" :value="draft.description || ''" @input="update('description', $event.target.value)"></textarea>
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.releaseDate') }}</label>
    <input type="date" :value="draft.releaseDate || ''" @input="update('releaseDate', $event.target.value)" />
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.publisher') }}</label>
    <input type="text" :value="draft.publisher || ''" @input="update('publisher', $event.target.value)" />
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.region') }}</label>
    <select :value="draft.region || ''" @change="update('region', $event.target.value)">
      <option value="">{{ t('editor.select') }}</option>
      <option :each="value in (draft.region && !ROM_REGIONS.includes(draft.region) ? [draft.region, ...ROM_REGIONS] : ROM_REGIONS)" :key="value" :value="value">{{ value }}</option>
    </select>
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.videoStandard') }}</label>
    <select :value="draft.videoStandard || ''" @change="update('videoStandard', $event.target.value)">
      <option value="">{{ t('editor.select') }}</option>
      <option :each="value in (draft.videoStandard && !VIDEO_STANDARDS.includes(draft.videoStandard) ? [draft.videoStandard, ...VIDEO_STANDARDS] : VIDEO_STANDARDS)" :key="value" :value="value">{{ value }}</option>
    </select>
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.crc32') }}</label>
    <div class="field-with-action">
      <input
        type="text"
        :value="draft.crc32 || ''"
        :placeholder="canChecksum ? t('editor.notCalculated') : t('editor.tooLarge')"
        disabled
        class="checksum-field"
      />
      <button :if="canChecksum && !draft.crc32" class="btn-inline" @click="computeChecksum" :disabled="busy">{{ t('editor.calculate') }}</button>
    </div>
  </div>

  <div class="editor-actions">
    <button class="btn-primary icon-label" @click="save" :disabled="saving">
      <Icon :if="!saving" name="save" /> {{ saving ? t('editor.saving') : t('editor.save') }}
    </button>
    <button class="btn-cancel" @click="$emit('cancel')" :disabled="saving">{{ t('editor.cancel') }}</button>
  </div>
</div>
`,sa={"../components/Icon.html":f,"../lib/ROMMetadataService":Ge,"../lib/RomLibraryService":V,"../lib/ROMDatasetService":ge,"../lib/ChecksumService":pe,"../helpers/rom-media":J,"../lib/ui-state":h},la="views/MetadataEditor.html";let Ve;Ve=new m(ra,{modules:sa,filename:la});const ca=Ve,F="game",He=2;function da(t,e){const n=e===!1?10:0,a=t.regions.length>1?He+1:0;return n+a+(t.flags.length>0?1:0)}function We(t){return yt(t.title)}function Q(t){return t.files.find(e=>e.cover)?.cover}function Ke(t,e,n){const a=new Map;for(const[r,s]of Object.entries(e?.byRegion??{}))s&&q(r)&&a.set(r,{url:s,rank:He});for(const r of t.variants){const s=Q(r);if(!s)continue;const d=n?n.has(r.key):void 0,c=da(r,d),v=r.regions.length>0?[...r.regions]:[F];for(const y of v){const w=a.get(y);(!w||c<w.rank)&&a.set(y,{url:s,rank:c})}}const i={};for(const[r,{url:s}]of a)r!==F&&(i[r]=s);const o=a.get(F)?.url??e?.game;return o?{byRegion:i,game:o}:{byRegion:i}}function ma(t,e={}){const n=e.order??ce,a=new Set(e.present??[]);if(e.variantUrl){const r=Object.entries(t.byRegion).find(([,c])=>c===e.variantUrl),s=e.variantRegion??(r&&q(r[0])?r[0]:void 0),d=s&&e.stored?.byRegion[s]||e.stored?.game;return{url:e.variantUrl,file:d,region:s}}const i=r=>{const s=e.stored?.byRegion[r];if(s)return{url:t.byRegion[r],file:s,region:r};if(e.stored?.game)return{file:e.stored.game};const d=t.byRegion[r];return d?{url:d,region:r}:void 0};for(const r of n){const s=a.has(r)?i(r):void 0;if(s)return s}for(const r of n){const s=i(r);if(s)return s}const o=e.stored?.game;return o||t.game?{url:t.game,file:o}:void 0}function fa(t,e){if(e.file||!e.url)return!1;const n=Object.values(t.byRegion).filter(Boolean);return n.length>1&&n.every(a=>a===e.url)}function M(t,e){return e.file?e.file:D(t,{kind:z,region:e.region,extension:Z(e.url)})}function Ye(t,e){const n=new Set;return e&&n.add(M(t,e)),e?.file&&e.url&&n.add(M(t,{url:e.url,region:e.region})),n.add(D(t,{kind:z})),[...n]}function Xe(t){const e=Object.entries(t.byRegion).filter(([,n])=>!!n).map(([n,a])=>({url:a,region:n}));return t.game&&e.push({url:t.game}),e}const Ze=512;function Je(t,e){const n=t.trim();if(!(!n||n.length>255||/[/\\\n\r<>]/.test(n)||n.startsWith("."))&&/\.(png|jpe?g|webp)$/i.test(n))try{return new URL(encodeURIComponent(n),e).href}catch{return}}function ha(t){if(!t)return"3 / 4";const e=(Ie(t)?.name??t).toLowerCase(),n=(...a)=>a.some(i=>e.includes(i));return n("advance","gba")?"9 / 8":n("nintendo 64","n64","super nintendo","snes","super famicom")?"7 / 5":n("mega drive","megadrive","genesis")?"7 / 10":n("game boy","gameboy","gbc","game gear","gamegear","playstation","ps1","psx","nintendo ds","3ds")?"1 / 1":"3 / 4"}const ee=Object.freeze(Object.defineProperty({__proto__:null,SYMLINK_MAX_BYTES:Ze,coverFileNameOf:M,coverKeyOf:We,coversOf:Ke,isSharedCover:fa,pickCover:ma,storableCoversOf:Xe,storedCoverNamesOf:Ye,symlinkTargetOf:Je,systemAspectRatio:ha,variantCoverUrl:Q},Symbol.toStringTag,{value:"Module"}));function pa(t){if(t<1024)return`${t} B`;const e=["KB","MB","GB"];let n=t/1024,a=0;for(;n>=1024&&a<e.length-1;)n/=1024,a+=1;return`${n.toFixed(n<10?1:0)} ${e[a]}`}function ga(t){if(t===void 0)return"—";const e=typeof t=="number"?new Date(t):new Date(t);return Number.isNaN(e.getTime())?"—":e.toLocaleString()}const ua=Object.freeze(Object.defineProperty({__proto__:null,formatDate:ga,formatSize:pa},Symbol.toStringTag,{value:"Module"}));function Qe(t){if(t.byteLength<512)return null;const e=new Uint8Array(t,0,512);if(!(e[0]===78&&e[1]===69&&e[2]===79))return null;const a=new DataView(t,0,512),i=e[4],o=e[5],r=a.getUint32(8,!0),s=a.getUint32(12,!0),d=a.getUint32(16,!0),c=a.getUint32(20,!0),v=a.getUint32(24,!0),y=r+s+d+c+v,w=512+y;return{validHeader:!0,version:i,system:o,pSize:r,sSize:s,mSize:d,vSize:c,cSize:v,totalDataSize:y,expectedFileSize:w}}function va(t){const e=t.fileName.toLowerCase().endsWith(".neo"),n=t.fileName.toLowerCase().endsWith(".zip");let a=!1,i,o="";if(e)if(t.headerBuffer){const c=Qe(t.headerBuffer);c?(i=c,t.fileSize!==void 0?(a=t.fileSize===c.expectedFileSize,o=a?`Valid .neo header (P: ${$(c.pSize)}, C: ${$(c.cSize)}, total: ${$(c.totalDataSize)})`:`Header/size mismatch (expected ${c.expectedFileSize} B, got ${t.fileSize} B)`):(a=!0,o=`Valid .neo header (total data ${$(c.totalDataSize)})`)):(a=!1,o="Invalid or missing .neo 512-byte header magic")}else a=(t.fileSize??0)>512,o=a?"Plausible .neo file size":"File size too small for .neo";else if(n){const c=(t.memberCrcs?.length??0)>0;a=c||(t.fileSize??0)>0,o=c?`Valid ZIP archive containing ${t.memberCrcs?.length} chip dumps`:"ZIP archive structure detected"}else a=(t.fileSize??0)>0,o="Generic ROM file";const r=!!t.datMatch;let s="unverified",d="Unverified";return a&&r?(s="verified",d=e?"Verified (DAT + Header)":"Verified (DAT + ZIP)"):a&&!r?(s="structurally_valid",d=e?"Valid Structure (Custom DAT)":"Valid Archive (Custom DAT)"):a||(s="incomplete",d="Incomplete / Corrupted"),{status:s,structureValid:a,datVerified:r,statusLabel:d,details:o,header:i}}function $(t){return t>=1024*1024?`${(t/(1024*1024)).toFixed(1)} MiB`:t>=1024?`${(t/1024).toFixed(0)} KiB`:`${t} B`}const ya=Object.freeze(Object.defineProperty({__proto__:null,parseNeoGeoHeader:Qe,validateNeoGeoVariant:va},Symbol.toStringTag,{value:"Module"})),wa=`<!--
  A game's mods (IPS / BPS / UPS), in its details: name, format, and whether it fits a
  version that is here; rename, unassign, remove. The system's unassigned mods follow,
  each with "Assign to this game".

  \`mods\` are the system's (ModRecord[]); \`versions\` the CRCs of the versions on disk;
  \`actions\` = { rename(sha1, name), assign(sha1, assign: boolean), remove(sha1) }, all async.
  \`play(crc, patch)\`, when a launcher hosts rom-manager, is the link that plays a version with a
  mod: the version a BPS / UPS fits, else the first one here.
-->
<script :setup="{ game, mods = [], versions = [], actions, play = void 0 }">const [Icon, PromptModal, ConfirmModal, { gameIdOf, modFit }, { t }] = await $importAll([
  "../components/Icon.html",
  "../components/PromptModal.html",
  "../components/ConfirmModal.html",
  "../helpers/library-index",
  "../lib/ui-state"
]);
let renaming = void 0;
let removing = void 0;
let busy = false;
let error = void 0;
$: gameId = gameIdOf(game.title);
$: assigned = mods.filter((mod) => mod.gameId === gameId);
$: unassigned = mods.filter((mod) => !mod.gameId);
const fitOf = (mod) => modFit(mod, versions);
const playOf = (mod) => {
  if (!play) return void 0;
  const fit = fitOf(mod);
  if (fit === "other") return void 0;
  return play(fit === "fits" ? mod.sourceCrc : versions[0]?.crc, mod.sha1);
};
const act = async (run) => {
  try {
    busy = true;
    error = void 0;
    await run();
  } catch (err) {
    error = err instanceof Error ? err.message : t("mods.errors.change");
  } finally {
    busy = false;
  }
};
const rename = (name) => {
  const current = renaming;
  renaming = void 0;
  if (current && name && name !== current.name) void act(() => actions.rename(current.sha1, name));
};
const remove = () => {
  const current = removing;
  removing = void 0;
  if (current) void act(() => actions.remove(current.sha1));
};
<\/script>
<section class="game-mods">
  <div class="variants-heading">
    <h3>{{ t('mods.title') }}</h3>
  </div>
  <p :if="assigned.length === 0" class="mods-empty">{{ t('mods.empty') }}</p>
  <ul :else class="mods">
    <li :each="mod in assigned" :key="mod.sha1" class="mod-row">
      <span class="mod-name" :title="mod.name">{{ mod.name }}</span>
      <span class="tag">{{ mod.format.toUpperCase() }}</span>
      <span :class="\`tag mod-fit mod-fit-\${fitOf(mod)} \${fitOf(mod) === 'fits' ? 'status-complete' : ''}\`" :title="mod.sourceCrc ? \`CRC32 \${mod.sourceCrc}\` : ''">{{ t(\`mods.fit.\${fitOf(mod)}\`) }}</span>
      <span class="mod-actions">
        <a :if="playOf(mod)" class="mod-play icon-label" :href="playOf(mod)" :title="t('host.playWithMod')"><Icon name="play" /> {{ t('host.play') }}</a>
        <button class="tree-organize" :disabled="busy" @click="renaming = { sha1: mod.sha1, name: mod.name }" :title="t('mods.rename')">
          <Icon name="pencil" />
        </button>
        <button class="tree-organize" :disabled="busy" @click="act(() => actions.assign(mod.sha1, false))" :title="t('mods.unassign')">
          <Icon name="close" />
        </button>
        <button class="tree-organize" :disabled="busy" @click="removing = { sha1: mod.sha1, name: mod.name }" :title="t('mods.remove')">
          <Icon name="trash" />
        </button>
      </span>
    </li>
  </ul>

  <details :if="unassigned.length > 0" class="variants-missing">
    <summary>{{ t('mods.unassigned', { count: unassigned.length }) }}</summary>
    <ul class="mods">
      <li :each="mod in unassigned" :key="mod.sha1" class="mod-row">
        <span class="mod-name" :title="mod.name">{{ mod.name }}</span>
        <span class="tag">{{ mod.format.toUpperCase() }}</span>
        <span class="mod-actions">
          <button class="mod-assign" :disabled="busy" @click="act(() => actions.assign(mod.sha1, true))">
            <Icon name="plus" /> {{ t('mods.assign') }}
          </button>
          <button class="tree-organize" :disabled="busy" @click="removing = { sha1: mod.sha1, name: mod.name }" :title="t('mods.remove')">
            <Icon name="trash" />
          </button>
        </span>
      </li>
    </ul>
  </details>

  <p :if="error" class="mods-error" role="alert">{{ error }}</p>
  <p class="mods-hint">{{ t('mods.hint') }}</p>

  <PromptModal
    :if="renaming"
    :open="true"
    :close-label="t('prefs.close')"
    :cancel-label="t('drop.cancel')"
    :submit-label="t('modal.confirm')"
    :title="t('mods.renameTitle')"
    :default-value="renaming.name"
    @submit="rename($event.detail)"
    @close="renaming = undefined"
  />
  <ConfirmModal
    :if="removing"
    :open="true"
    :close-label="t('prefs.close')"
    :cancel-label="t('drop.cancel')"
    :confirm-label="t('modal.delete')"
    :title="t('mods.removeTitle')"
    :message="t('mods.removeMessage', { name: removing.name })"
    @confirm="remove()"
    @close="removing = undefined"
  />
</section>
`,ba={"../components/Icon.html":f,"../components/PromptModal.html":ze,"../components/ConfirmModal.html":P,"../helpers/library-index":H,"../lib/ui-state":h},ka="views/GameMods.html";let et;et=new m(wa,{modules:ba,filename:ka});const xa=et,tt="play.germade",Sa=tt==="play.germade",Oa="/",nt=Object.freeze(Object.defineProperty({__proto__:null,HOST:tt,LAUNCHER_BASE:Oa,isPlayGermade:Sa},Symbol.toStringTag,{value:"Module"})),_a={MegaDrive:"megadrive",SNES:"snes",GBA:"gba",GAMEBOY:"gba",GBC:"gba",NEOGEO:"neogeo"};function at(t){return _a[t]}function Ma({system:t,gameId:e,crc:n,patch:a},i="/"){const o=at(t);if(!o)return;const r=new URLSearchParams({system:t,game:e,version:n.toLowerCase()});return a&&r.set("patch",a.slice(0,8).toLowerCase()),`${i}${o}/?${r}`}const Ca=Object.freeze(Object.defineProperty({__proto__:null,launcherRouteOf:at,playUrl:Ma},Symbol.toStringTag,{value:"Module"})),$a=`<!--
  The details pane: what is picked in the tree, shown as it is.

  - a game (grouped folder): its cover and its variants, each with its files;
  - a folder: the system it is (SystemDetails);
  - one file: its record (or what is known before it has one), or the editor;
  - several files: the list, or the batch editor.

  Events: edit, cancel-edit, select-file (path), organize (path),
  remove (paths), back. The async ones are functions, because the editor waits
  on them: \`onSave(path, record, coverFile?, coverRemoved?)\`,
  \`onSaveMany(changes)\`, \`loadContent(path)\`, and the game's mods (\`mods\`, the
  system's) through \`modActions\` (see GameMods).
-->
<script
  :setup="{ paths = [], game = void 0, folder = void 0, wizardFolder = false, gameCover = void 0, records, stats, covers, editing = false, onSave, onSaveMany, loadContent, canOrganize = false, canRemove = false, back = void 0, mods = [], modActions = void 0 }">const [Icon, SystemDetails, MetadataEditor, { CRC32_SIZE_LIMIT, emptyRecord, gameNameOf }, { t }] = await $importAll([
  "../components/Icon.html",
  "./SystemDetails.html",
  "./MetadataEditor.html",
  "../lib/RomLibraryService",
  "../lib/ui-state"
]);
$: single = paths.length === 1 ? paths[0] : void 0;
$: record = single ? records.get(single) ?? null : null;
$: stat = single ? stats.get(single) : void 0;
$: size = stat?.size ?? 0;
$: own = single ? covers.get(single) : void 0;
$: cover = own ? { url: own } : gameCover;
$: selectedRecords = paths.map((path) => records.get(path)).filter(Boolean);
$: showsFolder = Boolean(folder && (paths.length === 0 || paths.length === 1 && paths[0] === folder));
<\/script>

<GameView
  :if="game"
  :game="game"
  :cover="gameCover"
  :stats="stats"
  :can-organize="canOrganize"
  :mods="mods"
  :mod-actions="modActions"
  @select-file="$emit('select-file', $event.detail)"
  @organize="$emit('organize', $event.detail)"
/>
<SystemDetails :elseif="showsFolder" :folder="folder" :wizard="wizardFolder" />
<div :elseif="paths.length === 0" class="empty-state">{{ t('details.empty') }}</div>
<RomBatchEditor
  :elseif="paths.length > 1 && editing && selectedRecords.length === paths.length"
  :records="selectedRecords"
  :count="paths.length"
  :on-save="onSaveMany"
  @cancel="$emit('cancel-edit')"
/>
<RomSelectionView :elseif="paths.length > 1" :paths="paths" :records="records" @edit="$emit('edit')" />
<div :elseif="editing" class="details-editing" style="display: contents">
  <!-- One editor per file: another file starts a fresh one. -->
  <MetadataEditor
    :each="key in [single]"
    :key="key"
    :rom-path="single"
    :record="record ?? { ...emptyRecord(), title: gameNameOf(single) }"
    :cover-url="covers.get(single)"
    :can-checksum="size <= CRC32_SIZE_LIMIT"
    :load-content="() => loadContent(single)"
    :on-save="(updated, coverFile, coverRemoved) => onSave(single, updated, coverFile, coverRemoved)"
    @cancel="$emit('cancel-edit')"
  />
</div>
<div :else class="details-single" style="display: contents">
  <button :if="back" class="btn-back icon-label" @click="$emit('back')" :title="t('details.back')">
    <Icon name="arrow-left" /> {{ back.label }}
  </button>
  <RomFileView
    :if="!record"
    :path="single"
    :stat="stat"
    :cover="cover"
    :load-content="loadContent"
    :can-remove="canRemove"
    @edit="$emit('edit')"
    @remove="$emit('remove', $event.detail)"
  />
  <RomInfoView
    :else
    :path="single"
    :record="record"
    :stat="stat"
    :cover="cover"
    :can-remove="canRemove"
    @edit="$emit('edit')"
    @remove="$emit('remove', $event.detail)"
  />
</div>

<!-- The box art (or a placeholder in the system's own box shape) and whose box it is. -->
<template name="CoverFigure">
  <script :setup="{ cover = void 0, alt = &quot;&quot;, system = void 0 }">const [{ systemAspectRatio }, { t }] = await $importAll(["../helpers/rom-covers", "../lib/ui-state"]);
let naturalRatio = void 0;
const resetFor = (_system) => {
  naturalRatio = void 0;
};
$: resetFor(system);
$: currentRatio = naturalRatio || systemAspectRatio(system);
$: isLandscape = (() => {
  const parts = currentRatio.split("/").map((s) => parseFloat(s.trim()));
  return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] > parts[1];
})();
$: regionLabel = cover?.region ? t("details.cover.region", { region: cover.region }) : cover ? t("details.cover.game") : "\\xA0";
const onLoad = (event) => {
  const img = event.currentTarget;
  if (img.naturalWidth && img.naturalHeight) naturalRatio = \`\${img.naturalWidth} / \${img.naturalHeight}\`;
};
<\/script>
  <figure class="rom-info-cover-figure">
    <div :class="\`rom-info-cover-wrapper \${isLandscape ? 'landscape' : ''}\`" :style="\`aspect-ratio: \${currentRatio}\`">
      <!-- Keyed by its url: a new image starts as a new element (the ratio is read on load). -->
      <img :each="url in (cover ? [cover.url] : [])" :key="url" class="rom-info-cover" :src="url" :alt="t('details.cover.alt', { title: alt })" @load="onLoad" />
      <div :if="!cover" class="rom-info-cover placeholder">{{ t('details.cover.none') }}</div>
    </div>
    <figcaption class="rom-info-cover-region">{{ regionLabel }}</figcaption>
  </figure>
</template>

<!-- A file's CRC32, taken on demand (it reads the whole file). -->
<template name="ChecksumRow">
  <script :setup="{ path, size = 0, loadContent }">const [{ CRC32_SIZE_LIMIT }, { calculateCRC32 }, { formatSize }, { t }] = await $importAll([
  "../lib/RomLibraryService",
  "../lib/ChecksumService",
  "../helpers/format",
  "../lib/ui-state"
]);
let value = void 0;
let busy = false;
let error = void 0;
const compute = async () => {
  try {
    busy = true;
    error = void 0;
    value = await calculateCRC32(await loadContent(path));
  } catch (err) {
    error = err instanceof Error ? err.message : t("details.checksum.failed");
  } finally {
    busy = false;
  }
};
<\/script>
  <div :if="size > CRC32_SIZE_LIMIT" class="fact">
    <span class="fact-label">CRC32</span>
    <span class="fact-value muted">{{ t('details.checksum.skipped', { limit: formatSize(CRC32_SIZE_LIMIT) }) }}</span>
  </div>
  <div :else class="fact">
    <span class="fact-label">{{ t('details.facts.crc32') }}</span>
    <span class="fact-value">
      <code :if="value">{{ value }}</code>
      <button :else class="btn-inline" @click="compute" :disabled="busy">
        {{ busy ? t('details.checksum.calculating') : t('details.checksum.calculate') }}
      </button>
      <span :if="error" class="fact-error">{{ error }}</span>
    </span>
  </div>
</template>

<!-- A file with no record yet: what the disk says about it. Events: edit, remove (paths). -->
<template name="RomFileView">
  <script :setup="{ path, stat = void 0, cover = void 0, loadContent, canRemove = false }">const [Icon, ConfirmModal, { romMetadataService }, { extensionOf, fileNameOf, systemOf }, { formatDate, formatSize }, { t }] = await $importAll([
  "../components/Icon.html",
  "../components/ConfirmModal.html",
  "../lib/ROMMetadataService",
  "../lib/RomLibraryService",
  "../helpers/format",
  "../lib/ui-state"
]);
let confirmDelete = false;
$: size = stat?.size ?? 0;
const confirmRemove = () => {
  confirmDelete = false;
  $emit("remove", [path]);
};
<\/script>
  <div class="rom-file-view">
    <button :if="canRemove" class="btn-delete-topright" @click="confirmDelete = true" :title="t('details.delete')">
      <Icon name="trash" />
    </button>
    <div :if="cover" class="rom-info-hero">
      <CoverFigure :cover="cover" :alt="fileNameOf(path)" :system="systemOf(path)" />
      <div class="rom-info-heading">
        <h3>{{ fileNameOf(path) }}</h3>
        <p class="metadata-subtitle">{{ t('details.file.pending') }}</p>
        <button class="btn-primary icon-label" @click="$emit('edit')"><Icon name="pencil" /> {{ t('details.file.add') }}</button>
      </div>
    </div>
    <div :else class="rom-file-header">
      <div>
        <h3>{{ fileNameOf(path) }}</h3>
        <p class="metadata-subtitle">{{ t('details.file.pending') }}</p>
      </div>
      <button class="btn-primary icon-label" @click="$emit('edit')"><Icon name="pencil" /> {{ t('details.file.add') }}</button>
    </div>

    <div class="facts">
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.system') }}</span>
        <span class="fact-value">{{ systemOf(path) || '—' }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.format') }}</span>
        <span class="fact-value">{{ romMetadataService.getROMFormat(path) }} ({{ extensionOf(path) || t('details.facts.noExtension') }})</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.size') }}</span>
        <span class="fact-value">{{ formatSize(size) }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.modified') }}</span>
        <span class="fact-value">{{ formatDate(stat?.mtime) }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.added') }}</span>
        <span class="fact-value muted">{{ t('details.facts.notInitialized') }}</span>
      </div>
      <ChecksumRow :path="path" :size="size" :load-content="loadContent" />
    </div>

    <ConfirmModal
      :close-label="t('prefs.close')"
      :cancel-label="t('drop.cancel')"
      :confirm-label="t('modal.delete')"
      :if="confirmDelete"
      :open="true"
      :title="t('details.variants.deleteFileTitle')"
      :message="t('details.variants.deleteFileMessage', { name: fileNameOf(path) })"
      :danger="true"
      @confirm="confirmRemove()"
      @close="confirmDelete = false"
    />
  </div>
</template>

<!-- A file with a record: the game it is, as written in its \`.meta\`. Events: edit, remove (paths). -->
<template name="RomInfoView">
  <script :setup="{ path, record, stat = void 0, cover = void 0, canRemove = false }">const [Icon, ConfirmModal, { fileNameOf, gameNameOf, systemOf }, { formatDate, formatSize }, { t }] = await $importAll([
  "../components/Icon.html",
  "../components/ConfirmModal.html",
  "../lib/RomLibraryService",
  "../helpers/format",
  "../lib/ui-state"
]);
let confirmDelete = false;
const confirmRemove = () => {
  confirmDelete = false;
  $emit("remove", [path]);
};
<\/script>
  <div class="rom-info">
    <button :if="canRemove" class="btn-delete-topright" @click="confirmDelete = true" :title="t('details.delete')">
      <Icon name="trash" />
    </button>
    <div class="rom-info-hero">
      <CoverFigure :cover="cover" :alt="record.title || path" :system="systemOf(path)" />
      <div class="rom-info-heading">
        <h2>{{ record.title || gameNameOf(path) }}</h2>
        <p class="rom-info-system">{{ systemOf(path) }}</p>
        <div class="rom-info-tags">
          <span :if="record.region" class="tag">{{ record.region }}</span>
          <span :if="record.videoStandard" class="tag">{{ record.videoStandard }}</span>
          <span :if="record.releaseDate" class="tag">{{ record.releaseDate }}</span>
        </div>
        <button class="btn-primary icon-label" @click="$emit('edit')"><Icon name="pencil" /> {{ t('details.edit') }}</button>
      </div>
    </div>

    <p :if="record.description" class="rom-info-description">{{ record.description }}</p>

    <div class="facts">
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.file') }}</span>
        <span class="fact-value">{{ fileNameOf(path) }}</span>
      </div>
      <div :if="record.publisher" class="fact">
        <span class="fact-label">{{ t('details.facts.publisher') }}</span>
        <span class="fact-value">{{ record.publisher }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.size') }}</span>
        <span class="fact-value">{{ formatSize(stat?.size ?? 0) }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.crc32') }}</span>
        <span class="fact-value"><code :if="record.crc32">{{ record.crc32 }}</code><span :else>—</span></span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.added') }}</span>
        <span class="fact-value">{{ formatDate(record.addedAt) }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.updated') }}</span>
        <span class="fact-value">{{ formatDate(record.updatedAt) }}</span>
      </div>
    </div>

    <ConfirmModal
      :close-label="t('prefs.close')"
      :cancel-label="t('drop.cancel')"
      :confirm-label="t('modal.delete')"
      :if="confirmDelete"
      :open="true"
      :title="t('details.variants.deleteFileTitle')"
      :message="t('details.variants.deleteFileMessage', { name: fileNameOf(path) })"
      :danger="true"
      @confirm="confirmRemove()"
      @close="confirmDelete = false"
    />
  </div>
</template>

<!-- One variant of a game: its status, regions, video standards and files. Events: select-file, organize. -->
<template name="VariantRow">
  <script :setup="{ variant, stats, cover = void 0, canOrganize = false, play = void 0 }">const [Icon, { fileNameOf, systemOf }, { validateNeoGeoVariant }, { formatSize }, { t }] = await $importAll([
  "../components/Icon.html",
  "../lib/RomLibraryService",
  "../helpers/neogeo-validator",
  "../helpers/format",
  "../lib/ui-state"
]);
const STATUS_KEYS = {
  complete: "details.status.complete",
  partial: "details.status.partial",
  missing: "details.status.missing"
};
$: activeUrl = cover?.publishedUrl || cover?.url;
$: isCoverActive = variant.status !== "missing" && (Boolean(activeUrl && variant.cover === activeUrl) || Boolean(cover?.region && !variant.cover && variant.regions.includes(cover.region)));
$: displayKey = variant.key === "Unknown" ? "World / Arcade" : variant.key;
$: playHref = play && variant.status !== "missing" ? play(variant.files.find((file) => file.path)?.crc) : void 0;
const validationOf = (file) => {
  const isNeoGeo = systemOf(file.path) === "NEOGEO" || file.path.toLowerCase().endsWith(".neo");
  return isNeoGeo ? validateNeoGeoVariant({ fileName: fileNameOf(file.path), fileSize: stats.get(file.path)?.size, datMatch: Boolean(file.crc) }) : null;
};
<\/script>
  <li :class="\`variant status-\${variant.status}\${isCoverActive ? ' active-cover' : ''}\`">
    <div class="variant-heading">
      <span class="variant-mark" :title="t(STATUS_KEYS[variant.status])"><Icon name="status" :status="variant.status" /></span>
      <span class="variant-key">{{ displayKey }}</span>
      <span class="variant-support">
        <span :each="region in variant.regions" :key="region" class="tag region" :title="t('details.variants.shipsTo', { region })">{{ region }}</span>
        <span :each="standard in variant.videoStandards" :key="standard" class="tag video" :title="t('details.variants.runsAt', { standard })">{{ standard }}</span>
      </span>
      <span class="variant-count">{{ variant.files.length > 1 ? t('details.variants.files', { count: variant.files.length }) : '' }}</span>
      <a :if="playHref" class="variant-play icon-label" :href="playHref"><Icon name="play" /> {{ t('host.play') }}</a>
    </div>
    <ul class="variant-files">
      <li :each="file, index in variant.files" :key="file.path || \`missing:\${index}\`" :class="file.path ? 'variant-file' : 'variant-file missing'">
        <span :if="!file.path">{{ file.label }}</span>
        <button :else class="btn-inline" @click="$emit('select-file', file.path)">{{ file.label }}</button>
        <span
          :if="file.path && validationOf(file)"
          :class="\`variant-validation-icon status-\${validationOf(file).status}\`"
          :title="\`\${validationOf(file).statusLabel} (\${validationOf(file).details})\`"
        >
          <Icon :if="validationOf(file).status === 'verified'" name="double-check" />
          <Icon :elseif="validationOf(file).status === 'structurally_valid'" name="check" />
          <Icon :elseif="validationOf(file).status === 'incomplete'" name="cross" />
        </span>
        <button
          :if="file.path && file.isConsolidated === false && canOrganize"
          class="tree-organize"
          @click.stop="$emit('organize', file.path)"
          :title="t('details.variants.consolidate')"
        >
          <Icon name="organize" />
        </button>
        <code class="variant-file-crc" title="CRC32">{{ file.crc }}</code>
        <span class="variant-file-size">{{ file.path ? formatSize(stats.get(file.path)?.size ?? 0) : t('details.variants.missingFile') }}</span>
      </li>
    </ul>
  </li>
</template>

<!-- A game: its cover, status, the variants on disk, and the others the catalogue knows. -->
<template name="GameView">
  <script :setup="{ game, cover = void 0, stats, canOrganize = false, mods = [], modActions = void 0 }">const [Icon, GameMods, { systemOf }, { t }, { isPlayGermade }, { playUrl }, { gameIdOf }] = await $importAll([
  "../components/Icon.html",
  "./GameMods.html",
  "../lib/RomLibraryService",
  "../lib/ui-state",
  "../lib/host",
  "../helpers/launcher",
  "../helpers/library-index"
]);
const STATUS_KEYS = {
  complete: "details.status.complete",
  partial: "details.status.partial",
  missing: "details.status.missing"
};
const hasFiles = (variant) => variant.files.some((file) => file.path);
$: present = game.variants.filter(hasFiles);
$: missing = game.variants.filter((variant) => !hasFiles(variant));
$: play = isPlayGermade ? (crc, patch) => crc ? playUrl({ system: systemOf(game.paths[0]), gameId: gameIdOf(game.title), crc, patch }) : void 0 : void 0;
$: versionCrcs = present.flatMap((variant) => variant.files.filter((file) => file.path).map((file) => ({ crc: file.crc })));
const organizeAll = () => $emit("organize", present[0].files.find((f) => f.path)?.path || game.paths[0]);
<\/script>
  <div class="rom-info game-info">
    <div class="rom-info-hero">
      <CoverFigure :cover="cover" :alt="game.title" :system="systemOf(game.paths[0])" />
      <div class="rom-info-heading">
        <h2>{{ game.title }}</h2>
        <p class="rom-info-system">{{ systemOf(game.paths[0]) || '—' }}</p>
        <div class="rom-info-tags">
          <span :class="\`tag status-\${game.status}\`">{{ t(STATUS_KEYS[game.status]) }}</span>
          <span :each="variant in present" :key="variant.key" class="tag">{{ variant.key }}</span>
        </div>
      </div>
    </div>

    <div class="variants-heading">
      <h3>{{ t('details.variants.title') }}</h3>
      <button :if="present.length > 0 && canOrganize" class="tree-organize" @click="organizeAll" :title="t('details.variants.consolidateAll')">
        <Icon name="organize" />
      </button>
    </div>

    <ul class="variants">
      <VariantRow
        :each="variant in present"
        :key="variant.key"
        :variant="variant"
        :stats="stats"
        :cover="cover"
        :can-organize="canOrganize"
        :play="play"
        @select-file="$emit('select-file', $event.detail)"
        @organize="$emit('organize', $event.detail)"
      />
    </ul>

    <details :if="missing.length > 0" class="variants-missing">
      <summary>{{ t('details.variants.more', { count: missing.length }) }}</summary>
      <ul class="variants">
        <VariantRow
          :each="variant in missing"
          :key="variant.key"
          :variant="variant"
          :stats="stats"
          :cover="cover"
          :can-organize="canOrganize"
          @select-file="$emit('select-file', $event.detail)"
          @organize="$emit('organize', $event.detail)"
        />
      </ul>
    </details>

    <GameMods :if="modActions" :game="game" :mods="mods" :versions="versionCrcs" :actions="modActions" :play="play" />
  </div>
</template>

<!-- Region and video standard for several records at once. Events: cancel. -->
<template name="RomBatchEditor">
  <script :setup="{ records = [], count = 0, onSave }">const [Icon, { ROM_REGIONS, VIDEO_STANDARDS }, { t }] = await $importAll([
  "../components/Icon.html",
  "../lib/ROMMetadataService",
  "../lib/ui-state"
]);
let region = "";
let videoStandard = "";
let saving = false;
let error = void 0;
const sharedValue = (field) => {
  const first = records[0]?.[field];
  if (typeof first !== "string") return void 0;
  return records.every((record) => record[field] === first) ? first : void 0;
};
$: currentRegion = sharedValue("region");
$: currentVideo = sharedValue("videoStandard");
const save = async () => {
  const changes = {};
  if (region) changes.region = region;
  if (videoStandard) changes.videoStandard = videoStandard;
  try {
    saving = true;
    error = void 0;
    await onSave(changes);
  } catch (err) {
    error = err instanceof Error ? err.message : t("details.batch.error");
    saving = false;
  }
};
<\/script>
  <div class="metadata-editor">
    <div class="metadata-header">
      <div>
        <h3>{{ t('details.batch.title', { count }) }}</h3>
        <p class="metadata-subtitle">{{ t('details.batch.subtitle') }}</p>
      </div>
    </div>

    <div :if="error" class="lookup-error">{{ error }}</div>

    <div class="form-group">
      <label>{{ t('editor.fields.region') }}</label>
      <select :value="region" @change="region = $event.target.value">
        <option value="">{{ t('details.batch.keep', { value: currentRegion || t('details.batch.mixed') }) }}</option>
        <option :each="value in ROM_REGIONS" :key="value" :value="value">{{ value }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>{{ t('editor.fields.videoStandard') }}</label>
      <select :value="videoStandard" @change="videoStandard = $event.target.value">
        <option value="">{{ t('details.batch.keep', { value: currentVideo || t('details.batch.mixed') }) }}</option>
        <option :each="value in VIDEO_STANDARDS" :key="value" :value="value">{{ value }}</option>
      </select>
    </div>

    <div class="editor-actions">
      <button class="btn-primary icon-label" @click="save" :disabled="saving || (!region && !videoStandard)">
        <Icon :if="!saving" name="save" /> {{ saving ? t('details.batch.saving') : t('details.batch.apply', { count }) }}
      </button>
      <button class="btn-cancel" @click="$emit('cancel')" :disabled="saving">{{ t('editor.cancel') }}</button>
    </div>
  </div>
</template>

<!-- Several files picked: which have records, and the way to edit them together. Events: edit. -->
<template name="RomSelectionView">
  <script :setup="{ paths = [], records }">const [Icon, { fileNameOf, systemOf }, { t }] = await $importAll(["../components/Icon.html", "../lib/RomLibraryService", "../lib/ui-state"]);
$: pending = paths.length - paths.filter((path) => records.get(path)).length;
<\/script>
  <div class="rom-selection">
    <div class="rom-file-header">
      <div>
        <h3>{{ t('details.selection.title', { count: paths.length }) }}</h3>
        <p class="metadata-subtitle">{{ pending === 0 ? t('details.selection.ready') : t('details.selection.pending', { count: pending }) }}</p>
      </div>
      <button
        class="btn-primary icon-label"
        @click="$emit('edit')"
        :disabled="pending > 0"
        :title="pending > 0 ? t('details.selection.gate') : t('details.selection.hint')"
      ><Icon name="pencil" /> {{ t('details.selection.edit', { count: paths.length }) }}</button>
    </div>
    <ul class="rom-selection-list">
      <li :each="path in paths" :key="path" :class="records.get(path) ? 'initialised' : 'pending'">
        <span class="rom-selection-name">{{ records.get(path)?.title || fileNameOf(path) }}</span>
        <span class="rom-selection-system">{{ systemOf(path) }}</span>
      </li>
    </ul>
  </div>
</template>
`,Ra={"../components/Icon.html":f,"./SystemDetails.html":Qn,"./MetadataEditor.html":ca,"../lib/RomLibraryService":V,"../lib/ui-state":h,"../helpers/rom-covers":ee,"../lib/ChecksumService":pe,"../helpers/format":ua,"../components/ConfirmModal.html":P,"../lib/ROMMetadataService":Ge,"../helpers/neogeo-validator":ya,"./GameMods.html":xa,"../lib/host":nt,"../helpers/launcher":Ca,"../helpers/library-index":H},Ia="views/RomDetails.html";let u;u=new m($a,{modules:Ra,filename:Ia});const Ea=u;u.CoverFigure;u.ChecksumRow;u.RomFileView;u.RomInfoView;u.VariantRow;u.GameView;u.RomBatchEditor;u.RomSelectionView;const Aa=["systems","games","game"];function La(t){const e=new URLSearchParams(t),n=e.get("system")||void 0,a=n&&e.get("game")||void 0;return{system:n,game:a}}function Na(t,e){const n=new URLSearchParams(t);n.delete("system"),n.delete("game"),e.system&&n.set("system",e.system),e.system&&e.game&&n.set("game",e.game);const a=n.toString();return a?`?${a}`:""}function Pa(t){return t.game?"game":t.system?"games":"systems"}const za=Object.freeze(Object.defineProperty({__proto__:null,PANELS:Aa,panelOf:Pa,readPanelState:La,writePanelState:Na},Symbol.toStringTag,{value:"Module"})),Da=`<!--
  The phone layout: three full-screen panels side by side — systems, the games of
  one, the game — navigated by swiping (CSS scroll snap) or by picking, which
  slides to the next panel. Back (the browser's, or Android's gesture) walks left
  again: every step is a history entry, \`?system=…&game=…\`.

  It holds no data of its own: the system folders come from the open node, the
  games from the same grouped rows the desktop tree uses, and the game panel is
  whatever the explorer puts in this component's slot (its details).

  Events: grouping-needed (path), pick-game (WizardGame | undefined).
-->
<script :setup="{ node, refreshToken = 0, knownSystems = [], groupedRows, regionOrder = [] }">const [Icon, SystemLogo, { PANELS, panelOf, readPanelState, writePanelState }, { getSystemInfo }, { pickCover }, { t }] = await $importAll([
  "../components/Icon.html",
  "../components/SystemLogo.html",
  "../helpers/mobile-panels",
  "../helpers/system-info",
  "../helpers/rom-covers",
  "../lib/ui-state"
]);
let state = readPanelState(location.search);
let systems = void 0;
let current = panelOf(readPanelState(location.search));
$: games = state.system ? (groupedRows.get(state.system) ?? []).filter((row) => row.kind === "group") : [];
$: game = state.game ? games.find((row) => row.id === state.game) : void 0;
const listSystems = (_token, known) => {
  const knownSet = new Set(known);
  node.list("").then((entries) => {
    systems = entries.filter((entry) => entry.kind === "directory" && knownSet.has(entry.name)).map((entry) => entry.name);
  }).catch(() => {
    systems = [];
  });
};
$: listSystems(refreshToken, knownSystems);
$: if (state.system && !groupedRows.has(state.system)) $emit("grouping-needed", state.system);
const reported = /* @__PURE__ */ (() => {
  let id;
  return { get: () => id, set: (next) => {
    id = next;
  } };
})();
$: {
  const id = game?.key;
  if (id !== reported.get()) {
    reported.set(id);
    $emit("pick-game", game);
  }
}
const panelElement = (panel) => $self(\`.mobile-panel[data-panel="\${panel}"]\`);
const scrollTo = (panel, smooth = true) => {
  const target = panelElement(panel);
  const box = $self(".mobile-panels");
  if (!target || !box) return;
  const reduced = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  box.scrollTo({ left: target.offsetLeft, behavior: smooth && !reduced ? "smooth" : "auto" });
};
const go = (next) => {
  history.pushState(null, "", \`\${location.pathname}\${writePanelState(location.search, next)}\`);
  state = next;
  requestAnimationFrame(() => scrollTo(panelOf(next)));
};
const pickSystem = (system) => go({ system });
const pickGame = (row) => go({ system: state.system, game: row.id });
const showPanel = (panel) => {
  if (PANELS.indexOf(panel) < PANELS.indexOf(panelOf(state))) {
    scrollTo(panel);
    current = panel;
    return;
  }
  scrollTo(panel);
};
$: title = current === "game" ? game?.title ?? t("mobile.game") : current === "games" ? state.system ? getSystemInfo(state.system)?.name ?? state.system : t("mobile.games") : t("mobile.systems");
const countOf = (system) => {
  const rows = groupedRows.get(system);
  return rows ? rows.filter((row) => row.kind === "group").length : void 0;
};
const systemLine = (system) => {
  const info = getSystemInfo(system);
  const count = countOf(system);
  return \`\${info ? \`\${info.manufacturer} \\xB7 \${info.releaseYear}\` : system}\${count !== void 0 ? \` \\xB7 \${t("mobile.gameCount", { count })}\` : ""}\`;
};
const gameLine = (row) => \`\${row.presentRegions.join(" \\xB7 ") || row.label} \\xB7 \${row.paths.length === 1 ? t("mobile.oneVersion") : t("mobile.versions", { count: row.paths.length })}\`;
const coverOf = (row) => pickCover(row.covers, { present: row.presentRegions, order: regionOrder });
const onPop = () => {
  const next = readPanelState(location.search);
  state = next;
  scrollTo(panelOf(next));
};
addEventListener("popstate", onPop);
$destroyed(() => removeEventListener("popstate", onPop));
await $mounted();
scrollTo(panelOf(state), false);
if (typeof IntersectionObserver !== "undefined") {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) current = entry.target.dataset.panel;
      }
    },
    { root: $self(".mobile-panels"), threshold: 0.6 }
  );
  for (const element of $$self(".mobile-panel")) observer.observe(element);
  $destroyed(() => observer.disconnect());
}
<\/script>

<div class="mobile-panels-wrap">
  <nav class="mobile-panels-bar" :aria-label="t('mobile.nav')">
    <button :if="current !== 'systems'" class="mobile-back" @click="showPanel(PANELS[PANELS.indexOf(current) - 1])" :title="t('details.back')">
      <Icon name="arrow-left" />
    </button>
    <h2 class="mobile-panels-title">{{ title }}</h2>
    <div class="mobile-dots" role="tablist">
      <button
        :each="panel in PANELS"
        :key="panel"
        role="tab"
        :class="\`mobile-dot \${panel === current ? 'on' : ''}\`"
        :aria-selected="panel === current ? 'true' : 'false'"
        :aria-label="t(\`mobile.\${panel}\`)"
        :disabled="PANELS.indexOf(panel) > PANELS.indexOf(panelOf(state))"
        @click="showPanel(panel)"
      ></button>
    </div>
  </nav>

  <div class="mobile-panels">
    <section class="mobile-panel" data-panel="systems">
      <p :if="systems === undefined" class="mobile-empty">{{ t('mobile.reading') }}</p>
      <p :elseif="systems.length === 0" class="mobile-empty">{{ t('mobile.noSystems') }}</p>
      <ul :else class="mobile-list">
        <li :each="system in systems" :key="system">
          <button :class="\`mobile-row \${state.system === system ? 'on' : ''}\`" @click="pickSystem(system)">
            <span class="mobile-row-logo"><SystemLogo :system-id="system" /></span>
            <span class="mobile-row-text">
              <strong>{{ getSystemInfo(system)?.name ?? system }}</strong>
              <small>{{ systemLine(system) }}</small>
            </span>
          </button>
        </li>
      </ul>
    </section>

    <section class="mobile-panel" data-panel="games">
      <p :if="!state.system" class="mobile-empty">{{ t('mobile.pickSystem') }}</p>
      <p :elseif="!groupedRows.has(state.system)" class="mobile-empty">{{ t('mobile.reading') }}</p>
      <p :elseif="games.length === 0" class="mobile-empty">{{ t('mobile.noGames') }}</p>
      <ul :else class="mobile-list">
        <li :each="row in games" :key="row.key">
          <button :class="\`mobile-row \${state.game === row.id ? 'on' : ''}\`" @click="pickGame(row)">
            <span class="mobile-row-cover">
              <img :if="coverOf(row)?.url" :src="coverOf(row).url" alt="" loading="lazy" />
              <span :else></span>
            </span>
            <span class="mobile-row-text">
              <strong>{{ row.title }}</strong>
              <small>{{ gameLine(row) }}</small>
            </span>
          </button>
        </li>
      </ul>
    </section>

    <section class="mobile-panel" data-panel="game">
      <slot :if="game"></slot>
      <p :else class="mobile-empty">{{ t('mobile.pickGame') }}</p>
    </section>
  </div>
</div>
`,Ba={"../components/Icon.html":f,"../components/SystemLogo.html":N,"../helpers/mobile-panels":za,"../helpers/system-info":K,"../helpers/rom-covers":ee,"../lib/ui-state":h},Ta="views/MobilePanels.html";let it;it=new m(Da,{modules:Ba,filename:Ta});const Fa=it;function le(){return globalThis.navigator?.storage??null}const Ga={async status(){const t=le(),e=await t?.estimate?.().catch(()=>{}),n=t?.persisted?await t.persisted().catch(()=>null):null;return{usage:typeof e?.usage=="number"?e.usage:null,quota:typeof e?.quota=="number"?e.quota:null,persistent:n}},async persist(){const t=le();return t?.persist?t.persisted&&await t.persisted().catch(()=>!1)?!0:t.persist().catch(()=>!1):!1}};function ja(t,e){const n=["B","KB","MB","GB","TB"];let a=t,i=0;for(;a>=1024&&i<n.length-1;)a/=1024,i++;const o=i===0||a>=100?0:1;return`${a.toLocaleString(e,{maximumFractionDigits:o})} ${n[i]}`}const ot=Object.freeze(Object.defineProperty({__proto__:null,LibraryStorageService:Ga,formatBytes:ja},Symbol.toStringTag,{value:"Module"})),Ua=`<!--
  Preferences: theme, language, region order and, with a library, its storage.

  Events: theme-mode-change (mode), locale-change (preference),
  region-order-change (order), close. \`canChangeRegions\` is false while no
  library or folder is open (the order is stored in its \`.meta\`).
-->
<script
  :setup="{ open = false, themeMode = &quot;auto&quot;, locale = &quot;auto&quot;, regionOrder = [], canChangeRegions = false, library = false }">const [Icon, { THEME_MODES }, { LOCALE_LABELS, LOCALE_PREFERENCES }, { LibraryStorageService, formatBytes }, { REGION_ORDERS, parseRegionOrder, regionOrderKey }, { t }] = await $importAll([
  "../components/Icon.html",
  "../helpers/theme",
  "../helpers/i18n",
  "../lib/LibraryStorageService",
  "../helpers/rom-regions",
  "../lib/ui-state"
]);
let storage = void 0;
const readStorage = (isOpen, hasLibrary) => {
  if (!isOpen || !hasLibrary) return;
  LibraryStorageService.status().then((status) => {
    storage = status;
  }).catch(() => {
    storage = void 0;
  });
};
const askPersistence = async () => {
  await LibraryStorageService.persist();
  storage = await LibraryStorageService.status();
};
const dialog = () => $self("dialog");
const sync = (isOpen) => {
  const element = dialog();
  if (!element) return;
  if (isOpen && !element.open) element.showModal();
  if (!isOpen && element.open) element.close();
};
const onBackdrop = (event) => {
  if (event.target === dialog()) dialog()?.close();
};
$: readStorage(open, library);
$: sync(open);
await $mounted();
sync(open);
<\/script>

<dialog class="modal-dialog" :aria-label="t('prefs.title')" @close="$emit('close')" @click="onBackdrop">
  <header class="modal-header">
    <h3>{{ t('prefs.title') }}</h3>
    <button class="modal-close" @click="dialog()?.close()" :title="t('prefs.close')">
      <Icon name="close" />
    </button>
  </header>

  <div class="modal-content">
    <section class="prefs-group">
      <h4>{{ t('prefs.theme.title') }}</h4>
      <div class="prefs-segmented" role="group" :aria-label="t('prefs.theme.title')">
        <button
          :each="mode in THEME_MODES"
          :key="mode"
          :class="\`prefs-segment \${mode === themeMode ? 'on' : ''}\`"
          :aria-pressed="mode === themeMode ? 'true' : 'false'"
          @click="$emit('theme-mode-change', mode)"
        >
          {{ t(\`prefs.theme.\${mode}\`) }}
        </button>
      </div>
      <p class="prefs-hint">{{ t('prefs.theme.hint') }}</p>
    </section>

    <section class="prefs-group">
      <h4>{{ t('prefs.locale.title') }}</h4>
      <div class="prefs-segmented" role="group" :aria-label="t('prefs.locale.title')">
        <button
          :each="preference in LOCALE_PREFERENCES"
          :key="preference"
          :class="\`prefs-segment \${preference === locale ? 'on' : ''}\`"
          :aria-pressed="preference === locale ? 'true' : 'false'"
          @click="$emit('locale-change', preference)"
        >
          {{ preference === 'auto' ? t('prefs.locale.auto') : LOCALE_LABELS[preference] }}
        </button>
      </div>
      <p class="prefs-hint">{{ t('prefs.locale.hint') }}</p>
    </section>

    <section class="prefs-group">
      <h4>{{ t('prefs.regions.title') }}</h4>
      <select
        class="prefs-select"
        :value="regionOrderKey(regionOrder)"
        :disabled="!canChangeRegions"
        @change="$emit('region-order-change', parseRegionOrder($event.target.value))"
      >
        <option :each="order in REGION_ORDERS" :key="regionOrderKey(order)" :value="regionOrderKey(order)">
          {{ regionOrderKey(order) }}
        </option>
      </select>
      <p class="prefs-hint">{{ canChangeRegions ? t('prefs.regions.hint') : t('prefs.regions.locked') }}</p>
    </section>

    <section :if="library" class="prefs-group">
      <h4>{{ t('prefs.storage.title') }}</h4>
      <div :if="storage?.usage != null && storage.quota != null" class="prefs-storage-meter" aria-hidden="true">
        <span :style="\`width: \${Math.min(100, (storage.usage / storage.quota) * 100)}%\`"></span>
      </div>
      <p :if="storage?.usage != null && storage.quota != null" class="prefs-hint">
        {{ t('prefs.storage.usage', { used: formatBytes(storage.usage), quota: formatBytes(storage.quota) }) }}
      </p>
      <p :else class="prefs-hint">{{ t('prefs.storage.unknown') }}</p>
      <p :if="storage?.persistent" class="prefs-hint">{{ t('prefs.storage.persistent') }}</p>
      <p :if="!storage?.persistent" class="prefs-hint">{{ t('prefs.storage.bestEffort') }}</p>
      <button :if="!storage?.persistent" class="prefs-segment" @click="askPersistence()">{{ t('prefs.storage.ask') }}</button>
    </section>
  </div>
</dialog>
`,qa={"../components/Icon.html":f,"../helpers/theme":Ht,"../helpers/i18n":wt,"../lib/LibraryStorageService":ot,"../helpers/rom-regions":fe,"../lib/ui-state":h},Va="views/PreferencesModal.html";let rt;rt=new m(Ua,{modules:qa,filename:Va});const Ha=rt,Wa=`<!--
  Files dropped on the details pane: images for the game on screen (what each
  is a picture of, and for which region), files the catalogue knows (taken as
  games, or copied as they are) and the rest, copied. Opens as it mounts.
  Events: confirm (DropDecision), cancel (closed by any means).
-->
<script :setup="{ files = [], target, intake = void 0, busy = void 0, error = void 0 }">const [Icon, { GLOBAL_SCOPE, isImageName, MEDIA_KINDS, MEDIA_SCOPES }, { itemsOf, offerOf, splitDrop }, { parentOf: folderOf }, { t }] = await $importAll([
  "../components/Icon.html",
  "../helpers/rom-media",
  "../lib/RomIntakeService",
  "../helpers/tree",
  "../lib/ui-state"
]);
const images = target.kind === "game" ? files.filter((file) => isImageName(file.name)) : [];
const rest = files.filter((file) => !images.includes(file));
const folder = target.kind === "game" ? target.folder : target.path;
const offers = new Map(
  rest.flatMap((file) => {
    const offer = intake && offerOf(file, intake);
    return offer ? [[file, offer]] : [];
  })
);
let choices = Object.fromEntries(
  images.map((file) => [file.name, { kind: "case", scope: GLOBAL_SCOPE }])
);
let taking = new Set([...offers].filter(([, offer]) => offer.pending.length > 0).map(([file]) => file));
const choiceOf = (file) => choices[file.name] ?? { kind: "case", scope: GLOBAL_SCOPE };
const update = (file, change) => {
  choices = { ...choices, [file.name]: { ...choiceOf(file), ...change } };
};
const take = (file, asGame) => {
  const next = new Set(taking);
  if (asGame) next.add(file);
  else next.delete(file);
  taking = next;
};
$: split = splitDrop(rest, taking, intake ?? []);
const confirm = () => $emit("confirm", {
  images: images.map((file) => ({ file, ...choiceOf(file) })),
  files: split.copied,
  intake: split.intake
});
$: destination = (target.kind === "game" ? target.folder : target.path) || t("drop.root");
const copiedTo = (file) => folder ? \`\${folder}/\${file.name}\` : file.name;
const whereOf = (file, offer) => {
  if (!taking.has(file)) return copiedTo(file);
  const along = offer.pending.length - 1;
  return along > 0 ? t("drop.andMore", { path: offer.path, count: along }) : offer.path;
};
$: hint = offers.size > 0 ? t("drop.hint.intake", { folder: destination }) : t("drop.hint.plain", { folder: destination });
const alongOf = (file) => itemsOf(file, split.along)[0];
const dialog = () => $self("dialog");
const dismiss = () => dialog()?.close();
const onBackdrop = (event) => {
  if (event.target === dialog() && !busy) dismiss();
};
await $mounted();
if (!dialog()?.open) dialog()?.showModal();
<\/script>

<dialog class="modal-dialog drop-dialog" :aria-label="t('drop.label')" @close="$emit('cancel')" @click="onBackdrop">
  <header class="modal-header">
    <h3>{{ target.kind === 'game' ? t('drop.toGame', { title: target.title }) : t('drop.toFolder', { folder: target.path || t('drop.root') }) }}</h3>
    <button class="modal-close" @click="dismiss" :disabled="Boolean(busy)">
      <Icon name="close" />
    </button>
  </header>

  <div class="modal-content">
    <div :if="error" class="lookup-error">{{ error }}</div>

    <section :if="images.length > 0" class="prefs-group">
      <h4>{{ images.length > 1 ? t('drop.images.many') : t('drop.images.one') }}</h4>
      <ul class="drop-images">
        <li :each="file in images" :key="file.name" class="drop-image">
          <span class="drop-image-name" :title="file.name">{{ file.name }}</span>
          <select class="prefs-select" :value="choiceOf(file).kind" :disabled="Boolean(busy)" @change="update(file, { kind: $event.target.value })">
            <option :each="kind in MEDIA_KINDS" :key="kind" :value="kind">{{ t(\`media.kind.\${kind}\`) }}</option>
          </select>
          <select class="prefs-select" :value="choiceOf(file).scope" :disabled="Boolean(busy)" @change="update(file, { scope: $event.target.value })">
            <option :each="scope in MEDIA_SCOPES" :key="scope" :value="scope">{{ scope === GLOBAL_SCOPE ? t('media.scope.global') : scope }}</option>
          </select>
        </li>
      </ul>
      <p class="prefs-hint">{{ t('drop.images.hint') }}</p>
    </section>

    <section :if="rest.length > 0" class="prefs-group">
      <h4>{{ rest.length > 1 ? t('drop.files.many') : t('drop.files.one') }}</h4>
      <ul class="drop-files">
        <li :each="file, at in rest" :key="\`\${at}:\${file.name}\`" :class="offers.get(file) || alongOf(file) ? 'drop-file' : undefined">
          <span :if="!offers.get(file) && !alongOf(file)">{{ file.name }}</span>
          <span :else class="drop-file-name" :title="file.name">{{ file.name }}</span>

          <span :if="!offers.get(file) && alongOf(file)" class="drop-file-note">{{ t('drop.alongGame') }}</span>
          <span :if="!offers.get(file) && alongOf(file)" class="drop-file-where" :title="alongOf(file).path">{{ alongOf(file).path }}</span>

          <select
            :if="offers.get(file) && offers.get(file).pending.length > 0"
            class="prefs-select"
            :value="taking.has(file) ? 'game' : 'copy'"
            :disabled="Boolean(busy)"
            @change="take(file, $event.target.value === 'game')"
          >
            <option value="game">{{ t('drop.asGame', { title: offers.get(file).match.title }) }}</option>
            <option value="copy">{{ t('drop.asIs') }}</option>
          </select>
          <span :elseif="offers.get(file)" class="drop-file-note">
            {{ t('drop.already', { title: offers.get(file).match.title, folder: folderOf(offers.get(file).path) || t('drop.root') }) }}
          </span>
          <span :if="offers.get(file)" class="drop-file-where" :title="whereOf(file, offers.get(file))">{{ whereOf(file, offers.get(file)) }}</span>
        </li>
      </ul>
      <p class="prefs-hint">{{ hint }}</p>
    </section>
  </div>

  <div class="modal-actions">
    <button class="btn-cancel" @click="dismiss" :disabled="Boolean(busy)">{{ t('drop.cancel') }}</button>
    <button class="btn-apply" @click="confirm" :disabled="Boolean(busy)">
      {{ busy ?? (files.length > 1 ? t('drop.confirmMany', { count: files.length }) : t('drop.confirm')) }}
    </button>
  </div>
</dialog>
`,Ka={"../components/Icon.html":f,"../helpers/rom-media":J,"../lib/RomIntakeService":W,"../helpers/tree":Be,"../lib/ui-state":h},Ya="views/MediaDropModal.html";let st;st=new m(Wa,{modules:Ka,filename:Ya});const Xa=st,Za=`<!--
  What a batch of dropped or picked files is about to become: the games the
  catalogue named, their companions, the files nothing claimed, and what could
  not be read. Opens as it mounts. Events: confirm, cancel (closed by any means).
-->
<script :setup="{ items = [], busy = void 0, error = void 0 }">const [Icon, { isPlaced }, { t }] = await $importAll([
  "../components/Icon.html",
  "../lib/RomIntakeService",
  "../lib/ui-state"
]);
const REFUSAL_KEYS = {
  zip64: "intake.refused.zip64",
  encrypted: "intake.refused.encrypted",
  method: "intake.refused.method",
  damaged: "intake.refused.damaged"
};
$: games = items.filter((item) => item.match && !item.refused);
$: companions = items.filter((item) => !item.match && item.path && !item.refused);
$: strays = items.filter((item) => !item.path && !item.refused);
$: refused = items.filter((item) => item.refused);
$: adding = items.filter(isPlaced).length;
$: systems = [...new Set(games.map((item) => item.match.system))];
const dialog = () => $self("dialog");
const dismiss = () => dialog()?.close();
const onBackdrop = (event) => {
  if (event.target === dialog() && !busy) dismiss();
};
await $mounted();
if (!dialog()?.open) dialog()?.showModal();
<\/script>

<dialog class="modal-dialog drop-dialog" :aria-label="t('intake.label')" @close="$emit('cancel')" @click="onBackdrop">
  <header class="modal-header">
    <h3>{{ systems.length === 1 ? t('intake.toSystem', { system: systems[0] }) : t('intake.toLibrary') }}</h3>
    <button class="modal-close" @click="dismiss" :disabled="Boolean(busy)">
      <Icon name="close" />
    </button>
  </header>

  <div class="modal-content">
    <div :if="error" class="lookup-error">{{ error }}</div>

    <section :if="games.length > 0" class="prefs-group">
      <h4>{{ games.length > 1 ? t('intake.games.many', { count: games.length }) : t('intake.games.one') }}</h4>
      <ul class="intake-list">
        <li :each="item, at in games" :key="\`\${at}:\${item.name}\`" :class="\`intake-item \${item.taken ? 'taken' : ''}\`">
          <span class="intake-title">{{ item.match.title }}</span>
          <span class="intake-where">{{ item.match.system }} · {{ item.match.variant }}<span :if="item.archive" class="intake-archive">{{ t('intake.from', { archive: item.archive }) }}</span></span>
          <span class="intake-path" :title="item.path">{{ item.taken ? t('intake.taken', { path: item.path ?? '' }) : item.path }}</span>
        </li>
      </ul>
      <p class="prefs-hint">{{ t('intake.games.hint') }}</p>
    </section>

    <section :if="companions.length > 0" class="prefs-group">
      <h4>{{ companions.length > 1 ? t('intake.companions.many') : t('intake.companions.one') }}</h4>
      <ul class="drop-files">
        <li :each="item, at in companions" :key="\`\${at}:\${item.name}\`" :class="item.taken ? 'taken' : ''">
          {{ item.taken ? t('intake.companions.already', { name: item.name }) : item.name }}
        </li>
      </ul>
      <p class="prefs-hint">{{ t('intake.companions.hint') }}</p>
    </section>

    <section :if="strays.length > 0" class="prefs-group">
      <h4>{{ t('intake.strays.title') }}</h4>
      <ul class="drop-files">
        <li :each="item, at in strays" :key="\`\${at}:\${item.name}\`">{{ item.name }}<small :if="item.archive" class="intake-archive">{{ t('intake.from', { archive: item.archive }) }}</small></li>
      </ul>
      <p class="prefs-hint">{{ t('intake.strays.hint') }}</p>
    </section>

    <section :if="refused.length > 0" class="prefs-group">
      <h4>{{ t('intake.refused.title') }}</h4>
      <ul class="drop-files">
        <li :each="item, at in refused" :key="\`\${at}:\${item.name}\`">{{ item.name }} — {{ t(REFUSAL_KEYS[item.refused]) }}</li>
      </ul>
    </section>
  </div>

  <div class="modal-actions">
    <button class="btn-cancel" @click="dismiss" :disabled="Boolean(busy)">{{ t('intake.cancel') }}</button>
    <button class="btn-apply" @click="$emit('confirm')" :disabled="Boolean(busy) || adding === 0">
      {{ busy ?? (adding > 1 ? t('intake.confirmMany', { count: adding }) : t('intake.confirm')) }}
    </button>
  </div>
</dialog>
`,Ja={"../components/Icon.html":f,"../lib/RomIntakeService":W,"../lib/ui-state":h},Qa="views/RomIntakeModal.html";let lt;lt=new m(Za,{modules:Ja,filename:Qa});const ei=lt,ti=`<!--
  The plan to rename and sort a system folder to match the catalogue, before and
  after it is applied. Events: confirm, undo, close.
-->
<script :setup="{ system = &quot;&quot;, plan, applied = void 0, busy = void 0 }">const [Icon, { t }] = await $importAll(["../components/Icon.html", "../lib/ui-state"]);
const PREVIEW_LIMIT = 200;
const shorten = (items) => items.slice(0, PREVIEW_LIMIT);
$: hidden = plan.moves.length - PREVIEW_LIMIT;
const reasonOf = (reason) => reason === "duplicate-target" ? t("organize.reason.duplicateTarget") : reason === "target-taken" ? t("organize.reason.targetTaken") : t("organize.reason.swap");
<\/script>

<div class="organize-backdrop" @click="busy ? undefined : $emit('close')">
  <div class="organize-panel" @click.stop="">
    <header class="organize-header">
      <h2>{{ applied ? t('organize.done', { system }) : t('organize.title', { system }) }}</h2>
      <button class="organize-close" @click="$emit('close')" :disabled="Boolean(busy)">
        <Icon name="close" />
      </button>
    </header>

    <div class="organize-summary">
      <span><strong>{{ plan.moves.length }}</strong> {{ t('organize.moving') }}</span>
      <span><strong>{{ plan.settled }}</strong> {{ t('organize.settled') }}</span>
      <span :if="plan.markers.length > 0"><strong>{{ plan.markers.length }}</strong> {{ t('organize.markers') }}</span>
      <span :if="plan.conflicts.length > 0" class="organize-warn"><strong>{{ plan.conflicts.length }}</strong> {{ t('organize.conflicts') }}</span>
    </div>

    <div :if="busy" class="organize-busy">{{ busy }}</div>

    <div class="organize-body">
      <section :if="plan.conflicts.length > 0">
        <h3>{{ t('organize.untouched') }}</h3>
        <ul class="organize-list">
          <li :each="conflict in shorten(plan.conflicts)" :key="conflict.from" class="organize-conflict">
            <code>{{ conflict.from }}</code>
            <small>{{ reasonOf(conflict.reason) }}</small>
          </li>
        </ul>
      </section>

      <section :if="plan.moves.length > 0">
        <h3>{{ applied ? t('organize.moved') : t('organize.willMove') }}</h3>
        <ul class="organize-list">
          <li :each="move in shorten(plan.moves)" :key="move.from">
            <code>{{ move.from }}</code>
            <span class="organize-arrow"><Icon name="arrow-right" /></span>
            <code>{{ move.to }}</code>
          </li>
        </ul>
        <p :if="hidden > 0" class="organize-more">{{ t('organize.more', { count: hidden }) }}</p>
      </section>

      <p :if="plan.moves.length === 0 && plan.conflicts.length === 0" class="organize-empty">{{ t('organize.settledAll') }}</p>
    </div>

    <footer :if="applied" class="organize-actions">
      <button @click="$emit('undo')" :disabled="Boolean(busy)">{{ t('organize.undo') }}</button>
      <button class="primary" @click="$emit('close')" :disabled="Boolean(busy)">{{ t('organize.close') }}</button>
    </footer>
    <footer :else class="organize-actions">
      <button @click="$emit('close')" :disabled="Boolean(busy)">{{ t('organize.cancel') }}</button>
      <button
        class="primary danger"
        @click="$emit('confirm')"
        :disabled="Boolean(busy) || plan.moves.length + plan.markers.length === 0"
      >{{ t('organize.confirm', { count: plan.moves.length }) }}</button>
    </footer>
  </div>
</div>
`,ni={"../components/Icon.html":f,"../lib/ui-state":h},ai="views/OrganizePanel.html";let ct;ct=new m(ti,{modules:ni,filename:ai});const ii=ct,oi=8*1024*1024;function R(t,e){return t?`${b}/${t}/${e}`:`${b}/${e}`}class ri{static listings=new WeakMap;static async entriesOf(e,n){const a=this.listings.get(e)??new Map;this.listings.set(e,a);const i=a.get(n);if(i)return i;const o=e.list(n?`${b}/${n}`:b).catch(()=>[]);return a.set(n,o),o}static forget(e,n){this.listings.get(e)?.delete(n)}static async storedCovers(e,n,a){const i={byRegion:{}};for(const o of await this.entriesOf(e,n)){const r=qe(o.name);!r||r.kind!==z||r.gameId!==a||(r.region?i.byRegion[r.region]=o.name:i.game=o.name)}return i}static async stored(e,n,a,i){for(const o of Ye(a,i))try{const r=await e.readFile(R(n,o));return URL.createObjectURL(new Blob([r]))}catch{}}static async save(e,n,a,i,o){const r=D(a,i);return await e.createDirectory(`${b}/${n}`),await e.writeFile(R(n,r),o),this.forget(e,n),r}static async download(e,n=1){try{const a=await fetch(e);if(!a.ok)return;const i=await a.blob();if(i.size===0||i.size>oi)return;if(i.size<=Ze&&!i.type.startsWith("image/")){const o=Je(await i.text(),e);if(o)return n>0?this.download(o,n-1):void 0}return new Uint8Array(await i.arrayBuffer())}catch{return}}static async cache(e,n,a,i,o=!1){return i.url?await this.write(e,n,[M(a,i)],i.url,o)>0:!!i.file}static async write(e,n,a,i,o=!1){const r=[];for(const d of a)(o||!await e.exists(R(n,d)))&&r.push(d);if(r.length===0)return a.length;const s=await this.download(i);if(!s)return a.length-r.length;await e.createDirectory(`${b}/${n}`);for(const d of r)await e.writeFile(R(n,d),s);return this.forget(e,n),a.length}static async cacheAll(e,n,a,i){const o=new Map;for(const s of Xe(i)){const d=o.get(s.url)??[];d.push(s),o.set(s.url,d)}return(await Promise.all(Array.from(o,([s,d])=>this.write(e,n,d.map(c=>M(a,c)),s,!0)))).reduce((s,d)=>s+d,0)}static async resolve(e,n,a,i){if(!i)return;const o=await this.stored(e,n,a,i);if(o)return{url:o,stored:!0};if(i.url){if(await this.cache(e,n,a,i)){const r=await this.stored(e,n,a,i);if(r)return{url:r,stored:!0}}return{url:i.url,stored:!1}}}}const si=Object.freeze(Object.defineProperty({__proto__:null,CoverService:ri},Symbol.toStringTag,{value:"Module"})),li="rom-manager-handles",ci=1,A="handles";function I(){return new Promise((t,e)=>{const n=indexedDB.open(li,ci);n.onupgradeneeded=()=>{const a=n.result;a.objectStoreNames.contains(A)||a.createObjectStore(A,{keyPath:"id"})},n.onsuccess=()=>t(n.result),n.onerror=()=>e(n.error)})}function E(t,e){return t.transaction(A,e).objectStore(A)}class di{static async save(e){const n=await I();try{await new Promise((a,i)=>{const o=E(n,"readwrite").put(e);o.onsuccess=()=>a(),o.onerror=()=>i(o.error)})}finally{n.close()}}static async remove(e){const n=await I();try{await new Promise((a,i)=>{const o=E(n,"readwrite").delete(e);o.onsuccess=()=>a(),o.onerror=()=>i(o.error)})}finally{n.close()}}static async loadAll(){const e=await I();try{return await new Promise((n,a)=>{const i=E(e,"readonly").getAll();i.onsuccess=()=>n(i.result),i.onerror=()=>a(i.error)})}finally{e.close()}}static async clear(){const e=await I();try{await new Promise((n,a)=>{const i=E(e,"readwrite").clear();i.onsuccess=()=>n(),i.onerror=()=>a(i.error)})}finally{e.close()}}}const mi=Object.freeze(Object.defineProperty({__proto__:null,HandleStoreService:di},Symbol.toStringTag,{value:"Module"}));function fi(t){return t.slice(t.lastIndexOf("/")+1)}function hi(t,e){const n=[];for(let a=t.lastIndexOf("/");a>e.length;a=t.lastIndexOf("/",a-1))n.push(t.slice(0,a));return n}function pi(t){return t.fileName??t.name}function gi(t,e,n,a=new Map,i="cartridge"){const o=t?`${t}/`:"",r=[],s=new Set,d=new Set;for(const c of n.groups){if(c.status==="missing")continue;const v=c.group.id,y=[],w=[],te=new Set,ne=new Set;for(const p of c.variants){const ae=p.files.map(k=>{const g=k.local?.path,ie=k.entry.crc;if(g===void 0||!g.startsWith(o))return{label:pi(k.entry),crc:ie};w.push(g);for(const B of p.variant.regions)te.add(B);s.add(g);for(const B of hi(g,t))d.add(B);const ft=g.includes("/")?g.slice(0,g.indexOf("/")):"",ht=k.entry.fileName??k.entry.name,pt=bt(ft,i,c.group,p.variant,ht),gt=g===pt;return{label:fi(g),path:g,crc:ie,isConsolidated:gt}});ae.some(k=>k.path)&&ne.add(p.variant.key),y.push({key:p.variant.key,status:p.status,regions:p.variant.regions,videoStandards:p.variant.videoStandards,files:ae,cover:Q(p.variant)})}w.length!==0&&r.push({kind:"group",key:`group:${v}`,id:v,label:v,title:c.group.title,status:c.status,variants:y,paths:w,covers:Ke(c.group,a.get(We(c.group)),ne),presentRegions:he.filter(p=>te.has(p))})}for(const c of e)(c.kind==="file"?s.has(c.path):d.has(c.path))||r.push({kind:"entry",key:c.path,label:c.name,entry:c});return r}const ui=Object.freeze(Object.defineProperty({__proto__:null,buildWizardTree:gi},Symbol.toStringTag,{value:"Module"})),vi=`<!--
  The explorer: the open origins (the library and any folders), the tree and the
  details pane — or, on a phone, the swiped panels — and every dialog they open.

  State that outlives a tab (origins, the active one, its selection, errors, the
  known systems, the grouping settings) is the services' (\`ui\` in ../state);
  what is on screen for the open tab is kept here.
-->
<script :setup>const [
  Header,
  WelcomePanel,
  FileTree,
  RomDetails,
  MobilePanels,
  PreferencesModal,
  MediaDropModal,
  RomIntakeModal,
  OrganizePanel,
  ConfirmModal,
  { storageService, LIBRARY_ORIGIN_ID, canOpenFolders, isLibraryAvailable },
  { LibraryStorageService },
  { RomLibrary, gameNameOf, systemOf },
  { GameCatalogService },
  { CoverService },
  { OrganizeService },
  { RomIntakeService, isPlaced },
  { ROMDatasetService },
  { isWizardFolder, WizardConfigService },
  { setThemeMode },
  { setLocalePreference },
  { HandleStoreService },
  { buildWizardTree },
  { isSharedCover, pickCover },
  { imageExtensionOf, isImageName, regionOfScope },
  { filterPlanForPath },
  { storeService },
  { ui, t },
  { LibraryIndexService },
  { ModService },
  { gameIdOf },
  { isPatchName },
  { isPlayGermade, LAUNCHER_BASE },
  { PlayGermadeMigration }
] = await $importAll([
  "./Header.html",
  "./WelcomePanel.html",
  "./FileTree.html",
  "./RomDetails.html",
  "./MobilePanels.html",
  "./PreferencesModal.html",
  "./MediaDropModal.html",
  "./RomIntakeModal.html",
  "./OrganizePanel.html",
  "../components/ConfirmModal.html",
  "../lib/StorageService",
  "../lib/LibraryStorageService",
  "../lib/RomLibraryService",
  "../lib/GameCatalogService",
  "../lib/CoverService",
  "../lib/OrganizeService",
  "../lib/RomIntakeService",
  "../lib/ROMDatasetService",
  "../lib/WizardConfigService",
  "../lib/ThemeService",
  "../lib/I18nService",
  "../lib/HandleStoreService",
  "../helpers/wizard-tree",
  "../helpers/rom-covers",
  "../helpers/rom-media",
  "../helpers/rom-organize",
  "../lib/StoreService",
  "../lib/ui-state",
  "../lib/LibraryIndexService",
  "../lib/ModService",
  "../helpers/library-index",
  "../helpers/patch",
  "../lib/host",
  "../lib/PlayGermadeMigration"
]);
const gameKey = (romPath) => \`\${systemOf(romPath)}/\${gameNameOf(romPath)}\`;
const systemFolderOf = (path) => {
  const separator = path.indexOf("/");
  return separator === -1 ? path : path.slice(0, separator);
};
const parentOf = (path) => {
  const separator = path.lastIndexOf("/");
  return separator === -1 ? "" : path.slice(0, separator);
};
const regionsOfFile = (game2, path) => path ? game2.variants.find((variant) => variant.files.some((file) => file.path === path))?.regions : void 0;
const isFileDrag = (event) => Array.from(event.dataTransfer?.types ?? []).includes("Files");
const intakeNotice = ({ file, read, size, done, total }) => {
  const percent = size > 0 ? Math.min(100, Math.round(read / size * 100)) : 100;
  return total > 1 ? t("progress.identifyingFileOf", { file, percent, done: done + 1, total }) : t("progress.identifyingFile", { file, percent });
};
const identifyingNotice = (files) => files.length > 1 ? t("progress.identifyingMany", { count: files.length }) : t("progress.identifying", { file: files[0].name });
class Book {
  /** Systems whose library folder has already been listed. */
  indexedSystems = /* @__PURE__ */ new Set();
  /** Folders whose grouped rows are already being worked out. */
  grouping = /* @__PURE__ */ new Set();
  /** Object URLs minted for local covers, revoked when they are replaced. */
  objectUrls = [];
  /** Persisted handles restored from IndexedDB on startup. */
  restoredHandles = /* @__PURE__ */ new Map();
  /** Where the next pick goes: the library from the welcome panel, else the open tab. */
  pickTarget = "active";
  /** Mods picked together with ROMs: taken once the ROMs are in (or the intake is dropped). */
  pendingMods = void 0;
}
const book = new Book();
let storageNodes = /* @__PURE__ */ new Map();
let records = /* @__PURE__ */ new Map();
let stats = /* @__PURE__ */ new Map();
let coverUrls = /* @__PURE__ */ new Map();
let initialised = /* @__PURE__ */ new Set();
let groupedRows = /* @__PURE__ */ new Map();
let notice = void 0;
let editing = false;
let game = void 0;
let gameFile = void 0;
let folder = void 0;
let gameCover = void 0;
let drop = void 0;
let dropBusy = void 0;
let dropError = void 0;
let dropping = false;
let intake = void 0;
let intakeBusy = void 0;
let intakeError = void 0;
let mediaVersion = 0;
let gameMods = void 0;
let modsVersion = 0;
let refreshToken = 0;
let organize = void 0;
let organizeBusy = void 0;
let preferences = false;
let showLanding = true;
let syncAsk = false;
let syncBusy = false;
const libraryAvailable = isLibraryAvailable();
const foldersAvailable = canOpenFolders();
const PHONE_QUERY = "(max-width: 768px), (max-height: 500px) and (pointer: coarse)";
let phone = globalThis.matchMedia?.(PHONE_QUERY).matches ?? false;
const phoneList = globalThis.matchMedia?.(PHONE_QUERY);
const onPhoneChange = () => {
  phone = phoneList?.matches ?? false;
};
phoneList?.addEventListener("change", onPhoneChange);
$destroyed(() => phoneList?.removeEventListener("change", onPhoneChange));
$: activeOrigin = ui.activeOriginId ? ui.origins.find((origin) => origin.id === ui.activeOriginId) : void 0;
$: activeNode = ui.activeOriginId ? storageNodes.get(ui.activeOriginId) : void 0;
$: selection = activeOrigin?.selection || [];
$: knownSet = new Set(ui.knownSystems);
$: regionOrder = ui.wizardSettings.regionOrder;
$: hasLibrary = storageNodes.has(LIBRARY_ORIGIN_ID);
$destroyed(() => {
  for (const url of book.objectUrls) URL.revokeObjectURL(url);
});
const readWizardSettings = (node) => {
  if (!node) return;
  queueMicrotask(() => {
    WizardConfigService.read(node).then((settings) => storeService.setWizardSettings(settings)).catch(() => void 0);
  });
};
$: readWizardSettings(activeNode);
const showCover = /* @__PURE__ */ (() => {
  let token = 0;
  let shown;
  const revoke = (url) => {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  };
  return (node, picked, file, order, _version) => {
    const mine = ++token;
    revoke(shown);
    shown = void 0;
    gameCover = void 0;
    if (!node || !picked) return;
    queueMicrotask(async () => {
      try {
        const system = systemOf(picked.paths[0]);
        const stored = await CoverService.storedCovers(node, system, picked.id).catch(() => void 0);
        const selectedVariant = file ? picked.variants.find((v) => v.files.some((f) => f.path === file)) : void 0;
        const cover = pickCover(picked.covers, {
          present: regionsOfFile(picked, file) ?? picked.presentRegions,
          order,
          stored,
          variantUrl: selectedVariant?.cover,
          variantRegion: selectedVariant?.regions[0]
        });
        const resolved = await CoverService.resolve(node, system, picked.id, cover);
        if (mine !== token) {
          revoke(resolved?.url);
          return;
        }
        shown = resolved?.url;
        const region = cover && !isSharedCover(picked.covers, cover) ? cover.region : void 0;
        gameCover = resolved ? { url: resolved.url, publishedUrl: cover?.url, region } : void 0;
      } catch {
        if (mine === token) gameCover = void 0;
      }
    });
  };
})();
$: showCover(activeNode, game, gameFile, regionOrder, mediaVersion);
const cacheCovers = (node, picked, known) => {
  if (!node || !picked) return;
  if (!picked.paths.some((path) => known.get(path))) return;
  queueMicrotask(() => void CoverService.cacheAll(node, systemOf(picked.paths[0]), picked.id, picked.covers));
};
$: cacheCovers(activeNode, game, records);
const releaseCovers = () => {
  for (const url of book.objectUrls) URL.revokeObjectURL(url);
  book.objectUrls = [];
};
const loadSelection = async (node, paths) => {
  const lib = new RomLibrary(node);
  const loaded = await lib.readMany(paths);
  const statEntries = await Promise.all(paths.map(async (path) => [path, await node.stat(path)]));
  releaseCovers();
  const coverEntries = await Promise.all(
    paths.map(async (path) => {
      const url = await lib.coverUrl(path, loaded.get(path)?.cover);
      if (url?.startsWith("blob:")) book.objectUrls.push(url);
      return [path, url];
    })
  );
  $batch(() => {
    records = loaded;
    stats = new Map(statEntries);
    coverUrls = new Map(coverEntries.filter((entry) => Boolean(entry[1])));
  });
};
const openFolder = async () => {
  try {
    storeService.setLoading(true);
    storeService.setError(void 0);
    const node = storageService.createNodeInstance();
    const opened = await node.initialize();
    if (!opened) return;
    showLanding = false;
    const path = node.getPath();
    const name = path?.split("/").pop() || "Folder";
    const originId = \`origin-\${Date.now()}\`;
    storageNodes = new Map(storageNodes).set(originId, node);
    storeService.addOrigin({ id: originId, name, path, selection: [], kind: "folder" });
    const handle = node.getHandle();
    if (handle) HandleStoreService.save({ id: originId, name, handle }).catch(() => void 0);
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.openFolder"));
  } finally {
    storeService.setLoading(false);
  }
};
const selectOrigin = async (originId) => {
  showLanding = false;
  const origin = ui.origins.find((candidate) => candidate.id === originId);
  if (origin?.locked) {
    const savedHandle = book.restoredHandles.get(originId);
    if (savedHandle) {
      try {
        storeService.setLoading(true);
        storeService.setError(void 0);
        const node = storageService.createNodeInstance();
        const authorized = await node.initializeFromHandle(savedHandle);
        if (!authorized) {
          storeService.setError(t("errors.deniedFolder"));
          return;
        }
        storageNodes = new Map(storageNodes).set(originId, node);
        storeService.addOrigin({ ...origin, locked: false });
      } catch (err) {
        storeService.setError(err instanceof Error ? err.message : t("errors.savedFolder"));
        return;
      } finally {
        storeService.setLoading(false);
      }
    }
  }
  book.indexedSystems = /* @__PURE__ */ new Set();
  book.grouping = /* @__PURE__ */ new Set();
  $batch(() => {
    initialised = /* @__PURE__ */ new Set();
    groupedRows = /* @__PURE__ */ new Map();
    editing = false;
    game = void 0;
    gameFile = void 0;
    storeService.setActiveOrigin(originId);
  });
};
const canGroup = (path) => knownSet.has(systemFolderOf(path));
const isGrouped = (path) => isWizardFolder(path, ui.wizardSettings, knownSet);
const groupingNeeded = async (path) => {
  const node = activeNode;
  if (!node || book.grouping.has(path)) return;
  book.grouping.add(path);
  try {
    storeService.setError(void 0);
    const system = systemFolderOf(path);
    const [match, systemCovers, entries, medium] = await Promise.all([
      GameCatalogService.load(node, system, (progress) => {
        notice = t("progress.reading", { path, done: progress.done, total: progress.total });
      }),
      GameCatalogService.coversOf(system),
      node.list(path),
      ROMDatasetService.mediaOf(system).catch(() => "cartridge")
    ]);
    groupedRows = new Map(groupedRows).set(path, buildWizardTree(path, entries, match, systemCovers, medium ?? "cartridge"));
    void LibraryIndexService.write(node, system, match).catch(() => {
    });
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.group", { path }));
  } finally {
    notice = void 0;
  }
};
const toggleGrouping = async (path) => {
  const node = activeNode;
  if (!node) return;
  const systems = storeService.getKnownSystems();
  const grouped = isWizardFolder(path, storeService.getWizardSettings(), systems);
  try {
    storeService.setWizardSettings(await WizardConfigService.setWizard(node, path, !grouped, systems));
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.viewMode"));
    return;
  }
  book.grouping.delete(path);
  const next = new Map(groupedRows);
  next.delete(path);
  groupedRows = next;
};
const changeRegionOrder = async (order) => {
  const node = activeNode;
  if (!node) return;
  try {
    storeService.setWizardSettings(await WizardConfigService.setRegionOrder(node, order));
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.regionOrder"));
  }
};
const invalidateTree = () => {
  book.grouping.clear();
  $batch(() => {
    groupedRows = /* @__PURE__ */ new Map();
    records = /* @__PURE__ */ new Map();
    stats = /* @__PURE__ */ new Map();
    refreshToken += 1;
  });
};
const reindex = (() => {
  let chain = Promise.resolve();
  return (paths, node = activeNode) => {
    if (!node) return;
    const systems = paths.map(systemFolderOf).filter(Boolean);
    if (systems.length === 0) return;
    chain = chain.then(() => LibraryIndexService.refreshMany(node, systems)).catch(() => {
    });
  };
})();
const reindexAll = (node) => {
  if (!node) return;
  void LibraryIndexService.readAll(node).then((indexes) => reindex(indexes.map((index) => index.system), node));
};
const loadMods = /* @__PURE__ */ (() => {
  let token = 0;
  return (node, picked, _version) => {
    const mine = ++token;
    if (!node || !picked) {
      gameMods = void 0;
      return;
    }
    const system = systemOf(picked.paths[0]);
    queueMicrotask(async () => {
      const mods = await ModService.list(node, system).catch(() => []);
      if (mine === token) gameMods = { system, mods };
    });
  };
})();
$: loadMods(activeNode, game, modsVersion);
const modContext = () => {
  if (game) return { system: systemOf(game.paths[0]), gameId: gameIdOf(game.title) };
  const place = folder ?? (selection.length === 1 ? selection[0] : void 0);
  const system = place ? systemFolderOf(place) : void 0;
  return system && knownSet.has(system) ? { system } : {};
};
const modsNotice = (result) => {
  const parts = [];
  const assigned = result.added.filter((added) => added.gameId).length;
  if (result.added.length > 0) parts.push(t("mods.added", { count: result.added.length, assigned }));
  if (result.duplicates.length > 0) parts.push(t("mods.duplicates", { count: result.duplicates.length }));
  for (const { name, reason } of result.rejected) parts.push(t(\`mods.refused.\${reason}\`, { name }));
  return parts.join(" \\xB7 ");
};
const takeMods = async (files, node = activeNode) => {
  const patches = files.filter((file) => isPatchName(file.name));
  if (patches.length === 0 || !node) return files;
  const rest = files.filter((file) => !isPatchName(file.name));
  const run = async () => {
    try {
      const result = await ModService.import(node, patches, modContext());
      modsVersion += 1;
      notice = modsNotice(result);
      setTimeout(() => {
        if (notice === modsNotice(result)) notice = void 0;
      }, 6e3);
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : t("mods.errors.import"));
    }
  };
  if (rest.length === 0) await run();
  else book.pendingMods = run;
  return rest;
};
const afterRomsLanded = async (node, paths) => {
  if (!book.pendingMods) {
    reindex(paths, node);
    return;
  }
  await LibraryIndexService.refreshMany(node, paths.map(systemFolderOf));
  await flushMods();
};
const flushMods = async () => {
  const run = book.pendingMods;
  book.pendingMods = void 0;
  if (run) await run();
};
const modActions = {
  rename: (sha1, name) => renameMod(sha1, name),
  assign: (sha1, assign) => assignMod(sha1, assign),
  remove: (sha1) => removeMod(sha1)
};
const renameMod = async (sha1, name) => {
  const node = activeNode;
  if (!node || !gameMods) return;
  await ModService.update(node, gameMods.system, sha1, { name });
  modsVersion += 1;
};
const assignMod = async (sha1, assign) => {
  const node = activeNode;
  if (!node || !gameMods || !game) return;
  await ModService.update(node, gameMods.system, sha1, { gameId: assign ? gameIdOf(game.title) : void 0 });
  modsVersion += 1;
};
const removeMod = async (sha1) => {
  const node = activeNode;
  if (!node || !gameMods) return;
  await ModService.remove(node, gameMods.system, sha1);
  modsVersion += 1;
};
const planOrganize = async (path) => {
  const node = activeNode;
  if (!node) return;
  const system = systemFolderOf(path);
  try {
    storeService.setError(void 0);
    organizeBusy = t("organize.busy.reading", { system });
    let plan = await OrganizeService.plan(node, system, (done, total) => {
      organizeBusy = t("organize.busy.readingProgress", { system, done, total });
    });
    if (path !== system) plan = filterPlanForPath(plan, path);
    organize = { system, plan };
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.plan", { system }));
  } finally {
    organizeBusy = void 0;
  }
};
const confirmOrganize = async () => {
  const node = activeNode;
  const current = organize;
  if (!node || !current) return;
  try {
    storeService.setError(void 0);
    organizeBusy = t("organize.busy.moving");
    const applied = await OrganizeService.apply(node, current.system, current.plan, (done, total) => {
      organizeBusy = t("organize.busy.movingProgress", { done, total });
    });
    organize = { ...current, applied };
    invalidateTree();
    reindex([current.system]);
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.organize"));
  } finally {
    organizeBusy = void 0;
  }
};
const undoOrganize = async () => {
  const node = activeNode;
  const current = organize;
  if (!node || !current?.applied) return;
  try {
    storeService.setError(void 0);
    organizeBusy = t("organize.busy.undoing");
    await OrganizeService.undo(node, current.applied);
    organize = void 0;
    invalidateTree();
    reindex([current.system]);
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.undo"));
  } finally {
    organizeBusy = void 0;
  }
};
const askPersistenceOnce = async () => {
  try {
    if (localStorage.getItem("rom-manager:persist-asked")) return;
    localStorage.setItem("rom-manager:persist-asked", "1");
  } catch {
  }
  await LibraryStorageService.persist();
};
const addRoms = (target = "active") => {
  book.pickTarget = target;
  $self(".rom-picker")?.click();
};
const onRomsPicked = async (event) => {
  const input = event.currentTarget;
  const files = Array.from(input.files ?? []);
  input.value = "";
  if (files.length === 0) return;
  const libraryNode = storageNodes.get(LIBRARY_ORIGIN_ID);
  const toLibrary = book.pickTarget === "library" || showLanding || !activeNode || activeOrigin?.locked;
  const node = toLibrary ? libraryNode : activeNode;
  if (!node) return;
  if (toLibrary && ui.activeOriginId !== LIBRARY_ORIGIN_ID) await selectOrigin(LIBRARY_ORIGIN_ID);
  showLanding = false;
  const roms = await takeMods(files, node);
  if (roms.length > 0) await identifyIntake(roms, node);
};
const confirmSync = async () => {
  const libraryNode = storageNodes.get(LIBRARY_ORIGIN_ID);
  const node = activeNode;
  if (!libraryNode || !node || node === libraryNode) return;
  try {
    syncBusy = true;
    storeService.setError(void 0);
    notice = t("library.sync.running");
    const result = await libraryNode.syncWith(node);
    void askPersistenceOnce();
    notice = result.changed ? t("library.sync.done", { toLibrary: result.transferred.toA, toFolder: result.transferred.toB, conflicts: result.conflicts.length }) : t("library.sync.same");
    book.grouping.clear();
    groupedRows = /* @__PURE__ */ new Map();
    refreshToken += 1;
    reindexAll(libraryNode);
    reindexAll(node);
  } catch (err) {
    notice = void 0;
    storeService.setError(err instanceof Error ? err.message : t("errors.sync"));
  } finally {
    syncBusy = false;
    syncAsk = false;
  }
};
const closeOrigin = (originId) => {
  if (originId === LIBRARY_ORIGIN_ID) return;
  book.restoredHandles.delete(originId);
  HandleStoreService.remove(originId).catch(() => void 0);
  storeService.removeOrigin(originId);
  const next = new Map(storageNodes);
  next.delete(originId);
  storageNodes = next;
};
const gameChange = (selected) => $batch(() => {
  editing = false;
  gameFile = void 0;
  game = selected ?? void 0;
});
const selectFile = (path) => $batch(() => {
  editing = false;
  gameFile = path;
});
const dropDestination = () => {
  if (game) {
    return {
      target: { kind: "game", title: game.title, folder: parentOf(game.paths[0]) },
      game: { id: game.id, system: systemOf(game.paths[0]) }
    };
  }
  if (selection.length === 1) {
    const path = selection[0];
    const record = records.get(path);
    return {
      target: { kind: "game", title: record?.title || gameNameOf(path), folder: parentOf(path) },
      game: { id: record?.id || gameNameOf(path), system: systemOf(path) }
    };
  }
  return folder === void 0 ? void 0 : { target: { kind: "folder", path: folder } };
};
const onPaneDragOver = (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  dropping = true;
};
const onPaneDragLeave = (event) => {
  const leaving = event.relatedTarget;
  if (!leaving || !event.currentTarget.contains(leaving)) dropping = false;
};
const onPaneDrop = (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  dropping = false;
  void paneDrop(Array.from(event.dataTransfer?.files ?? []));
};
const paneDrop = async (dropped) => {
  if (dropped.length === 0 || !activeNode) return;
  const files = await takeMods(dropped);
  if (files.length === 0) return;
  const destination = dropDestination();
  if (!destination) {
    void identifyIntake(files);
    return;
  }
  storeService.setError(void 0);
  dropError = void 0;
  void openDrop(files, destination);
};
const openDrop = async (files, destination) => {
  const node = activeNode;
  const askable = files.some((file) => !isImageName(file.name));
  if (!node || !askable) {
    drop = { files, ...destination };
    return;
  }
  try {
    notice = identifyingNotice(files);
    const items = await RomIntakeService.identify(node, files, (progress) => {
      notice = intakeNotice(progress);
    });
    drop = { files, ...destination, intake: items };
  } catch (err) {
    drop = { files, ...destination };
    dropError = t("errors.catalogue", { reason: err instanceof Error ? err.message : t("errors.unknown") });
  } finally {
    notice = void 0;
  }
};
const identifyIntake = async (files, node = activeNode) => {
  if (!node) return;
  try {
    storeService.setError(void 0);
    intakeError = void 0;
    notice = identifyingNotice(files);
    const items = await RomIntakeService.identify(node, files, (progress) => {
      notice = intakeNotice(progress);
    });
    if (!items.some((item) => item.path || item.refused)) {
      storeService.setError(t("errors.noGame"));
      void flushMods();
      return;
    }
    intake = items;
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.identify"));
    void flushMods();
  } finally {
    notice = void 0;
  }
};
const confirmIntake = async () => {
  const node = activeNode;
  const items = intake;
  if (!node || !items) return;
  try {
    intakeError = void 0;
    const addedPaths = items.filter(isPlaced).map((item) => item.path).filter(Boolean);
    await RomIntakeService.apply(node, items, ({ file, done, total }) => {
      intakeBusy = total > 1 ? t("progress.copyingOf", { file, done: done + 1, total }) : t("progress.copying", { file });
    });
    intake = void 0;
    if (activeOrigin?.kind === "library") void askPersistenceOnce();
    book.grouping.clear();
    groupedRows = /* @__PURE__ */ new Map();
    refreshToken += 1;
    if (addedPaths.length > 0) {
      gameFile = void 0;
      await selectionChange(addedPaths);
    }
    await afterRomsLanded(node, addedPaths);
  } catch (err) {
    intakeError = err instanceof Error ? err.message : t("errors.copyFiles");
  } finally {
    intakeBusy = void 0;
  }
};
const confirmDrop = async ({ images, files, intake: taken }) => {
  const node = activeNode;
  const current = drop;
  if (!node || !current) return;
  const { target } = current;
  const directory = target.kind === "game" ? target.folder : target.path;
  try {
    dropError = void 0;
    for (const image of images) {
      if (!current.game) break;
      dropBusy = t("progress.saving", { file: image.file.name });
      await CoverService.save(
        node,
        current.game.system,
        current.game.id,
        { kind: image.kind, region: regionOfScope(image.scope), extension: imageExtensionOf(image.file.name) },
        new Uint8Array(await image.file.arrayBuffer())
      );
    }
    const copiedPaths = [];
    for (const file of files) {
      dropBusy = t("progress.copying", { file: file.name });
      const path = directory ? \`\${directory}/\${file.name}\` : file.name;
      await node.writeFile(path, new Uint8Array(await file.arrayBuffer()));
      copiedPaths.push(path);
    }
    const takenPaths = [];
    if (taken.length > 0) {
      await RomIntakeService.apply(node, taken, ({ file, done, total }) => {
        dropBusy = total > 1 ? t("progress.addingOf", { file, done: done + 1, total }) : t("progress.adding", { file });
      });
      takenPaths.push(...taken.filter(isPlaced).map((item) => item.path).filter(Boolean));
    }
    drop = void 0;
    if (images.length > 0) mediaVersion += 1;
    const addedPaths = takenPaths.length > 0 ? takenPaths : copiedPaths;
    if (files.length > 0 || taken.length > 0) {
      book.grouping.clear();
      groupedRows = /* @__PURE__ */ new Map();
      refreshToken += 1;
    }
    if (addedPaths.length > 0) {
      gameFile = void 0;
      await selectionChange(addedPaths);
    }
    await afterRomsLanded(node, [...copiedPaths, ...takenPaths]);
  } catch (err) {
    dropError = err instanceof Error ? err.message : t("errors.writeFiles");
  } finally {
    dropBusy = void 0;
  }
};
const cancelDrop = () => {
  if (dropBusy) return;
  drop = void 0;
  dropError = void 0;
  void flushMods();
};
const cancelIntake = () => {
  if (intakeBusy) return;
  intake = void 0;
  intakeError = void 0;
  void flushMods();
};
const selectionChange = async (paths) => {
  $batch(() => {
    editing = false;
    storeService.setSelection(paths);
  });
  const node = activeNode;
  if (!node) return;
  try {
    storeService.setError(void 0);
    await loadSelection(node, paths);
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.readSelection"));
  }
};
const visibleChange = async (paths) => {
  const node = activeNode;
  if (!node) return;
  const systems = new Set(paths.map(systemOf).filter(Boolean));
  const pending = Array.from(systems).filter((system) => !book.indexedSystems.has(system));
  if (pending.length === 0) return;
  const lib = new RomLibrary(node);
  const found = await Promise.all(pending.map(async (system) => [system, await lib.initializedGames(system)]));
  for (const system of pending) book.indexedSystems.add(system);
  const next = new Set(initialised);
  for (const [system, games] of found) for (const id of games) next.add(\`\${system}/\${id}\`);
  initialised = next;
};
const loadContent = async (path) => {
  const node = activeNode;
  if (!node) throw new Error("No folder is open");
  const bytes = await node.readFile(path);
  const content = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(content).set(bytes);
  return content;
};
const persist = async (lib, path, record) => {
  let stored = record;
  if (record.cover?.startsWith("https://")) {
    try {
      stored = { ...record, cover: await lib.saveCover(path, record.cover) };
    } catch {
      stored = record;
    }
  }
  await lib.write(path, stored);
};
const save = async (path, record, coverFile, coverRemoved) => {
  const node = activeNode;
  if (!node) return;
  const updated = { ...record };
  if (coverRemoved) {
    updated.cover = void 0;
  } else if (coverFile) {
    const bytes = new Uint8Array(await coverFile.arrayBuffer());
    const ext = coverFile.name.split(".").pop()?.toLowerCase() || "png";
    updated.cover = await CoverService.save(node, systemOf(path), record.id || gameNameOf(path), { kind: "case", extension: ext }, bytes);
    mediaVersion += 1;
  }
  await persist(new RomLibrary(node), path, updated);
  initialised = new Set(initialised).add(gameKey(path));
  editing = false;
  await loadSelection(node, selection);
};
const saveMany = async (changes) => {
  const node = activeNode;
  if (!node) return;
  const lib = new RomLibrary(node);
  for (const path of selection) {
    const record = records.get(path);
    if (!record) continue;
    await persist(lib, path, { ...record, ...changes });
  }
  editing = false;
  await loadSelection(node, selection);
};
const removed = (paths) => {
  reindex(paths);
  book.grouping.clear();
  groupedRows = /* @__PURE__ */ new Map();
  const affected = selection.some((selected) => paths.some((path) => selected === path || selected.startsWith(\`\${path}/\`)));
  if (!affected) return;
  releaseCovers();
  $batch(() => {
    editing = false;
    game = void 0;
    gameFile = void 0;
    storeService.setSelection([]);
    records = /* @__PURE__ */ new Map();
    stats = /* @__PURE__ */ new Map();
    coverUrls = /* @__PURE__ */ new Map();
  });
};
const deleteFiles = async (paths) => {
  const node = activeNode;
  if (!node || paths.length === 0) return;
  const lib = new RomLibrary(node);
  for (const path of paths) {
    try {
      await node.remove(path);
    } catch {
    }
    await lib.remove(path).catch(() => {
    });
  }
  removed(paths);
  refreshToken += 1;
};
const goHome = () => $batch(() => {
  storeService.setSelection([]);
  game = void 0;
  gameFile = void 0;
  folder = void 0;
  editing = false;
  notice = void 0;
  organize = void 0;
  showLanding = true;
});
const panelGame = (picked) => {
  gameChange(picked ?? void 0);
  void selectionChange(picked ? picked.paths : []);
};
$: welcome = ui.origins.length === 0 || showLanding || activeOrigin?.locked || !activeNode;
$: canSync = !showLanding && Boolean(activeNode) && activeOrigin?.kind !== "library" && hasLibrary;
$: detailsPaths = gameFile ? [gameFile] : selection;
$: detailsGame = gameFile ? void 0 : game;
$: wizardFolder = folder !== void 0 && isGrouped(folder);
$: back = game && gameFile ? { label: game.title } : void 0;
await $mounted();
const migrateFromLauncher = async (node) => {
  try {
    if (await PlayGermadeMigration.done(node)) return;
    notice = t("host.migration.running");
    const report = await PlayGermadeMigration.run(node, void 0, ({ done, total }) => {
      notice = t("host.migration.progress", { done, total });
    });
    if (!report) {
      notice = void 0;
      return;
    }
    book.grouping.clear();
    groupedRows = /* @__PURE__ */ new Map();
    refreshToken += 1;
    modsVersion += 1;
    void askPersistenceOnce();
    if (ui.activeOriginId !== LIBRARY_ORIGIN_ID) await selectOrigin(LIBRARY_ORIGIN_ID);
    showLanding = false;
    notice = t("host.migration.done", { roms: report.placed + report.copied + report.already, mods: report.mods.added.length });
  } catch (err) {
    notice = void 0;
    storeService.setError(t("host.migration.failed", { reason: err instanceof Error ? err.message : t("errors.unknown") }));
  }
};
const openLibrary = async () => {
  if (!libraryAvailable) return;
  try {
    const node = storageService.createNodeInstance();
    await node.initializeLibrary();
    storageNodes = new Map(storageNodes).set(LIBRARY_ORIGIN_ID, node);
    storeService.addOrigin({ id: LIBRARY_ORIGIN_ID, name: t("library.name"), path: "OPFS", selection: [], kind: "library" });
    if (isPlayGermade) void migrateFromLauncher(node);
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.library"));
  }
};
openLibrary().then(() => HandleStoreService.loadAll()).then((stored) => {
  for (const entry of stored) {
    book.restoredHandles.set(entry.id, entry.handle);
    storeService.addOrigin({ id: entry.id, name: entry.name, path: entry.name, selection: [], locked: true, kind: "folder" });
  }
  try {
    const lastActiveId = localStorage.getItem("rom-manager:active-origin-id");
    if (lastActiveId && (lastActiveId === LIBRARY_ORIGIN_ID || stored.some((entry) => entry.id === lastActiveId))) {
      storeService.setActiveOrigin(lastActiveId);
    }
  } catch {
  }
}).catch(() => void 0);
ROMDatasetService.listSystems().then((systems) => storeService.setKnownSystems(new Set(systems.map((it) => it.system)))).catch(() => storeService.setKnownSystems(/* @__PURE__ */ new Set()));
<\/script>

<div class="rom-explorer">
  <Header
    :origins="ui.origins"
    :active-origin-id="ui.activeOriginId"
    :show-landing="showLanding"
    :region-order="regionOrder"
    :has-node="Boolean(activeNode)"
    :can-open-folder="foldersAvailable"
    :can-add-roms="storageNodes.size > 0"
    :can-sync="canSync"
    :launcher-url="isPlayGermade ? LAUNCHER_BASE : undefined"
    @go-home="goHome()"
    @open-folder="openFolder()"
    @add-roms="addRoms('active')"
    @sync="syncAsk = true"
    @select-origin="selectOrigin($event.detail)"
    @close-origin="closeOrigin($event.detail)"
    @region-order-change="changeRegionOrder($event.detail)"
    @open-preferences="preferences = true"
  />

  <div :if="ui.error" class="error-message">{{ ui.error }}</div>

  <!-- Initial view: before any folder is opened, on reload, or when the title is clicked. -->
  <WelcomePanel
    :if="welcome"
    :can-open-folder="foldersAvailable"
    :can-open-library="hasLibrary"
    :can-add-roms="hasLibrary"
    :loading="ui.loading"
    @open-folder="openFolder()"
    @open-library="selectOrigin(LIBRARY_ORIGIN_ID)"
    @add-roms="addRoms('library')"
  />
  <div :elseif="phone" class="mobile-host" style="display: contents">
    <MobilePanels
      :each="originKey in [ui.activeOriginId]"
      :key="originKey"
      :node="activeNode"
      :refresh-token="refreshToken"
      :known-systems="ui.knownSystems"
      :grouped-rows="groupedRows"
      :region-order="regionOrder"
      @grouping-needed="groupingNeeded($event.detail)"
      @pick-game="panelGame($event.detail)"
    >
      <RomDetails
        :paths="detailsPaths"
        :game="detailsGame"
        :folder="folder"
        :wizard-folder="wizardFolder"
        :game-cover="gameCover"
        :records="records"
        :stats="stats"
        :covers="coverUrls"
        :editing="editing"
        :on-save="save"
        :on-save-many="saveMany"
        :load-content="loadContent"
        :can-organize="true"
        :can-remove="true"
        :back="back"
        :mods="gameMods?.mods ?? []"
        :mod-actions="modActions"
        @edit="editing = true"
        @cancel-edit="editing = false"
        @select-file="selectFile($event.detail)"
        @organize="planOrganize($event.detail)"
        @remove="deleteFiles($event.detail)"
        @back="gameFile = undefined"
      />
    </MobilePanels>
  </div>
  <div :else class="explorer-container">
    <FileTree
      :each="treeKey in [\`\${ui.activeOriginId}:0\`]"
      :key="treeKey"
      :node="activeNode"
      :selected-files="selection"
      :is-initialized="(path) => initialised.has(gameKey(path))"
      :can-group="canGroup"
      :is-grouped="isGrouped"
      :grouped-rows="groupedRows"
      :can-organize="true"
      :notice="notice ?? (organize ? undefined : organizeBusy)"
      :refresh-token="refreshToken"
      @selection-change="selectionChange($event.detail)"
      @game-change="gameChange($event.detail)"
      @folder-change="folder = $event.detail ?? undefined"
      @visible-change="visibleChange($event.detail)"
      @removed="removed($event.detail)"
      @changed="reindex($event.detail)"
      @grouping-needed="groupingNeeded($event.detail)"
      @toggle-grouping="toggleGrouping($event.detail)"
      @organize="planOrganize($event.detail)"
    />

    <!-- The pane takes files from outside: an image for the game on screen, or anything for the folder picked. -->
    <div :class="\`details-pane \${dropping ? 'drop-target' : ''}\`" @dragover="onPaneDragOver" @dragleave="onPaneDragLeave" @drop="onPaneDrop">
      <RomDetails
        :paths="detailsPaths"
        :game="detailsGame"
        :folder="folder"
        :wizard-folder="wizardFolder"
        :game-cover="gameCover"
        :records="records"
        :stats="stats"
        :covers="coverUrls"
        :editing="editing"
        :on-save="save"
        :on-save-many="saveMany"
        :load-content="loadContent"
        :can-organize="true"
        :can-remove="true"
        :back="back"
        :mods="gameMods?.mods ?? []"
        :mod-actions="modActions"
        @edit="editing = true"
        @cancel-edit="editing = false"
        @select-file="selectFile($event.detail)"
        @organize="planOrganize($event.detail)"
        @remove="deleteFiles($event.detail)"
        @back="gameFile = undefined"
      />
    </div>
  </div>

  <!-- Mounted whether or not it is open: the dialog closes itself, and being still there is what lets it be seen doing so. -->
  <PreferencesModal
    :open="preferences"
    :theme-mode="ui.themeMode"
    :locale="ui.localePreference"
    :region-order="regionOrder"
    :can-change-regions="Boolean(activeNode)"
    :library="hasLibrary"
    @theme-mode-change="setThemeMode($event.detail)"
    @locale-change="setLocalePreference($event.detail)"
    @region-order-change="changeRegionOrder($event.detail)"
    @close="preferences = false"
  />

  <!-- Behind "Añadir ROMs". No \`accept\`: iOS greys out extensions it has no type for. -->
  <input type="file" multiple hidden class="rom-picker" @change="onRomsPicked" />

  <ConfirmModal
    :close-label="t('prefs.close')"
    :cancel-label="t('drop.cancel')"
    :open="syncAsk"
    :title="t('library.sync.title', { folder: activeOrigin?.name ?? '' })"
    :message="t('library.sync.message')"
    :confirm-label="t('library.sync.confirm')"
    :danger="false"
    :busy="syncBusy"
    @confirm="confirmSync()"
    @close="syncBusy ? undefined : (syncAsk = false)"
  />

  <!-- Only while there is a drop to read: what it says depends on the files and where they were dropped. -->
  <MediaDropModal
    :if="drop"
    :files="drop.files"
    :target="drop.target"
    :intake="drop.intake"
    :busy="dropBusy"
    :error="dropError"
    @confirm="confirmDrop($event.detail)"
    @cancel="cancelDrop()"
  />

  <!-- Only once the drop has been identified: what it says is the answer. -->
  <RomIntakeModal
    :if="intake"
    :items="intake"
    :busy="intakeBusy"
    :error="intakeError"
    @confirm="confirmIntake()"
    @cancel="cancelIntake()"
  />

  <OrganizePanel
    :if="organize"
    :system="organize.system"
    :plan="organize.plan"
    :applied="organize.applied"
    :busy="organizeBusy"
    @confirm="confirmOrganize()"
    @undo="undoOrganize()"
    @close="organize = undefined"
  />
</div>
`,yi={"./Header.html":an,"./WelcomePanel.html":un,"./FileTree.html":Yn,"./RomDetails.html":Ea,"./MobilePanels.html":Fa,"./PreferencesModal.html":Ha,"./MediaDropModal.html":Xa,"./RomIntakeModal.html":ei,"./OrganizePanel.html":ii,"../components/ConfirmModal.html":P,"../lib/StorageService":$t,"../lib/LibraryStorageService":ot,"../lib/RomLibraryService":V,"../lib/GameCatalogService":Ct,"../lib/CoverService":si,"../lib/OrganizeService":Mt,"../lib/RomIntakeService":W,"../lib/ROMDatasetService":ge,"../lib/WizardConfigService":Ut,"../lib/ThemeService":Me,"../lib/I18nService":ue,"../lib/HandleStoreService":mi,"../helpers/wizard-tree":ui,"../helpers/rom-covers":ee,"../helpers/rom-media":J,"../helpers/rom-organize":_t,"../lib/StoreService":Vt,"../lib/ui-state":h,"../lib/LibraryIndexService":Ot,"../lib/ModService":St,"../helpers/library-index":H,"../helpers/patch":xt,"../lib/host":nt,"../lib/PlayGermadeMigration":kt},wi="views/ROMExplorer.html";let dt;dt=new m(vi,{modules:yi,filename:wi});const bi=dt,ki=`<!--
  The app: the remembered theme and language first (the system's / the browser's
  until chosen, and followed while they are "auto"), then the explorer.
-->
<script :setup>const [ROMExplorer, { initTheme }, { initLocale }] = await $importAll([
  "./ROMExplorer.html",
  "../lib/ThemeService",
  "../lib/I18nService"
]);
$destroyed(initTheme());
$destroyed(initLocale());
<\/script>

<ROMExplorer />
`,xi={"./ROMExplorer.html":bi,"../lib/ThemeService":Me,"../lib/I18nService":ue},Si="views/App.html";let mt;mt=new m(ki,{modules:xi,filename:Si});const Oi=mt;Oi.mount("#app");
