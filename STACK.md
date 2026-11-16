# Technology Stack & Architecture

This document describes the technical stack, codebase architecture, build tools, dataset pipeline, and functional/UI requirements implemented in the `rom-manager` project.

---

## 1. Core Architecture & Design Principles

- **100% Client-Side / Zero Backend**: Operates strictly inside the user's browser. Files are never uploaded to any remote server.
- **The library lives in OPFS**: the default storage, on every device, is the browser's origin-private file system (`rom-manager/library/`): no prompts, no permission lost on reload, phones included. ROMs are added one by one (file picker or drop). On desktop Chromium a real folder can also be opened (**File System Access API**) and **synced two-way** with the library; cloud drives (Google Drive, Box) are to join the same sync later.
- **Hash-Based Identification**: Deterministic ROM identification via CRC32/MD5/SHA1 checksums checked against DAT catalogs (No-Intro / Redump). Local file names are never trusted as absolute authority.
- **Non-Destructive Plan-First Operations**: File moving and renaming operations are calculated as a **Plan** first, requiring user preview and explicit approval before any disk modification takes place.
- **Curated Collections Protection**: Dedicated user-created collection subfolders are strictly unmanaged and preserved untouched.

---

## 2. Technology Stack

### Frontend & UI
- **Language**: TypeScript (`^5.6.2`), targeting ESNext / modern web platforms.
- **UI Library**: Preact (`^10.24.2`) for lightweight component rendering.
- **Routing**: `preact-router` (`^4.1.2`).
- **State Management**: `@preact/signals` (`^1.3.0`) for reactive local and global state.
- **Styling**: Vanilla CSS with modern CSS variables, CSS grid/flexbox layouts, responsive design, dark theme styling, glassmorphism, and hardware-accelerated animations.
- **Responsive rules** (`src/styles/index.css`):
  - **One layout switch, at 768px**: at 768px and below (or a phone held sideways:
    `max-height: 500px` + `pointer: coarse`) the explorer becomes the swiped panels (`PHONE_QUERY`
    in `ROMExplorer.tsx` and the CSS `@media` match).
  - The design is checked at 460px.
  - **Below 460px the root font size is `100vw / 28.75`** (16px at 460px): the 460px layout
    shrinks linearly instead of reflowing.
  - That only works because **every measure is in `rem`**. Write new CSS in `rem`: `px` only for
    1px hairlines and inside media queries, which are read against the browser's default font
    size.

### Web APIs & Hashing
- **File System Access API**: Native Chromium directory handle management, file streaming, and in-place file system operations.
- **WASM Hashing**: `hash-wasm` (`^4.12.0`) for WebAssembly-powered, high-performance client-side checksum calculation (CRC32, MD5, SHA1).
- **OPFS**: the library's storage (`OPFSAdapter`), with `navigator.storage.persist()` asked on the first import and usage / quota shown in Preferences (`LibraryStorageService`).
- **VFS Sync**: `@cloudauthn/vfs-sync` (`^0.1.24`) — the storage layer for both the library (`OPFSAdapter`) and opened folders (`FSAAdapter`), and the two-way `sync()` between them (conflicting edits kept as copies).

### Build Tools & Tooling
- **Application Bundler & Dev Server**: Vite (`^5.4.8`) via `@preact/preset-vite` (`^2.8.2`).
- **Embeddable Library Bundler**: `tsup` (`^8.3.5`) compiling `src/index.ts` to `dist/index.js` and `dist/index.d.ts`.
- **Scripts Runtime**: Node.js (`>=24.0.0`) using ES modules (`"type": "module"`).
- **Linter**: `oxlint` (`^1.0.0`) for ultra-fast TypeScript/JavaScript linting.
- **Test Runner**: Vitest (`^2.1.8`) with `@vitest/coverage-v8` for unit testing across core modules and services.

---

## 3. Project Structure & Layering

