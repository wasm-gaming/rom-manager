import { JSX } from 'preact';
import { BrandLogo } from './BrandLogo';
import { SystemLogo } from './SystemLogos';
import { FolderPlusIcon } from './icons';
import { getAllSystemsInfo } from '../core/system-info';
import { t } from '../services/I18nService';

interface WelcomePanelProps {
  onOpenFolder: () => void;
  /** True while the folder picker is up or the folder is being read. */
  loading?: boolean;
}

/** What the app is, said once, for the one screen where nothing else is. */
const CAPABILITIES = ['hash', 'grouping', 'covers', 'consolidate'] as const;

const STEPS = ['step1', 'step2', 'step3'] as const;

/**
 * The first screen, when no folder has ever been opened.
 *
 * It used to say `No folders opened`, which is a fact about the app rather than
 * an answer to the question someone opening it has: what is this, what will it
 * do to my collection, and where do my files go. So it says that instead — what
 * it does, how it goes, which Systems it knows and that nothing is uploaded —
 * with the folder picker as the one thing to press.
 *
 * The Systems are read from the catalogue rather than listed here, so the count
 * on screen cannot drift from the one the app actually supports.
 */
export function WelcomePanel({ onOpenFolder, loading }: WelcomePanelProps): JSX.Element {
  const systems = getAllSystemsInfo();

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
          {CAPABILITIES.map((capability) => (
            <li key={capability} class="welcome-card">
              <h4>{t(`welcome.what.${capability}.title`)}</h4>
              <p>{t(`welcome.what.${capability}.body`)}</p>
            </li>
          ))}
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

      <section class="welcome-section">
        <h3>{t('welcome.systems.title')}</h3>
        <p class="welcome-hint">{t('welcome.systems.hint', { count: systems.length })}</p>
        {/* Each System with its own mark: a list of folder names is a list of
            folder names, and the shapes are what someone recognises their own
            collection in. */}
        <ul class="welcome-systems">
          {systems.map((system) => (
            <li key={system.id} class="welcome-system" title={system.fullName}>
              <span class="welcome-system-logo" style={{ borderColor: `${system.accentColor}55` }}>
                <SystemLogo systemId={system.id} />
              </span>
              <span class="welcome-system-name">{system.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section class="welcome-note">
        <h3>{t('welcome.privacy.title')}</h3>
        <p>{t('welcome.privacy.body')}</p>
      </section>
    </div>
  );
}
