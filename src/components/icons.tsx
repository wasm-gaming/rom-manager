import { JSX } from 'preact';
import { useId } from 'preact/hooks';

/**
 * The marks of the file tree, drawn rather than typed.
 *
 * They keep the emoji they replace — a folder, a gamepad, a parcel — and its
 * colours, which is the whole reason they are not one flat stroke: what tells a
 * folder from a game at a glance is the amber against the grey. The greys and
 * the ambers come from the palette, so each theme gets a tone that reads on its
 * own background; the four face buttons are the same in both, being colours
 * that hold up against white and against near-black alike.
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
