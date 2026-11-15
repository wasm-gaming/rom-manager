import { JSX, ComponentChildren } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { SystemLogo } from '@/components/SystemLogos';
import { ArrowLeftIcon } from '@/components/icons';
import { getSystemInfo } from '@/core/system-info';
import type { WizardGame, WizardNode } from '@/core/wizard-tree';
import { pickCover } from '@/core/rom-covers';
import type { Region } from '@/core/rom-regions';
import type { StorageNode } from '@/services/StorageService';
import { t } from '@/services/I18nService';
import { PANELS, panelOf, readPanelState, writePanelState, type Panel, type PanelState } from '@/core/mobile-panels';

/**
 * The phone layout: three full-screen panels side by side — systems, the games of
 * one, the game — navigated by swiping (CSS scroll snap) or by picking, which slides
 * to the next panel. Back (the browser's, or Android's gesture) walks left again:
 * every step is a history entry, `?system=…&game=…`.
 *
 * It holds no data of its own: the system folders come from the open node, the games
 * from the same grouped rows the desktop tree uses, and the game panel is whatever the
 * explorer renders for the picked game (its `RomDetails`).
 */

interface MobilePanelsProps {
  node: StorageNode;
  /** Bumped when files were written, so the systems are listed again. */
  refreshToken: number;
  /** Systems the datasets know: only those folders are libraries of games. */
  knownSystems: Set<string>;
  groupedRows: Map<string, WizardNode[]>;
  /** Asks the explorer to read a system folder into game rows (the tree's own call). */
  onGroupingNeeded: (path: string) => void;
  /** A game picked: the explorer loads it as the tree would. */
  onPickGame: (game: WizardGame | undefined) => void;
  regionOrder: readonly Region[];
  /** The game panel's content: the explorer's details for the picked game. */
  children?: ComponentChildren;
}

