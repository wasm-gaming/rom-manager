import { JSX } from 'preact';

interface IllustrationProps {
  class?: string;
}

/**
 * 1. Hash Illustration: Identification by SHA-1 / DAT checksum hash.
 * Microchip scan frame with binary pattern and green checksum verification badge.
 */
export function HashIllustration({ class: className }: IllustrationProps): JSX.Element {
  return (
    <svg
      class={className ?? 'card-illustration'}
      viewBox="0 0 240 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hash Identification"
    >
      {/* Chip pins */}
      <path d="M33 34h12M33 46h12M33 58h12M33 70h12M33 82h12" stroke="var(--text-faint)" stroke-width="2.5" stroke-linecap="round" />
      <path d="M130 34h12M130 46h12M130 58h12M130 70h12M130 82h12" stroke="var(--text-faint)" stroke-width="2.5" stroke-linecap="round" />

      {/* Main Chip body */}
      <rect x="45" y="20" width="85" height="76" rx="8" fill="#1e293b" stroke="var(--border-strong)" stroke-width="2" />
      
      {/* Chip center circuit symbol */}
      <rect x="61" y="38" width="53" height="40" rx="4" fill="#0f172a" stroke="var(--accent)" stroke-width="1.8" />
      <text x="87" y="63" fill="var(--accent)" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">
        SHA1
      </text>

      {/* Binary datastream / hash lines on right */}
      <rect x="148" y="32" width="70" height="8" rx="4" fill="var(--accent)" opacity="0.85" />
      <rect x="148" y="48" width="52" height="7" rx="3.5" fill="var(--text-dim)" opacity="0.6" />
      <rect x="148" y="62" width="62" height="7" rx="3.5" fill="var(--text-dim)" opacity="0.6" />
      <rect x="148" y="76" width="40" height="7" rx="3.5" fill="var(--text-dim)" opacity="0.4" />

      {/* Verification checkmark badge */}
      <circle cx="205" cy="80" r="18" fill="var(--ok)" stroke="var(--surface)" stroke-width="3" />
      <path d="M196 80l6 6 12-12" stroke="var(--ok-on)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

/**
 * 2. Grouping Illustration: Variants grouped under 1 game entry.
 * Parent game node connecting to regional variant badges (EU, US, JP).
 */
export function GroupingIllustration({ class: className }: IllustrationProps): JSX.Element {
  return (
    <svg
      class={className ?? 'card-illustration'}
      viewBox="0 0 240 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ROM Grouping"
    >
      {/* Main Parent Game Card */}
      <rect x="18" y="20" width="85" height="76" rx="8" fill="var(--surface)" stroke="var(--accent)" stroke-width="2.2" />
      {/* Game title placeholder lines */}
      <rect x="28" y="32" width="65" height="8" rx="4" fill="var(--text)" />
      <rect x="28" y="46" width="45" height="6" rx="3" fill="var(--text-dim)" />
      
      {/* Grouping tag pill inside parent */}
      <rect x="28" y="64" width="52" height="18" rx="9" fill="var(--accent-soft)" />
      <text x="54" y="76" fill="var(--accent-ink)" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">
        GAME
      </text>

      {/* Connecting tree curves */}
      <path d="M103 58 C 128 58, 125 28, 146 28" stroke="var(--accent)" stroke-width="2.2" fill="none" stroke-dasharray="4 4" />
      <path d="M103 58 L 146 58" stroke="var(--accent)" stroke-width="2.2" fill="none" />
      <path d="M103 58 C 128 58, 125 88, 146 88" stroke="var(--accent)" stroke-width="2.2" fill="none" stroke-dasharray="4 4" />

      {/* Variant Pills (EU, US, JP) */}
      {/* EU Variant */}
      <g transform="translate(146, 16)">
        <rect x="0" y="0" width="76" height="24" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.5" />
        <rect x="8" y="5" width="24" height="14" rx="7" fill="#3b82f6" />
        <text x="20" y="15" fill="#ffffff" font-family="sans-serif" font-size="8.5" font-weight="bold" text-anchor="middle">EU</text>
        <rect x="38" y="10" width="28" height="4" rx="2" fill="var(--text-dim)" />
      </g>

      {/* US Variant */}
      <g transform="translate(146, 46)">
        <rect x="0" y="0" width="76" height="24" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.5" />
        <rect x="8" y="5" width="24" height="14" rx="7" fill="#ef4444" />
        <text x="20" y="15" fill="#ffffff" font-family="sans-serif" font-size="8.5" font-weight="bold" text-anchor="middle">US</text>
        <rect x="38" y="10" width="28" height="4" rx="2" fill="var(--text-dim)" />
      </g>

      {/* JP Variant */}
      <g transform="translate(146, 76)">
        <rect x="0" y="0" width="76" height="24" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.5" />
        <rect x="8" y="5" width="24" height="14" rx="7" fill="#10b981" />
        <text x="20" y="15" fill="#ffffff" font-family="sans-serif" font-size="8.5" font-weight="bold" text-anchor="middle">JP</text>
        <rect x="38" y="10" width="28" height="4" rx="2" fill="var(--text-dim)" />
      </g>
    </svg>
  );
}

/**
 * 3. Covers Illustration: Box art & cover thumbnails.
 * 3D-angled cover image frames with media art gradient & star badge.
 */
export function CoversIllustration({ class: className }: IllustrationProps): JSX.Element {
  return (
    <svg
      class={className ?? 'card-illustration'}
      viewBox="0 0 240 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cover Art"
    >
      {/* Secondary background cover (stacked behind) */}
      <g transform="translate(45, 20) rotate(-10)">
        <rect x="0" y="0" width="58" height="82" rx="5" fill="#334155" stroke="var(--border-strong)" stroke-width="1.8" />
        <path d="M0 35 L58 20 L58 82 L0 82 Z" fill="#475569" opacity="0.4" />
      </g>

      {/* Main Front Cover Card */}
      <g transform="translate(86, 12)">
        <rect x="0" y="0" width="68" height="94" rx="6" fill="#1e293b" stroke="var(--accent)" stroke-width="2.4" />
        {/* Cover Art Artwork Header */}
        <path d="M0 5 C0 2.2 2.2 0 5 0 L63 0 C65.8 0 68 2.2 68 5 L68 56 L0 56 Z" fill="url(#cover-art-grad-large)" />

        <defs>
          <linearGradient id="cover-art-grad-large" x1="0" y1="0" x2="68" y2="56" gradientUnits="userSpaceOnUse">
            <stop stop-color="#6366f1" />
            <stop offset="1" stop-color="#ec4899" />
          </linearGradient>
        </defs>

        {/* Sun & mountains graphic inside cover art */}
        <circle cx="50" cy="20" r="7" fill="#fbbf24" opacity="0.9" />
        <path d="M8 52 L24 28 L38 42 L52 30 L68 52 Z" fill="#0f172a" opacity="0.65" />

        {/* Cover Title Box */}
        <rect x="8" y="64" width="52" height="7" rx="3.5" fill="#ffffff" opacity="0.9" />
        <rect x="8" y="77" width="32" height="5" rx="2.5" fill="var(--text-dim)" opacity="0.6" />

        {/* Region badge overlay on cover */}
        <rect x="44" y="75" width="18" height="11" rx="3" fill="var(--accent)" />
        <text x="53" y="83.5" fill="var(--accent-on)" font-family="sans-serif" font-size="7" font-weight="bold" text-anchor="middle">
          EU
        </text>
      </g>

      {/* Libretro thumbnail sync badge */}
      <g transform="translate(170, 34)">
        <circle cx="22" cy="22" r="22" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="2" />
        {/* Photo Image Icon */}
        <rect x="10" y="12" width="24" height="19" rx="3" stroke="var(--accent)" stroke-width="2" fill="none" />
        <circle cx="16" cy="18" r="2" fill="var(--accent)" />
        <path d="M10 27 L17 20 L22 25 L27 21 L34 27" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>
  );
}

/**
 * 4. Consolidate Illustration: Organization & preview.
 * Folder structure converting raw files to organized canonical layout with green arrow.
 */
export function ConsolidateIllustration({ class: className }: IllustrationProps): JSX.Element {
  return (
    <svg
      class={className ?? 'card-illustration'}
      viewBox="0 0 240 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Canonical Organization"
    >
      {/* Raw files stack (left side) */}
      <g transform="translate(16, 20)">
        <rect x="0" y="0" width="64" height="18" rx="4" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.2" />
        <text x="7" y="12" fill="var(--text-faint)" font-family="monospace" font-size="7.5">game_v1.zip</text>

        <rect x="0" y="26" width="64" height="18" rx="4" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.2" />
        <text x="7" y="38" fill="var(--text-faint)" font-family="monospace" font-size="7.5">game_us.bin</text>

        <rect x="0" y="52" width="64" height="18" rx="4" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.2" />
        <text x="7" y="64" fill="var(--text-faint)" font-family="monospace" font-size="7.5">game_jp.rom</text>
      </g>

      {/* Organization Arrow in Center */}
      <g transform="translate(92, 42)">
        <circle cx="16" cy="12" r="18" fill="var(--accent-soft)" />
        <path d="M7 12 H25 M20 7 L25 12 L20 17" stroke="var(--accent-ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>

      {/* Clean Organized Folder (right side) */}
      <g transform="translate(144, 15)">
        {/* Main Folder tab */}
        <path d="M0 5 C0 2.2 2.2 0 5 0 L26 0 C28.5 0 30.5 1.5 31.8 3.5 L35 8 L63 8 C65.8 8 68 10.2 68 13 L68 75 C68 77.8 65.8 80 63 80 L5 80 C2.2 80 0 77.8 0 75 Z" fill="#fbbf24" opacity="0.9" />

        {/* Organized items inside folder */}
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
  );
}
