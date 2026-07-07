import { execSync } from 'child_process';

const GIT_REFS = ['HEAD', 'origin/main', 'main'] as const;

export function getLastUpdatedIso(): string {
  for (const ref of GIT_REFS) {
    try {
      const iso = execSync(`git log -1 --format=%cI ${ref}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();

      if (iso) {
        return iso;
      }
    } catch {
      // Try the next ref.
    }
  }

  if (process.env.NEXT_PUBLIC_LAST_UPDATED) {
    return process.env.NEXT_PUBLIC_LAST_UPDATED;
  }

  return new Date().toISOString();
}
