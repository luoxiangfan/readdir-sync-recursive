import { statSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { cwd } from 'node:process';

function isDirectory(path: string) {
  try {
    const stat = statSync(path);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export default function (
  path: string,
  returnType?: 'absolutePath' | 'relativePath'
) {
  if (!isDirectory(path)) {
    return [];
  }
  const readdirResults: string[] = [];
  const pathsQueue = [path];
  function readdir(dirpath: string) {
    try {
      const readdirResult = readdirSync(dirpath, { encoding: 'utf-8' });
      for (let i = 0; i < readdirResult.length; i++) {
        const resultPath = join(dirpath, readdirResult[i]);
        const relativeResultPath = relative(path, resultPath);
        const absolutePath = join(cwd(), resultPath);
        const pushPath =
          returnType === 'relativePath'
            ? resultPath
            : returnType === 'absolutePath'
              ? absolutePath
              : relativeResultPath;
        readdirResults.push(pushPath);
        if (isDirectory(resultPath)) {
          pathsQueue.push(resultPath);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  for (let i = 0; i < pathsQueue.length; i++) {
    readdir(pathsQueue[i]);
  }
  return readdirResults;
}
