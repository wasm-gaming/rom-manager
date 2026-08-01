import { JSX } from 'preact';

interface SystemLogoProps {
  systemId: string;
  className?: string;
}

/**
 * Renders a stylized vector SVG icon/logo for a given gaming system platform.
 */
export function SystemLogo({ systemId, className = 'system-logo-svg' }: SystemLogoProps): JSX.Element {
  const normalized = systemId.toUpperCase();

  switch (normalized) {
    case 'NES':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="NES Logo">
          <rect x="4" y="16" width="56" height="32" rx="4" fill="#334155" />
          <rect x="8" y="20" width="48" height="10" fill="#0f172a" />
          <rect x="12" y="34" width="14" height="10" rx="1" fill="#e60012" />
          <rect x="16" y="32" width="6" height="14" rx="1" fill="#e60012" />
          <circle cx="36" cy="38" r="3" fill="#e60012" />
          <circle cx="46" cy="38" r="3" fill="#e60012" />
        </svg>
      );

    case 'SNES':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="SNES Logo">
          <rect x="6" y="14" width="52" height="36" rx="8" fill="#94a3b8" />
          <rect x="12" y="20" width="40" height="24" rx="4" fill="#cbd5e1" />
          <circle cx="42" cy="27" r="2.5" fill="#3b82f6" />
          <circle cx="47" cy="32" r="2.5" fill="#e60012" />
          <circle cx="37" cy="32" r="2.5" fill="#eab308" />
          <circle cx="42" cy="37" r="2.5" fill="#22c55e" />
          <rect x="18" y="29" width="10" height="3" rx="1" fill="#475569" />
          <rect x="21.5" y="25.5" width="3" height="10" rx="1" fill="#475569" />
        </svg>
      );

    case 'GAMEBOY':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Game Boy Logo">
          <path d="M14 6h36a6 6 0 0 1 6 6v38a6 6 0 0 1-6 6H24L14 50V12a6 6 0 0 1 6-6z" fill="#cbd5e1" />
          <rect x="20" y="12" width="24" height="18" rx="2" fill="#8bac0f" />
          <rect x="22" y="14" width="20" height="14" fill="#9bbc0f" />
          <circle cx="40" cy="38" r="2.5" fill="#9333ea" />
          <circle cx="46" cy="35" r="2.5" fill="#9333ea" />
          <rect x="22" y="37" width="8" height="2.5" rx="1" fill="#475569" />
          <rect x="24.75" y="34.25" width="2.5" height="8" rx="1" fill="#475569" />
        </svg>
      );

    case 'GBC':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Game Boy Color Logo">
          <path d="M14 6h36a6 6 0 0 1 6 6v38a6 6 0 0 1-6 6H24L14 50V12a6 6 0 0 1 6-6z" fill="#9333ea" />
          <rect x="18" y="10" width="28" height="20" rx="2" fill="#1e293b" />
          <rect x="21" y="13" width="22" height="14" rx="1" fill="#0284c7" />
          <circle cx="40" cy="38" r="2.5" fill="#ef4444" />
          <circle cx="46" cy="35" r="2.5" fill="#eab308" />
          <rect x="22" y="37" width="8" height="2.5" rx="1" fill="#cbd5e1" />
          <rect x="24.75" y="34.25" width="2.5" height="8" rx="1" fill="#cbd5e1" />
        </svg>
      );

    case 'GBA':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Game Boy Advance Logo">
          <path d="M8 20c0-6 4-10 10-10h28c6 0 10 4 10 10v24c0 6-4 10-10 10H18c-6 0-10-4-10-10V20z" fill="#3b82f6" />
          <rect x="18" y="16" width="28" height="20" rx="3" fill="#1e293b" />
          <rect x="20" y="18" width="24" height="16" rx="1" fill="#0369a1" />
          <circle cx="50" cy="27" r="2.5" fill="#cbd5e1" />
          <circle cx="53" cy="33" r="2.5" fill="#cbd5e1" />
          <rect x="12" y="27" width="8" height="2.5" rx="1" fill="#cbd5e1" />
          <rect x="14.75" y="24.25" width="2.5" height="8" rx="1" fill="#cbd5e1" />
        </svg>
      );

    case 'N64':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Nintendo 64 Logo">
          <path d="M12 16l16-8 24 12v28L28 56 12 44V16z" fill="#10b981" />
          <path d="M28 8v48L12 44V16L28 8z" fill="#059669" />
          <path d="M28 8l24 12-16 8L12 16 28 8z" fill="#34d399" />
          <path d="M28 32l12-6v16l-12 6V32z" fill="#eab308" />
          <path d="M28 32L16 26v16l12 6V32z" fill="#ef4444" />
          <path d="M28 32l12-6 12 6-24 12z" fill="#3b82f6" />
        </svg>
      );

    case 'POKEMONMINI':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Pokémon Mini Logo">
          <rect x="12" y="12" width="40" height="40" rx="10" fill="#f59e0b" />
          <rect x="20" y="18" width="24" height="16" rx="2" fill="#78350f" />
          <circle cx="44" cy="40" r="3" fill="#ef4444" />
          <circle cx="22" cy="40" r="3" fill="#3b82f6" />
        </svg>
      );

    case 'MEGADRIVE':
    case 'GENESIS':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Mega Drive Logo">
          <rect x="4" y="14" width="56" height="36" rx="6" fill="#1e293b" />
          <circle cx="32" cy="32" r="14" fill="#0f172a" stroke="#475569" stroke-width="2" />
          <path d="M12 24h4v16h-4zM50 24h4v16h-4z" fill="#cbd5e1" />
          <text x="32" y="36" font-size="9" font-weight="bold" fill="#38bdf8" text-anchor="middle">
            16-BIT
          </text>
        </svg>
      );

    case 'MEGACD':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Mega-CD Logo">
          <rect x="4" y="12" width="56" height="40" rx="6" fill="#334155" />
          <circle cx="32" cy="32" r="16" fill="#0f172a" />
          <circle cx="32" cy="32" r="6" fill="#334155" />
          <circle cx="32" cy="32" r="2" fill="#0f172a" />
        </svg>
      );

    case 'S32X':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="32X Logo">
          <path d="M12 18h40l-6 28H18L12 18z" fill="#ef4444" />
          <rect x="20" y="24" width="24" height="10" rx="2" fill="#7f1d1d" />
          <text x="32" y="32" font-size="8" font-weight="bold" fill="#fca5a5" text-anchor="middle">
            32X
          </text>
        </svg>
      );

    case 'SATURN':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Sega Saturn Logo">
          <rect x="6" y="14" width="52" height="36" rx="8" fill="#475569" />
          <ellipse cx="32" cy="32" rx="20" ry="8" fill="none" stroke="#e2e8f0" stroke-width="3" />
          <circle cx="32" cy="32" r="10" fill="#6366f1" />
        </svg>
      );

    case 'PSX':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="PlayStation Logo">
          <path d="M26 12v36l12-4V22L26 12z" fill="#ef4444" />
          <path d="M26 44c-8 0-14-3-14-6s6-6 14-6v12z" fill="#3b82f6" />
          <path d="M26 48c10 0 18-3 18-6s-8-6-18-6v12z" fill="#eab308" />
        </svg>
      );

    case 'SMS':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Master System Logo">
          <rect x="6" y="14" width="52" height="36" rx="4" fill="#0284c7" />
          <rect x="12" y="20" width="40" height="12" fill="#0f172a" />
          <line x1="12" y1="36" x2="52" y2="36" stroke="#ef4444" stroke-width="3" />
        </svg>
      );

    case 'GAMEGEAR':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Game Gear Logo">
          <rect x="6" y="16" width="52" height="32" rx="10" fill="#1e293b" />
          <rect x="22" y="20" width="20" height="16" rx="2" fill="#2563eb" />
          <circle cx="15" cy="30" r="4" fill="#ef4444" />
          <circle cx="49" cy="28" r="2.5" fill="#eab308" />
          <circle cx="49" cy="34" r="2.5" fill="#22c55e" />
        </svg>
      );

    case 'TGFX16':
    case 'TGFX16-CD':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="TurboGrafx-16 Logo">
          <rect x="8" y="14" width="48" height="36" rx="4" fill="#d97706" />
          <rect x="14" y="20" width="36" height="14" rx="2" fill="#78350f" />
          <text x="32" y="31" font-size="8" font-weight="bold" fill="#fef3c7" text-anchor="middle">
            TURBO
          </text>
        </svg>
      );

    case 'NEOGEO':
    case 'NEOGEO-CD':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Neo Geo Logo">
          <rect x="6" y="14" width="52" height="36" rx="6" fill="#dc2626" />
          <text x="32" y="32" font-size="10" font-weight="900" fill="#fef08a" text-anchor="middle">
            NEO-GEO
          </text>
          <rect x="12" y="38" width="40" height="4" fill="#991b1b" />
        </svg>
      );

    case 'ATARI2600':
    case 'ATARI5200':
    case 'ATARI7800':
    case 'ATARILYNX':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Atari Logo">
          <rect x="6" y="14" width="52" height="36" rx="6" fill="#ea580c" />
          <path d="M32 20v24M24 44c0-12 4-20 8-20s8 8 8 20" fill="none" stroke="#fff" stroke-width="4" />
        </svg>
      );

    case 'WONDERSWAN':
    case 'WONDERSWANCOLOR':
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="WonderSwan Logo">
          <rect x="10" y="14" width="44" height="36" rx="8" fill="#06b6d4" />
          <rect x="18" y="20" width="28" height="16" rx="2" fill="#155e75" />
          <circle cx="18" cy="42" r="2" fill="#fff" />
          <circle cx="24" cy="42" r="2" fill="#fff" />
          <circle cx="42" cy="42" r="2" fill="#fff" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 64 64" class={className} aria-label="Retro System Logo">
          <rect x="8" y="16" width="48" height="32" rx="6" fill="var(--icon-pad)" />
          <circle cx="24" cy="32" r="5" fill="var(--icon-pad-mark)" />
          <circle cx="42" cy="28" r="3" fill="#ef4444" />
          <circle cx="46" cy="34" r="3" fill="#3b82f6" />
        </svg>
      );
  }
}
