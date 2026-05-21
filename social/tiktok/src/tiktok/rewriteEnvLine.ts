import { readFile, writeFile, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function rewriteEnvLine(
  path: string,
  key: string,
  value: string,
): Promise<void> {
  const current = existsSync(path) ? await readFile(path, 'utf-8') : '';
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${escapeRegex(key)}=.*$`, 'm');

  let next: string;
  if (pattern.test(current)) {
    next = current.replace(pattern, line);
  } else if (current.length === 0) {
    next = `${line}\n`;
  } else if (current.endsWith('\n')) {
    next = `${current}${line}\n`;
  } else {
    next = `${current}\n${line}\n`;
  }

  const tmp = `${path}.tmp`;
  await writeFile(tmp, next, 'utf-8');
  await rename(tmp, path);
}
