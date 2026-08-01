# Project Thesaurus

This document defines the canonical terms and domain concepts used in the `rom-manager` project to reduce ambiguity when discussing specifications, writing code, and collaborating.

---

## Domain & Hierarchy

### System
A supported retro gaming console or hardware platform (e.g., `Nintendo - SNES`, `Sony - PlayStation`). Systems are identified by their canonical MiSTer folder name under `/games`.

### Game (Base Title)
A unified game entry representing all regional, language, and revision releases of a game title for a given System (e.g., *Super Mario World*). Multiple ROM files belonging to different regions or revisions resolve to a single Game.

### Variant (ROM Variant)
A specific release, regional edition, or revision of a Game defined by DAT metadata (e.g., `USA`, `Europe (En,Fr,De)`, `Rev 1`, `Disc 1`).

### Medium
The physical media category of a System (`cartridge` vs. `disc`), which dictates how ROM files are organized on disk:
- **Cartridge Systems**: Organized in flat file structures (`<System>/<Game>.<variant>.<ext>`).
- **Disc Systems**: Organized in dedicated folders per game and subfolders per variant (`<System>/<Game>/<variant>/...`).

---

## File Operations & Workflow

### Consolidate / Normalize
The action of renaming and relocating unorganized or raw ROM files into their canonical naming format and folder structure based on their checksum match against the DAT.

### Intake / Intake Flow
The process of dropping or adding unorganized ROM files into a System folder so the manager can scan, hash-match, and categorize them into their respective Game and Variant entries.

### Plan / Operation Plan
A non-destructive, two-phase preview of proposed file system changes (renames and moves). The plan is presented to the user for explicit review and approval before any actual file operations are performed.

---

## Identification & Data

### DAT (Data Access Tool File)
A reference database (No-Intro, Redump) containing canonical ROM checksums (CRC32, MD5, SHA-1) and standardized titles used for deterministic identification.

### Romset
A collection of member files or chip dumps that collectively form a single playable game entity (e.g., Neo Geo / Arcade ZIP archives), identified by the combined hashes of its member files rather than a single file hash.

### Metadata Layer (`.meta/`)
The reserved directory structure stored outside ROM folders that houses editable metadata (`<Game>.json`), cached cover art images (`<Game>.<region>.case.png`), scan cache (`scan.json`), and folder configurations (`wizard.json`).

---

## Interface & Display

### Explorer Modes
The two primary viewing modes of the file explorer:
- **Flat Mode**: Displays the raw directory listing and actual files exactly as they exist on disk.
- **Wizard Mode**: Displays recognized ROMs grouped by Game and Variant, presenting a consolidated one-row-per-game view.

### Cover Art
Box art or sleeve image associated with a specific Game and Region (EU, US, JP), fetched from thumbnail repositories or added manually by the user.

### Curated Collection
A custom user-created subfolder or playlist of ROMs. The ROM Manager explicitly ignores curated collection folders to avoid disturbing user-defined arrangements.
