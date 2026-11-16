/**
 * Who serves this build. `npm run build:roms` sets `VITE_HOST=play.germade`: rom-manager is
 * then play.germade's `/roms/`, with "Play" links, a way back to the launcher, and the
 * one-time move of play.germade's old library. Any other build is rom-manager on its own.
 */
export const HOST: string | undefined = import.meta.env.VITE_HOST || undefined;

export const isPlayGermade = HOST === 'play.germade';

/** The launcher's root, same origin: rom-manager sits at `/roms/` under it. */
export const LAUNCHER_BASE = '/';
