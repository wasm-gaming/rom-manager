/**
 * Where the phone panels stand, as a URL: `?system=GBA&game=Kirby…`. Pure, so the
 * mapping is tested apart from the component (src/views/ROMExplorer/MobilePanels.tsx).
 */

export const PANELS = ['systems', 'games', 'game'] as const;
export type Panel = (typeof PANELS)[number];

/** Where the URL says the panels stand. */
export interface PanelState {
  system?: string;
  game?: string;
}

/** `?system=GBA&game=Kirby…` → the state; anything else is the first panel. */
export function readPanelState(search: string): PanelState {
  const params = new URLSearchParams(search);
  const system = params.get('system') || undefined;
  const game = system ? params.get('game') || undefined : undefined;
  return { system, game };
}

/** The state → the query, keeping whatever other parameters the page carries. */
export function writePanelState(search: string, state: PanelState): string {
  const params = new URLSearchParams(search);
  params.delete('system');
  params.delete('game');
  if (state.system) params.set('system', state.system);
  if (state.system && state.game) params.set('game', state.game);
  const query = params.toString();
  return query ? `?${query}` : '';
}

/** The panel a state shows: the deepest one it has a choice for. */
export function panelOf(state: PanelState): Panel {
  if (state.game) return 'game';
  if (state.system) return 'games';
  return 'systems';
}
