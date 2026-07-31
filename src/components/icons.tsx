import { JSX } from 'preact';
import { useId } from 'preact/hooks';
import { DISC_MIME, mimeOf, ROM_MIME, SAVE_MIME } from '../core/file-types';

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
 *
 * The family step is what keeps this table from needing a row for every image
 * format anyone ever ships — and what makes the unlisted ones degrade to
 * something true rather than to something wrong.
 */
const ICONS_BY_MIME: Readonly<Record<string, () => JSX.Element>> = {
  [ROM_MIME]: GameIcon,
  [DISC_MIME]: DiscIcon,
  [SAVE_MIME]: MemoryCardIcon,
  'application/zip': ArchiveIcon,
  'application/x-7z-compressed': ArchiveIcon,
  'application/vnd.rar': ArchiveIcon,
  'application/gzip': ArchiveIcon,
  'application/json': DocumentIcon,
  'application/xml': DocumentIcon,
};

/** Whole families, for the types that are all drawn the same way. */
const ICONS_BY_FAMILY: Readonly<Record<string, () => JSX.Element>> = {
  image: ImageIcon,
  text: DocumentIcon,
};

/** The icon a file's name earns it, which is the most a listing can say. */
export function iconOfName(name: string): () => JSX.Element {
  const mime = mimeOf(name);

  return ICONS_BY_MIME[mime] ?? ICONS_BY_FAMILY[mime.split('/')[0]] ?? FileIcon;
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
