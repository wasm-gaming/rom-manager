import { JSX } from 'preact';
import { useId } from 'preact/hooks';

const DISC_EXTS = new Set(['iso', 'cue', 'chd', 'gdi', 'nrg', 'mdf', 'ccd', 'pbp']);
const SAVE_EXTS = new Set(['sav', 'srm', 'state', 'st0', 'st1', 'st2', 'st3', 'st4', 'st5', 'mcr', 'mc']);
const ARCHIVE_EXTS = new Set(['zip', '7z', 'rar', 'gz', 'tar']);
const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg']);
const DOC_EXTS = new Set(['txt', 'json', 'xml', 'md', 'nfo', 'pdf', 'doc', 'dat']);


/**
 * The icons, drawn rather than typed.
 *
 * Two families, because two jobs.
 *
 * What a row *is* — a folder, a game, a disc, a page — keeps the colours of the
 * emoji it replaces: what tells a folder from a game at a glance is the amber
 * against the grey. Those come from the palette, so each theme gets a tone that
 * reads on its own background. Which of them a file gets is decided by its MIME
 * type, in `iconOfName` at the foot of that family.
 *
 * What a control *does* is drawn in one stroke of `currentColor` and sized in
 * `em`, so every one of them takes the colour and the size of the text it stands
 * among — a button that dims when disabled dims its icon with it, and nothing
 * has to be restyled twice.
 */

const BOX = '0 0 24 24';

import { SystemLogo } from './SystemLogos';

