import { JSX } from 'preact';
import { useId } from 'preact/hooks';

/**
 * The icons, drawn rather than typed.
 *
 * Two families, because two jobs.
 *
 * What a row *is* — a folder, a game, a bundle — keeps the colours of the emoji
 * it replaces: what tells a folder from a game at a glance is the amber against
 * the grey. Those come from the palette, so each theme gets a tone that reads on
 * its own background.
 *
 * What a control *does* is drawn in one stroke of `currentColor` and sized in
 * `em`, so every one of them takes the colour and the size of the text it stands
 * among — a button that dims when disabled dims its icon with it, and nothing
 * has to be restyled twice.
 */

const BOX = '0 0 24 24';

/** The gamepad's own shapes, shared by the plain icon and the bundle. */
function Gamepad(): JSX.Element {
  return (
    <>
      <path
        d="M8 5.6H16C19.6 5.6 21.4 8 22 11.6L22.4 14.2C22.9 17.4 19.6 18.9 17.9 16.6L16 14H8L6.1 16.6C4.4 18.9 1.1 17.4 1.6 14.2L2 11.6C2.6 8 4.4 5.6 8 5.6Z"
        fill="var(--icon-pad)"
      />
      {/* The D-pad: two rounded bars crossed, which stays a cross down at the
          size a row gives it, where a drawn outline would fill in. */}
      <rect x="6.4" y="7.4" width="2" height="5.2" rx=".7" fill="var(--icon-pad-mark)" />
      <rect x="4.8" y="9" width="5.2" height="2" rx=".7" fill="var(--icon-pad-mark)" />
      <circle cx="16.5" cy="7.9" r="1.15" fill="#f9ab00" />
      <circle cx="18.8" cy="10.1" r="1.15" fill="#e94235" />
      <circle cx="16.5" cy="12.3" r="1.15" fill="#34a853" />
      <circle cx="14.2" cy="10.1" r="1.15" fill="#4285f4" />
    </>
  );
}

/** Where the bundle's parcel sits, and what the pad is cut back by to fit it. */
const PARCEL = { x: 15.1, y: 14.9, width: 7.8, height: 7, rx: 1.1 } as const;

/** The parcel of a bundle, sized to sit in a corner as a sub-icon. */
function Parcel(): JSX.Element {
  return (
    <>
      <rect {...PARCEL} fill="var(--icon-box)" />
      <rect x="15.1" y="17" width="7.8" height="1.6" fill="var(--icon-box-tape)" />
      <rect x="18.1" y="14.9" width="1.6" height="2.1" fill="var(--icon-box-tape)" />
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

export function GameIcon(): JSX.Element {
  return (
    <svg viewBox={BOX}>
      <Gamepad />
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
export function BundleIcon(): JSX.Element {
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
        <Gamepad />
      </g>
      <Parcel />
    </svg>
  );
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
