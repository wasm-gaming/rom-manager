import { JSX } from 'preact';
import { BrandLogo } from '@/components/BrandLogo';
import { GearIcon, PlusIcon } from '@/components/icons';
import { Tabs, Origin } from '@/components/Tabs';
import { REGIONS, preferRegion, type Region } from '@/core/rom-regions';
import { t } from '@/services/I18nService';

interface HeaderProps {
  onGoInitialView: () => void;
  onOpenFolder: () => void;
  originsMap: Map<string, Origin>;
  activeOriginId?: string;
  showLanding: boolean;
  onSelectOrigin: (originId: string) => void;
  onCloseOrigin: (originId: string) => void;
  regionOrder: readonly Region[];
  activeNode?: unknown;
  onRegionOrderChange: (order: readonly Region[]) => void;
  onOpenPreferences: () => void;
}

export function Header({
  onGoInitialView,
  onOpenFolder,
  originsMap,
  activeOriginId,
  showLanding,
  onSelectOrigin,
  onCloseOrigin,
  regionOrder,
  activeNode,
  onRegionOrderChange,
  onOpenPreferences,
}: HeaderProps): JSX.Element {
  return (
    <header class="explorer-header">
      <div class="header-left">
        <h1
          class="explorer-title clickable"
          onClick={onGoInitialView}
          title={t('app.name')}
        >
          <BrandLogo class="explorer-mark" />
          {t('app.name')}
        </h1>
        <button class="tab-add" onClick={onOpenFolder} title={t('tabs.add')}>
          <PlusIcon />
        </button>
      </div>

      <div class="header-right">
        <Tabs
          origins={Array.from(originsMap.values())}
          activeOriginId={showLanding ? undefined : activeOriginId}
          onSelectOrigin={onSelectOrigin}
          onClose={onCloseOrigin}
          labels={{
            reconnect: t('tabs.reconnect'),
            close: t('tabs.close'),
          }}
        />
        <div class="header-right-actions">
          <div class="header-regions" role="group" aria-label={t('header.regions.label')}>
            {REGIONS.map((region) => {
              const isPreferred = regionOrder[0] === region;
              return (
                <button
                  key={region}
                  class={`header-region ${isPreferred ? 'on' : ''}`}
                  disabled={!activeNode || showLanding}
                  aria-pressed={isPreferred}
                  title={
                    isPreferred
                      ? t('header.regions.preferred', { region })
                      : t('header.regions.prefer', { region })
                  }
                  onClick={() => onRegionOrderChange(preferRegion(regionOrder, region))}
                >
                  {region}
                </button>
              );
            })}
          </div>

          <button
            class="header-prefs"
            onClick={onOpenPreferences}
            title={t('header.preferences')}
          >
            <GearIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