/** The gamepad's own shapes, shared by the plain icon and the bundle. */
function Gamepad({ systemId }: { systemId?: string }): JSX.Element {
  const normalized = systemId?.toUpperCase();

  // Mega Drive / Genesis / Mega-CD / 32X
  if (
    normalized === 'MEGADRIVE' ||
    normalized === 'GENESIS' ||
    normalized === 'MEGACD' ||
    normalized === 'S32X'
  ) {
    return (
      <>
        {/* Mega Drive Crescent / Kidney Shape Controller Body */}
        <path
          d="M2.5 12.8c0-3.8 4-7.3 9.5-7.3s9.5 3.5 9.5 7.3c0 2.2-1.3 4.2-3.2 4.2-1.6 0-2.6-1.1-3.5-2.2l-.6-.8c-.5-.6-1.2-.9-1.9-.9s-1.4.3-1.9.9l-.6.8c-.9 1.1-1.9 2.2-3.5 2.2-1.9 0-3.3-2-3.3-4.2z"
          fill="var(--icon-pad)"
        />
        {/* Direction Pad Base Circle & Cross */}
        <circle cx="7.2" cy="12" r="3.2" fill="#0f172a" opacity="0.4" />
        <rect x="6.2" y="9.8" width="2" height="4.4" rx=".5" fill="var(--icon-pad-mark)" />
        <rect x="5" y="11" width="4.4" height="2" rx=".5" fill="var(--icon-pad-mark)" />
        {/* Red START Button */}
        <rect x="11" y="8.2" width="1.8" height="2.8" rx=".5" fill="#ef4444" transform="rotate(-15 11.9 9.6)" />
        {/* A, B, C Buttons in Arc */}
        <circle cx="14.8" cy="13.2" r="1.25" fill="#cbd5e1" />
        <circle cx="17.2" cy="12.1" r="1.25" fill="#cbd5e1" />
        <circle cx="19.5" cy="11.0" r="1.25" fill="#cbd5e1" />
        {/* X, Y, Z Buttons above */}
        <circle cx="14.4" cy="10.2" r="0.8" fill="#94a3b8" />
        <circle cx="16.5" cy="9.3" r="0.8" fill="#94a3b8" />
        <circle cx="18.6" cy="8.4" r="0.8" fill="#94a3b8" />
      </>
    );
  }

  // NES / Famicom
  if (normalized === 'NES') {
    return (
      <>
        <rect x="2" y="7" width="20" height="10" rx="1.5" fill="#334155" />
        <rect x="4" y="8" width="16" height="4" fill="#0f172a" />
        {/* Red D-Pad */}
        <rect x="4.5" y="10" width="1.8" height="4" rx=".3" fill="#e60012" />
        <rect x="3.4" y="11.1" width="4" height="1.8" rx=".3" fill="#e60012" />
        {/* Red A/B Buttons */}
        <circle cx="15.5" cy="12" r="1.3" fill="#e60012" />
        <circle cx="18.5" cy="12" r="1.3" fill="#e60012" />
        {/* Select / Start */}
        <rect x="9.2" y="11.6" width="1.8" height="0.8" rx=".3" fill="#94a3b8" />
        <rect x="11.8" y="11.6" width="1.8" height="0.8" rx=".3" fill="#94a3b8" />
      </>
    );
  }

  // Nintendo 64
  if (normalized === 'N64') {
    return (
      <>
        {/* N64 Trident Controller */}
        <path
          d="M4 8.5c0-1.5 1-3 2.5-3h11c1.5 0 2.5 1.5 2.5 3v2c0 2-1 4-2 6.5L16 20h-2.5l-1.5-6h-0.2l-1.5 6H8L6 16.5C5 14 4 11.5 4 10.5v-2z"
          fill="var(--icon-pad)"
        />
        {/* Center Analog Stick Base */}
        <circle cx="12" cy="10.5" r="2" fill="#94a3b8" />
        {/* D-Pad on Left */}
        <rect x="6.2" y="8.8" width="1.6" height="3.6" rx=".4" fill="var(--icon-pad-mark)" />
        <rect x="5.2" y="9.8" width="3.6" height="1.6" rx=".4" fill="var(--icon-pad-mark)" />
        {/* Red A & Blue B Buttons */}
        <circle cx="15.5" cy="13.2" r="1.2" fill="#e60012" />
        <circle cx="14.2" cy="11.4" r="1.1" fill="#3b82f6" />
        {/* Yellow C Buttons */}
        <circle cx="18.2" cy="10.5" r="0.9" fill="#eab308" />
        <circle cx="16.8" cy="8.8" r="0.9" fill="#eab308" />
      </>
    );
  }

  // Sony PlayStation (PSX)
  if (normalized === 'PSX') {
    return (
      <>
        <path
          d="M4.5 7.5h15c2.5 0 4.5 2 4.5 4.5v3c0 2.5-1.5 4.5-3.2 4.5-1.4 0-2.3-.9-3.2-1.9l-.6-.7c-.4-.5-1-.8-1.7-.8s-1.3.3-1.7.8l-.6.7c-.9 1-1.8 1.9-3.2 1.9-1.7 0-3.2-2-3.2-4.5v-3c0-2.5 2-4.5 4.5-4.5z"
          fill="var(--icon-pad)"
        />
        {/* D-Pad */}
        <rect x="5.8" y="9.8" width="2.2" height="5.2" rx=".5" fill="var(--icon-pad-mark)" />
        <rect x="4.3" y="11.3" width="5.2" height="2.2" rx=".5" fill="var(--icon-pad-mark)" />
        {/* PS Action Symbols: Triangle, Circle, Cross, Square */}
        <polygon points="17.2,8.8 18.2,10.4 16.2,10.4" fill="#22c55e" />
        <circle cx="19.4" cy="12.4" r="1" fill="#ef4444" />
        <path d="M16.4 13.8l1.6 1.6m-1.6 0l1.6-1.6" stroke="#3b82f6" stroke-width="0.8" />
        <rect x="14.2" y="11.4" width="1.8" height="1.8" rx="0.2" fill="#ec4899" />
      </>
    );
  }

  // Sega Saturn
  if (normalized === 'SATURN') {
    return (
      <>
        <ellipse cx="12" cy="12" rx="10" ry="6.5" fill="var(--icon-pad)" />
        <circle cx="7" cy="12" r="2.8" fill="#0f172a" opacity="0.4" />
        <rect x="6.2" y="10" width="1.6" height="4" rx=".4" fill="var(--icon-pad-mark)" />
        <rect x="5" y="11.2" width="4" height="1.6" rx=".4" fill="var(--icon-pad-mark)" />
        {/* A, B, C buttons */}
        <circle cx="14.8" cy="13" r="1.1" fill="#6366f1" />
        <circle cx="17" cy="12.2" r="1.1" fill="#6366f1" />
        <circle cx="19.2" cy="11.4" r="1.1" fill="#6366f1" />
      </>
    );
  }

  // Master System (SMS)
  if (normalized === 'SMS') {
    return (
      <>
        <rect x="3" y="7" width="18" height="10" rx="1.5" fill="#0284c7" />
        <rect x="5" y="9" width="6" height="6" fill="#0f172a" />
        <line x1="5" y1="12" x2="11" y2="12" stroke="#ef4444" stroke-width="1.2" />
        <line x1="8" y1="9" x2="8" y2="15" stroke="#ef4444" stroke-width="1.2" />
        <circle cx="15.5" cy="12" r="1.3" fill="#cbd5e1" />
        <circle cx="18.5" cy="12" r="1.3" fill="#cbd5e1" />
      </>
    );
  }

  // TurboGrafx-16 / PC Engine
  if (normalized === 'TGFX16' || normalized === 'TGFX16-CD') {
    return (
      <>
        <rect x="3" y="7" width="18" height="10" rx="2" fill="#d97706" />
        <rect x="5" y="9" width="6" height="6" rx="1" fill="#78350f" />
        <rect x="7" y="9.8" width="2" height="4.4" rx=".4" fill="#fef3c7" />
        <rect x="5.8" y="11" width="4.4" height="2" rx=".4" fill="#fef3c7" />
        <circle cx="15" cy="12" r="1.3" fill="#ef4444" />
        <circle cx="18" cy="12" r="1.3" fill="#ef4444" />
      </>
    );
  }

  // Neo Geo
  if (normalized === 'NEOGEO' || normalized === 'NEOGEO-CD') {
    return (
      <>
        <rect x="3" y="7" width="18" height="10" rx="2" fill="#dc2626" />
        <circle cx="7.5" cy="12" r="2" fill="#0f172a" />
        <circle cx="7.5" cy="11.5" r="1.2" fill="#fef08a" />
        <circle cx="13.2" cy="13.2" r="1.1" fill="#ef4444" />
        <circle cx="15.2" cy="12" r="1.1" fill="#eab308" />
        <circle cx="17.2" cy="11" r="1.1" fill="#22c55e" />
        <circle cx="19.2" cy="10" r="1.1" fill="#3b82f6" />
      </>
    );
  }

  // Atari 2600 / 5200 / 7800 / Lynx
  if (
    normalized === 'ATARI2600' ||
    normalized === 'ATARI5200' ||
    normalized === 'ATARI7800' ||
    normalized === 'ATARILYNX'
  ) {
    return (
      <>
        <rect x="7" y="11" width="10" height="7" rx="1.5" fill="#ea580c" />
        <rect x="11" y="5" width="2" height="7" rx="0.5" fill="#78350f" />
        <circle cx="12" cy="5" r="1" fill="#ef4444" />
        <circle cx="9" cy="13" r="1.2" fill="#ef4444" />
      </>
    );
  }

  // Game Boy / GBC / GBA / Handhelds
  if (
    normalized === 'GAMEBOY' ||
    normalized === 'GBC' ||
    normalized === 'GBA' ||
    normalized === 'GAMEGEAR' ||
    normalized === 'WONDERSWAN' ||
    normalized === 'WONDERSWANCOLOR' ||
    normalized === 'POKEMONMINI'
  ) {
    return (
      <>
        <rect x="3" y="7" width="18" height="10" rx="2.5" fill="#3b82f6" />
        <rect x="7" y="8.5" width="10" height="7" rx="1" fill="#0f172a" />
        <circle cx="17.8" cy="12" r="1.1" fill="#cbd5e1" />
        <rect x="4.2" y="10.8" width="1.6" height="3" rx=".4" fill="#cbd5e1" />
        <rect x="3.5" y="11.5" width="3" height="1.6" rx=".4" fill="#cbd5e1" />
      </>
    );
  }

  // SNES / Standard Retro Gamepad Layout (Default)
  return (
    <>
      {/* SNES / Retro Gamepad Body Shell (Well-proportioned horizontal contour) */}
      <path
        d="M5.5 6.2h13c3.5 0 5.5 2.4 5.5 5.5s-2 5.5-5.5 5.5h-1.6c-1.1 0-2.1-.5-2.6-1.4l-.4-.8c-.4-.6-1.1-.9-1.9-.9s-1.5.3-1.9.9l-.4.8c-.5.9-1.5 1.4-2.6 1.4H5.5C2 17.2 0 14.8 0 11.7S2 6.2 5.5 6.2z"
        fill="var(--icon-pad)"
      />
      {/* Inner Faceplate Contour */}
      <path
        d="M5.5 7.2h13c2.8 0 4.5 1.9 4.5 4.5s-1.7 4.5-4.5 4.5h-1.6c-.8 0-1.6-.4-2-1.1l-.4-.8c-.6-1-1.7-1.6-2.9-1.6s-2.3.6-2.9 1.6l-.4.8c-.4.7-1.2 1.1-2 1.1H5.5C2.7 16.2 1 14.3 1 11.7S2.7 7.2 5.5 7.2z"
        fill="var(--icon-pad-face)"
        opacity="0.15"
      />
      {/* D-Pad */}
      <rect x="5.2" y="9.2" width="2.4" height="6.4" rx=".7" fill="var(--icon-pad-mark)" />
      <rect x="3.2" y="11.2" width="6.4" height="2.4" rx=".7" fill="var(--icon-pad-mark)" />
      {/* Four Colored Action Buttons (SNES Palette - Spacious Spacing) */}
      <circle cx="17.2" cy="9.1" r="1.3" fill="#f9ab00" />
      <circle cx="19.6" cy="11.7" r="1.3" fill="#e94235" />
      <circle cx="17.2" cy="14.3" r="1.3" fill="#34a853" />
      <circle cx="14.8" cy="11.7" r="1.3" fill="#4285f4" />
      {/* Select & Start Pill Buttons */}
      <rect x="9.6" y="12.3" width="1.9" height="0.85" rx=".4" fill="var(--icon-pad-mark)" transform="rotate(-20 10.5 12.7)" />
      <rect x="11.9" y="12.3" width="1.9" height="0.85" rx=".4" fill="var(--icon-pad-mark)" transform="rotate(-20 12.8 12.7)" />
    </>
  );
}

