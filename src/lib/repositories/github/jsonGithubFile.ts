// GitHub Contents API 経由で JSON ファイルを読み書きする薄ラッパ
// - readJson: ファイル本文を JSON.parse して返す
// - writeJson: 値を整形済み JSON にして PUT し、新しい sha を返す

import { getFile, putFile } from './githubClient';

const DATA_DIR = 'data';

function dataPath(filename: string): string {
  return `${DATA_DIR}/${filename}`;
}

export interface ReadJsonResult<T> {
  data: T;
  sha: string;
}

export async function readJsonWithMeta<T>(filename: string): Promise<ReadJsonResult<T>> {
  const { content, sha } = await getFile(dataPath(filename));
  const parsed = JSON.parse(content) as T;
  return { data: parsed, sha };
}

export async function readJson<T>(filename: string): Promise<T> {
  const { data } = await readJsonWithMeta<T>(filename);
  return data;
}

export async function writeJson<T>(
  filename: string,
  value: T,
  sha: string | undefined,
  message?: string,
): Promise<string> {
  const text = JSON.stringify(value, null, 2) + '\n';
  const commitMessage = message ?? `chore(data): update ${filename}`;
  const result = await putFile(dataPath(filename), text, sha, commitMessage);
  return result.sha;
}
