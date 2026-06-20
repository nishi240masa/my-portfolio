// GitHub Contents API 経由で JSON ファイルを読み書きする薄ラッパ
// - readJsonWithMeta: ファイル本文を JSON.parse + sha を返す（楽観ロック用）
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