export function SystemFolderIcon({ systemId }: { systemId: string }): JSX.Element {
  return (
    <div class="system-folder-icon">
      <FolderIcon />
      <span class="system-folder-badge">
        <SystemLogo systemId={systemId} />
      </span>
    </div>
  );
}

/** A box to draw a parcel in, which its tape is then measured from. */
interface ParcelBox {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
}

/** Where the bundle's parcel sits, and what the pad is cut back by to fit it. */
const PARCEL: ParcelBox = { x: 15.1, y: 14.9, width: 7.8, height: 7, rx: 1.1 };

/** The same parcel filling the whole box, which is what an archive is. */
const ARCHIVE: ParcelBox = { x: 3.6, y: 5.3, width: 16.8, height: 14.2, rx: 1.7 };

/**
 * A parcel: a box and the tape across it.
 *
 * The tape is a share of the box and not a measurement, so one drawing holds at
 * the 7.8 units of a corner mark and at the 16.8 of a whole icon. That matters
 * because the two are the same object twice: the parcel on a bundle says "this
 * game is several files", and it would say nothing at all if a zip on disk were
 * drawn as something else.
 */
function Parcel({ x, y, width, height, rx }: ParcelBox): JSX.Element {
  const band = height * 0.3;

  return (
    <>
      <rect x={x} y={y} width={width} height={height} rx={rx} fill="var(--icon-box)" />
      <rect
        x={x}
        y={y + band}
        width={width}
        height={height * 0.229}
        fill="var(--icon-box-tape)"
      />
      <rect
        x={x + width * 0.385}
        y={y}
        width={width * 0.205}
        height={band}
        fill="var(--icon-box-tape)"
      />
    </>
  );
}

