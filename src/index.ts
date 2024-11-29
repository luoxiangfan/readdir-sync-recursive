import fs from 'node:fs';
import nodePath from 'node:path';
import process from 'node:process';

function isDirectory(path: string) {
  try {
    const stat = fs.statSync(path);
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
      const readdirResult = fs.readdirSync(dirpath, { encoding: 'utf-8' });
      for (let i = 0; i < readdirResult.length; i++) {
        const resultPath = nodePath.join(dirpath, readdirResult[i]);
        const relativeResultPath = nodePath.relative(path, resultPath);
        const absolutePath = nodePath.join(process.cwd(), resultPath);
        let pushPath = relativeResultPath;
        returnType === 'relativePath'
          ? (pushPath = resultPath)
          : returnType === 'absolutePath'
            ? (pushPath = absolutePath)
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
