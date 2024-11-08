import fs from 'node:fs';
import nodePath from 'node:path';

function isDirectory(path: string) {
  try {
    const stat = fs.statSync(path);
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
}

export default function (basePath: string) {
  const readdirResults: string[] = [];
  const pathsQueue = [basePath];
  function readdir(path: string) {
    try {
      const readdirResult = fs.readdirSync(path, { encoding: 'utf-8' });
      for (let i = 0; i < readdirResult.length; i++) {
        const resultPath = nodePath.join(path, readdirResult[i]);
        const relativeResultPath = nodePath.relative(basePath, resultPath);
        readdirResults.push(relativeResultPath);
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