/** The page both file marks are drawn on, with its top corner turned over. */
function Sheet(): JSX.Element {
  return (
    <>
      <path
        d="M6.2 2.4h7.1L19.2 8.3v11.9a1.5 1.5 0 0 1-1.5 1.5H6.2a1.5 1.5 0 0 1-1.5-1.5V3.9a1.5 1.5 0 0 1 1.5-1.5z"
        fill="var(--icon-paper)"
      />
      <path d="M13.3 2.4 19.2 8.3h-4.4a1.5 1.5 0 0 1-1.5-1.5z" fill="var(--icon-paper-fold)" />
    </>
  );
}

export function FolderIcon(): JSX.Element {
  return (
    <svg viewBox={BOX}>
      {/* Back and front, so the tab reads as a fold rather than a bump. */}
      <path
        d="M2.4 6.6a1.6 1.6 0 0 1 1.6-1.6h4.5c.44 0 .86.18 1.16.5l1.5 1.6H20a1.6 1.6 0 0 1 1.6 1.6v9.1a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z"
        fill="var(--icon-folder-back)"
      />
      <path
        d="M2.4 9.6h19.2v8.2a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z"
        fill="var(--icon-folder)"
      />
    </svg>
  );
}

export function GameIcon({ systemId }: IconProps = {}): JSX.Element {
  return (
    <svg viewBox={BOX}>
      <Gamepad systemId={systemId} />
    </svg>
  );
}

