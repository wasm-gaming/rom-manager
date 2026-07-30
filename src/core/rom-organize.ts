import type { GameGroup, GameVariant } from './rom-grouping';
import type { MatchResult } from './rom-matching';

/** Move one file from where it sits today to where the layout says it belongs. */
export interface MoveOperation {
  from: string;
  to: string;
}

/** A `game.json` to drop in a disc game folder so it reads as managed, not as a collection. */
export interface MarkerOperation {
  path: string;
  gameId: string;
  title: string;
  system: string;
}

export type ConflictReason =
  /** Two recognised files want the same name. */
  | 'duplicate-target'
  /** Something already sits there and is not going to move. */
  | 'target-taken'
  /** A group of files want each other's places. */
  | 'cycle';

export interface OrganizeConflict {
  reason: ConflictReason;
  from: string;
  to: string;
}

export interface OrganizePlan {
  /** Ordered: applying them in sequence never overwrites a file that still has to move. */
  moves: MoveOperation[];
  markers: MarkerOperation[];
  /** Files left alone because moving them was not provably safe. */
  conflicts: OrganizeConflict[];
  /** Files already in their canonical place. */
  settled: number;
}

/** `Sonic (USA).md` -> `md`. Empty when the name carries no extension. */
function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot <= 0 ? '' : name.slice(dot + 1);
}

/**
 * Where a file belongs.
 *
 * Cartridge systems are flat, one file per variant. Disc systems get a folder
 * per game and a subfolder per variant, because a release there is several
 * files that have to stay together.
 */
function targetOf(
  system: string,
  media: 'cartridge' | 'disc',
  group: GameGroup,
  variant: GameVariant,
  datName: string,
): string {
  if (media === 'disc') return `${system}/${group.id}/${variant.key}/${datName}`;

  const extension = extensionOf(datName);
  const base = `${system}/${group.id}.${variant.key}`;
  return extension ? `${base}.${extension}` : base;
}

interface Candidate {
  from: string;
  to: string;
}

/**
 * Work out what has to move for a system to follow the canonical layout.
 *
 * Only files the dataset recognised are ever touched: anything unmatched keeps
 * its place, which is what stops the manager from rearranging a collection
 * folder it does not understand.
 *
 * The plan is deliberately conservative. Every case where the outcome would
 * depend on the order operations run in, or would overwrite something, is
 * reported as a conflict instead of being resolved with a guess.
 */
export function planOrganization(
  system: string,
  media: 'cartridge' | 'disc',
  match: MatchResult,
): OrganizePlan {
  const candidates: Candidate[] = [];
  const markers: MarkerOperation[] = [];
  const conflicts: OrganizeConflict[] = [];
  const occupied = new Set(match.unmatched.map((file) => file.path));
  let settled = 0;

  for (const matched of match.groups) {
    let present = false;

    for (const matchedVariant of matched.variants) {
      for (const file of matchedVariant.files) {
        if (!file.local) continue;

        present = true;
        occupied.add(file.local.path);

        const to = targetOf(
          system,
          media,
          matched.group,
          matchedVariant.variant,
          file.entry.fileName ?? file.entry.name,
        );

        if (file.local.path === to) settled += 1;
        else candidates.push({ from: file.local.path, to });
      }
    }

    if (present && media === 'disc') {
      markers.push({
        path: `${system}/${matched.group.id}/game.json`,
        gameId: matched.group.id,
        title: matched.group.title,
        system,
      });
    }
  }

  // Two files wanting one name cannot both be right, so neither is moved. This
  // happens for real: a DAT may list two releases under one name, and the
  // grouping then reads them as one variant.
  const byTarget = new Map<string, Candidate[]>();
  for (const candidate of candidates) {
    const bucket = byTarget.get(candidate.to);
    if (bucket) bucket.push(candidate);
    else byTarget.set(candidate.to, [candidate]);
  }

  const pending: Candidate[] = [];
  for (const [to, bucket] of byTarget) {
    if (bucket.length === 1 && !isSettledTarget(to, occupied, candidates)) {
      pending.push(bucket[0]);
      continue;
    }

    const reason: ConflictReason = bucket.length > 1 ? 'duplicate-target' : 'target-taken';
    for (const candidate of bucket) conflicts.push({ reason, from: candidate.from, to: candidate.to });
  }

  const moves = order(pending, occupied, conflicts);
  return { moves, markers, conflicts, settled };
}

/** True when the target holds a file that is staying where it is. */
function isSettledTarget(to: string, occupied: Set<string>, candidates: Candidate[]): boolean {
  return occupied.has(to) && !candidates.some((candidate) => candidate.from === to);
}

/**
 * Sequence the moves so each one lands on free ground.
 *
 * Whatever cannot be sequenced is a cycle — files wanting each other's names —
 * and is reported rather than worked around with a temporary file.
 */
function order(
  pending: Candidate[],
  occupied: Set<string>,
  conflicts: OrganizeConflict[],
): MoveOperation[] {
  const moves: MoveOperation[] = [];
  let remaining = pending;

  while (remaining.length > 0) {
    const blocked: Candidate[] = [];

    for (const candidate of remaining) {
      if (occupied.has(candidate.to)) {
        blocked.push(candidate);
        continue;
      }

      occupied.delete(candidate.from);
      occupied.add(candidate.to);
      moves.push(candidate);
    }

    if (blocked.length === remaining.length) {
      for (const candidate of blocked) {
        conflicts.push({ reason: 'cycle', from: candidate.from, to: candidate.to });
      }
      break;
    }

    remaining = blocked;
  }

  return moves;
}