export function MobilePanels({
  node,
  refreshToken,
  knownSystems,
  groupedRows,
  onGroupingNeeded,
  onPickGame,
  regionOrder,
  children,
}: MobilePanelsProps): JSX.Element {
  const [state, setState] = useState<PanelState>(() => readPanelState(location.search));
  const [systems, setSystems] = useState<string[] | undefined>();
  const [current, setCurrent] = useState<Panel>(() => panelOf(readPanelState(location.search)));
  const scroller = useRef<HTMLDivElement>(null);
  const panels = useRef<Map<Panel, HTMLElement>>(new Map());

  const games: WizardGame[] = state.system
    ? (groupedRows.get(state.system) ?? []).filter((row): row is WizardGame => row.kind === 'group')
    : [];
  const game = state.game ? games.find((row) => row.id === state.game) : undefined;

  // The library's systems: its top-level folders the datasets know.
  useEffect(() => {
    let cancelled = false;
    node
      .list('')
      .then((entries) => {
        if (cancelled) return;
        setSystems(
          entries
            .filter((entry) => entry.kind === 'directory' && knownSystems.has(entry.name))
            .map((entry) => entry.name),
        );
      })
      .catch(() => !cancelled && setSystems([]));
    return () => {
      cancelled = true;
    };
  }, [node, knownSystems, refreshToken]);

  // The chosen system's games are read the way the tree reads a folder.
  useEffect(() => {
    if (state.system && !groupedRows.has(state.system)) onGroupingNeeded(state.system);
  }, [state.system, groupedRows, onGroupingNeeded]);

  // The game in the URL is loaded once its system's rows are there (or dropped when gone).
  const reportedGame = useRef<string | undefined>();
  useEffect(() => {
    const id = game?.key;
    if (id === reportedGame.current) return;
    reportedGame.current = id;
    onPickGame(game);
  }, [game, onPickGame]);

  const scrollTo = useCallback((panel: Panel, smooth = true) => {
    const target = panels.current.get(panel);
    const box = scroller.current;
    if (!target || !box) return;
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    box.scrollTo({ left: target.offsetLeft, behavior: smooth && !reduced ? 'smooth' : 'auto' });
  }, []);

  // On mount, the panel the URL points at, without an animation.
  useEffect(() => {
    scrollTo(panelOf(state), false);
  }, []);

  // Back / forward: the URL is the state.
  useEffect(() => {
    const onPop = () => {
      const next = readPanelState(location.search);
      setState(next);
      scrollTo(panelOf(next));
    };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, [scrollTo]);

  // Which panel is on screen, for the title and the dots — a swipe changes it too.
  useEffect(() => {
    const box = scroller.current;
    if (!box || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent((entry.target as HTMLElement).dataset.panel as Panel);
        }
      },
      { root: box, threshold: 0.6 },
    );
    for (const element of panels.current.values()) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /** A step forward: a history entry, then the slide. */
  const go = (next: PanelState) => {
    history.pushState(null, '', `${location.pathname}${writePanelState(location.search, next)}`);
    setState(next);
    // After the panel's content is there, so it slides onto something.
    requestAnimationFrame(() => scrollTo(panelOf(next)));
  };

  const pickSystem = (system: string) => go({ system });
  const pickGame = (row: WizardGame) => go({ system: state.system, game: row.id });

  /** A dot or the back arrow: the same as the browser's Back when it is one step. */
  const showPanel = (panel: Panel) => {
    const index = PANELS.indexOf(panel);
    if (index < PANELS.indexOf(panelOf(state))) {
      // Going left keeps the choices: swiping back and forth is browsing, not undoing.
      scrollTo(panel);
      setCurrent(panel);
      return;
    }
    scrollTo(panel);
  };

  const title =
    current === 'game'
      ? game?.title ?? t('mobile.game')
      : current === 'games'
        ? state.system
          ? (getSystemInfo(state.system)?.name ?? state.system)
          : t('mobile.games')
        : t('mobile.systems');

  const countOf = (system: string) => {
    const rows = groupedRows.get(system);
    return rows ? rows.filter((row) => row.kind === 'group').length : undefined;
  };

  const ref = (panel: Panel) => (element: HTMLElement | null) => {
    if (element) panels.current.set(panel, element);
  };

  return (
    <div class="mobile-panels-wrap">
      <nav class="mobile-panels-bar" aria-label={t('mobile.nav')}>
        {current !== 'systems' && (
          <button
            class="mobile-back"
            onClick={() => showPanel(PANELS[PANELS.indexOf(current) - 1])}
            title={t('details.back')}
          >
            <ArrowLeftIcon />
          </button>
        )}
        <h2 class="mobile-panels-title">{title}</h2>
        <div class="mobile-dots" role="tablist">
          {PANELS.map((panel) => (
            <button
              key={panel}
              role="tab"
              class={`mobile-dot ${panel === current ? 'on' : ''}`}
              aria-selected={panel === current}
              aria-label={t(`mobile.${panel}`)}
              disabled={PANELS.indexOf(panel) > PANELS.indexOf(panelOf(state))}
              onClick={() => showPanel(panel)}
            />
          ))}
        </div>
      </nav>

      <div class="mobile-panels" ref={scroller}>
        <section class="mobile-panel" data-panel="systems" ref={ref('systems')}>
          {systems === undefined ? (
            <p class="mobile-empty">{t('mobile.reading')}</p>
          ) : systems.length === 0 ? (
            <p class="mobile-empty">{t('mobile.noSystems')}</p>
          ) : (
            <ul class="mobile-list">
              {systems.map((system) => {
                const info = getSystemInfo(system);
                const count = countOf(system);
                return (
                  <li key={system}>
                    <button
                      class={`mobile-row ${state.system === system ? 'on' : ''}`}
                      onClick={() => pickSystem(system)}
                    >
                      <span class="mobile-row-logo">
                        <SystemLogo systemId={system} />
                      </span>
                      <span class="mobile-row-text">
                        <strong>{info?.name ?? system}</strong>
                        <small>
                          {info ? `${info.manufacturer} · ${info.releaseYear}` : system}
                          {count !== undefined && ` · ${t('mobile.gameCount', { count })}`}
                        </small>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section class="mobile-panel" data-panel="games" ref={ref('games')}>
          {!state.system ? (
            <p class="mobile-empty">{t('mobile.pickSystem')}</p>
          ) : !groupedRows.has(state.system) ? (
            <p class="mobile-empty">{t('mobile.reading')}</p>
          ) : games.length === 0 ? (
            <p class="mobile-empty">{t('mobile.noGames')}</p>
          ) : (
            <ul class="mobile-list">
              {games.map((row) => {
                const cover = pickCover(row.covers, { present: row.presentRegions, order: regionOrder });
                return (
                  <li key={row.key}>
                    <button
                      class={`mobile-row ${state.game === row.id ? 'on' : ''}`}
                      onClick={() => pickGame(row)}
                    >
                      <span class="mobile-row-cover">
                        {cover?.url ? <img src={cover.url} alt="" loading="lazy" /> : <span />}
                      </span>
                      <span class="mobile-row-text">
                        <strong>{row.title}</strong>
                        <small>
                          {row.presentRegions.join(' · ') || row.label}
                          {' · '}
                          {row.paths.length === 1 ? t('mobile.oneVersion') : t('mobile.versions', { count: row.paths.length })}
                        </small>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section class="mobile-panel" data-panel="game" ref={ref('game')}>
          {game ? children : <p class="mobile-empty">{t('mobile.pickGame')}</p>}
        </section>
      </div>
    </div>
  );
}
