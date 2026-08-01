export const ROOT = '';
export const DRAG_MIME = 'application/x-rom-manager-paths';

export function parentOf(path: string): string {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? ROOT : path.slice(0, separator);
}

export function nameOf(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

export function join(directory: string, name: string): string {
  return directory ? `${directory}/${name}` : name;
}

export function contains(path: string, directory: string): boolean {
  return directory === path || directory.startsWith(`${path}/`);
}

export function parseDraggedPaths(payload: string): string[] {
  const parsed = JSON.parse(payload);
  if (!Array.isArray(parsed) || parsed.some((value) => typeof value !== 'string')) {
    throw new Error('Invalid drag payload');
  }
  return parsed;
}

export function isHiddenName(name: string): boolean {
  return name.startsWith('.');
}

export function systemOfPath(path: string): string | undefined {
  const separator = path.indexOf('/');
  return separator === -1 ? (path ? path : undefined) : path.slice(0, separator);
}
