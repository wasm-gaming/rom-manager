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
          <path d="M16 38c0-10 8-18 18-18h60c10 0 18 8 18 18v52c0 10-8 18-18 18H34c-10 0-18-8-18-18V38z" fill="#2563eb" stroke="#1d4ed8" stroke-width="3" />
          <rect x="34" y="28" width="60" height="44" rx="6" fill="#0f172a" />
          <rect x="38" y="32" width="52" height="36" rx="3" fill="#0369a1" />
          <circle cx="102" cy="46" r="5" fill="#cbd5e1" />
          <circle cx="108" cy="58" r="5" fill="#cbd5e1" />
          <rect x="22" y="48" width="14" height="5" rx="1.5" fill="#cbd5e1" />
          <rect x="26.5" y="43.5" width="5" height="14" rx="1.5" fill="#cbd5e1" />
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
          <rect x="12" y="24" width="104" height="80" rx="8" fill="#dc2626" stroke="#991b1b" stroke-width="3" />
          <rect x="24" y="36" width="80" height="20" rx="3" fill="#7f1d1d" />
          <text x="64" y="50" font-size="12" font-weight="900" fill="#fef08a" text-anchor="middle">
            NEO-GEO
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