/**
 * A game whose files are more than one: the gamepad with a parcel in the corner.
 *
 * The pad is drawn exactly where `GameIcon` draws it — same place, same size —
 * because the two sit in neighbouring rows and any shift of one against the
 * other reads as a broken column. So the parcel does not get a corner of its
 * own: it lands on top, and the pad is cut back around it to say which is in
 * front.
 *
 * The cut is a mask, and the mask hangs off a wrapper of its own: applied to
 * the same element as a transform it would be resolved in the transformed
 * space, and land somewhere else entirely.
 */
export function BundleIcon({ systemId }: IconProps = {}): JSX.Element {
  const cut = `bundle-cut-${useId()}`;

  return (
    <svg viewBox={BOX}>
      <mask id={cut} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="#fff" />
        {/* Black hides. Stroked as well as filled, so what is taken out is the
            parcel plus a hair of clearance all round. */}
        <rect {...PARCEL} fill="#000" stroke="#000" stroke-width="1.6" />
      </mask>

      <g mask={`url(#${cut})`}>
        <Gamepad systemId={systemId} />
      </g>
      <Parcel {...PARCEL} />
    </svg>
  );
}

/** A zip, a 7z, a rar: the bundle's parcel with nothing else in the frame. */
export function ArchiveIcon(): JSX.Element {
  return (
    <svg viewBox={BOX}>
      <Parcel {...ARCHIVE} />
    </svg>
  );
}

/** A disc image. The hole and the shine are what keep it from being a dot. */
export function DiscIcon(): JSX.Element {
  return (
    <svg viewBox={BOX}>
      <circle cx="12" cy="12" r="9.2" fill="var(--icon-disc)" />
      <path
        d="M6.2 8.3a7 7 0 0 1 4.6-3.4"
        fill="none"
        stroke="var(--icon-disc-mark)"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <circle cx="12" cy="12" r="3.3" fill="var(--icon-disc-mark)" />
      <circle cx="12" cy="12" r="1.25" fill="var(--icon-disc)" />
    </svg>
  );
}

/**
 * A picture: boxart, a screenshot, anything the library keeps as an image.
 *
 * Two hills and not one, because a single triangle at this size reads as an
 * arrow. They are clipped to the frame so the rounded corners stay rounded.
 */
export function ImageIcon(): JSX.Element {
  const frame = `photo-${useId()}`;

  return (
    <svg viewBox={BOX}>
      <clipPath id={frame}>
        <rect x="2.8" y="4.6" width="18.4" height="14.8" rx="2" />
      </clipPath>

      <g clip-path={`url(#${frame})`}>
        <rect x="2.8" y="4.6" width="18.4" height="14.8" fill="var(--icon-photo)" />
        <circle cx="8.3" cy="9.4" r="2" fill="#f9ab00" />
        <path d="M2.8 19.4 9.6 12l4 4.4 2.6-2.4 5 5.4z" fill="var(--icon-photo-hill)" />
      </g>
    </svg>
  );
}

/**
 * Saved games. A memory card rather than a floppy: the floppy is already the
 * save button of the metadata editor, and one shape cannot mean two things.
 */
