import { JSX } from 'preact';

/**
 * The app's own mark: three loose cartridges, lying as they lie in a drawer.
 *
 * Loose, and each one somebody's — the NES's wide grey brick with its paper
 * label, the Mega Drive's black shell with the thumb notch bitten out of its
 * top, and in front the SNES's shouldered body, which is the silhouette that
 * survives at 20 pixels once the other two are only shapes. A collection is a
 * pile of dumps from machines that never agreed on anything, and the mark says
 * so.
 *
 * Every shape is laid out to sit inside the box *after* its tilt, corners
 * included: a mark that fits its own viewBox is one that can be dropped into a
 * favicon, a header and a hero without being cropped in any of them.
 *
 * Drawn in the slate tones `SystemLogos.tsx` uses for console hardware rather
 * than in the palette: these are objects, and an object that changed colour with
 * the theme would stop being the object. The tones were picked to hold on both
 * backgrounds; the labels are what carry the colour.
 */
export function BrandLogo({ class: className }: { class?: string }): JSX.Element {
  return (
    <svg
      class={className ?? 'brand-logo'}
      viewBox="0 0 64 64"
      role="img"
      aria-label="ROM Manager"
    >
      {/* NES: landscape, grey, most of the face taken by the paper label. */}
      <g transform="rotate(-14 20 25)">
        <rect
          x="7"
          y="14.5"
          width="26"
          height="21"
          rx="2"
          fill="#cbd5e1"
          stroke="#475569"
          stroke-width="2.2"
          stroke-linejoin="round"
        />
        <rect
          x="10.5"
          y="17.5"
          width="19"
          height="11"
          rx="1"
          fill="#f1f5f9"
          stroke="#94a3b8"
          stroke-width="1.2"
        />
        {/* The lip along the front, and the ridges under it. */}
        <path d="M9 31.8h22" stroke="#64748b" stroke-width="1.6" stroke-linecap="round" />
        <path d="M11 34h6M21 34h6" stroke="#94a3b8" stroke-width="1.4" stroke-linecap="round" />
      </g>

      {/* Mega Drive: black, upright, and the round notch cut into its top. */}
      <g transform="rotate(12 45 24)">
        <path
          d="M37 10h4a4 4 0 0 0 8 0h4a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H37a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z"
          fill="#2f3944"
          stroke="#94a3b8"
          stroke-width="2.2"
          stroke-linejoin="round"
        />
        <rect x="38.5" y="16" width="13" height="9.5" rx="1" fill="#f59e0b" />
        <path
          d="M38.5 29.5h13M38.5 32.5h13"
          stroke="#94a3b8"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </g>

      {/* SNES: the narrow ridged top over the wide body, label across the face. */}
      <g transform="rotate(-5 32 40)">
        <path
          d="M25 24h15a2 2 0 0 1 2 2v5h2a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H21a3 3 0 0 1-3-3V34a3 3 0 0 1 3-3h2v-5a2 2 0 0 1 2-2z"
          fill="#e2e8f0"
          stroke="#334155"
          stroke-width="2.4"
          stroke-linejoin="round"
        />
        {/* The grip, ridged across the narrow top. */}
        <path
          d="M28 26.5v3M32 26.5v3M36 26.5v3"
          stroke="#94a3b8"
          stroke-width="1.4"
          stroke-linecap="round"
        />
        <rect x="22" y="36" width="20" height="12" rx="1.4" fill="#1976d2" />
        {/* The contacts, the part a console is about. */}
        <path d="M22 52h7M35 52h7" stroke="#64748b" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  );
}
