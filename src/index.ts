import { statSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { cwd } from 'node:process';

function isDir(path: string) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

export default function (path: string, type?: 'absolutePath' | 'relativePath') {
  if (!isDir(path)) {
    return [];
  }
  const results: string[] = [];
  function readdir(dir: string) {
    try {
      const result = readdirSync(dir, { encoding: 'utf-8' });
      for (let i = 0; i < result.length; i++) {
        const rpath = join(dir, result[i]);
        const rrpath = relative(path, rpath);
        const apath = join(cwd(), rpath);
        const ppath =
          type === 'relativePath'
            ? rpath
            : type === 'absolutePath'
              ? apath
              : rrpath;
        results.push(ppath);
        if (isDir(rpath)) {
          readdir(rpath);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  readdir(path);
  return results;
}