export function MemoryCardIcon(): JSX.Element {
  return (
    <svg viewBox={BOX}>
      <path
        d="M6.6 2.8h6.9c.4 0 .78.16 1.06.44l2.9 2.9c.28.28.44.66.44 1.06V19.8a1.4 1.4 0 0 1-1.4 1.4H6.6a1.4 1.4 0 0 1-1.4-1.4V4.2a1.4 1.4 0 0 1 1.4-1.4z"
        fill="var(--icon-card)"
      />
      {/* Pins at the head, label at the foot: what tells a card from a page is
          that both ends are busy. */}
      <rect x="7.6" y="5.6" width="1.5" height="3.4" rx=".6" fill="var(--icon-card-mark)" />
      <rect x="10.3" y="5.6" width="1.5" height="3.4" rx=".6" fill="var(--icon-card-mark)" />
      <rect x="13" y="5.6" width="1.5" height="3.4" rx=".6" fill="var(--icon-card-mark)" />
      <rect x="7.4" y="12.6" width="7.4" height="5.6" rx=".9" fill="var(--icon-card-mark)" />
    </svg>
  );
}

/** Something written: a readme, a `.dat`, a `.json`. */
export function DocumentIcon(): JSX.Element {
  return (
    <svg viewBox={BOX}>
      <Sheet />
      <rect x="7.4" y="11.8" width="8.4" height="1.4" rx=".7" fill="var(--icon-paper-mark)" />
      <rect x="7.4" y="14.6" width="8.4" height="1.4" rx=".7" fill="var(--icon-paper-mark)" />
      <rect x="7.4" y="17.4" width="5.4" height="1.4" rx=".7" fill="var(--icon-paper-mark)" />
    </svg>
  );
}

/** A file nothing is known about, `.DS_Store` included: a page, left blank. */
export function FileIcon(): JSX.Element {
  return (
    <svg viewBox={BOX}>
      <Sheet />
    </svg>
  );
}

/**
 * The mark for a MIME type, in three steps: the type itself, then its family,
 * then the blank page.
 */
export interface IconProps {
  systemId?: string;
}

/** The icon a file's name earns it, which is the most a listing can say. */
export function iconOfName(name: string): (props?: IconProps) => JSX.Element {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (DISC_EXTS.has(ext)) return DiscIcon;
  if (SAVE_EXTS.has(ext)) return MemoryCardIcon;
  if (ARCHIVE_EXTS.has(ext)) return ArchiveIcon;
  if (IMAGE_EXTS.has(ext)) return ImageIcon;
  if (DOC_EXTS.has(ext)) return DocumentIcon;
  return FileIcon;
}

/* ---------------------------------------------------------------------------
 * Controls
 *
 * One stroke, `currentColor`, and the `icon` class that sizes them against the
 * text they sit in. Anything filled — the status marks — says so itself.
 * ------------------------------------------------------------------------- */

/** What every control icon shares, so the set holds together at any size. */
const STROKE = {
  class: 'icon',
  viewBox: BOX,
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 1.8,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': true,
} as const;

/** Points right when shut and down when open, as a disclosure has always. */
export function ChevronIcon({ open }: { open?: boolean }): JSX.Element {
  return (
    <svg {...STROKE} stroke-width="2.2">
      <path d="M9.5 5.5 16 12l-6.5 6.5" transform={open ? 'rotate(90 12 12)' : undefined} />
    </svg>
  );
}

export function PlusIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CloseIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function CheckIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="m5 12.5 4.8 4.8L19 7.5" />
    </svg>
  );
}

/** WhatsApp-style double check icon */
export function DoubleCheckIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M2 12.5l4.5 4.5L15 7.5" />
      <path d="M8 12.5l4.5 4.5L21 7.5" />
    </svg>
  );
}

/** Red cross / failure icon */
export function CrossIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function ArrowLeftIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M19.5 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowRightIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M4.5 12H19M13 6l6 6-6 6" />
    </svg>
  );
}

/** A folder with a plus in it: the new folder of the tree's toolbar. */
export function FolderPlusIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M3 6.6a1.6 1.6 0 0 1 1.6-1.6h4.3c.44 0 .86.18 1.16.5L11.5 7h7.9A1.6 1.6 0 0 1 21 8.6v8.8A1.6 1.6 0 0 1 19.4 19H4.6A1.6 1.6 0 0 1 3 17.4z" />
      <path d="M12 10.4v6M9 13.4h6" />
    </svg>
  );
}

