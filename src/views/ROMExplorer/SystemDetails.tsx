import { JSX } from 'preact';
import { getSystemInfo } from '@/core/system-info';
import { SystemLogo } from '@/components/SystemLogos';
import { t } from '@/services/I18nService';

interface SystemDetailsProps {
  /** Selected folder path */
  folder: string;
  wizard?: boolean;
}

export function SystemDetails({ folder, wizard = false }: SystemDetailsProps): JSX.Element {
  const info = wizard ? getSystemInfo(folder) : undefined;

  if (!info) {
    return (
      <div class="system-details generic">
        <div class="system-hero centered">
          <div class="system-logo-wrapper large">
            <SystemLogo systemId="generic" />
          </div>
          <div class="system-heading centered">
            <h2>{folder.slice(folder.lastIndexOf('/') + 1) || t('system.folder')}</h2>
            <p class="metadata-subtitle">{t('system.collection')}</p>
          </div>
        </div>
        <div class="facts">
          <div class="fact">
            <span class="fact-label">{t('system.path')}</span>
            <span class="fact-value"><code>{folder}</code></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="system-details">
      <div class="system-hero centered">
        <div class="system-logo-wrapper large" style={{ borderColor: info.accentColor }}>
          <SystemLogo systemId={info.id} />
        </div>

        <div class="system-heading centered">
          <h2>{info.name}</h2>
          <p class="system-fullname">{info.fullName}</p>

          <div class="system-meta-tags centered">
            <span
              class="tag manufacturer"
              style={{
                backgroundColor: `${info.accentColor}22`,
                color: info.accentColor,
                borderColor: `${info.accentColor}55`,
              }}
            >
              {info.manufacturer}
            </span>
            <span class="tag year">{info.releaseYear}</span>
            <span class="tag media">
              {info.media === 'disc' ? t('system.medium.disc') : t('system.medium.cartridge')}
            </span>
          </div>
        </div>
      </div>

      <div class="system-description-box">
        <h4>{t('system.about')}</h4>
        <p class="system-description">{info.description}</p>
      </div>

      <div class="system-extensions-box">
        <h4>{t('system.extensions')}</h4>
        <div class="system-extensions-list">
          {info.commonExtensions.map((ext) => (
            <span key={ext} class="extension-pill">
              <code>.{ext}</code>
            </span>
          ))}
        </div>
      </div>

      <div class="facts">
        <div class="fact">
          <span class="fact-label">{t('system.key')}</span>
          <span class="fact-value"><code>{info.id}</code></span>
        </div>
        <div class="fact">
          <span class="fact-label">{t('system.structure.label')}</span>
          <span class="fact-value">
            {info.media === 'disc'
              ? t('system.structure.disc')
              : t('system.structure.cartridge')}
          </span>
        </div>
        <div class="fact">
          <span class="fact-label">{t('system.folder')}</span>
          <span class="fact-value"><code>{folder}</code></span>
        </div>
      </div>
    </div>
  );
}
