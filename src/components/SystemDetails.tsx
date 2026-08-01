import { JSX } from 'preact';
import { getSystemInfo } from '../core/system-info';
import { SystemLogo } from './SystemLogos';

interface SystemDetailsProps {
  /** Selected folder path */
  folder: string;
}

export function SystemDetails({ folder }: SystemDetailsProps): JSX.Element {
  const info = getSystemInfo(folder);

  if (!info) {
    return (
      <div class="system-details generic">
        <div class="system-hero">
          <div class="system-logo-wrapper">
            <SystemLogo systemId="generic" />
          </div>
          <div class="system-heading">
            <h2>{folder || 'Folder'}</h2>
            <p class="metadata-subtitle">Directory / Collection</p>
          </div>
        </div>
        <div class="facts">
          <div class="fact">
            <span class="fact-label">Path</span>
            <span class="fact-value"><code>{folder}</code></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="system-details">
      <div class="system-hero">
        <div class="system-logo-wrapper" style={{ borderColor: info.accentColor }}>
          <SystemLogo systemId={info.id} />
        </div>

        <div class="system-heading">
          <h2>{info.name}</h2>
          <p class="system-fullname">{info.fullName}</p>

          <div class="system-meta-tags">
            <span class="tag manufacturer" style={{ backgroundColor: `${info.accentColor}22`, color: info.accentColor, borderColor: `${info.accentColor}55` }}>
              {info.manufacturer}
            </span>
            <span class="tag year">{info.releaseYear}</span>
            <span class="tag media">{info.media === 'disc' ? 'Disc System' : 'Cartridge System'}</span>
          </div>
        </div>
      </div>

      <div class="system-description-box">
        <h4>About this system</h4>
        <p class="system-description">{info.description}</p>
      </div>

      <div class="system-extensions-box">
        <h4>Habitual File Extensions</h4>
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
          <span class="fact-label">System Key</span>
          <span class="fact-value"><code>{info.id}</code></span>
        </div>
        <div class="fact">
          <span class="fact-label">Storage Structure</span>
          <span class="fact-value">
            {info.media === 'disc'
              ? 'Game Subfolders (System/Game/Variant/...)'
              : 'Flat System Folder (System/Game.ext)'}
          </span>
        </div>
        <div class="fact">
          <span class="fact-label">Folder</span>
          <span class="fact-value"><code>{folder}</code></span>
        </div>
      </div>
    </div>
  );
}
