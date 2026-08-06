import { JSX } from 'preact';

interface SystemLogoProps {
  systemId: string;
  className?: string;
}

/**
 * Renders an authentic, high-quality vector SVG console hardware icon/logo
 * for retro gaming platforms.
 */
export function SystemLogo({ systemId, className = 'system-logo-svg' }: SystemLogoProps): JSX.Element {
  const normalized = systemId.toUpperCase();

  switch (normalized) {
    case 'NES':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="NES Console">
          {/* NES Console Main Body */}
          <rect x="8" y="32" width="112" height="68" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="3" />
          {/* Black top band */}
          <rect x="8" y="32" width="112" height="20" fill="#1e293b" />
          {/* Cartridge Door Slot */}
          <rect x="18" y="36" width="60" height="12" fill="#0f172a" rx="1" />
          <rect x="20" y="38" width="56" height="3" fill="#334155" />
          {/* Red Power / Reset Buttons */}
          <rect x="18" y="72" width="16" height="18" rx="2" fill="#94a3b8" />
          <rect x="22" y="76" width="8" height="10" rx="1" fill="#e60012" />
          <rect x="38" y="72" width="16" height="18" rx="2" fill="#94a3b8" />
          <rect x="42" y="76" width="8" height="10" rx="1" fill="#e60012" />
          {/* Controller Ports */}
          <rect x="68" y="74" width="20" height="12" rx="2" fill="#0f172a" />
          <rect x="92" y="74" width="20" height="12" rx="2" fill="#0f172a" />
          {/* Ventilation Grill Lines */}
          <line x1="84" y1="36" x2="114" y2="36" stroke="#475569" stroke-width="2" />
          <line x1="84" y1="40" x2="114" y2="40" stroke="#475569" stroke-width="2" />
          <line x1="84" y1="44" x2="114" y2="44" stroke="#475569" stroke-width="2" />
        </svg>
      );

    case 'SNES':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="SNES Console">
          {/* SNES Main Body */}
          <rect x="12" y="24" width="104" height="80" rx="12" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
          {/* Darker Center Section */}
          <rect x="24" y="24" width="80" height="56" rx="6" fill="#94a3b8" />
          {/* Cartridge Slot & Flap */}
          <rect x="32" y="32" width="64" height="14" rx="3" fill="#475569" />
          <rect x="36" y="35" width="56" height="4" rx="1" fill="#1e293b" />
          {/* Purple Power / Eject / Reset Switches */}
          <rect x="28" y="54" width="14" height="20" rx="2" fill="#8b5cf6" />
          <rect x="48" y="56" width="32" height="14" rx="2" fill="#64748b" />
          <rect x="86" y="54" width="14" height="20" rx="2" fill="#8b5cf6" />
          {/* Controller Ports Front Panel */}
          <rect x="24" y="84" width="80" height="16" rx="4" fill="#94a3b8" />
          <rect x="32" y="87" width="28" height="10" rx="3" fill="#334155" />
          <rect x="68" y="87" width="28" height="10" rx="3" fill="#334155" />
        </svg>
      );

    case 'GAMEBOY':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Game Boy Console">
          {/* Handheld Shell */}
          <path d="M32 10h64a10 10 0 0 1 10 10v78a10 10 0 0 1-10 10H50L32 94V20a10 10 0 0 1 10-10z" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
          {/* Screen Frame */}
          <rect x="40" y="20" width="48" height="38" rx="4" fill="#94a3b8" />
          <rect x="46" y="24" width="36" height="28" rx="2" fill="#8bac0f" />
          <rect x="48" y="26" width="32" height="24" fill="#9bbc0f" />
          {/* D-Pad */}
          <rect x="40" y="68" width="16" height="5" rx="1.5" fill="#334155" />
          <rect x="45.5" y="62.5" width="5" height="16" rx="1.5" fill="#334155" />
          {/* Buttons A / B */}
          <circle cx="76" cy="74" r="5" fill="#9333ea" />
          <circle cx="88" cy="67" r="5" fill="#9333ea" />
          {/* Select / Start */}
          <rect x="52" y="94" width="10" height="3" rx="1" fill="#64748b" transform="rotate(-25 57 95.5)" />
          <rect x="66" y="94" width="10" height="3" rx="1" fill="#64748b" transform="rotate(-25 71 95.5)" />
        </svg>
      );

    case 'GBC':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Game Boy Color Console">
          <path d="M32 10h64a10 10 0 0 1 10 10v78a10 10 0 0 1-10 10H50L32 94V20a10 10 0 0 1 10-10z" fill="#7e22ce" stroke="#581c87" stroke-width="3" />
          <rect x="38" y="18" width="52" height="40" rx="4" fill="#1e293b" />
          <rect x="44" y="22" width="40" height="30" rx="2" fill="#0284c7" />
          <circle cx="76" cy="74" r="5" fill="#ef4444" />
          <circle cx="88" cy="67" r="5" fill="#eab308" />
          <rect x="40" y="68" width="16" height="5" rx="1.5" fill="#0f172a" />
          <rect x="45.5" y="62.5" width="5" height="16" rx="1.5" fill="#0f172a" />
        </svg>
      );

    case 'GBA':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Game Boy Advance Console">
          {/* Top L / R Shoulder Bumpers Backing */}
          <path
            d="M24 30C24 24 36 22 50 22h28c14 0 26 2 26 8 2 8 8 16 8 34 0 18-6 26-8 34H24c-2-8-8-16-8-34 0-18 6-26 8-34z"
            fill="#d1d5db"
            stroke="#9ca3af"
            stroke-width="2"
          />
          {/* Authentic Indigo Body (Wide horizontal curve layout) */}
          <path
            d="M44 26h40c10 0 18 2 25 7 9 6 13 18 13 31 0 14-4 25-13 31-7 5-15 7-25 7H44c-10 0-18-2-25-7-9-6-13-17-13-31 0-13 4-25 13-31 7-5 15-7 25-7z"
            fill="#544697"
            stroke="#382e6e"
            stroke-width="2.5"
          />
          {/* Center Screen Bezel */}
          <path
            d="M38 34h52c6 0 10 4 10 10v38c0 10-6 14-12 14H40c-6 0-12-4-12-14V44c0-6 4-10 10-10z"
            fill="#232328"
            stroke="#17171a"
            stroke-width="1.5"
          />
          {/* Screen Display Inset */}
          <rect x="42" y="39" width="44" height="33" rx="3" fill="#121316" />
          <rect x="44" y="41" width="40" height="29" rx="1.5" fill="#1c1e24" />
          {/* D-Pad (Light Silver Cross on Left Wing) */}
          <rect x="20" y="54" width="14" height="6" rx="1.5" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.8" />
          <rect x="24" y="50" width="6" height="14" rx="1.5" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.8" />
          <circle cx="27" cy="57" r="1.5" fill="#cbd5e1" />
          {/* SELECT & START Angled Pills below D-Pad */}
          <rect x="20" y="70" width="14" height="4.5" rx="2.25" fill="#362f63" transform="rotate(25 27 72.25)" />
          <circle cx="31" cy="74" r="1.5" fill="#e2e8f0" />
          <rect x="20" y="78" width="14" height="4.5" rx="2.25" fill="#362f63" transform="rotate(25 27 80.25)" />
          <circle cx="31" cy="82" r="1.5" fill="#e2e8f0" />
          {/* A & B Action Buttons (Light Silver angled buttons on Right Wing) */}
          <circle cx="88" cy="62" r="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
          <circle cx="99" cy="54" r="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
          {/* Speaker Ventilation Grille Lines (Bottom Right) */}
          <line x1="88" y1="76" x2="99" y2="73" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
          <line x1="88" y1="80" x2="99" y2="77" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
          <line x1="88" y1="84" x2="99" y2="81" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
          <line x1="88" y1="88" x2="99" y2="85" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
          <line x1="88" y1="92" x2="99" y2="89" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      );

    case 'N64':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Nintendo 64 Console">
          {/* N64 Curved Console Body */}
          <path d="M16 40L28 20h72l12 20v56H16V40z" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
          <path d="M28 20h72v24H28V20z" fill="#334155" />
          {/* Cartridge Slot */}
          <rect x="36" y="24" width="56" height="12" rx="3" fill="#0f172a" />
          {/* N64 Jewel Logo */}
          <circle cx="64" cy="50" r="8" fill="#10b981" />
          <path d="M64 44l6 4-6 4-6-4z" fill="#ef4444" />
          {/* Controller Ports on Front */}
          <rect x="24" y="70" width="16" height="12" rx="3" fill="#0f172a" />
          <rect x="44" y="70" width="16" height="12" rx="3" fill="#0f172a" />
          <rect x="68" y="70" width="16" height="12" rx="3" fill="#0f172a" />
          <rect x="88" y="70" width="16" height="12" rx="3" fill="#0f172a" />
          {/* Feet */}
          <rect x="20" y="96" width="16" height="8" rx="2" fill="#0f172a" />
          <rect x="92" y="96" width="16" height="8" rx="2" fill="#0f172a" />
        </svg>
      );

    case 'MEGADRIVE':
    case 'GENESIS':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Mega Drive Console">
          {/* Mega Drive Main Matte Black Body */}
          <rect x="12" y="24" width="104" height="80" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
          {/* Circular Elevated Section */}
          <circle cx="64" cy="56" r="28" fill="#0f172a" stroke="#334155" stroke-width="2" />
          <circle cx="64" cy="56" r="20" fill="#1e293b" />
          {/* Cartridge Slot */}
          <rect x="36" y="30" width="56" height="12" rx="3" fill="#0f172a" />
          {/* Metallic 16-BIT Badge */}
          <text x="64" y="60" font-size="10" font-weight="bold" fill="#38bdf8" text-anchor="middle" letter-spacing="1">
            16-BIT
          </text>
          {/* Red Reset Button */}
          <circle cx="28" cy="80" r="5" fill="#ef4444" />
        </svg>
      );

    case 'MEGACD':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Mega-CD Console">
          {/* Top Console */}
          <rect x="24" y="16" width="80" height="48" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
          <circle cx="64" cy="36" r="14" fill="#0f172a" />
          {/* Bottom CD Unit */}
          <rect x="12" y="60" width="104" height="48" rx="6" fill="#334155" stroke="#0f172a" stroke-width="3" />
          <rect x="24" y="76" width="80" height="16" rx="3" fill="#0f172a" />
          <circle cx="94" cy="84" r="3" fill="#22c55e" />
        </svg>
      );

    case 'S32X':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="32X Console">
          <path d="M24 32h80l-12 56H36L24 32z" fill="#ef4444" stroke="#7f1d1d" stroke-width="3" />
          <rect x="38" y="44" width="52" height="16" rx="3" fill="#7f1d1d" />
          <text x="64" y="56" font-size="12" font-weight="bold" fill="#fca5a5" text-anchor="middle">
            32X
          </text>
        </svg>
      );

    case 'SATURN':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Sega Saturn Console">
          <rect x="12" y="24" width="104" height="80" rx="10" fill="#334155" stroke="#1e293b" stroke-width="3" />
          {/* Round CD Lid */}
          <circle cx="64" cy="58" r="26" fill="#1e293b" stroke="#475569" stroke-width="2" />
          <circle cx="64" cy="58" r="10" fill="#6366f1" />
          {/* Power / Open Buttons */}
          <circle cx="28" cy="40" r="6" fill="#64748b" />
          <circle cx="100" cy="40" r="6" fill="#64748b" />
        </svg>
      );

    case 'PSX':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="PlayStation Console">
          {/* PS1 Classic Gray Body */}
          <rect x="12" y="24" width="104" height="80" rx="10" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
          {/* Circular CD Lid in Center */}
          <circle cx="64" cy="56" r="26" fill="#94a3b8" stroke="#475569" stroke-width="2" />
          <circle cx="64" cy="56" r="12" fill="#64748b" />
          {/* Power / Open / Reset Buttons */}
          <circle cx="28" cy="42" r="7" fill="#64748b" />
          <circle cx="100" cy="42" r="7" fill="#64748b" />
          <circle cx="100" cy="74" r="5" fill="#64748b" />
          {/* Front Dual Memory Card & Controller Slots */}
          <rect x="24" y="88" width="36" height="10" rx="2" fill="#475569" />
          <rect x="68" y="88" width="36" height="10" rx="2" fill="#475569" />
        </svg>
      );

    case 'SMS':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Master System Console">
          <path d="M12 28L28 16h72l16 12v68H12V28z" fill="#0284c7" stroke="#0369a1" stroke-width="3" />
          <rect x="24" y="32" width="80" height="24" fill="#0f172a" />
          <line x1="24" y1="64" x2="104" y2="64" stroke="#ef4444" stroke-width="4" />
        </svg>
      );

    case 'GAMEGEAR':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Game Gear Console">
          <rect x="10" y="28" width="108" height="72" rx="16" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
          <rect x="42" y="36" width="44" height="34" rx="4" fill="#2563eb" />
          <rect x="46" y="40" width="36" height="26" fill="#0f172a" />
          <circle cx="26" cy="64" r="7" fill="#ef4444" />
          <circle cx="98" cy="58" r="4" fill="#eab308" />
          <circle cx="98" cy="70" r="4" fill="#22c55e" />
        </svg>
      );

    case 'TGFX16':
    case 'TGFX16-CD':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="TurboGrafx Console">
          <rect x="16" y="24" width="96" height="80" rx="8" fill="#d97706" stroke="#78350f" stroke-width="3" />
          <rect x="28" y="32" width="72" height="32" rx="4" fill="#78350f" />
          <text x="64" y="52" font-size="14" font-weight="bold" fill="#fef3c7" text-anchor="middle">
            TURBO
          </text>
        </svg>
      );

    case 'NEOGEO':
    case 'NEOGEO-CD':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Neo Geo Console">
          {/* Main Charcoal Console Chassis */}
          <rect x="10" y="20" width="108" height="88" rx="6" fill="#26272b" stroke="#141518" stroke-width="3" />

          {/* Top Ventilation Ridge & Inset */}
          <path d="M10 20h108v16H10z" fill="#1d1e22" />
          <path d="M22 20v16M26 20v16M30 20v16M98 20v16M102 20v16M106 20v16" stroke="#141518" stroke-width="1.5" />
          {/* Horizontal Vent Lines */}
          <line x1="38" y1="25" x2="90" y2="25" stroke="#141518" stroke-width="1.5" />
          <line x1="38" y1="28" x2="90" y2="28" stroke="#141518" stroke-width="1.5" />
          <line x1="38" y1="31" x2="90" y2="31" stroke="#141518" stroke-width="1.5" />

          {/* Top-Left SNK Logo */}
          <text x="14" y="32" font-size="7" font-weight="900" fill="#ffffff" letter-spacing="0.5">
            SNK
          </text>

          {/* Central Cartridge Slot Recess */}
          <rect x="22" y="42" width="84" height="24" rx="4" fill="#18191c" stroke="#101113" stroke-width="1.5" />
          <rect x="28" y="48" width="72" height="12" rx="2" fill="#0d0e10" />
          <line x1="28" y1="54" x2="100" y2="54" stroke="#26272b" stroke-width="1" />

          {/* Bottom Left Joystick Recess & Buttons */}
          <ellipse cx="26" cy="80" rx="10" ry="12" fill="#1c1d20" stroke="#141518" stroke-width="1" />
          <circle cx="26" cy="78" r="4.5" fill="#121315" stroke="#333438" stroke-width="1" />
          <text x="26" y="96" font-size="3" font-weight="700" fill="#94a3b8" text-anchor="middle">
            RESET
          </text>

          {/* Center Gold Typography Badge */}
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

          {/* Bottom Right Memory Card In Slot Indicator */}
          <polygon points="98,90 102,90 100,93" fill="#cbd5e1" />
          <text x="100" y="88" font-size="2.6" font-weight="700" fill="#94a3b8" text-anchor="middle">
            CARD IN
          </text>
        </svg>
      );

    case 'ATARI2600':
    case 'ATARI5200':
    case 'ATARI7800':
    case 'ATARILYNX':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Atari Console">
          <rect x="12" y="28" width="104" height="72" rx="8" fill="#ea580c" stroke="#9a3412" stroke-width="3" />
          <rect x="12" y="60" width="104" height="16" fill="#78350f" />
          <path d="M64 36v32M48 68c0-16 8-24 16-24s16 8 16 24" fill="none" stroke="#fff" stroke-width="5" />
        </svg>
      );

    case 'WONDERSWAN':
    case 'WONDERSWANCOLOR':
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="WonderSwan Console">
          <rect x="20" y="24" width="88" height="80" rx="14" fill="#06b6d4" stroke="#155e75" stroke-width="3" />
          <rect x="34" y="32" width="60" height="36" rx="4" fill="#155e75" />
          <circle cx="34" cy="82" r="4" fill="#fff" />
          <circle cx="46" cy="82" r="4" fill="#fff" />
          <circle cx="82" cy="82" r="4" fill="#fff" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 128 128" class={className} aria-label="Retro Console">
          <rect x="16" y="28" width="96" height="72" rx="10" fill="var(--surface-3)" stroke="var(--border)" stroke-width="3" />
          <circle cx="44" cy="64" r="10" fill="var(--icon-pad-mark)" />
          <circle cx="80" cy="58" r="6" fill="#ef4444" />
          <circle cx="88" cy="70" r="6" fill="#3b82f6" />
        </svg>
      );
  }
}