```
rom-manager/
├── src/
│   ├── app.tsx                 # Main application entry component
│   ├── main.tsx                # DOM mounting & root entrypoint
│   ├── index.html              # HTML shell & font definitions
│   ├── components/             # Reusable UI components
│   │   ├── FileTree/           # File tree component & sub-elements
│   │   ├── BrandLogo.tsx       # Brand header logo rendering
│   │   ├── SystemLogos.tsx     # Console system logo rendering
│   │   ├── Tabs.tsx            # Navigation tab bar
│   │   ├── WelcomeCardIllustrations.tsx # Custom Landing SVG illustrations
│   │   └── icons.tsx           # SVG icon registry
│   ├── views/                  # Primary screen layouts
│   │   └── ROMExplorer/        # Main ROM explorer workspace view & panels
│   ├── core/                   # Pure, side-effect-free domain logic
│   │   ├── rom-grouping.ts     # Title grouping & name parsing logic
│   │   ├── rom-matching.ts     # DAT checksum matching engine
│   │   ├── rom-regions.ts      # Region parsing & fallback preferences
│   │   ├── rom-organize.ts     # File rename/move plan generation
│   │   ├── rom-covers.ts       # Cover matching & thumbnail resolution
│   │   ├── rom-media.ts        # Cartridge vs Disc medium behavior
│   │   ├── system-info.ts      # 24 MiSTer console definitions & DAT keys
│   │   ├── wizard-tree.ts      # Wizard tree state transform
│   │   └── zip-directory.ts    # Romset member hash verification
│   └── services/               # Stateful services & async operations
│       ├── RomLibraryService.ts # Local filesystem scanner & organizer
│       ├── ROMDatasetService.ts # DAT JSON dataset loader & indexer
│       ├── RomIntakeService.ts  # File drop intake processing
│       ├── HandleStoreService.ts# IndexedDB persistent handle storage
│       ├── CoverService.ts     # Cover downloading & caching
│       └── ArchiveService.ts   # Zip/Archive reading and member hashing
├── scripts/                    # Dataset compilation & maintenance scripts
│   ├── download-dats.mjs       # Downloads reference No-Intro/Redump DATs
│   ├── fetch-covers.mjs        # Lists libretro-thumbnails repositories
│   ├── build-datasets.mjs      # Converts XML DATs to static JSON datasets
│   ├── json-to-sqlite.mjs      # Exports catalog datasets to SQLite
│   └── verify-romsets.mjs      # Verification CLI for physical romsets
├── static/datasets/            # Pre-compiled JSON datasets for retro systems
└── SESSIONS/                   # Chronological session specifications & audit trail
```

---

## 4. Applied Functional Requirements

### Hardware Systems & Medium Rules
- **24 Mainstream MiSTer Systems**: Mapped by exact MiSTer folder names under `/games` (e.g., `Nintendo - SNES`, `Sony - PlayStation`, `SNK - Neo Geo`).
- **Medium Organization**:
  - **Cartridge Systems**: Organized in flat file structures (`<System>/<Game>.<variant>.<ext>`).
  - **Disc Systems**: Organized in dedicated folders per game and subfolders per variant (`<System>/<Game>/<variant>/...`).
  - **Neo Geo / Romsets**: Zip/Folder chip dump checksum validation based on member file checksums rather than single archive checksum.

### The library's layout (a contract other apps read)
- OPFS `rom-manager/library/` holds what a picked folder would: `<System>/<file>` (System = the dataset folder name: `GBA`, `GAMEBOY`, `SNES`, `MegaDrive`…), the `.meta/` sidecar below, and vfs-sync's `.vfs/` control folder.
- Served from the same origin (play.germade.dev `/roms/`), play.germade reads this library to play from it; changes to this layout are breaking for it.

### Metadata & Persistence (`.meta/`)
- Metadata lives entirely outside ROM folders in `.meta/`:
  - `.meta/<system>/<Game>.json`: Editable per-game metadata.
  - `.meta/<system>/<Game>.<region>.case.png`: Cached cover art images per region.
  - `.meta/<system>/scan.json`: Local hash calculation cache to avoid re-hashing unchanged files.
  - `.meta/wizard.json`: Per-folder explorer settings and configuration.

### Title Grouping & Normalization
- **Base Title Parsing**: Parses DAT titles to extract base game titles, stripping flags, revisions, languages, and regional tags.
- **Roman Numeral Normalization**: Normalizes Roman numerals (e.g., *Final Fantasy III* vs *Final Fantasy 3*) for accurate game group key resolution.
- **Variant Identification**: Grouping under unified Game entries with variants identified by region, language, and revision tags.

### Explorer Modes
- **Flat Mode**: Raw file system tree listing showing disk structure as-is.
- **Wizard Mode**: Consolidated game view displaying one row per game, folding recognized ROM variants into an expandable drawer with inline action controls.

---

## 5. Applied UI / UX Requirements & Features

- **Initial Landing View**:
  - Welcome landing view with an infinite looping 3-row horizontal scrolling marquee carousel (`.welcome-systems`).
  - 2x2 grid welcome cards featuring custom SVG illustrations.
  - Footer containing Legal info and GitHub link with SVG branding icon.
- **Directory Handle Persistence & Refresh**:
  - Remembers and restores last opened directory handles via `HandleStoreService`.
  - Header tab refresh button allows switching back to the landing view or reloading the persisted directory handle.
- **FileTree Split Item Layout**:
  - Restructured `.tree-item` into a left toggle container (caret, icon, label as a single click target for expanding/selecting) and a right container for inline action buttons.
- **Cover Display & Active Variant Indicator**:
  - Fixed aspect-ratio container for cover art to eliminate layout shifts during image loading.
  - Region selector buttons (`EU`, `US`, `JP`) in fixed display order with fallback priority based on region preference.
  - Visual active cover indicator attached to the variant matching the displayed cover.
  - Automatic filtering preventing missing game variants (`.variant.status-missing`) from becoming active cover candidates.
- **Granular File Consolidation**:
  - Support for game-level consolidation plan generation.
  - Inline `.tree-organize` action button to consolidate an individual variant file independently.
  - Preservation of active game selection after variant consolidation operations.
- **Keyboard Navigation**:
  - Native arrow key navigation (Up/Down) when focus is outside text inputs to iterate through games and files seamlessly.