export function TrashIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M4.5 6.5h15M9.6 6.5V4.9a1.4 1.4 0 0 1 1.4-1.4h2a1.4 1.4 0 0 1 1.4 1.4v1.6" />
      <path d="M6.6 6.5l.85 12.1a1.7 1.7 0 0 0 1.7 1.6h5.7a1.7 1.7 0 0 0 1.7-1.6l.85-12.1" />
    </svg>
  );
}

/** Four panes: the folder read as games rather than as the files it holds. */
export function GroupIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <rect x="4" y="4" width="16" height="16" rx="2.2" />
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

/** Two arrows passing: the folder renamed and sorted to match the catalogue. */
export function OrganizeIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M4 9h13M14 6l3 3-3 3M20 15H7M10 12l-3 3 3 3" />
    </svg>
  );
}

export function PencilIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M4.5 19.5h3.3L19.1 8.2a1.7 1.7 0 0 0 0-2.4l-.9-.9a1.7 1.7 0 0 0-2.4 0L4.5 16.2z" />
      <path d="m14.7 6.7 2.6 2.6" />
    </svg>
  );
}

/** The floppy nobody has held in twenty years, and everybody still reads. */
export function SaveIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M5.4 4.5h10.2L19.5 8.4v10.1a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 18.5V5.9a1.4 1.4 0 0 1 1.4-1.4z" />
      <path d="M8 4.5v5h7.2v-5M7.6 20v-5.4h8.8V20" />
    </svg>
  );
}

export function SearchIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <circle cx="11" cy="11" r="6.2" />
      <path d="m15.6 15.6 4 4" />
    </svg>
  );
}

/** The wait of a checksum being taken, which is a wait with an end in sight. */
export function HourglassIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M6.4 3.6h11.2M6.4 20.4h11.2" />
      <path d="M8 3.6v2.9c0 1.1.5 2.1 1.3 2.8L12 11.6l-2.7 2.3c-.8.7-1.3 1.7-1.3 2.8v2.9M16 3.6v2.9c0 1.1-.5 2.1-1.3 2.8L12 11.6l2.7 2.3c.8.7 1.3 1.7 1.3 2.8v2.9" />
      {/* The sand, which is what makes the shape read at a row's size. */}
      <path d="M10.1 17.6h3.8" stroke-width="2.6" />
    </svg>
  );
}

/** A cog: seven teeth around a hub, which is a gear and not a sun. */
export function GearIcon(): JSX.Element {
  return (
    <svg {...STROKE} stroke-width="1.6">
      <path d="M21.7 9.7L21.7 14.3L18.6 14.2L17.9 15.8L19.9 18.2L16.3 21L14.4 18.6L12.7 19L12.1 22L7.6 21L8.4 18L7 16.9L4.2 18.3L2.2 14.1L5.1 12.9L5.1 11.1L2.2 9.9L4.2 5.7L7 7.1L8.4 6L7.6 3L12.1 2L12.7 5L14.4 5.4L16.3 3L19.9 5.8L17.9 8.2L18.6 9.8Z" />
      <circle cx="12" cy="12" r="3.1" />
    </svg>
  );
}

/**
 * How much of a game is on disk: a full disc, a half one, an empty ring. The
 * three are one shape read at three fills, which is what makes them a scale
 * rather than three unrelated marks.
 */
export function StatusIcon({
  status,
}: {
  status: 'complete' | 'partial' | 'missing';
}): JSX.Element {
  return (
    <svg {...STROKE} stroke-width="2">
      <circle cx="12" cy="12" r="6.4" fill={status === 'complete' ? 'currentColor' : 'none'} />
      {status === 'partial' && <path d="M12 5.6a6.4 6.4 0 0 1 0 12.8z" fill="currentColor" />}
    </svg>
  );
}

/** A record exists for this file. Small on purpose: it is a footnote. */
export function DotIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A padlock, shown on tabs whose permission has not been re-granted yet. */
export function LockIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/** A circular refresh arrow, shown on remembered tabs that can be re-opened. */
export function RefreshIcon(): JSX.Element {
  return (
    <svg {...STROKE}>
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}


/** The GitHub logo mark. */
export function GithubIcon(props: JSX.SVGAttributes<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

