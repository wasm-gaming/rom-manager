import { JSX } from 'preact';
import { BrandLogo } from '@/components/BrandLogo';
import { SystemLogo } from '@/components/SystemLogos';
import { FolderPlusIcon, GithubIcon } from '@/components/icons';
import {
  HashIllustration,
  GroupingIllustration,
  CoversIllustration,
  ConsolidateIllustration,
} from '@/components/WelcomeCardIllustrations';
import { getAllSystemsInfo } from '@/core/system-info';
import { t } from '@/services/I18nService';

interface WelcomePanelProps {
  onOpenFolder: () => void;
  /** True while the folder picker is up or the folder is being read. */
  loading?: boolean;
}

/** What the app is, said once, for the one screen where nothing else is. */
const CAPABILITIES = ['hash', 'grouping', 'covers', 'consolidate'] as const;

const CAPABILITY_ILLUSTRATIONS = {
  hash: HashIllustration,
  grouping: GroupingIllustration,
  covers: CoversIllustration,
  consolidate: ConsolidateIllustration,
} as const;

const STEPS = ['step1', 'step2', 'step3'] as const;

const TOP_ROW_IDS = ['GAMEBOY', 'GBC', 'GameGear', 'SMS', 'TGFX16', 'Atari2600', 'WonderSwan', 'PokemonMini'];
const MIDDLE_ROW_IDS = ['NES', 'SNES', 'N64', 'GBA', 'MegaDrive', 'PSX', 'Saturn', 'NEOGEO'];
const BOTTOM_ROW_IDS = ['MegaCD', 'S32X', 'TGFX16-CD', 'NeoGeo-CD', 'ATARI5200', 'ATARI7800', 'AtariLynx', 'WonderSwanColor'];

/**
 * The first screen, when no folder has ever been opened.
 */
export function WelcomePanel({ onOpenFolder, loading }: WelcomePanelProps): JSX.Element {
  const systems = getAllSystemsInfo();
  const systemMap = new Map(systems.map((s) => [s.id, s]));

  const middleSystems = MIDDLE_ROW_IDS.map((id) => systemMap.get(id)).filter((s): s is typeof s & {} => s !== undefined);
  const topSystems = TOP_ROW_IDS.map((id) => systemMap.get(id)).filter((s): s is typeof s & {} => s !== undefined);
  const bottomSystems = BOTTOM_ROW_IDS.map((id) => systemMap.get(id)).filter((s): s is typeof s & {} => s !== undefined);

  const assigned = new Set([...TOP_ROW_IDS, ...MIDDLE_ROW_IDS, ...BOTTOM_ROW_IDS]);
  const unassigned = systems.filter((s) => !assigned.has(s.id));
  if (unassigned.length > 0) {
    topSystems.push(...unassigned);
  }

  return (
    <div class="welcome">
      <section class="welcome-hero">
        <BrandLogo class="welcome-mark" />

        <div class="welcome-heading">
          <h2>{t('app.name')}</h2>
          <p class="welcome-tagline">{t('welcome.tagline')}</p>
        </div>

        <p class="welcome-pitch">{t('welcome.pitch')}</p>

        <button class="welcome-cta icon-label" onClick={onOpenFolder} disabled={loading}>
          <FolderPlusIcon />
          {loading ? t('welcome.opening') : t('welcome.open')}
        </button>

        <p class="welcome-hint">{t('welcome.hint')}</p>
      </section>

      <section class="welcome-section">
        <h3>{t('welcome.what.title')}</h3>
        <ul class="welcome-cards">
          {CAPABILITIES.map((capability) => {
            const Illustration = CAPABILITY_ILLUSTRATIONS[capability];
            return (
              <li key={capability} class="welcome-card">
                <div class="welcome-card-illustration">
                  <Illustration />
                </div>
                <h4>{t(`welcome.what.${capability}.title`)}</h4>
                <p>{t(`welcome.what.${capability}.body`)}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section class="welcome-section">
        <h3>{t('welcome.how.title')}</h3>
        <ol class="welcome-steps">
          {STEPS.map((step, at) => (
            <li key={step} class="welcome-step">
              <span class="welcome-step-number" aria-hidden="true">
                {at + 1}
              </span>
              <div>
                <h4>{t(`welcome.how.${step}.title`)}</h4>
                <p>{t(`welcome.how.${step}.body`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section class="welcome-section welcome-systems-section">
        <h3>{t('welcome.systems.title')}</h3>
        <p class="welcome-hint">{t('welcome.systems.hint', { count: systems.length })}</p>
        <div class="welcome-systems">
          <div class="welcome-systems-row welcome-systems-row--top">
            <ul class="welcome-systems-track">
              {[...topSystems, ...topSystems].map((system, idx) => (
                <li key={`top-${system.id}-${idx}`} class="welcome-system" title={system.fullName}>
                  <span class="welcome-system-logo">
                    <SystemLogo systemId={system.id} />
                  </span>
                  <span class="welcome-system-name">{system.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div class="welcome-systems-row welcome-systems-row--middle">
            <ul class="welcome-systems-track">
              {[...middleSystems, ...middleSystems].map((system, idx) => (
                <li key={`mid-${system.id}-${idx}`} class="welcome-system" title={system.fullName}>
                  <span class="welcome-system-logo">
                    <SystemLogo systemId={system.id} />
                  </span>
                  <span class="welcome-system-name">{system.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div class="welcome-systems-row welcome-systems-row--bottom">
            <ul class="welcome-systems-track">
              {[...bottomSystems, ...bottomSystems].map((system, idx) => (
                <li key={`bot-${system.id}-${idx}`} class="welcome-system" title={system.fullName}>
                  <span class="welcome-system-logo">
                    <SystemLogo systemId={system.id} />
                  </span>
                  <span class="welcome-system-name">{system.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section class="welcome-note">
        <h3>{t('welcome.privacy.title')}</h3>
        <p>{t('welcome.privacy.body')}</p>
      </section>

      <footer class="welcome-footer">
        <p class="welcome-footer-legal">{t('welcome.footer.legal')}</p>
        <a
          class="welcome-footer-github"
          href="https://github.com/wasm-gaming/rom-manager"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon />
          <span>{t('welcome.footer.github')}</span>
        </a>
      </footer>
    </div>
  );
}
