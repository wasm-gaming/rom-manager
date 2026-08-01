import { JSX } from 'preact';

/**
 * The app's own mark: three loose cartridges, lying as they lie in a drawer.
 *
 * Three real ones, at their real proportions. Behind on the left the **NES**
 * brick, wider than it is tall, its paper label boxed in black. Behind on the
 * right a **PC Engine** HuCard — barely a card at all, the gold contacts along
 * its top edge and the insertion arrow printed above the art. In front the
 * **Mega Drive** shell, upright and black, with the thumb notch bitten out of
 * its top lip.
 *
 * Three machines that never agreed on the shape of a game, which is the whole
 * job: a collection is a pile of dumps from all of them.
 *
 * Every shape is laid out to sit inside the box *after* its tilt, corners
 * included, so the mark is never cropped — favicon, header and hero all show the
 * same thing.
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
      {/* NES: 136 × 120 mm, so landscape, and grey all over. */}
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
        {/* The label: black-boxed, with the title band across its top. */}
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
        {/* The lip along the front, and the ridges under it. */}
        <path d="M9.5 31h23" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" />
        <path d="M11.5 33.5h7M23.5 33.5h7" stroke="#94a3b8" stroke-width="1.3" stroke-linecap="round" />
      </g>

      {/* PC Engine: a HuCard, 54 × 86 mm and 2 mm thick — a printed card. */}
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
        {/* The contacts along the top edge, which is the edge it goes in by. */}
        <path
          d="M41.5 16v2.6M44 16v2.6M46.5 16v2.6M49 16v2.6M51.5 16v2.6"
          stroke="#d69e2e"
          stroke-width="1.4"
          stroke-linecap="round"
        />
        {/* The arrow printed above the art, saying which way up it goes. */}
        <path d="M47 20.5l1.8 2.4h-3.6z" fill="#64748b" />
        <rect x="41.5" y="25" width="11" height="8" rx="0.8" fill="#1976d2" />
        <path d="M41.5 35h11" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" />
      </g>

      {/* Mega Drive: upright, black, and the round notch cut into its top lip. */}
      <g transform="rotate(-5 32 41)">
        <path
          d="M22.5 26h5a4.5 4.5 0 0 0 9 0h5a2.5 2.5 0 0 1 2.5 2.5v25a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 20 53.5v-25A2.5 2.5 0 0 1 22.5 26z"
          fill="#252d38"
          stroke="#94a3b8"
          stroke-width="2.3"
          stroke-linejoin="round"
        />
        {/* The grip, ridged either side of the notch. */}
        <path
          d="M23 31h4M37 31h4"
          stroke="#94a3b8"
          stroke-width="1.4"
          stroke-linecap="round"
        />
        {/* The label: title band over the art, as they came. */}
        <rect x="23" y="35" width="18" height="14" rx="1" fill="#f1f5f9" />
        <rect x="23" y="35" width="18" height="4" rx="1" fill="#f59e0b" />
      </g>
    </svg>
  );
}
